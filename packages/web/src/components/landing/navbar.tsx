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
    // 0D012E
    <nav className="py-4 px-6 bg-gradient-to-r bg-[#0D012E] rounded-2xl shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center text-lg tracking-tight text-white hover:text-blue-200 transition-colors"
        >
          <div className="h-7 px-2 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-sm border border-white/10">
            zero
          </div>
          <span className="ml-2 font-semibold text-white">
            finance
          </span>
        </Link>

        <div className="flex items-center space-x-8">
          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/careers"
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              careers
            </Link>
            <Link
              href="https://github.com/different-ai/zero-finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              open source
            </Link>
          </div>

          {ready ? (
            !authenticated ? (
              <Button
                onClick={() => router.push('/demo')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors border-0 shadow-md"
              >
                watch demo
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors border-0 shadow-md"
              >
                dashboard
              </Button>
            )
          ) : (
            <Button
              disabled
              className="bg-white/10 text-white/50 px-6 py-2.5 rounded-xl cursor-not-allowed border-0"
            >
              loading...
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 