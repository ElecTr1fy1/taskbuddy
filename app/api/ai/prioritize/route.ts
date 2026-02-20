import { NextRequest, NextResponse } from 'next/server';
import {
  getTasks,
  getContext,
  getLearnings,
  updateTask,
  logInteraction,
} from '@/lib/supabase';
import { prioritizeTasks } from '@/lib/ai';

export const dynamic = 'force-dynamic';

// POST /api/ai/prioritize — prioritize today's tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, available_minutes, focus_level } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id field is required' },
        { status: 400 }
      );
    }

    // Get today's active tasks
    const tasks = await getTasks({
      status: 'today',
    });

    if (tasks.length === 0) {
      return NextResponse.json({
        tasks: [],
        removed_from_today: [],
        confirmation: 'No tasks to prioritize.',
      });
    }

    // Get user context and learnings
    const context = await getContext(user_id);
    const learnings = await getLearnings(user_id);

    const contextText = context?.context_text || 'No context provided.';

    // Prioritize with AI
    const prioritized = await prioritizeTasks(tasks, contextText, learnings, {
      available_minutes,
      focus_level,
    });

    // Update task records with new scores and positions
    for (const task of prioritized.tasks) {
      await updateTask(task.id, {
        smart_score: task.smart_score,
        score_breakdown: task.score_breakdown,
        position_today: task.position,
        is_do_now: task.is_do_now,
        ai_reason: task.ai_reason,
      });
    }

    // If there are tasks to remove from today, update them
    if (prioritized.removed_from_today.length > 0) {
      for (const taskId of prioritized.removed_from_today) {
        await updateTask(taskId, { status: 'inbox' });
      }
    }

    // Log interaction
    await logInteraction({
      user_id,
      user_input: `Prioritize ${tasks.length} tasks`,
      ai_action: 'prioritize_tasks',
      ai_response: prioritized.confirmation,
      tasks_affected: prioritized.tasks.map(t => t.id),
    });

    return NextResponse.json(prioritized);
  } catch (error) {
    console.error('POST /api/ai/prioritize error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Prioritization failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
