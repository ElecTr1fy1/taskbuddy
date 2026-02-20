import { NextRequest, NextResponse } from 'next/server';
import { bulkUpdateStatus } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// PATCH /api/tasks/bulk — bulk update task status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, status } = body;

    if (!Array.isArray(ids) || !status) {
      return NextResponse.json(
        { error: 'ids array and status string are required' },
        { status: 400 }
      );
    }

    const tasks = await bulkUpdateStatus(ids, status);

    return NextResponse.json({
      tasks,
      message: `Updated ${tasks.length} tasks to "${status}"`,
      count: tasks.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Bulk update failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
