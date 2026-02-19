import { NextRequest, NextResponse } from 'next/server';
import { getContext, upsertContext } from '@/lib/supabase';

// GET /api/context — get user context
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

    const context = await getContext(user_id);

    if (!context) {
      return NextResponse.json({
        context: null,
        message: 'No context found for this user.',
      });
    }

    return NextResponse.json({ context });
  } catch (error) {
    console.error('GET /api/context error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch context' },
      { status: 500 }
    );
  }
}

// PUT /api/context — update user context
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, context_text } = body;

    if (!user_id || !context_text) {
      return NextResponse.json(
        { error: 'user_id and context_text are required' },
        { status: 400 }
      );
    }

    const context = await upsertContext(user_id, context_text);

    return NextResponse.json({
      context,
      message: 'Context updated successfully!',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update context';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
