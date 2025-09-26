'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="border-b border-[#101010]/10 bg-transparent">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={24}
              height={24}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
            <span className="ml-1 font-bold text-[13px] sm:text-[14px] tracking-tight text-[#0050ff]">
              finance
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[#101010] hover:text-[#0050ff] text-[12px] sm:text-[13px] font-medium transition-colors"
              href="/dashboard?demo=true"
            >
              Demo
            </Link>
            <Link
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] sm:text-[13px] font-medium rounded-md transition-all"
              href="/signin"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
