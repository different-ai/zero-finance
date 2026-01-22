const DEFAULT_COVERAGE_USD = 100_000;

function normalizeAmountString(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[$,\s_]/g, '');
}

/**
 * Parse a coverage amount from a query param.
 *
 * Supported inputs:
 * - 100000
 * - "100000"
 * - "100k"
 * - "1m"
 *
 * Notes:
 * - Returns an integer USD amount.
 * - Clamped to [0, 1_000_000].
 */
export function parseCoverageAmountParam(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return clampCoverage(Math.round(value));
  }

  if (typeof value !== 'string') {
    return DEFAULT_COVERAGE_USD;
  }

  const normalized = normalizeAmountString(value);
  if (!normalized) {
    return DEFAULT_COVERAGE_USD;
  }

  const match = normalized.match(/^([0-9]+(?:\.[0-9]+)?)([km])?$/);
  if (!match) {
    return DEFAULT_COVERAGE_USD;
  }

  const num = Number(match[1]);
  if (!Number.isFinite(num)) {
    return DEFAULT_COVERAGE_USD;
  }

  const suffix = match[2];
  const multiplier = suffix === 'k' ? 1_000 : suffix === 'm' ? 1_000_000 : 1;
  return clampCoverage(Math.round(num * multiplier));
}

function clampCoverage(amount: number): number {
  return Math.min(1_000_000, Math.max(0, amount));
}

export function formatCoverageUsd(
  amountUsd: number,
  opts?: { style?: 'compact' | 'full' },
): string {
  const style = opts?.style ?? 'full';

  if (style === 'compact') {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 0,
    }).format(amountUsd);

    // Prefer "$100k" over "$100K".
    return formatted.replace(/K\b/g, 'k');
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountUsd);
}

export function getCoverageUsdFromSearchParams(
  searchParams: Record<string, unknown>,
): number {
  const value =
    (searchParams.coverage as unknown) ??
    (searchParams.amount as unknown) ??
    (searchParams.max as unknown);
  return parseCoverageAmountParam(value);
}

export const DEFAULT_COVERAGE_AMOUNT_USD = DEFAULT_COVERAGE_USD;
