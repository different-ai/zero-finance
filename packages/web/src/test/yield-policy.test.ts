import { describe, expect, it } from 'vitest';
import {
  isVaultActionable,
  type YieldPolicy,
} from '@/server/services/yield-policy';
import { buildVaultPolicyErrorDetails } from '@/server/earn/yield-service';

type PolicyOverrides = Partial<YieldPolicy>;

const basePolicy = (overrides: PolicyOverrides = {}): YieldPolicy => ({
  insuranceStatus: 'sandbox',
  hasCompletedKyc: false,
  canUseSandbox: true,
  canUseUninsured: false,
  canUseInsured: false,
  ...overrides,
});

describe('isVaultActionable', () => {
  it('blocks actions when insurance is suspended', () => {
    const policy = basePolicy({
      insuranceStatus: 'suspended',
      canUseSandbox: false,
    });

    const result = isVaultActionable(
      { isInsured: false, sandboxOnly: false },
      policy,
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Insurance status suspended.');
  });

  it('allows sandbox vaults when sandbox access enabled', () => {
    const policy = basePolicy({
      insuranceStatus: 'sandbox',
      canUseSandbox: true,
    });

    const result = isVaultActionable(
      { isInsured: false, sandboxOnly: true },
      policy,
    );

    expect(result.allowed).toBe(true);
  });

  it('blocks production vaults during sandbox-only access', () => {
    const policy = basePolicy({
      insuranceStatus: 'sandbox',
      canUseSandbox: true,
    });

    const result = isVaultActionable(
      { isInsured: false, sandboxOnly: false },
      policy,
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Sandbox-only access is enabled.');
  });

  it('blocks production vaults when KYC incomplete', () => {
    const policy = basePolicy({
      insuranceStatus: 'pending',
      hasCompletedKyc: false,
      canUseUninsured: true,
    });

    const result = isVaultActionable(
      { isInsured: false, sandboxOnly: false },
      policy,
    );

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('KYC not completed.');
  });

  it('allows insured vaults when insurance active and KYC complete', () => {
    const policy = basePolicy({
      insuranceStatus: 'active',
      hasCompletedKyc: true,
      canUseUninsured: true,
      canUseInsured: true,
    });

    const result = isVaultActionable(
      { isInsured: true, sandboxOnly: false },
      policy,
    );

    expect(result.allowed).toBe(true);
  });

  it('allows uninsured vaults when insurance pending and KYC complete', () => {
    const policy = basePolicy({
      insuranceStatus: 'pending',
      hasCompletedKyc: true,
      canUseUninsured: true,
    });

    const result = isVaultActionable(
      { isInsured: false, sandboxOnly: false },
      policy,
    );

    expect(result.allowed).toBe(true);
  });
});

describe('buildVaultPolicyErrorDetails', () => {
  it('exposes insurance and KYC details for insured vaults', () => {
    const policy = basePolicy({
      insuranceStatus: 'pending',
      hasCompletedKyc: false,
      canUseUninsured: true,
    });

    const details = buildVaultPolicyErrorDetails(
      policy,
      { sandboxOnly: false, isInsured: true },
      'KYC not completed.',
    );

    expect(details).toMatchObject({
      reason: 'KYC not completed.',
      insurance_status: 'pending',
      has_completed_kyc: false,
      sandbox_enabled: true,
      sandbox_only: false,
      insured: true,
      required_insurance_status: 'active',
    });
  });
});
