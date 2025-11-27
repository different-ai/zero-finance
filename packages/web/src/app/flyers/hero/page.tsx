import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PDFExportButton } from '@/components/flyers/pdf-export-button';

// Force dynamic rendering since we use client components
export const dynamic = 'force-dynamic';

export default function HeroFlyerPage() {
  return (
    <div className="min-h-screen bg-[#F6F5EF] flex items-center justify-center p-8">
      <PDFExportButton
        flyerId="hero"
        flyerName="Your Idle Cash"
        pageSize="letter"
      />
      {/* 8.5" x 11" ratio container */}
      <div className="flyer-container w-[816px] h-[1056px] bg-white relative flex flex-col p-16">
        {/* Logo - Top */}
        <div className="flex items-center mb-16">
          <img
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

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-8">
            {/* Eyebrow */}
            <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60">
              TURN IDLE CASH INTO HEADCOUNT
            </p>

            {/* Headline */}
            <h1 className="font-serif text-[56px] sm:text-[64px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
              <span className="block text-[72px] text-[#1B29FF] mb-2">
                Your idle cash
              </span>
              could hire your <span className="italic">next engineer</span>
            </h1>

            {/* Subheadline */}
            <p className="text-[18px] leading-[1.5] text-[#101010]/80 max-w-[550px]">
              Open US or EU account numbers, wire USD or USDC. We automatically
              place your funds into vetted yield strategies with insurance
              coverage up to $1M from a licensed insurer. Withdraw any time.
            </p>

            {/* Key Stat */}
            <div className="flex items-center gap-2 text-[15px] text-[#101010]/70">
              <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-[#1B29FF]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>
                Built on battle-tested money markets securing $8B+ in assets
              </span>
            </div>

            {/* QR Code */}
            <div className="pt-8 flex items-center gap-8">
              <div>
                <div className="bg-white border border-[#101010]/10 p-4 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
                  <QRCodeSVG
                    value="https://0.finance?utm_source=flyer&utm_medium=physical&utm_campaign=sf_techweek&utm_content=hero&ref=sf-techweek-hero-qr"
                    size={140}
                    level="H"
                  />
                </div>
              </div>
              <div>
                <p className="text-[14px] text-[#101010]/60 mb-1">
                  Scan to open account
                </p>
                <p className="text-[20px] font-semibold text-[#0050ff]">
                  0.finance
                </p>
                <p className="text-[16px] text-[#1B29FF] mt-2">Earn 8% APY</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
