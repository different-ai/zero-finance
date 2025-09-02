'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Calendar, Menu } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/new-logo-bluer.png"
            alt="Zero Finance"
            width={48}
            height={48}
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md"
          />
          <span className="text-xl sm:text-2xl font-semibold text-[#00225b] tracking-tight">
            finance
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="text-sm lg:text-base font-medium text-[#0050ff] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/legal"
            className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
          >
            Legal & Security
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-2 bg-[#0040FF] text-white px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm hover:bg-[#0050ff] focus-visible:ring-2 focus-visible:ring-[#0040FF] focus:outline-none"
          >
            Sign In
          </Link>
          <Link
            href="https://cal.com/potato/0-finance-onboarding"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 backdrop-blur-sm bg-[#0040FF]/10 text-[#0040FF] px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm border border-[#0040FF]/30 hover:border-[#0040FF] hover:bg-[#0040FF]/15 focus-visible:ring-2 focus-visible:ring-[#0040FF] focus:outline-none"
          >
            <Calendar className="w-4 lg:w-5 h-4 lg:h-5" />
            Book Demo
          </Link>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#0f1e46] hover:text-[#0050ff] transition-colors"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-4 space-y-4">
          <Link
            href="/"
            className="block text-base font-medium text-[#0050ff] transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/legal"
            className="block text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Legal & Security
          </Link>
          <Link
            href="/signin"
            className="flex items-center gap-2 bg-[#0040FF] text-white px-4 py-3 rounded-lg font-semibold text-base transition-colors shadow-sm hover:bg-[#0050ff]"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="https://cal.com/potato/0-finance-onboarding"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#0040FF]/10 text-[#0040FF] px-4 py-3 rounded-lg font-semibold text-base transition-colors border border-[#0040FF]/30 hover:border-[#0040FF] hover:bg-[#0040FF]/15"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Calendar className="w-5 h-5" />
            Book Demo
          </Link>
        </div>
      )}
    </header>
  );
}
