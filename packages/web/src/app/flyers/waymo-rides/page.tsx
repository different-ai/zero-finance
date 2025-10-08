'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PDFExportButton } from '@/components/flyers/pdf-export-button';
import FlyerGradient from '@/app/(landing)/flyer-gradient';

export default function WaymoRidesFlyerPage() {
  return (
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
      <FlyerGradient className="z-0 bg-[#F6F5EF]" />

      <PDFExportButton
        flyerId="waymo-rides"
        flyerName="Waymo Rides"
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
          @page {
            size: 4.25in 5.5in;
            margin: 0;
          }
        }
      `}</style>

      <div className="flyer-container relative z-10 w-[408px] h-[528px] bg-white border border-[#101010]/10 rounded-xl shadow-[0_2px_8px_rgba(16,16,16,0.04)] overflow-hidden">
        <div className="h-full flex flex-col justify-center items-center px-8 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/new-logo-bluer.png"
                alt="0 Finance"
                width={52}
                height={52}
                className="w-13 h-13"
              />
              <span className="ml-2 font-bold text-[22px] tracking-tight text-[#0050ff]">
                finance
              </span>
            </div>

            <h1 className="font-serif text-[44px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
              Free Waymo
              <br />
              <span className="text-[#1B29FF]">Rides!</span>
            </h1>

            <p className="text-[15px] leading-[1.5] text-[#101010]/70 max-w-[280px] mx-auto">
              Scan for free rides during SF Tech Week
            </p>

            <div className="flex flex-col items-center pt-4">
              <div className="bg-white border-2 border-[#1B29FF] p-3 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
                <QRCodeSVG
                  value="https://dub.sh/techweek"
                  size={140}
                  level="H"
                  fgColor="#1B29FF"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 px-8">
          <p className="text-[11px] text-[#101010]/50 text-center leading-tight">
            Powered by 0 Finance · 8% Savings business account
          </p>
        </div>
      </div>
    </section>
  );
}
