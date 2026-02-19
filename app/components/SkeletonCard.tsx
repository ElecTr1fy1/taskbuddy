'use client';

export default function SkeletonCard() {
  return (
    <div className="px-4 py-3 bg-card rounded-card overflow-hidden">
      <div className="flex gap-3 items-start">
        {/* Checkbox skeleton */}
        <div className="skeleton flex-shrink-0 w-7 h-7 rounded-full" />

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Title skeleton */}
          <div className="skeleton h-5 w-3/4 rounded" />

          {/* Bottom row */}
          <div className="flex items-center justify-between gap-2">
            {/* Category pill skeleton */}
            <div className="skeleton h-4 w-20 rounded-full" />

            {/* Score and time skeleton */}
            <div className="flex gap-2">
              <div className="skeleton w-7 h-7 rounded-full" />
              <div className="skeleton h-4 w-12 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
