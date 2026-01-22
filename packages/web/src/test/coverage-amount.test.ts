import { describe, expect, it } from 'vitest';

import {
  formatCoverageUsd,
  parseCoverageAmountParam,
} from '@/lib/insurance/coverage-amount';

describe('parseCoverageAmountParam', () => {
  it('defaults when missing', () => {
    expect(parseCoverageAmountParam(undefined)).toBe(100_000);
  });

  it('parses integers', () => {
    expect(parseCoverageAmountParam('250000')).toBe(250_000);
  });

  it('parses k and m suffixes', () => {
    expect(parseCoverageAmountParam('100k')).toBe(100_000);
    expect(parseCoverageAmountParam('1m')).toBe(1_000_000);
    expect(parseCoverageAmountParam('0.5m')).toBe(500_000);
  });

  it('clamps to 1,000,000', () => {
    expect(parseCoverageAmountParam('2000000')).toBe(1_000_000);
  });
});

describe('formatCoverageUsd', () => {
  it('formats full USD without cents', () => {
    expect(formatCoverageUsd(100_000, { style: 'full' })).toBe('$100,000');
  });

  it('formats compact USD', () => {
    expect(formatCoverageUsd(100_000, { style: 'compact' })).toBe('$100k');
  });
});
