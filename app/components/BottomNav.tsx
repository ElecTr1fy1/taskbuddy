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

      {/* Settings */}
      <Link
        href="/settings"
        className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors ${
          isActive('/settings') ? 'text-[#C45D3E]' : 'text-gray-400'
        }`}
        title="Settings"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isActive('/settings') ? 2.5 : 1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <span className={`text-xs ${isActive('/settings') ? 'font-bold' : 'font-medium'}`}>Settings</span>
      </Link>
    </nav>
  );
}
