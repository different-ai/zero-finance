import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string | undefined | null, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) {
    return address; // Return address if it's too short to shorten
  }
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}
