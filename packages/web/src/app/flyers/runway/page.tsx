'use client';

import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import { PrintButton } from '@/components/flyers/print-button';

export default function RunwayFlyerPage() {
  return (
    <div className="min-h-screen bg-[#101010] flex items-center justify-center p-8">
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
      <div className="w-[816px] h-[1056px] bg-[#101010] relative overflow-hidden flex flex-col items-center justify-center p-12">
        {/* Content */}
        <div className="text-center space-y-8 max-w-[650px]">
          {/* Eyebrow */}
          <p className="uppercase tracking-[0.18em] text-[14px] text-white/60 font-medium">
            FOR STARTUPS
          </p>

          {/* Headline */}
          <h1 className="font-serif text-[88px] leading-[0.96] tracking-[-0.015em] text-white">
            Your Runway
            <br />
            <span className="text-[#1B29FF]">Just Got Shorter</span>
          </h1>

          {/* Subheadline */}
          <p className="text-[24px] leading-[1.4] text-white/80 max-w-[500px] mx-auto">
            Your cash earns
            <br />
            <span className="font-semibold text-white">
              0% in traditional banks
            </span>
          </p>

          {/* Divider */}
          <div className="w-32 h-[2px] bg-[#1B29FF] mx-auto"></div>

          {/* Hook */}
          <div className="space-y-2">
            <p className="text-[20px] text-white/60">Get</p>
            <p className="text-[64px] font-bold text-[#1B29FF] leading-none">
              8% APY
            </p>
            <p className="text-[20px] text-white/60">instead</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-4 pt-8">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG
                value="https://0.finance?utm_source=flyer&utm_medium=physical&utm_campaign=sf_techweek&utm_content=runway"
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[18px] font-semibold text-white">
              Scan → 0.finance
            </p>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-[12px] text-white/40">
              Business savings account for startups
              <br />
              No minimums · No lock-ups · Full liquidity
            </p>
          </div>

          {/* YC Badge */}
          <div className="absolute bottom-8 left-8 flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#F26625] flex items-center justify-center text-white font-bold text-[14px]">
                  Y
                </div>
                <span className="text-[11px] text-white/80">YC BACKED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo - Top Left */}
        <div className="absolute top-8 left-8 flex items-center">
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
      </div>
    </div>
  );
}
