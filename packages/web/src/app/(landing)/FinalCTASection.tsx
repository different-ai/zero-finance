'use client';

import React from 'react';
import Link from 'next/link';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export function FinalCTASection() {
  return (
    <>
      <section className="border-t border-[#101010]/10 bg-[#F7F7F2] py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[800px]">
            <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[48px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Ready to earn 10% on your startup&apos;s funds?
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[18px] text-[#101010]/70">
              Join 50+ startups already earning yield on their treasury.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-12 lg:gap-20">
              <Link
                href="/signin?source=crypto"
                className="text-[16px] sm:text-[17px] lg:text-[18px] font-medium text-[#1B29FF] underline underline-offset-[6px] hover:no-underline transition-all"
              >
                Open account →
              </Link>
              <Link
                href="https://cal.com/team/0finance/30"
                className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] transition-colors"
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8">
              <span className="text-[12px] sm:text-[13px] text-[#101010]/60">
                © 2025 0 finance
              </span>
              <Link
                href="/legal"
                className="text-[12px] sm:text-[13px] text-[#101010]/60 hover:text-[#101010]"
              >
                Legal & Security
              </Link>
              <Link
                href="/privacy"
                className="text-[12px] sm:text-[13px] text-[#101010]/60 hover:text-[#101010]"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/40">
                Backed by
              </span>
              <OrangeDAOLogo className="h-4 sm:h-5 w-auto opacity-50 grayscale" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
