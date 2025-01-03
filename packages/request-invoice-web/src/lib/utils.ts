import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats an Ethereum address for display by showing only the first and last 4 characters
 * @param address The full Ethereum address
 * @returns Formatted address string (e.g., "0x1234...5678")
 */
export function formatAddress(address: string): string {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats an amount with proper decimal places and grouping
 * @param amount The amount as a string
 * @returns Formatted amount string
 */
export function formatAmount(amount: string): string {
  try {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(num);
  } catch {
    return amount;
  }
}
