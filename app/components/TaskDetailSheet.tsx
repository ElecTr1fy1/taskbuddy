'use client';

import { useState, useEffect } from 'react';
import { Task, Category, TaskPriority, TaskDifficulty, FocusLevel, PRIORITY_COLORS } from '@/lib/types';
import BottomSheet from './BottomSheet';

interface TaskDetailSheetProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  onDelete?: () => void;
  categories: Category[];
}

export default function TaskDetailSheet({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories,
}: TaskDetailSheetProps) {
  const [formData, setFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        difficulty: task.difficulty,
        estimated_minutes: task.estimated_minutes,
        focus_required: task.focus_required,
        blocks_tasks: task.blocks_tasks,
        due_date: task.due_date,
        notes: task.notes,
        status: task.status,
      });
    }
  }, [task, isOpen]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!task) return null;

  const priorityColor = task.priority && PRIORITY_COLORS[task.priority]
    ? PRIORITY_COLORS[task.priority]
    : '#C45D3E';

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

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={task.title}>
      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Description
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E] resize-none"
          />
        </div>

        {/* Smart Score Section */}
        {task.smart_score !== null && task.score_breakdown && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Smart Score</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl font-bold text-[#C45D3E]">
                {task.smart_score}
              </span>
              <span className="text-sm text-gray-600">
                Based on impact, confidence, and ease
              </span>
            </div>

            {/* Score breakdown bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">Impact</span>
                  <span className="text-xs text-gray-600">
                    {task.score_breakdown.impact}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#C45D3E] h-2 rounded-full"
                    style={{
                      width: `${Math.min(task.score_breakdown.impact, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">
                    Confidence
                  </span>
                  <span className="text-xs text-gray-600">
                    {task.score_breakdown.confidence}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(task.score_breakdown.confidence, 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-gray-700">
                    Ease
                  </span>
                  <span className="text-xs text-gray-600">
                    {task.score_breakdown.ease}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(task.score_breakdown.ease, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Category
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value || null })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E]"
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Priority
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['critical', 'high', 'medium', 'low'] as TaskPriority[]).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                    formData.priority === p
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                  style={{
                    backgroundColor:
                      formData.priority === p
                        ? PRIORITY_COLORS[p]
                        : '#F3F4F6',
                    color: formData.priority === p ? 'white' : '#374151',
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Difficulty
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as TaskDifficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setFormData({ ...formData, difficulty: d })}
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  formData.difficulty === d
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Estimated Time
          </label>
          <div className="mb-3">
            <input
              type="number"
              min="0"
              value={formData.estimated_minutes || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  estimated_minutes: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E]"
              placeholder="Minutes"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[15, 30, 60, 120, 180].map((mins) => (
              <button
                key={mins}
                onClick={() =>
                  setFormData({ ...formData, estimated_minutes: mins })
                }
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  formData.estimated_minutes === mins
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {formatTimeEstimate(mins)}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Required */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Focus Required
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as FocusLevel[]).map((f) => (
              <button
                key={f}
                onClick={() =>
                  setFormData({ ...formData, focus_required: f })
                }
                className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                  formData.focus_required === f
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Blocks */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Blocks
          </label>
          <input
            type="text"
            value={(formData.blocks_tasks || []).join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                blocks_tasks: e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter((s) => s),
              })
            }
            placeholder="Task IDs separated by comma"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E] text-sm"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date || ''}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value || null })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E]"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E] resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Status
          </label>
          <select
            value={formData.status || 'active'}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Task['status'],
              })
            }
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#C45D3E]"
          >
            <option value="inbox">Inbox</option>
            <option value="today">Today</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Read-only fields */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Source
            </label>
            <p className="text-sm text-gray-700 capitalize">
              {task.source.replace('_', ' ')}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Created
            </label>
            <p className="text-sm text-gray-700">
              {new Date(task.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-[#C45D3E] hover:bg-[#A84C2F] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Save Changes
        </button>

        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Delete Task
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
