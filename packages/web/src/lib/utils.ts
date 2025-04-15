import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatUnits } from 'viem';
import { getCurrencyConfig } from './currencies'; // Import the currency config getter

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a raw currency amount (string or bigint) into a human-readable string
 * based on the currency's decimals and symbol.
 *
 * @param amount The raw amount (e.g., "150000" for 0.15 USDC). Can be string or bigint.
 * @param currencySymbol The currency symbol (e.g., "USDC").
 * @param networkId The network identifier (e.g., "base").
 * @returns A formatted string like "0.15 USDC" or an error message.
 */
export function formatDisplayCurrency(
  amount: string | bigint | null | undefined,
  currencySymbol: string | null | undefined,
  networkId: string | null | undefined
): string {
  if (amount === null || amount === undefined || currencySymbol === null || currencySymbol === undefined || networkId === null || networkId === undefined) {
    console.warn('formatDisplayCurrency: Missing required parameters', { amount, currencySymbol, networkId });
    return 'N/A'; // Or some other indicator of missing data
  }

  // getCurrencyConfig returns undefined for unsupported/invalid combinations
  const config = getCurrencyConfig(currencySymbol, networkId);

  if (!config) {
    console.error(`formatDisplayCurrency: No config found for ${currencySymbol} on network ${networkId}. Returning raw amount.`);
    // Fallback: return the raw amount with the symbol
    return `${amount} ${currencySymbol}`; 
  }

  try {
    // Convert string amount to BigInt if necessary
    const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;
    const formatted = formatUnits(amountBigInt, config.decimals);
    // Optional: Improve formatting (e.g., remove trailing zeros after decimal point if desired)
    // const finalFormatted = parseFloat(formatted).toString(); // Example: removes trailing .00
    return `${formatted} ${config.symbol}`;
  } catch (error) {
    console.error('formatDisplayCurrency: Error formatting amount:', { amount, currencySymbol, networkId, error });
    // Fallback in case of formatting error (e.g., invalid BigInt string)
    return `${amount} ${currencySymbol}`;
  }
}
