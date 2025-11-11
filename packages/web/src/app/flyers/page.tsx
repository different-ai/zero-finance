import React from 'react';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function FlyersIndexPage() {
  const flyers = [
    {
      id: 4,
      name: 'Your Idle Cash Could Hire Your Next Engineer',
      description: '8.5×11" - General appeal, 50 copies',
      path: '/flyers/hero',
    },
    {
      id: 7,
      name: 'Congrats on Your $550K YC Check',
      description: '8.5×11" - YC founders, 10% APY, 50 copies',
      path: '/flyers/yc',
    },
    {
      id: 6,
      name: 'Waymo Exclusive',
      description: '4.25×5.5" Postcard - Waymo cars, 50 copies',
      path: '/flyers/waymo',
    },
    {
      id: 8,
      name: 'Free Waymo Rides!',
      description: '4.25×5.5" Postcard - Free rides promo',
      path: '/flyers/waymo-rides',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F2] p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-serif text-[48px] text-[#101010] mb-4">
          SF Flyer Campaign
        </h1>

        <div className="bg-[#EAF0FF] border-2 border-[#1B29FF] rounded-xl p-6 mb-8">
          <h2 className="text-[20px] font-bold text-[#1B29FF] mb-3">
            ✨ Direct PDF Export (High Quality!)
          </h2>
          <ol className="space-y-2 text-[14px] text-[#101010]/80">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B29FF] min-w-[20px]">1.</span>
              <span>Click any flyer below to open it</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B29FF] min-w-[20px]">2.</span>
              <span>
                Click the blue <strong>"Download PDF"</strong> button in the
                top-right
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B29FF] min-w-[20px]">3.</span>
              <span>Wait 2-3 seconds for high-quality PDF generation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[#1B29FF] min-w-[20px]">4.</span>
              <span>PDF automatically downloads to your Downloads folder!</span>
            </li>
          </ol>
          <p className="mt-4 text-[13px] text-white bg-[#1B29FF] rounded-md px-3 py-2">
            <strong>✓ Print-ready quality</strong> · No overflow issues ·
            Perfect sizing for Gold Image Printing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flyers.map((flyer) => (
            <Link
              key={flyer.id}
              href={flyer.path}
              className="bg-white border border-[#101010]/10 rounded-lg p-6 hover:border-[#1B29FF]/40 transition-all shadow-[0_2px_8px_rgba(16,16,16,0.04)] hover:shadow-[0_4px_12px_rgba(16,16,16,0.08)]"
            >
              <h3 className="text-[18px] font-semibold text-[#101010] mb-2">
                Flyer #{flyer.id}
              </h3>
              <p className="text-[16px] font-medium text-[#1B29FF] mb-2">
                {flyer.name}
              </p>
              <p className="text-[14px] text-[#101010]/60">
                {flyer.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white border border-[#101010]/10 rounded-lg">
          <h2 className="text-[20px] font-semibold text-[#101010] mb-4">
            Export Instructions
          </h2>
          <div className="space-y-3 text-[14px] text-[#101010]/70">
            <p>
              <strong>Easiest Method:</strong> Click any flyer, then click the
              blue <strong>Download PDF</strong> button in the top-right corner.
              Your browser will open the print dialog where you can save as PDF.
            </p>
            <p className="pt-3 border-t border-[#101010]/10">
              <strong>Print specs:</strong> 3 flyers, 150 total copies (~$87)
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your Idle Cash (8.5×11"): 50 copies</li>
              <li>YC Check (8.5×11"): 50 copies</li>
              <li>Waymo (4.25×5.5" postcard): 50 copies</li>
            </ul>
            <p className="mt-3 text-[13px] bg-[#EAF0FF] border border-[#1B29FF]/20 rounded-md p-3">
              <strong className="text-[#1B29FF]">💡 Print Shop Tip:</strong>{' '}
              These are standard sizes available at Gold Image Printing SF.
              Request <strong>cardstock paper</strong> with{' '}
              <strong>semi-gloss coating</strong> for best QR code readability.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Flyers #1, #3, #4, #5, #7: Letter size (8.5" × 11")</li>
              <li>Flyer #6 (Waymo): Postcard size (6" × 4" landscape)</li>
            </ul>
            <p className="mt-3 text-[13px] bg-[#EAF0FF] border border-[#1B29FF]/20 rounded-md p-3">
              <strong className="text-[#1B29FF]">📌 Waymo Flyer Tip:</strong> In
              the print dialog, make sure to select <strong>"Landscape"</strong>{' '}
              orientation and set paper size to <strong>"6 × 4"</strong> or
              custom size if your printer doesn't have this preset.
            </p>
            <p className="pt-3 border-t border-[#101010]/10">
              <strong>Gold Image Printing (SF):</strong> $29 same-day service,
              ~$0.58/flyer
              <br />
              <strong>Material:</strong> 14pt Cover | Gloss (sturdy, scannable
              QR codes, vibrant colors)
              <br />
              <strong>Sizes:</strong> 8.5×11" (500 copies) + 4.25×5.5" (100
              copies)
              <br />
              <strong>Total cost estimate:</strong> ~$350 for 600 flyers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
