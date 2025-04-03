/**
 * Balance Service
 * 
 * Fetches the current USDC balance of the Gnosis Safe on Base.
 */

import { createPublicClient, http, formatUnits, getContract } from 'viem';
import { base } from 'viem/chains';

// ERC20 ABI (minimal for balanceOf)
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Fetch the current USDC balance of the Safe
 * @returns The balance in wei (full precision string)
 */
export const fetchUSDCBalance = async (): Promise<string> => {
  try {
    // Get environment variables
    const safeAddress = process.env.NEXT_PUBLIC_SAFE_ADDRESS;
    const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS_BASE;
    const rpcUrl = process.env.BASE_RPC_URL;
    
    if (!safeAddress || !usdcAddress || !rpcUrl) {
      throw new Error('Missing required environment variables');
    }
    
    // Create a public client for Base
    const publicClient = createPublicClient({
      chain: base,
      transport: http(rpcUrl),
    });
    
    // Use the direct contract read method from the public client
    const balance = await publicClient.readContract({
      address: usdcAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [safeAddress as `0x${string}`]
    });
    
    // Return the balance as a string
    return balance.toString();
  } catch (error) {
    console.error('Error fetching USDC balance:', error);
    throw error;
  }
}; 