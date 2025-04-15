import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Providers } from '@/components/providers';
import { TRPCProvider } from '@/providers/trpc-provider';
import { RootClientWrapper } from '@/components/layout/root-client-wrapper';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Hypr',
//   description: 'Hypr: The Future of Web3 Banking.',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NuqsAdapter>
          <Providers>
            <TRPCProvider>
              <RootClientWrapper>
                <div className="noise-texture"></div>
                <div className="scanline"></div>
                {children}
              </RootClientWrapper>
            </TRPCProvider>
          </Providers>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
