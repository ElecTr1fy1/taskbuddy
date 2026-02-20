import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/app/components/AuthProvider';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import { AppProvider } from '@/app/context/AppProvider';
import GlobalPanels from '@/app/components/GlobalPanels';

export const metadata: Metadata = {
  title: 'TaskBuddy',
  description: 'AI-powered task management',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#FAF8F5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <AppProvider>
              {children}
              <GlobalPanels />
            </AppProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
