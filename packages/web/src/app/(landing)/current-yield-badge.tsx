'use client';

import { useEffect, useState } from 'react';

const MORPHO_GRAPHQL_URL = 'https://blue-api.morpho.org/graphql';

// Hardcoded insured vault addresses for client-side fetching
// These are the vaults with Chainproof insurance
const INSURED_VAULTS = [
  { address: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A', chainId: 8453 }, // Gauntlet USDC Prime on Base
];

async function fetchVaultApy(
  vaultAddress: string,
  chainId: number,
): Promise<number | null> {
  try {
    const response = await fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ($address: String!, $chainId: Int!) {
            vaultByAddress(address: $address, chainId: $chainId) {
              state {
                apy
              }
            }
          }
        `,
        variables: {
          address: vaultAddress.toLowerCase(),
          chainId,
        },
      }),
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    const rawApy: number | undefined = result.data?.vaultByAddress?.state?.apy;
    if (rawApy === undefined || rawApy === null) {
      return null;
    }

    // Morpho returns either 0.x (decimal) or x (percentage). Normalize to basis points.
    const decimal = rawApy > 1 ? rawApy / 100 : rawApy;
    return Math.round(decimal * 10000);
  } catch {
    return null;
  }
}

export function CurrentYieldBadge() {
  const [apyPercent, setApyPercent] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHighestYield() {
      let highestApy = 0;

      for (const vault of INSURED_VAULTS) {
        try {
          const apyBps = await fetchVaultApy(vault.address, vault.chainId);
          if (apyBps && apyBps > highestApy) {
            highestApy = apyBps;
          }
        } catch {
          // Skip failed fetches
        }
      }

      const finalApy = highestApy > 0 ? highestApy : 500; // Default 5% if all fail
      setApyPercent((finalApy / 100).toFixed(1));
    }

    fetchHighestYield();
  }, []);

  if (!apyPercent) {
    return <CurrentYieldBadgeSkeleton />;
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#101010]/10 rounded-full">
      <div className="w-1.5 h-1.5 bg-emerald-500 animate-pulse rounded-full" />
      <span className="text-[13px] text-[#101010]/70">
        Current yield:{' '}
        <span className="font-medium text-[#1B29FF]">{apyPercent}% APY</span>
      </span>
    </div>
  );
}

// Fallback for loading state
export function CurrentYieldBadgeSkeleton() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#101010]/10 rounded-full">
      <div className="w-1.5 h-1.5 bg-[#101010]/20 rounded-full" />
      <span className="text-[13px] text-[#101010]/40">Loading yield...</span>
    </div>
  );
}
