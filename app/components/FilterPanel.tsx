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
  const hasActiveFilters = filters.status || filters.category || filters.priority || filters.time_max || filters.focus;

  const clearAll = () => {
    onFilterChange({
      search: '',
      sort_by: 'smart_score',
      sort_dir: 'desc',
    });
    onSearchChange('');
  };

  return (
    <div className="space-y-3">
      {/* Search bar — glass style */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/70 dark:bg-[#2A2724]/70 backdrop-blur-md border border-gray-200/60 dark:border-gray-600/40 rounded-2xl text-sm text-gray-900 dark:text-[#F0EDE8] placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#C45D3E]/20 focus:border-[#C45D3E]/40 transition-all"
        />
      </div>

      {/* Category pills — horizontal scroll with colored dots */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <button
          onClick={() => onFilterChange({ ...filters, category: undefined })}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            !filters.category
              ? 'bg-[#C45D3E] text-white shadow-sm'
              : 'bg-white/60 dark:bg-[#2A2724]/60 backdrop-blur-sm text-gray-600 dark:text-gray-400 border border-gray-200/40 dark:border-gray-600/30'
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
            className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              filters.category === cat.name
                ? 'text-white shadow-sm'
                : 'bg-white/60 dark:bg-[#2A2724]/60 backdrop-blur-sm text-gray-600 dark:text-gray-400 border border-gray-200/40 dark:border-gray-600/30'
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

      {/* Dropdowns row: Status + Sort */}
      <div className="flex items-center gap-2">
        {/* Status dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: (e.target.value as TaskStatus) || undefined })}
            className="w-full appearance-none px-3 py-2 pr-8 bg-white/60 dark:bg-[#2A2724]/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-600/40 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#C45D3E]/20 cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="inbox">Inbox</option>
            <option value="today">Today</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </div>

        {/* Sort dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.sort_by || 'smart_score'}
            onChange={(e) => onFilterChange({ ...filters, sort_by: e.target.value as TaskFilters['sort_by'] })}
            className="w-full appearance-none px-3 py-2 pr-8 bg-white/60 dark:bg-[#2A2724]/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-600/40 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#C45D3E]/20 cursor-pointer"
          >
            <option value="smart_score">Sort: Smart</option>
            <option value="priority">Sort: Priority</option>
            <option value="due_date">Sort: Due Date</option>
            <option value="estimated_minutes">Sort: Time</option>
            <option value="created_at">Sort: Created</option>
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </div>

        {/* Priority dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ ...filters, priority: (e.target.value as TaskPriority) || undefined })}
            className="w-full appearance-none px-3 py-2 pr-8 bg-white/60 dark:bg-[#2A2724]/60 backdrop-blur-sm border border-gray-200/60 dark:border-gray-600/40 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#C45D3E]/20 cursor-pointer"
          >
            <option value="">Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </div>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex-shrink-0 px-2.5 py-2 text-xs font-semibold text-[#C45D3E] hover:bg-[#C45D3E]/10 rounded-xl transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
