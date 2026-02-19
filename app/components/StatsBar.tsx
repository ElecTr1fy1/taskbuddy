'use client';

import { Stats } from '@/lib/types';

export default function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Stats cards row */}
      <div className="flex gap-3">
        <div className="flex-1 bg-surface-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.streak}</div>
          <div className="text-xs text-gray-400 mt-1">Day Streak</div>
        </div>
        <div className="flex-1 bg-surface-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-success">{stats.completed_today}</div>
          <div className="text-xs text-gray-400 mt-1">Done Today</div>
        </div>
        <div className="flex-1 bg-surface-light rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-accent-warning">{stats.pending}</div>
          <div className="text-xs text-gray-400 mt-1">Pending</div>
        </div>
      </div>

      {/* Level & XP bar */}
      <div className="bg-surface-light rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Level {stats.level}
          </span>
          <span className="text-xs text-gray-400">
            {Math.round(stats.xp_progress * 10)}/10 to next level
          </span>
        </div>
        <div className="h-2 bg-surface-dark rounded-full overflow-hidden">
          <div
            className="xp-fill h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
            style={{ width: `${stats.xp_progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
