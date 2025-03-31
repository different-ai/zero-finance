/**
 * Calculates the projected profit from a yield investment
 * 
 * @param principal - Initial investment amount
 * @param annualPercentYield - Annual percentage yield (APY) as a percentage (e.g., 5.2 for 5.2%)
 * @param days - Number of days to project for
 * @returns The projected profit amount
 */
export function calculateProjectedProfit(
  principal: number,
  annualPercentYield: number,
  days: number
): number {
  // Convert APY from percentage to decimal
  const apyDecimal = annualPercentYield / 100;
  
  // Calculate the compound interest
  // Using the formula: P * (1 + r)^t - P
  // Where P is principal, r is rate, and t is time in years
  const years = days / 365;
  const futureValue = principal * Math.pow(1 + apyDecimal, years);
  const profit = futureValue - principal;
  
  // Round to 2 decimal places
  return Math.round(profit * 100) / 100;
} 