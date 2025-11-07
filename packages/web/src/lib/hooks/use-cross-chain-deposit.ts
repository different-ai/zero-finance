/**
 * Hook for initiating cross-chain vault deposits via Across Protocol
 */

import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, parseUnits, type Address, type Hex } from 'viem';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import {
  CROSS_CHAIN_VAULT_MANAGER_BASE,
  ACROSS_FEE_BPS,
  DEFAULT_SLIPPAGE_BPS,
} from '@/lib/across-constants';
import { USDC_ADDRESS } from '@/lib/constants';

const CROSS_CHAIN_VAULT_MANAGER_ABI = [
  {
    name: 'initiateDeposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'destinationChainId', type: 'uint256' },
      { name: 'vaultAddress', type: 'address' },
      { name: 'minSharesOut', type: 'uint256' },
    ],
    outputs: [{ name: 'depositId', type: 'bytes32' }],
  },
] as const;

export interface CrossChainDepositParams {
  /** User's Safe address */
  safeAddress: Address;
  /** Vault address on destination chain */
  vaultAddress: Address;
  /** Amount to deposit in decimal format (e.g., "1000" for 1000 USDC) */
  amount: string;
  /** Destination chain ID (e.g., 42161 for Arbitrum) */
  chainId: number;
  /** Slippage tolerance in basis points (default: 50 = 0.5%) */
  slippageBps?: number;
}

export interface CrossChainDepositResult {
  /** User operation hash from Safe relay */
  userOpHash: string;
  /** Estimated time to complete (ms) */
  estimatedTimeMs: number;
  /** Estimated fee amount in USDC */
  estimatedFee: number;
}

/**
 * Calculate estimated fee for cross-chain deposit
 */
export function calculateCrossChainFee(amount: string): number {
  const amountNum = parseFloat(amount) || 0;
  return (amountNum * ACROSS_FEE_BPS) / 10000;
}

/**
 * Calculate amount after fees
 */
export function calculateAmountAfterFees(amount: string): number {
  const amountNum = parseFloat(amount) || 0;
  const fee = calculateCrossChainFee(amount);
  return amountNum - fee;
}

/**
 * Hook for cross-chain deposits using Safe relay
 */
export function useCrossChainDeposit(safeAddress: Address) {
  const { send: sendTxViaRelay } = useSafeRelay(safeAddress);

  return useMutation({
    mutationFn: async (
      params: Omit<CrossChainDepositParams, 'safeAddress'>,
    ): Promise<CrossChainDepositResult> => {
      const { vaultAddress, amount, chainId, slippageBps = DEFAULT_SLIPPAGE_BPS } = params;

      if (!CROSS_CHAIN_VAULT_MANAGER_BASE || CROSS_CHAIN_VAULT_MANAGER_BASE === '0x0000000000000000000000000000000000000000') {
        throw new Error('Cross-chain vault manager not configured');
      }

      // Convert to smallest unit (USDC has 6 decimals)
      const amountInSmallestUnit = parseUnits(amount, 6);

      // Calculate minimum shares out (apply slippage tolerance)
      // Assumes 1:1 share:asset ratio (typical for new vaults)
      const minSharesOut =
        (amountInSmallestUnit * BigInt(10000 - slippageBps)) / 10000n;

      // Encode the transaction
      const data = encodeFunctionData({
        abi: CROSS_CHAIN_VAULT_MANAGER_ABI,
        functionName: 'initiateDeposit',
        args: [
          USDC_ADDRESS as Address, // USDC on Base
          amountInSmallestUnit,
          BigInt(chainId),
          vaultAddress,
          minSharesOut,
        ],
      });

      // Execute via Safe relay
      const userOpHash = await sendTxViaRelay([
        {
          to: CROSS_CHAIN_VAULT_MANAGER_BASE,
          data: data as Hex,
          value: '0',
        },
      ]);

      const estimatedFee = calculateCrossChainFee(amount);

      return {
        userOpHash,
        estimatedTimeMs: 30000, // 30 seconds typical
        estimatedFee,
      };
    },
    onSuccess: (result) => {
      console.log('Cross-chain deposit initiated:', result);
    },
    onError: (error) => {
      console.error('Cross-chain deposit failed:', error);
    },
  });
}
