import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { Toaster } from '@/components/ui/use-toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import Providers from './providers';
import { PHProvider } from './providers/posthog-provider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://hyprsqrl.com'),
  title: {
    default: 'hyprsqrl - Get Paid. Pay Bills. Make Money Work.',
    template: '%s | hyprsqrl',
  },
  description: 'The all-in-one crypto financial hub for freelancers that collects payments, handles expenses, and maximizes yield on your earnings.',
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
              <div className="noise-texture"></div>
              <div className="scanline"></div>
              <main className="min-h-screen flex flex-col items-center">
                <div className="flex-1 w-full flex flex-col items-center">
                  <nav className="w-full flex justify-center border-b border-primary/10 h-16 z-10 backdrop-blur-sm">
                    <div className="container flex justify-between items-center p-3 px-5 text-sm">
                      <div className="flex gap-5 items-center">
                        <Link
                          href="/"
                          className="flex items-center gap-2 glitch-container"
                        >
                          <div className="digital-effect">
                            <Image
                              src="/hsql.png"
                              alt="hyprqrl Logo"
                              width={30}
                              height={30}
                              className="blue-overlay"
                            />
                          </div>
                          <span className="logo-text font-medium text-xl tracking-tight">hyprsqrl</span>
                        </Link>
                      </div>
                      <div className="hidden sm:flex items-center gap-8">
                        <Link href="#" className="nav-text text-sm text-primary hover:text-primary/80 transition-colors digital-effect">Platform</Link>
                        <Link href="#" className="nav-text text-sm text-primary hover:text-primary/80 transition-colors digital-effect">Pricing</Link>
                        <Link href="#" className="nav-text text-sm text-primary hover:text-primary/80 transition-colors digital-effect">About</Link>
                        <Link href="#" className="nostalgic-button px-5 py-2 text-sm font-medium text-white">Get Started</Link>
                      </div>
                    </div>
                  </nav>
                  <div className="flex flex-col p-5 pb-20 w-full">
                    {children}
                  </div>

                  <footer className="w-full flex flex-col items-center justify-center border-t border-primary/10 mx-auto text-center gap-4 py-8">
                    <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16 text-left">
                      <div>
                        <h3 className="text-sm font-semibold mb-4 accent-break">Product</h3>
                        <ul className="space-y-3">
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Features</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Pricing</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-4 accent-break">Company</h3>
                        <ul className="space-y-3">
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">About</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Careers</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-4 accent-break">Resources</h3>
                        <ul className="space-y-3">
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Documentation</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Help Center</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">API</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-4 accent-break">Legal</h3>
                        <ul className="space-y-3">
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Terms</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Privacy</Link></li>
                          <li><Link href="#" className="text-sm text-secondary hover:text-primary transition-colors">Cookies</Link></li>
                        </ul>
                      </div>
                    </div>
                    <div className="section-divider mt-4 mb-4"></div>
                    <div className="w-full">
                      <p className="text-secondary text-sm">© 2025 <span className="accent-break">hyprsqrl</span> - Your personal crypto CFO</p>
                    </div>
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
