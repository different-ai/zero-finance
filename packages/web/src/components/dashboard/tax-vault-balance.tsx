"use client";
import { trpc } from '@/utils/trpc';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function TaxVaultBalanceTile() {
  const { data, refetch, isLoading } = trpc.tax.getLiability.useQuery(undefined, { refetchInterval: 30_000 });

  useEffect(() => {
    const id = setInterval(() => refetch(), 60_000);
    return () => clearInterval(id);
  }, [refetch]);

  const liability = data?.netLiability ?? 0;
  const held = data?.totalHeld ?? 0;
  const overfunded = held >= liability;

  return (
    <Card className={cn('w-full', overfunded ? 'border-emerald-500' : 'border-rose-500')}>
      <CardHeader>
        <CardTitle>Tax Vault Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading…</p>
        ) : (
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-semibold">{held.toLocaleString()} USDC</span>
            <span className="text-sm text-muted-foreground">
              Liability: {liability.toLocaleString()} USDC
            </span>
            <span className={cn('text-sm font-medium', overfunded ? 'text-emerald-600' : 'text-rose-600')}>
              {overfunded ? '✔︎ Covered' : '⚠︎ Underfunded'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}