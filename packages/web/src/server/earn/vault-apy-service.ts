import { db } from '@/db';
import {
  earnVaultApySnapshots,
  type EarnVaultApySnapshot,
} from '@/db/schema';
import { BASE_USDC_VAULTS, BASE_CHAIN_ID } from './base-vaults';

const MORPHO_GRAPHQL_URL = 'https://blue-api.morpho.org/graphql';
const APY_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_APY_BPS = 800; // 8%

function normalizeAddress(address: string): string {
  return address.toLowerCase();
}

function resolveVaultChainId(vaultAddress: string): number {
  const vault = BASE_USDC_VAULTS.find(
    (entry) => normalizeAddress(entry.address) === normalizeAddress(vaultAddress),
  );
  return vault?.chainId ?? BASE_CHAIN_ID;
}

export function resolveVaultDecimals(vaultAddress: string): number {
  // All current vaults are USDC-based (6 decimals). Swap this to a lookup when multi-asset launches.
  void vaultAddress;
  return 6;
}

async function fetchMorphoApy(
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
          address: normalizeAddress(vaultAddress),
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

    // Morpho returns either 0.x (decimal) or x (percentage). Normalise to decimal (0-1).
    return rawApy > 1 ? rawApy / 100 : rawApy;
  } catch (error) {
    console.warn('Failed to fetch Morpho APY', error);
    return null;
  }
}

function isFresh(snapshot: EarnVaultApySnapshot | undefined): boolean {
  if (!snapshot) return false;
  const age = Date.now() - snapshot.capturedAt.getTime();
  return age < APY_CACHE_TTL_MS;
}

export async function getVaultApyBasisPoints(
  vaultAddress: string,
): Promise<{ apyBasisPoints: number; source: string; snapshot: EarnVaultApySnapshot }>
{
  const normalized = normalizeAddress(vaultAddress);
  const latest = await db.query.earnVaultApySnapshots.findFirst({
    where: (tbl, { eq: eqLocal }) => eqLocal(tbl.vaultAddress, normalized),
    orderBy: (tbl, { desc: descLocal }) => [descLocal(tbl.capturedAt)],
  });

  if (latest && isFresh(latest)) {
    return {
      apyBasisPoints: latest.apyBasisPoints,
      source: latest.source ?? 'cache',
      snapshot: latest,
    };
  }

  const chainId = resolveVaultChainId(vaultAddress);
  const apyDecimal = await fetchMorphoApy(vaultAddress, chainId);

  if (apyDecimal !== null) {
    const apyBasisPoints = Math.round(apyDecimal * 10000);
    const [inserted] = await db
      .insert(earnVaultApySnapshots)
      .values({
        vaultAddress: normalized,
        chainId,
        apyBasisPoints,
        source: 'morpho',
      })
      .returning();

    return {
      apyBasisPoints,
      source: 'morpho',
      snapshot: inserted,
    };
  }

  if (latest) {
    return {
      apyBasisPoints: latest.apyBasisPoints,
      source: latest.source ?? 'cache-fallback',
      snapshot: latest,
    };
  }

  const [inserted] = await db
    .insert(earnVaultApySnapshots)
    .values({
      vaultAddress: normalized,
      chainId,
      apyBasisPoints: DEFAULT_APY_BPS,
      source: 'fallback_default',
    })
    .returning();

  return {
    apyBasisPoints: DEFAULT_APY_BPS,
    source: 'fallback_default',
    snapshot: inserted,
  };
}
