'use client';

import { Task, PRIORITY_COLORS } from '@/lib/types';
import ScoreBadge from './ScoreBadge';

interface DoNowCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

function formatTimeEstimate(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m`;
}

export default function DoNowCard({ task, onComplete }: DoNowCardProps) {
  const priorityColor =
    task.priority && PRIORITY_COLORS[task.priority]
      ? PRIORITY_COLORS[task.priority]
      : '#C45D3E';

  return (
    <div className="px-4 py-4 bg-[#FEF3EC] rounded-card border-l-4" style={{ borderLeftColor: priorityColor }}>
      <div className="flex gap-4 items-start">
        {/* Checkbox */}
        <button
          onClick={() => onComplete(task.id)}
          className="flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors mt-1"
          style={{
            borderColor: task.status === 'completed' ? priorityColor : '#D1D5DB',
            backgroundColor:
              task.status === 'completed' ? priorityColor : 'transparent',
          }}
          aria-label="Complete task"
        >
          {task.status === 'completed' && (
            <svg
              className="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1">
          <h2
            className={`text-lg font-bold leading-snug ${
              task.status === 'completed'
                ? 'line-through text-gray-400'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h2>
          {task.ai_reason && (
            <p className="text-sm text-gray-600 mt-1">
              {task.ai_reason}
            </p>
          )}
        </div>

        {/* Time estimate */}
        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1">
          <span className="text-base font-bold text-gray-700">
            {formatTimeEstimate(task.estimated_minutes)}
          </span>
          {task.smart_score !== null && (
            <ScoreBadge score={task.smart_score} />
          )}
        </div>
      </div>
    </div>
  );
}
