'use client';

import React from 'react';
import Link from 'next/link';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export function FinalCTASection() {
  return (
    <>
      <section className="border-t border-[#101010]/10 bg-[#F7F7F2] py-16">
        <div className="mx-auto max-w-[1200px] px-8">
          <div className="max-w-[800px]">
            <h2 className="font-serif text-[48px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Ready to earn 10% on your startup&apos;s funds?
            </h2>
            <p className="mt-4 text-[18px] text-[#101010]/70">
              Join 50+ startups already earning yield on their treasury.
            </p>
            <div className="mt-8 flex items-center gap-20">
              <Link
                href="/signin?source=crypto"
                className="text-[18px] font-medium text-[#1B29FF] underline underline-offset-[6px] hover:no-underline transition-all"
              >
                Open account →
              </Link>
              <Link
                href="https://cal.com/team/0finance/30"
                className="text-[16px] text-[#101010] hover:text-[#1B29FF] transition-colors"
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-white">
        <div className="mx-auto max-w-[1200px] px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-[13px] text-[#101010]/60">
                © 2025 0 finance
              </span>
              <Link
                href="/legal"
                className="text-[13px] text-[#101010]/60 hover:text-[#101010]"
              >
                Legal & Security
              </Link>
              <Link
                href="/privacy"
                className="text-[13px] text-[#101010]/60 hover:text-[#101010]"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/40">
                Backed by
              </span>
              <OrangeDAOLogo className="h-5 w-auto opacity-50 grayscale" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
