'use client';

import React from 'react';

export function WhatYouGetSection() {
  return (
    <section className="bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
          Product features
        </p>
        <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          What&apos;s Inside Your Account
        </h2>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10">
          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              10% APY - Fully Insured
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Earn 10% annual yield on your USDC holdings with enterprise-grade
              insurance from Chainproof. Your funds are protected while
              generating consistent returns.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Instant Global Banking
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Open US and EU bank accounts in seconds. Get ACH routing numbers
              and SEPA IBANs instantly linked to your wallet for seamless
              fiat-crypto operations.
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Corporate Cards
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Spend directly from your balance anywhere in the world. Built-in
              spend management, real-time controls, and instant settlement from
              your USDC holdings.
              <span className="ml-2 text-[12px] text-[#1B29FF]">
                [Coming soon]
              </span>
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Complete Self-Custody
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Maintain full control of your funds with your own keys. Choose
              between managed wallets for convenience or bring your own for
              maximum security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
