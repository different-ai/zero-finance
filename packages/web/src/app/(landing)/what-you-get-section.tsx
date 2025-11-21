'use client';

import React from 'react';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';
import { LANDING_CONTENT } from './content';

export function WhatYouGetSection() {
  const { isTechnical } = useBimodal();
  const features = LANDING_CONTENT.features[isTechnical ? 'technical' : 'company'];

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
          {features.map((feature) => (
            <div
              key={feature.id}
              className={cn(
                'bg-white p-4 sm:p-6',
                isTechnical && 'border-l-2 border-[#1B29FF]',
              )}
            >
              <div className="flex justify-between items-start">
                <h3
                  className={cn(
                    'uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px]',
                    isTechnical
                      ? 'font-mono text-[#1B29FF]'
                      : 'text-[#101010]/70',
                  )}
                >
                  {feature.title}
                </h3>
                {isTechnical && feature.technicalMetadata && (
                  <span className="font-mono text-[10px] text-[#101010]/40 bg-[#101010]/5 px-1.5 py-0.5 rounded">
                    {feature.technicalMetadata.label}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  'mt-3 text-[13px] sm:text-[14px] leading-[1.5]',
                  isTechnical
                    ? 'font-mono text-[#101010]/70'
                    : 'text-[#101010]/80',
                )}
              >
                {feature.description}
              </p>
              {isTechnical && feature.technicalMetadata?.specs && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#101010]/10 pt-3">
                  {Object.entries(feature.technicalMetadata.specs).map(
                    ([key, value]) => (
                      <div key={key}>
                        <div className="text-[10px] uppercase tracking-wider text-[#101010]/40 font-mono">
                          {key}
                        </div>
                        <div className="text-[12px] font-mono text-[#101010] tabular-nums">
                          {value}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
              {feature.id === 'security' && !isTechnical && (
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
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
