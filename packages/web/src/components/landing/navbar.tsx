'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();

  return (
    <nav className="py-6 bg-transparent backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center text-lg tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          <div className="h-8 px-2 rounded-md bg-white flex items-center justify-center text-black font-bold shadow-sm">
            zero
          </div>
          <span className="ml-1 font-semibold text-white">
            finance
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Show careers and open source links */}
          <div className="hidden md:flex items-center space-x-6 mr-4">
            <Link
              href="/careers"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              careers
            </Link>
            <Link
              href="https://github.com/different-ai/zero-finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              open source
            </Link>
          </div>

          {ready ? (
            !authenticated ? (
              <Button
                onClick={() => router.push('/demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors border-0"
              >
                watch demo
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors border-0"
              >
                dashboard
              </Button>
            )
          ) : (
            <Button
              disabled
              className="bg-white/10 text-white/60 px-6 py-2 rounded-lg cursor-not-allowed border-0"
            >
              loading...
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 