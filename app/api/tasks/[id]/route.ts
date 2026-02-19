import { NextRequest, NextResponse } from 'next/server';
import { getTask, updateTask, softDeleteTask } from '@/lib/supabase';
import { Task } from '@/lib/types';

// GET /api/tasks/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await getTask(id);

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('GET /api/tasks/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] — update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const task = await updateTask(id, body as Partial<Task>);

    return NextResponse.json({
      task,
      message: `Task "${task.title}" updated!`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] — soft delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await softDeleteTask(id);

    return NextResponse.json({
      message: `Task "${task.title}" deleted!`,
      task,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
