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
      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6">
        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
          Savings Balance
        </p>
        <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#101010]">
          {formatUsd(totalSaved)}
        </p>
        <p className="mt-2 text-[13px] text-[#101010]/60">
          Deposited across {vaultCount} active strategies.
        </p>
      </div>

      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6">
        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
          Earnings (Live)
        </p>
        <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
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
        <p className="mt-2 text-[13px] text-[#101010]/60">
          Live counter refreshes as vault yield accrues.
        </p>
      </div>
    </div>
  );
}
