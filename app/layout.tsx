import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/lib/contexts/GameContext';
import { AudioProvider } from '@/lib/contexts/AudioContext';
import AppShell from '@/components/AppShell/AppShell';

export const metadata: Metadata = {
  title: 'Harry Nielsen M. Lagto | Aspiring Fullstack Developer',
  description: 'Portfolio of Harry Nielsen M. Lagto — Aspiring Fullstack Developer from Metro Manila, Philippines. Specializing in Next.js, React, TypeScript, and mobile development.',
  keywords: ['Harry Lagto', 'frontend developer', 'mobile developer', 'Next.js', 'React', 'TypeScript', 'Philippines'],
  authors: [{ name: 'Harry Nielsen M. Lagto' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Harry Nielsen M. Lagto | Aspiring Fullstack Developer',
    description: 'Portfolio',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <GameProvider>
          <AudioProvider>
            <AppShell>
              {children}
            </AppShell>
          </AudioProvider>
        </GameProvider>
      </body>
    </html>
  );
}
