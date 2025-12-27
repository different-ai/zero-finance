'use client';

import { formatUsd, cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

type PortfolioOverviewProps = {
  earningBalance: number;
  idleBalance: number;
  savingsApy: number;
  isTechnical?: boolean;
};

export function PortfolioOverview({
  earningBalance,
  idleBalance,
  savingsApy,
  isTechnical = false,
}: PortfolioOverviewProps) {
  return (
    <div
      className={cn(
        'grid gap-4 p-6',
        'grid-cols-1 md:grid-cols-2',
        isTechnical
          ? 'border border-[#1B29FF]/20'
          : 'border border-[#101010]/10',
      )}
    >
      {/* Column 1 - Earning Balance */}
      <div className="flex flex-col justify-center">
        <p
          className={cn(
            'mb-1',
            isTechnical
              ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
              : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
          )}
        >
          {isTechnical ? 'VAULT::EARNING' : 'Earning'}
        </p>
        <p
          className={cn(
            'tabular-nums',
            isTechnical
              ? 'font-mono text-[28px] text-[#101010]'
              : 'text-[32px] font-semibold text-[#101010]',
          )}
        >
          {formatUsd(earningBalance)}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <TrendingUp
            className={cn(
              'h-3 w-3',
              isTechnical ? 'text-[#1B29FF]' : 'text-green-600',
            )}
          />
          <span
            className={cn(
              'text-[12px]',
              isTechnical
                ? 'font-mono text-[#1B29FF]'
                : 'text-green-600 font-medium',
            )}
          >
            {savingsApy.toFixed(2)}% APY
          </span>
        </div>
      </div>

      {/* Column 2 - Idle Balance */}
      <div
        className={cn(
          'flex flex-col justify-center px-4 py-3 -my-3',
          isTechnical
            ? 'border-l border-[#1B29FF]/10'
            : 'border-l border-[#101010]/10',
        )}
      >
        <p
          className={cn(
            'mb-1',
            isTechnical
              ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
              : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
          )}
        >
          {isTechnical ? 'BALANCE::IDLE' : 'Idle'}
        </p>
        <p
          className={cn(
            'tabular-nums',
            isTechnical
              ? 'font-mono text-[28px] text-[#101010]'
              : 'text-[32px] font-semibold text-[#101010]',
          )}
        >
          {formatUsd(idleBalance)}
        </p>
        <p
          className={cn(
            'mt-1',
            isTechnical
              ? 'font-mono text-[11px] text-[#101010]/50'
              : 'text-[11px] text-[#101010]/50',
          )}
        >
          {isTechnical ? 'NOT_EARNING' : 'Not earning'}
        </p>
      </div>
    </div>
  );
}
