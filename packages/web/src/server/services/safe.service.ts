import {
  createPublicClient,
  http,
  Address,
  isAddress,
  formatUnits,
} from 'viem';
import { base } from 'viem/chains';
import { USDC_ADDRESS } from '@/lib/constants';
import { getBaseRpcUrl } from '@/lib/base-rpc-url';

const publicClient = createPublicClient({
  chain: base,
  transport: http(getBaseRpcUrl(), {
    batch: {
      batchSize: 100, // Batch up to 100 requests
      wait: 16, // Wait 16ms before sending batch
    },
  }),
  batch: {
    multicall: true, // Enable multicall batching
  },
});

const USDC_ADDRESS_BASE =
  (process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_BASE as Address) ||
  (USDC_ADDRESS as Address);

// Memoize decimals per token to avoid extra RPC calls and make the balance
// routine more robust. USDC on Base always has 6 decimals, so we hard-code
// that value to remove an unnecessary network request that occasionally
// times out and caused the dashboard balance to show 0.

const DECIMAL_CACHE: Record<string, number> = {
  [USDC_ADDRESS_BASE.toLowerCase()]: 6,
};

const erc20Abi = [
  {
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export async function getSafeBalance({
  safeAddress,
  tokenAddress = USDC_ADDRESS_BASE,
}: {
  safeAddress: Address | undefined | null;
  tokenAddress?: Address;
}): Promise<{ raw: bigint; formatted: string } | null> {
  if (!safeAddress || !isAddress(safeAddress) || !tokenAddress) {
    console.log(
      `Skipping balance fetch for invalid/missing address: ${safeAddress}`,
    );
    return null;
  }
  try {
    // 1. Fetch raw balance
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [safeAddress],
    });

    // 2. Determine token decimals – first check cache, otherwise query chain
    let decimals: number;
    const cacheKey = tokenAddress.toLowerCase();
    if (DECIMAL_CACHE[cacheKey] !== undefined) {
      decimals = DECIMAL_CACHE[cacheKey];
    } else {
      try {
        decimals = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        });
        DECIMAL_CACHE[cacheKey] = decimals;
      } catch (decErr) {
        // Default to 18 decimals if contract call fails (most ERC-20s) to
        // avoid crashing the balance fetch.
        console.error(`Failed to fetch decimals for ${tokenAddress}:`, decErr);
        decimals = 18;
      }
    }

    const formatted = formatUnits(balance, decimals);

    return {
      raw: balance,
      formatted,
    };
  } catch (blockchainError) {
    console.error(
      `Error fetching balance for safe ${safeAddress} on Base mainnet:`,
      blockchainError,
    );
    return null;
  }
}

/**
 * Batch fetch balances for multiple Safe addresses using multicall
 * This is significantly more efficient than calling getSafeBalance multiple times
 * @param safeAddresses Array of Safe addresses to fetch balances for
 * @param tokenAddress Token address (defaults to USDC)
 * @returns Map of safe address to balance data
 */
export async function getBatchSafeBalances({
  safeAddresses,
  tokenAddress = USDC_ADDRESS_BASE,
}: {
  safeAddresses: Address[];
  tokenAddress?: Address;
}): Promise<Record<string, { raw: bigint; formatted: string } | null>> {
  // Filter out invalid addresses
  const validAddresses = safeAddresses.filter(
    (addr) => addr && isAddress(addr),
  );

  if (validAddresses.length === 0) {
    return {};
  }

  try {
    // Create multicall contracts array
    const contracts = validAddresses.map((safeAddress) => ({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'balanceOf' as const,
      args: [safeAddress],
    }));

    // Execute multicall - this sends a single RPC request instead of N requests
    const results = await publicClient.multicall({
      contracts,
      batchSize: 100, // Process in batches of 100
    });

    // Get decimals (from cache or single query)
    let decimals: number;
    const cacheKey = tokenAddress.toLowerCase();
    if (DECIMAL_CACHE[cacheKey] !== undefined) {
      decimals = DECIMAL_CACHE[cacheKey];
    } else {
      try {
        decimals = await publicClient.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'decimals',
        });
        DECIMAL_CACHE[cacheKey] = decimals;
      } catch (decErr) {
        console.error(`Failed to fetch decimals for ${tokenAddress}:`, decErr);
        decimals = 18;
      }
    }

    // Map results to safe addresses
    const balanceMap: Record<
      string,
      { raw: bigint; formatted: string } | null
    > = {};

    validAddresses.forEach((safeAddress, index) => {
      const result = results[index];

      if (result.status === 'success') {
        const balance = result.result;
        balanceMap[safeAddress.toLowerCase()] = {
          raw: balance,
          formatted: formatUnits(balance, decimals),
        };
      } else {
        console.error(
          `Failed to fetch balance for ${safeAddress}:`,
          result.error,
        );
        balanceMap[safeAddress.toLowerCase()] = null;
      }
    });

    return balanceMap;
  } catch (error) {
    console.error('Error in batch balance fetch:', error);
    // Return empty map on error
    return {};
  }
}

/**
 * Retry wrapper with exponential backoff for rate limit errors
 * @param operation Function to execute with retry logic
 * @param maxAttempts Maximum number of retry attempts (default: 3)
 * @returns Result of the operation
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;

      // Only retry on rate limit errors (429) or network errors
      const isRetryable =
        error?.status === 429 ||
        error?.code === 'NETWORK_ERROR' ||
        error?.message?.includes('rate limit');

      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      // Add jitter to prevent thundering herd
      const jitteredDelay = delay * (0.5 + Math.random() * 0.5);

      console.warn(
        `Attempt ${attempt} failed with ${error?.status || 'unknown error'}, ` +
          `retrying in ${Math.round(jitteredDelay)}ms...`,
      );

      await new Promise((resolve) => setTimeout(resolve, jitteredDelay));
    }
  }

  throw lastError!;
}
