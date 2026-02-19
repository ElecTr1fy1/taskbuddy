'use client';

interface ScoreBadgeProps {
  score: number | null;
}

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  if (score === null) {
    return (
      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-400">—</span>
      </div>
    );
  }

  let bgColor = '#E5E7EB'; // light gray (< 50)
  let textColor = '#4B5563'; // dark gray

  if (score >= 80) {
    bgColor = '#C45D3E'; // terracotta
    textColor = '#FFFFFF'; // white
  } else if (score >= 50) {
    bgColor = '#9CA3AF'; // medium gray
    textColor = '#FFFFFF'; // white
  }

  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center"
      style={{ backgroundColor: bgColor }}
    >
      <span
        className="text-xs font-bold"
        style={{ color: textColor }}
      >
        {score}
      </span>
    </div>
  );
}
