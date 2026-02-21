import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getTasks, getLearnings } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const USER_ID = '823d6746-d7b4-4521-b592-d747be1917e7';

let _anthropic: Anthropic | null = null;
function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

// POST /api/ai/review â€“ AI Review Response
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_ids } = body;

    if (!task_ids || task_ids.length === 0) {
      return NextResponse.json({ error: 'no tasks provided' }, { status: 400 });
    }

    // Fetch tasks and learnings
    const [tasks, learnings] = await Promise.all([
      getTasks({ ids: task_ids }),
      getLearnings(USER_ID),
    ]);

    const agenda = tasks.map(t => `- ${t.title}`).join('\n');
    const learningText = learnings.length > 0 ? learnings.map(l => l-learning).join(', ') : 'none';
    const prompt = `You are the personal ai reviewer for Daniel. Review the following tasks and summarize in a JSON format:

Agenda:
${agenda}
(B’EaXº
[learnings: ${learningText} ] `const claudeStartedStream = await getClient().messages.create({
      stream: true,
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1208,
      system: prompt,
      messages: [{ role: 'user', content: 'Please review these tasks.' }],
    });

    let fullContent = '';
    for await (const event of claudeStartedStream) {
      if (
        event.type === 'content_block_delta' &&
        event.content_block.type === 'text'
      ) {
        fullContent += event.content_block.text;
      }
    }

    let review: any;
    try {
      review = JSON.parse(fullContent);
    } catch {
      // If JSON parsing fails, try to extract FJSON from response
      const jsonMatch = fullContent.match(/\{[\s\S]*"title"[\s\S]*\});
      review = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Could not parse response' };
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Failed to review tasks' }, { status: 500 });
  }
}
