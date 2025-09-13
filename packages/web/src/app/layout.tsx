import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { TRPCProvider } from '@/providers/trpc-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { DemoModeProvider } from '@/context/demo-mode-context';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '0 Finance - 8% APY Insured Savings for Startups',
  description:
    'Turn idle cash into headcount. Get 8% APY on treasury funds without leaving your current bank. FDIC insured up to $5M.',
  keywords: [
    'startup treasury',
    'high yield savings',
    'FDIC insured',
    'business banking',
    'crypto treasury',
    'USDC savings',
  ],
  authors: [{ name: '0 Finance' }],
  creator: '0 Finance',
  publisher: '0 Finance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '0 Finance - Your idle cash could hire your next engineer',
    description:
      'Get 8% APY on treasury funds. Open US or EU accounts, wire USD/EUR/USDC. FDIC insured up to $5M. $1M+ waitlist AUM.',
    url: 'https://0.finance',
    siteName: '0 Finance',
    images: [
      {
        url: 'https://0.finance/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: '0 Finance - 8% APY Insured Savings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '0 Finance - 8% APY Insured Savings',
    description:
      'Turn idle cash into headcount. Get 8% APY on treasury funds without leaving your current bank.',
    site: '@0finance',
    creator: '@0finance',
    images: ['https://0.finance/opengraph-image.png'],
  },
  metadataBase: new URL('https://0.finance'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*  bg-[#f7f9fb] bg-gradient-to-br from-slate-50 to-sky-100  */}
      <body className={inter.className}>
        <NuqsAdapter>
          <Providers>
            <TRPCProvider>
              <DemoModeProvider>
                <div className="noise-texture"></div>
                <div className="scanline"></div>
                {children}
              </DemoModeProvider>
            </TRPCProvider>
          </Providers>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
