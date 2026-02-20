import { NextRequest, NextResponse } from 'next/server';
import {
  logInteraction,
  getContext,
  getLearnings,
  getCategories,
  createTask,
} from '@/lib/supabase';
import { parseInput as aiParseInput } from '@/lib/ai';
import { Task } from '@/lib/types';

export const dynamic = 'force-dynamic';

// POST /api/ai/parse — parse natural language input
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, user_id, source } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'text field is required' },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id field is required' },
        { status: 400 }
      );
    }

    // Get user context, categories, and learnings
    const context = await getContext(user_id);
    const categories = await getCategories(user_id);
    const learnings = await getLearnings(user_id);

    const contextText = context?.context_text || 'No context provided.';

    // Parse the input with AI
    const parsed = await aiParseInput(text, contextText, categories, learnings);

    let result: any = {
      type: parsed.type,
      response: parsed.response,
    };

    // Handle based on type
    if (parsed.type === 'task' && parsed.task) {
      const newTask = await createTask({
        title: parsed.task.title,
        description: parsed.task.description,
        category: parsed.task.category,
        priority: parsed.task.priority,
        difficulty: parsed.task.difficulty,
        estimated_minutes: parsed.task.estimated_minutes,
        focus_required: parsed.task.focus_required,
        due_date: parsed.task.due_date,
        status: 'inbox',
        source: source || 'app_text',
        created_by: user_id,
        notes: parsed.task.blocks_description,
      } as Partial<Task>);

      result.task = newTask;

      // Log interaction
      await logInteraction({
        user_id,
        user_input: text,
        ai_action: 'create_task',
        ai_response: `Created task: ${newTask.title}`,
        tasks_affected: [newTask.id],
      });
    } else if (parsed.type === 'command' && parsed.command) {
      result.command = parsed.command;
      // Log interaction
      await logInteraction({
        user_id,
        user_input: text,
        ai_action: `command_${parsed.command.action}`,
        ai_response: parsed.response,
      });
    } else if (parsed.type === 'question') {
      // Log interaction
      await logInteraction({
        user_id,
        user_input: text,
        ai_action: 'answer_question',
        ai_response: parsed.response,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('POST /api/ai/parse error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to parse input';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
