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
              8% APY - Insured
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              We provide insurance coverage on 8% annual yield through our
              partnership with Chainproof. Yield opportunities are carefully
              vetted but as with any investment, returns cannot be guaranteed.
              Your capital is protected through our insurance program.
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
            <div className="mt-4">
              <img
                src="Visa_Brandmark_Blue_RGB_2021.png"
                alt="Visa"
                className="h-5 w-auto opacity-70"
              />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6">
            <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
              Complete Self-Custody
            </h3>
            <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
              Email-type login for easy access. Your funds are secured on-chain
              for institutional-grade protection. Your keys, your control.
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
