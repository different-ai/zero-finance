/**
 * Safe Balance Service
 * 
 * Fetches the current USDC balance of the Gnosis Safe on Base.
 * Designed for interaction with the Primary Safe and supports any configured Safe address.
 */

import { Address, createPublicClient, formatUnits, http } from 'viem';
import { base } from 'viem/chains';
import UsdcABI from '@/lib/abis/usdc';

// Constants
export const USDC_DECIMALS = 6;
const BASE_CHAIN_ID = base.id;

// Safe (Gnosis) and USDC addresses
const DEFAULT_SAFE_ADDRESS = 
  process.env.NEXT_PUBLIC_SAFE_ADDRESS as Address | undefined;
const USDC_ADDRESS = 
  process.env.NEXT_PUBLIC_USDC_ADDRESS as Address ||
  // Default USDC address on Base
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Configure Viem client
const publicClient = createPublicClient({ 
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL) 
});

/**
 * Fetches the USDC balance for a specific Safe address.
 * Uses Viem to interact with USDC contract.
 * 
 * @param safeAddress The address of the Safe to check the balance for. Defaults to NEXT_PUBLIC_SAFE_ADDRESS if not provided.
 * @returns The raw USDC balance in wei (as a string).
 */
export const fetchUSDCBalance = async (safeAddress?: Address): Promise<string> => {
  try {
    // Use provided address or default from env
    const targetAddress = safeAddress || DEFAULT_SAFE_ADDRESS;
    
    if (!targetAddress) {
      console.error('No Safe address provided and NEXT_PUBLIC_SAFE_ADDRESS not set');
      throw new Error('No Safe address available for balance check');
    }
    
    console.log(`[Balance Service] Fetching USDC balance for Safe: ${targetAddress}`);
    
    // Fetch balance using Viem
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: UsdcABI,
      functionName: 'balanceOf',
      args: [targetAddress],
    });
    
    console.log(`[Balance Service] Fetched USDC balance for ${targetAddress}: ${balance.toString()} wei`);
    return balance.toString();
    
  } catch (error) {
    console.error(`[Balance Service] Error fetching USDC balance:`, error);
    throw new Error(`Failed to fetch USDC balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Fetches the USDC balance and formats it.
 * Useful for display purposes in UI.
 * 
 * @param safeAddress Optional safe address to check
 * @returns The formatted USDC balance as a string with 2 decimal places.
 */
export const getFormattedUSDCBalance = async (safeAddress?: Address): Promise<string> => {
  const balanceWei = await fetchUSDCBalance(safeAddress); // Re-use the core fetching logic
  
  try {
    // Format to 2 decimal places for readability
    const formatted = formatUnits(BigInt(balanceWei), USDC_DECIMALS);
    return Number(formatted).toFixed(2);
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0.00'; // Return default on error
  }
}; 