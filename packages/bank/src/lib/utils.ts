import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  // Handle crypto currencies which are not valid ISO currency codes
  const cryptos = ["BTC", "ETH", "USDC", "USDT"];
  
  if (cryptos.includes(currency)) {
    return `${amount.toLocaleString()} ${currency}`;
  }
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatIBAN(iban: string) {
  // Format IBAN with spaces every 4 characters for readability
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

export function truncateAddress(address: string, chars = 4) {
  if (!address) return "";
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(date));
}