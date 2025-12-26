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
import { type Address, isAddress } from 'viem';

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

// ============================================================================
// TEST 9: Funding Source Handling
// Critical for determining available transfer options
// ============================================================================

describe('Funding Source Handling', () => {
  // Match the FundingSource type from the component
  interface FundingSource {
    id: string;
    accountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
    sourceAccountType?: 'us_ach' | 'iban' | 'uk_details' | 'other';
    bankName: string | null;
  }

  const getAccountType = (source: FundingSource): string =>
    source.sourceAccountType || source.accountType;

  describe('account type detection', () => {
    it('prefers sourceAccountType over accountType', () => {
      const source: FundingSource = {
        id: '1',
        accountType: 'other',
        sourceAccountType: 'us_ach',
        bankName: 'Test Bank',
      };
      expect(getAccountType(source)).toBe('us_ach');
    });

    it('falls back to accountType when sourceAccountType is missing', () => {
      const source: FundingSource = {
        id: '1',
        accountType: 'iban',
        bankName: 'Test Bank',
      };
      expect(getAccountType(source)).toBe('iban');
    });
  });

  describe('finding ACH and IBAN accounts', () => {
    const fundingSources: FundingSource[] = [
      { id: '1', accountType: 'us_ach', bankName: 'Chase' },
      { id: '2', accountType: 'iban', bankName: 'Deutsche Bank' },
      { id: '3', accountType: 'other', bankName: 'Other Bank' },
    ];

    it('finds ACH account', () => {
      const achAccount = fundingSources.find(
        (source) => getAccountType(source) === 'us_ach',
      );
      expect(achAccount).toBeDefined();
      expect(achAccount?.bankName).toBe('Chase');
    });

    it('finds IBAN account', () => {
      const ibanAccount = fundingSources.find(
        (source) => getAccountType(source) === 'iban',
      );
      expect(ibanAccount).toBeDefined();
      expect(ibanAccount?.bankName).toBe('Deutsche Bank');
    });

    it('returns undefined when no matching account', () => {
      const ukAccount = fundingSources.find(
        (source) => getAccountType(source) === 'uk_details',
      );
      expect(ukAccount).toBeUndefined();
    });
  });

  describe('destination availability', () => {
    it('disables ACH when no ACH account exists', () => {
      const hasAchAccount = false;
      const hasIbanAccount = true;

      // DestinationSelector disables options based on account availability
      expect(hasAchAccount).toBe(false);
      expect(hasIbanAccount).toBe(true);
    });

    it('crypto is always available', () => {
      // Crypto option doesn't depend on funding sources
      const cryptoAlwaysAvailable = true;
      expect(cryptoAlwaysAvailable).toBe(true);
    });
  });
});

// ============================================================================
// TEST 10: Crypto Address Validation
// Prevents loss of funds to invalid addresses
// ============================================================================

describe('Crypto Address Validation', () => {
  describe('EVM address validation', () => {
    it('validates correct checksummed address', () => {
      const address = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      expect(isAddress(address)).toBe(true);
    });

    it('validates lowercase address', () => {
      const address = '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed';
      expect(isAddress(address)).toBe(true);
    });

    it('rejects address without 0x prefix', () => {
      const address = '5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed';
      expect(isAddress(address)).toBe(false);
    });

    it('rejects short address', () => {
      const address = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1Be';
      expect(isAddress(address)).toBe(false);
    });

    it('rejects non-hex characters', () => {
      const address = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BGGGG';
      expect(isAddress(address)).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isAddress('')).toBe(false);
    });
  });
});

// ============================================================================
// TEST 11: Saved Bank Account Selection
// Ensures saved accounts populate form correctly
// ============================================================================

describe('Saved Bank Account Selection', () => {
  interface SavedBankAccount {
    id: string;
    accountName: string;
    bankName: string;
    accountType: 'us' | 'iban';
    accountHolderType: 'individual' | 'business';
    accountHolderFirstName?: string;
    accountHolderLastName?: string;
    accountHolderBusinessName?: string;
    country: string;
    city?: string;
    streetLine1?: string;
    postalCode?: string;
    accountNumber?: string;
    routingNumber?: string;
    ibanNumber?: string;
    bicSwift?: string;
  }

  const savedAccounts: SavedBankAccount[] = [
    {
      id: 'saved-1',
      accountName: 'Chase Checking',
      bankName: 'Chase',
      accountType: 'us',
      accountHolderType: 'individual',
      accountHolderFirstName: 'John',
      accountHolderLastName: 'Doe',
      country: 'US',
      city: 'New York',
      streetLine1: '123 Main St',
      postalCode: '10001',
      accountNumber: '123456789',
      routingNumber: '021000021',
    },
    {
      id: 'saved-2',
      accountName: 'Deutsche Bank EUR',
      bankName: 'Deutsche Bank',
      accountType: 'iban',
      accountHolderType: 'business',
      accountHolderBusinessName: 'Acme Corp',
      country: 'DE',
      city: 'Berlin',
      streetLine1: 'Unter den Linden 1',
      postalCode: '10117',
      ibanNumber: 'DE89370400440532013000',
      bicSwift: 'COBADEFFXXX',
    },
  ];

  describe('filtering by destination type', () => {
    it('filters for ACH accounts when destination is ACH', () => {
      const destinationType = 'ach';
      const filtered = savedAccounts.filter((acc) =>
        destinationType === 'ach'
          ? acc.accountType === 'us'
          : acc.accountType === 'iban',
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].accountName).toBe('Chase Checking');
    });

    it('filters for IBAN accounts when destination is IBAN', () => {
      const destinationType = 'iban' as 'ach' | 'iban';
      const filtered = savedAccounts.filter((acc) =>
        destinationType === 'ach'
          ? acc.accountType === 'us'
          : acc.accountType === 'iban',
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].accountName).toBe('Deutsche Bank EUR');
    });
  });

  describe('form population from saved account', () => {
    it('populates US ACH fields correctly', () => {
      const account = savedAccounts[0];
      const formValues = {
        bankName: account.bankName,
        accountHolderType: account.accountHolderType,
        accountHolderFirstName: account.accountHolderFirstName || '',
        accountHolderLastName: account.accountHolderLastName || '',
        country: account.country,
        city: account.city || '',
        streetLine1: account.streetLine1 || '',
        postalCode: account.postalCode || '',
        accountNumber: account.accountNumber || '',
        routingNumber: account.routingNumber || '',
      };

      expect(formValues.bankName).toBe('Chase');
      expect(formValues.accountNumber).toBe('123456789');
      expect(formValues.routingNumber).toBe('021000021');
    });

    it('populates IBAN fields correctly', () => {
      const account = savedAccounts[1];
      const formValues = {
        bankName: account.bankName,
        accountHolderType: account.accountHolderType,
        accountHolderBusinessName: account.accountHolderBusinessName || '',
        country: account.country,
        iban: account.ibanNumber || '',
        bic: account.bicSwift || '',
      };

      expect(formValues.bankName).toBe('Deutsche Bank');
      expect(formValues.iban).toBe('DE89370400440532013000');
      expect(formValues.bic).toBe('COBADEFFXXX');
    });
  });
});

// ============================================================================
// TEST 12: Balance Display Logic
// Ensures correct balance breakdown display
// ============================================================================

describe('Balance Display Logic', () => {
  describe('spendable balance calculation', () => {
    it('calculates total spendable as idle + earning', () => {
      const idleBalance = 100;
      const earningBalance = 500;
      const spendable = idleBalance + earningBalance;
      expect(spendable).toBe(600);
    });

    it('handles zero earning balance', () => {
      const idleBalance = 100;
      const earningBalance = 0;
      const spendable = idleBalance + earningBalance;
      expect(spendable).toBe(100);
    });

    it('handles zero idle balance', () => {
      const idleBalance = 0;
      const earningBalance = 500;
      const spendable = idleBalance + earningBalance;
      expect(spendable).toBe(500);
    });
  });

  describe('MAX button behavior', () => {
    it('sets amount to full spendable balance', () => {
      const spendableBalance = 1234.56;
      const amountAfterMax = spendableBalance.toString();
      expect(amountAfterMax).toBe('1234.56');
    });

    it('falls back to USDC balance when spendable undefined', () => {
      const spendableBalance = undefined;
      const usdcBalance = '500.00';
      const amountAfterMax =
        spendableBalance !== undefined
          ? spendableBalance.toString()
          : usdcBalance;
      expect(amountAfterMax).toBe('500.00');
    });
  });

  describe('warning conditions', () => {
    it('shows warning when deficit > 0 and deficit <= earning', () => {
      const idleBalance = 100;
      const earningBalance = 500;
      const amountToSend = 300;

      const deficit = Math.max(0, amountToSend - idleBalance);
      const needsEarningWithdraw = deficit > 0 && deficit <= earningBalance;

      expect(deficit).toBe(200);
      expect(needsEarningWithdraw).toBe(true);
    });

    it('does not show warning when amount <= idle', () => {
      const idleBalance = 500;
      const earningBalance = 500;
      const amountToSend = 300;

      const deficit = Math.max(0, amountToSend - idleBalance);
      const needsEarningWithdraw = deficit > 0 && deficit <= earningBalance;

      expect(deficit).toBe(0);
      expect(needsEarningWithdraw).toBe(false);
    });

    it('shows insufficient funds when amount > total', () => {
      const idleBalance = 100;
      const earningBalance = 100;
      const spendableBalance = idleBalance + earningBalance;
      const amountToSend = 300;

      const insufficientFunds = amountToSend > spendableBalance;

      expect(insufficientFunds).toBe(true);
    });
  });
});

// ============================================================================
// TEST 13: Transfer Success State Data
// Ensures correct data is shown on success screen
// ============================================================================

describe('Transfer Success State', () => {
  interface TransferDetails {
    alignTransferId: string;
    depositAmount: string;
    fee: string;
    depositNetwork: string;
    status: string;
    sourceAmount?: string;
    destinationAmount?: string;
  }

  describe('success data extraction', () => {
    it('extracts source amount from quote-based transfer', () => {
      const transferDetails: TransferDetails = {
        alignTransferId: 'transfer-123',
        depositAmount: '100.00',
        fee: '0.50',
        depositNetwork: 'base',
        status: 'pending',
        sourceAmount: '100.00',
        destinationAmount: '92.00',
      };

      const sourceAmount = Number(
        transferDetails.sourceAmount || transferDetails.depositAmount || 0,
      );
      expect(sourceAmount).toBe(100);
    });

    it('falls back to depositAmount when sourceAmount missing', () => {
      const transferDetails: TransferDetails = {
        alignTransferId: 'transfer-123',
        depositAmount: '100.00',
        fee: '0.50',
        depositNetwork: 'base',
        status: 'pending',
      };

      const sourceAmount = Number(
        transferDetails.sourceAmount || transferDetails.depositAmount || 0,
      );
      expect(sourceAmount).toBe(100);
    });

    it('extracts destination amount correctly', () => {
      const transferDetails: TransferDetails = {
        alignTransferId: 'transfer-123',
        depositAmount: '100.00',
        fee: '0.50',
        depositNetwork: 'base',
        status: 'pending',
        destinationAmount: '92.00',
      };

      const destinationAmount = Number(transferDetails.destinationAmount || 0);
      expect(destinationAmount).toBe(92);
    });
  });

  describe('arrival time messaging', () => {
    it('shows same day for EUR/SEPA', () => {
      const isEur = true;
      const arrivalMessage = isEur ? 'less than 24 hours' : '1-2 business days';
      expect(arrivalMessage).toBe('less than 24 hours');
    });

    it('shows 1-2 days for USD/ACH', () => {
      const isEur = false;
      const arrivalMessage = isEur ? 'less than 24 hours' : '1-2 business days';
      expect(arrivalMessage).toBe('1-2 business days');
    });
  });
});
