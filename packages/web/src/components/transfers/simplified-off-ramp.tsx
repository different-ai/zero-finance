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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe from '@safe-global/protocol-kit';
import { type Hex } from 'viem';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { SAFE_ABI } from '@/lib/sponsor-tx/core';
import { Progress } from '@/components/ui/progress';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { USDC_ADDRESS } from '@/lib/constants';
import { Combobox, type ComboboxOption } from '@/components/ui/combo-box';

// --- Types and Schemas ---

// Define types locally instead of importing from tRPC
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
}

// Simplified type definition for the form
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

// Country list for dropdown
const COUNTRIES: ComboboxOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'IE', label: 'Ireland' },
  // European countries
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'HR', label: 'Croatia' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'DK', label: 'Denmark' },
  { value: 'EE', label: 'Estonia' },
  { value: 'FI', label: 'Finland' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'GR', label: 'Greece' },
  { value: 'HU', label: 'Hungary' },
  { value: 'IS', label: 'Iceland' },
  { value: 'IT', label: 'Italy' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LU', label: 'Luxembourg' },
  { value: 'MT', label: 'Malta' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'NO', label: 'Norway' },
  { value: 'PL', label: 'Poland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'RO', label: 'Romania' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'ES', label: 'Spain' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  // Asian countries
  { value: 'CN', label: 'China' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'IN', label: 'India' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'IL', label: 'Israel' },
  { value: 'JP', label: 'Japan' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'SG', label: 'Singapore' },
  { value: 'KR', label: 'South Korea' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'TH', label: 'Thailand' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'VN', label: 'Vietnam' },
  // Latin American countries
  { value: 'AR', label: 'Argentina' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'HN', label: 'Honduras' },
  { value: 'MX', label: 'Mexico' },
  { value: 'PA', label: 'Panama' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'PE', label: 'Peru' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'VE', label: 'Venezuela' },
  // African countries
  { value: 'EG', label: 'Egypt' },
  { value: 'KE', label: 'Kenya' },
  { value: 'MA', label: 'Morocco' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'ZA', label: 'South Africa' },
  // Other countries
  { value: 'RU', label: 'Russia' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'UA', label: 'Ukraine' },
].sort((a, b) => a.label.localeCompare(b.label));

// Helper function to build pre-validated signature for Safe
function buildPrevalidatedSig(owner: Address): Hex {
  return `0x000000000000000000000000${owner.slice(
    2,
  )}000000000000000000000000000000000000000000000000000000000000000001` as Hex;
}

// Type for funding sources from tRPC
type FundingSource = {
  id: string;
  accountType: 'us_ach' | 'iban' | 'uk_details' | 'other';
  currency: string | null;
  bankName: string | null;
  beneficiaryName: string | null;
  accountHolder: string | null;
  accountNumber: string | null;
  routingNumber: string | null;
  iban: string | null;
  bic: string | null;
};

interface SimplifiedOffRampProps {
  fundingSources: FundingSource[] | UserFundingSourceDisplayData[];
  defaultValues?: Partial<OffRampFormValues>;
  prefillFromInvoice?: {
    amount?: string;
    currency?: string;
    vendorName?: string | null;
    description?: string | null;
  };
}

export function SimplifiedOffRamp({
  fundingSources,
  prefillFromInvoice,
  defaultValues,
}: SimplifiedOffRampProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formStep, setFormStep] = useState(1); // 1: Transfer Type, 2: Amount & Details, 3: Confirm
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [transferDetails, setTransferDetails] =
    useState<AlignTransferCreatedResponse | null>(null);
  const [userOpHash, setUserOpHash] = useState<string | null>(null);
  const [primarySafeAddress, setPrimarySafeAddress] = useState<Address | null>(
    null,
  );
  const [cryptoTxHash, setCryptoTxHash] = useState<string | null>(null);

  const { client: smartClient } = useSmartWallets();

  const { data: fetchedPrimarySafeAddress, isLoading: isLoadingSafeAddress } =
    api.settings.userSafes.getPrimarySafeAddress.useQuery();

  const { ready: isRelayReady, send: sendWithRelay } = useSafeRelay(
    primarySafeAddress || undefined,
  );
  // Find bank account details from funding sources - handle both types
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

  // Create merged default values
  const mergedDefaultValues: Partial<OffRampFormValues> = {
    destinationType: !ibanAccount || !achAccount ? 'crypto' : 'ach',
    accountHolderType: 'individual',
    country: 'US', // Default to US with ISO code
    city: '',
    streetLine1: '',
    streetLine2: '',
    postalCode: '',
    cryptoAddress: '',
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

  useEffect(() => {
    const fetchBalance = async () => {
      if (!primarySafeAddress) return;
      setIsLoadingBalance(true);
      try {
        const publicClient = createPublicClient({
          chain: base,
          transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
        });
        const balance = await publicClient.readContract({
          address: USDC_BASE_ADDRESS,
          abi: erc20AbiBalanceOf,
          functionName: 'balanceOf',
          args: [primarySafeAddress],
        });
        setUsdcBalance(formatUnits(balance as bigint, 6));
      } catch (err) {
        toast.error('Could not fetch USDC balance.');
      } finally {
        setIsLoadingBalance(false);
      }
    };
    fetchBalance();
  }, [primarySafeAddress]);

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

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof OffRampFormValues)[] = [];

    if (formStep === 1) {
      fieldsToValidate = ['destinationType'];
    } else if (formStep === 2) {
      fieldsToValidate = ['amount'];

      if (destinationType === 'crypto') {
        fieldsToValidate.push('cryptoAddress');
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

    setIsLoading(true);
    setError(null);
    setCryptoTxHash(null);

    try {
      setLoadingMessage('Preparing crypto transfer...');

      const valueInUnits = parseUnits(values.amount, 6);
      if (valueInUnits <= 0n) {
        throw new Error('Amount must be greater than 0.');
      }

      const transferData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [values.cryptoAddress as Address, valueInUnits],
      });

      const transactions: MetaTransactionData[] = [
        {
          to: USDC_BASE_ADDRESS,
          value: '0',
          data: transferData,
        },
      ];

      setLoadingMessage('Sending transaction...');
      const txHash = await sendWithRelay(transactions);
      setCryptoTxHash(txHash);
      setCurrentStep(2);
      toast.success('Crypto transfer completed successfully!');
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send crypto transfer: ${errMsg}`);
      toast.error('Crypto transfer failed', { description: errMsg });
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

    // Construct payload to match backend's expected schema
    const submissionPayload: CreateOfframpTransferInput = {
      type: 'manual',
      amount: values.amount,
      sourceToken: 'usdc',
      sourceNetwork: 'base',
      destinationCurrency: values.destinationType === 'ach' ? 'usd' : 'eur',
      destinationPaymentRails:
        values.destinationType === 'ach' ? 'ach' : 'sepa',
      destinationSelection: '--manual--', // Backend expects this field
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
      // ACH fields
      accountNumber: values.accountNumber,
      routingNumber: values.routingNumber,
      // IBAN fields
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
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!primarySafeAddress) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Primary Account Not Found</AlertTitle>
        <AlertDescription>
          We could not find your primary account. Please set it up in settings
          to proceed.
        </AlertDescription>
      </Alert>
    );
  }

  if (currentStep === 2) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="flex flex-col items-center gap-6 py-12 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <div>
            <h2 className="text-2xl font-semibold">Transfer Processing</h2>
            <p className="text-muted-foreground mt-2">
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
              className="text-xs text-muted-foreground hover:text-primary underline"
            >
              Transaction Ref: {(userOpHash || cryptoTxHash)?.slice(0, 10)}...
            </a>
          )}
          <Button
            onClick={() => {
              setCurrentStep(0);
              setCryptoTxHash(null);
              setUserOpHash(null);
            }}
            variant="outline"
          >
            Start another transfer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (currentStep === 1) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Confirm Transfer</CardTitle>
          <CardDescription>
            Review the details below and confirm to send the funds from your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-700">
                Amount to Send
              </span>
              <span className="text-lg font-bold text-blue-900">
                {transferDetails?.depositAmount} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-700">Fee</span>
              <span className="text-lg font-bold text-blue-900">
                {transferDetails?.fee} USDC
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-700">Network</span>
              <span className="text-lg font-bold text-blue-900">
                {transferDetails?.depositNetwork.toUpperCase()}
              </span>
            </div>
          </div>
          <Button
            onClick={handleSendFunds}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingMessage}
              </>
            ) : (
              'Confirm & Send'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader className="bg-gray-50 rounded-t-lg">
        {prefillFromInvoice && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Payment for Invoice
                </h3>
                <div className="mt-1 text-sm text-blue-700">
                  {prefillFromInvoice.vendorName && (
                    <p>Vendor: {prefillFromInvoice.vendorName}</p>
                  )}
                  {prefillFromInvoice.description && (
                    <p>Description: {prefillFromInvoice.description}</p>
                  )}
                  {prefillFromInvoice.amount && (
                    <p>
                      Amount: {prefillFromInvoice.amount}{' '}
                      {prefillFromInvoice.currency || 'USDC'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <CardDescription className="text-blue-700 text-lg font-medium">
          Step {formStep} of 3 -{' '}
          {formStep === 1
            ? 'Select Transfer Method'
            : formStep === 2
              ? 'Enter Amount and Details'
              : 'Review and Confirm'}
        </CardDescription>
        <Progress value={(formStep / 3) * 100} className="mt-2" />
      </CardHeader>
      <CardContent className="p-6 max-h-[70vh] overflow-y-auto">
        <form
          onSubmit={handleSubmit(handleInitiateSubmit)}
          className="space-y-6"
        >
          {/* Step 1: Transfer Method Selection */}
          {formStep === 1 && (
            <div className="space-y-6">
              {/* Destination Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Transfer Method
                </Label>
                <Controller
                  control={control}
                  name="destinationType"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      // if no iban or no ach, set crypto as default
                      //  the below doesn't seem to work why
                      value={
                        !ibanAccount || !achAccount ? 'crypto' : field.value
                      }
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
                    >
                      <div className="relative">
                        <RadioGroupItem
                          value="ach"
                          id="ach"
                          className="peer sr-only"
                          disabled={!achAccount}
                        />
                        <Label
                          htmlFor="ach"
                          className={cn(
                            'flex flex-col items-center justify-center rounded-xl border-2 p-4 sm:p-6 cursor-pointer transition-all duration-200',
                            'hover:bg-blue-50 hover:border-blue-300',
                            destinationType === 'ach'
                              ? 'bg-blue-100 border-blue-500 shadow-md'
                              : 'bg-white border-gray-200',
                          )}
                        >
                          <Banknote
                            className={cn(
                              'mb-3 h-8 w-8 transition-colors',
                              destinationType === 'ach'
                                ? 'text-blue-600'
                                : 'text-gray-400',
                            )}
                          />
                          <span
                            className={cn(
                              'font-medium transition-colors',
                              destinationType === 'ach'
                                ? 'text-blue-900'
                                : 'text-gray-600',
                            )}
                          >
                            US Bank
                          </span>
                          <span
                            className={cn(
                              'text-xs mt-1 transition-colors',
                              destinationType === 'ach'
                                ? 'text-blue-700'
                                : 'text-gray-400',
                            )}
                          >
                            ACH Transfer
                          </span>
                          {destinationType === 'ach' && (
                            <Check className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                          )}
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem
                          value="iban"
                          id="iban"
                          className="peer sr-only"
                          disabled={!ibanAccount}
                        />
                        <Label
                          htmlFor="iban"
                          className={cn(
                            'flex flex-col items-center justify-center rounded-xl border-2 p-4 sm:p-6 cursor-pointer transition-all duration-200',
                            'hover:bg-blue-50 hover:border-blue-300',
                            destinationType === 'iban'
                              ? 'bg-blue-100 border-blue-500 shadow-md'
                              : 'bg-white border-gray-200',
                          )}
                        >
                          <Globe
                            className={cn(
                              'mb-3 h-8 w-8 transition-colors',
                              destinationType === 'iban'
                                ? 'text-blue-600'
                                : 'text-gray-400',
                            )}
                          />
                          <span
                            className={cn(
                              'font-medium transition-colors',
                              destinationType === 'iban'
                                ? 'text-blue-900'
                                : 'text-gray-600',
                            )}
                          >
                            EU
                          </span>
                          <span
                            className={cn(
                              'text-xs mt-1 transition-colors',
                              destinationType === 'iban'
                                ? 'text-blue-700'
                                : 'text-gray-400',
                            )}
                          >
                            IBAN/SEPA
                          </span>
                          {destinationType === 'iban' && (
                            <Check className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                          )}
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem
                          value="crypto"
                          id="crypto"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="crypto"
                          className={cn(
                            'flex flex-col items-center justify-center rounded-xl border-2 p-4 sm:p-6 cursor-pointer transition-all duration-200',
                            'hover:bg-blue-50 hover:border-blue-300',
                            destinationType === 'crypto'
                              ? 'bg-blue-100 border-blue-500 shadow-md'
                              : 'bg-white border-gray-200',
                          )}
                        >
                          <Wallet
                            className={cn(
                              'mb-3 h-8 w-8 transition-colors',
                              destinationType === 'crypto'
                                ? 'text-blue-600'
                                : 'text-gray-400',
                            )}
                          />
                          <span
                            className={cn(
                              'font-medium transition-colors',
                              destinationType === 'crypto'
                                ? 'text-blue-900'
                                : 'text-gray-600',
                            )}
                          >
                            Crypto
                          </span>
                          <span
                            className={cn(
                              'text-xs mt-1 transition-colors',
                              destinationType === 'crypto'
                                ? 'text-blue-700'
                                : 'text-gray-400',
                            )}
                          >
                            USDC Transfer
                          </span>
                          {destinationType === 'crypto' && (
                            <Check className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                          )}
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.destinationType && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.destinationType.message}
                  </p>
                )}
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!destinationType}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                size="lg"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Account Details */}
          {formStep === 2 && destinationType !== 'crypto' && (
            <div className="space-y-6">
              {/* Amount */}
              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Amount (USDC)
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    {...register('amount', {
                      required: 'Amount is required',
                      validate: (value) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num <= 0)
                          return 'Please enter a valid positive amount.';
                        if (usdcBalance && num > parseFloat(usdcBalance))
                          return 'Amount exceeds your available balance.';
                        return true;
                      },
                    })}
                    placeholder="0.00"
                    className="border-2 focus:border-blue-500 focus:ring-blue-500/20 pr-32"
                  />
                  {isLoadingBalance ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    usdcBalance !== null && (
                      <button
                        type="button"
                        onClick={() =>
                          setValue('amount', usdcBalance, {
                            shouldValidate: true,
                          })
                        }
                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-xs text-blue-600 hover:text-blue-800"
                      >
                        Max: {parseFloat(usdcBalance).toFixed(4)}
                      </button>
                    )
                  )}
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              {/* Account Holder Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Account Holder Type
                </Label>
                <Controller
                  control={control}
                  name="accountHolderType"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">Individual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business">Business</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              {/* Account Holder Name */}
              {accountHolderType === 'individual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="accountHolderFirstName"
                      className="text-sm font-medium text-gray-700"
                    >
                      First Name
                    </Label>
                    <Input
                      id="accountHolderFirstName"
                      {...register('accountHolderFirstName', {
                        required: 'First name is required',
                      })}
                      placeholder="John"
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.accountHolderFirstName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.accountHolderFirstName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="accountHolderLastName"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="accountHolderLastName"
                      {...register('accountHolderLastName', {
                        required: 'Last name is required',
                      })}
                      placeholder="Doe"
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.accountHolderLastName && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.accountHolderLastName.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {accountHolderType === 'business' && (
                <div className="space-y-2">
                  <Label
                    htmlFor="accountHolderBusinessName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Business Name
                  </Label>
                  <Input
                    id="accountHolderBusinessName"
                    {...register('accountHolderBusinessName', {
                      required: 'Business name is required',
                    })}
                    placeholder="Acme Corp"
                    className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  {errors.accountHolderBusinessName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.accountHolderBusinessName.message}
                    </p>
                  )}
                </div>
              )}

              {/* Bank Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="bankName"
                  className="text-sm font-medium text-gray-700"
                >
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  {...register('bankName', {
                    required: 'Bank name is required',
                  })}
                  placeholder="Capital One"
                  required
                  className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.bankName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              {/* Account Details */}
              {destinationType === 'ach' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="accountNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Account Number
                    </Label>
                    <Input
                      id="accountNumber"
                      {...register('accountNumber', {
                        required: 'Account number is required',
                      })}
                      placeholder="123456789"
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.accountNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="routingNumber"
                      className="text-sm font-medium text-gray-700"
                    >
                      Routing Number
                    </Label>
                    <Input
                      id="routingNumber"
                      {...register('routingNumber', {
                        required: 'Routing number is required',
                      })}
                      placeholder="021000021"
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.routingNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.routingNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {destinationType === 'iban' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="iban"
                      className="text-sm font-medium text-gray-700"
                    >
                      IBAN
                    </Label>
                    <Input
                      id="iban"
                      {...register('iban', { required: 'IBAN is required' })}
                      placeholder="DE89370400440532013000"
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.iban && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.iban.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bic"
                      className="text-sm font-medium text-gray-700"
                    >
                      BIC/SWIFT
                    </Label>
                    <Input
                      id="bic"
                      {...register('bic', {
                        required: 'BIC/SWIFT is required',
                      })}
                      placeholder="COBADEFFXXX"
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.bic && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.bic.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Address Details */}
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm font-medium text-gray-700">
                  Beneficiary Address
                </Label>
                {/* Street line 1 */}
                <Input
                  id="streetLine1"
                  placeholder="123 Main St"
                  {...register('streetLine1', {
                    required: 'Street address is required',
                  })}
                  className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.streetLine1 && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.streetLine1.message}
                  </p>
                )}

                {/* Street line 2 (optional) */}
                <Input
                  id="streetLine2"
                  placeholder="Apartment, suite, etc. (optional)"
                  {...register('streetLine2')}
                  className="border-2 focus:border-blue-500 focus:ring-blue-500/20 mt-2"
                />

                {/* City & Postal in grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="city"
                      className="text-sm font-medium text-gray-700"
                    >
                      City
                    </Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      {...register('city', { required: 'City is required' })}
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor="postalCode"
                      className="text-sm font-medium text-gray-700"
                    >
                      Postal / ZIP
                    </Label>
                    <Input
                      id="postalCode"
                      placeholder="10001"
                      {...register('postalCode', {
                        required: 'Postal code is required',
                      })}
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.postalCode && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-1 mt-4">
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-gray-700"
                  >
                    Country
                  </Label>
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
                        triggerClassName="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    )}
                  />
                  {errors.country && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Crypto Transfer Details */}
          {formStep === 2 && destinationType === 'crypto' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-sm font-medium text-gray-700"
                >
                  Amount (USDC)
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    {...register('amount', {
                      required: 'Amount is required',
                      validate: (value) => {
                        const num = parseFloat(value);
                        if (isNaN(num) || num <= 0)
                          return 'Please enter a valid positive amount.';
                        if (usdcBalance && num > parseFloat(usdcBalance))
                          return 'Amount exceeds your available balance.';
                        return true;
                      },
                    })}
                    placeholder="0.00"
                    className="border-2 focus:border-blue-500 focus:ring-blue-500/20 pr-32"
                  />
                  {isLoadingBalance ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    usdcBalance !== null && (
                      <button
                        type="button"
                        onClick={() =>
                          setValue('amount', usdcBalance, {
                            shouldValidate: true,
                          })
                        }
                        className="absolute inset-y-0 right-0 pr-2 flex items-center text-xs text-blue-600 hover:text-blue-800"
                      >
                        Max: {parseFloat(usdcBalance).toFixed(4)}
                      </button>
                    )
                  )}
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cryptoAddress"
                  className="text-sm font-medium text-gray-700"
                >
                  Recipient Address (Base Network)
                </Label>
                <Input
                  id="cryptoAddress"
                  {...register('cryptoAddress', {
                    required: 'Recipient address is required.',
                    validate: (value) =>
                      (value && isAddress(value as string)) ||
                      'Invalid wallet address format.',
                  })}
                  placeholder="0x..."
                  className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                />
                {errors.cryptoAddress && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.cryptoAddress.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {formStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Review Transfer Details
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Transfer Type:
                    </span>
                    <span className="text-sm font-medium">
                      {destinationType === 'ach'
                        ? 'ACH Transfer'
                        : destinationType === 'iban'
                          ? 'IBAN Transfer'
                          : 'Crypto Transfer'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="text-sm font-medium">
                      {watch('amount')} USDC
                    </span>
                  </div>

                  {destinationType === 'ach' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Account Holder:
                        </span>
                        <span className="text-sm font-medium">
                          {accountHolderType === 'individual'
                            ? `${watch('accountHolderFirstName')} ${watch('accountHolderLastName')}`
                            : watch('accountHolderBusinessName')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Account Number:
                        </span>
                        <span className="text-sm font-medium font-mono">
                          ****{watch('accountNumber')?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Routing Number:
                        </span>
                        <span className="text-sm font-medium font-mono">
                          {watch('routingNumber')}
                        </span>
                      </div>
                    </>
                  )}

                  {destinationType === 'iban' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Account Holder:
                        </span>
                        <span className="text-sm font-medium">
                          {accountHolderType === 'individual'
                            ? `${watch('accountHolderFirstName')} ${watch('accountHolderLastName')}`
                            : watch('accountHolderBusinessName')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IBAN:</span>
                        <span className="text-sm font-medium font-mono">
                          {watch('iban')}
                        </span>
                      </div>
                      {watch('bic') && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            BIC/SWIFT:
                          </span>
                          <span className="text-sm font-medium font-mono">
                            {watch('bic')}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {destinationType === 'crypto' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Wallet Address:
                        </span>
                        <span className="text-sm font-medium font-mono">
                          {watch('cryptoAddress')?.slice(0, 6)}...
                          {watch('cryptoAddress')?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Network:</span>
                        <span className="text-sm font-medium">Base</span>
                      </div>
                    </>
                  )}

                  {destinationType !== 'crypto' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Address:</span>
                      <span className="text-sm font-medium">
                        {watch('streetLine1')}, {watch('city')},{' '}
                        {watch('postalCode')},{' '}
                        {COUNTRIES.find((c) => c.value === watch('country'))
                          ?.label || watch('country')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Transfer Information
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          {destinationType === 'crypto'
                            ? 'Your USDC will be sent directly to the specified wallet address. This transaction is irreversible.'
                            : `Your funds will be transferred to the specified ${destinationType.toUpperCase()} account. Processing time is typically 1-3 business days.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePreviousStep}
                  variant="outline"
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={createTransferMutation.isPending}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  size="lg"
                >
                  {createTransferMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                      Processing...
                    </>
                  ) : (
                    'Complete Transfer'
                  )}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Error display for all steps */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
