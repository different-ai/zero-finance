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

export const projectYield = (principal: number, pct: number, apy: number): number => {
  if (principal < 0 || pct < 0 || pct > 100 || apy < 0) return 0
  return principal * (pct / 100) * (apy / 100)
}
export const formatUsd = (amount: number): string => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
export function timeAgo(timestamp: number): string {
  const now = new Date().getTime()
  const seconds = Math.round((now - timestamp) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
