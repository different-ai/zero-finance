'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { Skeleton } from '@/components/ui/skeleton';

interface EarningsCardProps {
  safeAddress: string;
}

export function EarningsCard({ safeAddress }: EarningsCardProps) {
  const router = useRouter();
  
  // Fetch vault stats to calculate earnings
  const { data: vaultStats, isLoading } = trpc.earn.stats.useQuery(
    { safeAddress },
    { enabled: !!safeAddress }
  );

  // Calculate total earnings
  const totalEarnings = vaultStats?.reduce((sum, stat) => {
    const yield = stat.yield > 0n ? stat.yield : 0n;
    return sum + Number(yield) / 1e6; // Convert from USDC smallest unit
  }, 0) || 0;

  // Calculate total vault balance
  const totalVaultBalance = vaultStats?.reduce((sum, stat) => {
    return sum + Number(stat.currentAssets) / 1e6; // Convert from USDC smallest unit
  }, 0) || 0;

  const formatUsd = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleManageSavings = () => {
    router.push('/dashboard/savings');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Auto-Earn Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!vaultStats || vaultStats.length === 0) {
    return null; // Don't show the card if no earnings data
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Auto-Earn Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Saved</p>
            <p className="text-2xl font-bold">{formatUsd(totalVaultBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold text-emerald-600">+{formatUsd(totalEarnings)}</p>
          </div>
        </div>
        <Button 
          onClick={handleManageSavings} 
          variant="outline" 
          className="w-full"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Manage Savings
        </Button>
      </CardContent>
    </Card>
  );
} 