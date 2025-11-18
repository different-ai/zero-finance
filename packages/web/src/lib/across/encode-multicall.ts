/**
 * Multicall encoding for Across+ cross-chain actions
 * Encodes approve + deposit operations to be executed on destination chain
 *
 * Flow:
 * 1. User initiates bridge on origin chain
 * 2. Bridge transfers funds to destination chain
 * 3. Multicall handler on destination executes:
 *    a. ERC20.approve(vault, amount)
 *    b. ERC4626.deposit(amount, recipient)
 */

import { encodeFunctionData, type Address, type Hex } from 'viem';
import { erc20Abi } from 'viem';

/**
 * ERC4626 vault ABI - deposit function
 */
const erc4626DepositAbi = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'assets', type: 'uint256' },
      { name: 'receiver', type: 'address' },
    ],
    outputs: [{ name: 'shares', type: 'uint256' }],
  },
] as const;

/**
 * Cross-chain action for Across+
 * Represents a single contract call on the destination chain
 */
export interface CrossChainAction {
  target: Address;
  callData: Hex;
  value: bigint;
}

/**
 * Encode ERC20 approval
 *
 * @param tokenAddress - USDC token address on destination chain
 * @param spender - Vault address to approve
 * @param amount - Amount to approve (in USDC decimals, typically 6)
 * @returns Encoded approval calldata
 */
export function encodeApproval(
  tokenAddress: Address,
  spender: Address,
  amount: bigint,
): CrossChainAction {
  const callData = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'approve',
    args: [spender, amount],
  });

  return {
    target: tokenAddress,
    callData,
    value: 0n,
  };
}

/**
 * Encode ERC4626 vault deposit
 *
 * @param vaultAddress - Vault contract address
 * @param amount - Amount to deposit (in USDC decimals)
 * @param recipient - Address to receive vault shares (usually the Safe)
 * @returns Encoded deposit calldata
 */
export function encodeVaultDeposit(
  vaultAddress: Address,
  amount: bigint,
  recipient: Address,
): CrossChainAction {
  const callData = encodeFunctionData({
    abi: erc4626DepositAbi,
    functionName: 'deposit',
    args: [amount, recipient],
  });

  return {
    target: vaultAddress,
    callData,
    value: 0n,
  };
}

/**
 * Encode multicall for: approve + deposit to vault
 * This executes on the destination chain after bridge completes
 *
 * @param params - Multicall parameters
 * @returns Array of cross-chain actions
 *
 * @example
 * ```ts
 * const actions = encodeVaultDepositMulticall({
 *   tokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
 *   vaultAddress: '0x...',
 *   amount: parseUnits('100', 6),
 *   recipient: '0x...',
 * });
 * ```
 */
export function encodeVaultDepositMulticall(params: {
  tokenAddress: Address;
  vaultAddress: Address;
  amount: bigint;
  recipient: Address;
}): CrossChainAction[] {
  const { tokenAddress, vaultAddress, amount, recipient } = params;

  return [
    // Step 1: Approve vault to spend USDC
    encodeApproval(tokenAddress, vaultAddress, amount),
    // Step 2: Deposit USDC into vault
    encodeVaultDeposit(vaultAddress, amount, recipient),
  ];
}
