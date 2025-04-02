'use client';

import LiveBalance from '@/components/live-balance';

export default function TestBalancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 bg-white">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">LiveBalance Component Test</h1>
        <div className="w-full mb-6">
          <LiveBalance />
        </div>
        <div className="text-sm text-gray-500 mt-4 text-center">
          <p>This page tests the LiveBalance component directly.</p>
          <p>Debug info: Using fallback balance if no real balance is available.</p>
        </div>
      </div>
    </main>
  );
} 