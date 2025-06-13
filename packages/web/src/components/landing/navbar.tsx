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
    <nav className="border-b border-neutral-200 py-6 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center text-lg tracking-tight text-neutral-900 hover:text-blue-600 transition-colors"
        >
          <div className="h-8 px-2 rounded-md bg-gradient-to-r from-neutral-900 to-neutral-700 flex items-center justify-center text-white font-bold shadow-sm">
            zero
          </div>
          <span className="ml-1 font-semibold text-neutral-800">
            finance
          </span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Hide careers in production */}
          {process.env.NODE_ENV === 'development' && (
            <div className="hidden md:flex items-center space-x-6 mr-4">
              <Link
                href="/careers"
                className="text-sm font-medium text-neutral-700 hover:text-blue-600 transition-colors"
              >
                careers
              </Link>
              <Link
                href="https://github.com/different-ai/zero-finance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-neutral-700 hover:text-blue-600 transition-colors"
              >
                open source
              </Link>
            </div>
          )}

          {ready ? (
            !authenticated ? (
              <Button
                onClick={() => router.push('/demo')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                watch demo
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                dashboard
              </Button>
            )
          ) : (
            <Button
              disabled
              className="bg-neutral-200 text-neutral-400 px-6 py-2 rounded-lg cursor-not-allowed"
            >
              loading...
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 