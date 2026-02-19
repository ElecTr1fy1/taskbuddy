'use client';

interface CategoryPillProps {
  name: string;
  color: string;
  size?: 'sm' | 'md';
}

function darkenColor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = 30;
  const usePound = true;

  let R = (num >> 16) & 255;
  let G = (num >> 8) & 255;
  let B = num & 255;

  R = Math.max(0, R - amt);
  G = Math.max(0, G - amt);
  B = Math.max(0, B - amt);

  const val = (R << 16) + (G << 8) + B;
  return (usePound ? '#' : '') + val.toString(16).padStart(6, '0');
}

export default function CategoryPill({
  name,
  color,
  size = 'sm',
}: CategoryPillProps) {
  const bgColor = color || '#D1D5DB';
  const textColor = darkenColor(bgColor);

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2 py-0.5'
    : 'text-sm px-3 py-1';

  return (
    <span
      className={`rounded-full font-medium whitespace-nowrap ${sizeClasses}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {name}
    </span>
  );
}
