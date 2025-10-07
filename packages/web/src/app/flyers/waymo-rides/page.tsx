'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PDFExportButton } from '@/components/flyers/pdf-export-button';

export default function WaymoRidesFlyerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00C6FF] to-[#0057FF] flex items-center justify-center p-8 print-container">
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
      <div className="flyer-container w-[408px] h-[528px] bg-white relative">
        <div className="absolute top-6 left-6 flex items-center">
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

        <div className="h-full flex flex-col justify-center items-center px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-3">
              <img
                src="/waymo-logo.svg"
                alt="Waymo"
                width={160}
                height={50}
                className="w-[160px] h-auto"
              />
            </div>

            <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Free Waymo
              <br />
              <span className="text-[#00C6FF]">Rides!</span>
            </h1>

            <div className="flex flex-col items-center gap-2.5 pt-2">
              <div className="bg-white border-2 border-[#00C6FF] p-2.5 rounded-lg shadow-lg">
                <QRCodeSVG
                  value="https://dub.sh/techweek"
                  size={120}
                  level="H"
                  fgColor="#00C6FF"
                />
              </div>
              <p className="text-[13px] font-semibold text-[#101010]">
                dub.sh/techweek
              </p>
            </div>

            <div className="pt-1">
              <p className="text-[10px] text-[#101010]/50">
                Valid during <strong>SF Tech Week</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 px-6">
          <p className="text-[8px] text-[#101010]/40 text-center leading-tight">
            Powered by 0 Finance · Business banking meets 8% APY
          </p>
        </div>
      </div>
    </div>
  );
}
