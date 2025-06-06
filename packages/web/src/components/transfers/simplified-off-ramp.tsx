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
  CircleDollarSign,
  ArrowRight,
  CheckCircle2,
  Banknote,
  Globe,
  Check,
} from 'lucide-react';
import type { RouterInputs, RouterOutputs } from '@/utils/trpc';
import { formatUnits, Address, createPublicClient, http, encodeFunctionData } from 'viem';
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

// --- Types and Schemas ---

type CreateOfframpTransferInput = RouterInputs['align']['createOfframpTransfer'];
type AlignTransferCreatedResponse =
  RouterOutputs['align']['createOfframpTransfer'];

// Simplified type definition without Zod
interface OffRampFormValues {
  amount: string;
  destinationType: 'ach' | 'iban';
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

const USDC_BASE_ADDRESS =
  '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address;

// Helper function to build pre-validated signature for Safe
function buildPrevalidatedSig(owner: Address): Hex {
  return `0x000000000000000000000000${owner.slice(
    2,
  )}000000000000000000000000000000000000000000000000000000000000000001` as Hex;
}

export function SimplifiedOffRamp() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const { client: smartClient } = useSmartWallets();

  const { data: fetchedPrimarySafeAddress, isLoading: isLoadingSafeAddress } =
    api.settings.userSafes.getPrimarySafeAddress.useQuery();

  useEffect(() => {
    if (fetchedPrimarySafeAddress) {
      setPrimarySafeAddress(fetchedPrimarySafeAddress as Address);
    }
  }, [fetchedPrimarySafeAddress]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<OffRampFormValues>({
    defaultValues: {
      destinationType: 'ach',
      accountHolderType: 'individual',
      country: '',
      city: '',
      streetLine1: '',
      streetLine2: '',
      postalCode: '',
    },
  });

  const destinationType = watch('destinationType');

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

  const completeTransferMutation = api.align.completeOfframpTransfer.useMutation(
    {
      onSuccess: () => {
        setCurrentStep(2);
        toast.success('Transfer processing.');
      },
      onError: (err) => setError(`Failed to finalize transfer: ${err.message}`),
      onSettled: () => setIsLoading(false),
    },
  );

  const handleInitiateSubmit = async (values: OffRampFormValues) => {
    setError(null);

    // Manual validation for conditional fields
    const amount = parseFloat(values.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Amount must be a positive number');
      return;
    }

    // Validate ACH fields
    if (values.destinationType === 'ach') {
      if (!values.accountNumber) {
        toast.error('Account number is required for ACH transfers');
        return;
      }
      if (!values.routingNumber) {
        toast.error('Routing number is required for ACH transfers');
        return;
      }
    }

    // Validate IBAN fields
    if (values.destinationType === 'iban') {
      if (!values.iban) {
        toast.error('IBAN is required for international transfers');
        return;
      }
      if (!values.bic) {
        toast.error('BIC/SWIFT is required for international transfers');
        return;
      }
    }

    // Validate account holder fields
    if (values.accountHolderType === 'individual') {
      if (!values.accountHolderFirstName || !values.accountHolderLastName) {
        toast.error('First and last name are required for individual accounts');
        return;
      }
    } else if (values.accountHolderType === 'business') {
      if (!values.accountHolderBusinessName) {
        toast.error('Business name is required for business accounts');
        return;
      }
    }

    // Construct payload to match backend's expected schema
    const submissionPayload: CreateOfframpTransferInput = {
      type: 'manual',
      amount: values.amount,
      sourceToken: 'usdc',
      sourceNetwork: 'base',
      destinationCurrency: values.destinationType === 'ach' ? 'usd' : 'eur',
      destinationPaymentRails: values.destinationType === 'ach' ? 'ach' : 'sepa',
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
              Your funds are on their way to your bank account.
            </p>
          </div>
          {userOpHash && (
            <a
              href={`https://basescan.org/tx/${userOpHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary underline"
            >
              Transaction Ref: {userOpHash.slice(0, 10)}...
            </a>
          )}
          <Button onClick={() => setCurrentStep(0)} variant="outline">
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 space-y-4">
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
              <span className="text-lg font-bold text-blue-900">{transferDetails?.fee} USDC</span>
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
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-xl text-blue-900">Transfer to Bank Account</CardTitle>
        <CardDescription className="text-blue-700">
          Enter an amount and your bank details to transfer USDC from your
          Primary Account.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(handleInitiateSubmit)} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount</Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-grow">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  required
                  {...register('amount', { required: 'Amount is required' })}
                  className="pl-10 h-12 text-lg border-2 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => usdcBalance && setValue('amount', usdcBalance)}
                disabled={!usdcBalance || isLoadingBalance}
                className="h-12 px-4 border-2 hover:bg-blue-50 hover:border-blue-300"
              >
                MAX
              </Button>
            </div>
            {isLoadingBalance ? (
              <p className="text-xs text-muted-foreground flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Checking balance...
              </p>
            ) : usdcBalance !== null ? (
              <p className="text-xs text-muted-foreground">
                Available: <span className="font-medium">{usdcBalance} USDC</span>
              </p>
            ) : null}
            {errors.amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Destination Type */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Transfer Method</Label>
            <Controller
              control={control}
              name="destinationType"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="relative">
                    <RadioGroupItem value="ach" id="ach" className="peer sr-only" />
                    <Label
                      htmlFor="ach"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer transition-all duration-200",
                        "hover:bg-blue-50 hover:border-blue-300",
                        destinationType === 'ach'
                          ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-500 shadow-md"
                          : "bg-white border-gray-200"
                      )}
                    >
                      <Banknote className={cn(
                        "mb-3 h-8 w-8 transition-colors",
                        destinationType === 'ach' ? "text-blue-600" : "text-gray-400"
                      )} />
                      <span className={cn(
                        "font-medium transition-colors",
                        destinationType === 'ach' ? "text-blue-900" : "text-gray-600"
                      )}>
                        US Bank
                      </span>
                      <span className={cn(
                        "text-xs mt-1 transition-colors",
                        destinationType === 'ach' ? "text-blue-700" : "text-gray-400"
                      )}>
                        ACH Transfer
                      </span>
                      {destinationType === 'ach' && (
                        <Check className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                      )}
                    </Label>
                  </div>
                  <div className="relative">
                    <RadioGroupItem value="iban" id="iban" className="peer sr-only" />
                    <Label
                      htmlFor="iban"
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border-2 p-6 cursor-pointer transition-all duration-200",
                        "hover:bg-blue-50 hover:border-blue-300",
                        destinationType === 'iban'
                          ? "bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-500 shadow-md"
                          : "bg-white border-gray-200"
                      )}
                    >
                      <Globe className={cn(
                        "mb-3 h-8 w-8 transition-colors",
                        destinationType === 'iban' ? "text-blue-600" : "text-gray-400"
                      )} />
                      <span className={cn(
                        "font-medium transition-colors",
                        destinationType === 'iban' ? "text-blue-900" : "text-gray-600"
                      )}>
                        International
                      </span>
                      <span className={cn(
                        "text-xs mt-1 transition-colors",
                        destinationType === 'iban' ? "text-blue-700" : "text-gray-400"
                      )}>
                        IBAN/SEPA
                      </span>
                      {destinationType === 'iban' && (
                        <Check className="absolute top-2 right-2 h-5 w-5 text-blue-600" />
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          {/* Bank Details */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Account Holder Type</Label>
                <Controller
                  control={control}
                  name="accountHolderType"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-6"
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
              
              {watch('accountHolderType') === 'individual' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderFirstName" className="text-sm font-medium text-gray-700">First Name</Label>
                    <Input
                      id="accountHolderFirstName"
                      {...register('accountHolderFirstName')}
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
                    <Label htmlFor="accountHolderLastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                    <Input
                      id="accountHolderLastName"
                      {...register('accountHolderLastName')}
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
              
              {watch('accountHolderType') === 'business' && (
                <div className="space-y-2">
                  <Label htmlFor="accountHolderBusinessName" className="text-sm font-medium text-gray-700">Business Name</Label>
                  <Input
                    id="accountHolderBusinessName"
                    {...register('accountHolderBusinessName')}
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
              
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">Bank Name</Label>
                <Input
                  id="bankName"
                  {...register('bankName', { required: 'Bank name is required' })}
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

              {/* Address Fields */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">Address Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country</Label>
                    <Input
                      id="country"
                      {...register('country', { required: 'Country is required' })}
                      placeholder="United States"
                      required
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.country && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700">City</Label>
                    <Input
                      id="city"
                      {...register('city', { required: 'City is required' })}
                      placeholder="New York"
                      required
                      className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetLine1" className="text-sm font-medium text-gray-700">Street Address</Label>
                  <Input
                    id="streetLine1"
                    {...register('streetLine1', { required: 'Street address is required' })}
                    placeholder="123 Main Street"
                    required
                    className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  {errors.streetLine1 && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.streetLine1.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="streetLine2" className="text-sm font-medium text-gray-700">Apartment, suite, etc. (optional)</Label>
                  <Input
                    id="streetLine2"
                    {...register('streetLine2')}
                    placeholder="Apt 4B"
                    className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  {errors.streetLine2 && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.streetLine2.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">Postal Code</Label>
                  <Input
                    id="postalCode"
                    {...register('postalCode', { required: 'Postal code is required' })}
                    placeholder="10001"
                    required
                    className="border-2 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                  {errors.postalCode && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {destinationType === 'ach' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</Label>
                  <Input
                    id="accountNumber"
                    {...register('accountNumber')}
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
                  <Label htmlFor="routingNumber" className="text-sm font-medium text-gray-700">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    {...register('routingNumber')}
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
                  <Label htmlFor="iban" className="text-sm font-medium text-gray-700">IBAN</Label>
                  <Input
                    id="iban"
                    {...register('iban')}
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
                  <Label htmlFor="bic" className="text-sm font-medium text-gray-700">BIC/SWIFT</Label>
                  <Input
                    id="bic"
                    {...register('bic')}
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
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={createTransferMutation.isPending}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
            size="lg"
          >
            {createTransferMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              'Continue Transfer'
            )}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}                