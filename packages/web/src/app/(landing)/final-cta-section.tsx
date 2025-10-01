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
              Ready to earn 8% on your startup&apos;s funds?
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[18px] text-[#101010]/70">
              Join startups securing their future with insured yield
              opportunities.
            </p>
            <p className="mt-2 text-[14px] sm:text-[15px] font-medium text-[#101010]">
              $1M+ Platform - Leading startups are committing over $1M to earn
              insured yields on their treasury.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                href="/signin?source=crypto"
                className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              >
                Open account →
              </Link>
              <Link
                href="https://cal.com/team/0finance/30"
                className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
              >
                Schedule demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#101010]/10 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Legal & Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/high-yield-startup-savings"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    High Yield Savings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/startup-treasury"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Treasury Management
                  </Link>
                </li>
                <li>
                  <Link
                    href="/extend-runway"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Extend Runway
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium mb-4">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/runway-calculator"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Runway Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Compare Options
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare-extended"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Full Comparison
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium mb-4">
                Get Started
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/signin"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signin?source=crypto"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Open Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://cal.com/team/0finance/30"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                  >
                    Book Demo
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#101010]/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <span className="text-[12px] text-[#101010]/60">
                  © 2025 0 Finance
                </span>
                <span className="text-[12px] text-[#101010]/40">
                  8% target yield through DeFi protocols with smart contract
                  insurance
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/40">
                  Backed by
                </span>
                <OrangeDAOLogo className="h-4 sm:h-5 w-auto opacity-50 grayscale" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
