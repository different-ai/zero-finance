'use client';

import { formatUsd } from '@/lib/utils';
import { AnimatedTotalEarnedV2 } from '@/components/animated-total-earned-v2';
import { AnimatedTotalEarned } from '@/components/animated-total-earned';

type PortfolioOverviewProps = {
  totalSaved: number;
  isDemoMode: boolean;
  safeAddress: string | null;
  fallbackApyPercent: number;
  averageInstantApy: number;
  animatedBalance: number;
  animatedInitialEarned: number;
  vaultCount: number;
};

export function PortfolioOverview({
  totalSaved,
  isDemoMode,
  safeAddress,
  fallbackApyPercent,
  averageInstantApy,
  animatedBalance,
  animatedInitialEarned,
  vaultCount,
}: PortfolioOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6 sm:p-8 overflow-hidden">
        <p className="uppercase tracking-[0.16em] text-[11px] text-[#101010]/60 mb-3">
          Savings Balance
        </p>
        <p className="font-serif text-[32px] sm:text-[40px] leading-[0.95] tabular-nums text-[#101010]">
          {formatUsd(totalSaved)}
        </p>
        <p className="mt-3 text-[13px] text-[#101010]/60">
          Deposited across {vaultCount}{' '}
          {vaultCount === 1 ? 'strategy' : 'strategies'}
        </p>
      </div>

      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6 sm:p-8 overflow-hidden">
        <p className="uppercase tracking-[0.16em] text-[11px] text-[#101010]/60 mb-3">
          Total Earned
        </p>
        <p className="font-serif text-[32px] sm:text-[40px] leading-[0.95] tabular-nums text-[#1B29FF]">
          {isDemoMode ? (
            <AnimatedTotalEarned
              initialEarned={animatedInitialEarned}
              apy={averageInstantApy}
              balance={animatedBalance}
            />
          ) : safeAddress ? (
            <AnimatedTotalEarnedV2
              safeAddress={safeAddress}
              fallbackApy={fallbackApyPercent}
              fallbackBalance={totalSaved}
              className="inline-block"
            />
          ) : (
            <span className="text-[#101010]/40">Calculating...</span>
          )}
        </p>
        <p className="mt-3 text-[13px] text-[#101010]/60">
          Live counter updates in real-time
        </p>
      </div>
    </div>
  );
}
