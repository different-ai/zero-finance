/**
 * Total Balance Card - Main balance display with expandable account details
 * Shows aggregated balance across all chains with progressive disclosure
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { SafeInfo } from '@/lib/types/multi-chain';
import { NetworkBadge } from './network-badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TotalBalanceCardProps {
  totalBalance: string;
  weeklyGain: string;
  safes: SafeInfo[];
  onCollectFromVaults: () => void;
  onCollectToBase: () => void;
  className?: string;
}

/**
 * TotalBalanceCard - Primary balance overview with multi-chain account details
 *
 * Design Language Compliance:
 * - Card: bg-[#F7F7F2] with border-[#101010]/10
 * - Large amounts: text-[32px] font-medium tabular-nums
 * - Labels: text-[11px] uppercase tracking-[0.14em] text-[#101010]/60
 * - Primary button: bg-[#1B29FF]
 * - Progressive disclosure: accounts collapsed by default
 * - Spacing: p-5, gap-4 (following 8px base unit)
 */
export function TotalBalanceCard({
  totalBalance,
  weeklyGain,
  safes,
  onCollectFromVaults,
  onCollectToBase,
  className,
}: TotalBalanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter deployed safes with balance
  const deployedSafes = safes.filter((safe) => safe.isDeployed);
  const accountCount = deployedSafes.length;

  return (
    <div
      className={cn(
        'bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-5',
        className,
      )}
    >
      {/* Label */}
      <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
        Total Balance
      </p>

      {/* Large balance display */}
      <div className="text-[32px] font-medium tabular-nums text-[#101010]">
        {totalBalance}
      </div>

      {/* Weekly gain */}
      <div className="text-[13px] text-[#10b981] mt-1">
        +{weeklyGain} this week
      </div>

      {/* Expandable accounts section */}
      {accountCount > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-left py-2 px-3 rounded-md hover:bg-[#101010]/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-[#101010]/80">
                {accountCount} {accountCount === 1 ? 'Account' : 'Accounts'}
              </span>
              {!isExpanded && deployedSafes.length > 0 && (
                <div className="flex -space-x-1">
                  {deployedSafes.slice(0, 3).map((safe, i) => (
                    <NetworkBadge
                      key={`${safe.chainId}-${i}`}
                      chainId={safe.chainId}
                      size="sm"
                      className="border-2 border-[#F7F7F2]"
                    />
                  ))}
                  {deployedSafes.length > 3 && (
                    <div className="inline-flex items-center justify-center size-6 rounded-md bg-[#101010]/10 border-2 border-[#F7F7F2] text-[10px] text-[#101010]/60">
                      +{deployedSafes.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isExpanded ? (
              <ChevronUp className="size-4 text-[#101010]/60" />
            ) : (
              <ChevronDown className="size-4 text-[#101010]/60" />
            )}
          </button>

          {/* Expanded account list */}
          {isExpanded && (
            <div className="mt-3 space-y-2">
              {deployedSafes.map((safe, index) => (
                <div
                  key={`${safe.safeAddress}-${safe.chainId}`}
                  className="flex items-center justify-between p-3 bg-white/50 rounded-md border border-[#101010]/10"
                >
                  <div className="flex items-center gap-3">
                    <NetworkBadge chainId={safe.chainId} size="sm" />
                    <div>
                      <p className="text-[13px] font-medium text-[#101010]">
                        Account {index + 1}
                      </p>
                      <p className="text-[11px] text-[#101010]/60 font-mono">
                        {safe.safeAddress.slice(0, 6)}...
                        {safe.safeAddress.slice(-4)}
                      </p>
                    </div>
                  </div>

                  {safe.balance !== undefined && (
                    <div className="text-right">
                      <p className="text-[13px] font-medium tabular-nums text-[#101010]">
                        ${(Number(safe.balance) / 1e6).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mt-5 pt-4 border-t border-[#101010]/10">
        <Button
          onClick={onCollectFromVaults}
          className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium py-2.5 rounded-md transition-colors"
        >
          Collect from Vaults
        </Button>
        <Button
          onClick={onCollectToBase}
          variant="outline"
          className="flex-1 border border-[#101010]/20 hover:border-[#101010]/40 bg-white text-[#101010] font-medium py-2.5 rounded-md transition-colors"
        >
          Collect to Base
        </Button>
      </div>
    </div>
  );
}

/**
 * TotalBalanceCardSkeleton - Loading state for TotalBalanceCard
 */
export function TotalBalanceCardSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-5',
        className,
      )}
    >
      {/* Label skeleton */}
      <div className="h-3 w-24 bg-[#101010]/10 animate-pulse rounded mb-2" />

      {/* Balance skeleton */}
      <div className="h-10 w-48 bg-[#101010]/10 animate-pulse rounded mb-1" />

      {/* Gain skeleton */}
      <div className="h-4 w-32 bg-[#101010]/10 animate-pulse rounded" />

      {/* Accounts skeleton */}
      <div className="mt-4">
        <div className="h-10 bg-[#101010]/5 animate-pulse rounded" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-2 mt-5 pt-4 border-t border-[#101010]/10">
        <div className="flex-1 h-10 bg-[#101010]/10 animate-pulse rounded" />
        <div className="flex-1 h-10 bg-[#101010]/10 animate-pulse rounded" />
      </div>
    </div>
  );
}

/**
 * EmptyBalanceCard - Empty state when no balance exists
 */
export function EmptyBalanceCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-8 text-center',
        className,
      )}
    >
      <div className="w-16 h-16 mx-auto bg-[#101010]/5 rounded-full flex items-center justify-center mb-4">
        <svg
          className="size-8 text-[#101010]/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-[16px] font-medium text-[#101010] mb-2">
        No balance yet
      </h3>
      <p className="text-[14px] text-[#101010]/60 max-w-[300px] mx-auto">
        Your balance will appear here once you deposit funds or earn yield.
      </p>
    </div>
  );
}
