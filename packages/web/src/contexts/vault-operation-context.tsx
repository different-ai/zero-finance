'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { trpc } from '@/utils/trpc';
import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base, arbitrum, gnosis } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import {
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';
import {
  ALL_BASE_VAULTS,
  type VaultAsset,
  USDC_ASSET,
} from '@/server/earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';

/**
 * VaultOperationContext provides unified state management for vault operations
 * (deposits and withdrawals) across different chains.
 *
 * This context centralizes:
 * - Multi-chain Safe addresses (from getMultiChainPositions)
 * - Public clients for different chains
 * - Smart wallet clients
 * - Safe relay functionality
 * - Vault configuration lookup
 */

interface VaultOperationContextValue {
  // User identity
  userDid: string | undefined;
  eoaAddress: Address | undefined;

  // Safe addresses from multi-chain positions (authoritative source)
  baseSafeAddress: Address | undefined;
  targetSafeAddress: Address | undefined;
  effectiveSafeAddress: Address; // The safe to use for current operation

  // Chain configuration
  chainId: SupportedChainId;
  isCrossChain: boolean;
  chain: typeof base | typeof arbitrum | typeof gnosis;

  // Vault configuration
  vaultAddress: Address;
  vaultConfig:
    | (typeof ALL_BASE_VAULTS)[number]
    | (typeof ALL_CROSS_CHAIN_VAULTS)[number]
    | undefined;
  asset: VaultAsset;
  isNativeAsset: boolean;

  // Clients
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publicClient: any; // ReturnType<typeof createPublicClient> with chain-specific generics
  smartWalletClient: ReturnType<typeof useSmartWallets>['client'];
  getClientForChain: ReturnType<typeof useSmartWallets>['getClientForChain'];

  // Safe relay
  isRelayReady: boolean;
  sendTxViaRelay: ReturnType<typeof useSafeRelay>['send'];

  // Loading states
  isLoadingPositions: boolean;

  // Multi-chain positions data
  multiChainPositions:
    | {
        safes: Array<{ chainId: number; address: string }>;
      }
    | undefined;

  // tRPC utils for refetching
  trpcUtils: ReturnType<typeof trpc.useUtils>;

  // Wallets for EOA signing
  wallets: ReturnType<typeof useWallets>['wallets'];
}

const VaultOperationContext = createContext<VaultOperationContextValue | null>(
  null,
);

interface VaultOperationProviderProps {
  children: ReactNode;
  vaultAddress: Address;
  chainId?: SupportedChainId;
  safeAddressFallback?: Address; // Fallback if multi-chain positions not available
}

export function VaultOperationProvider({
  children,
  vaultAddress,
  chainId = SUPPORTED_CHAINS.BASE,
  safeAddressFallback,
}: VaultOperationProviderProps) {
  const { user } = usePrivy();
  const { wallets } = useWallets();
  const { client: smartWalletClient, getClientForChain } = useSmartWallets();
  const trpcUtils = trpc.useUtils();

  // Fetch multi-chain positions - authoritative source for Safe addresses
  const { data: multiChainPositions, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: true,
      staleTime: 30000,
    });

  // Derive Safe addresses from multi-chain positions
  const baseSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.BASE,
  )?.address as Address | undefined;

  const targetSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === chainId,
  )?.address as Address | undefined;

  // Determine if this is a cross-chain operation
  const isCrossChain = chainId !== SUPPORTED_CHAINS.BASE;

  // The effective Safe address to use for operations
  const effectiveSafeAddress = (
    isCrossChain
      ? targetSafeAddress || safeAddressFallback
      : baseSafeAddress || safeAddressFallback
  ) as Address;

  // Chain configuration
  const chain = useMemo(() => {
    switch (chainId) {
      case SUPPORTED_CHAINS.GNOSIS:
        return gnosis;
      case SUPPORTED_CHAINS.ARBITRUM:
        return arbitrum;
      default:
        return base;
    }
  }, [chainId]);

  // RPC URL for the chain
  const rpcUrl = useMemo(() => {
    switch (chainId) {
      case SUPPORTED_CHAINS.GNOSIS:
        return (
          process.env.NEXT_PUBLIC_GNOSIS_RPC_URL ||
          'https://rpc.gnosischain.com'
        );
      case SUPPORTED_CHAINS.ARBITRUM:
        return (
          process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL ||
          'https://arb1.arbitrum.io/rpc'
        );
      default:
        return process.env.NEXT_PUBLIC_BASE_RPC_URL;
    }
  }, [chainId]);

  // Public client for the target chain
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }, [chain, rpcUrl]);

  // Safe relay for sending transactions
  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    effectiveSafeAddress,
    chainId,
  );

  // Look up vault configuration
  const vaultConfig = useMemo(() => {
    const allVaults = [...ALL_BASE_VAULTS, ...ALL_CROSS_CHAIN_VAULTS];
    return allVaults.find(
      (v) => v.address.toLowerCase() === vaultAddress.toLowerCase(),
    );
  }, [vaultAddress]);

  // Determine asset configuration
  const asset = useMemo(() => {
    if (vaultConfig && 'asset' in vaultConfig) {
      return (vaultConfig as { asset: VaultAsset }).asset;
    }
    return USDC_ASSET;
  }, [vaultConfig]);

  const isNativeAsset = asset.isNative ?? false;

  const value: VaultOperationContextValue = {
    // User identity
    userDid: user?.id,
    eoaAddress: user?.wallet?.address as Address | undefined,

    // Safe addresses
    baseSafeAddress,
    targetSafeAddress,
    effectiveSafeAddress,

    // Chain configuration
    chainId,
    isCrossChain,
    chain,

    // Vault configuration
    vaultAddress,
    vaultConfig,
    asset,
    isNativeAsset,

    // Clients
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publicClient: publicClient as any,
    smartWalletClient,
    getClientForChain,

    // Safe relay
    isRelayReady,
    sendTxViaRelay,

    // Loading states
    isLoadingPositions,

    // Multi-chain positions
    multiChainPositions:
      multiChainPositions as VaultOperationContextValue['multiChainPositions'],

    // tRPC utils
    trpcUtils,

    // Wallets
    wallets,
  };

  return (
    <VaultOperationContext.Provider value={value}>
      {children}
    </VaultOperationContext.Provider>
  );
}

/**
 * Hook to access the vault operation context
 * @throws Error if used outside of VaultOperationProvider
 */
export function useVaultOperation() {
  const context = useContext(VaultOperationContext);
  if (!context) {
    throw new Error(
      'useVaultOperation must be used within a VaultOperationProvider',
    );
  }
  return context;
}

/**
 * Hook to get chain-specific helpers
 */
export function useChainHelpers() {
  const { chainId, publicClient, getClientForChain } = useVaultOperation();

  return useMemo(
    () => ({
      getChainName: () => {
        switch (chainId) {
          case SUPPORTED_CHAINS.GNOSIS:
            return 'Gnosis';
          case SUPPORTED_CHAINS.ARBITRUM:
            return 'Arbitrum';
          case SUPPORTED_CHAINS.BASE:
            return 'Base';
          default:
            return `Chain ${chainId}`;
        }
      },
      getExplorerUrl: (txHash: string) => {
        switch (chainId) {
          case SUPPORTED_CHAINS.GNOSIS:
            return `https://gnosisscan.io/tx/${txHash}`;
          case SUPPORTED_CHAINS.ARBITRUM:
            return `https://arbiscan.io/tx/${txHash}`;
          default:
            return `https://basescan.org/tx/${txHash}`;
        }
      },
      getSmartWalletClient: async () => {
        return getClientForChain({ id: chainId });
      },
      checkBytecode: async (address: Address) => {
        const code = await publicClient.getBytecode({ address });
        return !!(code && code !== '0x');
      },
    }),
    [chainId, publicClient, getClientForChain],
  );
}
