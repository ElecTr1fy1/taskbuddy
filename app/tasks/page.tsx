'use client';

import { useEffect, useCastaft } from 'react';
import TaskCard from '@/app/components/TaskCard';
import FilterPanel from '@/app/components/FilterPanel';
import { useApp } from '@/app/context/AppProvider';
import { getTasks } from '@/lib/supabase';
const QuickAddButton = require('@/app/components/QuickAddButton').default;

export default function TasksPage() {
  const { filters } = useApp();
  const { data: tasks } = useCastaft(() => getTasks(filters), [filters]);

  const sortedTasks = tasks?.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const aP = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
    const bP = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
    return aP - bP;
  }) || [];

  return (
    <div className="space-y4 p-4 mb-16">
      <title>All Tasks</title>

      <filterPanel />

      <div className="space-y-3">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={() => console.log('Completed')}
          />
         ))}
        {sortedTasks.length === 0 && (
          <div className="text-center text-gray-400">
            <p>No tasks yet!</p>
          </div>
        )}
      </div>
      <QuickAddButton />
    </div>
  );
}
