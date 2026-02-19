import { Task, ParseResponse, AIInteraction } from './types';
import {
  getTasks,
  getCategories,
  getLearnings,
  createTask,
  completeTask,
  getRecentInteractions,
  logInteraction,
  getContext,
} from './supabase';
import { parseInput } from './ai';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const ALLOWED_USERS = (process.env.ALLOWED_TELEGRAM_USERS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const CELEBRATIONS = [
  'Crushed it! 💪🔥',
  'Another one bites the dust! ✅🎉',
  "You're on fire today! 🌟",
  'Boom! Task destroyed! 💥',
  'Look at you being productive! 🚀',
  "That's how it's done! 🏆",
  'One step closer to world domination! 😎',
  'Checked off like a boss! 👑',
];

// ─── Telegram API helpers ────────────────────────────────────

async function sendMessage(chatId: number, text: string, options?: {
  reply_markup?: unknown;
  parse_mode?: string;
}) {
  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: options?.parse_mode || 'HTML',
      reply_markup: options?.reply_markup,
    }),
  });
}

async function answerCallback(callbackQueryId: string, text?: string) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text: text || '',
    }),
  });
}

// ─── Message routing ─────────────────────────────────────────

function isDoneMessage(text: string): boolean {
  const patterns = [
    /^done\b/i, /^finished\b/i, /^completed?\b/i, /^did\b/i,
    /^checked off\b/i, /^✅/, /^☑/,
    /i('ve| have)?\s*(done|finished|completed)/i,
  ];
  return patterns.some(p => p.test(text));
}

function isRecommendMessage(text: string): boolean {
  const patterns = [
    /i have \d+\s*(min|hour)/i,
    /what should i (do|work on)/i,
    /recommend/i,
    /suggest/i,
    /free time/i,
    /\d+\s*min(utes?)?\s*(free|available)/i,
  ];
  return patterns.some(p => p.test(text));
}

// ─── Handle incoming updates ─────────────────────────────────

export async function handleTelegramUpdate(update: Record<string, unknown>) {
  // Handle callback queries (inline button presses)
  if (update.callback_query) {
    await handleCallback(update.callback_query as Record<string, unknown>);
    return;
  }

  const message = update.message as Record<string, unknown> | undefined;
  if (!message) return;

  const chat = message.chat as Record<string, unknown>;
  const chatId = chat.id as number;
  const from = message.from as Record<string, unknown>;
  const userId = String(from.id);

  // Auth check
  if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(userId)) {
    await sendMessage(chatId, "Sorry, you're not authorized to use this bot.");
    return;
  }

  const text = (message.text as string || '').trim();

  // Handle commands
  if (text.startsWith('/')) {
    await handleCommand(chatId, text, userId);
    return;
  }

  // Handle voice messages
  if (message.voice) {
    await sendMessage(chatId, "🎤 Voice notes aren't supported in this version yet. Please type your task instead!");
    return;
  }

  // Smart routing
  if (isDoneMessage(text)) {
    await handleDoneMessage(chatId, text, userId);
  } else if (isRecommendMessage(text)) {
    await handleRecommendMessage(chatId, text, userId);
  } else {
    await handleTaskCreation(chatId, text, userId);
  }
}

// ─── Command handlers ────────────────────────────────────────

async function handleCommand(chatId: number, text: string, userId: string) {
  const cmd = text.split(' ')[0].toLowerCase().replace('@', '');

  switch (cmd) {
    case '/start':
      await sendMessage(chatId, `👋 <b>Welcome to TaskBuddy!</b>

I'm your AI-powered productivity assistant. Here's what I can do:

📝 <b>Add tasks</b> — Just tell me naturally!
  "Call lawyer about contract, 5 min, urgent for tomorrow"
  "Buy groceries, clean house, and pay bills"

✅ <b>Complete tasks</b> — Say "done with [task]" or use /done
📊 <b>Get recommendations</b> — "I have 30 minutes and low energy"
📋 <b>View tasks</b> — /tasks
📈 <b>Stats</b> — /stats
📦 <b>Archive</b> — /archive

Just message me like you would a friend! 🤝`);
      break;

    case '/tasks':
      await handleTasksList(chatId, userId);
      break;

    case '/done':
      await handleDoneCommand(chatId, userId);
      break;

    case '/stats':
      await handleStatsCommand(chatId, userId);
      break;

    case '/archive':
      await handleArchiveCommand(chatId, userId);
      break;

    default:
      await sendMessage(chatId, "Unknown command. Try /start for help!");
  }
}

async function handleTasksList(chatId: number, userId: string) {
  const tasks = await getTasks({ status: 'today' });
  if (tasks.length === 0) {
    await sendMessage(chatId, "✨ No tasks for today! You're all set!");
    return;
  }

  const priorityIcons: Record<string, string> = {
    critical: '🔴', high: '🟠', medium: '🟡', low: '🟢',
  };

  const lines = tasks.slice(0, 15).map((t, i) => {
    const icon = priorityIcons[t.priority || 'medium'] || '🟡';
    const effort = t.estimated_minutes ? ` (${t.estimated_minutes}min)` : '';
    const due = t.due_date ? ` 📅 ${new Date(t.due_date).toLocaleDateString()}` : '';
    return `${icon} <b>${i + 1}.</b> ${t.title}${effort}${due}`;
  });

  await sendMessage(chatId, `📋 <b>Your Tasks (${tasks.length})</b>\n\n${lines.join('\n')}`);
}

async function handleDoneCommand(chatId: number, userId: string) {
  const tasks = await getTasks({ status: 'today' });
  if (tasks.length === 0) {
    await sendMessage(chatId, "No pending tasks to complete! 🎉");
    return;
  }

  const keyboard = tasks.slice(0, 10).map((t, i) => ([{
    text: `${i + 1}. ${t.title.slice(0, 30)}`,
    callback_data: `done:${t.id}`,
  }]));

  await sendMessage(chatId, "Which task did you complete?", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleStatsCommand(chatId: number, userId: string) {
  const allTasks = await getTasks({});
  const completedToday = allTasks.filter(
    t => t.status === 'completed' && t.completed_at && new Date(t.completed_at).toDateString() === new Date().toDateString()
  ).length;
  const pendingCount = allTasks.filter(t => t.status === 'today' || t.status === 'inbox').length;
  const totalCompleted = allTasks.filter(t => t.status === 'completed').length;

  await sendMessage(chatId,
    `📈 <b>Your Stats</b>\n\n` +
    `✅ Today: <b>${completedToday} tasks</b>\n` +
    `📋 Pending: <b>${pendingCount} tasks</b>\n` +
    `🏆 Total completed: <b>${totalCompleted}</b>\n` +
    `⏱ Est. effort remaining: <b>${allTasks.filter(t => t.status !== 'completed').reduce((sum, t) => sum + (t.estimated_minutes || 0), 0)} min</b>`
  );
}

async function handleArchiveCommand(chatId: number, userId: string) {
  const tasks = await getTasks({ status: 'completed' });
  const recent = tasks.slice(0, 15);

  if (recent.length === 0) {
    await sendMessage(chatId, "No completed tasks yet. Get started! 💪");
    return;
  }

  const lines = recent.map(t => {
    const date = t.completed_at
      ? new Date(t.completed_at).toLocaleDateString()
      : '';
    return `✅ <s>${t.title}</s> — ${date}`;
  });

  await sendMessage(chatId, `📦 <b>Completed Tasks</b>\n\n${lines.join('\n')}`);
}

// ─── Smart message handlers ─────────────────────────────────

async function handleTaskCreation(chatId: number, text: string, userId: string) {
  await sendMessage(chatId, "🧠 Processing...");

  try {
    // Get user context, categories, and learnings for parsing
    const context = await getContext(userId);
    const categories = await getCategories(userId);
    const learnings = await getLearnings(userId);

    const contextText = context?.context_text || 'No context provided.';

    // Parse the input
    const parsed = await parseInput(text, contextText, categories, learnings);

    if (parsed.type === 'task' && parsed.task) {
      const newTask = await createTask({
        title: parsed.task.title,
        description: parsed.task.description,
        category: parsed.task.category,
        priority: parsed.task.priority,
        difficulty: parsed.task.difficulty,
        estimated_minutes: parsed.task.estimated_minutes || undefined,
        focus_required: parsed.task.focus_required,
        due_date: parsed.task.due_date,
        status: 'inbox',
        source: 'telegram',
        created_by: userId,
        notes: parsed.task.blocks_description || undefined,
      });

      const priorityLabels: Record<string, string> = {
        critical: '🔴 Critical', high: '🟠 High', medium: '🟡 Medium', low: '🟢 Low',
      };

      await sendMessage(chatId,
        `✨ <b>Task added!</b>\n\n` +
        `📝 ${newTask.title}\n` +
        `${priorityLabels[newTask.priority || 'medium'] || '🟡 Medium'}\n` +
        `${newTask.estimated_minutes ? `⏱ ${newTask.estimated_minutes} min` : ''}\n` +
        `${newTask.due_date ? `📅 ${new Date(newTask.due_date).toLocaleDateString()}` : ''}`
      );

      // Log interaction
      await logInteraction({
        user_id: userId,
        user_input: text,
        ai_action: 'create_task',
        ai_response: `Created task: ${newTask.title}`,
        tasks_affected: [newTask.id],
      });
    } else {
      await sendMessage(chatId, parsed.response);
    }
  } catch (err) {
    console.error('Task creation error:', err);
    await sendMessage(chatId, "Oops, something went wrong. Try again? 🙏");
  }
}

async function handleDoneMessage(chatId: number, text: string, userId: string) {
  const tasks = await getTasks({ status: 'today' });
  if (tasks.length === 0) {
    await sendMessage(chatId, "No pending tasks! 🎉");
    return;
  }

  // For now, show buttons to select which task is done
  const keyboard = tasks.slice(0, 10).map((t, i) => ([{
    text: `${i + 1}. ${t.title.slice(0, 30)}`,
    callback_data: `done:${t.id}`,
  }]));

  await sendMessage(chatId, "Which task did you complete?", {
    reply_markup: { inline_keyboard: keyboard },
  });
}

async function handleRecommendMessage(chatId: number, text: string, userId: string) {
  const tasks = await getTasks({ status: 'today' });

  if (tasks.length === 0) {
    await sendMessage(chatId, "No tasks for today! Rest well! 🌟");
    return;
  }

  // Extract time from message
  const timeMatch = text.match(/(\d+)\s*(min|hour)/i);
  let minutes = 30;
  if (timeMatch) {
    minutes = parseInt(timeMatch[1]);
    if (timeMatch[2].toLowerCase().startsWith('hour')) minutes *= 60;
  }

  // Simple recommendation: show high-priority tasks that fit
  const recommended = tasks
    .filter(t => (t.estimated_minutes || 30) <= minutes)
    .slice(0, 5);

  if (recommended.length === 0) {
    await sendMessage(chatId, `No tasks fit in ${minutes} minutes. Consider a longer break! ☕`);
    return;
  }

  const lines = recommended.map(t =>
    `• ${t.title} (${t.estimated_minutes || '?'}min)`
  );

  let response = `🎯 <b>Quick Tasks for ${minutes} min</b>\n\n${lines.join('\n')}`;

  await sendMessage(chatId, response);

  // Log interaction
  await logInteraction({
    user_id: userId,
    user_input: text,
    ai_action: 'recommend_tasks',
    ai_response: `Recommended ${recommended.length} tasks`,
    tasks_affected: recommended.map(t => t.id),
  });
}

// ─── Callback query handler ─────────────────────────────────

const userState: Record<number, { task_id?: string }> = {};

async function handleCallback(query: Record<string, unknown>) {
  const data = query.data as string;
  const message = query.message as Record<string, unknown>;
  const chat = message?.chat as Record<string, unknown>;
  const chatId = chat?.id as number;
  const queryId = query.id as string;
  const from = query.from as Record<string, unknown>;
  const userId = String(from?.id);

  if (data.startsWith('done:')) {
    const taskId = data.replace('done:', '');
    try {
      const task = await completeTask(taskId);
      const celebration = CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)];

      const allTasks = await getTasks({});
      const completedToday = allTasks.filter(
        t => t.status === 'completed' && t.completed_at && new Date(t.completed_at).toDateString() === new Date().toDateString()
      ).length;
      const pending = allTasks.filter(t => t.status !== 'completed').length;

      await answerCallback(queryId, 'Task completed! 🎉');
      await sendMessage(chatId,
        `${celebration}\n\n✅ <b>${task.title}</b> — Done!\n\n` +
        `📊 Today: ${completedToday} | 📋 Remaining: ${pending}`
      );

      // Log interaction
      await logInteraction({
        user_id: userId,
        user_input: 'Completed task',
        ai_action: 'complete_task',
        ai_response: `Completed: ${task.title}`,
        tasks_affected: [taskId],
      });
    } catch {
      await answerCallback(queryId, 'Error completing task');
    }
  }
}
