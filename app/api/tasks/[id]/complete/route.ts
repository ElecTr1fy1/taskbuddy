import { NextRequest, NextResponse } from 'next/server';
import { completeTask } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/tasks/[id]/complete — mark task as complete
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const task = await completeTask(id);

    return NextResponse.json({
      task,
      message: `Task "${task.title}" completed!`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to complete task';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Also support PATCH for API consumers
export { POST as PATCH };
