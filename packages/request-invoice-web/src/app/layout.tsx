import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'Invoice Details | hyprsqrl',
  description:
    'View and pay your invoice with hyprsqrl - the all-in-one crypto financial hub',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <body className="min-h-screen bg-background font-sans antialiased">
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
                      <div className="digital-effect"></div>
                      <span className="logo-text font-medium text-xl tracking-tight">
                        hyprsqrl
                      </span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <SignedOut>
                      <SignInButton />
                      <SignUpButton />
                    </SignedOut>
                    <SignedIn>
                      <div className="hidden sm:flex items-center gap-4">
                        <Link
                          href="/dashboard/invoices"
                          className="nostalgic-button-secondary px-5 py-2 text-sm font-medium"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/create-invoice"
                          className="nostalgic-button px-5 py-2 text-sm font-medium text-white"
                        >
                          Create Invoice
                        </Link>
                      </div>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                  </div>
                </div>
              </nav>
              <div className="flex flex-col p-5 pb-20 w-full">{children}</div>

              <footer className="w-full flex flex-col items-center justify-center border-t border-primary/10 mx-auto text-center gap-4 py-6">
                <div className="w-full">
                  <p className="text-secondary text-sm">
                    © 2025 <span className="accent-break">hyprsqrl</span>
                  </p>
                </div>
              </footer>
            </div>
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
