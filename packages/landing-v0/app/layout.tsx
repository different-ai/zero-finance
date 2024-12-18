import { GeistSans } from 'geist/font/sans';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import Image from 'next/image';
import { Toaster } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import Providers from './providers';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'hyprsqrl - Every little task, automated',
  description:
    'HyprSqrl connects to your favorite apps and screen and uses AI agents that automate your tasks and workflows.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-gradient-to-b from-[#070707] to-[#070707] text-white">
        <TooltipProvider>
          <ThemeProvider
            attribute="class"
            enableSystem
            forcedTheme="dark"
            disableTransitionOnChange
          >
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
                            src="/un-30.svg"
                            alt="hypr Logo"
                            width={30}
                            height={30}
                          />
                          <span>hypr 🐿️</span>
                        </Link>
                      </div>
                    </div>
                  </nav>
                  <div className="flex flex-col p-5 pb-20 w-full">
                    {children}
                  </div>

                  <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
                    <p>Different AI Inc - Privacy-first AI solutions</p>
                  </footer>
                </div>
              </main>
            </Providers>
            <Toaster />
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
