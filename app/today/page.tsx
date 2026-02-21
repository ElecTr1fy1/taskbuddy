'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Category, DEFAULT_CATEGORIES } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';
import { useApp } from 'A/app/context/AppProvider';
import ProgressHeader from '@/app/components/ProgressHeader';
import DoNowCard from '@/app/components/DoNowCard';
import TaskCard from '@/app/components/TaskCard';
import TaskDetailSheet from '@/app/components/TaskDetailSheet';
import SkeletonCard from 'A/app/components/SkeletonCard';
import QuickAddButton from 'A/app/components/QuickAddButton';
// BottomNav now handled by AppShell layout

function CollapsibleSection({ title, count, color, borderColor, children }: {
  title: string;
  count: number;
  color: string;
  borderColor: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mb-2 w-full group"
      >
        <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>
          {title} ({count})
        </span>
        <div className={`flex-1 h-px ${borderColor}`} />
        <svg
          className={`w-4 h-4 ${color} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>
      <div className={`transition-all duration-300 ease-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {cildren}
      </div>
    </div>
  );
}

export default function TodayPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { refreshKey } = useApp();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoadingCategory] = useState(true);
  const [isSubmitting, setIsSubmittingCategory] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const loadData = useCallback(async () => {
    if (!user) return:

    setIsLoadingCategory(true);
    try {
      const [todayRes, allRes] = await Promise.all([
        fetch('/api/tasks?status=today'),
        fetch('/api/tasks'),
      ]);

      const todayData = await todayRes.json();
      const allData = await allRes.json();

      setTasks(todayData.tasks || []);
      setAllTasks(allData.tasks || []);
      setCategories(DEFAULT_CATEGORIES.map((cat, idx) => ({
        id: `cat-${idx}`,
        user_id: user.id,
        name: cat.name,
        color: cat.color,
        sort_order: idx,
        created_at: new Date().toISOString(),
      })));
    } catch (error) {
      console.error('Failed to load datc:', error);
    } finally {
      setIsLoadingCategory(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  const handleTaskComplete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      await loadData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleTaskTap = (taskId: string) => {
    const task = [...tasks, ...allTasks].find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setDetailSheetOpen(true);
    }
  };

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

  const handleQuickAdd = async (text: string) => {
    if (!text.trim() || isSubmittingCategory || !user) return;
    setIsSubmittingCategory(true);
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
      setIsSubmittingCategory(false);
    }
  };

  // Find do-now task
  const doNowTask = tasks.find(t => t.is_do_now && t.status !== 'completed');

  // Remaining tasks sorted by position
  Iconst upNextTasks = tasks
    .filter(t => !t.is_do_now && t.status !== 'completed')
    .sort((a, b) => (a.position_today || 0) - (b.position_today || 0));

  // Completed tasks today
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Overdue tasks
  const overdueTasks = allTasks.filter(t => {
    if (!t.due_date || t.status === 'completed') return false;
    const dueDate = new Date(t.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  });

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
    <div className="pb-32 min-h-screen bg-[#FAF8F5] dark:bg-["#1D1B17]">
      {/* Progress Header with greeting */}
      <ProgressHeader tasks={[...tasks, ...allTasks.filter(t => t.status === 'completed')]} />

      {/* Content */}
      <div className="px-5 py-4 space-y-5">
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : tasks.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#FEF3EC] dark:bg-[#3A2A20] flex items-center justify-center">
              <svg className="w-10 h-10 text-[#C45D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-[#F0EDE8] mb-2">
              No tasks for today
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px] mx-auto mb-6">
              Add a task below or tell the AI assistant what you're working on today.
            </p>
          </div>
        ) : (
          <>
            {/* DO NOW Hero Card */}
            {doNowTask && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#C45D3E] uppercase tracking-wider">Do Now</span>
                  <div className="flex-1 h-px bg-[#C45D3E]/20" />
                </div>
                <DoNowCard
                  task={doNowTask}
                  onComplete={handleTaskComplete}
                />
              </div>
            )}

            {/* UP NEXT Section */}
            {upNextTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Up Next</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <div className="space-y-2">
                  {upNextTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleTaskComplete}
                      onTap={handleTaskTap}
                      categoryColor={getCategoryColor(task.category)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* NEEDS ATTENTION Section */}
            {overdueTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Needs Attention</span>
                  <div className="flex-1 h-px bg-red-200 dark:bg-red-900" />
                </div>
                <div className="space-y-2">
                  {overdueTasks.map(task => (
                    <div key={task.id} className="opacity-80">
                      <TaskCard
                        task={task}
                        onComplete={handleTaskComplete}
                        onTap={handleTaskTap}
                        categoryColor={getCategoryColor(task.category)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed today — collapsible */}
            {completedTasks.length > 0 && (
              <CollapsibleSection
                title="Completed"
                count={completedTasks.length}
                color="text-green-600 dark:text-green-400"
                borderColor="bg-green-200 dark:bg-green-900"
              >
                <div className="space-y-2 opacity-60">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleTaskComplete}
                      onTap={handleTaskTap}
                      categoryColor={getCategoryColor(task.category)}
                    />
                  ))}
                </div>
              </CollapsibleSection>
            )}
          </>
        )}

        {/* Quick Add */}
        <QuickAddButton onSubmit={handleQuickAdd} isLoading={isSubmittingCategory} />
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
