import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/app/components/AuthProvider';
import { ThemeProvider } from '@/app/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'TaskBuddy',
  description: 'AI-powered task management',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#FAF8F5',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
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
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
