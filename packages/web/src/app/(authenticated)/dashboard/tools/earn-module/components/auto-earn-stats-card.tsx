'use client';

import { useState, useEffect } from 'react';
import { type Address, formatUnits, parseUnits, createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, Loader2 } from 'lucide-react';

interface AutoEarnStatsCardProps {
  safeAddress?: Address;
}

// ABI for reading USDC balance from a Safe
const SAFE_ABI = [
  {
    constant: true,
    inputs: [{ name: 'token', type: 'address' }],
    name: 'getBalance',
    outputs: [{ name: '', type: 'uint256' }],
    type: 'function',
  },
] as const;

// Standard USDC token address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;
const USDC_DECIMALS = 6;

// Create public client
const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
});

export function AutoEarnStatsCard({ safeAddress }: AutoEarnStatsCardProps) {
  const [safeBalance, setSafeBalance] = useState<bigint>(0n);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(true);
  const [isRefreshingBalance, setIsRefreshingBalance] = useState<boolean>(false);

  // Get auto-earn configuration
  const { data: configData, isLoading: isLoadingConfig } = api.earn.getAutoEarnConfig.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress }
  );

  // Get earn stats (vault balances)
  const { data: statsData, isLoading: isLoadingStats, refetch: refetchStats } = api.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress }
  );

  // Fetch safe balance
  const fetchSafeBalance = async () => {
    if (!safeAddress) return;
    
    try {
      setIsLoadingBalance(true);
      
      const balance = await publicClient.readContract({
        address: safeAddress,
        abi: SAFE_ABI,
        functionName: 'getBalance',
        args: [USDC_ADDRESS],
      }) as bigint; // Explicitly type the return value
      
      setSafeBalance(balance);
    } catch (error) {
      console.error('Failed to fetch safe balance:', error);
      toast.error('Failed to fetch current safe balance. Please ensure your safe supports getBalance call.');
      // Continue with zero balance instead of failing completely
      setSafeBalance(0n);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Refresh balances
  const handleRefresh = async () => {
    setIsRefreshingBalance(true);
    await fetchSafeBalance();
    await refetchStats();
    setIsRefreshingBalance(false);
  };

  // Initial fetch
  useEffect(() => {
    if (safeAddress) {
      fetchSafeBalance();
    }
  }, [safeAddress]);

  // Calculate totals and percentages
  const autoEarnPct = configData?.pct || 0;
  const vaultAssets = statsData?.reduce((sum, stat) => sum + BigInt(stat.currentAssets), 0n) || 0n;
  const totalAssets = safeBalance + vaultAssets;
  const targetVaultAssets = totalAssets > 0n ? (totalAssets * BigInt(autoEarnPct)) / 100n : 0n;
  const deltaToTarget = targetVaultAssets > vaultAssets ? targetVaultAssets - vaultAssets : 0n;
  
  // Format amounts for display
  const formatUSDC = (amount: bigint) => {
    return parseFloat(formatUnits(amount, USDC_DECIMALS)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate allocation percentages
  const vaultPercentage = totalAssets > 0n 
    ? Math.round(Number((vaultAssets * 100n) / totalAssets)) 
    : 0;
  const safePercentage = totalAssets > 0n 
    ? Math.round(Number((safeBalance * 100n) / totalAssets)) 
    : 0;

  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">
            No primary safe detected or selected.
          </p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure a primary safe is active to use this feature.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingConfig || isLoadingStats || isLoadingBalance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  // Check if auto-earn is enabled
  if (!autoEarnPct) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Auto-earn is not enabled. Configure your auto-earn settings to automatically move funds to the yield-generating vault.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshingBalance}>
            {isRefreshingBalance ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
            Refresh
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Earn Stats</CardTitle>
        <CardDescription>
          Current allocation of your USDC funds
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Total USDC</div>
              <div className="text-2xl font-bold">${formatUSDC(totalAssets)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Working in Vault</div>
              <div className="text-2xl font-bold">${formatUSDC(vaultAssets)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-muted-foreground">Available in Safe</div>
              <div className="text-2xl font-bold">${formatUSDC(safeBalance)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Current Allocation</span>
              <span>Target: {autoEarnPct}% in Vault</span>
            </div>
            <Progress value={vaultPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{vaultPercentage}% in Vault</span>
              <span>{safePercentage}% in Safe</span>
            </div>
          </div>
          
          {deltaToTarget > 0n && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm">
              <p className="font-medium text-orange-800">
                ${formatUSDC(deltaToTarget)} should be moved to the vault to meet your {autoEarnPct}% target
              </p>
              <p className="text-xs text-orange-600 mt-1">
                This will happen during the next scheduled auto-earn check
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 items-start">
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshingBalance}>
          {isRefreshingBalance ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
          Refresh Balances
        </Button>
        <div className="text-xs text-muted-foreground">
          <p>Working: {formatUSDC(vaultAssets)} USDC in Seamless vault</p>
          <p>Available: {formatUSDC(safeBalance)} USDC idle in safe</p>
          <p>Next sweep at: {deltaToTarget >= parseUnits('1000', USDC_DECIMALS) ? `${formatUSDC(parseUnits('1000', USDC_DECIMALS))} USDC idle` : '24h'}</p>
        </div>
      </CardFooter>
    </Card>
  );
} 