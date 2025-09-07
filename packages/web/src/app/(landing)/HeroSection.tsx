'use client';

import React from 'react';
import Link from 'next/link';
import { GradientBackground } from './GradientBackground';
import { BrowserFrame } from '@/components/BrowserFrame';

export function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-[#101010]/10 bg-[#F6F5EF] overflow-hidden min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center ">
        {/* <GradientBackground variant="hero" className="z-10 bg-transparent top-[-100px]" /> */}
        {/* <GradientBackground variant="hero" className="z-0 bg-[#F6F5EF] rotate-180 bottom-[-100px]" /> */}
        <GradientBackground variant="hero" className="z-0 bg-[#F6F5EF] " />
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-[#101010]/70">
            Insured yield for startups
          </p>
          <h1 className="mt-3 font-serif text-[36px] sm:text-[52px] md:text-[72px] lg:text-[88px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            <span className="block text-[#1B29FF] text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.9]">
              8% Yield
            </span>{' '}
            on Your <span className="italic">Startup&apos;s</span> Savings
          </h1>
          <p className="mt-4 sm:mt-6 max-w-[62ch] text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.5] text-[#222]">
            Open a business account. Deposit USD, EUR, or USDC. Earn
            automatically. Withdraw any time.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <Link
              className="inline-flex items-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] rounded-md transition-colors"
              href="/signin?source=crypto"
            >
              Sign up →
            </Link>
            <Link
              className="inline-flex items-center text-[14px] sm:text-[15px] lg:text-[16px] text-[#101010] hover:text-[#1B29FF] underline decoration-[#101010]/30 underline-offset-[4px] hover:decoration-[#1B29FF] transition-colors"
              href="https://cal.com/team/0finance/30"
            >
              Book demo
            </Link>
          </div>
        </div>

      </section>
      

      {/* Demo Panel - Bank Statement Style */}
      <section className="relative border-y border-[#101010]/10 bg-white/90 overflow-hidden">
        <GradientBackground variant="demo" className="z-0 bg-[#F6F5EF]"/>
        <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Demo indicator - subtle and premium */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#101010]/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-[#1B29FF] rounded-full animate-pulse"></div>
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium">
                Live Demo
              </span>
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
                      +$679.45 today (10% APY)
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
                      Wire Transfer
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
      <section className="bg-[#F6F5EF] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
            See how it works
          </p>
          <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
            Deposit → Earn → Spend
          </h2>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#101010]/10 border border-[#101010]/10 bg-white">
            <div className="p-4 sm:p-6">
              <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                1
              </div>
              <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Deposit funds
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70">
                Open US or EU account numbers instantly and wire USD, EUR, or
                USDC.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                2
              </div>
              <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Earn 8% APY
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70">
                Funds sweep to regulated yield partners. No lockups. Withdraw
                any time.
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                3
              </div>
              <h3 className="mt-2 text-[15px] sm:text-[16px] font-medium text-[#101010]">
                Spend with card
              </h3>
              <p className="mt-1 text-[13px] sm:text-[14px] text-[#101010]/70">
                Set limits and pay via ACH, SEPA, or corporate card from the
                same account.
              </p>
              <div className="mt-3 flex items-center">
                <img
                  src="/Visa_Brandmark_Blue_RGB_2021.png"
                  alt="Visa"
                  className="h-6 w-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
