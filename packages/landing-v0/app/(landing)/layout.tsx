import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://hyprsqrl.com'),
  title: {
    default: 'HyprSqrl - AI Automation',
    template: '%s | HyprSqrl'
  },
  description: 'AI agents that automate your tasks and workflows.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hyprsqrl.com',
    siteName: 'HyprSqrl',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HyprSqrl - AI Automation'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HyprSqrl - AI Automation',
    description: 'AI agents that automate your tasks and workflows.',
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
} 