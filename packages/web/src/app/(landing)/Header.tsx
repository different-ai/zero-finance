'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="border-b border-[#101010]/10 bg-[#F7F7F2]">
      <div className="mx-auto max-w-[1200px] px-8 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
            <span className="text-[14px] font-medium tracking-tight text-[#101010]">
              finance
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[13px] uppercase tracking-[0.14em]">
            <Link
              className="text-[#101010]/70 hover:text-[#101010] transition-colors"
              href="#customers"
            >
              Customers
            </Link>
            <Link
              className="text-[#101010]/70 hover:text-[#101010] transition-colors"
              href="#about"
            >
              About
            </Link>
            <Link
              className="text-[#101010]/70 hover:text-[#101010] transition-colors"
              href="#docs"
            >
              Docs
            </Link>
            <Link
              className="text-[#1B29FF] hover:underline underline-offset-4 transition-all"
              href="#contact"
            >
              Contact us →
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
