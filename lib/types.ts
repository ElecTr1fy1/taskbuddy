// TaskBuddy V1 â€” Type Definitions

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
  { name: 'Content', color: '#DDD6FF' },
  { name: 'Investments', color: '#FED7AA' },
  { name: 'Personal', color: '#FBCFE8' },
  { name: 'New Venture', color: '#A5F3FC' },
];

// Default personal context
export const DEFAULT_CONTEXT = `## About Me
I'm Daniel, a 25-year-old Israeli entrepreneur based in Dubai. I run multiple businesses and am building toward a goal of $100M+ liquid net worth by age 30.

## My Businesses

### Tanaor Brand
- Biblical inscription jewel‹),ÈÛËY›İ[™YÚ]^HÚ\İ\ˆ[™[ÛB‹H™]™[YNˆ¸ ªŒŒKŞYX\ˆ\Ü˜Y[
È‰“KŞYX\ˆTÂ‹HIÛHİ\[™È˜XÚÈÈHİ˜]YÚXÈ›ÛK›İ^K]ËY^B‚ˆÈÈÈPÛÛHXØY[^H
YXØ][Ûˆ\Ú[™\ÜÊH8 %Ô’SÔ’UB‹H\Ü˜Y[	ÜÈ\™Ù\İKXÛÛ[Y\˜ÙH˜Z[š[™È›ÙÜ˜[B‹H¸ ªŒSKÛ[Û™]™[YKÍIH›Ùš]X\™Ú[‹L
ÈİY[Â‹H\™Ù][™È8 ªLKŞYX\‚‚ˆÈÈÈ™]È™[\™H
Ú][ÜŠB‹HÛËY›İ[™\ˆ[Ü‹ÌŒ\]Z]HÜ]‹H\™Ù][™È	LŒJÈ^][ˆYX\œÂ‚ˆÈÈÈÛÛ[È\œÛÛ˜[œ˜[™‹HLÊÈİXœØÜšX™\ˆ[İUX™HÚ[›™[[ˆ\Ü˜Y[‹HØØ[[™È\œÛÛ˜[œ˜[™\ÈXÜ]Z\Ú][ÛˆÚ[›™[›ÜˆPÛÛHXØY[^B‚ˆÈÈ^Hš[Üš]Y\È
[ˆÜ™\ŠBŒKˆØØ[HPÛÛHXØY[^HİØ\™8 ¢ êÍLKŞYX\‚—‹ˆZ[[™Ü›İÈ\œÛÛ˜[œ˜[™ÈÛÛ[ŒËˆ]™[Ü™]È™[\™HÚ][Ü‚ˆXZ[Z[ˆ[˜[Üˆİ˜]YÚXÈİ™\œÚYÚKˆÜ[Z^™H[™\İY[Ü›Û[Â‚ˆÈÈİÈHÛÜšÈB‹HH˜[YHÜYY[™Y™šXÚY[˜ŞHX›İ™H[‹HIÛH\™Xİ8 %ˆÚ]™HYHÛX\ˆ™XÛÛ[Y[™][ÛœÂ‹H^H[YH\ÈÛÜ	ÌMËÛ[Û8 %ˆ[YHÜ[™]ÛˆYÚ\İ[]™\˜YÙHXİ]š]Y\ØÂ‚‹ïòRSÔ’UWĞÓÓÔ”Îˆ™XÛÜ™\ÚÔš[Üš]Kİš[™ÏˆHÂˆÜš]XØ[ˆ	ÈÑÌŒ‰ËˆYÚˆ	ÈÑPMNÉËˆYY][Nˆ	ÈÌMŒÑP‰ËˆİÎˆ	ÈÑQQ‰ËŸNÂ‚‹ËÈYØXŞHİ]È\B™^Ü[\™˜XÙHİ]ÈÂˆ[™[™Îˆ[X™\ÂˆÛÛ\]Yˆ[X™\ÂˆÛÛ\]YİÙ^Nˆ[X™\Âˆİ™XZÎˆ[X™\Âˆİ[ÙY™›ÜÜ[™[™Îˆ[X™\ÂˆØ]YÛÜšY\Îˆ™XÛÜ™İš[™Ë[X™\Âˆ]™[ˆ[X™\ÂˆÜ›ÙÜ™\ÜÎˆ[X™\ÂŸB‚‹ËÈYØXŞH™XÛÛ[Y[™™\ÜÛœÙH\B™^Ü[\™˜XÙH™XÛÛ[Y[™™\ÜÛœÙHÂˆY\ÜØYÙNˆİš[™ÎÂˆ™XÛÛ[Y[™Yˆ\ÚÖ×NÂˆ[YWÜ[ˆİš[™Ö×NÂˆ™X\ÛÛš[™Îˆİš[™ÎÂŸB