import { NextRequest, NextResponse } from 'next/server';
import { getPendingTasksSummary } from '@/lib/supabase';
import { chatWithAssistant } from '@/lib/ai';

// POST /api/chat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversation_history } = body;

    if (!message) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const tasks = await getPendingTasksSummary();
    const response = await chatWithAssistant(message, tasks, conversation_history || []);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to chat' }, { status: 500 });
  }
}
