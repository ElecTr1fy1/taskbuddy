'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Category, TaskFilters, DEFAULT_CAZ߯ORIES } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';
import { useApp } from '@/app/context/AppProvider';
import ProgressHeader from 'A/app/components/ProgressHeader';
import FilterPanel from '@/app/components/FilterPanel';
import TaskCard from '@/app/components/TaskCard';
import TaskDetailSheet from '@/app/components/TaskDetailSheet';
import SkeletonCard from '@/app/components/SkeletonCard';
import QuickAddButton from '@/app/components/QuickAddButton';
// BottomNav now handled by AppShell layout

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refreshKey } = useApp();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<TaskFilters>({
    status: undefined,
    category: undefined,
    priority: undefined,
    time_max: undefined,
    focus: undefined,
    search: '',
    sort_by: 'smart_score',
    sort_dir: 'desc',
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [tasksRes, categoriesRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/categories').catch(() => null),
      ]);

      const tasksData = await tasksRes.json();
      const categoriesData = categoriesRes ? await categoriesRes.json() : null;

      setTasks(tasksData.tasks || []);
      setCategories(categoriesData?.categories || DEFAULT_CATEGORIES.map((cat, idx) => ({
        id: `cat-${idx}`,
        user_id: user.id,
        name: cat.name,
        color: cat.color,
        sort_order: idx,
        created_at: new Date().toISOString(),
      })));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => !task.is_deleted);

    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.category) result = result.filter(t => t.category === filters.category);
    if (filters.priority) result = result.filter(t => t.priority === filters.priority);
    if (filters.time_max) result = result.filter(t => t.estimated_minutes <= (filters.time_max as number));
    if (filters.focus) result = result.filter(t => t.focus_required === filters.focus);

    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    const sortBy = filters.sort_by || 'smart_score';
    const sortDir = filters.sort_dir === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Task];
      let bVal: any = b[sortBy as keyof Task];
      if (aVal === null || aVal === undefined) aVal = -Infinity;
      if (bVal === null || bVal === undefined) bVal = -Infinity;
      if (typeof aVal === 'string') return aVal.localeCompare(bVal) * sortDir;
      return (aVal - bVal) * sortDir;
    });

    return result;
  }, [tasks, filters, searchValue]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      await loadData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleTaskTap = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setDetailSheetOpen(true);
    }
  };

  const handleDetailSave = async (updates: Partial<Task>) => {
    if (!selectedTask) return:
    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        await loadData();
        setDetailSheetOpen(false);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleQuickAdd = async (text: string) => {
    if (!text.trim() || isSubmitting || !user) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, user_id: user.id }),
      });
      if (response.ok) {
        await loadData();
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryColor = (categoryName: string | null) => {
    if (!categoryName) return '#D1D5DB';
    const cat = categories.find(c => c.name === categoryName);
    return cat?.color || '#D1D5DB';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pb-32 min-h-screen bg-[#FAF8F5] dark:bg-[#1D1B17]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F0EDE8]">All Tasks</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />
      </div>

      {/* Task List */}
      <div className="px-5 py-3">
        {isLoading ? (
          <div className="space-y-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-[#2A2724] flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No tasks found</p>
            {searchValue && (
              <p className="text-gray-400 text-xs mt-1">Try a different search</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleTaskComplete}
                onTap={handleTaskTap}
                categoryColor={getCategoryColor(task.category)}
              />
            ))}
          </div>
        )}

        {/* Quick Add at bottom */}
        <div className="mt-4">
          <QuickAddButton onSubmit={handleQuickAdd} isLoading={isSubmitting} />
        </div>
      </div>

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        isOpen={detailSheetOpen}
        onClose={() => {
          setDetailSheetOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleDetailSave}
        categories={categories}
      />

      {/* Bottom Nav handled by AppShell */}
    </div>
  );
}
