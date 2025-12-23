'use client';

import { formatUsd, cn } from '@/lib/utils';
import { BlueprintGrid, Crosshairs } from '@/components/ui/bimodal';

type PortfolioOverviewProps = {
  totalSaved: number;
  vaultCount: number;
  isTechnical?: boolean;
};

export function PortfolioOverview({
  totalSaved,
  vaultCount,
  isTechnical = false,
}: PortfolioOverviewProps) {
  return (
    <div>
      {/* Savings Balance Card */}
      <div
        className={cn(
          'relative overflow-hidden p-6 sm:p-8 transition-all duration-300',
          isTechnical
            ? 'bg-white border border-[#1B29FF]/20 rounded-sm'
            : 'bg-white border border-[#101010]/10 rounded-[12px]',
        )}
      >
        {isTechnical && <BlueprintGrid />}
        {isTechnical && <Crosshairs position="top-left" />}
        {isTechnical && (
          <div className="absolute top-2 right-2 font-mono text-[9px] text-[#1B29FF]/40">
            BAL::TOTAL
          </div>
        )}

        <div className="relative z-10">
          <p
            className={cn(
              'mb-3',
              isTechnical
                ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                : 'uppercase tracking-[0.16em] text-[11px] text-[#101010]/60',
            )}
          >
            {isTechnical ? 'BALANCE::SAVINGS' : 'Savings Balance'}
          </p>

          {isTechnical ? (
            <>
              <p className="font-mono text-[28px] tabular-nums text-[#101010]">
                {totalSaved.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="ml-1 text-[14px] text-[#1B29FF]">USDC</span>
              </p>
              <p className="mt-2 font-mono text-[11px] text-[#101010]/60">
                ≈ {formatUsd(totalSaved)} USD
              </p>
            </>
          ) : (
            <p className="font-serif text-[32px] sm:text-[40px] leading-[0.95] tabular-nums text-[#101010]">
              {formatUsd(totalSaved)}
            </p>
          )}

          <p
            className={cn(
              'mt-3',
              isTechnical
                ? 'font-mono text-[11px] text-[#101010]/50'
                : 'text-[13px] text-[#101010]/60',
            )}
          >
            {isTechnical
              ? `VAULTS: ${vaultCount} | STATUS: ACTIVE`
              : `Deposited across ${vaultCount} ${vaultCount === 1 ? 'strategy' : 'strategies'}`}
          </p>
        </div>
      </div>
    </div>
  );
}
