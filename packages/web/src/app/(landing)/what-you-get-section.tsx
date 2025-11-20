'use client';

import React from 'react';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

export function WhatYouGetSection() {
  const { isTechnical } = useBimodal();

  return (
    <section className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden">
      {/* Blueprint grid for technical mode */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1B29FF 1px, transparent 1px),
              linear-gradient(to bottom, #1B29FF 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p
          className={cn(
            'uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px]',
            isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/60',
          )}
        >
          {isTechnical ? 'FEATURES::TECHNICAL_SPEC' : 'Why Zero Finance'}
        </p>
        <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          {isTechnical
            ? 'API-First Treasury Infrastructure'
            : 'High-Yield Savings for Startups'}
        </h2>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10">
          <div
            className={cn(
              'bg-white p-4 sm:p-6',
              isTechnical && 'border-l-2 border-[#1B29FF]',
            )}
          >
            <h3
              className={cn(
                'uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px]',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical ? 'INTEGRATION::API' : 'Competitive Yield'}
            </h3>
            <p
              className={cn(
                'mt-3 text-[13px] sm:text-[14px] leading-[1.5]',
                isTechnical
                  ? 'font-mono text-[#101010]/70'
                  : 'text-[#101010]/80',
              )}
            >
              {isTechnical
                ? 'RESTful API with comprehensive docs. Embed treasury management in your app with 4 lines of code. Sub-1 week integration time with white-label support.'
                : 'Earn significantly more than traditional banks on your idle cash. Your funds are automatically allocated to vetted yield strategies with institutional-grade insurance coverage. Withdraw anytime with zero penalties or lock-ups.'}
            </p>
          </div>

          <div
            className={cn(
              'bg-white p-4 sm:p-6',
              isTechnical && 'border-l-2 border-[#1B29FF]',
            )}
          >
            <h3
              className={cn(
                'uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px]',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical
                ? 'ARCHITECTURE::NON_CUSTODIAL'
                : 'No Minimums, Full Liquidity'}
            </h3>
            <p
              className={cn(
                'mt-3 text-[13px] sm:text-[14px] leading-[1.5]',
                isTechnical
                  ? 'font-mono text-[#101010]/70'
                  : 'text-[#101010]/80',
              )}
            >
              {isTechnical
                ? 'Self-custodial architecture. Users own private keys. Programmable withdrawals via smart contracts. Built on Safe{Wallet} and battle-tested DeFi protocols.'
                : 'Start earning from day one with no minimum balance requirements. Your funds remain fully liquid — withdraw any amount, any time. Perfect for managing runway while maximizing returns on idle capital.'}
            </p>
          </div>

          <div
            className={cn(
              'bg-white p-4 sm:p-6',
              isTechnical && 'border-l-2 border-[#1B29FF]',
            )}
          >
            <h3
              className={cn(
                'uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px]',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical ? 'PROTOCOLS::VETTED' : 'Instant Global Banking'}
            </h3>
            <p
              className={cn(
                'mt-3 text-[13px] sm:text-[14px] leading-[1.5]',
                isTechnical
                  ? 'font-mono text-[#101010]/70'
                  : 'text-[#101010]/80',
              )}
            >
              {isTechnical
                ? 'Integration with Origin Protocol, Morpho, Gauntlet. Audited smart contracts. Real-time yield optimization. Transparent on-chain settlement.'
                : 'Open US and EU bank accounts in seconds. Get ACH routing numbers and SEPA IBANs instantly. Receive wire transfers, ACH payments, and SEPA transfers directly to your high-yield account.'}
            </p>
          </div>

          <div
            className={cn(
              'bg-white p-4 sm:p-6',
              isTechnical && 'border-l-2 border-[#1B29FF]',
            )}
          >
            <h3
              className={cn(
                'uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px]',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical
                ? 'DEPLOYMENT::WHITE_LABEL'
                : 'Institutional-Grade Security'}
            </h3>
            <p
              className={cn(
                'mt-3 text-[13px] sm:text-[14px] leading-[1.5]',
                isTechnical
                  ? 'font-mono text-[#101010]/70'
                  : 'text-[#101010]/80',
              )}
            >
              {isTechnical
                ? 'Fully customizable UI. Your branding, your domain. Embed as iframe or native component. Full control over user experience and flows.'
                : 'Bank-level security with self-custody benefits. Your funds are protected by multi-layer insurance coverage and battle-tested DeFi protocols securing $8B+ in assets. Email login for easy access.'}
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
