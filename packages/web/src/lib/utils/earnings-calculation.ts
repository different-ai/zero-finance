/**
 * Calculates accumulated earnings based on deposit history
 * This provides a more accurate initial value for the earnings animation
 * rather than starting from 0 or using just 1 day of earnings
 */

interface DepositRecord {
  timestamp: Date | string;
  amount: number;
  apy: number;
}

/**
 * Calculate accumulated earnings from deposit history
 * @param deposits Array of deposits with timestamp, amount, and APY
 * @param currentTime Current time (defaults to now)
 * @returns Total accumulated earnings
 */
export function calculateAccumulatedEarnings(
  deposits: DepositRecord[],
  currentTime: Date = new Date(),
): number {
  if (!deposits || deposits.length === 0) {
    return 0;
  }

  let totalEarnings = 0;

  for (const deposit of deposits) {
    const depositTime =
      typeof deposit.timestamp === 'string'
        ? new Date(deposit.timestamp)
        : deposit.timestamp;

    const timeElapsed = currentTime.getTime() - depositTime.getTime();
    const daysElapsed = timeElapsed / (1000 * 60 * 60 * 24);

    if (daysElapsed > 0 && deposit.apy > 0 && deposit.amount > 0) {
      const yearlyEarnings = (deposit.amount * deposit.apy) / 100;
      const dailyEarnings = yearlyEarnings / 365;
      totalEarnings += dailyEarnings * daysElapsed;
    }
  }

  return totalEarnings;
}

/**
 * Calculate estimated earnings based on current balance and time in vault
 * This is a fallback when deposit history is not available
 *
 * @param balance Current balance in USD
 * @param apy Annual percentage yield (as percentage, e.g., 8 for 8%)
 * @param estimatedDaysInVault Estimated days funds have been in vault (default: 7)
 * @returns Estimated accumulated earnings
 */
export function estimateEarningsFromBalance(
  balance: number,
  apy: number,
  estimatedDaysInVault: number = 7,
): number {
  if (balance <= 0 || apy <= 0) {
    return 0;
  }

  const yearlyEarnings = (balance * apy) / 100;
  const dailyEarnings = yearlyEarnings / 365;

  // Use a more intelligent estimate based on typical user behavior
  // Most users don't withdraw immediately, so 7 days is a reasonable minimum
  // This prevents the animation from appearing to start at 0
  return dailyEarnings * estimatedDaysInVault;
}

/**
 * Smart earnings calculation that uses the best available data
 * Priority order:
 * 1. Actual yield from ledger/chain
 * 2. Calculated from deposit history
 * 3. Estimated from balance with intelligent defaults
 */
export function calculateSmartInitialEarnings(
  ledgerYield: number | null,
  balance: number,
  principal: number,
  apy: number,
  depositHistory?: DepositRecord[],
): number {
  // Priority 1: Use actual yield if available and valid
  if (
    ledgerYield !== null &&
    ledgerYield >= 0 &&
    Number.isFinite(ledgerYield)
  ) {
    return ledgerYield;
  }

  // Priority 2: Calculate from balance - principal if both are valid
  const calculatedYield = balance - principal;
  if (
    calculatedYield > 0 &&
    principal > 0 &&
    Number.isFinite(calculatedYield)
  ) {
    return calculatedYield;
  }

  // Priority 3: Use deposit history if available
  if (depositHistory && depositHistory.length > 0) {
    const accumulated = calculateAccumulatedEarnings(depositHistory);
    if (accumulated > 0) {
      return accumulated;
    }
  }

  // Priority 4: Smart estimate based on balance
  // Instead of just 1 day, use a more reasonable estimate
  if (balance > 0 && apy > 0) {
    // Estimate based on average time in vault (7-30 days is typical)
    // This prevents the jarring "starts from 0" experience
    return estimateEarningsFromBalance(balance, apy, 14); // 14 days as middle ground
  }

  return 0;
}
