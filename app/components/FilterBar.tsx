'use client';

import { TaskFilters, TaskStatus, TaskPriority, FocusLevel, Category } from '@/lib/types';
import { useRef } from 'react';

interface FilterBarProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  categories: Category[];
}

const STATUS_OPTIONS: { label: string; value: TaskStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Inbox', value: 'inbox' },
  { label: 'Active', value: 'active' },
  { label: 'Today', value: 'today' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
];

const PRIORITY_OPTIONS: { label: string; value: TaskPriority }[] = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const TIME_OPTIONS: { label: string; value: number }[] = [
  { label: '<15m', value: 15 },
  { label: '15-30m', value: 30 },
  { label: '30-60m', value: 60 },
  { label: '1-2h', value: 120 },
  { label: '2h+', value: 180 },
];

const FOCUS_OPTIONS: { label: string; value: FocusLevel }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const SORT_OPTIONS: { label: string; value: TaskFilters['sort_by'] }[] = [
  { label: 'Smart Score', value: 'smart_score' },
  { label: 'Priority', value: 'priority' },
  { label: 'Due Date', value: 'due_date' },
  { label: 'Time', value: 'estimated_minutes' },
  { label: 'Date Added', value: 'created_at' },
];

export default function FilterBar({
  filters,
  onFilterChange,
  categories,
}: FilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters =
    filters.status || filters.category || filters.priority || filters.time_max || filters.focus;

  const handleStatusChange = (value: TaskStatus | undefined) => {
    onFilterChange({ ...filters, status: value });
  };

  const handleCategoryChange = (value: string | undefined) => {
    onFilterChange({ ...filters, category: value });
  };

  const handlePriorityChange = (value: TaskPriority | undefined) => {
    onFilterChange({ ...filters, priority: value });
  };

  const handleTimeChange = (value: number | undefined) => {
    onFilterChange({ ...filters, time_max: value });
  };

  const handleFocusChange = (value: FocusLevel | undefined) => {
    onFilterChange({ ...filters, focus: value });
  };

  const handleSortChange = (value: TaskFilters['sort_by']) => {
    onFilterChange({ ...filters, sort_by: value });
  };

  const handleClearAll = () => {
    onFilterChange({
      status: undefined,
      category: undefined,
      priority: undefined,
      time_max: undefined,
      focus: undefined,
      search: filters.search,
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
    });
  };

  return (
    <div className="px-4 py-3 bg-white border-b border-gray-200">
      {/* Status filters */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2" ref={scrollRef}>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value || 'all'}
              onClick={() => handleStatusChange(option.value)}
              className={`filter-pill flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.status === option.value
                  ? 'active bg-[#C45D3E] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(
                  filters.category === cat.name ? undefined : cat.name
                )}
                className={`filter-pill flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === cat.name
                    ? 'active text-white'
                    : 'bg-white border text-gray-700 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor:
                    filters.category === cat.name ? cat.color : 'white',
                  borderColor: filters.category === cat.name ? 'transparent' : '#D1D5DB',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Priority filters */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PRIORITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePriorityChange(
                filters.priority === option.value ? undefined : option.value
              )}
              className={`filter-pill flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.priority === option.value
                  ? 'active bg-[#C45D3E] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time filters */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTimeChange(
                filters.time_max === option.value ? undefined : option.value
              )}
              className={`filter-pill flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.time_max === option.value
                  ? 'active bg-[#C45D3E] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Focus filters */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {FOCUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFocusChange(
                filters.focus === option.value ? undefined : option.value
              )}
              className={`filter-pill flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filters.focus === option.value
                  ? 'active bg-[#C45D3E] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort and clear */}
      <div className="flex items-center justify-between gap-2">
        <select
          value={filters.sort_by || 'smart_score'}
          onChange={(e) => handleSortChange(e.target.value as TaskFilters['sort_by'])}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm font-medium text-[#C45D3E] hover:text-[#A84C2F]"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
