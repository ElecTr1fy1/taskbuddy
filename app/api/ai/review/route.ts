import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  getPendingTasksSummary,
  getContext,
  getLearnings,
  getTasks,
} from '@/lib/supabase';
import { Task } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const USER_ID = '823d6746-d7b4-4521-b592-d747be1917e7';

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

// POST /api/ai/review — Deep AI analysis of all tasks
export async function POST(request: NextRequest) {
  try {
    // Gather full context
    const [allPending, todayTasks, completedTasks, context, learnings] = await Promise.all([
      getPendingTasksSummary(),
      getTasks({ status: 'today' }),
      getTasks({ status: 'completed' }),
      getContext(USER_ID),
      getLearnings(USER_ID),
    ]);

    const contextText = context?.context_text || 'No context provided.';
    const learningsText = learnings.length > 0
      ? learnings.map(l => `- ${l.learning}`).join('\n')
      : 'No learnings yet.';

    // Build detailed task list
    const tasksList = allPending.map(t =>
      `- [${t.id}] "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Time: ${t.estimated_minutes || '?'}min | Focus: ${t.focus_required} | Category: ${t.category || 'general'} | Due: ${t.due_date || 'none'} | Score: ${t.smart_score || '?'} | AI Reason: ${t.ai_reason || 'none'}`
    ).join('\n');

    const recentCompleted = completedTasks.slice(0, 10).map(t =>
      `- "${t.title}" | Category: ${t.category || 'general'} | Completed: ${t.completed_at}`
    ).join('\n');

    const now = new Date();
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const systemPrompt = `You are TaskBuddy's Deep Review Engine — Daniel's strategic AI advisor. You're doing a thorough analysis of ALL pending tasks to provide actionable intelligence.

## About Daniel
${contextText}

## Recent Learnings About Daniel
${learningsText}

## Current Time
${dayOfWeek}, ${timeStr}

## All Pending Tasks (${allPending.length} total)
${tasksList}

## Recently Completed (for pattern analysis)
${recentCompleted || 'None yet.'}

## Your Analysis Mission
Perform a DEEP analysis. Don't just sort by priority — truly UNDERSTAND each task's strategic importance, dependencies, and optimal timing.

For each task, provide:
1. A brief "understanding" — what this task REALLY means for Daniel's businesses and life (1-2 sentences)
2. An AI score (1-100) based on strategic value, urgency, dependencies, and alignment with Daniel's $100M goal
3. A reason for the score adjustment

Then generate:
- INSIGHTS: 3-5 strategic patterns you notice (blind spots, time allocation issues, dependency chains, opportunities)
- DAILY PLAN: An hour-by-hour plan starting from the next reasonable hour, with task assignments and reasoning

CRITICAL: Think like a $500/hour chief of staff. Don't give generic productivity advice — give SPECIFIC, ACTIONABLE intelligence based on Daniel's actual tasks and context.

Return ONLY valid JSON (no markdown backticks):
{
  "priority_order": [
    {
      "task_id": "uuid",
      "title": "task title",
      "understanding": "What this task really means strategically...",
      "ai_score": 92,
      "previous_score": 75,
      "reason": "Why the score changed",
      "category": "category name"
    }
  ],
  "insights": [
    {
      "emoji": "⏱️",
      "title": "Insight title",
      "body": "Detailed insight explanation with specific recommendations"
    }
  ],
  "daily_plan": [
    {
      "time": "9:00 AM",
      "task_id": "uuid or null for breaks",
      "task_title": "task title",
      "duration_minutes": 30,
      "reason": "Why this task at this time"
    }
  ],
  "summary": "One-line executive summary of the review"
}`;

    const response = await getClient().messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Please perform a deep review of all my ${allPending.length} pending tasks. Today is ${dayOfWeek} and it's currently ${timeStr}. Give me your strategic analysis, reordered priorities, key insights, and an optimal plan for today.`,
        },
      ],
    });

    const rawContent = (response.content[0] as { type: string; text: string }).text;

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        return NextResponse.json({ error: 'Failed to parse AI review response' }, { status: 500 });
      }
    }

    return NextResponse.json({
      review: parsed,
      task_count: allPending.length,
      reviewed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Review error:', error);
    return NextResponse.json({ error: 'Failed to run AI review' }, { status: 500 });
  }
}
