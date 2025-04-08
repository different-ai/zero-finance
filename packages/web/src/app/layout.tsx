import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HyprSQRL | All-in-one Web3 Banking & Invoicing Solution',
  description: 'Manage accounts, create invoices, optimize yields, and control your finances with HyprSQRL',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="noise-texture"></div>
          <div className="scanline"></div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
