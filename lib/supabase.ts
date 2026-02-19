import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Task,
  Profile,
  UserContext,
  AILearning,
  AIInteraction,
  Category,
  TaskFilters,
} from './types';

// Lazy-initialized server client (uses service role key for admin operations)
let _serverClient: SupabaseClient | null = null;

function serverClient(): SupabaseClient {
  if (!_serverClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    _serverClient = createClient(url, serviceKey);
  }
  return _serverClient;
}

// Client-side instance (uses anon key)
let _clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_clientInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    _clientInstance = createClient(url, anonKey);
  }
  return _clientInstance;
}

// ─── Auth Helpers ────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await serverClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error?.code === 'PGRST116') return null; // Not found
  if (error) throw error;
  return data;
}

// ─── Task CRUD ────────────────────────────────────────────────

export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  let query = serverClient()
    .from('tasks')
    .select('*')
    .eq('is_deleted', false);

  if (filters) {
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.time_max) query = query.lte('estimated_minutes', filters.time_max);
    if (filters.focus) query = query.eq('focus_required', filters.focus);
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }
  }

  // Default sorting
  const sortBy = filters?.sort_by || 'created_at';
  const sortDir = filters?.sort_dir || 'desc';
  query = query.order(sortBy, { ascending: sortDir === 'asc' });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getTask(id: string): Promise<Task | null> {
  const { data, error } = await serverClient()
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error?.code === 'PGRST116') return null; // Not found
  if (error) throw error;
  return data;
}

export async function createTask(data: Partial<Task>): Promise<Task> {
  const { data: task, error } = await serverClient()
    .from('tasks')
    .insert({
      title: data.title,
      description: data.description || null,
      status: data.status || 'inbox',
      priority: data.priority || 'medium',
      difficulty: data.difficulty || 'medium',
      estimated_minutes: data.estimated_minutes || null,
      focus_required: data.focus_required || 'medium',
      category: data.category || null,
      due_date: data.due_date || null,
      created_by: data.created_by,
      source: data.source || 'app_text',
      notes: data.notes || null,
      is_deleted: false,
    })
    .select()
    .single();

  if (error) throw error;
  return task;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const { data, error } = await serverClient()
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .eq('is_deleted', false)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeTask(id: string): Promise<Task> {
  return updateTask(id, {
    status: 'completed',
    completed_at: new Date().toISOString(),
    is_do_now: false,
  });
}

export async function softDeleteTask(id: string): Promise<Task> {
  return updateTask(id, { is_deleted: true });
}

export async function bulkUpdateStatus(
  ids: string[],
  status: string
): Promise<Task[]> {
  const { data, error } = await serverClient()
    .from('tasks')
    .update({ status })
    .in('id', ids)
    .eq('is_deleted', false)
    .select();

  if (error) throw error;
  return data || [];
}

// ─── Context ─────────────────────────────────────────────────

export async function getContext(userId: string): Promise<UserContext | null> {
  const { data, error } = await serverClient()
    .from('user_context')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error?.code === 'PGRST116') return null;
  if (error) throw error;
  return data;
}

export async function upsertContext(
  userId: string,
  text: string
): Promise<UserContext> {
  const { data, error } = await serverClient()
    .from('user_context')
    .upsert(
      {
        user_id: userId,
        context_text: text,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Learnings ───────────────────────────────────────────────

export async function getLearnings(userId: string): Promise<AILearning[]> {
  const { data, error } = await serverClient()
    .from('ai_learnings')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createLearning(
  userId: string,
  learning: string,
  source?: string
): Promise<AILearning> {
  const { data, error } = await serverClient()
    .from('ai_learnings')
    .insert({
      user_id: userId,
      learning,
      source: source || null,
      active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLearning(id: string): Promise<void> {
  const { error } = await serverClient()
    .from('ai_learnings')
    .update({ active: false })
    .eq('id', id);

  if (error) throw error;
}

// ─── Interactions ────────────────────────────────────────────

export async function logInteraction(data: Partial<AIInteraction>): Promise<AIInteraction> {
  const { data: interaction, error } = await serverClient()
    .from('ai_interactions')
    .insert({
      user_id: data.user_id,
      user_input: data.user_input || null,
      ai_action: data.ai_action || null,
      ai_response: data.ai_response || null,
      tasks_affected: data.tasks_affected || [],
    })
    .select()
    .single();

  if (error) throw error;
  return interaction;
}

export async function getRecentInteractions(
  userId: string,
  limit: number = 20
): Promise<AIInteraction[]> {
  const { data, error } = await serverClient()
    .from('ai_interactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ─── Categories ──────────────────────────────────────────────

export async function getCategories(userId: string): Promise<Category[]> {
  const { data, error } = await serverClient()
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createCategory(data: Partial<Category>): Promise<Category> {
  const { data: category, error } = await serverClient()
    .from('categories')
    .insert({
      user_id: data.user_id,
      name: data.name,
      color: data.color || '#888888',
      sort_order: data.sort_order || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return category;
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category> {
  const { data, error } = await serverClient()
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await serverClient()
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Legacy compatibility functions ──────────────────────────

export async function getPendingTasksSummary(): Promise<Task[]> {
  const { data } = await serverClient()
    .from('tasks')
    .select('*')
    .eq('is_deleted', false)
    .in('status', ['inbox', 'today', 'active'])
    .order('created_at', { ascending: false })
    .limit(50);

  return data || [];
}

interface Stats {
  pending: number;
  completed: number;
  completed_today: number;
  streak: number;
  total_effort_pending: number;
  categories: Record<string, number>;
  level: number;
  xp_progress: number;
}

export async function getStats(): Promise<Stats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: allTasks } = await serverClient()
    .from('tasks')
    .select('*')
    .eq('is_deleted', false);

  const tasks = allTasks || [];
  const pending = tasks.filter(t => t.status !== 'completed').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const completedToday = tasks.filter(
    t => t.status === 'completed' && t.completed_at && new Date(t.completed_at).toDateString() === today.toDateString()
  ).length;

  const totalEffort = tasks
    .filter(t => t.status !== 'completed')
    .reduce((sum: number, t: any) => sum + (t.estimated_minutes || 0), 0);

  const categories: Record<string, number> = {};
  tasks.forEach((t: any) => {
    const cat = t.category || 'general';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  const totalCompleted = completed;
  const level = Math.floor(totalCompleted / 10) + 1;
  const xpProgress = (totalCompleted % 10) / 10;

  return {
    pending,
    completed: totalCompleted,
    completed_today: completedToday,
    streak: 0, // Simplified for now
    total_effort_pending: totalEffort,
    categories,
    level,
    xp_progress: xpProgress,
  };
}
