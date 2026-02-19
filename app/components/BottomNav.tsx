'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface BottomNavProps {
  show?: boolean;
}

export default function BottomNav({ show = true }: BottomNavProps) {
  const pathname = usePathname();

  if (!show) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 safe-area-inset-bottom">
      {/* Today */}
      <Link
        href="/today"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
          isActive('/today') ? 'text-[#C45D3E]' : 'text-gray-400'
        }`}
        title="Today"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5.04-6.71l-2.75 3.54h3.02l4.25-5.7h-3.02l-1.5 2.16z" />
        </svg>
        <span className="text-xs font-medium">Today</span>
      </Link>

      {/* All Tasks */}
      <Link
        href="/tasks"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
          isActive('/tasks') ? 'text-[#C45D3E]' : 'text-gray-400'
        }`}
        title="All Tasks"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
        <span className="text-xs font-medium">Tasks</span>
      </Link>

      {/* Settings */}
      <Link
        href="/settings"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
          isActive('/settings') ? 'text-[#C45D3E]' : 'text-gray-400'
        }`}
        title="Settings"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.35c.15-.12.19-.34.1-.51l-1.63-2.83c-.12-.22-.37-.29-.59-.22l-2.03.8c-.42-.32-.9-.6-1.44-.78l-.3-2.15c-.04-.24-.24-.41-.48-.41h-3.27c-.24 0-.43.17-.47.41l-.3 2.15c-.54.18-1.02.46-1.44.78l-2.03-.8c-.22-.09-.47 0-.59.22L2.74 8.87c-.1.16-.06.39.1.51l1.72 1.35c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72 1.35c-.15.12-.19.34-.1.51l1.63 2.83c.12.22.37.29.59.22l2.03-.8c.42.32.9.6 1.44.78l.3 2.15c.04.24.24.41.48.41h3.27c.24 0 .43-.17.47-.41l.3-2.15c.54-.18 1.02-.46 1.44-.78l2.03.8c.22.09.47 0 .59-.22l1.63-2.83c.1-.16.06-.39-.1-.51l-1.72-1.35zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
        <span className="text-xs font-medium">Settings</span>
      </Link>
    </nav>
  );
}
