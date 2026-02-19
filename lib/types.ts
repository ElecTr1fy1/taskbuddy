// TaskBuddy V1 — Type Definitions

export type TaskStatus = 'inbox' | 'today' | 'active' | 'completed' | 'archived';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskDifficulty = 'easy' | 'medium' | 'hard';
export type FocusLevel = 'low' | 'medium' | 'high';
export type TaskSource = 'app_text' | 'app_voice' | 'telegram' | 'ai_generated';
export type UserRole = 'owner' | 'ea';

export interface ScoreBreakdown {
  impact: number;
  confidence: number;
  ease: number;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  difficulty: TaskDifficulty;
  estimated_minutes: number;
  focus_required: FocusLevel;
  category: string | null;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  created_by: string | null;
  source: TaskSource;
  notes: string | null;
  ai_reason: string | null;
  smart_score: number | null;
  score_breakdown: ScoreBreakdown | null;
  blocks_tasks: string[] | null;
  position_today: number | null;
  is_do_now: boolean;
  is_deleted: boolean;
}

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface UserContext {
  id: string;
  user_id: string;
  context_text: string;
  updated_at: string;
}

export interface AILearning {
  id: string;
  user_id: string;
  learning: string;
  source: string | null;
  created_at: string;
  active: boolean;
}

export interface AIInteraction {
  id: string;
  user_id: string;
  user_input: string | null;
  ai_action: string | null;
  ai_response: string | null;
  tasks_affected: string[] | null;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  sort_order: number;
  created_at: string;
}

// AI Parse Response Types
export interface ParsedTask {
  title: string;
  category: string | null;
  estimated_minutes: number | null;
  difficulty: TaskDifficulty;
  focus_required: FocusLevel;
  priority: TaskPriority;
  due_date: string | null;
  needs_time_input: boolean;
  blocks_description: string | null;
  description: string | null;
}

export interface ParseCommand {
  action: string;
  parameters: Record<string, unknown>;
}

export interface ParseResponse {
  type: 'task' | 'command' | 'question';
  task?: ParsedTask;
  command?: ParseCommand;
  response: string;
}

// AI Prioritize Response
export interface PrioritizedTask {
  id: string;
  position: number;
  is_do_now: boolean;
  ai_reason: string | null;
  smart_score: number;
  score_breakdown: ScoreBreakdown;
}

export interface PrioritizeResponse {
  tasks: PrioritizedTask[];
  removed_from_today: string[];
  confirmation: string;
}

// Filter types for All Tasks
export interface TaskFilters {
  status?: TaskStatus;
  category?: string;
  priority?: TaskPriority;
  time_max?: number;
  focus?: FocusLevel;
  search?: string;
  sort_by?: 'smart_score' | 'priority' | 'due_date' | 'estimated_minutes' | 'created_at' | 'category';
  sort_dir?: 'asc' | 'desc';
}

// Default categories
export const DEFAULT_CATEGORIES: { name: string; color: string }[] = [
  { name: 'Tanaor', color: '#BFDBFE' },
  { name: 'eCom Academy', color: '#BBF7D0' },
  { name: 'Content', color: '#DDD6FE' },
  { name: 'Investments', color: '#FED7AA' },
  { name: 'Personal', color: '#FBCFE8' },
  { name: 'New Venture', color: '#A5F3FC' },
];

// Default personal context
export const DEFAULT_CONTEXT = `## About Me
I'm Daniel, a 25-year-old Israeli entrepreneur based in Dubai. I run multiple businesses and am building toward a goal of $100M+ liquid net worth by age 30.

## My Businesses

### Tanaor (Jewelry Brand)
- Biblical inscription jewelry, co-founded with my sister and mom
- Revenue: ~₪20M/year Israel + ~$6M/year US
- I'm stepping back to a strategic role, not day-to-day

### eCom Academy (Education Business) — TOP PRIORITY
- Israel's largest e-commerce training program
- ~₪1M/month revenue, 75% profit margin, 1000+ students
- Targeting ₪50M/year

### New Venture (with Lior)
- Co-founder Lior, 80/20 equity split
- Targeting $120M+ exit in 4 years

### Content / Personal Brand
- 50K+ subscriber YouTube channel in Israel
- Scaling personal brand as acquisition channel for eCom Academy

## My Priorities (in order)
1. Scale eCom Academy toward ₪50M/year
2. Build and grow personal brand / content
3. Develop new venture with Lior
4. Maintain Tanaor strategic oversight
5. Optimize investment portfolio

## How I Work
- I value speed and efficiency above all
- I'm direct — give me clear recommendations
- My time is worth $300-400K/month — help me spend it on highest-leverage activities`;

// Priority colors for border
export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  critical: '#DC2626',
  high: '#EA580C',
  medium: '#2563EB',
  low: '#D1D5DB',
};

// Legacy stats type
export interface Stats {
  pending: number;
  completed: number;
  completed_today: number;
  streak: number;
  total_effort_pending: number;
  categories: Record<string, number>;
  level: number;
  xp_progress: number;
}

// Legacy recommend response type
export interface RecommendResponse {
  message: string;
  recommended: Task[];
  time_plan: string[];
  reasoning: string;
}
