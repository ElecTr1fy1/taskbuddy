import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getPendingTasksSummary,
  getContext,
  getLearnings,
  getCategories,
  createTask,
  getTasks,
  updateTask,
  completeTask,
  bulkUpdateStatus,
  logInteraction,
} from '@/lib/supabase';
import { prioritizeTasks } from 'A/lib/ai';
import { Task } from 'A/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const USER_ID = '823d6746-d7b4-4521-b592-d747be1917e7';

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

// POST /api/chat — Action-aware AI chat router
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversation_history } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    // Gather all context
    const [tasks, context, learnings, categories] = await Promise.all([
      getPendingTasksSummary(),
      getContext(USER_ID),
      getLearnings(USER_ID),
      getCategories(USER_ID),
    ]);

    const contextText = context?.context_text || 'No context provided.';
    const categoryList = categories.map(c => c.name).join(', ') || 'Tanaor, eCom Academy, Content, Investments, Personal, New Venture';
    const learningsText = learnings.length > 0
      ? learnings.map(l => `- ${l.learning}`).join('\n')
      : 'No learnings yet.';

    const tasksList = tasks.length > 0
      ? tasks.map(t =>
          `- [${t.id}] "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Time: ${t.estimated_minutes || '?'}min | Category: ${t.category || 'general'} | Score: ${t.smart_score || '?'}`
        ).join('\n')
      : 'No pending tasks.';

    const systemPrompt = `You are TaskBuddy, Daniel's AI task manager and personal chief of staff. You don't just chat — you TAKE ACTION.

## About Daniel
${contextText}

## Current Tasks
${tasksList}

## Available Categories
${categoryList}

## Learnings About Daniel
${learningsText}

## Your Job
When Daniel messages you, analyze what he needs and respond with BOTH a friendly message AND any actions to execute.

CRITICAL RULES:
1. If he mentions ANY task, activity, or thing he needs to do → CREATE IT as a task. Even casual mentions like "I need to call Noa" or "gotta review Q3 numbers" are tasks.
2. If he talks about priorities changing, focus shifting, or what matters most → REPRIORITIZE all today's tasks.
3. If he gives a "brain dump" (multiple items) → CREATE MULTIPLE TASKS, one for each item.
4. If he asks to complete/finish/done a task → COMPLETE IT.
5. If he asks to move/reschedule tasks → RESCHEDULE them.
6. If he just asks a question or wants advice → respond conversationally with NO actions.

For task creation, infer:
- category: from context (jewelry/Noa/sister = Tanaor, courses/students = eCom Academy, etc.)
- priority: from urgency cues (default "medium", urgent/asap/critical = "high"/"critical")
- estimated_minutes: from task complexity (quick call = 15, email = 10, meeting = 30, deep work = 60-120)
- focus_required: from type (emails/admin = "low", reviews = "medium", writing/strategy = "high")

You MUST respond with valid JSON only (no markdown backticks, no extra text). Format:
{
  "response": "Your friendly message to Daniel",
  "actions": [
    {
      "type": "create_task",
      "data": {
        "title": "Task title",
        "category": "Category name or null",
        "priority": "low|medium|high|critical",
        "estimated_minutes": number or null,
        "difficulty": "easy|medium|hard",
        "focus_required": "low|medium|high",
        "description": "Optional description",
        "due_date": "YYYY-MM-DD or null"
      }
    },
    {
      "type": "reprioritize",
      "data": { "reason": "Why reprioritizing" }
    },
    {
      "type": "complete_task",
      "data": { "task_id": "uuid", "title": "for confirmation" }
    },
    {
      "type": "reschedule",
      "data": { "task_ids": ["uuid"], "new_status": "inbox|today|archived" }
    }
  ]
}

If no actions needed (pure conversation), use: "actions": []

Be warm, concise, and action-oriented. You're not just a chatbot — you're a doer.`;

    // Build messages
    const messages = [
      ...(conversation_history || []).map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Call Claude
    const aiResponse = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages,
    });

    const rawContent = (aiResponse.content[0] as { type: string; text: string }).text;

    // Parse the structured response
    let parsed: { response: string; actions: any[] };
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      // Try extracting JSON from response
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        // Fallback: treat as pure conversation
        parsed = { response: rawContent, actions: [] };
      }
    }

    // Execute actions
    const actionsTaken: any[] = [];

    for (const action of (parsed.actions || [])) {
      try {
        switch (action.type) {
          case 'create_task': {
            const taskData = action.data;
            const newTask = await createTask({
              title: taskData.title,
              description: taskData.description || null,
              category: taskData.category || null,
              priority: taskData.priority || 'medium',
              difficulty: taskData.difficulty || 'medium',
              estimated_minutes: taskData.estimated_minutes || null,
              focus_required: taskData.focus_required || 'medium',
              due_date: taskData.due_date || null,
              status: 'today',
              source: 'app_text',
              created_by: USER_ID,
            } as Partial<Task>);

            actionsTaken.push({
              type: 'task_created',
              task: {
                id: newTask.id,
                title: newTask.title,
                category: newTask.category,
                priority: newTask.priority,
                estimated_minutes: newTask.estimated_minutes,
              },
            });

            // Log interaction
            await logInteraction({
              user_id: USER_ID,
              user_input: message,
              ai_action: 'create_task',
              ai_response: `Created task: ${newTask.title}`,
              tasks_affected: [newTask.id],
            });
            break;
          }

          case 'reprioritize': {
            const todayTasks = await getTasks({ status: 'today' });
            if (todayTasks.length > 0) {
              const prioritized = await prioritizeTasks(
                todayTasks,
                contextText,
                learnings
              );
              for (const pt of prioritized.tasks) {
                await updateTask(pt.id, {
                  smart_score: pt.smart_score,
                  score_breakdown: pt.score_breakdown,
                  position_today: pt.position,
                  is_do_now: pt.is_do_now,
                  ai_reason: pt.ai_reason,
                });
              }
              actionsTaken.push({
                type: 'reprioritized',
                task_count: todayTasks.length,
                new_do_now: prioritized.tasks.find(t => t.is_do_now)?.id || null,
              });

              await logInteraction({
                user_id: USER_ID,
                user_input: message,
                ai_action: 'reprioritize',
                ai_response: prioritized.confirmation,
                tasks_affected: prioritized.tasks.map(t => t.id),
              });
            }
            break;
          }

          case 'complete_task': {
            if (action.data?.task_id) {
              await completeTask(action.data.task_id);
              actionsTaken.push({
                type: 'task_completed',
                task_id: action.data.task_id,
                title: action.data.title,
              });
            }
            break;
          }

          case 'reschedule': {
            if (action.data?.task_ids?.length > 0) {
              await bulkUpdateStatus(action.data.task_ids, action.data.new_status || 'inbox');
              actionsTaken.push({
                type: 'tasks_rescheduled',
                task_ids: action.data.task_ids,
                new_status: action.data.new_status,
              });
            }
            break;
          }
        }
      } catch (actionError) {
        console.error(`Action ${action.type} failed:`, actionError);
        actionsTaken.push({
          type: 'error',
          action_type: action.type,
          error: actionError instanceof Error ? actionError.message : 'Action failed',
        });
      }
    }

    // After creating tasks, auto-reprioritize if we created any
    const createdTasks = actionsTaken.filter(a => a.type === 'task_created');
    const alreadyReprioritized = actionsTaken.some(a => a.type === 'reprioritized');

    if (createdTasks.length > 0 && !alreadyReprioritized) {
      try {
        const todayTasks = await getTasks({ status: 'today' });
        if (todayTasks.length > 1) {
          const prioritized = await prioritizeTasks(todayTasks, contextText, learnings);
          for (const pt of prioritized.tasks) {
            await updateTask(pt.id, {
              smart_score: pt.smart_score,
              score_breakdown: pt.score_breakdown,
              position_today: pt.position,
              is_do_now: pt.is_do_now,
              ai_reason: pt.ai_reason,
            });
          }
          actionsTaken.push({
            type: 'auto_reprioritized',
            task_count: todayTasks.length,
          });
        }
      } catch (e) {
        console.error('Auto-reprioritize after create failed:', e);
      }
    }

    return NextResponse.json({
      response: parsed.response,
      actions_taken: actionsTaken,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to chat' }, { status: 500 });
  }
}
