import { GeistSans } from 'geist/font/sans';
import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import { Toaster } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import Providers from './providers';
import { PHProvider } from './providers/posthog-provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://hyprsqrl.com'),
  title: {
    default: 'hyprsqrl - Your personal CFO and crypto bank account for freelancers',
    template: '%s | hyprsqrl',
  },
  description: 'hyprsqrl creates your invoices, collects payments, and manages your crypto finances—powered by AI agents. The all-in-one crypto bank account that optimizes your financial life.',
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
    title: 'Your personal CFO—at your fingertips',
    description: 'hyprsqrl creates your invoices, collects payments, and manages your crypto finances—powered by AI agents. The all-in-one crypto bank account for freelancers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hyprsqrl - Your personal CFO and crypto bank account for freelancers',
    description: 'hyprsqrl creates your invoices, collects payments, and manages your crypto finances—powered by AI agents.',
    images: ['/og-new-hyprsqrlcrypto.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-gradient-to-b from-[#070707] to-[#070707] text-white">
        <PHProvider>
          <TooltipProvider>
            <Providers>
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col items-center">
                  <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
                      <div className="flex gap-5 items-center font-semibold">
                        <Link
                          href="/"
                          className="flex items-center gap-2 text-2xl"
                        >
                          <Image
                            src="/hsql.png"
                            alt="hyprqrl Logo"
                            width={30}
                            height={30}
                          />
                        </Link>
                      </div>
                    </div>
                  </nav>
                  <div className="flex flex-col p-5 pb-20 w-full">
                    {children}
                  </div>

                  <footer className="w-full flex flex-col items-center justify-center border-t mx-auto text-center text-xs gap-4 py-8">
                    <div className="flex space-x-6">
                      <Link href="#" className="text-gray-400 hover:text-white">Terms</Link>
                      <Link href="#" className="text-gray-400 hover:text-white">Privacy</Link>
                      <Link href="#" className="text-gray-400 hover:text-white">Contact</Link>
                    </div>
                    <p className="text-gray-500">© 2025 hyprsqrl - Your personal CFO for crypto finances</p>
                  </footer>
                </div>
              </main>
              <Toaster />
            </Providers>
          </TooltipProvider>
        </PHProvider>
      </body>
    </html>
  );
}
