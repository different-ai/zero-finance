'use client';

import React from 'react';

export function WhatYouGetSection() {
  return (
    <section className="bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
          Why Zero Finance
        </p>
        <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          High-Yield Savings for Startups
        </h2>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10">
          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Competitive Yield
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Earn significantly more than traditional banks on your idle cash.
              Your funds are automatically allocated to vetted yield strategies
              with institutional-grade insurance coverage. Withdraw anytime with
              zero penalties or lock-ups.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              No Minimums, Full Liquidity
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Start earning from day one with no minimum balance requirements.
              Your funds remain fully liquid — withdraw any amount, any time.
              Perfect for managing runway while maximizing returns on idle
              capital.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Instant Global Banking
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Open US and EU bank accounts in seconds. Get ACH routing numbers
              and SEPA IBANs instantly. Receive wire transfers, ACH payments,
              and SEPA transfers directly to your high-yield account.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Institutional-Grade Security
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Bank-level security with self-custody benefits. Your funds are
              protected by multi-layer insurance coverage and battle-tested DeFi
              protocols securing $8B+ in assets. Email login for easy access.
            </p>
            <div className="mt-4 flex items-center gap-6">
              <a
                href="https://privy.io"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity flex items-center"
              >
                <img
                  src="/Privy_Brandmark_Black.svg"
                  alt="Privy"
                  className="h-5 w-auto"
                />
              </a>
              <span className="text-[#101010]/30">×</span>
              <a
                href="https://safe.global"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity flex items-center"
              >
                <img
                  src="https://github.com/safe-global/safe-core-sdk/blob/main/assets/logo.png?raw=true"
                  alt="Safe"
                  className="h-5 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
