'use client';

import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-[#101010]/10 bg-[#F7F7F2]">
        <div className="mx-auto max-w-[1200px] px-8 pt-16 pb-12">
          <p className="uppercase tracking-[0.18em] text-sm text-[#101010]/70">
            Insured yield for startups
          </p>
          <h1 className="mt-3 font-serif text-[92px] leading-[0.98] tracking-[-0.01em] text-[#101010]">
            <span className="text-[#1B29FF]">10% Yield</span> on Your <span className="italic">Startup&apos;s</span> Savings
          </h1>
          <p className="mt-6 max-w-[62ch] text-[18px] leading-[1.5] text-[#222]">
            Open a regulated business account. Deposit USD, EUR, or USDC. Earn
            automatically. Withdraw any time.
          </p>
          <div className="mt-10 flex items-center gap-24">
            <Link
              className="text-[18px] font-medium text-[#1B29FF] underline underline-offset-[6px] hover:no-underline transition-all"
              href="/signin?source=crypto"
            >
              Sign up →
            </Link>
            <Link
              className="text-[16px] text-[#101010] hover:text-[#1B29FF] transition-colors"
              href="https://cal.com/potato/0-finance-onboarding"
            >
              Book demo
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Panel - Bank Statement Style */}
      <section className="border-b border-[#101010]/10 bg-white">
        <div className="mx-auto max-w-[1200px] px-8 py-16">
          <div className="border border-[#101010]/10 bg-white">
            <div className="grid grid-cols-12">
              <div className="col-span-8 p-6 border-r border-[#101010]/10">
                <div className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Total Balance
                </div>
                <div className="mt-2 tabular-nums text-[40px] leading-none font-medium tracking-tight">
                  $2,480,930.22
                </div>
                <div className="mt-1 text-[14px] text-[#1B29FF] font-medium">
                  10% APY
                </div>

                <div className="mt-6 border-t border-[#101010]/10 pt-4">
                  <div className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/60">
                    Wire funds instantly
                  </div>
                  <dl className="mt-2 grid grid-cols-[120px_1fr] gap-y-1 text-[14px]">
                    <dt className="text-[#101010]/60">Routing</dt>
                    <dd className="tabular-nums font-medium">021000021</dd>
                    <dt className="text-[#101010]/60">Account</dt>
                    <dd className="tabular-nums font-medium">1234567890</dd>
                  </dl>

                  <div className="mt-4 flex gap-6 text-[15px]">
                    <span className="text-[#1B29FF] underline underline-offset-4 cursor-pointer">
                      Deposit
                    </span>
                    <span className="text-[#101010] hover:text-[#1B29FF] transition-colors cursor-pointer">
                      Earn
                    </span>
                    <span className="text-[#101010] hover:text-[#1B29FF] transition-colors cursor-pointer">
                      Spend
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-4 p-6">
                <div className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
                  Accounts
                </div>
                <ul className="mt-2 space-y-2 text-[14px]">
                  <li className="text-[#101010]">
                    US account <span className="tabular-nums">•••• 6241</span>
                  </li>
                  <li className="text-[#101010]">
                    Corporate card{' '}
                    <Link
                      className="text-[#1B29FF] underline underline-offset-2"
                      href="#"
                    >
                      set daily limit
                    </Link>
                  </li>
                  <li className="text-[#101010]">Payouts ACH • SEPA • USDC</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-[#F7F7F2] py-12">
        <div className="mx-auto max-w-[1200px] px-8">
          <div className="grid grid-cols-3 gap-px bg-[#101010]/10">
            {[
              {
                title: 'Fully insured',
                detail: 'Coverage through regulated partners',
              },
              {
                title: 'Instant US/EU accounts',
                detail: 'Account numbers on sign up',
              },
              {
                title: 'Regulated partner banks',
                detail: 'Serious compliance, real rails',
              },
            ].map((item, index) => (
              <div key={index} className="bg-[#F7F7F2] p-6">
                <h3 className="text-[14px] font-medium text-[#101010]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[13px] text-[#101010]/70">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
