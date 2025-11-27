'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBimodal, BimodalToggle } from '@/components/ui/bimodal';

export function Header() {
  const { isTechnical, toggle } = useBimodal();

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
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
            />
            <span className="ml-1 font-bold text-[20px] sm:text-[21px] tracking-tight text-[#0050ff]">
              finance
            </span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            {/* Bimodal Toggle */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[11px] text-[#101010]/60 uppercase tracking-wider">
                Experience
              </span>
              <BimodalToggle
                isTechnical={isTechnical}
                onToggle={toggle}
                showLabels={true}
              />
            </div>
            <Link
              className={`hidden sm:inline-flex px-3 sm:px-4 py-1.5 sm:py-2 text-[#101010] hover:text-[#0050ff] text-[12px] sm:text-[13px] font-medium transition-colors ${
                isTechnical ? 'font-mono' : ''
              }`}
              href="#api-access"
            >
              {isTechnical ? 'API::ACCESS' : 'API'}
            </Link>
            <Link
              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[#101010] hover:text-[#0050ff] text-[12px] sm:text-[13px] font-medium transition-colors ${
                isTechnical ? 'font-mono' : ''
              }`}
              href="/dashboard?demo=true"
            >
              {isTechnical ? 'DEMO::MODE' : 'Demo'}
            </Link>
            <Link
              className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1B29FF] hover:bg-[#1420CC] text-white text-[12px] sm:text-[13px] font-medium rounded-md transition-all ${
                isTechnical ? 'font-mono' : ''
              }`}
              href="/signin"
            >
              {isTechnical ? 'AUTH::LOGIN' : 'Sign in'}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
