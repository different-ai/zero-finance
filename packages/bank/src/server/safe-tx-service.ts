/**
 * Safe Transaction Service
 * 
 * Prepares Safe transactions for allocation transfers.
 * - Today (Day 2): Just placeholder setup for SDK and transaction preparation
 * - Future (Day 3): Will execute the transactions
 */

import Safe from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import { encodeFunctionData, formatUnits, parseUnits } from 'viem';

// Load environment variables
const PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY;
const SAFE_ADDRESS = process.env.NEXT_PUBLIC_SAFE_ADDRESS;
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE;
const RPC_URL = process.env.BASE_RPC_URL;

// ERC20 ABI (minimal for transfer)
const ERC20_TRANSFER_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

/**
 * Initialize the Safe SDK - PLACEHOLDER FUNCTION
 * Note: This is a placeholder function for Day 2. We're not actually using the SDK yet.
 * In a real implementation, we would properly handle the initialization based on the SDK version.
 */
export const initializeSafeSDK = async () => {
  if (!PRIVATE_KEY || !SAFE_ADDRESS || !RPC_URL) {
    throw new Error('Missing required environment variables for Safe SDK initialization');
  }

  console.log('Safe SDK initialization placeholder - would connect to:', SAFE_ADDRESS);
  return {
    // Mock Safe SDK methods that would be available
    createTransaction: async () => {
      console.log('Mock: createTransaction called');
      return { safeTxHash: '0x0000000000000000000000000000000000000000000000000000000000000000' };
    },
    executeTransaction: async () => {
      console.log('Mock: executeTransaction called');
      return '0x0000000000000000000000000000000000000000000000000000000000000000';
    }
  };
};

/**
 * Prepare a Safe transaction to transfer USDC
 * Note: This doesn't execute the transaction, just demonstrates how it would be prepared
 * 
 * @param recipientAddress The address to send USDC to
 * @param amount The amount of USDC to send (in USDC units, e.g. "1.5" for 1.5 USDC)
 * @returns The encoded transaction data
 */
export const prepareSafeTx = (recipientAddress: string, amount: string) => {
  if (!USDC_ADDRESS) {
    throw new Error('Missing USDC_ADDRESS environment variable');
  }
  
  try {
    // Convert the amount to USDC's decimals (6)
    const amountInWei = parseUnits(amount, 6);
    
    // Encode the transfer function call
    const data = encodeFunctionData({
      abi: ERC20_TRANSFER_ABI,
      functionName: 'transfer',
      args: [recipientAddress as `0x${string}`, amountInWei]
    });
    
    return {
      to: USDC_ADDRESS,
      data,
      value: '0', // No ETH being sent
      operation: 0, // Call operation
    };
  } catch (error) {
    console.error('Error preparing Safe transaction:', error);
    throw error;
  }
}; 