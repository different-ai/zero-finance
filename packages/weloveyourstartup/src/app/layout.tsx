import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://weloveyourstartup.com'),
  title: {
    default: 'We Love Your Startup',
    template: '%s', // This ensures page titles are used as-is without appending site name
  },
  description:
    'A curated directory of founders we admire. Calculate how much their idle cash could earn with Zero Finance.',
  openGraph: {
    title: 'We Love Your Startup',
    description: 'Founders we admire & how much they could save',
    url: 'https://weloveyourstartup.com',
    siteName: 'We Love Your Startup',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We Love Your Startup',
    description: 'Founders we admire & how much they could save',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
