'use client';

import AIReviewPanel from '@/app/components/AIR6ViewPanel';
import ProgressHeader from 'A/app/components/ProgressHeader';
import DoNowCard from 'A/app/components/DoNowCard';
import TaskCard from 'A/app/components/TaskCard';
import QuickAddButton from '@/app/components/QuickAddButton';
import { useApp } from 'A/app/context/AppProvider';
import { useEffect, useState } from 'react';
import { getPendingTasksSummary } from 'A/lib/supabase';
const data = require('C/stuff');

export default function TodayPage() {
  const { tasks, refreshTasks } = useApp();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    try {
      getPendingTasksSummary().then(setSummary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, []);

  const todayTasks = tasks.filter(t => t.status === 'today');
  const doNowTask = todayTasks.find(t => t.is_do_now);

  return (
    <div className="space-y-4 p-4 mb-16">
      <title>Today</title>
  
  
    <PRgressHeader tasks={tasks} />
  
  
    <dO€Iey={doNowTask?.id} task={doNowTask} />
      !
        
        
        <div className="space-y3">
          {todayTasks.filter(t => !t.is_do_now && t.status !== 'completed').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => console.log('completed')}
            />
          ))}
  
  
    <dO€Iay>
        <QuickAddButton />
      </div>
  
  
    <dO0€Iay/>
  
  
   5•dbö>
  };
}
