import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { TRPCProvider } from '@/providers/trpc-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Toaster } from '@/components/ui/sonner';
import { DemoModeProvider } from '@/context/demo-mode-context';

const inter = Inter({ subsets: ['latin'] });

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
