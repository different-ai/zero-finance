'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PDFExportButton } from '@/components/flyers/pdf-export-button';

export default function YCFlyerPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center p-8">
      <PDFExportButton flyerId="yc" flyerName="YC Check" pageSize="letter" />
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
      <div className="flyer-container w-[816px] h-[1056px] bg-white relative flex flex-col p-12">
        <div className="flex items-center mb-8">
          <img
            src="/new-logo-bluer.png"
            alt="0 Finance"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span className="ml-2 font-bold text-[20px] tracking-tight text-[#0050ff]">
            finance
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center space-y-8">
            <h1 className="font-serif text-[56px] leading-[1] tracking-[-0.02em] text-[#101010]">
              Congrats on your
              <br />
              <span className="text-[#F26625]">$550K YC check</span>
            </h1>

            <div className="py-6 border-y border-[#101010]/10">
              <p className="text-[36px] font-semibold text-[#101010] mb-4">
                Missing $50K?
              </p>
              <p className="text-[18px] text-[#101010]/70 max-w-[520px] mx-auto leading-relaxed">
                YC founders get an{' '}
                <strong className="text-[#F26625]">exclusive 10% APY</strong>{' '}
                with 0 Finance
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FFF5F0] border border-[#F26625]/30 rounded-xl p-7">
                <div className="flex items-baseline justify-center gap-3 mb-3">
                  <span className="text-[72px] font-bold text-[#F26625] leading-none">
                    10%
                  </span>
                  <span className="text-[28px] text-[#101010]/70">APY</span>
                </div>
                <p className="text-[16px] text-[#101010]/60">
                  That's <strong>$50K/year</strong> on $500K
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-[14px] text-[#101010]/60">
                <svg
                  className="w-4 h-4 text-[#1B29FF]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>No minimums · No lock-ups · Full liquidity</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 pt-4">
              <div className="bg-white border-2 border-[#F26625] p-3 rounded-xl shadow-lg">
                <QRCodeSVG
                  value="https://0.finance?utm_source=flyer&utm_medium=physical&utm_campaign=sf_techweek&utm_content=yc&ref=sf-techweek-yc-qr"
                  size={160}
                  level="H"
                  fgColor="#F26625"
                />
              </div>
              <div className="text-center">
                <p className="text-[15px] font-semibold text-[#101010]">
                  Scan to open account
                </p>
                <p className="text-[18px] font-bold text-[#0050ff]">
                  0.finance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#101010]/10 flex items-center justify-between mt-8">
          <p className="text-[11px] text-[#101010]/50 leading-tight max-w-[620px]">
            10% exclusive yield for YC founders through vetted strategies with
            insurance coverage
          </p>
          <img
            src="/yc-logo.png"
            alt="YC"
            width={36}
            height={36}
            className="w-9 h-9 flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
