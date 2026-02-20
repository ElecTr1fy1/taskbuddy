'use client';

import { Task } from '@/lib/types';
import { useApp } from '@/app/context/AppProvider';

interface ProgressHeaderProps {
  tasks: Task[];
  userName?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatTimeLeft(minutes: number): string {
  if (minutes <= 0) return '0m';
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m`;
}

export default function ProgressHeader({ tasks, userName = 'Daniel' }: ProgressHeaderProps) {
  const { setSettingsOpen } = useApp();

  const todayTasks = tasks.filter(t => t.status === 'today' || t.status === 'completed');
  const completedCount = todayTasks.filter(t => t.status === 'completed').length;
  const totalCount = todayTasks.length;
  const pendingTasks = todayTasks.filter(t => t.status !== 'completed');
  const timeLeftMinutes = pendingTasks.reduce(
    (sum, t) => sum + (t.estimated_minutes || 0),
    0
  );

  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="px-5 pt-5 pb-4 bg-[#FAF8F5] dark:bg-[#1D1B17]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F0EDE8]">
            {getGreeting()}, {userName}
          </h1>
          {totalCount > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {completedCount} of {totalCount} done
              {timeLeftMinutes > 0 && ` \u00b7 ~${formatTimeLeft(timeLeftMinutes)} left`}
            </p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              No tasks yet for today
            </p>
          )}
        </div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 -mr-2 -mt-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Settings"
        >
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>
      {totalCount > 0 && (
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C45D3E] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
