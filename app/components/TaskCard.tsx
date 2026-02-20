'use client';

import { Task, PRIORITY_COLORS } from '@/lib/types';
import { useState, useRef } from 'react';
import ScoreBadge from './ScoreBadge';
import CategoryPill from './CategoryPill';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onTap: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  categoryColor?: string;
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

export default function TaskCard({
  task,
  onComplete,
  onTap,
  onArchive,
  categoryColor = '#D1D5DB',
}: TaskCardProps) {
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [swiped, setSwiped] = useState<'complete' | 'archive' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setOffsetX(diff);
  };

  const handleTouchEnd = () => {
    if (offsetX > 50) {
      setSwiped('complete');
      setTimeout(() => {
        onComplete(task.id);
      }, 300);
    } else if (offsetX < -50) {
      setSwiped('archive');
      setTimeout(() => {
        onArchive?.(task.id);
      }, 300);
    }
    setOffsetX(0);
  };

  const priorityColor =
    task.priority && PRIORITY_COLORS[task.priority]
      ? PRIORITY_COLORS[task.priority]
      : '#D1D5DB';

  return (
    <div
      ref={cardRef}
      className={`relative h-auto min-h-[88px] overflow-hidden rounded-card transition-all duration-300 ${
        swiped === 'complete' ? 'bg-green-50' : swiped === 'archive' ? 'bg-gray-50' : 'bg-card'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {swiped === 'complete' && (
        <div className="absolute inset-0 bg-green-100 flex items-center justify-end pr-4">
          <span className="text-green-700 font-semibold">Done</span>
        </div>
      )}
      {swiped === 'archive' && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-start pl-4">
          <span className="text-gray-700 font-semibold">Archive</span>
        </div>
      )}

      <div
        className={`relative px-4 py-3 flex gap-3 items-start transition-transform duration-300 ${
          offsetX !== 0 ? 'translate-x-0' : ''
        }`}
        style={{ transform: `translateX(${offsetX}px)` }}
      >
        <button
          onClick={() => onComplete(task.id)}
          className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center mt-1 transition-colors"
          style={{
            borderColor: task.status === 'completed' ? priorityColor : '#D1D5DB',
            backgroundColor:
              task.status === 'completed' ? priorityColor : 'transparent',
          }}
          aria-label="Complete task"
        >
          {task.status === 'completed' && (
            <svg
              className="w-4 h-4 text-white"
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

        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ backgroundColor: priorityColor }}
        />

        <div
          className="flex-1 flex flex-col gap-2 cursor-pointer"
          onClick={() => onTap(task.id)}
        >
          <h3
            className={`text-base font-semibold leading-tight ${
              task.status === 'completed'
                ? 'line-through text-gray-400'
                : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>

          <div className="flex items-center justify-between gap-2">
            {task.category && (
              <CategoryPill
                name={task.category}
                color={categoryColor}
                size="sm"
              />
            )}
            {!task.category && <div className="flex-1" />}

            <div className="flex items-center gap-2">
              <ScoreBadge score={task.smart_score} />
              {task.estimated_minutes != null && (
                <span className="text-sm font-bold text-gray-700">
                  {formatTimeEstimate(task.estimated_minutes)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
