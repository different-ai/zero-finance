'use client';

import dynamic from 'next/dynamic';
import { InsuranceWarning } from '@/components/insurance-warning';

// Import the actual savings page component
const SavingsPageWrapper = dynamic(() => import('../../savings/page-wrapper'), {
  ssr: false,
  loading: () => (
    <div className="border border-[#101010]/10 bg-white rounded-md">
      <div className="p-6 space-y-4">
        <div className="h-12 w-48 bg-[#101010]/5 rounded animate-pulse" />
      </div>
    </div>
  ),
});

export function SavingsWrapper() {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          Savings
        </h2>
        <p className="mt-1 text-[14px] text-[#101010]/60">
          Earn 8% APY on your idle cash reserves
        </p>
      </div>

      {/* Insurance Warning for Savings */}
      <InsuranceWarning variant="savings" dismissible={true} />

      {/* Savings Content */}
      <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        <SavingsPageWrapper />
      </div>
    </div>
  );
}
