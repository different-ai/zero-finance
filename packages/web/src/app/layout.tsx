import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Providers } from '@/components/providers';
import { TRPCProvider } from '@/providers/trpc-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hypr',
  description: 'Hypr: The Future of Web3 Banking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <TRPCProvider>
            <div className="noise-texture"></div>
            <div className="scanline"></div>
            {children}
          </TRPCProvider>
        </Providers>
      </body>
    </html>
  );
}
