'use client';

import React from 'react';
import Link from 'next/link';
import { GradientBackground } from './gradient-background';
import { BrowserFrame } from '@/components/BrowserFrame';
import { Dithering } from '@paper-design/shaders-react';
import { LANDING_CONTENT } from './content';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';
import { CurrentYieldBadge } from './current-yield-badge';

export function HeroSection() {
  const content = LANDING_CONTENT.hero;

  return (
    <>
      {/* Demo Panel - Bank Statement Style */}
      <section className="relative border-b border-[#101010]/10 bg-white/90 overflow-hidden">
        <GradientBackground variant="demo" className="z-0 bg-[#F6F5EF]" />

        <>
          <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 w-full">
            {content.badge && (
              <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-[#101010]/70">
                {content.badge}
              </p>
            )}
            <h1 className="mt-3 font-serif text-[36px] sm:text-[52px] md:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
              {content.headline.prefix}{' '}
              <span className="text-[#1B29FF] text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.9]">
                {content.headline.highlight}
              </span>{' '}
              {content.headline.suffix}
            </h1>
            <p className="mt-4 sm:mt-6 max-w-[62ch] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.5] text-[#222]">
              {content.description}
            </p>
            <div className="mt-3 space-y-2">
              {content.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-[13px] text-[#101010]/60"
                >
                  <svg
                    className="w-4 h-4 text-[#1B29FF]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Live yield badge + Backed by + Team texture */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CurrentYieldBadge />
              <div className="flex items-center gap-2 text-[13px] text-[#101010]/60">
                <span>Backed by</span>
                <OrangeDAOLogo className="h-4 w-auto opacity-70" />
              </div>
              <span className="text-[12px] text-[#101010]/50">
                Created by engineers behind platforms processing billions in
                transactions
              </span>
            </div>

            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Link
                className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
                href={content.cta.primary.href}
              >
                {content.cta.primary.label}
              </Link>
              <Link
                className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
                href={content.cta.secondary.href}
              >
                {content.cta.secondary.label}
              </Link>
            </div>
          </div>
        </>
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Demo indicator - subtle and premium */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#101010]/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#1B29FF] animate-pulse"></div>
              <Link
                className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
                href="/dashboard/demo"
              >
                Try Live Demo
              </Link>
            </div>
          </div>

          <BrowserFrame url="0.finance/dashboard" className="shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-w-[320px]">
              <div className="lg:col-span-8 p-4 sm:p-6 lg:border-r border-b lg:border-b-0 border-[#101010]/10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="uppercase tracking-[0.14em] text-[11px] sm:text-[12px] text-[#101010]/60">
                      Total Balance
                    </div>
                    <div className="mt-2 tabular-nums text-[28px] sm:text-[34px] lg:text-[40px] leading-none font-medium tracking-tight">
                      $2,480,930.22
                    </div>
                    <div className="mt-1 text-[13px] sm:text-[14px] text-[#1B29FF] font-medium">
                      +$679.45 today
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                      Monthly Yield
                    </div>
                    <div className="mt-1 tabular-nums text-[18px] sm:text-[20px] font-medium text-[#1B29FF]">
                      $20,674.42
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#101010]/10 pt-4">
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                    Recent Transactions
                  </div>
                  <table className="mt-2 w-full text-[13px]">
                    <tbody>
                      <tr className="border-b border-[#101010]/5">
                        <td className="py-2">Wire from Chase •••• 1234</td>
                        <td className="text-right tabular-nums font-medium">
                          +$500,000.00
                        </td>
                      </tr>
                      <tr className="border-b border-[#101010]/5">
                        <td className="py-2 text-[#1B29FF]">
                          Daily yield earned
                        </td>
                        <td className="text-right tabular-nums font-medium text-[#1B29FF]">
                          +$679.45
                        </td>
                      </tr>
                      <tr className="border-b border-[#101010]/5">
                        <td className="py-2">ACH to vendor</td>
                        <td className="text-right tabular-nums font-medium">
                          -$12,500.00
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4 flex gap-8 text-[15px]">
                    <a
                      className="text-[#1B29FF] underline underline-offset-4"
                      href="#"
                    >
                      View all →
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 p-4 sm:p-6">
                <div className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Quick Actions
                </div>
                <div className="mt-2 space-y-3">
                  <div className="border-b border-[#101010]/10 pb-3">
                    <div className="text-[13px] font-medium text-[#101010]">
                      ACH / Wire Transfer
                    </div>
                    <dl className="mt-1 text-[12px] space-y-1">
                      <div className="flex justify-between">
                        <dt className="text-[#101010]/60">Routing</dt>
                        <dd className="tabular-nums font-medium">021000021</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-[#101010]/60">Account</dt>
                        <dd className="tabular-nums font-medium">1234567890</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="border-b border-[#101010]/10 pb-3">
                    <div className="text-[13px] font-medium text-[#101010]">
                      Corporate Card
                    </div>
                    <div className="mt-1 text-[12px] text-[#101010]/60">
                      Limit: $25,000/day
                    </div>
                    <Link
                      className="text-[12px] text-[#1B29FF] underline underline-offset-2"
                      href="#"
                    >
                      Manage limits →
                    </Link>
                  </div>

                  <div>
                    <div className="text-[13px] font-medium text-[#101010]">
                      Send Payment
                    </div>
                    <div className="mt-2 flex gap-2 text-[12px]">
                      <span className="border border-[#101010]/10 px-2 py-1">
                        ACH
                      </span>
                      <span className="border border-[#101010]/10 px-2 py-1">
                        SEPA
                      </span>
                      <span className="border border-[#101010]/10 px-2 py-1">
                        USDC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BrowserFrame>
        </div>
      </section>

      {/* How it works */}
      <section className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden">
        {/* Dithering background - very subtle for readability */}
        <div className="absolute inset-0 z-0 opacity-10">
          <Dithering
            colorBack="#00000000"
            colorFront="#1B29FF"
            speed={0.05}
            shape="warp"
            type="4x4"
            size={2}
            scale={0.6}
            pxSize={0.05}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            Simple as any savings account
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Sign Up → Deposit → Earn
          </h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#101010]/10 border border-[#101010]/10 bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
            <div className="p-4 sm:p-6">
              <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                1
              </div>
              <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Create your account
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70">
                Sign up with email in under 60 seconds. No bank connection
                required.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                2
              </div>
              <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Deposit USD
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70">
                Transfer funds to your account.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                3
              </div>
              <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Earn & withdraw anytime
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70">
                Watch your balance grow with daily compounding. Withdraw
                instantly, no penalties or lock-ups.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
