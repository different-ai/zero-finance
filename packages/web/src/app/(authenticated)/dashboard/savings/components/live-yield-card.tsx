'use client';

import { cn } from '@/lib/utils';
import { AnimatedYieldCounter } from '@/components/animated-yield-counter';

type LiveYieldCardProps = {
  totalSaved: number;
  averageApy: number;
  isTechnical: boolean;
};

/**
 * Live Yield Counter Card
 *
 * Displays real-time yield accumulation with animated counter.
 * Only renders when user has funds saved (totalSaved > 0).
 *
 * Supports bimodal display:
 * - Banking mode: Clean, minimal card design
 * - Technical mode: Blueprint grid with protocol indicators
 */
export function LiveYieldCard({
  totalSaved,
  averageApy,
  isTechnical,
}: LiveYieldCardProps) {
  if (totalSaved <= 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden p-8 transition-all duration-300',
        isTechnical
          ? 'bg-white border border-[#1B29FF]/20 rounded-sm'
          : 'bg-white border border-[#101010]/10 rounded-[12px]',
      )}
    >
      {/* Technical mode blueprint grid background */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(27,41,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(27,41,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* Technical mode label */}
      {isTechnical && (
        <div className="absolute top-2 right-2 font-mono text-[9px] text-[#1B29FF]/40">
          CALC::REALTIME
        </div>
      )}

      <div className="relative z-10">
        <p
          className={cn(
            'mb-6',
            isTechnical
              ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
              : 'uppercase tracking-[0.14em] text-[11px] text-[#101010]/60',
          )}
        >
          {isTechnical
            ? 'YIELD_STREAM::BLOCK_BY_BLOCK'
            : 'Real-Time Yield Accumulation'}
        </p>

        {isTechnical && (
          <div className="absolute top-0 right-0 flex gap-2">
            <span className="font-mono text-[9px] text-[#1B29FF]/60 bg-[#1B29FF]/5 px-1.5 py-0.5 rounded">
              GAS_SAVED::OPTIMIZED
            </span>
          </div>
        )}

        <AnimatedYieldCounter
          principal={totalSaved}
          apy={averageApy}
          showDaily={true}
          showMonthly={true}
          showYearly={true}
          formatOptions={{
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          }}
        />
      </div>
    </div>
  );
}
