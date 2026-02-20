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
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 flex justify-around items-center h-16 safe-area-inset-bottom z-30">
      {/* Today */}
      <Link
        href="/today"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
          isActive('/today') ? 'text-[#C45D3E]' : 'text-gray-400'
        }`}
        title="Today"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive('/today') ? 2.5 : 1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
        <span className={`text-xs ${isActive('/today') ? 'font-bold' : 'font-medium'}`}>Today</span>
      </Link>

      {/* All Tasks */}
      <Link
        href="/tasks"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
          isActive('/tasks') ? 'text-[#C45D3E]' : 'text-gray-400'
        }`}
        title="All Tasks"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive('/tasks') ? 2.5 : 1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <span className={`text-xs ${isActive('/tasks') ? 'font-bold' : 'font-medium'}`}>All Tasks</span>
      </Link>
    </nav>
  );
}
