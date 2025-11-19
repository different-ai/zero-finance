/**
 * Multi-Chain Safe Utilities
 * Client and server-safe utilities for working with Safes across chains
 */

import { type Address, createPublicClient, http } from 'viem';
import { base, arbitrum } from 'viem/chains';
import Safe, {
  SafeAccountConfig,
  SafeDeploymentConfig,
} from '@safe-global/protocol-kit';
import {
  type SupportedChainId,
  SUPPORTED_CHAINS,
  getChainConfig,
} from '@/lib/constants/chains';

/**
 * Safe configuration for multi-chain deployments
 */
export const SAFE_CONFIG = {
  // Safe contract addresses (same across all chains)
  SAFE_SINGLETON: '0x41675C099F32341bf84BFC5382aF534df5C7461a' as Address,
  SAFE_PROXY_FACTORY: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67' as Address,
  COMPATIBILITY_FALLBACK_HANDLER:
    '0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99' as Address,

  // Default configuration
  DEFAULT_THRESHOLD: 1,
  DEFAULT_SALT_NONCE: 0n,
} as const;

/**
 * Get RPC URL for a specific chain
 * @param chainId - Chain ID
 * @returns RPC URL
 */
function getRpcUrlForChain(chainId: SupportedChainId): string {
  const config = getChainConfig(chainId);
  // Prefer Alchemy, then first public RPC
  return config.rpcUrls.alchemy || config.rpcUrls.public[0];
}

/**
 * Generate a deterministic Safe address across chains using Safe SDK
 * The address is deterministic based on owners, threshold, and salt nonce
 * @param owners - Array of owner addresses
 * @param threshold - Signature threshold
 * @param chainId - Chain ID
 * @param saltNonce - Optional salt nonce for deterministic deployment (default: timestamp)
 * @returns Predicted Safe address
 */
export async function predictSafeAddress(params: {
  owners: Address[];
  threshold: number;
  chainId: SupportedChainId;
  saltNonce?: string;
}): Promise<Address> {
  const { owners, threshold, chainId, saltNonce } = params;

  // Validate inputs
  validateSafeOwners(owners);
  if (threshold < 1 || threshold > owners.length) {
    throw new Error(
      `Threshold must be between 1 and ${owners.length} (number of owners)`,
    );
  }

  const rpcUrl = getRpcUrlForChain(chainId);

  // Safe configuration
  const safeAccountConfig: SafeAccountConfig = {
    owners: owners.map((addr) => addr.toLowerCase()),
    threshold,
  };

  const safeDeploymentConfig: SafeDeploymentConfig = {
    saltNonce: saltNonce || Date.now().toString(),
    safeVersion: '1.4.1',
  };

  // Initialize Protocol Kit with predicted safe
  // Use placeholder signer since we only need to predict address
  const protocolKit = await Safe.init({
    provider: rpcUrl,
    predictedSafe: {
      safeAccountConfig,
      safeDeploymentConfig,
    },
  });

  // Get the predicted address
  const predictedAddress = (await protocolKit.getAddress()) as Address;

  return predictedAddress;
}

/**
 * Check if a Safe contract is deployed at an address on a specific chain
 * @param safeAddress - The Safe address to check
 * @param chainId - The chain ID
 * @returns true if deployed, false otherwise
 */
export async function checkSafeDeployedOnChain(
  safeAddress: Address,
  chainId: SupportedChainId,
): Promise<boolean> {
  const rpcUrl = getRpcUrlForChain(chainId);
  const viemChain = chainId === SUPPORTED_CHAINS.BASE ? base : arbitrum;

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(rpcUrl),
  });

  try {
    const code = await publicClient.getCode({ address: safeAddress });
    return code !== '0x' && code !== undefined && code.length > 2;
  } catch (error) {
    console.error(
      `Error checking if Safe is deployed on chain ${chainId}:`,
      error,
    );
    return false;
  }
}

/**
 * Get Safe deployment transaction data
 * Prepares transaction for deploying a Safe on a specific chain
 * @param owners - Array of owner addresses
 * @param threshold - Signature threshold
 * @param chainId - Target chain ID
 * @param saltNonce - Optional salt nonce for deterministic deployment
 * @returns Transaction data and predicted address
 */
export async function getSafeDeploymentTx(params: {
  owners: Address[];
  threshold: number;
  chainId: SupportedChainId;
  saltNonce?: string;
}): Promise<{
  predictedAddress: Address;
  to: Address;
  data: `0x${string}`;
  value: bigint;
}> {
  const { owners, threshold, chainId, saltNonce } = params;

  // Validate inputs
  validateSafeOwners(owners);
  if (threshold < 1 || threshold > owners.length) {
    throw new Error(
      `Threshold must be between 1 and ${owners.length} (number of owners)`,
    );
  }

  const rpcUrl = getRpcUrlForChain(chainId);

  // Safe configuration
  const safeAccountConfig: SafeAccountConfig = {
    owners: owners.map((addr) => addr.toLowerCase()),
    threshold,
  };

  const safeDeploymentConfig: SafeDeploymentConfig = {
    saltNonce: saltNonce || Date.now().toString(),
    safeVersion: '1.4.1',
  };

  // Initialize Protocol Kit with predicted safe
  const protocolKit = await Safe.init({
    provider: rpcUrl,
    predictedSafe: {
      safeAccountConfig,
      safeDeploymentConfig,
    },
  });

  // Get predicted address
  const predictedAddress = (await protocolKit.getAddress()) as Address;

  // Create deployment transaction
  const deploymentTx = await protocolKit.createSafeDeploymentTransaction();

  return {
    predictedAddress,
    to: deploymentTx.to as Address,
    data: deploymentTx.data as `0x${string}`,
    value: BigInt(deploymentTx.value || '0'),
  };
}

/**
 * Check if an address is a valid Ethereum address
 * @param address - Address to validate
 * @returns true if valid, false otherwise
 */
export function isValidAddress(address: string): address is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Normalize Safe address (lowercase with 0x prefix)
 * @param address - Address to normalize
 * @returns Normalized address
 */
export function normalizeSafeAddress(address: Address): Address {
  return address.toLowerCase() as Address;
}

/**
 * Compare two addresses for equality (case-insensitive)
 * @param address1 - First address
 * @param address2 - Second address
 * @returns true if addresses are equal, false otherwise
 */
export function addressesEqual(address1: Address, address2: Address): boolean {
  return normalizeSafeAddress(address1) === normalizeSafeAddress(address2);
}

/**
 * Get Safe dashboard URL for a specific chain
 * @param safeAddress - Safe address
 * @param chainId - Chain ID
 * @returns URL to Safe dashboard
 */
export function getSafeDashboardUrl(
  safeAddress: Address,
  chainId: SupportedChainId,
): string {
  const chainPrefix = chainId === SUPPORTED_CHAINS.BASE ? 'base' : 'arb1';
  return `https://app.safe.global/home?safe=${chainPrefix}:${safeAddress}`;
}

/**
 * Get Safe transaction builder URL
 * @param safeAddress - Safe address
 * @param chainId - Chain ID
 * @returns URL to Safe transaction builder
 */
export function getSafeTransactionBuilderUrl(
  safeAddress: Address,
  chainId: SupportedChainId,
): string {
  const chainPrefix = chainId === SUPPORTED_CHAINS.BASE ? 'base' : 'arb1';
  return `https://app.safe.global/transactions/queue?safe=${chainPrefix}:${safeAddress}`;
}

/**
 * Format Safe address for display (shortened)
 * @param address - Address to format
 * @param chars - Number of characters to show on each side (default: 4)
 * @returns Formatted address (e.g., "0x1234...5678")
 */
export function formatSafeAddress(address: Address, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get Safe creation parameters
 * @param owners - Array of owner addresses
 * @param threshold - Signature threshold
 * @returns Safe creation parameters
 */
export function getSafeCreationParams(owners: Address[], threshold: number) {
  if (owners.length === 0) {
    throw new Error('At least one owner is required');
  }

  if (threshold < 1 || threshold > owners.length) {
    throw new Error(
      `Threshold must be between 1 and ${owners.length} (number of owners)`,
    );
  }

  return {
    owners,
    threshold,
    to: '0x0000000000000000000000000000000000000000' as Address,
    data: '0x' as const,
    fallbackHandler: SAFE_CONFIG.COMPATIBILITY_FALLBACK_HANDLER,
    paymentToken: '0x0000000000000000000000000000000000000000' as Address,
    payment: 0n,
    paymentReceiver: '0x0000000000000000000000000000000000000000' as Address,
  };
}

/**
 * Validate Safe owners array
 * @param owners - Array of owner addresses
 * @returns true if valid, throws error otherwise
 */
export function validateSafeOwners(owners: Address[]): boolean {
  if (owners.length === 0) {
    throw new Error('At least one owner is required');
  }

  // Check for duplicates
  const uniqueOwners = new Set(owners.map(normalizeSafeAddress));
  if (uniqueOwners.size !== owners.length) {
    throw new Error('Duplicate owners are not allowed');
  }

  // Check for zero address
  if (
    owners.some(
      (owner) => owner === '0x0000000000000000000000000000000000000000',
    )
  ) {
    throw new Error('Zero address cannot be an owner');
  }

  return true;
}

/**
 * Get recommended threshold for number of owners
 * @param ownerCount - Number of owners
 * @returns Recommended threshold
 */
export function getRecommendedThreshold(ownerCount: number): number {
  if (ownerCount === 1) return 1;
  if (ownerCount === 2) return 1; // For 2 owners, 1-of-2 is common
  if (ownerCount === 3) return 2; // For 3 owners, 2-of-3 is common
  return Math.ceil(ownerCount / 2); // For more owners, use majority
}
