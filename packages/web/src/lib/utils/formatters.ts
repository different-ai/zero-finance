import { formatUnits } from 'viem';

/**
 * Formats a bigint amount from its smallest unit to a human-readable string 
 * with a specified number of decimal places and thousand separators.
 * 
 * @param value The bigint value to format.
 * @param decimals The number of decimal places the unit has (e.g., 6 for USDC).
 * @param displayDecimals The number of decimal places to show in the output, defaults to 2.
 * @returns A formatted string representation of the amount.
 */
export function formatAmount(
  value: bigint | undefined | null,
  decimals: number = 6, // Default to USDC-like decimals
  displayDecimals: number = 2,
): string {
  if (value === undefined || value === null) {
    return '0.00'; // Or some other placeholder like '--'
  }
  try {
    const formatted = formatUnits(value, decimals);
    const numberValue = parseFloat(formatted);
    // Use toLocaleString for thousand separators and toFixed for decimal places
    return numberValue.toLocaleString(undefined, { 
      minimumFractionDigits: displayDecimals, 
      maximumFractionDigits: displayDecimals 
    });
  } catch (e) {
    console.error("Error formatting amount:", e);
    return '0.00'; // Fallback for any error during formatting
  }
}

/**
 * Shortens an Ethereum address to the format "0x1234...cdef".
 * 
 * @param address The Ethereum address string.
 * @param startChars The number of characters to show at the beginning (after "0x").
 * @param endChars The number of characters to show at the end.
 * @returns The shortened address string or the original if it's too short.
 */
export function shortenAddress(
  address: string | undefined | null,
  startChars: number = 4,
  endChars: number = 4,
): string {
  if (!address) {
    return 'N/A';
  }
  if (address.length < startChars + endChars + 2) { // +2 for "0x"
    return address; // Address is too short to shorten effectively
  }
  return `${address.substring(0, startChars + 2)}...${address.substring(address.length - endChars)}`;
} 