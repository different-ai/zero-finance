/**
 * Types and constants for the off-ramp flow
 * Extracted from simplified-off-ramp.tsx for modularity
 */

import { Address } from 'viem';
import {
  USDC_ADDRESS,
  WETH_ADDRESS,
  WETH_DECIMALS,
  USDC_DECIMALS,
} from '@/lib/constants';
import { type ComboboxOption } from '@/components/ui/combo-box';
import { type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { type VaultPosition } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard-summary-wrapper';

// ============================================================================
// CRYPTO ASSETS
// ============================================================================

export type CryptoAsset = 'usdc' | 'weth' | 'eth';

export interface CryptoAssetConfig {
  symbol: string;
  name: string;
  address: Address | null;
  decimals: number;
  icon: string;
  isNative: boolean;
}

export const CRYPTO_ASSETS: Record<CryptoAsset, CryptoAssetConfig> = {
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

// ============================================================================
// RATES & CONSTANTS
// ============================================================================

// Approximate exchange rates (would be fetched from API in production)
export const APPROX_RATES = {
  USDC_TO_EUR: 0.92,
  USDC_TO_USD: 1.0,
  FEE_PERCENTAGE: 0.005, // 0.5%
};

export const USDC_BASE_ADDRESS = USDC_ADDRESS as Address;

// Country list
export const COUNTRIES: ComboboxOption[] = [
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

// ============================================================================
// ABIs
// ============================================================================

export const erc20AbiBalanceOf = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

// ERC4626 Vault ABI for withdrawal
export const VAULT_ABI = [
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

// ============================================================================
// API TYPES
// ============================================================================

export interface CreateOfframpTransferInput {
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

export interface AlignTransferCreatedResponse {
  alignTransferId: string;
  depositAmount: string;
  fee: string;
  depositNetwork: string;
  status: string;
  // Added for quote-based flow
  sourceAmount?: string;
  destinationAmount?: string;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface OffRampFormValues {
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

export type FundingSource = {
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

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export type SimplifiedOffRampMode = 'demo' | 'real';

export interface SimplifiedOffRampProps {
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

export type SimplifiedOffRampInnerProps = Omit<SimplifiedOffRampProps, 'mode'>;

// ============================================================================
// QUOTE TYPES
// ============================================================================

export interface QuoteData {
  quoteId: string;
  sourceAmount: string;
  destinationAmount: string;
  feeAmount: string;
  exchangeRate: string;
  destinationCurrency: 'usd' | 'eur' | 'aed';
  destinationPaymentRails: string;
}

export interface QuotePreviewProps {
  amountUsdc: number;
  destinationType: 'ach' | 'iban' | 'crypto';
  onQuoteChange?: (quote: QuoteData | null) => void;
}

// ============================================================================
// TRANSFER PROGRESS TYPES
// ============================================================================

export type TransferStepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'error';

export interface TransferStep {
  id: string;
  label: string;
  status: TransferStepStatus;
  subtitle?: string;
}

// ============================================================================
// VAULT WITHDRAWAL TYPES
// ============================================================================

export interface VaultWithdrawalTransaction {
  to: Address;
  value: string;
  data: `0x${string}`;
}

// ============================================================================
// DESTINATION SELECTOR TYPES
// ============================================================================

export interface DestinationOption {
  id: 'ach' | 'iban' | 'crypto';
  label: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
}
