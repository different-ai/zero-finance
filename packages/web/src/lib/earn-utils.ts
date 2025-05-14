'use client'; // Or remove if no client-side hooks are ever added here

// Assuming 6 decimals for USDC for display by default
const USDC_DECIMALS = 6;

export const formatCurrency = (
  value: string | bigint | number | undefined,
  decimals = USDC_DECIMALS,
  symbol = 'USDC',
): string => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return `0 ${symbol}`;
  }
  try {
    const valStr = String(value);
    if (!/^\d+$/.test(valStr)) {
      // console.warn("formatCurrency: value is not a valid integer string for BigInt", valStr);
      return `0 ${symbol}`; 
    }
    const num = BigInt(valStr) / BigInt(10 ** decimals);
    // Format with commas for thousands
    return `${num.toLocaleString()} ${symbol}`;
  } catch (error) {
    // console.error("Error formatting currency:", value, error);
    return `0 ${symbol}`;
  }
};

export const formatPercentage = (value: number | undefined): string => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return '0.0%';
  }
  return `${Number(value).toFixed(1)}%`;
};

export const calculateYearlyGain = (
  balance: string | bigint | number | undefined,
  allocation: number | undefined,
  apy: number | undefined,
  decimals = USDC_DECIMALS,
): string => {
  if (
    balance === undefined ||
    balance === null ||
    String(balance).trim() === '' ||
    allocation === undefined ||
    allocation === null ||
    isNaN(Number(allocation)) ||
    apy === undefined ||
    apy === null ||
    isNaN(Number(apy))
  ) {
    return '0'; // Return as string for consistency with formatCurrency output without symbol
  }
  try {
    const balanceStr = String(balance);
    if (!/^\d+$/.test(balanceStr)) {
      return '0';
    }
    const currentAllocation = Number(allocation);
    const currentApy = Number(apy);

    const earningBalance = (BigInt(balanceStr) * BigInt(currentAllocation)) / 100n;
    // APY is a percentage, e.g., 5.4 for 5.4%. So, 5.4 / 100 = 0.054
    // To avoid floating point with BigInt, multiply APY by 100 (e.g. 5.4 -> 540 for 2 decimal places of APY precision)
    // then divide by 100 * 100 = 10000 at the end.
    const yearlyGainWei = (earningBalance * BigInt(Math.round(currentApy * 100))) / 10000n;
    return (yearlyGainWei / BigInt(10 ** decimals)).toString();
  } catch (error) {
    // console.error("Error in calculateYearlyGain:", { balance, allocation, apy }, error);
    return '0';
  }
};

export const timeAgo = (dateString: string | null): string => {
  if (!dateString) return 'never';
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
}; 