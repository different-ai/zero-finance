/**
 * Morpho Analytics Service
 * Fetches comprehensive vault data from Morpho API including:
 * - Current APY, TVL, share price
 * - Historical APY data
 * - Vault metadata (curator, deployment info)
 */

const MORPHO_GRAPHQL_URL = 'https://api.morpho.org/graphql';

// Chain ID mappings
export const MORPHO_CHAIN_IDS: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  arbitrum: 42161,
  optimism: 10,
};

export const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  10: 'Optimism',
};

export interface MorphoVaultMetrics {
  address: string;
  chainId: number;
  name: string;
  symbol: string;
  curator?: string;
  // Current metrics
  totalAssetsUsd: number;
  totalAssets: string;
  // APY metrics
  apy: number;
  netApy: number;
  avgApy: number;
  weeklyApy: number;
  monthlyApy: number;
  // Share price
  sharePrice: number;
  sharePriceUsd: number;
  // Asset info
  asset: {
    address: string;
    symbol: string;
    decimals: number;
    priceUsd: number;
  };
  // Metadata
  metadata?: {
    description?: string;
    image?: string;
    forumLink?: string;
  };
  // Creation info
  creationTimestamp?: number;
  creationBlockNumber?: number;
  // Warnings
  warnings?: Array<{
    type: string;
    level: string;
  }>;
}

export interface MorphoVaultHistoricalData {
  apy: Array<{ timestamp: number; value: number }>;
  netApy: Array<{ timestamp: number; value: number }>;
  totalAssetsUsd?: Array<{ timestamp: number; value: number }>;
}

export interface ParsedMorphoUrl {
  chainId: number;
  chainName: string;
  vaultAddress: string;
}

/**
 * Parse a Morpho vault URL to extract chain and address
 * Example: https://app.morpho.org/base/vault/0x236919F11ff9eA9550A4287696C2FC9e18E6e890/gauntlet-usdc-frontier
 */
export function parseMorphoVaultUrl(url: string): ParsedMorphoUrl | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);

    // Expected format: /chain/vault/address/name
    if (pathParts.length < 3 || pathParts[1] !== 'vault') {
      return null;
    }

    const chainName = pathParts[0].toLowerCase();
    const vaultAddress = pathParts[2];

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(vaultAddress)) {
      return null;
    }

    const chainId = MORPHO_CHAIN_IDS[chainName];
    if (!chainId) {
      return null;
    }

    return {
      chainId,
      chainName,
      vaultAddress: vaultAddress.toLowerCase(),
    };
  } catch {
    return null;
  }
}

/**
 * Fetch current vault metrics from Morpho API
 */
export async function fetchVaultMetrics(
  vaultAddress: string,
  chainId: number,
): Promise<MorphoVaultMetrics | null> {
  try {
    const response = await fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query VaultMetrics($address: String!, $chainId: Int!) {
            vaultByAddress(address: $address, chainId: $chainId) {
              address
              name
              symbol
              creationTimestamp
              creationBlockNumber
              asset {
                address
                symbol
                decimals
                priceUsd
              }
              metadata {
                description
                image
                forumLink
              }
              state {
                totalAssets
                totalAssetsUsd
                sharePrice
                sharePriceUsd
                apy
                netApy
                avgApy
                weeklyApy
                monthlyApy
                curator
              }
              warnings {
                type
                level
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
      console.error('Morpho API error:', response.status, response.statusText);
      return null;
    }

    const result = await response.json();
    const vault = result.data?.vaultByAddress;

    if (!vault) {
      return null;
    }

    // Normalize APY values (Morpho returns them as decimals 0.08 = 8%)
    const normalizeApy = (apy: number | undefined) =>
      apy !== undefined ? apy : 0;

    return {
      address: vault.address,
      chainId,
      name: vault.name,
      symbol: vault.symbol,
      curator: vault.state?.curator,
      totalAssetsUsd: vault.state?.totalAssetsUsd || 0,
      totalAssets: vault.state?.totalAssets || '0',
      apy: normalizeApy(vault.state?.apy),
      netApy: normalizeApy(vault.state?.netApy),
      avgApy: normalizeApy(vault.state?.avgApy),
      weeklyApy: normalizeApy(vault.state?.weeklyApy),
      monthlyApy: normalizeApy(vault.state?.monthlyApy),
      sharePrice: vault.state?.sharePrice || 1,
      sharePriceUsd: vault.state?.sharePriceUsd || 0,
      asset: {
        address: vault.asset?.address || '',
        symbol: vault.asset?.symbol || 'UNKNOWN',
        decimals: vault.asset?.decimals || 18,
        priceUsd: vault.asset?.priceUsd || 0,
      },
      metadata: vault.metadata,
      creationTimestamp: vault.creationTimestamp,
      creationBlockNumber: vault.creationBlockNumber,
      warnings: vault.warnings,
    };
  } catch (error) {
    console.error('Failed to fetch vault metrics:', error);
    return null;
  }
}

/**
 * Fetch historical APY and TVL data for a vault
 */
export async function fetchVaultHistoricalData(
  vaultAddress: string,
  chainId: number,
  days: number = 30,
): Promise<MorphoVaultHistoricalData | null> {
  try {
    const endTimestamp = Math.floor(Date.now() / 1000);
    const startTimestamp = endTimestamp - days * 24 * 60 * 60;

    const response = await fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query VaultHistorical($address: String!, $chainId: Int!, $options: TimeseriesOptions) {
            vaultByAddress(address: $address, chainId: $chainId) {
              historicalState {
                apy(options: $options) {
                  x
                  y
                }
                netApy(options: $options) {
                  x
                  y
                }
                totalAssetsUsd(options: $options) {
                  x
                  y
                }
              }
            }
          }
        `,
        variables: {
          address: vaultAddress.toLowerCase(),
          chainId,
          options: {
            startTimestamp,
            endTimestamp,
            interval: 'DAY',
          },
        },
      }),
    });

    if (!response.ok) {
      console.error('Morpho API error:', response.status);
      return null;
    }

    const result = await response.json();
    const historicalState = result.data?.vaultByAddress?.historicalState;

    if (!historicalState) {
      return null;
    }

    // Transform data to our format
    const transformTimeseries = (
      data: Array<{ x: number; y: number }> | undefined,
    ) =>
      (data || []).map((point) => ({
        timestamp: point.x * 1000, // Convert to milliseconds
        value: point.y,
      }));

    return {
      apy: transformTimeseries(historicalState.apy),
      netApy: transformTimeseries(historicalState.netApy),
      totalAssetsUsd: transformTimeseries(historicalState.totalAssetsUsd),
    };
  } catch (error) {
    console.error('Failed to fetch historical data:', error);
    return null;
  }
}

/**
 * Fetch vault deployment date by looking at first transaction
 */
export async function fetchVaultDeploymentInfo(
  vaultAddress: string,
  chainId: number,
): Promise<{ createdAt: string; blockNumber: number } | null> {
  try {
    const response = await fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query VaultTransactions($address: String!, $chainId: Int!) {
            transactions(
              first: 1
              orderBy: Timestamp
              orderDirection: Asc
              where: { vaultAddress_in: [$address], chainId_in: [$chainId] }
            ) {
              items {
                timestamp
                blockNumber
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
    const firstTx = result.data?.transactions?.items?.[0];

    if (!firstTx) {
      return null;
    }

    return {
      createdAt: new Date(firstTx.timestamp * 1000).toISOString(),
      blockNumber: firstTx.blockNumber,
    };
  } catch (error) {
    console.error('Failed to fetch deployment info:', error);
    return null;
  }
}

/**
 * List all vaults for a given chain
 */
export async function listMorphoVaults(
  chainId: number,
  limit: number = 100,
): Promise<MorphoVaultMetrics[]> {
  try {
    const response = await fetch(MORPHO_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ListVaults($chainId: Int!, $first: Int!) {
            vaults(first: $first, where: { chainId_in: [$chainId], whitelisted: true }) {
              items {
                address
                name
                symbol
                asset {
                  address
                  symbol
                  decimals
                  priceUsd
                }
                state {
                  totalAssets
                  totalAssetsUsd
                  sharePrice
                  sharePriceUsd
                  apy
                  netApy
                  curator
                }
              }
            }
          }
        `,
        variables: {
          chainId,
          first: limit,
        },
      }),
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const vaults = result.data?.vaults?.items || [];

    return vaults.map((vault: any) => ({
      address: vault.address,
      chainId,
      name: vault.name,
      symbol: vault.symbol,
      curator: vault.state?.curator,
      totalAssetsUsd: vault.state?.totalAssetsUsd || 0,
      totalAssets: vault.state?.totalAssets || '0',
      apy: vault.state?.apy || 0,
      netApy: vault.state?.netApy || 0,
      avgApy: 0,
      weeklyApy: 0,
      monthlyApy: 0,
      sharePrice: vault.state?.sharePrice || 1,
      sharePriceUsd: vault.state?.sharePriceUsd || 0,
      asset: {
        address: vault.asset?.address || '',
        symbol: vault.asset?.symbol || 'UNKNOWN',
        decimals: vault.asset?.decimals || 18,
        priceUsd: vault.asset?.priceUsd || 0,
      },
    }));
  } catch (error) {
    console.error('Failed to list vaults:', error);
    return [];
  }
}

/**
 * Comprehensive fetch for a vault - combines metrics, historical data, and deployment info
 */
export async function fetchComprehensiveVaultData(
  vaultAddress: string,
  chainId: number,
  historicalDays: number = 30,
): Promise<{
  metrics: MorphoVaultMetrics | null;
  historical: MorphoVaultHistoricalData | null;
  deployment: { createdAt: string; blockNumber: number } | null;
}> {
  const [metrics, historical, deployment] = await Promise.all([
    fetchVaultMetrics(vaultAddress, chainId),
    fetchVaultHistoricalData(vaultAddress, chainId, historicalDays),
    fetchVaultDeploymentInfo(vaultAddress, chainId),
  ]);

  return { metrics, historical, deployment };
}
