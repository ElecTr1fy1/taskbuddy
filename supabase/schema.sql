-- TaskBuddy V1 — Full Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop old MVP tables
drop table if exists public.activity_log cascade;
drop table if exists public.tasks cascade;

-- Profiles (extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text check (role in ('owner', 'ea')) default 'owner',
  created_at timestamptz default now()
);

-- Tasks
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  status text check (status in ('inbox', 'today', 'active', 'completed', 'archived')) default 'inbox',
  priority text check (priority in ('critical', 'high', 'medium', 'low')),
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) not null default 'medium',
  estimated_minutes integer not null default 30,
  focus_required text check (focus_required in ('low', 'medium', 'high')) not null default 'medium',
  category text,
  due_date timestamptz,
  created_at timestamptz default now(),
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  source text check (source in ('app_text', 'app_voice', 'telegram', 'ai_generated')) default 'app_text',
  notes text,
  ai_reason text,
  smart_score integer,
  score_breakdown jsonb,
  blocks_tasks text[],
  position_today integer,
  is_do_now boolean default false,
  is_deleted boolean default false
);

-- User Context
create table public.user_context (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) unique,
  context_text text not null,
  updated_at timestamptz default now()
);

-- AI Learnings
create table public.ai_learnings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  learning text not null,
  source text,
  created_at timestamptz default now(),
  active boolean default true
);

-- AI Interaction Log
create table public.ai_interactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  user_input text,
  ai_action text,
  ai_response text,
  tasks_affected jsonb,
  created_at timestamptz default now()
);

-- Categories
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  name text not null,
  color text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Indexes
create index idx_tasks_status on public.tasks(status) where is_deleted = false;
create index idx_tasks_category on public.tasks(category) where is_deleted = false;
create index idx_tasks_priority on public.tasks(priority) where is_deleted = false;
create index idx_tasks_created_by on public.tasks(created_by);
create index idx_tasks_due_date on public.tasks(due_date) where due_date is not null;
create index idx_tasks_today on public.tasks(position_today) where status = 'today' and is_deleted = false;

-- Row Level Security
alter table public.tasks enable row level security;
alter table public.user_context enable row level security;
alter table public.ai_learnings enable row level security;
alter table public.ai_interactions enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Both owner and EA can read/write tasks
create policy "Users can view tasks" on public.tasks for select using (true);
create policy "Users can insert tasks" on public.tasks for insert with check (true);
create policy "Users can update tasks" on public.tasks for update using (true);
create policy "Owner can delete tasks" on public.tasks for delete using (
  auth.uid() in (select id from public.profiles where role = 'owner')
);

-- Only owner can access context, learnings, interactions, categories
create policy "Owner only context" on public.user_context for all using (
  auth.uid() in (select id from public.profiles where role = 'owner')
);
create policy "Owner only learnings" on public.ai_learnings for all using (
  auth.uid() in (select id from public.profiles where role = 'owner')
);
create policy "Owner only interactions" on public.ai_interactions for all using (
  auth.uid() in (select id from public.profiles where role = 'owner')
);
create policy "Owner only categories" on public.categories for all using (
  auth.uid() in (select id from public.profiles where role = 'owner')
);

-- Enable realtime on tasks
alter publication supabase_realtime add table public.tasks;

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'owner');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
