import { NextRequest, NextResponse } from 'next/server';
import {
  getRecentInteractions,
  createLearning,
} from '@/lib/supabase';
import { extractLearnings } from '@/lib/ai';

export const dynamic = 'force-dynamic';

// POST /api/ai/learn — extract and store learnings from recent interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, limit } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id field is required' },
        { status: 400 }
      );
    }

    // Get recent interactions
    const interactions = await getRecentInteractions(user_id, limit || 20);

    if (interactions.length === 0) {
      return NextResponse.json({
        learnings: [],
        message: 'No recent interactions to learn from.',
      });
    }

    // Extract learnings
    const learnings = await extractLearnings(interactions);

    // Store learnings
    const storedLearnings = [];
    for (const learning of learnings) {
      const stored = await createLearning(user_id, learning, 'ai_extraction');
      storedLearnings.push(stored);
    }

    return NextResponse.json({
      learnings: storedLearnings,
      message: `Extracted and stored ${storedLearnings.length} learning(s).`,
      count: storedLearnings.length,
    });
  } catch (error) {
    console.error('POST /api/ai/learn error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Learning extraction failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
