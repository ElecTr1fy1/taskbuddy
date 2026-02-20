'use client';

import { useState } from 'react';
import { Category, TaskFilters, TaskPriority, TaskStatus, FocusLevel } from '@/lib/types';

interface FilterPanelProps {
  filters: TaskFilters;
  onFilterChange: (filters: TaskFilters) => void;
  categories: Category[];
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  categories,
  searchValue,
  onSearchChange,
}: FilterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = filters.status || filters.category || filters.priority || filters.time_max || filters.focus;

  const clearAll = () => {
    onFilterChange({
      search: '',
      sort_by: 'smart_score',
      sort_dir: 'desc',
    });
    onSearchChange('');
  };

  const statusOptions: { label: string; value: TaskStatus | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Inbox', value: 'inbox' },
    { label: 'Today', value: 'today' },
    { label: 'Completed', value: 'completed' },
    { label: 'Archived', value: 'archived' },
  ];

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#2A2724] border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-[#F0EDE8] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#C45D3E]/30 focus:border-[#C45D3E]"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <button
          onClick={() => onFilterChange({ ...filters, category: undefined })}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            !filters.category
              ? 'bg-[#C45D3E] text-white'
              : 'bg-gray-100 dark:bg-[#2A2724] text-gray-600 dark:text-gray-400'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() =>
              onFilterChange({
                ...filters,
                category: filters.category === cat.name ? undefined : cat.name,
              })
            }
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filters.category === cat.name
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            style={{
              backgroundColor:
                filters.category === cat.name
                  ? cat.color
                  : undefined,
            }}
          >
            {filters.category !== cat.name && (
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
            )}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Status + Advanced toggle row */}
      <div className="flex items-center justify-between gap-2">
        {/* Status dropdown */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {statusOptions.map(opt => (
            <button
              key={opt.label}
              onClick={() => onFilterChange({ ...filters, status: opt.value })}
              className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filters.status === opt.value
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-[#2A2724] text-gray-500 dark:text-gray-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* More filters + Clear */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#C45D3E] font-medium"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-1.5 rounded-lg transition-colors ${
              showAdvanced
                ? 'bg-[#C45D3E]/10 text-[#C45D3E]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-[#1D1B17] rounded-xl">
          {/* Priority */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Priority</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as TaskPriority || undefined })}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#2A2724] border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300"
            >
              <option value="">Any</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Time */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Max Time</label>
            <select
              value={filters.time_max || ''}
              onChange={(e) => onFilterChange({ ...filters, time_max: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#2A2724] border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300"
            >
              <option value="">Any</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Sort by */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sort by</label>
            <select
              value={filters.sort_by || 'smart_score'}
              onChange={(e) => onFilterChange({ ...filters, sort_by: e.target.value as TaskFilters['sort_by'] })}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#2A2724] border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300"
            >
              <option value="smart_score">Smart Score</option>
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
              <option value="estimated_minutes">Time</option>
              <option value="created_at">Created</option>
            </select>
          </div>

          {/* Sort dir */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Order</label>
            <select
              value={filters.sort_dir || 'desc'}
              onChange={(e) => onFilterChange({ ...filters, sort_dir: e.target.value as 'asc' | 'desc' })}
              className="w-full px-2 py-1.5 bg-white dark:bg-[#2A2724] border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-700 dark:text-gray-300"
            >
              <option value="desc">High → Low</option>
              <option value="asc">Low → High</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
