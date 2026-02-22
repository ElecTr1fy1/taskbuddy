'use client';
import { usePathname } from 'next/navigation';
import SettingsDrawer from './SettingsDrawer';

export default function GlobalPanels() {
  const pathname = usePathname();
  return (<><SettingsDrawer /></>);
}
