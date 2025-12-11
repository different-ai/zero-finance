import React from 'react';
import { LANDING_CONTENT } from './content';

export function WhatYouGetSection() {
  const features = LANDING_CONTENT.features;

  return (
    <section className="relative bg-[#F7F7F2] border-t border-[#101010]/10 py-8 sm:py-12 lg:py-16 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] text-[#101010]/60">
          Why Zero Finance
        </p>
        <h2 className="mt-2 font-serif text-[24px] sm:text-[30px] lg:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          High-Yield Savings for Startups
        </h2>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#101010]/10">
          {features.map((feature) => (
            <div key={feature.id} className="bg-white p-4 sm:p-6">
              <div className="flex justify-between items-start">
                <h3 className="uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[12px] sm:text-[13px] text-[#101010]/70">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-3 text-[13px] sm:text-[14px] leading-[1.5] text-[#101010]/80">
                {feature.description}
              </p>
              {feature.id === 'security' && (
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
