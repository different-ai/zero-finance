'use client';

import { api } from '@/trpc/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatUnits } from 'viem';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';

interface VaultBreakdownCardProps {
  workspaceId: string;
}

export function VaultBreakdownCard({ workspaceId }: VaultBreakdownCardProps) {
  const {
    data: vaultBreakdown,
    isLoading,
    error,
  } = api.admin.getWorkspaceVaultBreakdown.useQuery({
    workspaceId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vault Breakdown</CardTitle>
          <CardDescription>Loading vault balances...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vault Breakdown</CardTitle>
          <CardDescription className="text-red-600">
            Failed to load vault breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error.message || 'Unknown error occurred'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (
    !vaultBreakdown?.vaultBreakdown ||
    vaultBreakdown.vaultBreakdown.length === 0
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vault Breakdown</CardTitle>
          <CardDescription>No vault balances found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This workspace has no funds allocated to yield vaults.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalBalanceUsd = vaultBreakdown.vaultBreakdown.reduce(
    (sum: number, vault: any) => {
      const balanceInUsdc = Number(formatUnits(BigInt(vault.balance), 6));
      return sum + balanceInUsdc;
    },
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vault Breakdown</CardTitle>
        <CardDescription>
          Distribution of {vaultBreakdown.workspaceName}&apos;s funds across
          vaults
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Total Summary */}
          <div className="p-3 bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-lg">
            <div className="text-sm font-medium text-[#101010]">
              Total Balance
            </div>
            <div className="text-2xl font-bold text-[#1B29FF] tabular-nums">
              $
              {totalBalanceUsd.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>

          {/* Vault Breakdown */}
          {vaultBreakdown.vaultBreakdown.map((vault: any) => {
            const balanceInUsdc = Number(formatUnits(BigInt(vault.balance), 6));
            const percentage =
              totalBalanceUsd > 0
                ? ((balanceInUsdc / totalBalanceUsd) * 100).toFixed(1)
                : '0.0';

            return (
              <div
                key={vault.vaultAddress}
                className="flex items-center justify-between p-3 bg-[#F7F7F2] border border-[#101010]/10 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-[#101010] text-sm">
                    {vault.displayName}
                  </div>
                  <div className="text-xs text-[#101010]/60 font-mono">
                    {vault.vaultName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[#101010] tabular-nums text-sm">
                    $
                    {balanceInUsdc.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-xs text-[#101010]/60">
                    {percentage}% of total
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
