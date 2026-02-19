'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Category, TaskFilters, DEFAULT_CATEGORIES } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';
import SearchBar from '@/app/components/SearchBar';
import FilterBar from '@/app/components/FilterBar';
import TaskCard from '@/app/components/TaskCard';
import TaskDetailSheet from '@/app/components/TaskDetailSheet';
import InputBar from '@/app/components/InputBar';
import SkeletonCard from '@/app/components/SkeletonCard';
import BottomNav from '@/app/components/BottomNav';

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State
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
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load tasks and categories
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
  }, [loadData]);

  // Apply search and filters
  const filteredTasks = useMemo(() => {
    let result = tasks.filter(task => !task.is_deleted);

    // Apply status filter
    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }

    // Apply priority filter
    if (filters.priority) {
      result = result.filter(t => t.priority === filters.priority);
    }

    // Apply time filter
    if (filters.time_max) {
      result = result.filter(t => t.estimated_minutes <= (filters.time_max as number));
    }

    // Apply focus filter
    if (filters.focus) {
      result = result.filter(t => t.focus_required === filters.focus);
    }

    // Apply search
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase();
      result = result.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'smart_score';
    const sortDir = filters.sort_dir === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Task];
      let bVal: any = b[sortBy as keyof Task];

      if (aVal === null || aVal === undefined) aVal = -Infinity;
      if (bVal === null || bVal === undefined) bVal = -Infinity;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal) * sortDir;
      }

      return (aVal - bVal) * sortDir;
    });

    return result;
  }, [tasks, filters, searchValue]);

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Handle task completion
  const handleTaskComplete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      await loadData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  // Handle task tap
  const handleTaskTap = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setDetailSheetOpen(true);
    }
  };

  // Handle detail sheet save
  const handleDetailSave = async (updates: Partial<Task>) => {
    if (!selectedTask) return;

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

  // Handle add task submission
  const handleAddTask = async (text: string) => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      });

      if (response.ok) {
        await loadData();
        setAddSheetOpen(false);
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category color
  const getCategoryColor = (categoryName: string | null) => {
    if (!categoryName) return '#D1D5DB';
    const cat = categories.find(c => c.name === categoryName);
    return cat?.color || '#D1D5DB';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="pb-20 min-h-screen bg-[#FAF8F5]">
      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-[#FAF8F5]">
        <SearchBar value={searchValue} onChange={handleSearchChange} />
        <FilterBar filters={filters} onFilterChange={setFilters} categories={categories} />
      </div>

      {/* Task List */}
      <div className="px-4 py-4">
        {isLoading ? (
          // Loading skeletons
          <div className="space-y-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredTasks.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tasks found.</p>
            {searchValue && (
              <p className="text-gray-500 text-sm mt-2">Try a different search.</p>
            )}
          </div>
        ) : (
          // Task list
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
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setAddSheetOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#C45D3E] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#A84C2F] transition-colors"
        aria-label="Add task"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Add Task Input (Bottom Sheet) */}
      {addSheetOpen && (
        <div className="fixed inset-0 z-40 flex flex-col">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setAddSheetOpen(false)}
          />

          {/* Input area */}
          <div className="bg-white rounded-t-3xl p-4 pb-6 shadow-xl">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Task</h3>
            </div>
            <InputBar
              onSubmit={handleAddTask}
              isLoading={isSubmitting}
              placeholder="What do you need to do?"
            />
          </div>
        </div>
      )}

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

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
}
