'use client';

import { useDemoMode } from '@/context/demo-mode-context';
import { trpc } from '@/utils/trpc';
import { useMemo } from 'react';

// Demo data generators
export function getDemoTransactions(demoStep: number) {
  if (demoStep < 3) return [];

  const baseTransactions = [
    {
      id: 'demo-1',
      hash: '0xdemo' + Math.random().toString(36).substring(7),
      type: 'deposit' as const,
      amount: '2500000',
      token: 'USDC',
      from: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      to: '0xYourSafeAddress',
      timestamp: Date.now() - 3600000, // 1 hour ago
      status: 'completed' as const,
      description: 'Initial treasury deposit',
    },
  ];

  if (demoStep >= 4) {
    baseTransactions.push(
      {
        id: 'demo-2',
        hash: '0xdemo' + Math.random().toString(36).substring(7),
        type: 'deposit' as const,
        amount: '45000',
        token: 'USDC',
        from: '0xYourSafeAddress',
        to: '0xAWS_Payment_Address',
        timestamp: Date.now() - 86400000, // 1 day ago
        status: 'completed' as const,
        description: 'AWS Infrastructure',
      },
      {
        id: 'demo-3',
        hash: '0xdemo' + Math.random().toString(36).substring(7),
        type: 'deposit' as const,
        amount: '125000',
        token: 'USDC',
        from: '0xYourSafeAddress',
        to: '0xPayroll_Address',
        timestamp: Date.now() - 172800000, // 2 days ago
        status: 'completed' as const,
        description: 'Monthly Payroll',
      },
    );
  }

  if (demoStep >= 5) {
    baseTransactions.push({
      id: 'demo-4',
      hash: '0xdemo' + Math.random().toString(36).substring(7),
      type: 'deposit' as const,
      amount: '200000',
      token: 'USDC',
      from: '0xYourSafeAddress',
      to: '0xSeamlessVault',
      timestamp: Date.now() - 1800000, // 30 mins ago
      status: 'completed' as const,
      description: 'Auto-save to Seamless vault (8% APY)',
    });
  }

  return baseTransactions;
}

export function getDemoSavingsData(
  demoStep: number,
  demoSavingsBalance: number,
) {
  if (demoStep < 5) {
    return {
      enabled: false,
      allocation: 0,
      apy: 8.0,
      totalSaved: 0,
      totalEarned: 0,
      currentBalance: 0,
    };
  }

  // Calculate yield based on time and balance
  const dailyYield = (demoSavingsBalance * 0.08) / 365;
  const currentYield = dailyYield * (demoStep >= 6 ? 1 : 0);

  return {
    enabled: true,
    allocation: 10, // 10% auto-save
    apy: 8.0,
    totalSaved: demoSavingsBalance,
    totalEarned: currentYield,
    currentBalance: demoSavingsBalance + currentYield,
  };
}

export function getDemoVaultStats(
  demoStep: number,
  demoSavingsBalance: number,
) {
  const vaults = [
    {
      vaultAddress: '0x616a4E1db48e22028f6bbf20444Cd3b8e3273738',
      vaultName: 'Seamless USDC',
      apy: 8.0,
      netApy: 8.0,
      tvl: 25000000n, // $25M TVL
      userBalance: demoStep >= 5 ? BigInt(demoSavingsBalance * 1e6) : 0n,
      yield:
        demoStep >= 6
          ? BigInt(Math.floor(((demoSavingsBalance * 0.08) / 365) * 1e6))
          : 0n,
    },
    {
      vaultAddress: '0xTreasuryBills',
      vaultName: 'Treasury Bills',
      apy: 5.2,
      netApy: 5.2,
      tvl: 50000000n,
      userBalance: 0n,
      yield: 0n,
    },
    {
      vaultAddress: '0xBlueChipLending',
      vaultName: 'Blue Chip Lending',
      apy: 12.5,
      netApy: 11.8,
      tvl: 10000000n,
      userBalance: 0n,
      yield: 0n,
    },
  ];

  return vaults;
}

// Demo virtual bank accounts
export function getDemoVirtualAccounts(demoStep: number) {
  if (demoStep < 2) return [];

  return [
    {
      id: 'demo-usd-account',
      sourceAccountType: 'us_ach' as const,
      sourceAccountNumber: '8274619503',
      sourceRoutingNumber: '121000248',
      sourceBankName: 'Wells Fargo Bank',
      sourceBankAddress: '420 Montgomery Street, San Francisco, CA 94104',
      sourceCurrency: 'usd',
      destinationCurrency: 'usdc',
      destinationPaymentRail: 'Base',
    },
    {
      id: 'demo-eur-account',
      sourceAccountType: 'iban' as const,
      sourceIban: 'DE89 3704 0044 0532 0130 00',
      sourceBicSwift: 'COBADEFFXXX',
      sourceBankName: 'Commerzbank AG',
      sourceBankAddress: 'Kaiserplatz, 60311 Frankfurt am Main, Germany',
      sourceCurrency: 'eur',
      destinationCurrency: 'usdc',
      destinationPaymentRail: 'Base',
    },
  ];
}

// Hook to override TRPC data with demo data
export function useDemoTRPC() {
  const { isDemoMode, demoStep, demoBalance, demoSavingsBalance } =
    useDemoMode();

  // Create memoized demo data
  const demoData = useMemo(() => {
    if (!isDemoMode) return null;

    return {
      transactions: getDemoTransactions(demoStep),
      savings: getDemoSavingsData(demoStep, demoSavingsBalance),
      vaultStats: getDemoVaultStats(demoStep, demoSavingsBalance),
      balance: demoBalance,
      safeAddress: '0xDemo1234567890abcdef1234567890abcdef1234',
      virtualAccounts: getDemoVirtualAccounts(demoStep),
    };
  }, [isDemoMode, demoStep, demoBalance, demoSavingsBalance]);

  return demoData;
}

// Custom hooks that wrap TRPC hooks with demo data
export function useUserSafesWithDemo() {
  const demoData = useDemoTRPC();
  const realQuery = trpc.settings.userSafes.list.useQuery(undefined, {
    enabled: !demoData,
  });

  if (demoData) {
    return {
      data: [
        {
          safeAddress: demoData.safeAddress,
          chainId: 8453, // Base
          owners: ['0xDemoOwner'],
          threshold: 1,
          createdAt: new Date().toISOString(),
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  return realQuery;
}

export function useBalanceWithDemo(safeAddress: string, tokenAddress: string) {
  const demoData = useDemoTRPC();
  const realQuery = trpc.safe.getBalance.useQuery(
    { safeAddress, tokenAddress },
    { enabled: !demoData },
  );

  if (demoData) {
    return {
      data: {
        balance: BigInt(demoData.balance * 1e6).toString(),
        formatted: demoData.balance.toString(),
      },
      isLoading: false,
      isError: false,
    };
  }

  return realQuery;
}

export function useTransactionsWithDemo(safeAddress: string) {
  const demoData = useDemoTRPC();
  const realQuery = trpc.safe.getTransactions.useQuery(
    { safeAddress },
    { enabled: !demoData },
  );

  if (demoData) {
    return {
      data: demoData.transactions,
      isLoading: false,
      isError: false,
    };
  }

  return realQuery;
}

export function useEarnStatsWithDemo(safeAddress: string) {
  const demoData = useDemoTRPC();
  const realQuery = trpc.earn.stats.useQuery(
    { safeAddress },
    { enabled: !demoData },
  );

  if (demoData) {
    return {
      data: demoData.vaultStats,
      isLoading: false,
      isError: false,
    };
  }

  return realQuery;
}
