import { NextRequest, NextResponse } from 'next/server';
import { handleTelegramUpdate } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

// POST /api/telegram/webhook — Telegram sends updates here
export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    await handleTelegramUpdate(update);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    // Always return 200 to Telegram to avoid retries
    return NextResponse.json({ ok: true });
  }
}

// GET — for webhook verification
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook is active' });
}
