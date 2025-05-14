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
    data: stats,
    isLoading,
    error,
  } = api.earn.stats.useQuery(
    { safeAddress },
    { enabled: !!safeAddress, staleTime: 10_000 },
  );

  let totalBalance = 0n;
  let earningBalance = 0n;

  if (stats && stats.length) {
    for (const v of stats) {
      totalBalance += BigInt(v.currentAssets);
      earningBalance += BigInt(v.principal);
    }
  }

  const apy = earningBalance > 0n ? Number(((totalBalance - earningBalance) * 10_000n) / earningBalance) / 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="text-sm font-medium text-gray-500">Total Balance (USDC)</h3>
        <p className="text-2xl font-semibold">
          {isLoading || error ? "…" : formatBalance(totalBalance)}
        </p>
      </div>
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="text-sm font-medium text-gray-500">Earning Balance (USDC)</h3>
        <p className="text-2xl font-semibold">
          {isLoading || error ? "…" : formatBalance(earningBalance)}
        </p>
        <p className="text-xs text-gray-400">{allocationPct}% allocated</p>
      </div>
      <div className="p-4 border rounded-lg shadow bg-white">
        <h3 className="text-sm font-medium text-gray-500">Current APY</h3>
        <p className="text-2xl font-semibold">{isLoading || error ? "…" : apy.toFixed(2)}%</p>
      </div>
    </div>
  );
} 