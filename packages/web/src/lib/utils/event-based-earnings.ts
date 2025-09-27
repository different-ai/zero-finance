/**
 * Event-Based Earnings Calculator
 * Accurately calculates earnings based on deposit/withdrawal history
 * Handles multiple deposits, withdrawals, and APY changes over time
 */

export interface EarningsEvent {
  id: string; // Unique identifier (e.g., transaction hash)
  type: 'deposit' | 'withdrawal';
  timestamp: string | Date; // ISO string or Date object
  amount: bigint; // In smallest unit (e.g., cents, wei) to avoid floating point errors
  vaultAddress: string;
  apy: number; // APY at the time of the event (as percentage, e.g., 8 for 8%)
  shares?: bigint; // For tracking proportional withdrawals
  decimals?: number; // Asset decimals for the amount (defaults to 6 if omitted)
}

export interface VaultPosition {
  vaultAddress: string;
  deposits: DepositPosition[];
  currentApy: number;
  decimals: number;
}

export interface DepositPosition {
  id: string;
  timestamp: Date;
  originalAmount: bigint;
  currentAmount: bigint; // After proportional withdrawals
  apy: number; // APY at deposit time
  decimals: number;
}

const DEFAULT_DECIMALS = 6;
const AGGREGATE_DECIMALS = 18;

function scaleAmount(
  amount: bigint,
  fromDecimals: number,
  targetDecimals: number = AGGREGATE_DECIMALS,
): bigint {
  if (fromDecimals === targetDecimals) {
    return amount;
  }

  if (fromDecimals < targetDecimals) {
    const factor = BigInt(10) ** BigInt(targetDecimals - fromDecimals);
    return amount * factor;
  }

  const divisor = BigInt(10) ** BigInt(fromDecimals - targetDecimals);
  return amount / divisor;
}

/**
 * Calculate earnings for a single deposit position
 */
function calculatePositionEarnings(
  position: DepositPosition,
  currentTime: Date = new Date(),
): bigint {
  if (position.currentAmount <= 0n) return 0n;

  // Calculate time elapsed in seconds for precision
  const elapsedMs = currentTime.getTime() - position.timestamp.getTime();
  const elapsedSeconds = BigInt(Math.floor(elapsedMs / 1000));

  // Calculate earnings using integer math
  // earnings = principal * apy * time_in_years
  // To avoid decimals: earnings = (principal * apy * elapsed_seconds) / (100 * 365 * 24 * 60 * 60)
  const secondsInYear = BigInt(365 * 24 * 60 * 60);
  const apyBasisPoints = BigInt(Math.floor(position.apy * 100)); // Convert to basis points

  const earnings =
    (position.currentAmount * apyBasisPoints * elapsedSeconds) /
    (10000n * secondsInYear);

  return earnings;
}

/**
 * Process withdrawal by reducing all deposits proportionally
 * This avoids the FIFO/LIFO complexity
 */
function processWithdrawal(
  deposits: DepositPosition[],
  withdrawalAmount: bigint,
): DepositPosition[] {
  const totalDeposited = deposits.reduce((sum, d) => sum + d.currentAmount, 0n);

  if (totalDeposited === 0n) return deposits;

  // Calculate withdrawal ratio
  const withdrawalRatio = (withdrawalAmount * 10000n) / totalDeposited; // Use basis points for precision

  return deposits.map((deposit) => ({
    ...deposit,
    currentAmount:
      deposit.currentAmount -
      (deposit.currentAmount * withdrawalRatio) / 10000n,
  }));
}

/**
 * Build deposit positions from event history
 */
export function buildPositionsFromEvents(
  events: EarningsEvent[],
): Map<string, VaultPosition> {
  const vaultPositions = new Map<string, VaultPosition>();

  // Sort events by timestamp to process in order
  const sortedEvents = [...events].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeA - timeB;
  });

  for (const event of sortedEvents) {
    let vault = vaultPositions.get(event.vaultAddress);

    if (!vault) {
      vault = {
        vaultAddress: event.vaultAddress,
        deposits: [],
        currentApy: event.apy,
        decimals: event.decimals ?? DEFAULT_DECIMALS,
      };
      vaultPositions.set(event.vaultAddress, vault);
    }

    const decimals = event.decimals ?? vault.decimals ?? DEFAULT_DECIMALS;

    if (event.type === 'deposit') {
      vault.deposits.push({
        id: event.id,
        timestamp: new Date(event.timestamp),
        originalAmount: event.amount,
        currentAmount: event.amount,
        apy: event.apy,
        decimals,
      });
      vault.currentApy = event.apy; // Update to latest APY
      vault.decimals = decimals;
    } else if (event.type === 'withdrawal') {
      // Process proportional withdrawal
      vault.deposits = processWithdrawal(vault.deposits, event.amount);
    }
  }

  return vaultPositions;
}

/**
 * Calculate total accumulated earnings across all vaults
 */
export function calculateTotalEarnings(
  events: EarningsEvent[],
  currentTime: Date = new Date(),
): {
  totalEarnings: bigint;
  byVault: Map<string, bigint>;
  totalPrincipal: bigint;
  // All aggregates are normalised to 18 decimals to allow cross-asset comparisons
} {
  const positions = buildPositionsFromEvents(events);
  const byVault = new Map<string, bigint>();
  let totalEarnings = 0n;
  let totalPrincipal = 0n;

  for (const [vaultAddress, vault] of positions) {
    let vaultEarnings = 0n;
    let vaultPrincipal = 0n;

    for (const deposit of vault.deposits) {
      const earnings = calculatePositionEarnings(deposit, currentTime);
      vaultEarnings += scaleAmount(earnings, deposit.decimals);
      vaultPrincipal += scaleAmount(deposit.currentAmount, deposit.decimals);
    }

    byVault.set(vaultAddress, vaultEarnings);
    totalEarnings += vaultEarnings;
    totalPrincipal += vaultPrincipal;
  }

  return {
    totalEarnings,
    byVault,
    totalPrincipal,
  };
}

/**
 * Calculate earnings per second for live animation
 * Based on current positions and their APYs
 */
export function calculateEarningsPerSecond(events: EarningsEvent[]): bigint {
  const positions = buildPositionsFromEvents(events);
  let totalEarningsPerSecond = 0n;

  for (const vault of positions.values()) {
    for (const deposit of vault.deposits) {
      if (deposit.currentAmount > 0n) {
        // earnings_per_second = (principal * apy) / (100 * 365 * 24 * 60 * 60)
        const secondsInYear = BigInt(365 * 24 * 60 * 60);
        const apyBasisPoints = BigInt(Math.floor(deposit.apy * 100));
        const earningsPerSecond =
          (deposit.currentAmount * apyBasisPoints) / (10000n * secondsInYear);
        totalEarningsPerSecond += scaleAmount(
          earningsPerSecond,
          deposit.decimals,
        );
      }
    }
  }

  return totalEarningsPerSecond;
}

/**
 * Convert from smallest unit to decimal for display
 */
export function formatEarnings(
  amount: bigint,
  decimals: number = DEFAULT_DECIMALS,
): number {
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;

  // Convert to number for display (safe for display amounts)
  return Number(whole) + Number(remainder) / Number(divisor);
}

/**
 * Smart initialization for the animation component
 * Returns both the starting value and the rate of increase
 */
export function initializeEarningsAnimation(
  events: EarningsEvent[],
  currentTime: Date = new Date(),
): {
  initialValue: number;
  earningsPerSecond: number;
  totalPrincipal: number;
} {
  const { totalEarnings, totalPrincipal } = calculateTotalEarnings(
    events,
    currentTime,
  );
  const earningsPerSecond = calculateEarningsPerSecond(events);

  return {
    initialValue: formatEarnings(totalEarnings, AGGREGATE_DECIMALS),
    earningsPerSecond:
      formatEarnings(earningsPerSecond * 1000n, AGGREGATE_DECIMALS) / 1000, // More precision for per-second
    totalPrincipal: formatEarnings(totalPrincipal, AGGREGATE_DECIMALS),
  };
}

/**
 * Validate events for common issues
 */
export function validateEvents(events: EarningsEvent[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const event of events) {
    // Check for duplicates
    if (seenIds.has(event.id)) {
      errors.push(`Duplicate event ID: ${event.id}`);
    }
    seenIds.add(event.id);

    // Check for invalid amounts
    if (event.amount <= 0n) {
      errors.push(`Invalid amount for event ${event.id}: ${event.amount}`);
    }

    // Check for invalid APY
    if (event.apy < 0 || event.apy > 100) {
      errors.push(`Invalid APY for event ${event.id}: ${event.apy}`);
    }

    // Check for invalid timestamp
    const timestamp = new Date(event.timestamp);
    if (isNaN(timestamp.getTime())) {
      errors.push(
        `Invalid timestamp for event ${event.id}: ${event.timestamp}`,
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
