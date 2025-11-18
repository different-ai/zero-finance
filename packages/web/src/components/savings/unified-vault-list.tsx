/**
 * Unified Vault List - Display all vaults across all chains
 * Sorted by user positions first, then by APY
 */

'use client';

import { useMemo } from 'react';
import type { CrossChainVault } from '@/lib/types/multi-chain';
import { VaultCard, VaultCardSkeleton, EmptyVaultCard } from './vault-card';
import { cn } from '@/lib/utils';

interface VaultPosition {
  shares: bigint;
  value: string;
  apy: number;
}

interface UnifiedVaultListProps {
  vaults: CrossChainVault[];
  positions: Map<string, VaultPosition>;
  onDeposit: (vault: CrossChainVault) => void;
  onWithdraw: (vault: CrossChainVault) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * UnifiedVaultList - Display all vaults with intelligent sorting
 *
 * Design Language Compliance:
 * - Spacing: space-y-4 (16px gap between cards)
 * - Progressive disclosure: User positions shown first
 * - Empty state: Consistent with other components
 * - Loading state: Skeleton cards for each vault
 *
 * Sorting Logic:
 * 1. Vaults with user positions appear first
 * 2. Within each group, sorted by APY (highest first)
 * 3. Maintains stable sort order
 */
export function UnifiedVaultList({
  vaults,
  positions,
  onDeposit,
  onWithdraw,
  isLoading = false,
  className,
}: UnifiedVaultListProps) {
  // Sort vaults: positions first, then by APY
  const sortedVaults = useMemo(() => {
    return [...vaults].sort((a, b) => {
      const aHasPosition = positions.has(a.id);
      const bHasPosition = positions.has(b.id);

      // Positions first
      if (aHasPosition && !bHasPosition) return -1;
      if (!aHasPosition && bHasPosition) return 1;

      // Within same group, sort by APY (highest first)
      const aApy = a.apy ?? 0;
      const bApy = b.apy ?? 0;
      return bApy - aApy;
    });
  }, [vaults, positions]);

  // Split vaults into groups for better UX
  const { withPositions, withoutPositions } = useMemo(() => {
    const withPos: CrossChainVault[] = [];
    const withoutPos: CrossChainVault[] = [];

    sortedVaults.forEach((vault) => {
      if (positions.has(vault.id)) {
        withPos.push(vault);
      } else {
        withoutPos.push(vault);
      }
    });

    return { withPositions: withPos, withoutPositions: withoutPos };
  }, [sortedVaults, positions]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <VaultCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (vaults.length === 0) {
    return <EmptyVaultCard className={className} />;
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* User positions section */}
      {withPositions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-medium text-[#101010]">
              Your Positions
            </h3>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
              {withPositions.length}{' '}
              {withPositions.length === 1 ? 'Vault' : 'Vaults'}
            </span>
          </div>
          <div className="space-y-4">
            {withPositions.map((vault) => (
              <VaultCard
                key={vault.id}
                vault={vault}
                position={positions.get(vault.id)}
                onDeposit={() => onDeposit(vault)}
                onWithdraw={() => onWithdraw(vault)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available vaults section */}
      {withoutPositions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-medium text-[#101010]">
              {withPositions.length > 0 ? 'Available Vaults' : 'All Vaults'}
            </h3>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
              {withoutPositions.length}{' '}
              {withoutPositions.length === 1 ? 'Vault' : 'Vaults'}
            </span>
          </div>
          <div className="space-y-4">
            {withoutPositions.map((vault) => (
              <VaultCard
                key={vault.id}
                vault={vault}
                onDeposit={() => onDeposit(vault)}
                onWithdraw={() => onWithdraw(vault)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * VaultListStats - Summary statistics for the vault list
 */
export function VaultListStats({
  vaults,
  positions,
  className,
}: {
  vaults: CrossChainVault[];
  positions: Map<string, VaultPosition>;
  className?: string;
}) {
  const stats = useMemo(() => {
    const totalVaults = vaults.length;
    const activePositions = positions.size;
    const avgApy =
      vaults.reduce((sum, v) => sum + (v.apy ?? 0), 0) / (totalVaults || 1);

    // Calculate total value in positions
    const totalValue = Array.from(positions.values()).reduce((sum, pos) => {
      // Extract numeric value from formatted string (e.g., "$1,234.56" -> 1234.56)
      const numericValue = parseFloat(pos.value.replace(/[$,]/g, ''));
      return sum + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    return {
      totalVaults,
      activePositions,
      avgApy,
      totalValue,
    };
  }, [vaults, positions]);

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F7F7F2] border border-[#101010]/10 rounded-lg',
        className,
      )}
    >
      <StatCard label="Total Vaults" value={stats.totalVaults.toString()} />
      <StatCard
        label="Your Positions"
        value={stats.activePositions.toString()}
      />
      <StatCard
        label="Average APY"
        value={`${stats.avgApy.toFixed(2)}%`}
        highlight={stats.avgApy > 0}
      />
      <StatCard
        label="Total Value"
        value={`$${stats.totalValue.toFixed(2)}`}
        highlight={stats.totalValue > 0}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-1">
        {label}
      </p>
      <p
        className={cn(
          'text-[20px] font-medium tabular-nums',
          highlight ? 'text-[#10b981]' : 'text-[#101010]',
        )}
      >
        {value}
      </p>
    </div>
  );
}
