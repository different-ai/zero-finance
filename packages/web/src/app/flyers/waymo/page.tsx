'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Sparkles } from 'lucide-react';
import { PDFExportButton } from '@/components/flyers/pdf-export-button';

export default function WaymoFlyerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B29FF] to-[#0050ff] flex items-center justify-center p-8 print-container">
      <PDFExportButton
        flyerId="waymo"
        flyerName="Waymo Exclusive"
        pageSize="postcard"
      />
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .print-container {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent !important;
          }
          @page {
            size: 4.25in 5.5in;
            margin: 0;
          }
        }
      `}</style>
      <div className="flyer-container w-[408px] h-[528px] bg-white relative flex flex-col p-6 print:p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src="/new-logo-bluer.png"
              alt="0 Finance"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="ml-1 font-bold text-[14px] tracking-tight text-[#0050ff]">
              finance
            </span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center space-y-3">
          <div className="text-center space-y-3">
            <h1 className="font-serif text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Found this in your
              <br />
              <span className="text-[#1B29FF]">Waymo</span>?
            </h1>

            <p className="text-[12px] leading-[1.4] text-[#101010]/70">
              You're one of <strong>100 SF founders</strong>
              <br />
              getting early access
            </p>

            <div className="py-3 space-y-1.5">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-[36px] font-bold text-[#1B29FF] leading-none">
                  8%
                </span>
                <span className="text-[16px] text-[#101010]/70">APY</span>
              </div>
              <p className="text-[11px] text-[#101010]/60">
                Business savings account
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 pt-1">
              <div className="bg-white border-2 border-[#1B29FF] p-2 rounded-lg shadow-lg">
                <QRCodeSVG
                  value="https://0.finance?utm_source=flyer&utm_medium=physical&utm_campaign=sf_techweek&utm_content=waymo&ref=sf-techweek-waymo-qr"
                  size={115}
                  level="H"
                  fgColor="#1B29FF"
                />
              </div>
              <p className="text-[12px] font-semibold text-[#101010]">
                0.finance
              </p>
            </div>

            <div className="pt-1">
              <p className="text-[10px] text-[#101010]/50">
                Scan before <strong>Oct 15</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#101010]/10">
          <p className="text-[8px] text-[#101010]/40 text-center leading-tight">
            No minimums · No lock-ups · Full liquidity
          </p>
        </div>
      </div>
    </div>
  );
}
