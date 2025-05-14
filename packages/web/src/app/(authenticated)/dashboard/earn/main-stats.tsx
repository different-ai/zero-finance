"use client";

import { api } from "@/trpc/react";

interface Props {
  safeAddress: string;
  allocationPct: number; // fallback display while stats load
}

const formatBalance = (value: bigint | string, decimals = 6): string => {
  try {
    const big = typeof value === "string" ? BigInt(value) : value;
    const divisor = BigInt(10 ** decimals);
    const integerPart = big / divisor;
    const fractionalPart = big % divisor;
    return `${integerPart.toString()}.${fractionalPart
      .toString()
      .padStart(decimals, "0")
      .slice(0, 2)}`;
  } catch {
    return "N/A";
  }
};

export default function MainStats({ safeAddress, allocationPct }: Props) {
  const {
    data: statsData, 
    isLoading: isLoadingStats, 
    error: errorStats, 
  } = api.earn.stats.useQuery( 
    { safeAddress },
    { enabled: !!safeAddress, staleTime: 10_000 },
  );

  const {
    data: مستقیمApyData, // Using a non-conflicting name for the data from the apy query
    isLoading: isLoadingApy,
    error: errorApy,
  } = api.earn.apy.useQuery( 
    { safeAddress },
    { enabled: !!safeAddress, staleTime: 60_000 }, // APY can be staler, e.g. 1 minute
  );

  let totalBalance = 0n;
  let earningBalance = 0n;

  if (statsData && statsData.length) {
    for (const v of statsData) {
      totalBalance += BigInt(v.currentAssets);
      earningBalance += BigInt(v.principal);
    }
  }

  // The APY now comes directly from the backend
  const displayApy = مستقیمApyData?.apy ?? 0; 
  
  const isLoadingOverall = isLoadingStats || isLoadingApy;
  const overallError = errorStats || errorApy;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="text-sm font-medium text-gray-500">Total Balance (USDC)</h3>
        <p className="text-2xl font-semibold">
          {isLoadingOverall || overallError ? "…" : formatBalance(totalBalance)}
        </p>
      </div>
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="text-sm font-medium text-gray-500">Earning Balance (USDC)</h3>
        <p className="text-2xl font-semibold">
          {isLoadingOverall || overallError ? "…" : formatBalance(earningBalance)}
        </p>
        <p className="text-xs text-gray-400">{allocationPct}% allocated</p>
      </div>
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="text-sm font-medium text-gray-500">Current Vault APY</h3>
        <p className="text-2xl font-semibold">
          {isLoadingApy || errorApy ? "…" : (مستقیمApyData?.apy !== null && مستقیمApyData?.apy !== undefined) ? `${displayApy.toFixed(2)}%` : "N/A"}
        </p>
      </div>
    </div>
  );
} 