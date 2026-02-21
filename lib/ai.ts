import Anthropic from '@anthropic-ai/sdk';
import {
  ParsedTask,
  ParseResponse,
  ParseCommand,
  PrioritizeResponse,
  PrioritizedTask,
  Task,
  Category,
  AILearning,
  AIInteraction,
} from './types';

let _anthropic: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _anthropic;
}

const MODEL = 'claude-sonnet-4-20250514';

// ─── Parse natural language input ────────────────────────────

export async function parseInput(
  text: string,
  userContext: string,
  categories: Category[],
  learnings: AILearning[]
): Promise<ParseResponse> {
  const categoryList = categories.map(c => c.name).join(', ') || 'None';
  const learningsText = learnings.length > 0
    ? learnings.map(l => `- ${l.learning}`).join('\n')
    : 'No learnings yet.';

  const systemPrompt = `You are a task parsing assistant. You receive raw text input and the user's personal context.

Determine if the input is:
A) A new task to add — extract: title, category, estimated_minutes, difficulty, focus_required, priority, due_date (if mentioned)
B) A command to modify the task list — determine: what action to take (reshuffle, filter by focus/time, move tasks, etc.)
C) A question — generate a helpful response

For new tasks:
- Infer category from context (e.g., anything about jewelry/Noa/sister = "Tanaor", anything about courses/students/academy = "eCom Academy")
- If you cannot confidently estimate time, set estimated_minutes to null and set needs_time_input to true
- Default priority to "medium" unless urgency is implied
- Infer focus level from task type (writing/strategy = high, emails/reviews = medium, admin/quick replies = low)
- If the input mentions that something is blocking or someone is waiting, capture it in the "blocks" field

Available categories: ${categoryList}
User context:
${userContext}

Recent learnings about the user:
${learningsText}

Return JSON:
{
  "type": "task" | "command" | "question",
  "task": { title, category, estimated_minutes, difficulty, focus_required, priority, due_date, needs_time_input, blocks_description, description },
  "command": { action, parameters },
  "response": "confirmation message to show user"
}`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: text,
      },
    ],
  });

  const content = (response.content[0] as { type: string; text: string }).text;

  try {
    let parsed = JSON.parse(content);
    return parsed as ParseResponse;
  } catch {
    // Try extracting JSON from markdown
    const match = content.match(/m{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return parsed as ParseResponse;
    }
    // Fallback: treat as a task
    return {
      type: 'task',
      task: {
        title: text.slice(0, 100),
        category: null,
        estimated_minutes: null,
        difficulty: 'medium',
        focus_required: 'medium',
        priority: 'medium',
        due_date: null,
        needs_time_input: true,
        blocks_description: null,
        description: text,
      },
      response: 'I created a task from your input. Can you tell me how long it will take?',
    };
  }
}

// ─── Prioritize tasks ────────────────────────────────────────

export async function prioritizeTasks(
  tasks: Task[],
  userContext: string,
  learnings: AILearning[],
  constraints?: { available_minutes?: number; focus_level?: string }
): Promise<PrioritizeResponse> {
  const tasksList = tasks
    .map(
      t =>
        `- [${t.id}] "${t.title}" | Priority: ${t.priority} | Time: ${t.estimated_minutes || '?'}min | Focus: ${t.focus_required} | Due: ${t.due_date || 'none'} | Category: ${t.category || 'general'}`
    )
    .join('\n');

  const systemPrompt = `You are Daniel's personal task prioritization engine. You use a Smart Scoring system to rank tasks.

For EVERY task, compute a Smart Score (1-100) based on:

IMPACT (40%): How much does this move the needle?
- Revenue-driving tasks score highest
- Tasks that unblock other people/processes get a multiplier
- Align with stated priorities: eCom Academy > Content > New Venture > Tanaor > Investments
- Overdue or due-today = automatic impact boost
- Consider: what's the cost of NOT doing this?

CONFIDENCE (30%): How certain is the outcome?
- Clearly defined tasks with known outcomes score high
- Speculative/exploratory tasks score lower
- External dependencies lower confidence

EASE (30%): How efficient is this task relative to its impact?
- High impact + low time = excellent ease score
- Factor in current constraints (user's focus level, available time)
- Batching similar tasks = ease bonus

Then apply CRITICAL PATH analysis:
- BLOCKERS FIRST: If task X blocks other tasks or people, multiply its score by 1.5x
- LONG-LEAD ITEMS: If a task takes 2+ hours and has downstream dependencies, prioritize starting it early
- QUICK UNLOCKERS: If a short task (<15 min) unblocks significant downstream work, multiply score by 2x
- SEQUENCE: Order tasks to maximize total throughput, not just individual importance

For the DO NOW task, the ai_reason should explain WHY in business terms.

User context:
${userContext}

Recent learnings:
${learnings.map(l => `- ${l.learning}`).join('\n')}

${constraints?.available_minutes ? `Available time: ${constraints.available_minutes} minutes` : ''}
${constraints?.focus_level ? `Current focus level: ${constraints.focus_level}` : ''}

Return ONLY valid JSON (no markdown backticks):
{
  "tasks": [
    { "id": "...", "position": 1, "is_do_now": true, "ai_reason": "...", "smart_score": 92, "score_breakdown": { "impact": 95, "confidence": 90, "ease": 88 } },
    ...
  ],
  "removed_from_today": ["id1", "id2"],
  "confirmation": "Reshuffled message"
}`;

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `Here are today's tasks:\n\n${tasksList}\n\nPlease prioritize them.`,
      },
    ],
  });

  const content = (response.content[0] as { type: string; text: string }).text;

  try {
    let parsed = JSON.parse(content);
    return parsed as PrioritizeResponse;
  } catch {
    // Try extracting JSON
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return parsed as PrioritizeResponse;
    }
    // Fallback: simple sort by priority
    const sorted = tasks.map((t, i) => ({
      id: t.id,
      position: i + 1,
      is_do_now: i === 0,
      ai_reason: 'Sorted by priority',
      smart_score: 50,
      score_breakdown: { impact: 50, confidence: 50, ease: 50 },
    }));
    return {
      tasks: sorted,
      removed_from_today: [],
      confirmation: 'Tasks sorted by priority.',
    };
  }
}

// ─── Extract learnings from interactions ──────────────────────

export async function extractLearnings(
  interactions: AIInteraction[]
): Promise<string[]> {
  if (interactions.length === 0) return [];

  const interactionText = interactions
    .map(
      i =>
        `Input: ${i.user_input || 'N/A'}\nAction: ${i.ai_action || 'N/A'}\nResponse: ${i.ai_response || 'N/A'}`
    )
    .join('\n\n');

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You are an AI learning system. Analyze recent user interactions and extract 3-5 reusable patterns or insights about their work habits, preferences, and productivity patterns. Return ONLY a JSON array of learning strings, like:
["Pattern 1: ...", "Pattern 2: ...", ...]`,
    messages: [
      {
        role: 'user',
        content: `Analyze these recent interactions and extract learnings:\n\n${interactionText}`,
      },
    ],
  });

  const content = (response.content[0] as { type: string; text: string }).text;

  try {
    let parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  }
}

// ─── Legacy compatibility: Recommend tasks ─────────────────────

export async function recommendTasks(
  tasks: Task[],
  availableMinutes: number,
  energy: string,
  context?: string
): Promise<{
  message: string;
  recommended: Task[];
  time_plan: string[];
  reasoning: string;
}> {
  if (tasks.length === 0) {
    return {
      message: "You have no pending tasks! Enjoy your free time.",
      recommended: [],
      time_plan: [],
      reasoning: 'No pending tasks.',
    };
  }

  const taskSummary = tasks
    .map(
      t =>
        `[ID:${t.id.slice(0, 8)}] "${t.title}" - Priority:${t.priority}, Effort:${t.estimated_minutes || '?'}min, Focus:${t.focus_required}`
    )
    .join('\n');

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You're a productivity coach. The user has ${availableMinutes} minutes and energy level "${energy}".
${context ? `Additional context: ${context}` : ''}

Pending tasks:
${taskSummary}

Recommend the best tasks to do NOW.

Return ONLY JSON: {"message": "friendly summary", "recommended_ids": ["id1", "id2"], "time_plan": ["0-15min: Task A"], "reasoning": "brief explanation"}`,
      },
    ],
  });

  const content = (response.content[0] as { type: string; text: string }).text;

  try {
    let parsed = JSON.parse(content);
    const recommendedIds: string[] = parsed.recommended_ids || [];
    const recommended = tasks.filter(t =>
      recommendedIds.some(id => t.id.startsWith(id))
    );

    return {
      message: parsed.message || 'Here are my recommendations:',
      recommended,
      time_plan: parsed.time_plan || [],
      reasoning: parsed.reasoning || '',
    };
  } catch {
    // Fallback: just return highest priority tasks that fit
    const sorted = [...tasks].sort((a, b) => {
      const aPriority = { critical: 1, high: 2, medium: 3, low: 4 }[a.priority || 'medium'] || 3;
      const bPriority = { critical: 1, high: 2, medium: 3, low: 4 }[b.priority || 'medium'] || 3;
      return aPriority - bPriority;
    });
    let totalTime = 0;
    const recommended: Task[] = [];
    for (const t of sorted) {
      const effort = t.estimated_minutes || 15;
      if (totalTime + effort <= availableMinutes) {
        recommended.push(t);
        totalTime += effort;
      }
    }
    return {
      message: `Here are ${recommended.length} tasks that fit your ${availableMinutes}-minute window:`,
      recommended,
      time_plan: recommended.map(t => `${t.estimated_minutes || 15}min: ${t.title}`),
      reasoning: 'Selected by priority and time fit.',
    };
  }
}

// ─── Legacy compatibility: Chat with assistant ────────────────

export async function chatWithAssistant(
  message: string,
  tasks: Task[],
  conversationHistory: { role: string; content: string }[] = []
): Promise<string> {
  const taskContext = tasks.length > 0
    ? `Current pending tasks:\n${tasks.map(t =>
        `- "${t.title}" (Priority:${t.priority}, Effort:${t.estimated_minutes || '?'}min)`
      ).join('\n')}`
    : 'No pending tasks.';

  const messages = [
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
  ];

  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: `You are TaskBuddy, a super friendly and encouraging productivity assistant. You help manage tasks, suggest priorities, and keep the user motivated. Be warm and keep responses concise.\n\n${taskContext}`,
    messages,
  });

  return (response.content[0] as { type: string; text: string }).text;
}
