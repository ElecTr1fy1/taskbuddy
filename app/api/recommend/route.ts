import { NextRequest, NextResponse } from 'next/server';
import { getPendingTasksSummary } from '@/lib/supabase';
import { recommendTasks } from '@/lib/ai';

// POST /api/recommend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { available_minutes, energy, context } = body;

    if (!available_minutes || !energy) {
      return NextResponse.json(
        { error: 'available_minutes and energy are required' },
        { status: 400 }
      );
    }

    const tasks = await getPendingTasksSummary();
    const result = await recommendTasks(tasks, available_minutes, energy, context);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Recommend error:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
