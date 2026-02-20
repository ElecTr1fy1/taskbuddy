import { NextRequest, NextResponse } from 'next/server';
import { getLearnings, deleteLearning } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/learnings — get all active learnings for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id query parameter is required' },
        { status: 400 }
      );
    }

    const learnings = await getLearnings(user_id);

    return NextResponse.json({
      learnings,
      count: learnings.length,
    });
  } catch (error) {
    console.error('GET /api/learnings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch learnings' },
      { status: 500 }
    );
  }
}

// DELETE /api/learnings — delete a learning by id
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id query parameter is required' },
        { status: 400 }
      );
    }

    await deleteLearning(id);

    return NextResponse.json({
      message: 'Learning deleted successfully!',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete learning';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
