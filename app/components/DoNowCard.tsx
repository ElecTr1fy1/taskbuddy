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
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }
  return `${minutes}m`;
}

export default function DoNowCard({ task, onComplete }: DoNowCardProps) {
  return (
    <div className="donow-glow p-5 animate-fade-up">
      <div className="flex gap-4 items-start">
        {/* Checkbox */}
        <button
          onClick={() => onComplete(task.id)}
          className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#C45D3E]/30 flex items-center justify-center transition-all hover:border-[#C45D3E] hover:bg-[#C45D3E]/10 mt-0.5"
          style={{
            borderColor: task.status === 'completed' ? '#C45D3E' : undefined,
            backgroundColor: task.status === 'completed' ? '#C45D3E' : undefined,
          }}
          aria-label="Complete task"
        >
          {task.status === 'completed' && (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-bold leading-snug ${
            task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-[#F0EDE8]'
          }`}>
            {task.title}
          </h2>

          {/* Meta row: category dot + time */}
          <div className="flex items-center gap-3 mt-1.5">
            {task.category && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {task.category}
              </span>
            )}
            {task.estimated_minutes != null && (
              <span className="text-xs font-semibold text-[#C45D3E]">
                {formatTimeEstimate(task.estimated_minutes)}
              </span>
            )}
            {task.smart_score !== null && (
              <ScoreBadge score={task.smart_score} />
            )}
          </div>

          {/* AI Reason */}
          {task.ai_reason && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2.5 italic leading-relaxed border-l-2 border-[#C45D3E]/20 pl-3">
              {task.ai_reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
