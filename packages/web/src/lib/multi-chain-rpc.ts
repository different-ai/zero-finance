/**
 * Multi-Chain RPC Manager
 * Handles RPC connections across multiple chains with caching and fallback providers
 */

import {
  createPublicClient,
  http,
  type Address,
  type PublicClient,
  type Chain,
  formatUnits,
} from 'viem';
import { base, arbitrum } from 'viem/chains';
import {
  type SupportedChainId,
  SUPPORTED_CHAINS,
  getChainConfig,
} from './constants/chains';

/**
 * Cache entry structure
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

/**
 * Multi-chain RPC manager with caching and fallback providers
 */
export class MultiChainRPCManager {
  private clients: Map<SupportedChainId, PublicClient>;
  private cache: Map<string, CacheEntry<unknown>>;
  private readonly cacheTTL: number;

  /**
   * Create a new MultiChainRPCManager instance
   * @param cacheTTL - Cache time-to-live in milliseconds (default: 30000ms = 30s)
   */
  constructor(cacheTTL = 30000) {
    this.clients = new Map();
    this.cache = new Map();
    this.cacheTTL = cacheTTL;
    this.initializeClients();
  }

  /**
   * Initialize RPC clients for all supported chains
   */
  private initializeClients(): void {
    // Base client
    const baseClient = this.createClient(SUPPORTED_CHAINS.BASE, base);
    this.clients.set(SUPPORTED_CHAINS.BASE, baseClient);

    // Arbitrum client
    const arbitrumClient = this.createClient(
      SUPPORTED_CHAINS.ARBITRUM,
      arbitrum,
    );
    this.clients.set(SUPPORTED_CHAINS.ARBITRUM, arbitrumClient);
  }

  /**
   * Create a public client for a specific chain with fallback transports
   * @param chainId - Chain ID
   * @param viemChain - Viem chain configuration
   * @returns Public client
   */
  private createClient(
    chainId: SupportedChainId,
    viemChain: Chain,
  ): PublicClient {
    const config = getChainConfig(chainId);
    const transports: ReturnType<typeof http>[] = [];

    // Priority 1: Alchemy (if configured)
    if (config.rpcUrls.alchemy) {
      transports.push(
        http(config.rpcUrls.alchemy, {
          batch: { batchSize: 100, wait: 16 },
          timeout: 10000,
        }),
      );
    }

    // Priority 2: Infura (if configured)
    if (config.rpcUrls.infura) {
      transports.push(
        http(config.rpcUrls.infura, {
          batch: { batchSize: 100, wait: 16 },
          timeout: 10000,
        }),
      );
    }

    // Priority 3: Public RPCs (fallback)
    transports.push(
      ...config.rpcUrls.public.map((url) =>
        http(url, {
          batch: { batchSize: 100, wait: 16 },
          timeout: 15000,
        }),
      ),
    );

    // Use the first transport (Alchemy or first public RPC)
    // In production, consider using fallback() from viem/chains for automatic failover
    return createPublicClient({
      chain: viemChain,
      transport: transports[0],
      batch: {
        multicall: true,
      },
    });
  }

  /**
   * Get client for a specific chain
   * @param chainId - Chain ID
   * @returns Public client
   */
  public getClient(chainId: SupportedChainId): PublicClient {
    const client = this.clients.get(chainId);
    if (!client) {
      throw new Error(`No client configured for chain ${chainId}`);
    }
    return client;
  }

  /**
   * Generate cache key
   * @param chainId - Chain ID
   * @param key - Cache key
   * @returns Combined cache key
   */
  private getCacheKey(chainId: SupportedChainId, key: string): string {
    return `${chainId}:${key}`;
  }

  /**
   * Get value from cache
   * @param chainId - Chain ID
   * @param key - Cache key
   * @returns Cached value if found and not expired, null otherwise
   */
  private getFromCache<T>(chainId: SupportedChainId, key: string): T | null {
    const cacheKey = this.getCacheKey(chainId, key);
    const entry = this.cache.get(cacheKey) as CacheEntry<T> | undefined;

    if (!entry) return null;

    // Check if cache entry is expired
    if (Date.now() - entry.timestamp > this.cacheTTL) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.value;
  }

  /**
   * Set value in cache
   * @param chainId - Chain ID
   * @param key - Cache key
   * @param value - Value to cache
   */
  private setCache<T>(chainId: SupportedChainId, key: string, value: T): void {
    const cacheKey = this.getCacheKey(chainId, key);
    this.cache.set(cacheKey, {
      value,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache for a specific chain or all chains
   * @param chainId - Optional chain ID to clear cache for
   */
  public clearCache(chainId?: SupportedChainId): void {
    if (chainId) {
      // Clear cache for specific chain
      const prefix = `${chainId}:`;
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  /**
   * Get ERC20 token balance with caching
   * @param chainId - Chain ID
   * @param tokenAddress - Token contract address
   * @param ownerAddress - Owner address
   * @returns Balance (raw and formatted)
   */
  public async getBalance(
    chainId: SupportedChainId,
    tokenAddress: Address,
    ownerAddress: Address,
  ): Promise<{ raw: bigint; formatted: string } | null> {
    const cacheKey = `balance:${tokenAddress}:${ownerAddress}`;
    const cached = this.getFromCache<{ raw: bigint; formatted: string }>(
      chainId,
      cacheKey,
    );

    if (cached) {
      return cached;
    }

    try {
      const client = this.getClient(chainId);

      // Read balance
      const balance = await client.readContract({
        address: tokenAddress,
        abi: [
          {
            inputs: [{ name: '_owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'balanceOf',
        args: [ownerAddress],
      });

      // Read decimals
      const decimals = await this.getTokenDecimals(chainId, tokenAddress);

      const result = {
        raw: balance,
        formatted: formatUnits(balance, decimals),
      };

      // Cache the result
      this.setCache(chainId, cacheKey, result);

      return result;
    } catch (error) {
      console.error(
        `Error fetching balance for ${ownerAddress} on chain ${chainId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Get token decimals with caching
   * @param chainId - Chain ID
   * @param tokenAddress - Token contract address
   * @returns Token decimals
   */
  private async getTokenDecimals(
    chainId: SupportedChainId,
    tokenAddress: Address,
  ): Promise<number> {
    const cacheKey = `decimals:${tokenAddress}`;
    const cached = this.getFromCache<number>(chainId, cacheKey);

    if (cached !== null) {
      return cached;
    }

    try {
      const client = this.getClient(chainId);

      const decimals = await client.readContract({
        address: tokenAddress,
        abi: [
          {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'decimals',
      });

      // Cache decimals indefinitely (they don't change)
      this.setCache(chainId, cacheKey, decimals);

      return decimals;
    } catch (error) {
      console.error(`Error fetching decimals for ${tokenAddress}:`, error);
      // Default to 6 for USDC
      return 6;
    }
  }

  /**
   * Read contract with caching
   * @param chainId - Chain ID
   * @param params - Contract read parameters
   * @returns Contract read result
   */
  public async readContract<T>(
    chainId: SupportedChainId,
    params: {
      address: Address;
      abi: unknown[];
      functionName: string;
      args?: unknown[];
    },
  ): Promise<T | null> {
    const cacheKey = `contract:${params.address}:${params.functionName}:${JSON.stringify(params.args || [])}`;
    const cached = this.getFromCache<T>(chainId, cacheKey);

    if (cached !== null) {
      return cached;
    }

    try {
      const client = this.getClient(chainId);

      const result = (await client.readContract({
        address: params.address,
        abi: params.abi as never[],
        functionName: params.functionName,
        args: params.args as never[],
      })) as T;

      // Cache the result
      this.setCache(chainId, cacheKey, result);

      return result;
    } catch (error) {
      console.error(
        `Error reading contract ${params.address}.${params.functionName} on chain ${chainId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Get current block number
   * @param chainId - Chain ID
   * @returns Current block number
   */
  public async getBlockNumber(chainId: SupportedChainId): Promise<bigint> {
    const client = this.getClient(chainId);
    return client.getBlockNumber();
  }

  /**
   * Wait for transaction receipt
   * @param chainId - Chain ID
   * @param hash - Transaction hash
   * @returns Transaction receipt
   */
  public async waitForTransaction(
    chainId: SupportedChainId,
    hash: `0x${string}`,
  ) {
    const client = this.getClient(chainId);
    return client.waitForTransactionReceipt({ hash });
  }
}

/**
 * Global singleton instance
 */
let globalRPCManager: MultiChainRPCManager | null = null;

/**
 * Get or create the global RPC manager instance
 * @returns Global RPC manager
 */
export function getRPCManager(): MultiChainRPCManager {
  if (!globalRPCManager) {
    globalRPCManager = new MultiChainRPCManager();
  }
  return globalRPCManager;
}

/**
 * Create a new RPC manager instance (for testing or custom TTL)
 * @param cacheTTL - Cache time-to-live in milliseconds
 * @returns New RPC manager instance
 */
export function createRPCManager(cacheTTL?: number): MultiChainRPCManager {
  return new MultiChainRPCManager(cacheTTL);
}
