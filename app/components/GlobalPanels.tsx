'use client';

import { usePathname } from 'next/navigation';
import AIAssistantPanel from './AIAssistantPanel';
import SettingsDrawer from './SettingsDrawer';

export default function GlobalPanels() {
  const pathname = usePathname();

  // Only show panels on authenticated pages (not login)
  const showPanels = pathname !== '/login' && pathname !== '/';

  if (!showPanels) return null;

  return (
    <>
      <AIAssistantPanel />
      <SettingsDrawer />
    </>
  );
}
