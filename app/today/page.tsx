'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Category, DEFAULT_CATEGORIES, ParseResponse } from '@/lib/types';
import { useAuth } from '@/app/components/AuthProvider';
import DoNowCard from '@/app/components/DoNowCard';
import TaskCard from '@/app/components/TaskCard';
import InputBar from '@/app/components/InputBar';
import AIResponse from '@/app/components/AIResponse';
import TaskDetailSheet from '@/app/components/TaskDetailSheet';
import SkeletonCard from '@/app/components/SkeletonCard';
import BottomNav from '@/app/components/BottomNav';

export default function TodayPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);

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
      // Fetch today's tasks and all tasks
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
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle task completion
  const handleTaskComplete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' });
      await loadData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  // Handle task tap to open detail sheet
  const handleTaskTap = (taskId: string) => {
    const task = [...tasks, ...allTasks].find(t => t.id === taskId);
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

  // Handle input submission
  const handleInputSubmit = async (text: string) => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Call AI parse endpoint
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, user_id: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAiMessage(data.error || 'Something went wrong.');
        return;
      }

      // Handle response based on type
      if (data.type === 'task') {
        // Task was already created by the parse API
        setAiMessage(data.response);
        await loadData();
      } else if (data.type === 'command' && data.command) {
        // Handle command (e.g., reshuffle)
        setAiMessage(data.response);
        if (data.command.action === 'reshuffle') {
          await loadData();
        }
      } else {
        // Question or general response
        setAiMessage(data.response);
      }
    } catch (error) {
      console.error('Failed to process input:', error);
      setAiMessage('Sorry, something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find do-now task
  const doNowTask = tasks.find(t => t.is_do_now && t.status !== 'completed');

  // Remaining tasks (sorted by position_today)
  const upNextTasks = tasks
    .filter(t => !t.is_do_now && t.status !== 'completed')
    .sort((a, b) => (a.position_today || 0) - (b.position_today || 0));

  // Overdue tasks
  const overdueTasks = allTasks.filter(t => {
    if (!t.due_date || t.status === 'completed') return false;
    const dueDate = new Date(t.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  });

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
      {/* Header */}
      <div className="sticky top-0 bg-[#FAF8F5] border-b border-gray-200 z-10">
        <div className="px-4 py-4 text-center">
          <h1 className="text-lg font-semibold text-gray-900">TaskBuddy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {isLoading ? (
          // Loading skeletons
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : tasks.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tasks yet.</p>
            <p className="text-gray-500 text-sm mt-2">What's on your mind?</p>
          </div>
        ) : (
          <>
            {/* DO NOW Card */}
            {doNowTask && (
              <div className="space-y-2">
                <DoNowCard
                  task={doNowTask}
                  onComplete={handleTaskComplete}
                />
              </div>
            )}

            {/* UP NEXT Section */}
            {upNextTasks.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-gray-700 px-2">Up Next</h2>
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
            )}

            {/* NEEDS ATTENTION Section */}
            {overdueTasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-sm font-semibold text-red-700">Needs Attention</h2>
                </div>
                {overdueTasks.map(task => (
                  <div key={task.id} className="opacity-75">
                    <TaskCard
                      task={task}
                      onComplete={handleTaskComplete}
                      onTap={handleTaskTap}
                      categoryColor={getCategoryColor(task.category)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Response */}
      <AIResponse message={aiMessage} onDismiss={() => setAiMessage(null)} />

      {/* Input Bar */}
      <InputBar
        onSubmit={handleInputSubmit}
        isLoading={isSubmitting}
      />

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
