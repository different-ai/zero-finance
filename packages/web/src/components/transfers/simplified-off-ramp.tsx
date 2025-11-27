'use client';

import React, { useState, useEffect } from 'react';
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
  Banknote,
  Globe,
  Check,
  ArrowLeft,
  Wallet,
  Receipt,
  DollarSign,
  Euro,
  Building2,
  AlertCircle,
  Coins,
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

// Crypto asset configuration for technical mode transfers
type CryptoAsset = 'usdc' | 'weth' | 'eth';

interface CryptoAssetConfig {
  symbol: string;
  name: string;
  address: Address | null; // null for native ETH
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

// Types remain the same...
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

function SimplifiedOffRampDemo({
  fundingSources,
  defaultValues,
  prefillFromInvoice,
}: SimplifiedOffRampInnerProps) {
  const [amount, setAmount] = useState(
    defaultValues?.amount ?? prefillFromInvoice?.amount ?? '10000',
  );
  const [destinationType, setDestinationType] = useState<
    'ach' | 'iban' | 'external'
  >('ach');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState(1);

  const achAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'iban',
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
      <div className="bg-white">
        <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            TRANSFER COMPLETE
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <CheckCircle2 className="relative h-12 w-12 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.01em] text-[#101010]">
                Transfer initiated
              </h3>
              <p className="text-[14px] text-[#101010]/65 max-w-md">
                Your transfer of {formatUsd(Number(amount || 0))} has been
                successfully initiated. Funds will arrive in 1-2 business days.
              </p>
            </div>
            <div className="w-full max-w-md bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    AMOUNT
                  </span>
                  <span className="text-[20px] font-semibold tabular-nums text-[#101010]">
                    {formatUsd(Number(amount || 0))}
                  </span>
                </div>
                <div className="border-t border-[#101010]/10 pt-3 space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#101010]/60">Destination</span>
                    <span className="text-[#101010]">
                      {destinationType === 'ach'
                        ? 'USD Bank Account'
                        : destinationType === 'iban'
                          ? 'EUR Bank Account'
                          : 'External Account'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#101010]/60">Reference</span>
                    <span className="font-mono text-[12px] text-[#101010]">
                      DEMO-{Date.now()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#101010]/60">Status</span>
                    <span className="text-green-600 font-medium">
                      Processing
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={handleReset}
              className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 text-[14px] font-medium transition-all"
            >
              Make Another Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="bg-white">
        <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            PROCESSING
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#1B29FF]/20 rounded-full animate-ping" />
              <div className="relative bg-[#1B29FF]/10 rounded-full p-4">
                <Loader2 className="h-8 w-8 text-[#1B29FF] animate-spin" />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-[24px] sm:text-[28px] font-semibold tracking-[-0.01em] text-[#101010]">
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
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
          MOVE FUNDS
        </p>
        <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
          Transfer to bank account
        </h2>
      </div>
      <div className="p-5 sm:p-6 space-y-5">
        <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-4 sm:p-5">
          <Label
            htmlFor="demo-amount"
            className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block"
          >
            TRANSFER AMOUNT
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#101010]/40" />
            <Input
              id="demo-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-10 text-[20px] font-semibold tabular-nums h-12 border-[#101010]/10 bg-white"
              placeholder="0.00"
            />
          </div>
          <div className="mt-3 flex justify-between text-[12px]">
            <span className="text-[#101010]/60">Available balance</span>
            <span className="font-medium tabular-nums text-[#101010]">
              {formatUsd(2500000)}
            </span>
          </div>
        </div>

        <div>
          <Label className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block">
            SELECT DESTINATION
          </Label>
          <RadioGroup
            value={destinationType}
            onValueChange={(value: 'ach' | 'iban' | 'external') =>
              setDestinationType(value)
            }
            className="space-y-3"
          >
            {achAccount && (
              <label
                htmlFor="demo-ach"
                className="flex items-start gap-3 bg-white border border-[#101010]/10 rounded-[12px] p-4 hover:bg-[#F7F7F2]/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="ach" id="demo-ach" className="mt-1" />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#101010]">
                        USD Bank Account
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        {achAccount.sourceBankName} • ****
                        {achAccount.sourceAccountNumber?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      ACH
                    </p>
                    <p className="text-[12px] text-[#101010]/60">1-2 days</p>
                  </div>
                </div>
              </label>
            )}

            {ibanAccount && (
              <label
                htmlFor="demo-iban"
                className="flex items-start gap-3 bg-white border border-[#101010]/10 rounded-[12px] p-4 hover:bg-[#F7F7F2]/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value="iban" id="demo-iban" className="mt-1" />
                <div className="flex-1 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <Euro className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#101010]">
                        EUR Bank Account
                      </p>
                      <p className="text-[12px] text-[#101010]/60">
                        {ibanAccount.sourceBankName} •{' '}
                        {ibanAccount.sourceIban?.slice(0, 4)}****
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                      SEPA
                    </p>
                    <p className="text-[12px] text-[#101010]/60">1-2 days</p>
                  </div>
                </div>
              </label>
            )}

            <label
              htmlFor="demo-external"
              className="flex items-start gap-3 bg-white border border-[#101010]/10 rounded-[12px] p-4 hover:bg-[#F7F7F2]/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem
                value="external"
                id="demo-external"
                className="mt-1"
              />
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#101010]">
                      External Account
                    </p>
                    <p className="text-[12px] text-[#101010]/60">
                      Send to any bank account
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60">
                    WIRE
                  </p>
                  <p className="text-[12px] text-[#101010]/60">Same day</p>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>

        <div className="bg-[#FFF8E6] border border-[#FFA500]/20 rounded-[12px] p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#101010]/60">Transfer amount</span>
              <span className="tabular-nums text-[#101010]">
                {formatUsd(Number(amount || 0))}
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#101010]/60">Processing fee</span>
              <span className="tabular-nums text-[#101010]">$0.00</span>
            </div>
            <div className="border-t border-[#FFA500]/20 pt-2 flex justify-between">
              <span className="text-[13px] font-medium text-[#101010]">
                Total to receive
              </span>
              <span className="text-[18px] font-semibold tabular-nums text-[#101010]">
                {formatUsd(Number(amount || 0))}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-[#101010]/40 uppercase tracking-[0.14em]">
          Demo Mode • No actual funds will be transferred
        </div>

        <Button
          onClick={handleTransfer}
          disabled={!amount || Number(amount) <= 0}
          className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-medium transition-all"
        >
          <span>Initiate Transfer</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function SimplifiedOffRamp(props: SimplifiedOffRampProps) {
  const { mode = 'real', ...rest } = props;

  if (mode === 'demo') {
    return <SimplifiedOffRampDemo {...rest} />;
  }

  return <SimplifiedOffRampReal {...rest} />;
}

interface AlignTransferCreatedResponse {
  alignTransferId: string;
  depositAmount: string;
  fee: string;
  depositNetwork: string;
  status: string;
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
}

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

function buildPrevalidatedSig(owner: Address): Hex {
  return `0x000000000000000000000000${owner.slice(
    2,
  )}000000000000000000000000000000000000000000000000000000000000000001` as Hex;
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
  maxBalance?: number;
}

type SimplifiedOffRampInnerProps = Omit<SimplifiedOffRampProps, 'mode'>;

function SimplifiedOffRampReal({
  fundingSources,
  prefillFromInvoice,
  defaultValues,
  maxBalance,
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
  const [userOpHash, setUserOpHash] = useState<string | null>(null);
  const [primarySafeAddress, setPrimarySafeAddress] = useState<Address | null>(
    null,
  );
  const [cryptoTxHash, setCryptoTxHash] = useState<string | null>(null);

  const { client: smartClient } = useSmartWallets();
  const { isTechnical } = useBimodal();

  const { data: fetchedPrimarySafeAddress, isLoading: isLoadingSafeAddress } =
    api.settings.userSafes.getPrimarySafeAddress.useQuery();

  const { ready: isRelayReady, send: sendWithRelay } = useSafeRelay(
    primarySafeAddress || undefined,
  );

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
  const shouldDefaultToCrypto = isTechnical && (!ibanAccount || !achAccount);

  const mergedDefaultValues: Partial<OffRampFormValues> = {
    destinationType: shouldDefaultToCrypto ? 'crypto' : 'ach',
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
  const cryptoAsset = watch('cryptoAsset') || 'usdc';

  // Helper to get the balance for the selected crypto asset
  const getSelectedAssetBalance = (): string | null => {
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
  };

  const selectedAssetConfig = CRYPTO_ASSETS[cryptoAsset];

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

  const createTransferMutation = api.align.createOfframpTransfer.useMutation({
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

  const isSubmittingTransfer = isLoading || createTransferMutation.isPending;

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
      setCurrentStep(2);
      toast.success(`${assetConfig.symbol} transfer completed successfully!`);
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send ${assetConfig.symbol} transfer: ${errMsg}`);
      toast.error(`${assetConfig.symbol} transfer failed`, {
        description: errMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateSubmit = async (values: OffRampFormValues) => {
    setError(null);

    if (values.destinationType === 'crypto') {
      await handleCryptoTransfer(values);
      return;
    }

    const submissionPayload: CreateOfframpTransferInput = {
      type: 'manual',
      amount: values.amount,
      sourceToken: 'usdc',
      sourceNetwork: 'base',
      destinationCurrency: values.destinationType === 'ach' ? 'usd' : 'eur',
      destinationPaymentRails:
        values.destinationType === 'ach' ? 'ach' : 'sepa',
      destinationSelection: '--manual--',
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
    };

    await createTransferMutation.mutateAsync(submissionPayload);
  };

  const handleSendFunds = async () => {
    if (!transferDetails || !primarySafeAddress || !smartClient?.account) {
      toast.error('Required information is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const { alignTransferId } = transferDetails;

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
      completeTransferMutation.mutate({
        alignTransferId,
        depositTransactionHash: txResponse,
      });
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send funds: ${errMsg}`);
      setIsLoading(false);
    }
  };

  if (isLoadingSafeAddress) {
    return (
      <div className="bg-white flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B29FF]" />
      </div>
    );
  }

  if (!primarySafeAddress) {
    return (
      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5 sm:p-6">
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

  // Success State
  if (currentStep === 2) {
    return (
      <div className="bg-white">
        <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            TRANSFER COMPLETE
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
              <CheckCircle2 className="relative h-12 w-12 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.01em] text-[#101010]">
                Transfer processing
              </h3>
              <p className="text-[14px] text-[#101010]/65 max-w-md">
                {cryptoTxHash
                  ? 'Your crypto transfer has been completed successfully.'
                  : 'Your funds are on their way to your bank account.'}
              </p>
            </div>
            {(userOpHash || cryptoTxHash) && (
              <a
                href={`https://basescan.org/tx/${userOpHash || cryptoTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#1B29FF] hover:text-[#1420CC] underline underline-offset-2"
              >
                Transaction Ref: {(userOpHash || cryptoTxHash)?.slice(0, 10)}...
              </a>
            )}
            <Button
              onClick={() => {
                setCurrentStep(0);
                setCryptoTxHash(null);
                setUserOpHash(null);
                setFormStep(1);
              }}
              className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 text-[14px] font-medium"
            >
              Start Another Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation State
  if (currentStep === 1) {
    return (
      <div className="bg-white">
        <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
          <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
            CONFIRM TRANSFER
          </p>
          <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
            Review transfer details
          </h2>
        </div>
        <div className="p-5 sm:p-6 space-y-5">
          <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  AMOUNT TO SEND
                </span>
                <span className="text-[24px] font-semibold tabular-nums text-[#101010]">
                  {transferDetails?.depositAmount} USDC
                </span>
              </div>
              <div className="border-t border-[#101010]/10 pt-3 space-y-2">
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">Processing Fee</span>
                  <span className="tabular-nums text-[#101010]">
                    {transferDetails?.fee} USDC
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-[#101010]/60">Network</span>
                  <span className="text-[#101010]">
                    {transferDetails?.depositNetwork.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleSendFunds}
            disabled={isLoading}
            className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-medium transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              <>
                Confirm & Send
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
        {prefillFromInvoice && (
          <div className="mb-4 bg-[#FFF8E6] border border-[#FFA500]/20 rounded-[12px] p-3">
            <div className="flex items-start gap-3">
              <Receipt className="h-5 w-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
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
        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
          STEP {formStep} OF 3
        </p>
        <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
          {formStep === 1
            ? 'Select Transfer Method'
            : formStep === 2
              ? 'Enter Transfer Details'
              : 'Review and Confirm'}
        </h2>
        <div className="mt-3 h-1 bg-[#101010]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B29FF] transition-all duration-500"
            style={{ width: `${(formStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="p-5 sm:p-6">
        <form
          onSubmit={handleSubmit(handleInitiateSubmit)}
          className="space-y-5"
        >
          {/* Step 1: Transfer Method */}
          {formStep === 1 && (
            <div className="space-y-5">
              <div>
                <Label className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block">
                  SELECT DESTINATION
                </Label>
                <Controller
                  control={control}
                  name="destinationType"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={
                        !ibanAccount || !achAccount ? 'crypto' : field.value
                      }
                      className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                    >
                      <label
                        htmlFor="ach"
                        className={cn(
                          'relative flex flex-col items-center justify-center bg-white border-2 rounded-[12px] p-4 sm:p-6 cursor-pointer transition-all',
                          destinationType === 'ach'
                            ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                            : 'border-[#101010]/10 hover:bg-[#F7F7F2]/50',
                          !achAccount && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        <RadioGroupItem
                          value="ach"
                          id="ach"
                          className="sr-only"
                          disabled={!achAccount}
                        />
                        <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
                          <DollarSign
                            className={cn(
                              'h-6 w-6',
                              destinationType === 'ach'
                                ? 'text-green-600'
                                : 'text-green-400',
                            )}
                          />
                        </div>
                        <span className="font-medium text-[14px] text-[#101010]">
                          US Bank
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mt-1">
                          ACH Transfer
                        </span>
                        {destinationType === 'ach' && (
                          <Check className="absolute top-3 right-3 h-5 w-5 text-[#1B29FF]" />
                        )}
                      </label>

                      <label
                        htmlFor="iban"
                        className={cn(
                          'relative flex flex-col items-center justify-center bg-white border-2 rounded-[12px] p-4 sm:p-6 cursor-pointer transition-all',
                          destinationType === 'iban'
                            ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                            : 'border-[#101010]/10 hover:bg-[#F7F7F2]/50',
                          !ibanAccount && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        <RadioGroupItem
                          value="iban"
                          id="iban"
                          className="sr-only"
                          disabled={!ibanAccount}
                        />
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                          <Euro
                            className={cn(
                              'h-6 w-6',
                              destinationType === 'iban'
                                ? 'text-blue-600'
                                : 'text-blue-400',
                            )}
                          />
                        </div>
                        <span className="font-medium text-[14px] text-[#101010]">
                          EU Bank
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mt-1">
                          SEPA Transfer
                        </span>
                        {destinationType === 'iban' && (
                          <Check className="absolute top-3 right-3 h-5 w-5 text-[#1B29FF]" />
                        )}
                      </label>

                      {/* Crypto option - only visible in technical mode */}
                      {isTechnical && (
                        <label
                          htmlFor="crypto"
                          className={cn(
                            'relative flex flex-col items-center justify-center border-2 rounded-sm p-4 sm:p-6 cursor-pointer transition-all overflow-hidden',
                            destinationType === 'crypto'
                              ? 'border-[#1B29FF] bg-white'
                              : 'border-[#1B29FF]/20 hover:border-[#1B29FF]/40 bg-white',
                          )}
                        >
                          {/* Blueprint grid for technical mode */}
                          <BlueprintGrid className="opacity-50" />

                          {/* Crosshairs */}
                          {destinationType === 'crypto' && (
                            <>
                              <Crosshairs position="top-left" />
                              <Crosshairs position="top-right" />
                            </>
                          )}

                          <RadioGroupItem
                            value="crypto"
                            id="crypto"
                            className="sr-only"
                          />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#1B29FF]/10 rounded-sm flex items-center justify-center mb-3">
                              <Coins
                                className={cn(
                                  'h-6 w-6',
                                  destinationType === 'crypto'
                                    ? 'text-[#1B29FF]'
                                    : 'text-[#1B29FF]/60',
                                )}
                              />
                            </div>
                            <span className="font-mono font-medium text-[14px] text-[#101010]">
                              Crypto
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#1B29FF] mt-1">
                              MULTI_ASSET
                            </span>
                          </div>
                          {destinationType === 'crypto' && (
                            <Check className="absolute top-3 right-3 h-5 w-5 text-[#1B29FF] z-10" />
                          )}
                        </label>
                      )}
                    </RadioGroup>
                  )}
                />
                {errors.destinationType && (
                  <p className="text-[12px] text-red-500 mt-2">
                    {errors.destinationType.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!destinationType}
                className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-medium transition-all"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Bank Transfer Details */}
          {formStep === 2 && destinationType !== 'crypto' && (
            <div className="space-y-5">
              {/* Amount Input */}
              <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-4 sm:p-5">
                <Label
                  htmlFor="amount"
                  className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block"
                >
                  TRANSFER AMOUNT
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#101010]/40" />
                  <Input
                    id="amount"
                    {...register('amount', {
                      required: 'Amount is required',
                      validate: (value) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num <= 0)
                          return 'Please enter a valid positive amount.';
                        const availableBalance =
                          maxBalance !== undefined
                            ? maxBalance
                            : usdcBalance
                              ? parseFloat(usdcBalance)
                              : null;
                        if (availableBalance !== null && num > availableBalance)
                          return 'Amount exceeds your available balance.';
                        return true;
                      },
                    })}
                    placeholder="0.00"
                    className="pl-10 text-[20px] font-semibold tabular-nums h-12 border-[#101010]/10 bg-white"
                  />
                  {isLoadingBalance ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-[#101010]/40" />
                    </div>
                  ) : (
                    (maxBalance !== undefined ? maxBalance : usdcBalance) !==
                      null && (
                      <button
                        type="button"
                        onClick={() => {
                          const balance =
                            maxBalance !== undefined
                              ? maxBalance.toString()
                              : usdcBalance;
                          if (balance) {
                            setValue('amount', balance, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[12px] text-[#1B29FF] hover:text-[#1420CC]"
                      >
                        Max:{' '}
                        {maxBalance !== undefined
                          ? maxBalance.toFixed(2)
                          : parseFloat(usdcBalance || '0').toFixed(4)}
                      </button>
                    )
                  )}
                </div>
                <div className="mt-3 flex justify-between text-[12px]">
                  <span className="text-[#101010]/60">Available balance</span>
                  <span className="font-medium tabular-nums text-[#101010]">
                    {maxBalance !== undefined
                      ? formatUsd(maxBalance)
                      : usdcBalance
                        ? `${parseFloat(usdcBalance).toFixed(2)} USDC`
                        : '—'}
                  </span>
                </div>
                {errors.amount && (
                  <p className="text-[12px] text-red-500 mt-2">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Account Details Card */}
              <div className="bg-white border border-[#101010]/10 rounded-[12px] p-4 sm:p-5 space-y-4">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  ACCOUNT DETAILS
                </p>

                {/* Account Holder Type */}
                <div>
                  <Label className="text-[13px] font-medium text-[#101010] mb-2 block">
                    Account Holder Type
                  </Label>
                  <Controller
                    control={control}
                    name="accountHolderType"
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-3"
                      >
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="individual" id="individual" />
                          <span className="text-[13px] text-[#101010]">
                            Individual
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <RadioGroupItem value="business" id="business" />
                          <span className="text-[13px] text-[#101010]">
                            Business
                          </span>
                        </label>
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* Name Fields */}
                {accountHolderType === 'individual' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="accountHolderFirstName"
                        className="text-[13px] font-medium text-[#101010] mb-1 block"
                      >
                        First Name
                      </Label>
                      <Input
                        id="accountHolderFirstName"
                        {...register('accountHolderFirstName', {
                          required: 'First name is required',
                        })}
                        placeholder="John"
                        className="h-10 border-[#101010]/10"
                      />
                      {errors.accountHolderFirstName && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.accountHolderFirstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="accountHolderLastName"
                        className="text-[13px] font-medium text-[#101010] mb-1 block"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="accountHolderLastName"
                        {...register('accountHolderLastName', {
                          required: 'Last name is required',
                        })}
                        placeholder="Doe"
                        className="h-10 border-[#101010]/10"
                      />
                      {errors.accountHolderLastName && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.accountHolderLastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {accountHolderType === 'business' && (
                  <div>
                    <Label
                      htmlFor="accountHolderBusinessName"
                      className="text-[13px] font-medium text-[#101010] mb-1 block"
                    >
                      Business Name
                    </Label>
                    <Input
                      id="accountHolderBusinessName"
                      {...register('accountHolderBusinessName', {
                        required: 'Business name is required',
                      })}
                      placeholder="Acme Corp"
                      className="h-10 border-[#101010]/10"
                    />
                    {errors.accountHolderBusinessName && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.accountHolderBusinessName.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Bank Name */}
                <div>
                  <Label
                    htmlFor="bankName"
                    className="text-[13px] font-medium text-[#101010] mb-1 block"
                  >
                    Bank Name
                  </Label>
                  <Input
                    id="bankName"
                    {...register('bankName', {
                      required: 'Bank name is required',
                    })}
                    placeholder="Chase Bank"
                    className="h-10 border-[#101010]/10"
                  />
                  {errors.bankName && (
                    <p className="text-[11px] text-red-500 mt-1">
                      {errors.bankName.message}
                    </p>
                  )}
                </div>

                {/* Account Numbers */}
                {destinationType === 'ach' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label
                        htmlFor="accountNumber"
                        className="text-[13px] font-medium text-[#101010] mb-1 block"
                      >
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        {...register('accountNumber', {
                          required: 'Account number is required',
                        })}
                        placeholder="123456789"
                        className="h-10 border-[#101010]/10"
                      />
                      {errors.accountNumber && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.accountNumber.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="routingNumber"
                        className="text-[13px] font-medium text-[#101010] mb-1 block"
                      >
                        Routing Number
                      </Label>
                      <Input
                        id="routingNumber"
                        {...register('routingNumber', {
                          required: 'Routing number is required',
                        })}
                        placeholder="021000021"
                        className="h-10 border-[#101010]/10"
                      />
                      {errors.routingNumber && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.routingNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {destinationType === 'iban' && (
                  <div className="space-y-3">
                    <div>
                      <Label
                        htmlFor="iban"
                        className="text-[13px] font-medium text-[#101010] mb-1 block"
                      >
                        IBAN
                      </Label>
                      <Input
                        id="iban"
                        {...register('iban', { required: 'IBAN is required' })}
                        placeholder="DE89370400440532013000"
                        className="h-10 border-[#101010]/10 font-mono text-[12px]"
                      />
                      {errors.iban && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.iban.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label
                        htmlFor="bic"
                        className="text-[13px] font-medium text-[#101010] mb-1 block"
                      >
                        BIC/SWIFT
                      </Label>
                      <Input
                        id="bic"
                        {...register('bic', {
                          required: 'BIC/SWIFT is required',
                        })}
                        placeholder="COBADEFFXXX"
                        className="h-10 border-[#101010]/10 font-mono text-[12px]"
                      />
                      {errors.bic && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {errors.bic.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Address Details */}
              <div className="bg-white border border-[#101010]/10 rounded-[12px] p-4 sm:p-5 space-y-4">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  BENEFICIARY ADDRESS
                </p>

                <Input
                  id="streetLine1"
                  placeholder="Street address"
                  {...register('streetLine1', {
                    required: 'Street address is required',
                  })}
                  className="h-10 border-[#101010]/10"
                />
                {errors.streetLine1 && (
                  <p className="text-[11px] text-red-500 -mt-2">
                    {errors.streetLine1.message}
                  </p>
                )}

                <Input
                  id="streetLine2"
                  placeholder="Apartment, suite, etc. (optional)"
                  {...register('streetLine2')}
                  className="h-10 border-[#101010]/10"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      id="city"
                      placeholder="City"
                      {...register('city', { required: 'City is required' })}
                      className="h-10 border-[#101010]/10"
                    />
                    {errors.city && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      id="postalCode"
                      placeholder="ZIP / Postal Code"
                      {...register('postalCode', {
                        required: 'Postal code is required',
                      })}
                      className="h-10 border-[#101010]/10"
                    />
                    {errors.postalCode && (
                      <p className="text-[11px] text-red-500 mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <Controller
                  control={control}
                  name="country"
                  rules={{ required: 'Country is required' }}
                  render={({ field }) => (
                    <Combobox
                      options={COUNTRIES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select country..."
                      searchPlaceholder="Search countries..."
                      emptyPlaceholder="No country found."
                      triggerClassName="h-10 border-[#101010]/10"
                    />
                  )}
                />
                {errors.country && (
                  <p className="text-[11px] text-red-500 -mt-2">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1 h-11 border-[#101010]/10 hover:bg-[#F7F7F2]/50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white h-11 text-[14px] font-medium"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Crypto Transfer - Technical/Blueprint Mode */}
          {formStep === 2 && destinationType === 'crypto' && (
            <div className="space-y-5">
              {/* Asset Selection - Blueprint Style */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-sm overflow-hidden">
                <BlueprintGrid className="opacity-30" />
                <Crosshairs position="top-left" />
                <Crosshairs position="top-right" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex justify-between items-center px-4 py-2 border-b border-[#1B29FF]/10 bg-[#F7F7F2]/50">
                    <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                      SELECT_ASSET
                    </span>
                    <span className="font-mono text-[10px] text-[#101010]/50">
                      CHAIN::BASE
                    </span>
                  </div>

                  {/* Asset Grid */}
                  <div className="p-4">
                    <Controller
                      control={control}
                      name="cryptoAsset"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || 'usdc'}
                          className="grid grid-cols-3 gap-3"
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
                                htmlFor={`asset-${key}`}
                                className={cn(
                                  'relative flex flex-col items-center justify-center border rounded-sm p-3 cursor-pointer transition-all',
                                  isSelected
                                    ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                                    : 'border-[#1B29FF]/20 hover:border-[#1B29FF]/40 bg-white',
                                )}
                              >
                                <RadioGroupItem
                                  value={key}
                                  id={`asset-${key}`}
                                  className="sr-only"
                                />
                                <span className="text-xl mb-1">
                                  {asset.icon}
                                </span>
                                <span className="font-mono text-[12px] font-medium text-[#101010]">
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
              </div>

              {/* Amount Input - Blueprint Style */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-sm overflow-hidden">
                <BlueprintGrid className="opacity-30" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-[#1B29FF]/10 bg-[#F7F7F2]/50">
                    <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                      AMOUNT::{selectedAssetConfig.symbol}
                    </span>
                    <span className="font-mono text-[10px] text-[#101010]/50">
                      DECIMALS::{selectedAssetConfig.decimals}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[12px] text-[#1B29FF] pointer-events-none z-10 bg-white pr-1">
                        {selectedAssetConfig.symbol}
                      </span>
                      <Input
                        id="amount"
                        {...register('amount', {
                          required: 'Amount is required',
                          validate: (value) => {
                            const num = parseFloat(value);
                            if (isNaN(num) || num <= 0)
                              return 'Please enter a valid positive amount.';
                            const availableBalance = getSelectedAssetBalance();
                            if (
                              availableBalance !== null &&
                              num > parseFloat(availableBalance)
                            )
                              return 'Amount exceeds your available balance.';
                            return true;
                          },
                        })}
                        placeholder="0.00"
                        className="pl-14 pr-24 text-[20px] font-mono font-semibold tabular-nums h-12 border-[#1B29FF]/20 bg-white rounded-sm"
                      />
                      {getSelectedAssetBalance() !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            const balance = getSelectedAssetBalance();
                            if (balance) {
                              setValue('amount', balance, {
                                shouldValidate: true,
                              });
                            }
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center font-mono text-[10px] text-[#1B29FF] hover:text-[#1420CC] bg-white pl-1"
                        >
                          MAX::
                          {parseFloat(getSelectedAssetBalance() || '0').toFixed(
                            2,
                          )}
                        </button>
                      )}
                    </div>
                    {errors.amount && (
                      <p className="font-mono text-[11px] text-red-500 mt-2">
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recipient Address - Blueprint Style */}
              <div className="relative bg-white border border-[#1B29FF]/20 rounded-sm overflow-hidden">
                <BlueprintGrid className="opacity-30" />

                <div className="relative z-10">
                  <div className="flex justify-between items-center px-4 py-2 border-b border-[#1B29FF]/10 bg-[#F7F7F2]/50">
                    <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                      DESTINATION_ADDRESS
                    </span>
                    <span className="font-mono text-[10px] text-[#101010]/50">
                      FORMAT::EVM
                    </span>
                  </div>

                  <div className="p-4">
                    <Input
                      id="cryptoAddress"
                      {...register('cryptoAddress', {
                        required: 'Recipient address is required.',
                        validate: (value) =>
                          (value && isAddress(value as string)) ||
                          'Invalid wallet address format.',
                      })}
                      placeholder="0x..."
                      className="h-12 border-[#1B29FF]/20 font-mono text-[13px] rounded-sm"
                    />
                    {errors.cryptoAddress && (
                      <p className="font-mono text-[11px] text-red-500 mt-2">
                        {errors.cryptoAddress.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1 h-11 border-[#1B29FF]/20 hover:bg-[#1B29FF]/5 font-mono rounded-sm"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  BACK
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white h-11 text-[14px] font-mono font-medium rounded-sm"
                >
                  CONTINUE
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {formStep === 3 && (
            <div className="relative">
              {isSubmittingTransfer && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[12px] bg-white/85 backdrop-blur-sm">
                  <Loader2 className="h-5 w-5 animate-spin text-[#1B29FF]" />
                  <p className="text-[13px] text-[#101010]/70">
                    {isLoading ? loadingMessage : 'Submitting transfer...'}
                  </p>
                </div>
              )}

              <div
                className={cn(
                  'space-y-5',
                  isSubmittingTransfer && 'pointer-events-none opacity-40',
                )}
              >
                <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-5">
                  <p className="uppercase tracking-[0.12em] text-[11px] text-[#101010]/60 mb-4">
                    Transfer summary
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          'text-[13px] text-[#101010]/60',
                          destinationType === 'crypto' &&
                            'font-mono text-[11px]',
                        )}
                      >
                        {destinationType === 'crypto' ? 'TYPE' : 'Type'}
                      </span>
                      <span
                        className={cn(
                          'text-[13px] font-medium text-[#101010]',
                          destinationType === 'crypto' && 'font-mono',
                        )}
                      >
                        {destinationType === 'ach'
                          ? 'ACH transfer'
                          : destinationType === 'iban'
                            ? 'SEPA transfer'
                            : `${selectedAssetConfig.symbol} Transfer`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          'text-[13px] text-[#101010]/60',
                          destinationType === 'crypto' &&
                            'font-mono text-[11px]',
                        )}
                      >
                        {destinationType === 'crypto' ? 'AMOUNT' : 'Amount'}
                      </span>
                      <span
                        className={cn(
                          'text-[18px] font-semibold tabular-nums text-[#101010]',
                          destinationType === 'crypto' && 'font-mono',
                        )}
                      >
                        {watch('amount')}{' '}
                        {destinationType === 'crypto'
                          ? selectedAssetConfig.symbol
                          : 'USDC'}
                      </span>
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

                <Alert className="bg-[#FFF8E6] border-[#FFA500]/20">
                  <AlertCircle className="h-4 w-4 text-[#FFA500]" />
                  <AlertDescription className="text-[12px] text-[#101010]/70">
                    {destinationType === 'crypto'
                      ? 'Crypto transfers are irreversible. Please verify the address carefully.'
                      : 'Bank transfers typically process within 1-3 business days.'}
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    disabled={isSubmittingTransfer}
                    className="flex-1 h-11 border-[#101010]/10 hover:bg-[#F7F7F2]/50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingTransfer}
                    className="flex-1 bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-semibold"
                  >
                    {isSubmittingTransfer ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isLoading ? loadingMessage : 'Processing…'}
                      </>
                    ) : (
                      <>
                        Complete transfer
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
