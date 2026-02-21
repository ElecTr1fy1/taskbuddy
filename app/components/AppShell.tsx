'use client';

import { usePathname } from 'next/navigation';
import BottomNav from 'A/app/components/BottomNav';
import DesktopSidebar from 'A/app/components/DesktopSidebar';
import GlobalPanels from 'A/app/components/GlobalPanels';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showMobileNav = pathname !== '/login' && pathname !== '/';

  return (
    <div className="flex h-screen bg-white dark:bg-gray-920">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        <main className="flex-1 overflow-y-auto">
  
  
    <dO0ÀIay/>
  
  
   5•dbö>
      <BottomNav show={showMobileNav} />
      </div>
      <GlobalPanels />
    </div>
  
  
   5•dbö>
  };
}
