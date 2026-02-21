'use client';

import { usePathname } from 'next/navigation';
import DesktopSidebar from './DesktopSidebar';
import BottomNav from './BottomNav';
import AIReviewPanel from './AIReviewPanel';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show shell on login page
  const isAuth = pathname !== '/login' && pathname !== '/' && pathname !== '/today';

  if (!isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1D1B17]">
      {/* Desktop sidebar */}
      <DesktopSidebar />

      {/* Main content area — offset on desktop */}
      <div className="lg:ml-56">
        {/* Desktop header with AI Review button */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-gray-200/30 dark:border-gray-700/30 bg-[#FAF8F5]/80 dark:bg-[#1D1B17]/80 backdrop-blur-xl sticky top-0 z-10">
          <h1 className="text-lg font-bold text-gray-900 dark:text-[#F0EDE8]">
            {pathname === '/today' ? 'Today' : pathname === '/tasks' ? 'All Tasks' : pathname === '/settings' ? 'Settings' : 'TaskBuddy'}
          </h1>
          <AIReviewPanel />
        </div>

        {/* Mobile header with AI Review button */}
        <div className="lg:hidden flex items-center justify-between px-5 py-2.5 sticky top-0 z-10 bg-[#FAF8F5]/90 dark:bg-[#1D1B17]/90 backdrop-blur-xl">
          <h1 className="text-base font-bold text-gray-900 dark:text-[#F0EDE8]">
            {pathname === '/today' ? 'Today' : pathname === '/tasks' ? 'All Tasks' : pathname === '/settings' ? 'Settings' : 'TaskBuddy'}
          </h1>
          <AIReviewPanel />
        </div>

        {/* Page content */}
        {children}
      </div>

      {/* Mobile bottom nav (hidden on desktop) */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
