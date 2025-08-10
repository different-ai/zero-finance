import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatUnits } from 'viem';
import { getCurrencyConfig } from './currencies'; // Import the currency config getter
import { v4 as uuidv4 } from 'uuid';
import type { UIMessage } from 'ai';

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

export const generateUUID = (): string => {
  console.warn('[Placeholder] Using generateUUID() from @/lib/utils.ts');
  return uuidv4();
};

export const getMostRecentUserMessage = (messages: UIMessage[]): UIMessage | undefined => {
  console.warn('[Placeholder] Using getMostRecentUserMessage() from @/lib/utils.ts');
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      return messages[i];
    }
  }
  return undefined;
};

export const getTrailingMessageId = (messages: Pick<UIMessage, 'id'>[]): string | undefined => {
  console.warn('[Placeholder] Using getTrailingMessageId() from @/lib/utils.ts');
  return messages[messages.length - 1]?.id;
};

// Add other utilities from deep-yield/lib/utils if needed

// No changes from previous version

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatUsdWithPrecision(amount: number, decimals: number = 6): string {
  // For very small amounts, show more decimal places
  if (amount > 0 && amount < 0.01) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals, // Show up to 6 decimal places for tiny amounts
    }).format(amount)
  }
  
  // For amounts between 0.01 and 1, show up to 4 decimal places
  if (amount >= 0.01 && amount < 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount)
  }
  
  // For larger amounts, use standard 2 decimal places
  return formatUsd(amount)
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  
  return new Date(timestamp).toLocaleDateString()
}

export function projectYield(principal: number, weeklyDeposit: number, apy: number): number {
  // Simple approximation for first year earnings
  const totalDeposits = principal + (weeklyDeposit * 52)
  const avgBalance = totalDeposits / 2 // Rough average balance over the year
  return avgBalance * (apy / 100)
}
