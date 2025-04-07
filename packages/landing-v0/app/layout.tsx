import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import Providers from './providers';
import { PHProvider } from './providers/posthog-provider';
import { Metadata } from 'next';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL('https://hyprsqrl.com'),
  title: {
    default: 'hyprsqrl - BIOS Mode',
    template: '%s | hyprsqrl',
  },
  description: 'hyprsqrl - AI Banking (BIOS Mode)',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hyprsqrl.com',
    siteName: 'hyprsqrl',
    images: ['/og-new-hyprsqrlcrypto.png'],
    title: 'Get Paid. Pay Bills. Make Money Work.',
    description: 'The all-in-one crypto financial hub for freelancers that collects payments, handles expenses, and maximizes yield on your earnings.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hyprsqrl - Get Paid. Pay Bills. Make Money Work.',
    description: 'The all-in-one crypto financial hub for freelancers that collects payments, handles expenses, and maximizes yield on your earnings.',
    images: ['/og-new-hyprsqrlcrypto.png'],
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
        <PHProvider>
          <TooltipProvider>
            <Providers>
              <main>
                {children}
              </main>
              <Toaster />
            </Providers>
          </TooltipProvider>
        </PHProvider>
      </body>
    </html>
  );
}
