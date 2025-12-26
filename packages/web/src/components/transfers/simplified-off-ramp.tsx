'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  Check,
  ArrowLeft,
  Receipt,
  Euro,
  AlertCircle,
  Coins,
  ArrowDown,
  Sparkles,
  Shield,
  Clock,
  TrendingDown,
  ExternalLink,
  CircleDollarSign,
  BookmarkPlus,
  CreditCard,
  Plus,
} from 'lucide-react';
import {
  formatUnits,
  Address,
  createPublicClient,
  http,
  encodeFunctionData,
  parseUnits,
  isAddress,
} from 'viem';
import { erc20Abi } from 'viem';
import { base } from 'viem/chains';
import { toast } from 'sonner';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe from '@safe-global/protocol-kit';
import { type Hex } from 'viem';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn, formatUsd } from '@/lib/utils';
import { SAFE_ABI } from '@/lib/sponsor-tx/core';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import {
  USDC_ADDRESS,
  WETH_ADDRESS,
  WETH_DECIMALS,
  USDC_DECIMALS,
} from '@/lib/constants';
import { Combobox, type ComboboxOption } from '@/components/ui/combo-box';
import { useBimodal, BlueprintGrid, Crosshairs } from '@/components/ui/bimodal';
import { Checkbox } from '@/components/ui/checkbox';
import { type VaultPosition } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard-summary-wrapper';

// ============================================================================
// CONSTANTS & TYPES
// ============================================================================

type CryptoAsset = 'usdc' | 'weth' | 'eth';

interface CryptoAssetConfig {
  symbol: string;
  name: string;
  address: Address | null;
  decimals: number;
  icon: string;
  isNative: boolean;
}

const CRYPTO_ASSETS: Record<CryptoAsset, CryptoAssetConfig> = {
  usdc: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: USDC_ADDRESS as Address,
    decimals: USDC_DECIMALS,
    icon: '💵',
    isNative: false,
  },
  weth: {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: WETH_ADDRESS as Address,
    decimals: WETH_DECIMALS,
    icon: '⟠',
    isNative: false,
  },
  eth: {
    symbol: 'ETH',
    name: 'Ether',
    address: null,
    decimals: 18,
    icon: '⟠',
    isNative: true,
  },
};

// Approximate exchange rates (would be fetched from API in production)
const APPROX_RATES = {
  USDC_TO_EUR: 0.92,
  USDC_TO_USD: 1.0,
  FEE_PERCENTAGE: 0.005, // 0.5%
};

interface CreateOfframpTransferInput {
  type: 'manual';
  amount: string;
  sourceToken: 'usdc' | 'usdt' | 'eurc';
  sourceNetwork:
    | 'polygon'
    | 'ethereum'
    | 'base'
    | 'tron'
    | 'solana'
    | 'avalanche';
  destinationCurrency:
    | 'usd'
    | 'eur'
    | 'mxn'
    | 'ars'
    | 'brl'
    | 'cny'
    | 'hkd'
    | 'sgd';
  destinationPaymentRails: 'ach' | 'wire' | 'sepa' | 'swift' | 'instant_sepa';
  destinationSelection: string;
  bankName?: string;
  accountHolderType?: 'individual' | 'business';
  accountHolderFirstName?: string;
  accountHolderLastName?: string;
  accountHolderBusinessName?: string;
  country?: string;
  city?: string;
  streetLine1?: string;
  streetLine2?: string;
  postalCode?: string;
  accountType?: 'us' | 'iban';
  accountNumber?: string;
  routingNumber?: string;
  ibanNumber?: string;
  bicSwift?: string;
}

interface AlignTransferCreatedResponse {
  alignTransferId: string;
  depositAmount: string;
  fee: string;
  depositNetwork: string;
  status: string;
  // Added for quote-based flow
  sourceAmount?: string;
  destinationAmount?: string;
}

interface OffRampFormValues {
  amount: string;
  destinationType: 'ach' | 'iban' | 'crypto';
  accountHolderType: 'individual' | 'business';
  accountHolderFirstName?: string;
  accountHolderLastName?: string;
  accountHolderBusinessName?: string;
  bankName: string;
  country: string;
  city: string;
  streetLine1: string;
  streetLine2?: string;
  postalCode: string;
  accountNumber?: string;
  routingNumber?: string;
  iban?: string;
  bic?: string;
  cryptoAddress?: string;
  cryptoAsset?: CryptoAsset;
  // Saved bank account
  savedBankAccountId?: string;
  saveForFuture?: boolean;
  accountNickname?: string;
}

type FundingSource = {
  id: string;
  accountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
  sourceAccountType?: 'us_ach' | 'iban' | 'uk_details' | 'other';
  currency: string | null;
  bankName: string | null;
  sourceBankName?: string | null;
  beneficiaryName: string | null;
  sourceBankBeneficiaryName?: string | null;
  accountHolder: string | null;
  accountNumber: string | null;
  sourceAccountNumber?: string | null;
  routingNumber: string | null;
  sourceRoutingNumber?: string | null;
  iban: string | null;
  sourceIban?: string | null;
  bic: string | null;
  sourceBicSwift?: string | null;
  sourceBankAddress?: string | null;
};

type SimplifiedOffRampMode = 'demo' | 'real';

interface SimplifiedOffRampProps {
  fundingSources: FundingSource[] | UserFundingSourceDisplayData[];
  defaultValues?: Partial<OffRampFormValues>;
  prefillFromInvoice?: {
    amount?: string;
    currency?: string;
    vendorName?: string | null;
    description?: string | null;
  };
  mode?: SimplifiedOffRampMode;
  // Balance props for auto-withdraw from earning
  idleBalance?: number; // USDC in Safe, ready to spend
  earningBalance?: number; // USDC in vaults, earning yield
  spendableBalance?: number; // Total (idle + earning)
  vaultPositions?: VaultPosition[]; // For vault withdrawal execution
}

type SimplifiedOffRampInnerProps = Omit<SimplifiedOffRampProps, 'mode'>;

// Country list
const COUNTRIES: ComboboxOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'JP', label: 'Japan' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'BR', label: 'Brazil' },
  { value: 'MX', label: 'Mexico' },
].sort((a, b) => a.label.localeCompare(b.label));

const erc20AbiBalanceOf = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

const USDC_BASE_ADDRESS = USDC_ADDRESS as Address;

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Clean conversion arrow (no animations per design language)
const ConversionArrow = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center justify-center py-2', className)}>
    <div className="flex flex-col items-center">
      <div className="w-px h-3 bg-[#101010]/10" />
      <div className="bg-white border border-[#101010]/10 rounded-full p-1.5">
        <ArrowDown className="h-4 w-4 text-[#101010]/40" />
      </div>
      <div className="w-px h-3 bg-[#101010]/10" />
    </div>
  </div>
);

// Currency pill - clean, minimal per design language
const CurrencyPill = ({
  currency,
  variant = 'default',
}: {
  currency: 'USDC' | 'EUR' | 'USD';
  variant?: 'default' | 'highlight';
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium uppercase tracking-wider',
        variant === 'highlight'
          ? 'bg-[#1B29FF]/10 text-[#1B29FF]'
          : 'bg-[#101010]/5 text-[#101010]/60',
      )}
    >
      {currency}
    </span>
  );
};

// Success checkmark - clean, no excessive animation
const SuccessAnimation = () => (
  <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
    <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
  </div>
);

// Progress stepper - minimal design
const ProgressStepper = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-1.5 rounded-full transition-all',
          i <= currentStep ? 'bg-[#1B29FF] w-6' : 'bg-[#101010]/10 w-4',
        )}
      />
    ))}
  </div>
);

// Transfer step states for multi-step transfers
type TransferStepStatus = 'pending' | 'in_progress' | 'completed' | 'error';

interface TransferStep {
  id: string;
  label: string;
  status: TransferStepStatus;
  subtitle?: string;
}

// Multi-step transfer progress component
const TransferProgress = ({
  steps,
  currentStepIndex,
  error,
}: {
  steps: TransferStep[];
  currentStepIndex: number;
  error?: string;
}) => (
  <div className="space-y-3 py-4">
    {steps.map((step, index) => {
      const isActive = index === currentStepIndex;
      const isCompleted = step.status === 'completed';
      const isError = step.status === 'error';

      return (
        <div
          key={step.id}
          className={cn(
            'flex items-start gap-3 p-3 rounded-lg transition-all',
            isActive && 'bg-[#1B29FF]/5',
            isError && 'bg-red-50',
          )}
        >
          {/* Step indicator */}
          <div className="flex-shrink-0 mt-0.5">
            {isCompleted ? (
              <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            ) : isError ? (
              <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <AlertCircle className="h-3 w-3 text-white" />
              </div>
            ) : isActive ? (
              <div className="w-5 h-5 rounded-full bg-[#1B29FF] flex items-center justify-center">
                <Loader2 className="h-3 w-3 text-white animate-spin" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-[#101010]/20" />
            )}
          </div>

          {/* Step content */}
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                'text-[13px] font-medium',
                isCompleted && 'text-[#10B981]',
                isError && 'text-red-600',
                isActive && 'text-[#1B29FF]',
                !isCompleted && !isError && !isActive && 'text-[#101010]/50',
              )}
            >
              {step.label}
            </p>
            {step.subtitle && (
              <p className="text-[11px] text-[#101010]/50 mt-0.5">
                {step.subtitle}
              </p>
            )}
          </div>
        </div>
      );
    })}

    {error && (
      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-[12px] text-red-700">{error}</p>
      </div>
    )}
  </div>
);

// ============================================================================
// VAULT WITHDRAWAL UTILITIES
// ============================================================================

// ERC4626 Vault ABI for withdrawal
const VAULT_ABI = [
  {
    inputs: [
      { name: 'shares', type: 'uint256' },
      { name: 'receiver', type: 'address' },
      { name: 'owner', type: 'address' },
    ],
    name: 'redeem',
    outputs: [{ name: 'assets', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'assets', type: 'uint256' }],
    name: 'convertToShares',
    outputs: [{ name: 'shares', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

interface VaultWithdrawalTransaction {
  to: Address;
  value: string;
  data: `0x${string}`;
}

/**
 * Build vault withdrawal transactions for a given USDC amount.
 * Sorts vaults by APY (lowest first) to preserve highest-earning positions.
 * Returns an array of redeem transactions to be batched.
 */
async function buildVaultWithdrawalTransactions({
  amountUsdc,
  vaultPositions,
  safeAddress,
  publicClient,
}: {
  amountUsdc: number;
  vaultPositions: VaultPosition[];
  safeAddress: Address;
  publicClient: any; // Using any to avoid viem version type conflicts
}): Promise<{
  transactions: VaultWithdrawalTransaction[];
  totalWithdrawn: number;
}> {
  const transactions: VaultWithdrawalTransaction[] = [];
  let remainingAmount = amountUsdc;
  let totalWithdrawn = 0;

  // Sort by APY ascending (lowest first) to preserve highest-earning positions
  const sortedVaults = [...vaultPositions].sort(
    (a, b) => (a.apy || 0) - (b.apy || 0),
  );

  for (const vault of sortedVaults) {
    if (remainingAmount <= 0) break;

    const vaultAssets = vault.assetsUsd;
    if (vaultAssets <= 0) continue;

    // Calculate how much to withdraw from this vault
    const withdrawAmount = Math.min(remainingAmount, vaultAssets);

    // Convert USDC amount to shares (need to query the vault)
    const amountInSmallestUnit = parseUnits(withdrawAmount.toFixed(6), 6); // USDC has 6 decimals

    try {
      const sharesToRedeem = await publicClient.readContract({
        address: vault.vaultAddress as Address,
        abi: VAULT_ABI,
        functionName: 'convertToShares',
        args: [amountInSmallestUnit],
      });

      // Build redeem transaction
      const redeemData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesToRedeem, safeAddress, safeAddress],
      });

      transactions.push({
        to: vault.vaultAddress as Address,
        value: '0',
        data: redeemData,
      });

      totalWithdrawn += withdrawAmount;
      remainingAmount -= withdrawAmount;
    } catch (error) {
      console.error(
        `Failed to build withdrawal for vault ${vault.vaultAddress}:`,
        error,
      );
      // Continue to next vault
    }
  }

  return { transactions, totalWithdrawn };
}

// ============================================================================
// QUOTE PREVIEW COMPONENT
// ============================================================================

// Quote data type
interface QuoteData {
  quoteId: string;
  sourceAmount: string;
  destinationAmount: string;
  feeAmount: string;
  exchangeRate: string;
  destinationCurrency: 'usd' | 'eur' | 'aed';
  destinationPaymentRails: string;
}

interface QuotePreviewProps {
  amountUsdc: number; // User enters USDC amount to send
  destinationType: 'ach' | 'iban' | 'crypto';
  onQuoteChange?: (quote: QuoteData | null) => void; // Callback when quote changes
}

const QuotePreview = ({
  amountUsdc,
  destinationType,
  onQuoteChange,
}: QuotePreviewProps) => {
  const [debouncedAmount, setDebouncedAmount] = useState<number>(0);

  const isEur = destinationType === 'iban';
  const currencySymbol = isEur ? '€' : '$';
  const currencyCode = isEur ? 'EUR' : 'USD';

  // Debounce the amount to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amountUsdc);
    }, 500);
    return () => clearTimeout(timer);
  }, [amountUsdc]);

  // Fetch real quote from Align API
  const {
    mutate: fetchQuote,
    data: quote,
    isPending: isLoading,
    error,
  } = api.align.getOfframpQuote.useMutation();

  // Notify parent when quote changes
  useEffect(() => {
    if (quote && onQuoteChange) {
      onQuoteChange({
        quoteId: quote.quoteId,
        sourceAmount: quote.sourceAmount,
        destinationAmount: quote.destinationAmount,
        feeAmount: quote.feeAmount,
        exchangeRate: quote.exchangeRate,
        destinationCurrency: quote.destinationCurrency as 'usd' | 'eur' | 'aed',
        destinationPaymentRails: isEur ? 'sepa' : 'ach',
      });
    } else if (!quote && onQuoteChange) {
      onQuoteChange(null);
    }
  }, [quote, onQuoteChange, isEur]);

  // Fetch quote when debounced amount changes - query by SOURCE amount (USDC)
  useEffect(() => {
    if (debouncedAmount > 0) {
      fetchQuote({
        sourceAmount: debouncedAmount.toString(),
        destinationCurrency: isEur ? 'eur' : 'usd',
        destinationPaymentRails: isEur ? 'sepa' : 'ach',
        sourceToken: 'usdc',
        sourceNetwork: 'base',
      });
    }
  }, [debouncedAmount, isEur, fetchQuote]);

  if (amountUsdc <= 0) {
    return null;
  }

  // Parse quote data
  const destinationAmount = quote ? parseFloat(quote.destinationAmount) : 0;
  const feeAmount = quote ? parseFloat(quote.feeAmount) : 0;
  const exchangeRate = quote ? parseFloat(quote.exchangeRate) : 0;

  return (
    <div className="bg-white border border-[#101010]/10 rounded-md p-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            {quote ? 'Quote' : 'Getting quote...'}
          </p>
          {quote && (
            <p className="text-[11px] text-[#101010]/40">Expires in 60s</p>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-[12px] text-[#EF4444] bg-[#EF4444]/5 border border-[#EF4444]/20 p-3 rounded-md">
            Failed to get quote. Please try again.
          </div>
        )}

        {/* Conversion visualization */}
        <div className="space-y-2">
          {/* You send */}
          <div className="flex items-center justify-between p-3 bg-[#F7F7F2] rounded-md">
            <div>
              <p className="text-[11px] text-[#101010]/60 uppercase tracking-wider mb-1">
                You send
              </p>
              <p className="text-[24px] font-semibold tabular-nums text-[#101010]">
                {amountUsdc.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <CurrencyPill currency="USDC" variant="highlight" />
          </div>

          <ConversionArrow />

          {/* Bank receives */}
          <div className="flex items-center justify-between p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-md">
            <div>
              <p className="text-[11px] text-[#10B981]/70 uppercase tracking-wider mb-1">
                Bank receives
              </p>
              <p className="text-[24px] font-semibold tabular-nums text-[#10B981]">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin inline" />
                ) : quote ? (
                  `${currencySymbol}${destinationAmount.toLocaleString(
                    'en-US',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}`
                ) : (
                  '—'
                )}
              </p>
            </div>
            <CurrencyPill currency={currencyCode as 'EUR' | 'USD'} />
          </div>
        </div>

        {/* Fee breakdown */}
        {quote && (
          <div className="pt-3 border-t border-[#101010]/10 space-y-1.5">
            {feeAmount > 0 && (
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#101010]/60">Fee</span>
                <span className="tabular-nums text-[#101010]">
                  {feeAmount.toFixed(2)} USDC
                </span>
              </div>
            )}
            {exchangeRate > 0 && (
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-[#101010]/60">Rate</span>
                <span className="tabular-nums text-[#101010]">
                  1 USDC = {currencySymbol}
                  {exchangeRate.toFixed(4)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#101010]/60">Arrival</span>
              <span className="text-[#101010]">
                {isEur ? 'Same day' : '1-2 business days'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// UNIFIED AMOUNT + QUOTE COMPONENT (Wise-style currency converter)
// ============================================================================

interface UnifiedAmountQuoteProps {
  amountValue: string;
  onAmountChange: (value: string) => void;
  destinationType: 'ach' | 'iban' | 'crypto';
  onQuoteChange?: (quote: QuoteData | null) => void;
  usdcBalance: string | null | undefined;
  isLoadingBalance: boolean;
  // Balance props for auto-withdraw from earning
  idleBalance?: number;
  earningBalance?: number;
  spendableBalance?: number;
  error?: string;
}

const UnifiedAmountQuote = ({
  amountValue,
  onAmountChange,
  destinationType,
  onQuoteChange,
  usdcBalance,
  isLoadingBalance,
  idleBalance,
  earningBalance,
  spendableBalance,
  error: formError,
}: UnifiedAmountQuoteProps) => {
  const [debouncedAmount, setDebouncedAmount] = useState<number>(0);
  const amountNum = parseFloat(amountValue || '0');

  const isEur = destinationType === 'iban';
  const currencySymbol = isEur ? '€' : '$';
  const currencyCode = isEur ? 'EUR' : 'USD';

  // Debounce the amount to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAmount(amountNum);
    }, 500);
    return () => clearTimeout(timer);
  }, [amountNum]);

  // Fetch real quote from Align API
  const {
    mutate: fetchQuote,
    data: quote,
    isPending: isLoading,
    error: quoteError,
  } = api.align.getOfframpQuote.useMutation();

  // Notify parent when quote changes
  useEffect(() => {
    if (quote && onQuoteChange) {
      onQuoteChange({
        quoteId: quote.quoteId,
        sourceAmount: quote.sourceAmount,
        destinationAmount: quote.destinationAmount,
        feeAmount: quote.feeAmount,
        exchangeRate: quote.exchangeRate,
        destinationCurrency: quote.destinationCurrency as 'usd' | 'eur' | 'aed',
        destinationPaymentRails: isEur ? 'sepa' : 'ach',
      });
    } else if (!quote && onQuoteChange) {
      onQuoteChange(null);
    }
  }, [quote, onQuoteChange, isEur]);

  // Fetch quote when debounced amount changes
  useEffect(() => {
    if (debouncedAmount > 0) {
      fetchQuote({
        sourceAmount: debouncedAmount.toString(),
        destinationCurrency: isEur ? 'eur' : 'usd',
        destinationPaymentRails: isEur ? 'sepa' : 'ach',
        sourceToken: 'usdc',
        sourceNetwork: 'base',
      });
    }
  }, [debouncedAmount, isEur, fetchQuote]);

  // Parse quote data
  const destinationAmount = quote ? parseFloat(quote.destinationAmount) : 0;
  const feeAmount = quote ? parseFloat(quote.feeAmount) : 0;
  const exchangeRate = quote ? parseFloat(quote.exchangeRate) : 0;

  // Calculate deficit for auto-withdraw from earning
  const idle = idleBalance || 0;
  const earning = earningBalance || 0;
  const total = spendableBalance || idle + earning;
  const deficit = Math.max(0, amountNum - idle);
  const needsEarningWithdraw = deficit > 0 && deficit <= earning;
  const insufficientFunds = amountNum > total;

  const handleMaxClick = () => {
    // Use spendable (total) as max
    const balance =
      spendableBalance !== undefined
        ? spendableBalance.toString()
        : usdcBalance;
    if (balance) {
      onAmountChange(balance.toString());
    }
  };

  return (
    <div className="bg-white border border-[#101010]/10 rounded-xl overflow-hidden">
      {/* You Send Section */}
      <div className="px-4 py-3 bg-[#F7F7F2]">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-[#101010]/50 uppercase tracking-wider">
            You send
          </p>
          <CurrencyPill currency="USDC" variant="highlight" />
        </div>
        <div className="relative">
          <Input
            type="text"
            inputMode="decimal"
            value={amountValue}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            className="text-[24px] font-semibold tabular-nums h-10 border-0 bg-transparent p-0 focus-visible:ring-0 pr-16"
          />
          {!isLoadingBalance &&
            (spendableBalance !== undefined || usdcBalance) && (
              <button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-medium text-[#1B29FF] bg-[#1B29FF]/10 rounded-md hover:bg-[#1B29FF]/20 transition-colors"
              >
                MAX
              </button>
            )}
        </div>
        <div className="mt-2 flex justify-between text-[11px]">
          <span className="text-[#101010]/50">Spendable</span>
          <span className="font-medium tabular-nums text-[#101010]/70">
            {isLoadingBalance ? (
              <Loader2 className="h-3 w-3 animate-spin inline" />
            ) : spendableBalance !== undefined ? (
              `${spendableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC`
            ) : usdcBalance ? (
              `${parseFloat(usdcBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC`
            ) : (
              '—'
            )}
          </span>
        </div>
        {/* Show breakdown: earning + idle */}
        {spendableBalance !== undefined &&
          earningBalance !== undefined &&
          idleBalance !== undefined && (
            <div className="mt-1 text-[10px] text-[#101010]/40">
              {earningBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}{' '}
              earning ·{' '}
              {idleBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}{' '}
              idle
            </div>
          )}
        {/* Warning: will use earning balance */}
        {needsEarningWithdraw && !insufficientFunds && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
            <TrendingDown className="h-4 w-4 flex-shrink-0" />
            <span>
              This will use{' '}
              <span className="font-medium">
                {deficit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                USDC
              </span>{' '}
              from your earning balance
            </span>
          </div>
        )}
        {/* Error: insufficient funds */}
        {insufficientFunds && amountNum > 0 && (
          <div className="mt-3 flex items-center gap-2 text-[12px] text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              Insufficient balance. You need{' '}
              <span className="font-medium">
                {(amountNum - total).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                USDC
              </span>{' '}
              more.
            </span>
          </div>
        )}
        {formError && (
          <p className="text-[11px] text-red-500 mt-1.5">{formError}</p>
        )}
      </div>

      {/* Conversion Arrow Divider */}
      <div className="relative h-0">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-8 h-8 rounded-full bg-white border border-[#101010]/10 flex items-center justify-center shadow-sm">
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#101010]/40" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-[#101010]/50" />
            )}
          </div>
        </div>
      </div>

      {/* Bank Receives Section */}
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-[#10B981]/70 uppercase tracking-wider">
            Bank receives
          </p>
          <CurrencyPill currency={currencyCode as 'EUR' | 'USD'} />
        </div>
        <div className="h-10 flex items-center">
          {amountNum <= 0 ? (
            <span className="text-[20px] font-semibold tabular-nums text-[#101010]/25">
              {currencySymbol}0.00
            </span>
          ) : isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#101010]/40" />
              <span className="text-[13px] text-[#101010]/40">
                Calculating...
              </span>
            </div>
          ) : quote ? (
            <span className="text-[20px] font-semibold tabular-nums text-[#10B981]">
              {currencySymbol}
              {destinationAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          ) : quoteError ? (
            <span className="text-[13px] text-red-500">
              Failed to get quote
            </span>
          ) : (
            <span className="text-[20px] font-semibold tabular-nums text-[#101010]/25">
              {currencySymbol}—
            </span>
          )}
        </div>
      </div>

      {/* Fee breakdown footer */}
      {amountNum > 0 && (
        <div className="px-4 py-2.5 bg-[#F7F7F2]/50 border-t border-[#101010]/5">
          <div className="flex items-center justify-between text-[11px]">
            {quote ? (
              <>
                <div className="flex items-center gap-3">
                  {feeAmount > 0 && (
                    <span className="text-[#101010]/50">
                      Fee:{' '}
                      <span className="text-[#101010]/70 tabular-nums">
                        {feeAmount.toFixed(2)} USDC
                      </span>
                    </span>
                  )}
                  {exchangeRate > 0 && (
                    <span className="text-[#101010]/50">
                      Rate:{' '}
                      <span className="text-[#101010]/70 tabular-nums">
                        1 USDC = {currencySymbol}
                        {exchangeRate.toFixed(4)}
                      </span>
                    </span>
                  )}
                </div>
                <span className="text-[#101010]/50">
                  {isEur ? 'Same day' : '1-2 days'}
                </span>
              </>
            ) : isLoading ? (
              <span className="text-[#101010]/40">Getting best rate...</span>
            ) : (
              <span className="text-[#101010]/40">Enter amount for quote</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DESTINATION SELECTOR
// ============================================================================

interface DestinationOption {
  id: 'ach' | 'iban' | 'crypto';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge: string;
  timing: string;
  currency: 'USD' | 'EUR' | 'CRYPTO';
  disabled?: boolean;
  isTechnical?: boolean;
}

const DestinationSelector = ({
  value,
  onChange,
  hasAchAccount,
  hasIbanAccount,
  isTechnical,
}: {
  value: 'ach' | 'iban' | 'crypto';
  onChange: (value: 'ach' | 'iban' | 'crypto') => void;
  hasAchAccount: boolean;
  hasIbanAccount: boolean;
  isTechnical: boolean;
}) => {
  const options: DestinationOption[] = [
    {
      id: 'ach',
      title: 'US Bank',
      subtitle: 'Receive dollars via ACH transfer',
      icon: (
        <div className="w-10 h-10 bg-[#101010]/5 rounded-md flex items-center justify-center">
          <CircleDollarSign className="h-5 w-5 text-[#101010]/70" />
        </div>
      ),
      badge: 'ACH',
      timing: '1-2 days',
      currency: 'USD',
      disabled: !hasAchAccount,
    },
    {
      id: 'iban',
      title: 'EU Bank',
      subtitle: 'Receive euros via SEPA transfer',
      icon: (
        <div className="w-10 h-10 bg-[#101010]/5 rounded-md flex items-center justify-center">
          <Euro className="h-5 w-5 text-[#101010]/70" />
        </div>
      ),
      badge: 'SEPA',
      timing: 'Same day',
      currency: 'EUR',
      disabled: !hasIbanAccount,
    },
  ];

  // Crypto wallet option - always available regardless of mode
  options.push({
    id: 'crypto',
    title: 'Crypto Wallet',
    subtitle: 'Send to any EVM address',
    icon: (
      <div className="w-10 h-10 bg-[#1B29FF]/10 rounded-md flex items-center justify-center">
        <Coins className="h-5 w-5 text-[#1B29FF]" />
      </div>
    ),
    badge: 'INSTANT',
    timing: '~30 seconds',
    currency: 'CRYPTO',
  });

  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => !option.disabled && onChange(option.id)}
          disabled={option.disabled}
          className={cn(
            'relative flex items-center gap-4 p-4 rounded-md border transition-colors text-left',
            value === option.id
              ? 'border-[#1B29FF] bg-[#1B29FF]/5'
              : 'border-[#101010]/10 bg-white hover:border-[#101010]/20',
            option.disabled && 'opacity-40 cursor-not-allowed',
          )}
        >
          {option.icon}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[14px] text-[#101010]">
                {option.title}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#101010]/5 text-[#101010]/60">
                {option.badge}
              </span>
            </div>
            <p className="text-[12px] text-[#101010]/60 mt-0.5">
              {option.subtitle}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-[#101010]/50 block">
              {option.timing}
            </span>
          </div>

          {value === option.id && (
            <div className="absolute top-3 right-3">
              <div className="w-4 h-4 bg-[#1B29FF] rounded-full flex items-center justify-center">
                <Check className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function buildPrevalidatedSig(owner: Address): Hex {
  return `0x000000000000000000000000${owner.slice(
    2,
  )}000000000000000000000000000000000000000000000000000000000000000001` as Hex;
}

// ============================================================================
// DEMO MODE COMPONENT
// ============================================================================

function SimplifiedOffRampDemo({
  fundingSources,
  defaultValues,
  prefillFromInvoice,
}: SimplifiedOffRampInnerProps) {
  const [amount, setAmount] = useState(
    defaultValues?.amount ?? prefillFromInvoice?.amount ?? '10000',
  );
  const [destinationType, setDestinationType] = useState<
    'ach' | 'iban' | 'crypto'
  >('ach');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState(1);

  const getAccountType = (source: any) =>
    source.sourceAccountType || source.accountType;

  const achAccount = fundingSources.find(
    (source) => getAccountType(source) === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => getAccountType(source) === 'iban',
  );

  const processingSteps = [
    'Verifying account details...',
    'Initiating transfer...',
    'Processing payment...',
  ];

  const handleTransfer = async () => {
    setIsProcessing(true);

    for (let i = 0; i < processingSteps.length; i += 1) {
      setStep(i + 1);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const handleReset = () => {
    setAmount(defaultValues?.amount ?? prefillFromInvoice?.amount ?? '10000');
    setDestinationType('ach');
    setIsComplete(false);
    setStep(1);
  };

  if (isComplete) {
    return (
      <div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-6 space-y-6">
          <SuccessAnimation />
          <div className="text-center space-y-2">
            <h3 className="text-[28px] font-semibold tracking-[-0.01em] text-[#101010]">
              Transfer initiated
            </h3>
            <p className="text-[14px] text-[#101010]/65 max-w-md">
              Your transfer of {formatUsd(Number(amount || 0))} has been
              successfully initiated. Funds will arrive in 1-2 business days.
            </p>
          </div>
          <Button
            onClick={handleReset}
            className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 text-[14px] font-medium transition-all"
          >
            Make Another Transfer
          </Button>
        </div>
        <div className="flex-shrink-0 p-4 text-center text-[11px] text-[#101010]/40 uppercase tracking-[0.14em]">
          Demo Mode
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-white h-full max-h-[100dvh] flex flex-col items-center justify-center p-6 space-y-6 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-[#1B29FF]/20 rounded-full animate-ping" />
          <div className="relative bg-[#1B29FF]/10 rounded-full p-4">
            <Loader2 className="h-8 w-8 text-[#1B29FF] animate-spin" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
            Processing transfer
          </h3>
          <p className="text-[14px] text-[#1B29FF] animate-pulse">
            {processingSteps[step - 1]}
          </p>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-1 bg-[#101010]/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B29FF] transition-all duration-500"
              style={{ width: `${(step / processingSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-5 sm:p-6 space-y-6">
          {/* Header */}
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
              Transfer to Bank
            </p>
            <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
              Move funds to your bank
            </h2>
          </div>

          {/* Amount Input */}
          <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-[13px] font-medium text-[#101010]">
                Amount to send
              </Label>
              <CurrencyPill currency="USDC" />
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-[28px] font-semibold tabular-nums h-14 border-0 bg-transparent p-0 focus-visible:ring-0"
              placeholder="0.00"
            />
            <div className="mt-3 flex justify-between text-[12px]">
              <span className="text-[#101010]/60">Demo balance</span>
              <span className="font-medium tabular-nums text-[#101010]">
                {formatUsd(2500000)}
              </span>
            </div>
          </div>

          {/* Destination */}
          <div>
            <Label className="text-[13px] font-medium text-[#101010] mb-3 block">
              Send to
            </Label>
            <DestinationSelector
              value={destinationType}
              onChange={setDestinationType}
              hasAchAccount={!!achAccount}
              hasIbanAccount={!!ibanAccount}
              isTechnical={false}
            />
          </div>

          {/* Quote Preview */}
          <QuotePreview
            amountUsdc={Number(amount || 0)}
            destinationType={destinationType}
          />

          <div className="text-center text-[11px] text-[#101010]/40 uppercase tracking-[0.14em]">
            Demo Mode • No actual funds will be transferred
          </div>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="flex-shrink-0 bg-white border-t border-[#101010]/10 p-4 sm:p-6">
        <Button
          onClick={handleTransfer}
          disabled={!amount || Number(amount) <= 0}
          className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-14 text-[15px] font-semibold rounded-xl transition-all shadow-lg shadow-[#1B29FF]/20"
        >
          <span>Continue</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================

export function SimplifiedOffRamp(props: SimplifiedOffRampProps) {
  const { mode = 'real', ...rest } = props;

  if (mode === 'demo') {
    return <SimplifiedOffRampDemo {...rest} />;
  }

  return <SimplifiedOffRampReal {...rest} />;
}

// ============================================================================
// REAL MODE COMPONENT
// ============================================================================

function SimplifiedOffRampReal({
  fundingSources,
  prefillFromInvoice,
  defaultValues,
  idleBalance,
  earningBalance,
  spendableBalance,
  vaultPositions,
}: SimplifiedOffRampInnerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [wethBalance, setWethBalance] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [transferDetails, setTransferDetails] =
    useState<AlignTransferCreatedResponse | null>(null);
  // Track the current quote for creating transfer
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [userOpHash, setUserOpHash] = useState<string | null>(null);
  const [primarySafeAddress, setPrimarySafeAddress] = useState<Address | null>(
    null,
  );
  const [cryptoTxHash, setCryptoTxHash] = useState<string | null>(null);

  // Multi-step transfer state (for auto-withdraw from earning)
  const [transferSteps, setTransferSteps] = useState<TransferStep[]>([]);
  const [currentTransferStepIndex, setCurrentTransferStepIndex] = useState(0);
  const [isMultiStepTransfer, setIsMultiStepTransfer] = useState(false);

  const { client: smartClient } = useSmartWallets();
  const { isTechnical } = useBimodal();

  const { data: fetchedPrimarySafeAddress, isLoading: isLoadingSafeAddress } =
    api.settings.userSafes.getPrimarySafeAddress.useQuery();

  const { ready: isRelayReady, send: sendWithRelay } = useSafeRelay(
    primarySafeAddress || undefined,
  );

  // Saved bank accounts
  const { data: savedBankAccounts, refetch: refetchBankAccounts } =
    api.settings.bankAccounts.listBankAccounts.useQuery();

  const addBankAccountMutation =
    api.settings.bankAccounts.addBankAccount.useMutation({
      onSuccess: () => {
        refetchBankAccounts();
        toast.success('Bank account saved for future transfers');
      },
      onError: (err: { message: string }) => {
        toast.error('Failed to save bank account', {
          description: err.message,
        });
      },
    });

  const getAccountType = (source: any) =>
    source.sourceAccountType || source.accountType;

  const achAccount = fundingSources.find(
    (source) => getAccountType(source) === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => getAccountType(source) === 'iban',
  );

  useEffect(() => {
    if (fetchedPrimarySafeAddress) {
      setPrimarySafeAddress(fetchedPrimarySafeAddress as Address);
    }
  }, [fetchedPrimarySafeAddress]);

  // Only default to crypto if technical mode AND no bank accounts
  const shouldDefaultToCrypto = isTechnical && !ibanAccount && !achAccount;

  const mergedDefaultValues: Partial<OffRampFormValues> = {
    destinationType: shouldDefaultToCrypto
      ? 'crypto'
      : achAccount
        ? 'ach'
        : ibanAccount
          ? 'iban'
          : 'ach',
    accountHolderType: 'individual',
    country: 'US',
    city: '',
    streetLine1: '',
    streetLine2: '',
    postalCode: '',
    cryptoAddress: '',
    cryptoAsset: 'usdc',
    amount: prefillFromInvoice?.amount || '',
    ...defaultValues,
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    trigger,
  } = useForm<OffRampFormValues>({
    defaultValues: mergedDefaultValues,
  });

  const destinationType = watch('destinationType');
  const accountHolderType = watch('accountHolderType');
  const watchedAmount = watch('amount');
  const cryptoAsset = watch('cryptoAsset') || 'usdc';
  const savedBankAccountId = watch('savedBankAccountId');
  const saveForFuture = watch('saveForFuture');

  // Track if user wants to use a new bank account vs saved
  const [useNewAccount, setUseNewAccount] = useState(true);

  // Helper to get the balance for the selected crypto asset
  const getSelectedAssetBalance = useCallback((): string | null => {
    switch (cryptoAsset) {
      case 'usdc':
        return usdcBalance;
      case 'weth':
        return wethBalance;
      case 'eth':
        return ethBalance;
      default:
        return usdcBalance;
    }
  }, [cryptoAsset, usdcBalance, wethBalance, ethBalance]);

  const selectedAssetConfig = CRYPTO_ASSETS[cryptoAsset];

  // Calculate deficit for auto-withdraw from earning balance
  const amountNum = parseFloat(watchedAmount || '0');
  const idle = idleBalance || 0;
  const earning = earningBalance || 0;
  const total = spendableBalance || idle + earning;
  const deficit = Math.max(0, amountNum - idle);
  const insufficientFunds = amountNum > total;
  const needsEarningWithdraw =
    deficit > 0 &&
    deficit <= earning &&
    vaultPositions &&
    vaultPositions.length > 0;

  useEffect(() => {
    const fetchBalances = async () => {
      if (!primarySafeAddress) return;
      setIsLoadingBalance(true);
      try {
        const publicClient = createPublicClient({
          chain: base,
          transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
        });

        // Fetch USDC balance
        const usdcBal = await publicClient.readContract({
          address: USDC_BASE_ADDRESS,
          abi: erc20AbiBalanceOf,
          functionName: 'balanceOf',
          args: [primarySafeAddress],
        });
        setUsdcBalance(formatUnits(usdcBal as bigint, USDC_DECIMALS));

        // Fetch WETH balance (only in technical mode)
        if (isTechnical) {
          const wethBal = await publicClient.readContract({
            address: WETH_ADDRESS as Address,
            abi: erc20AbiBalanceOf,
            functionName: 'balanceOf',
            args: [primarySafeAddress],
          });
          setWethBalance(formatUnits(wethBal as bigint, WETH_DECIMALS));

          // Fetch native ETH balance
          const ethBal = await publicClient.getBalance({
            address: primarySafeAddress,
          });
          setEthBalance(formatUnits(ethBal, 18));
        }
      } catch (err) {
        toast.error('Could not fetch balances.');
      } finally {
        setIsLoadingBalance(false);
      }
    };
    fetchBalances();
  }, [primarySafeAddress, isTechnical]);

  // Browser navigation warning when transfer is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading || isMultiStepTransfer) {
        e.preventDefault();
        e.returnValue = 'Transfer in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoading, isMultiStepTransfer]);

  // Effect to populate form when selecting a saved bank account
  useEffect(() => {
    if (!savedBankAccountId || useNewAccount) return;

    const selectedAccount = savedBankAccounts?.find(
      (acc) => acc.id === savedBankAccountId,
    );
    if (!selectedAccount) return;

    // Populate form with saved account details
    setValue('bankName', selectedAccount.bankName);
    setValue(
      'accountHolderType',
      selectedAccount.accountHolderType as 'individual' | 'business',
    );

    // Account holder name fields - always set to ensure form is populated
    setValue(
      'accountHolderFirstName',
      selectedAccount.accountHolderFirstName || '',
    );
    setValue(
      'accountHolderLastName',
      selectedAccount.accountHolderLastName || '',
    );
    setValue(
      'accountHolderBusinessName',
      selectedAccount.accountHolderBusinessName || '',
    );

    // Address fields - always set to ensure form is populated
    setValue('country', selectedAccount.country);
    setValue('city', selectedAccount.city || '');
    setValue('streetLine1', selectedAccount.streetLine1 || '');
    setValue('streetLine2', selectedAccount.streetLine2 || '');
    setValue('postalCode', selectedAccount.postalCode || '');

    // Account details (for transfers) - always set
    if (selectedAccount.accountType === 'us') {
      setValue('accountNumber', selectedAccount.accountNumber || '');
      setValue('routingNumber', selectedAccount.routingNumber || '');
    } else if (selectedAccount.accountType === 'iban') {
      setValue('iban', selectedAccount.ibanNumber || '');
      setValue('bic', selectedAccount.bicSwift || '');
    }

    // Set destination type based on account type
    if (selectedAccount.accountType === 'us') {
      setValue('destinationType', 'ach');
    } else if (selectedAccount.accountType === 'iban') {
      setValue('destinationType', 'iban');
    }
  }, [savedBankAccountId, savedBankAccounts, useNewAccount, setValue]);

  // Use quote-based transfer creation for accurate amounts
  const createTransferFromQuoteMutation =
    api.align.createOfframpTransferFromQuote.useMutation({
      onSuccess: (data) => {
        setTransferDetails(data);
        setCurrentStep(1);
        toast.success('Transfer initiated. Ready to send funds.');
      },
      onError: (err) => setError(`Failed to initiate transfer: ${err.message}`),
    });

  const prepareTxMutation = api.align.prepareOfframpTokenTransfer.useMutation({
    onError: (err) =>
      setError(`Transaction preparation failed: ${err.message}`),
  });

  const completeTransferMutation =
    api.align.completeOfframpTransfer.useMutation({
      onSuccess: () => {
        setCurrentStep(2);
        toast.success('Transfer processing.');
      },
      onError: (err) => setError(`Failed to finalize transfer: ${err.message}`),
      onSettled: () => setIsLoading(false),
    });

  const isSubmittingTransfer =
    isLoading || createTransferFromQuoteMutation.isPending;

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof OffRampFormValues)[] = [];

    if (formStep === 1) {
      fieldsToValidate = ['destinationType'];
    } else if (formStep === 2) {
      fieldsToValidate = ['amount'];

      if (destinationType === 'crypto') {
        fieldsToValidate.push('cryptoAddress', 'cryptoAsset');
      } else {
        fieldsToValidate.push('accountHolderType', 'bankName');

        if (accountHolderType === 'individual') {
          fieldsToValidate.push(
            'accountHolderFirstName',
            'accountHolderLastName',
          );
        } else {
          fieldsToValidate.push('accountHolderBusinessName');
        }

        if (destinationType === 'ach') {
          fieldsToValidate.push('accountNumber', 'routingNumber');
        } else {
          fieldsToValidate.push('iban', 'bic');
        }

        fieldsToValidate.push('country', 'city', 'streetLine1', 'postalCode');
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setFormStep(formStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setFormStep(formStep - 1);
  };

  const handleCryptoTransfer = async (values: OffRampFormValues) => {
    if (!isRelayReady || !values.cryptoAddress || !primarySafeAddress) {
      toast.error('Required information is missing.');
      return;
    }

    if (!isAddress(values.cryptoAddress)) {
      setError('Invalid recipient address.');
      return;
    }

    const asset = values.cryptoAsset || 'usdc';
    const assetConfig = CRYPTO_ASSETS[asset];

    setIsLoading(true);
    setError(null);
    setCryptoTxHash(null);

    // Check if we need multi-step transfer (withdraw from earning first)
    // Only applicable for USDC transfers
    const needsWithdrawForCrypto =
      asset === 'usdc' && needsEarningWithdraw && !isMultiStepTransfer;

    if (needsWithdrawForCrypto) {
      // Initialize multi-step transfer
      setIsMultiStepTransfer(true);
      setTransferSteps([
        {
          id: 'withdraw',
          label: 'Withdrawing from earning balance',
          status: 'pending',
          subtitle: `${deficit.toFixed(2)} USDC from vaults`,
        },
        {
          id: 'transfer',
          label: `Sending ${assetConfig.symbol}`,
          status: 'pending',
          subtitle: `To ${values.cryptoAddress.slice(0, 6)}...${values.cryptoAddress.slice(-4)}`,
        },
        {
          id: 'complete',
          label: 'Transfer complete',
          status: 'pending',
        },
      ]);
      setCurrentTransferStepIndex(0);

      try {
        // Step 1: Withdraw from vaults
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'in_progress' } : s)),
        );

        await handleVaultWithdrawal();

        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'completed' } : s)),
        );
        setCurrentTransferStepIndex(1);

        // Step 2: Continue with crypto transfer
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 1 ? { ...s, status: 'in_progress' } : s)),
        );
      } catch (error: any) {
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'error' } : s)),
        );
        setError(`Vault withdrawal failed: ${error.message}`);
        setIsLoading(false);
        setIsMultiStepTransfer(false);
        return;
      }
    }

    try {
      setLoadingMessage(`Preparing ${assetConfig.symbol} transfer...`);

      const valueInUnits = parseUnits(values.amount, assetConfig.decimals);
      if (valueInUnits <= 0n) {
        throw new Error('Amount must be greater than 0.');
      }

      let transactions: MetaTransactionData[];

      if (assetConfig.isNative) {
        // Native ETH transfer
        transactions = [
          {
            to: values.cryptoAddress as Address,
            value: valueInUnits.toString(),
            data: '0x',
          },
        ];
      } else {
        // ERC20 token transfer (USDC, WETH)
        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [values.cryptoAddress as Address, valueInUnits],
        });

        transactions = [
          {
            to: assetConfig.address!,
            value: '0',
            data: transferData,
          },
        ];
      }

      setLoadingMessage('Sending transaction...');
      const txHash = await sendWithRelay(transactions);
      setCryptoTxHash(txHash);

      // Update multi-step transfer progress
      if (isMultiStepTransfer || needsWithdrawForCrypto) {
        setTransferSteps((prev) =>
          prev.map((s, i) => {
            if (i === 1) return { ...s, status: 'completed' };
            if (i === 2) return { ...s, status: 'completed' };
            return s;
          }),
        );
        setCurrentTransferStepIndex(2);
      }

      setCurrentStep(2);
      toast.success(`${assetConfig.symbol} transfer completed successfully!`);
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send ${assetConfig.symbol} transfer: ${errMsg}`);

      // Update multi-step transfer on error
      if (isMultiStepTransfer || needsWithdrawForCrypto) {
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 1 ? { ...s, status: 'error' } : s)),
        );
      }

      toast.error(`${assetConfig.symbol} transfer failed`, {
        description: errMsg,
      });
    } finally {
      setIsLoading(false);
      if (isMultiStepTransfer) {
        setIsMultiStepTransfer(false);
      }
    }
  };

  const handleInitiateSubmit = async (values: OffRampFormValues) => {
    setError(null);

    if (values.destinationType === 'crypto') {
      await handleCryptoTransfer(values);
      return;
    }

    // Validate that we have a quote
    if (!currentQuote) {
      toast.error('Please wait for the quote to load.');
      return;
    }

    // Save bank account if requested (don't block transfer on failure)
    if (values.saveForFuture && useNewAccount) {
      try {
        await addBankAccountMutation.mutateAsync({
          accountName:
            values.accountNickname ||
            `${values.bankName} - ${values.accountHolderType === 'individual' ? `${values.accountHolderFirstName} ${values.accountHolderLastName}` : values.accountHolderBusinessName}`,
          bankName: values.bankName,
          accountHolderType: values.accountHolderType,
          accountHolderFirstName: values.accountHolderFirstName,
          accountHolderLastName: values.accountHolderLastName,
          accountHolderBusinessName: values.accountHolderBusinessName,
          country: values.country,
          city: values.city,
          streetLine1: values.streetLine1,
          streetLine2: values.streetLine2,
          postalCode: values.postalCode,
          accountType: values.destinationType === 'ach' ? 'us' : 'iban',
          accountNumber: values.accountNumber,
          routingNumber: values.routingNumber,
          ibanNumber: values.iban,
          bicSwift: values.bic,
          isDefault: false,
        });
      } catch {
        // Already handled by mutation error handler
      }
    }

    // Create transfer from quote with accurate amounts
    await createTransferFromQuoteMutation.mutateAsync({
      quoteId: currentQuote.quoteId,
      bankName: values.bankName,
      accountHolderType: values.accountHolderType,
      accountHolderFirstName: values.accountHolderFirstName,
      accountHolderLastName: values.accountHolderLastName,
      accountHolderBusinessName: values.accountHolderBusinessName,
      country: values.country,
      city: values.city,
      streetLine1: values.streetLine1,
      streetLine2: values.streetLine2,
      postalCode: values.postalCode,
      accountType: values.destinationType === 'ach' ? 'us' : 'iban',
      accountNumber: values.accountNumber,
      routingNumber: values.routingNumber,
      ibanNumber: values.iban,
      bicSwift: values.bic,
      // Pass quote data for DB storage
      sourceAmount: currentQuote.sourceAmount,
      destinationAmount: currentQuote.destinationAmount,
      destinationCurrency: currentQuote.destinationCurrency,
      destinationPaymentRails:
        values.destinationType === 'ach' ? 'ach' : 'sepa',
      feeAmount: currentQuote.feeAmount,
    });
  };

  // Handle vault withdrawal step for multi-step transfers
  const handleVaultWithdrawal = async (): Promise<boolean> => {
    if (!primarySafeAddress || !vaultPositions || !sendWithRelay) {
      return false;
    }

    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
      });

      const { transactions, totalWithdrawn } =
        await buildVaultWithdrawalTransactions({
          amountUsdc: deficit,
          vaultPositions,
          safeAddress: primarySafeAddress,
          publicClient: publicClient as any, // Cast to avoid viem version type conflicts
        });

      if (transactions.length === 0) {
        throw new Error('No vault withdrawal transactions could be built');
      }

      console.log('[SimplifiedOffRamp] Executing vault withdrawal:', {
        deficit,
        totalWithdrawn,
        transactionCount: transactions.length,
      });

      // Execute withdrawal via Safe relay
      const txHash = await sendWithRelay(
        transactions.map((tx) => ({
          to: tx.to,
          value: tx.value,
          data: tx.data,
        })),
        1_500_000n, // Gas limit for multiple vault redemptions
      );

      console.log('[SimplifiedOffRamp] Vault withdrawal tx hash:', txHash);

      // Wait a bit for the transaction to be confirmed
      await new Promise((resolve) => setTimeout(resolve, 5000));

      return true;
    } catch (error) {
      console.error('[SimplifiedOffRamp] Vault withdrawal failed:', error);
      throw error;
    }
  };

  const handleSendFunds = async () => {
    if (!transferDetails || !primarySafeAddress || !smartClient?.account) {
      toast.error('Required information is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const { alignTransferId } = transferDetails;

    // Check if we need multi-step transfer (withdraw from earning first)
    if (needsEarningWithdraw && !isMultiStepTransfer) {
      // Initialize multi-step transfer
      setIsMultiStepTransfer(true);
      setTransferSteps([
        {
          id: 'withdraw',
          label: 'Withdrawing from earning balance',
          status: 'pending',
          subtitle: `${deficit.toFixed(2)} USDC from vaults`,
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
      ]);
      setCurrentTransferStepIndex(0);

      try {
        // Step 1: Withdraw from vaults
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'in_progress' } : s)),
        );

        await handleVaultWithdrawal();

        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'completed' } : s)),
        );
        setCurrentTransferStepIndex(1);

        // Step 2: Continue with bank transfer (falls through to normal flow)
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 1 ? { ...s, status: 'in_progress' } : s)),
        );
      } catch (error: any) {
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 0 ? { ...s, status: 'error' } : s)),
        );
        setError(`Vault withdrawal failed: ${error.message}`);
        setIsLoading(false);
        return;
      }
    }

    try {
      setLoadingMessage('Preparing transaction...');
      const preparedData = await prepareTxMutation.mutateAsync({
        alignTransferId,
      });

      if (!preparedData?.to || !preparedData.data) {
        throw new Error('Invalid transaction data from server.');
      }

      setLoadingMessage('Initializing secure account...');
      const safeSdk = await Safe.init({
        provider: process.env.NEXT_PUBLIC_BASE_RPC_URL!,
        safeAddress: primarySafeAddress,
      });

      setLoadingMessage('Creating transaction...');
      const safeTransaction = await safeSdk.createTransaction({
        transactions: [preparedData],
      });
      safeTransaction.data.safeTxGas = BigInt(220000).toString();

      setLoadingMessage('Signing transaction...');
      const ownerAddress = smartClient.account.address;
      safeTransaction.addSignature({
        signer: ownerAddress,
        data: buildPrevalidatedSig(ownerAddress),
      } as any);

      const encodedExecData = encodeFunctionData({
        abi: SAFE_ABI,
        functionName: 'execTransaction',
        args: [
          safeTransaction.data.to as Address,
          BigInt(safeTransaction.data.value),
          safeTransaction.data.data as `0x${string}`,
          safeTransaction.data.operation,
          BigInt(safeTransaction.data.safeTxGas),
          BigInt(safeTransaction.data.baseGas),
          BigInt(safeTransaction.data.gasPrice),
          safeTransaction.data.gasToken as Address,
          safeTransaction.data.refundReceiver as Address,
          safeTransaction.encodedSignatures() as `0x${string}`,
        ],
      });

      setLoadingMessage('Sending transaction...');
      const txResponse = await smartClient.sendTransaction({
        to: primarySafeAddress,
        data: encodedExecData as `0x${string}`,
      });

      setUserOpHash(txResponse);
      setLoadingMessage('Finalizing...');

      // Update multi-step transfer progress
      if (isMultiStepTransfer) {
        setTransferSteps((prev) =>
          prev.map((s, i) => {
            if (i === 1) return { ...s, status: 'completed' };
            if (i === 2) return { ...s, status: 'in_progress' };
            return s;
          }),
        );
        setCurrentTransferStepIndex(2);
      }

      completeTransferMutation.mutate({
        alignTransferId,
        depositTransactionHash: txResponse,
      });
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send funds: ${errMsg}`);

      // Update multi-step transfer on error
      if (isMultiStepTransfer) {
        setTransferSteps((prev) =>
          prev.map((s, i) => (i === 1 ? { ...s, status: 'error' } : s)),
        );
      }

      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoadingSafeAddress) {
    return (
      <div className="bg-white flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B29FF]" />
      </div>
    );
  }

  // Error state - no safe
  if (!primarySafeAddress) {
    return (
      <div className="bg-white p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">
            Primary Account Not Found
          </AlertTitle>
          <AlertDescription className="text-red-700">
            We could not find your primary account. Please set it up in settings
            to proceed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ============================================================================
  // SUCCESS STATE
  // ============================================================================
  if (currentStep === 2) {
    const isEur = destinationType === 'iban';
    const currencySymbol = isEur ? '€' : '$';

    // Use actual values from the transfer/quote, not hardcoded calculations
    // For bank transfers, use transferDetails; for crypto, use watchedAmount
    const sourceAmount = transferDetails
      ? Number(
          transferDetails.sourceAmount || transferDetails.depositAmount || 0,
        )
      : Number(watchedAmount || 0);
    const destinationAmount = transferDetails
      ? Number(transferDetails.destinationAmount || 0)
      : 0;
    const fee = transferDetails ? Number(transferDetails.fee || 0) : 0;

    return (
      <div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-6 space-y-8">
          <SuccessAnimation />

          <div className="text-center space-y-3">
            <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.01em] text-[#101010]">
              {cryptoTxHash ? 'Transfer Complete' : 'Transfer Processing'}
            </h3>
            <p className="text-[14px] text-[#101010]/65 max-w-md">
              {cryptoTxHash
                ? 'Your crypto transfer has been completed successfully.'
                : destinationType === 'crypto'
                  ? 'Your transfer is being processed.'
                  : `Your bank will receive ${currencySymbol}${destinationAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${isEur ? 'EUR' : 'USD'} in ${isEur ? 'less than 24 hours' : '1-2 business days'}.`}
            </p>
          </div>

          {/* Transaction summary */}
          {destinationType !== 'crypto' && (
            <div className="w-full max-w-sm bg-[#F7F7F2] rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[13px] text-[#101010]/60">You sent</span>
                <span className="text-[15px] font-medium tabular-nums">
                  {sourceAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  USDC
                </span>
              </div>
              {fee > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#101010]/60">Fee</span>
                  <span className="text-[15px] tabular-nums text-[#101010]/70">
                    -{fee.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                    USDC
                  </span>
                </div>
              )}
              <div className="border-t border-[#101010]/10 pt-3 flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#101010]">
                  Bank receives
                </span>
                <span className="text-[18px] font-semibold tabular-nums text-green-600">
                  {currencySymbol}
                  {destinationAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}

          {(userOpHash || cryptoTxHash) && (
            <a
              href={`https://basescan.org/tx/${userOpHash || cryptoTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
            >
              <span>View on Basescan</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}

          <Button
            onClick={() => {
              setCurrentStep(0);
              setCryptoTxHash(null);
              setUserOpHash(null);
              setFormStep(1);
            }}
            className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-8 py-3 text-[14px] font-medium rounded-xl shadow-lg shadow-[#1B29FF]/20"
          >
            Make Another Transfer
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // CONFIRMATION STATE (after transfer created, before sending)
  // ============================================================================
  if (currentStep === 1 && transferDetails) {
    const isEur = destinationType === 'iban';
    // Use data from the quote-based transfer
    // sourceAmount = USDC user will send, destinationAmount = fiat bank receives
    const sourceAmount = Number(
      transferDetails.sourceAmount || transferDetails.depositAmount || 0,
    );
    const destinationAmount = Number(transferDetails.destinationAmount || 0);
    const feeAmount = Number(transferDetails.fee || 0);

    const currencySymbol = isEur ? '€' : '$';
    const currencyCode = isEur ? 'EUR' : 'USD';

    return (
      <div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-5 sm:p-6 space-y-6">
            {/* Header */}
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Confirm Transfer
              </p>
              <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
                Review and send
              </h2>
            </div>

            {/* Transfer summary */}
            <div className="space-y-4">
              {/* You send */}
              <div className="bg-[#F7F7F2] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-[#101010]/50 uppercase tracking-wider">
                    You send
                  </span>
                  <CurrencyPill currency="USDC" />
                </div>
                <p className="text-[32px] font-bold tabular-nums text-[#101010]">
                  {sourceAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[13px] text-[#101010]/50 mt-1">
                  Includes{' '}
                  {feeAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  USDC processing fee
                </p>
              </div>

              <ConversionArrow />

              {/* They receive */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-green-700/70 uppercase tracking-wider">
                    Bank receives
                  </span>
                  <CurrencyPill
                    currency={currencyCode as 'EUR' | 'USD'}
                    variant="highlight"
                  />
                </div>
                <p className="text-[36px] font-bold tabular-nums text-green-700">
                  {currencySymbol}
                  {destinationAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[13px] text-green-600/70 mt-1">
                  Arrives in 1-2 business days
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-[#101010]/10 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-[#101010]/60">Network</span>
                <span className="font-medium text-[#101010]">
                  {transferDetails.depositNetwork.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#101010]/60">Effective rate</span>
                <span className="font-medium tabular-nums text-[#101010]">
                  {sourceAmount.toFixed(2)} USDC → {currencySymbol}
                  {destinationAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom actions */}
        <div className="flex-shrink-0 bg-white border-t border-[#101010]/10 p-4 sm:p-6 space-y-3">
          {error && (
            <Alert className="bg-red-50 border-red-200 mb-3">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 text-[13px]">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Multi-step transfer progress */}
          {isMultiStepTransfer && isLoading && transferSteps.length > 0 && (
            <div className="mb-4">
              <TransferProgress
                steps={transferSteps}
                currentStepIndex={currentTransferStepIndex}
                error={error || undefined}
              />
            </div>
          )}

          <Button
            onClick={handleSendFunds}
            disabled={isLoading}
            className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-14 text-[15px] font-semibold rounded-xl transition-all shadow-lg shadow-[#1B29FF]/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isMultiStepTransfer ? 'Processing...' : loadingMessage}
              </>
            ) : (
              <>
                Confirm & Send
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <button
            type="button"
            onClick={() => setCurrentStep(0)}
            className="w-full text-[13px] text-[#101010]/60 hover:text-[#101010] py-2 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN FORM
  // ============================================================================
  return (
    <div className="bg-white h-full max-h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4 flex-shrink-0">
        {prefillFromInvoice && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <Receipt className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-medium text-[#101010] mb-1">
                  Payment for Invoice
                </p>
                <div className="text-[12px] text-[#101010]/70 space-y-0.5">
                  {prefillFromInvoice.vendorName && (
                    <p>Vendor: {prefillFromInvoice.vendorName}</p>
                  )}
                  {prefillFromInvoice.amount && (
                    <p>
                      Amount: {formatUsd(Number(prefillFromInvoice.amount))}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-1">
              Step {formStep} of 3
            </p>
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.01em] text-[#101010]">
              {formStep === 1
                ? 'Where to?'
                : formStep === 2
                  ? 'How much?'
                  : 'Confirm'}
            </h2>
          </div>
          <ProgressStepper currentStep={formStep - 1} totalSteps={3} />
        </div>
      </div>

      {/* Scrollable form content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <form
          onSubmit={handleSubmit(handleInitiateSubmit)}
          className="p-5 sm:p-6"
        >
          {/* ==================== STEP 1: Destination ==================== */}
          {formStep === 1 && (
            <div className="space-y-5">
              <p className="text-[14px] text-[#101010]/70">
                Choose where you'd like to receive your funds.
              </p>

              <Controller
                control={control}
                name="destinationType"
                render={({ field }) => (
                  <DestinationSelector
                    value={field.value}
                    onChange={field.onChange}
                    hasAchAccount={!!achAccount}
                    hasIbanAccount={!!ibanAccount}
                    isTechnical={isTechnical}
                  />
                )}
              />

              {errors.destinationType && (
                <p className="text-[12px] text-red-500">
                  {errors.destinationType.message}
                </p>
              )}
            </div>
          )}

          {/* ==================== STEP 2: Amount & Details ==================== */}
          {formStep === 2 && destinationType !== 'crypto' && (
            <div className="space-y-6">
              {/* Unified Amount + Quote Component (Wise-style) */}
              <Controller
                control={control}
                name="amount"
                rules={{
                  required: 'Amount is required',
                  validate: (value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num <= 0)
                      return 'Please enter a valid positive amount.';
                    // Validate against spendable balance (idle + earning) to allow auto-withdraw
                    const balance =
                      spendableBalance !== undefined
                        ? spendableBalance
                        : parseFloat(usdcBalance || '0');
                    if (num > balance)
                      return `Insufficient balance. You have ${balance.toFixed(2)} USDC.`;
                    return true;
                  },
                }}
                render={({ field }) => (
                  <UnifiedAmountQuote
                    amountValue={field.value || ''}
                    onAmountChange={(value) => {
                      field.onChange(value);
                    }}
                    destinationType={
                      destinationType as 'ach' | 'iban' | 'crypto'
                    }
                    onQuoteChange={setCurrentQuote}
                    usdcBalance={usdcBalance}
                    isLoadingBalance={isLoadingBalance}
                    idleBalance={idleBalance}
                    earningBalance={earningBalance}
                    spendableBalance={spendableBalance}
                    error={errors.amount?.message}
                  />
                )}
              />

              {/* Saved Bank Accounts Selector */}
              {savedBankAccounts && savedBankAccounts.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Send to
                  </p>

                  {/* Saved accounts */}
                  <div className="space-y-2">
                    {savedBankAccounts
                      .filter((acc) =>
                        destinationType === 'ach'
                          ? acc.accountType === 'us'
                          : acc.accountType === 'iban',
                      )
                      .map((account) => (
                        <button
                          key={account.id}
                          type="button"
                          onClick={() => {
                            setUseNewAccount(false);
                            setValue('savedBankAccountId', account.id);
                            // Populate ALL form fields from saved account
                            setValue('bankName', account.bankName);
                            setValue(
                              'accountHolderType',
                              account.accountHolderType as
                                | 'individual'
                                | 'business',
                            );
                            // Account holder name fields - always set to ensure form is populated
                            setValue(
                              'accountHolderFirstName',
                              account.accountHolderFirstName || '',
                            );
                            setValue(
                              'accountHolderLastName',
                              account.accountHolderLastName || '',
                            );
                            setValue(
                              'accountHolderBusinessName',
                              account.accountHolderBusinessName || '',
                            );
                            // Address fields - required for transfers
                            setValue('country', account.country);
                            setValue('city', account.city || '');
                            setValue('streetLine1', account.streetLine1 || '');
                            setValue('streetLine2', account.streetLine2 || '');
                            setValue('postalCode', account.postalCode || '');
                            // Account details based on type
                            if (account.accountType === 'us') {
                              setValue(
                                'accountNumber',
                                account.accountNumber || '',
                              );
                              setValue(
                                'routingNumber',
                                account.routingNumber || '',
                              );
                            } else if (account.accountType === 'iban') {
                              setValue('iban', account.ibanNumber || '');
                              setValue('bic', account.bicSwift || '');
                            }
                          }}
                          className={cn(
                            'w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left',
                            savedBankAccountId === account.id && !useNewAccount
                              ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                              : 'border-[#101010]/10 hover:border-[#101010]/20',
                          )}
                        >
                          <div className="w-10 h-10 bg-[#F7F7F2] rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-[#101010]/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium text-[#101010] truncate">
                              {account.accountName}
                            </p>
                            <p className="text-[12px] text-[#101010]/60">
                              {account.bankName} •{' '}
                              {account.maskedIbanNumber ||
                                account.maskedAccountNumber}
                            </p>
                          </div>
                          {savedBankAccountId === account.id &&
                            !useNewAccount && (
                              <div className="w-5 h-5 bg-[#1B29FF] rounded-full flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                        </button>
                      ))}

                    {/* Add new account option */}
                    <button
                      type="button"
                      onClick={() => {
                        setUseNewAccount(true);
                        setValue('savedBankAccountId', undefined);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all text-left',
                        useNewAccount
                          ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                          : 'border-[#101010]/10 hover:border-[#101010]/20',
                      )}
                    >
                      <div className="w-10 h-10 bg-[#1B29FF]/10 rounded-lg flex items-center justify-center">
                        <Plus className="h-5 w-5 text-[#1B29FF]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-medium text-[#101010]">
                          New bank account
                        </p>
                        <p className="text-[12px] text-[#101010]/60">
                          Enter recipient details manually
                        </p>
                      </div>
                      {useNewAccount && (
                        <div className="w-5 h-5 bg-[#1B29FF] rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Bank Account Details - only show when adding new account */}
              {(useNewAccount || !savedBankAccounts?.length) && (
                <div className="space-y-4">
                  <p className="text-[13px] font-medium text-[#101010]">
                    Recipient details
                  </p>

                  {/* Account Holder Type */}
                  <Controller
                    control={control}
                    name="accountHolderType"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-3"
                      >
                        <label className="flex items-center gap-2 px-4 py-2.5 border border-[#101010]/10 rounded-xl cursor-pointer hover:bg-[#F7F7F2]/50 transition-colors">
                          <RadioGroupItem value="individual" id="individual" />
                          <span className="text-[13px] text-[#101010]">
                            Individual
                          </span>
                        </label>
                        <label className="flex items-center gap-2 px-4 py-2.5 border border-[#101010]/10 rounded-xl cursor-pointer hover:bg-[#F7F7F2]/50 transition-colors">
                          <RadioGroupItem value="business" id="business" />
                          <span className="text-[13px] text-[#101010]">
                            Business
                          </span>
                        </label>
                      </RadioGroup>
                    )}
                  />

                  {/* Name Fields */}
                  {accountHolderType === 'individual' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          First Name
                        </Label>
                        <Input
                          {...register('accountHolderFirstName', {
                            required: 'Required',
                          })}
                          placeholder="John"
                          className="h-11 rounded-xl"
                        />
                        {errors.accountHolderFirstName && (
                          <p className="text-[11px] text-red-500 mt-1">
                            {errors.accountHolderFirstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Last Name
                        </Label>
                        <Input
                          {...register('accountHolderLastName', {
                            required: 'Required',
                          })}
                          placeholder="Doe"
                          className="h-11 rounded-xl"
                        />
                        {errors.accountHolderLastName && (
                          <p className="text-[11px] text-red-500 mt-1">
                            {errors.accountHolderLastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                        Business Name
                      </Label>
                      <Input
                        {...register('accountHolderBusinessName', {
                          required: 'Required',
                        })}
                        placeholder="Acme Corp"
                        className="h-11 rounded-xl"
                      />
                      {errors.accountHolderBusinessName && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.accountHolderBusinessName.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bank Details */}
                  <div>
                    <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                      Bank Name
                    </Label>
                    <Input
                      {...register('bankName', { required: 'Required' })}
                      placeholder="Chase Bank"
                      className="h-11 rounded-xl"
                    />
                    {errors.bankName && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>

                  {destinationType === 'ach' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Account Number
                        </Label>
                        <Input
                          {...register('accountNumber', {
                            required: 'Required',
                          })}
                          placeholder="123456789"
                          className="h-11 rounded-xl"
                        />
                        {errors.accountNumber && (
                          <p className="text-[11px] text-red-500 mt-1">
                            {errors.accountNumber.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Routing Number
                        </Label>
                        <Input
                          {...register('routingNumber', {
                            required: 'Required',
                          })}
                          placeholder="021000021"
                          className="h-11 rounded-xl"
                        />
                        {errors.routingNumber && (
                          <p className="text-[11px] text-red-500 mt-1">
                            {errors.routingNumber.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          IBAN
                        </Label>
                        <Input
                          {...register('iban', { required: 'Required' })}
                          placeholder="DE89370400440532013000"
                          className="h-11 rounded-xl font-mono text-[13px]"
                        />
                        {errors.iban && (
                          <p className="text-[11px] text-red-500 mt-1">
                            {errors.iban.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          BIC/SWIFT
                        </Label>
                        <Input
                          {...register('bic', { required: 'Required' })}
                          placeholder="COBADEFFXXX"
                          className="h-11 rounded-xl font-mono text-[13px]"
                        />
                        {errors.bic && (
                          <p className="text-[11px] text-red-500 mt-1">
                            {errors.bic.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  <div className="space-y-3 pt-2">
                    <p className="text-[12px] text-[#101010]/60">
                      Beneficiary Address
                    </p>
                    <Input
                      {...register('streetLine1', { required: 'Required' })}
                      placeholder="Street address"
                      className="h-11 rounded-xl"
                    />
                    <Input
                      {...register('streetLine2')}
                      placeholder="Apartment, suite, etc. (optional)"
                      className="h-11 rounded-xl"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        {...register('city', { required: 'Required' })}
                        placeholder="City"
                        className="h-11 rounded-xl"
                      />
                      <Input
                        {...register('postalCode', { required: 'Required' })}
                        placeholder="ZIP / Postal"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <Controller
                      control={control}
                      name="country"
                      rules={{ required: 'Required' }}
                      render={({ field }) => (
                        <Combobox
                          options={COUNTRIES}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select country..."
                          searchPlaceholder="Search countries..."
                          emptyPlaceholder="No country found."
                          triggerClassName="h-11 rounded-xl"
                        />
                      )}
                    />
                  </div>

                  {/* Save for future transfers */}
                  <div className="pt-3 border-t border-[#101010]/10">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <Controller
                        control={control}
                        name="saveForFuture"
                        render={({ field }) => (
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        )}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <BookmarkPlus className="h-4 w-4 text-[#1B29FF]" />
                          <span className="text-[13px] font-medium text-[#101010] group-hover:text-[#1B29FF] transition-colors">
                            Save for future transfers
                          </span>
                        </div>
                        <p className="text-[12px] text-[#101010]/60 mt-0.5">
                          Quickly select this account for your next transfer
                        </p>
                      </div>
                    </label>

                    {/* Account nickname input - show when saving */}
                    {saveForFuture && (
                      <div className="mt-3 pl-7">
                        <Label className="text-[12px] text-[#101010]/60 mb-1.5 block">
                          Account nickname (optional)
                        </Label>
                        <Input
                          {...register('accountNickname')}
                          placeholder={`e.g., ${watch('bankName') || 'Bank'} - ${watch('accountHolderFirstName') || 'Name'}`}
                          className="h-10 rounded-lg text-[13px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== STEP 2: Crypto Transfer (Technical Mode) ==================== */}
          {formStep === 2 && destinationType === 'crypto' && (
            <div className="space-y-5">
              {/* Asset Selection */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-xl overflow-hidden">
                <BlueprintGrid className="opacity-30" />
                <Crosshairs position="top-left" />
                <Crosshairs position="top-right" />

                <div className="relative z-10 p-4">
                  <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase mb-3">
                    SELECT_ASSET
                  </p>
                  <Controller
                    control={control}
                    name="cryptoAsset"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value || 'usdc'}
                        className="grid grid-cols-3 gap-2"
                      >
                        {(
                          Object.entries(CRYPTO_ASSETS) as [
                            CryptoAsset,
                            CryptoAssetConfig,
                          ][]
                        ).map(([key, asset]) => {
                          const balance =
                            key === 'usdc'
                              ? usdcBalance
                              : key === 'weth'
                                ? wethBalance
                                : ethBalance;
                          const isSelected = field.value === key;

                          return (
                            <label
                              key={key}
                              className={cn(
                                'relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all',
                                isSelected
                                  ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                                  : 'border-[#1B29FF]/20 hover:border-[#1B29FF]/40',
                              )}
                            >
                              <RadioGroupItem value={key} className="sr-only" />
                              <span className="text-lg mb-1">{asset.icon}</span>
                              <span className="font-mono text-[12px] font-medium">
                                {asset.symbol}
                              </span>
                              <span className="font-mono text-[10px] text-[#101010]/50 tabular-nums">
                                {balance
                                  ? parseFloat(balance).toFixed(4)
                                  : '0.0000'}
                              </span>
                              {isSelected && (
                                <Check className="absolute top-1 right-1 h-3 w-3 text-[#1B29FF]" />
                              )}
                            </label>
                          );
                        })}
                      </RadioGroup>
                    )}
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-xl overflow-hidden">
                <BlueprintGrid className="opacity-30" />

                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                      AMOUNT::{selectedAssetConfig.symbol}
                    </p>
                    <span className="font-mono text-[9px] text-[#101010]/50 bg-[#101010]/5 px-2 py-0.5 rounded">
                      on Base
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      {...register('amount', {
                        required: 'Amount is required',
                        validate: (value) => {
                          const num = parseFloat(value);
                          if (isNaN(num) || num <= 0) return 'Invalid amount';
                          // For USDC, check against spendable balance (idle + earning)
                          if (
                            cryptoAsset === 'usdc' &&
                            spendableBalance !== undefined
                          ) {
                            if (num > spendableBalance)
                              return 'Exceeds spendable balance';
                          } else {
                            const bal = getSelectedAssetBalance();
                            if (bal && num > parseFloat(bal))
                              return 'Exceeds balance';
                          }
                          return true;
                        },
                      })}
                      placeholder="0.00"
                      className="text-[24px] font-mono font-semibold tabular-nums h-12 border-[#1B29FF]/20 rounded-lg pr-20"
                    />
                    {/* For USDC, show MAX as spendable balance; for others, show asset balance */}
                    {(cryptoAsset === 'usdc'
                      ? spendableBalance !== undefined ||
                        getSelectedAssetBalance()
                      : getSelectedAssetBalance()) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            cryptoAsset === 'usdc' &&
                            spendableBalance !== undefined
                          ) {
                            setValue('amount', spendableBalance.toString(), {
                              shouldValidate: true,
                            });
                          } else {
                            const bal = getSelectedAssetBalance();
                            if (bal)
                              setValue('amount', bal, { shouldValidate: true });
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 font-mono text-[10px] text-[#1B29FF] border border-[#1B29FF]/30 rounded hover:bg-[#1B29FF]/5"
                      >
                        MAX
                      </button>
                    )}
                  </div>
                  {errors.amount && (
                    <p className="font-mono text-[11px] text-red-500 mt-2">
                      {errors.amount.message}
                    </p>
                  )}
                  {/* Show spendable breakdown for USDC */}
                  {cryptoAsset === 'usdc' &&
                    spendableBalance !== undefined &&
                    earningBalance !== undefined &&
                    idleBalance !== undefined && (
                      <div className="mt-2 font-mono text-[10px] text-[#101010]/50">
                        Spendable:{' '}
                        {spendableBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        USDC
                        <span className="mx-1">·</span>
                        {earningBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        earning
                        <span className="mx-1">·</span>
                        {idleBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}{' '}
                        idle
                      </div>
                    )}
                  {/* Warning: will use earning balance */}
                  {cryptoAsset === 'usdc' &&
                    needsEarningWithdraw &&
                    !insufficientFunds &&
                    amountNum > 0 && (
                      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                        <TrendingDown className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                          Uses{' '}
                          <span className="font-medium">
                            {deficit.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{' '}
                            USDC
                          </span>{' '}
                          from earning
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Recipient Address */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-xl overflow-hidden">
                <BlueprintGrid className="opacity-30" />

                <div className="relative z-10 p-4">
                  <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase mb-3">
                    DESTINATION_ADDRESS
                  </p>
                  <Input
                    {...register('cryptoAddress', {
                      required: 'Address required',
                      validate: (v) => (v && isAddress(v)) || 'Invalid address',
                    })}
                    placeholder="0x..."
                    className="h-12 font-mono text-[13px] border-[#1B29FF]/20 rounded-lg"
                  />
                  {errors.cryptoAddress && (
                    <p className="font-mono text-[11px] text-red-500 mt-2">
                      {errors.cryptoAddress.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: Review ==================== */}
          {formStep === 3 && (
            <div className="space-y-5">
              {isSubmittingTransfer && (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-[#1B29FF]" />
                  <p className="text-[14px] text-[#101010]/70">
                    {loadingMessage}
                  </p>
                </div>
              )}

              {!isSubmittingTransfer && (
                <>
                  {/* Summary */}
                  <div className="bg-[#F7F7F2] rounded-2xl p-5 space-y-4">
                    <p className="text-[11px] text-[#101010]/50 uppercase tracking-wider">
                      Transfer Summary
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#101010]/60">
                          Type
                        </span>
                        <span className="text-[13px] font-medium text-[#101010]">
                          {destinationType === 'ach'
                            ? 'ACH Transfer'
                            : destinationType === 'iban'
                              ? 'SEPA Transfer'
                              : `${selectedAssetConfig.symbol} Transfer`}
                        </span>
                      </div>
                      {/* Only show network for crypto transfers, or in technical mode */}
                      {(destinationType === 'crypto' || isTechnical) && (
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] text-[#101010]/60">
                            Network
                          </span>
                          <span className="text-[13px] font-medium text-[#101010]">
                            Base
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-[13px] text-[#101010]/60">
                          You send
                        </span>
                        <div className="text-right">
                          <span className="text-[18px] font-semibold tabular-nums text-[#101010]">
                            {destinationType === 'crypto'
                              ? `${watchedAmount} ${selectedAssetConfig.symbol}`
                              : `${watchedAmount} USDC`}
                          </span>
                          {/* Only show "on Base" for crypto transfers, or in technical mode */}
                          {(destinationType === 'crypto' || isTechnical) && (
                            <p className="text-[11px] text-[#101010]/50">
                              on Base
                            </p>
                          )}
                        </div>
                      </div>

                      {destinationType !== 'crypto' && (
                        <>
                          <div className="border-t border-[#101010]/10 pt-3 flex justify-between">
                            <span className="text-[13px] text-[#101010]/60">
                              Recipient
                            </span>
                            <span className="text-[13px] text-[#101010]">
                              {accountHolderType === 'individual'
                                ? `${watch('accountHolderFirstName')} ${watch('accountHolderLastName')}`
                                : watch('accountHolderBusinessName')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[13px] text-[#101010]/60">
                              Bank
                            </span>
                            <span className="text-[13px] text-[#101010]">
                              {watch('bankName')}
                            </span>
                          </div>
                        </>
                      )}

                      {destinationType === 'crypto' && (
                        <div className="border-t border-[#101010]/10 pt-3 flex justify-between">
                          <span className="text-[13px] text-[#101010]/60">
                            Wallet
                          </span>
                          <span className="text-[12px] font-mono text-[#101010]">
                            {watch('cryptoAddress')?.slice(0, 6)}...
                            {watch('cryptoAddress')?.slice(-4)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-step transfer warning */}
                  {needsEarningWithdraw &&
                    (destinationType !== 'crypto' ||
                      cryptoAsset === 'usdc') && (
                      <Alert className="bg-blue-50 border-blue-200 rounded-xl">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-[12px] text-blue-800">
                          <span className="font-medium">
                            Multi-step transfer:
                          </span>{' '}
                          This will first withdraw{' '}
                          <span className="font-medium tabular-nums">
                            {deficit.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{' '}
                            USDC
                          </span>{' '}
                          from your earning balance. Please stay on this page
                          until complete (~30 seconds).
                        </AlertDescription>
                      </Alert>
                    )}

                  {/* Warning */}
                  <Alert className="bg-amber-50 border-amber-200 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-[12px] text-amber-800">
                      {destinationType === 'crypto'
                        ? 'Crypto transfers are irreversible. Please verify the address.'
                        : 'Bank transfers typically process within 1-3 business days.'}
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Fixed bottom navigation */}
      <div className="flex-shrink-0 bg-white border-t border-[#101010]/10 p-4 sm:p-6">
        {error && (
          <Alert className="bg-red-50 border-red-200 mb-3 rounded-xl">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 text-[13px]">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          {formStep > 1 && (
            <Button
              type="button"
              onClick={handlePreviousStep}
              variant="outline"
              disabled={isSubmittingTransfer}
              className="flex-1 h-12 rounded-xl border-[#101010]/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          {formStep < 3 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={formStep === 1 && !destinationType}
              className={cn(
                'bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-semibold rounded-xl shadow-lg shadow-[#1B29FF]/20',
                formStep === 1 ? 'w-full' : 'flex-1',
              )}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(handleInitiateSubmit)}
              disabled={isSubmittingTransfer}
              className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-semibold rounded-xl shadow-lg shadow-[#1B29FF]/20"
            >
              {isSubmittingTransfer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                <>
                  Complete Transfer
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
