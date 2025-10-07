'use client';

import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { PrintButton } from '@/components/flyers/print-button';

export default function SFFlyerPage() {
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

        {/* Headline */}
        <div className="mb-12">
          <h1 className="font-serif text-[64px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
            SF Founders:
            <br />
            <span className="text-[#1B29FF]">Stop Losing Money</span>
          </h1>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1">
          <p className="text-[14px] uppercase tracking-[0.14em] text-[#101010]/60 mb-6">
            TRADITIONAL BANKS
          </p>

          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Old Way */}
            <div className="space-y-3">
              <p className="text-[18px] font-semibold text-[#101010]/50">
                Old Way:
              </p>
              <div className="font-mono text-[20px] text-[#101010]/60 space-y-1">
                <p>$500K × 0%</p>
                <p className="text-[32px] font-bold text-[#101010]/40">= $0</p>
              </div>
            </div>

            {/* New Way */}
            <div className="space-y-3">
              <p className="text-[18px] font-semibold text-[#1B29FF]">
                New Way:
              </p>
              <div className="font-mono text-[20px] text-[#1B29FF] space-y-1">
                <p>$500K × 8%</p>
                <p className="text-[32px] font-bold">= $40K/year</p>
              </div>
            </div>
          </div>

          {/* Impact Statement */}
          <div className="bg-[#EAF0FF] border border-[#1B29FF]/20 rounded-lg p-8 mb-8">
            <p className="text-[24px] font-semibold text-[#101010] text-center">
              That's a <span className="text-[#1B29FF]">new hire</span>
            </p>
            <p className="text-[14px] text-[#101010]/60 text-center mt-2">
              Or 6 months of runway extension
            </p>
          </div>

          {/* QR Code Section */}
          <div className="flex items-center justify-between pt-8 border-t border-[#101010]/10">
            <div>
              <p className="text-[18px] font-semibold text-[#101010] mb-2">
                Switch to 0 Finance
              </p>
              <p className="text-[14px] text-[#101010]/60 mb-4">
                No minimums · No lock-ups
                <br />
                Full liquidity · Instant withdrawals
              </p>
              <p className="text-[16px] font-medium text-[#0050ff]">
                0.finance
              </p>
            </div>

            <div className="bg-white border border-[#101010]/10 p-4 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
              <QRCodeSVG
                value="https://0.finance?utm_source=flyer&utm_medium=physical&utm_campaign=sf_techweek&utm_content=sf_founders"
                size={140}
                level="H"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#101010]/10 text-center">
          <p className="text-[11px] text-[#101010]/50">
            8% target yield through vetted strategies with insurance coverage
          </p>
        </div>
      </div>
    </div>
  );
}
