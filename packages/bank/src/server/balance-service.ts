/**
 * Balance Service
 * 
 * Fetches the current USDC balance of the Gnosis Safe on Base.
 */

import { createPublicClient, http, formatUnits, type Address } from 'viem';
import { base } from 'viem/chains';
import { erc20Abi } from 'viem';
import { getRpcUrl, getUsdcAddress } from '../lib/safe-service';

const RPC_URL = getRpcUrl();
const USDC_ADDRESS = getUsdcAddress(); // Default USDC contract address

// Keep the default primary safe address from env for fallback/existing behavior
const DEFAULT_PRIMARY_SAFE_ADDRESS = process.env.NEXT_PUBLIC_SAFE_ADDRESS as Address | undefined;

if (!RPC_URL) {
  throw new Error('BASE_RPC_URL environment variable is not defined.');
}
if (!USDC_ADDRESS) {
  throw new Error('NEXT_PUBLIC_USDC_ADDRESS_BASE environment variable is not defined.');
}

// Initialize Viem Public Client
const publicClient = createPublicClient({
  chain: base,
  transport: http(RPC_URL),
});

/**
 * Fetches the USDC balance for a specific Safe address.
 * 
 * @param safeAddress The address of the Safe to check the balance for. Defaults to NEXT_PUBLIC_SAFE_ADDRESS if not provided.
 * @returns The balance in wei (string).
 */
export const fetchUSDCBalance = async (safeAddress?: Address): Promise<string> => {
  const targetAddress = safeAddress || DEFAULT_PRIMARY_SAFE_ADDRESS;

  if (!targetAddress) {
    throw new Error('Safe address is not defined. Provide an address or set NEXT_PUBLIC_SAFE_ADDRESS.');
  }
  if (!USDC_ADDRESS) {
      // This check is redundant due to the top-level check, but good practice
      throw new Error('USDC contract address is not defined.');
  }

  try {
    const balance = await publicClient.readContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [targetAddress],
    });
    console.log(`Fetched USDC balance for ${targetAddress}: ${balance.toString()} wei`);
    return balance.toString(); // Return balance in wei string format
  } catch (error) {
    console.error(`Error fetching USDC balance for ${targetAddress}:`, error);
    throw new Error(`Failed to fetch USDC balance: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Fetches the USDC balance and formats it.
 * Primarily used for display purposes.
 * 
 * @param safeAddress Optional Safe address to check.
 * @returns Formatted balance string (e.g., "100.00").
 */
export const getFormattedUSDCBalance = async (safeAddress?: Address): Promise<string> => {
  const balanceWei = await fetchUSDCBalance(safeAddress); // Re-use the core fetching logic
  return formatUnits(BigInt(balanceWei), 6); // Assuming USDC has 6 decimals
}; 