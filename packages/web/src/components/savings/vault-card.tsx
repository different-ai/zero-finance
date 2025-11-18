/**
 * Vault Card - Individual vault display with position info and actions
 * Shows vault details, APY, user position, and deposit/withdraw actions
 */

'use client';

import type { CrossChainVault } from '@/lib/types/multi-chain';
import { NetworkBadge } from './network-badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp } from 'lucide-react';

interface VaultPosition {
  shares: bigint;
  value: string;
  apy: number;
}

interface VaultCardProps {
  vault: CrossChainVault;
  position?: VaultPosition;
  onDeposit: () => void;
  onWithdraw: () => void;
  className?: string;
}

/**
 * VaultCard - Display individual vault with position and actions
 *
 * Design Language Compliance:
 * - Card: bg-[#F7F7F2] with border-[#101010]/10
 * - Typography: text-[15px] for titles, text-[11px] for labels
 * - Colors: Uses chain brand colors via NetworkBadge
 * - Spacing: p-5, gap-4 (8px base unit)
 * - Progressive disclosure: Position info highlighted when available
 * - Banking terminology: "Position" not "Shares"
 */
export function VaultCard({
  vault,
  position,
  onDeposit,
  onWithdraw,
  className,
}: VaultCardProps) {
  const hasPosition = position !== undefined;

  return (
    <div
      className={cn(
        'bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-5 hover:border-[#101010]/20 transition-colors',
        className,
      )}
    >
      {/* Vault header */}
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-[15px] font-medium text-[#101010] truncate">
              {vault.displayName}
            </h3>
            {vault.appUrl && (
              <a
                href={vault.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-[#101010]/40 hover:text-[#1B29FF] transition-colors"
                aria-label="View vault details"
              >
                <ExternalLink className="size-3.5" />
              </a>
            )}
          </div>
          <NetworkBadge chainId={vault.chainId} size="sm" />
        </div>

        {/* APY Display */}
        {vault.apy !== undefined && (
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 text-[#10b981] mb-1">
              <TrendingUp className="size-3.5" />
              <span className="text-[15px] font-medium tabular-nums">
                {vault.apy.toFixed(2)}%
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
              APY
            </p>
          </div>
        )}
      </div>

      {/* Risk badge */}
      <div className="mb-4">
        <RiskBadge risk={vault.risk} />
      </div>

      {/* Curator */}
      {vault.curator && (
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-1">
            Curator
          </p>
          <p className="text-[13px] text-[#101010]/80">{vault.curator}</p>
        </div>
      )}

      {/* Position info (if user has one) */}
      {hasPosition && (
        <div className="mb-4 p-3 bg-white/60 rounded-md border border-[#101010]/10">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-2">
            Your Position
          </p>
          <div className="flex justify-between items-baseline">
            <div className="text-[20px] font-medium tabular-nums text-[#101010]">
              {position.value}
            </div>
            {position.apy > 0 && (
              <div className="text-[13px] text-[#10b981] tabular-nums">
                +{position.apy.toFixed(2)}% APY
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={onDeposit}
          className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium py-2 rounded-md transition-colors"
        >
          Deposit
        </Button>
        {hasPosition && (
          <Button
            onClick={onWithdraw}
            variant="outline"
            className="flex-1 border border-[#101010]/20 hover:border-[#101010]/40 bg-white text-[#101010] font-medium py-2 rounded-md transition-colors"
          >
            Withdraw
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * RiskBadge - Display vault risk level with appropriate styling
 */
function RiskBadge({
  risk,
}: {
  risk: 'Conservative' | 'Balanced' | 'High' | 'Optimized';
}) {
  const riskStyles = {
    Conservative: {
      bg: 'bg-[#10b981]/10',
      text: 'text-[#10b981]',
      label: 'Conservative',
    },
    Balanced: {
      bg: 'bg-[#1B29FF]/10',
      text: 'text-[#1B29FF]',
      label: 'Balanced',
    },
    High: {
      bg: 'bg-[#f59e0b]/10',
      text: 'text-[#f59e0b]',
      label: 'High Risk',
    },
    Optimized: {
      bg: 'bg-[#8b5cf6]/10',
      text: 'text-[#8b5cf6]',
      label: 'Optimized',
    },
  };

  const style = riskStyles[risk];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md',
        style.bg,
      )}
    >
      <div
        className={cn(
          'size-1.5 rounded-full',
          style.text.replace('text-', 'bg-'),
        )}
      />
      <span
        className={cn(
          'text-[11px] uppercase tracking-[0.14em] font-medium',
          style.text,
        )}
      >
        {style.label}
      </span>
    </div>
  );
}

/**
 * VaultCardSkeleton - Loading state for VaultCard
 */
export function VaultCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-5',
        className,
      )}
    >
      {/* Header skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-5 w-40 bg-[#101010]/10 animate-pulse rounded mb-2" />
          <div className="h-6 w-20 bg-[#101010]/10 animate-pulse rounded" />
        </div>
        <div className="text-right">
          <div className="h-5 w-16 bg-[#101010]/10 animate-pulse rounded mb-1" />
          <div className="h-3 w-12 bg-[#101010]/10 animate-pulse rounded" />
        </div>
      </div>

      {/* Risk badge skeleton */}
      <div className="h-6 w-24 bg-[#101010]/10 animate-pulse rounded mb-4" />

      {/* Curator skeleton */}
      <div className="mb-4">
        <div className="h-3 w-16 bg-[#101010]/10 animate-pulse rounded mb-1" />
        <div className="h-4 w-32 bg-[#101010]/10 animate-pulse rounded" />
      </div>

      {/* Actions skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-9 bg-[#101010]/10 animate-pulse rounded" />
        <div className="flex-1 h-9 bg-[#101010]/10 animate-pulse rounded" />
      </div>
    </div>
  );
}

/**
 * EmptyVaultCard - Empty state when no vaults are available
 */
export function EmptyVaultCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-[#F7F7F2] border border-[#101010]/10 rounded-lg p-8 text-center',
        className,
      )}
    >
      <div className="w-16 h-16 mx-auto bg-[#101010]/5 rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="size-8 text-[#101010]/40" />
      </div>
      <h3 className="text-[16px] font-medium text-[#101010] mb-2">
        No vaults available
      </h3>
      <p className="text-[14px] text-[#101010]/60 max-w-[300px] mx-auto">
        Vaults will appear here once they're available for your account.
      </p>
    </div>
  );
}
