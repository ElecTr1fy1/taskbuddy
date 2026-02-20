import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/supabase';
import { TaskFilters, Task } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/tasks — list tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters: TaskFilters = {
      status: (searchParams.get('status') as any) || undefined,
      category: searchParams.get('category') || undefined,
      priority: (searchParams.get('priority') as any) || undefined,
      search: searchParams.get('search') || undefined,
      sort_by: (searchParams.get('sort_by') as any) || 'created_at',
      sort_dir: (searchParams.get('sort_dir') as any) || 'desc',
      focus: (searchParams.get('focus') as any) || undefined,
    };

    const timeMax = searchParams.get('time_max');
    if (timeMax) {
      filters.time_max = parseInt(timeMax);
    }

    const tasks = await getTasks(filters);
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error('GET /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks — create a new task from structured data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    const task = await createTask({
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority,
      difficulty: body.difficulty,
      estimated_minutes: body.estimated_minutes,
      focus_required: body.focus_required,
      due_date: body.due_date,
      status: body.status || 'inbox',
      source: body.source || 'app_text',
      created_by: body.created_by,
      notes: body.notes,
    } as Partial<Task>);

    return NextResponse.json(
      {
        task,
        message: `Task "${task.title}" created!`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
