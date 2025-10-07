'use client';

import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { Check } from 'lucide-react';
import { PrintButton } from '@/components/flyers/print-button';

export default function APYFlyerPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center p-8">
      <PrintButton />
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: letter;
            margin: 0;
          }
        }
      `}</style>
      {/* 8.5" x 11" ratio container */}
      <div className="w-[816px] h-[1056px] bg-white relative overflow-hidden flex flex-col p-16">
        {/* Logo - Top */}
        <div className="flex items-center mb-12">
          <Image
            src="/new-logo-bluer.png"
            alt="0 Finance"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="ml-2 font-bold text-[18px] tracking-tight text-[#0050ff]">
            finance
          </span>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center space-y-12">
          {/* Headline */}
          <div className="text-center">
            <p className="uppercase tracking-[0.14em] text-[14px] text-[#101010]/60 mb-6">
              BUSINESS SAVINGS ACCOUNT
            </p>
            <h1 className="font-serif text-[140px] leading-none tracking-[-0.02em] text-[#1B29FF] font-bold mb-4">
              8%
            </h1>
            <p className="text-[36px] font-semibold text-[#101010] tracking-tight">
              APY
            </p>
            <p className="text-[20px] text-[#101010]/70 mt-4">For Startups</p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-[500px] mx-auto w-full">
            {[
              'No minimums',
              'No lock-ups',
              'Full liquidity',
              'Instant withdrawals',
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-6 w-6 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-[#1B29FF]" />
                </div>
                <span className="text-[18px] font-medium text-[#101010]">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="bg-white border border-[#101010]/10 p-6 rounded-xl shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
              <QRCodeSVG
                value="https://0.finance?utm_source=flyer&utm_medium=physical&utm_campaign=sf_techweek&utm_content=apy"
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="text-center">
              <p className="text-[18px] font-semibold text-[#101010] mb-1">
                Start Earning →
              </p>
              <p className="text-[16px] text-[#0050ff] font-medium">
                0.finance
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-[#101010]/10 text-center">
          <p className="text-[11px] text-[#101010]/50">
            8% target yield through vetted strategies with insurance coverage
          </p>
        </div>
      </div>
    </div>
  );
}
