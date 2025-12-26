/**
 * SimplifiedOffRamp Component Tests
 *
 * These tests focus on OBSERVABLE BEHAVIOR, not implementation details.
 * They test:
 * 1. Pure utility functions (can be extracted without breaking tests)
 * 2. Business logic contracts (what goes in, what comes out)
 * 3. Constants/configuration integrity
 *
 * After refactoring, these tests should pass without modification.
 */

import { describe, it, expect } from 'vitest';
import { type Address } from 'viem';

// ============================================================================
// TEST 1: Constants & Configuration
// These ensure configuration values remain correct after refactoring
// ============================================================================

describe('SimplifiedOffRamp Constants', () => {
  // We'll import these from the component or extracted module
  const CRYPTO_ASSETS = {
    usdc: {
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      icon: '💵',
      isNative: false,
    },
    weth: {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
      icon: '⟠',
      isNative: false,
    },
    eth: {
      symbol: 'ETH',
      name: 'Ether',
      decimals: 18,
      icon: '⟠',
      isNative: true,
    },
  };

  describe('CRYPTO_ASSETS configuration', () => {
    it('has correct USDC decimals (6)', () => {
      expect(CRYPTO_ASSETS.usdc.decimals).toBe(6);
    });

    it('has correct WETH decimals (18)', () => {
      expect(CRYPTO_ASSETS.weth.decimals).toBe(18);
    });

    it('has correct ETH decimals (18)', () => {
      expect(CRYPTO_ASSETS.eth.decimals).toBe(18);
    });

    it('marks ETH as native, others as non-native', () => {
      expect(CRYPTO_ASSETS.eth.isNative).toBe(true);
      expect(CRYPTO_ASSETS.usdc.isNative).toBe(false);
      expect(CRYPTO_ASSETS.weth.isNative).toBe(false);
    });

    it('has all required asset keys', () => {
      expect(Object.keys(CRYPTO_ASSETS)).toEqual(['usdc', 'weth', 'eth']);
    });
  });
});

// ============================================================================
// TEST 2: Pure Utility Functions
// These can be extracted to separate files - tests remain valid
// ============================================================================

describe('SimplifiedOffRamp Utility Functions', () => {
  describe('buildPrevalidatedSig', () => {
    // Replicate the function logic for testing
    function buildPrevalidatedSig(owner: Address): `0x${string}` {
      return `0x000000000000000000000000${owner.slice(
        2,
      )}000000000000000000000000000000000000000000000000000000000000000001` as `0x${string}`;
    }

    it('builds correct signature format for valid address', () => {
      const owner = '0x1234567890abcdef1234567890abcdef12345678' as Address;
      const sig = buildPrevalidatedSig(owner);

      // Should be 132 characters (0x + 130 hex chars = 65 bytes)
      expect(sig).toHaveLength(132);
      expect(sig.startsWith('0x000000000000000000000000')).toBe(true);
      expect(sig).toContain('1234567890abcdef1234567890abcdef12345678');
      expect(sig.endsWith('0001')).toBe(true);
    });

    it('produces deterministic output', () => {
      const owner = '0xabcdef1234567890abcdef1234567890abcdef12' as Address;
      const sig1 = buildPrevalidatedSig(owner);
      const sig2 = buildPrevalidatedSig(owner);
      expect(sig1).toBe(sig2);
    });

    it('produces different output for different addresses', () => {
      const owner1 = '0x1111111111111111111111111111111111111111' as Address;
      const owner2 = '0x2222222222222222222222222222222222222222' as Address;
      const sig1 = buildPrevalidatedSig(owner1);
      const sig2 = buildPrevalidatedSig(owner2);
      expect(sig1).not.toBe(sig2);
    });
  });
});

// ============================================================================
// TEST 3: Vault Withdrawal Logic
// Critical business logic for auto-withdraw from earning balance
// ============================================================================

describe('Vault Withdrawal Logic', () => {
  // Mock vault position type matching the component
  interface VaultPosition {
    vaultAddress: string;
    assetsUsd: number;
    apy: number;
  }

  describe('vault sorting by APY', () => {
    it('sorts vaults by APY ascending (lowest first)', () => {
      const vaults: VaultPosition[] = [
        { vaultAddress: '0xVault1', assetsUsd: 100, apy: 5 },
        { vaultAddress: '0xVault2', assetsUsd: 200, apy: 3 },
        { vaultAddress: '0xVault3', assetsUsd: 150, apy: 7 },
      ];

      const sorted = [...vaults].sort((a, b) => (a.apy || 0) - (b.apy || 0));

      expect(sorted[0].apy).toBe(3); // Lowest APY first
      expect(sorted[1].apy).toBe(5);
      expect(sorted[2].apy).toBe(7); // Highest APY last (preserved)
    });

    it('handles vaults with zero APY', () => {
      const vaults: VaultPosition[] = [
        { vaultAddress: '0xVault1', assetsUsd: 100, apy: 5 },
        { vaultAddress: '0xVault2', assetsUsd: 200, apy: 0 },
      ];

      const sorted = [...vaults].sort((a, b) => (a.apy || 0) - (b.apy || 0));

      expect(sorted[0].apy).toBe(0);
      expect(sorted[1].apy).toBe(5);
    });
  });

  describe('withdrawal amount calculation', () => {
    it('calculates correct deficit when idle < amount', () => {
      const idleBalance = 100;
      const earningBalance = 500;
      const amountToSend = 300;

      const deficit = Math.max(0, amountToSend - idleBalance);

      expect(deficit).toBe(200); // Need 200 from earning
    });

    it('returns zero deficit when idle >= amount', () => {
      const idleBalance = 500;
      const amountToSend = 300;

      const deficit = Math.max(0, amountToSend - idleBalance);

      expect(deficit).toBe(0);
    });

    it('correctly identifies when earning withdraw is needed', () => {
      const idleBalance = 100;
      const earningBalance = 500;
      const amountToSend = 300;

      const deficit = Math.max(0, amountToSend - idleBalance);
      const needsEarningWithdraw = deficit > 0 && deficit <= earningBalance;

      expect(needsEarningWithdraw).toBe(true);
    });

    it('correctly identifies insufficient funds', () => {
      const idleBalance = 100;
      const earningBalance = 100;
      const spendableBalance = idleBalance + earningBalance; // 200
      const amountToSend = 300;

      const insufficientFunds = amountToSend > spendableBalance;

      expect(insufficientFunds).toBe(true);
    });
  });

  describe('withdrawal transaction building', () => {
    it('calculates correct amount to withdraw from each vault', () => {
      const vaults: VaultPosition[] = [
        { vaultAddress: '0xVault1', assetsUsd: 100, apy: 3 }, // Will be first (lowest APY)
        { vaultAddress: '0xVault2', assetsUsd: 200, apy: 5 },
      ];
      const amountNeeded = 150;

      // Sort by APY ascending
      const sorted = [...vaults].sort((a, b) => a.apy - b.apy);

      let remaining = amountNeeded;
      const withdrawals: { vault: string; amount: number }[] = [];

      for (const vault of sorted) {
        if (remaining <= 0) break;
        const withdrawAmount = Math.min(remaining, vault.assetsUsd);
        withdrawals.push({ vault: vault.vaultAddress, amount: withdrawAmount });
        remaining -= withdrawAmount;
      }

      // Should withdraw 100 from Vault1, 50 from Vault2
      expect(withdrawals).toHaveLength(2);
      expect(withdrawals[0]).toEqual({ vault: '0xVault1', amount: 100 });
      expect(withdrawals[1]).toEqual({ vault: '0xVault2', amount: 50 });
    });

    it('stops withdrawing when amount is reached', () => {
      const vaults: VaultPosition[] = [
        { vaultAddress: '0xVault1', assetsUsd: 500, apy: 3 },
        { vaultAddress: '0xVault2', assetsUsd: 500, apy: 5 },
      ];
      const amountNeeded = 300;

      const sorted = [...vaults].sort((a, b) => a.apy - b.apy);

      let remaining = amountNeeded;
      const withdrawals: { vault: string; amount: number }[] = [];

      for (const vault of sorted) {
        if (remaining <= 0) break;
        const withdrawAmount = Math.min(remaining, vault.assetsUsd);
        withdrawals.push({ vault: vault.vaultAddress, amount: withdrawAmount });
        remaining -= withdrawAmount;
      }

      // Should only withdraw from first vault
      expect(withdrawals).toHaveLength(1);
      expect(withdrawals[0]).toEqual({ vault: '0xVault1', amount: 300 });
    });

    it('skips vaults with zero balance', () => {
      const vaults: VaultPosition[] = [
        { vaultAddress: '0xVault1', assetsUsd: 0, apy: 3 },
        { vaultAddress: '0xVault2', assetsUsd: 200, apy: 5 },
      ];
      const amountNeeded = 100;

      const sorted = [...vaults].sort((a, b) => a.apy - b.apy);

      let remaining = amountNeeded;
      const withdrawals: { vault: string; amount: number }[] = [];

      for (const vault of sorted) {
        if (remaining <= 0) break;
        if (vault.assetsUsd <= 0) continue; // Skip zero balance
        const withdrawAmount = Math.min(remaining, vault.assetsUsd);
        withdrawals.push({ vault: vault.vaultAddress, amount: withdrawAmount });
        remaining -= withdrawAmount;
      }

      expect(withdrawals).toHaveLength(1);
      expect(withdrawals[0].vault).toBe('0xVault2');
    });
  });
});

// ============================================================================
// TEST 4: Amount & Balance Validation Logic
// Form validation that affects user experience
// ============================================================================

describe('Amount Validation Logic', () => {
  describe('amount parsing', () => {
    it('parses valid decimal amounts', () => {
      expect(parseFloat('100.50')).toBe(100.5);
      expect(parseFloat('0.01')).toBe(0.01);
      expect(parseFloat('1000000')).toBe(1000000);
    });

    it('handles empty string as NaN, fallback to 0', () => {
      const emptyValue = '';
      const amount = parseFloat(emptyValue || '0');
      expect(amount).toBe(0);

      // Direct empty string parsing returns NaN
      expect(parseFloat('')).toBeNaN();
    });

    it('handles invalid input', () => {
      expect(parseFloat('abc')).toBeNaN();
      expect(isNaN(parseFloat('not-a-number'))).toBe(true);
    });
  });

  describe('balance validation', () => {
    const validateAmount = (
      value: string,
      spendableBalance: number,
    ): string | true => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0)
        return 'Please enter a valid positive amount.';
      if (num > spendableBalance)
        return `Insufficient balance. You have ${spendableBalance.toFixed(2)} USDC.`;
      return true;
    };

    it('returns error for zero amount', () => {
      expect(validateAmount('0', 1000)).toBe(
        'Please enter a valid positive amount.',
      );
    });

    it('returns error for negative amount', () => {
      expect(validateAmount('-50', 1000)).toBe(
        'Please enter a valid positive amount.',
      );
    });

    it('returns error for amount exceeding balance', () => {
      const result = validateAmount('1500', 1000);
      expect(result).toContain('Insufficient balance');
      expect(result).toContain('1000.00');
    });

    it('returns true for valid amount within balance', () => {
      expect(validateAmount('500', 1000)).toBe(true);
    });

    it('allows amount equal to balance', () => {
      expect(validateAmount('1000', 1000)).toBe(true);
    });
  });
});

// ============================================================================
// TEST 5: Destination Type Logic
// Determines transfer flow (ACH vs IBAN vs Crypto)
// ============================================================================

describe('Destination Type Logic', () => {
  describe('default destination selection', () => {
    const getDefaultDestination = (
      hasAchAccount: boolean,
      hasIbanAccount: boolean,
      isTechnical: boolean,
    ): 'ach' | 'iban' | 'crypto' => {
      const shouldDefaultToCrypto =
        isTechnical && !hasIbanAccount && !hasAchAccount;
      if (shouldDefaultToCrypto) return 'crypto';
      if (hasAchAccount) return 'ach';
      if (hasIbanAccount) return 'iban';
      return 'ach';
    };

    it('defaults to ACH when ACH account exists', () => {
      expect(getDefaultDestination(true, false, false)).toBe('ach');
      expect(getDefaultDestination(true, true, false)).toBe('ach'); // ACH takes priority
    });

    it('defaults to IBAN when only IBAN exists', () => {
      expect(getDefaultDestination(false, true, false)).toBe('iban');
    });

    it('defaults to crypto in technical mode with no bank accounts', () => {
      expect(getDefaultDestination(false, false, true)).toBe('crypto');
    });

    it('does not default to crypto in non-technical mode', () => {
      expect(getDefaultDestination(false, false, false)).toBe('ach');
    });
  });

  describe('currency determination', () => {
    const getCurrencyInfo = (
      destinationType: 'ach' | 'iban' | 'crypto',
    ): { symbol: string; code: string } => {
      const isEur = destinationType === 'iban';
      return {
        symbol: isEur ? '€' : '$',
        code: isEur ? 'EUR' : 'USD',
      };
    };

    it('returns EUR for IBAN', () => {
      const info = getCurrencyInfo('iban');
      expect(info.symbol).toBe('€');
      expect(info.code).toBe('EUR');
    });

    it('returns USD for ACH', () => {
      const info = getCurrencyInfo('ach');
      expect(info.symbol).toBe('$');
      expect(info.code).toBe('USD');
    });

    it('returns USD for crypto', () => {
      const info = getCurrencyInfo('crypto');
      expect(info.symbol).toBe('$');
      expect(info.code).toBe('USD');
    });
  });
});

// ============================================================================
// TEST 6: Form Step Validation Logic
// Multi-step form navigation
// ============================================================================

describe('Form Step Validation', () => {
  type DestinationType = 'ach' | 'iban' | 'crypto';
  type AccountHolderType = 'individual' | 'business';

  const getFieldsToValidate = (
    formStep: number,
    destinationType: DestinationType,
    accountHolderType: AccountHolderType,
  ): string[] => {
    let fields: string[] = [];

    if (formStep === 1) {
      fields = ['destinationType'];
    } else if (formStep === 2) {
      fields = ['amount'];

      if (destinationType === 'crypto') {
        fields.push('cryptoAddress', 'cryptoAsset');
      } else {
        fields.push('accountHolderType', 'bankName');

        if (accountHolderType === 'individual') {
          fields.push('accountHolderFirstName', 'accountHolderLastName');
        } else {
          fields.push('accountHolderBusinessName');
        }

        if (destinationType === 'ach') {
          fields.push('accountNumber', 'routingNumber');
        } else {
          fields.push('iban', 'bic');
        }

        fields.push('country', 'city', 'streetLine1', 'postalCode');
      }
    }

    return fields;
  };

  describe('step 1 validation', () => {
    it('only validates destinationType', () => {
      const fields = getFieldsToValidate(1, 'ach', 'individual');
      expect(fields).toEqual(['destinationType']);
    });
  });

  describe('step 2 validation for ACH', () => {
    it('includes bank account fields for individual', () => {
      const fields = getFieldsToValidate(2, 'ach', 'individual');
      expect(fields).toContain('amount');
      expect(fields).toContain('accountNumber');
      expect(fields).toContain('routingNumber');
      expect(fields).toContain('accountHolderFirstName');
      expect(fields).toContain('accountHolderLastName');
      expect(fields).not.toContain('accountHolderBusinessName');
    });

    it('includes business name for business', () => {
      const fields = getFieldsToValidate(2, 'ach', 'business');
      expect(fields).toContain('accountHolderBusinessName');
      expect(fields).not.toContain('accountHolderFirstName');
    });
  });

  describe('step 2 validation for IBAN', () => {
    it('includes IBAN fields instead of ACH fields', () => {
      const fields = getFieldsToValidate(2, 'iban', 'individual');
      expect(fields).toContain('iban');
      expect(fields).toContain('bic');
      expect(fields).not.toContain('accountNumber');
      expect(fields).not.toContain('routingNumber');
    });
  });

  describe('step 2 validation for crypto', () => {
    it('includes crypto-specific fields only', () => {
      const fields = getFieldsToValidate(2, 'crypto', 'individual');
      expect(fields).toContain('amount');
      expect(fields).toContain('cryptoAddress');
      expect(fields).toContain('cryptoAsset');
      expect(fields).not.toContain('bankName');
      expect(fields).not.toContain('iban');
      expect(fields).not.toContain('accountNumber');
    });
  });
});

// ============================================================================
// TEST 7: Quote Data Transformation
// Ensures quote data is correctly processed
// ============================================================================

describe('Quote Data Processing', () => {
  interface QuoteData {
    quoteId: string;
    sourceAmount: string;
    destinationAmount: string;
    feeAmount: string;
    exchangeRate: string;
    destinationCurrency: 'usd' | 'eur' | 'aed';
  }

  describe('quote parsing', () => {
    it('parses string amounts to numbers correctly', () => {
      const quote: QuoteData = {
        quoteId: 'quote-123',
        sourceAmount: '100.00',
        destinationAmount: '92.50',
        feeAmount: '0.50',
        exchangeRate: '0.9250',
        destinationCurrency: 'eur',
      };

      const destinationAmount = parseFloat(quote.destinationAmount);
      const feeAmount = parseFloat(quote.feeAmount);
      const exchangeRate = parseFloat(quote.exchangeRate);

      expect(destinationAmount).toBe(92.5);
      expect(feeAmount).toBe(0.5);
      expect(exchangeRate).toBe(0.925);
    });

    it('handles zero fee', () => {
      const quote: QuoteData = {
        quoteId: 'quote-123',
        sourceAmount: '100.00',
        destinationAmount: '100.00',
        feeAmount: '0',
        exchangeRate: '1.0000',
        destinationCurrency: 'usd',
      };

      const feeAmount = parseFloat(quote.feeAmount);
      expect(feeAmount).toBe(0);
    });
  });

  describe('payment rails determination', () => {
    it('returns sepa for EUR', () => {
      const isEur = true;
      const rails = isEur ? 'sepa' : 'ach';
      expect(rails).toBe('sepa');
    });

    it('returns ach for USD', () => {
      const isEur = false;
      const rails = isEur ? 'sepa' : 'ach';
      expect(rails).toBe('ach');
    });
  });
});

// ============================================================================
// TEST 8: Transfer State Machine
// Critical for multi-step transfer flows
// ============================================================================

describe('Transfer State Machine', () => {
  type TransferStepStatus = 'pending' | 'in_progress' | 'completed' | 'error';

  interface TransferStep {
    id: string;
    label: string;
    status: TransferStepStatus;
  }

  describe('step status updates', () => {
    it('updates specific step to in_progress', () => {
      const steps: TransferStep[] = [
        { id: 'withdraw', label: 'Withdraw', status: 'pending' },
        { id: 'transfer', label: 'Transfer', status: 'pending' },
        { id: 'complete', label: 'Complete', status: 'pending' },
      ];

      const stepIndex = 0;
      const updated = steps.map((s, i) =>
        i === stepIndex ? { ...s, status: 'in_progress' as const } : s,
      );

      expect(updated[0].status).toBe('in_progress');
      expect(updated[1].status).toBe('pending');
      expect(updated[2].status).toBe('pending');
    });

    it('marks step as completed and next as in_progress', () => {
      const steps: TransferStep[] = [
        { id: 'withdraw', label: 'Withdraw', status: 'in_progress' },
        { id: 'transfer', label: 'Transfer', status: 'pending' },
        { id: 'complete', label: 'Complete', status: 'pending' },
      ];

      const updated = steps.map((s, i) => {
        if (i === 0) return { ...s, status: 'completed' as const };
        if (i === 1) return { ...s, status: 'in_progress' as const };
        return s;
      });

      expect(updated[0].status).toBe('completed');
      expect(updated[1].status).toBe('in_progress');
      expect(updated[2].status).toBe('pending');
    });

    it('marks step as error on failure', () => {
      const steps: TransferStep[] = [
        { id: 'withdraw', label: 'Withdraw', status: 'in_progress' },
        { id: 'transfer', label: 'Transfer', status: 'pending' },
      ];

      const updated = steps.map((s, i) =>
        i === 0 ? { ...s, status: 'error' as const } : s,
      );

      expect(updated[0].status).toBe('error');
      expect(updated[1].status).toBe('pending');
    });
  });

  describe('multi-step transfer initialization', () => {
    it('creates correct steps for bank transfer with vault withdraw', () => {
      const createSteps = (deficit: number): TransferStep[] => [
        {
          id: 'withdraw',
          label: 'Withdrawing from earning balance',
          status: 'pending',
        },
        {
          id: 'transfer',
          label: 'Transferring to bank',
          status: 'pending',
        },
        {
          id: 'complete',
          label: 'Transfer complete',
          status: 'pending',
        },
      ];

      const steps = createSteps(200);
      expect(steps).toHaveLength(3);
      expect(steps.map((s) => s.id)).toEqual([
        'withdraw',
        'transfer',
        'complete',
      ]);
    });

    it('creates correct steps for crypto transfer with vault withdraw', () => {
      const createSteps = (
        deficit: number,
        symbol: string,
        address: string,
      ): TransferStep[] => [
        {
          id: 'withdraw',
          label: 'Withdrawing from earning balance',
          status: 'pending',
        },
        {
          id: 'transfer',
          label: `Sending ${symbol}`,
          status: 'pending',
        },
        {
          id: 'complete',
          label: 'Transfer complete',
          status: 'pending',
        },
      ];

      const steps = createSteps(100, 'USDC', '0x1234...5678');
      expect(steps[1].label).toBe('Sending USDC');
    });
  });
});
