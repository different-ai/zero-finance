"use client";

import dynamic from 'next/dynamic';

const ShareStartupClient = dynamic(() => import('./ShareStartupClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF4] via-white to-[#EEF2FF] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <p className="text-xl font-bold text-[#1B29FF]">Loading Launch Pad...</p>
      </div>
    </div>
  ),
});

export default function ShareStartupPage() {
  return <ShareStartupClient />;
}
