'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  Wallet,
  AlertCircle,
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
import { cn } from '@/lib/utils';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { type UserFundingSourceDisplayData } from '@/actions/get-user-funding-sources';
import { USDC_ADDRESS, WETH_ADDRESS } from '@/lib/constants';

interface OffRampFormValues {
  amount: string;
  sourceToken: 'usdc' | 'eth';
  cryptoAddress: string;
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

export function SimplifiedOffRamp(props: SimplifiedOffRampProps) {
  const { mode = 'real', ...rest } = props;

  // Always use real mode now (crypto only)
  return <SimplifiedOffRampReal {...rest} />;
}

type SimplifiedOffRampInnerProps = Omit<SimplifiedOffRampProps, 'mode'>;

function SimplifiedOffRampReal({
  prefillFromInvoice,
  defaultValues,
  maxBalance,
}: SimplifiedOffRampInnerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [primarySafeAddress, setPrimarySafeAddress] = useState<Address | null>(
    null,
  );
  const [cryptoTxHash, setCryptoTxHash] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { data: fetchedPrimarySafeAddress, isLoading: isLoadingSafeAddress } =
    api.settings.userSafes.getPrimarySafeAddress.useQuery();

  const { ready: isRelayReady, send: sendWithRelay } = useSafeRelay(
    primarySafeAddress || undefined,
  );

  useEffect(() => {
    if (fetchedPrimarySafeAddress) {
      setPrimarySafeAddress(fetchedPrimarySafeAddress as Address);
    }
  }, [fetchedPrimarySafeAddress]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OffRampFormValues>({
    defaultValues: {
      sourceToken: 'usdc',
      cryptoAddress: '',
      amount: prefillFromInvoice?.amount || '',
      ...defaultValues,
    },
  });

  const sourceToken = watch('sourceToken');

  // Fetch balances
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
        setUsdcBalance(formatUnits(usdcBal as bigint, 6));

        // Fetch ETH balance
        const ethBal = await publicClient.getBalance({
          address: primarySafeAddress,
        });
        setEthBalance(formatUnits(ethBal, 18));
      } catch (err) {
        toast.error('Could not fetch balances.');
      } finally {
        setIsLoadingBalance(false);
      }
    };
    fetchBalances();
  }, [primarySafeAddress]);

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
      const isEth = values.sourceToken === 'eth';
      const decimals = isEth ? 18 : 6;
      const valueInUnits = parseUnits(values.amount, decimals);

      if (valueInUnits <= 0n) {
        throw new Error('Amount must be greater than 0.');
      }

      let transactions: MetaTransactionData[];

      if (isEth) {
        // Native ETH transfer
        transactions = [
          {
            to: values.cryptoAddress as Address,
            value: valueInUnits.toString(),
            data: '0x',
          },
        ];
      } else {
        // USDC transfer
        const transferData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [values.cryptoAddress as Address, valueInUnits],
        });

        transactions = [
          {
            to: USDC_BASE_ADDRESS,
            value: '0',
            data: transferData,
          },
        ];
      }

      const txHash = await sendWithRelay(transactions);
      setCryptoTxHash(txHash);
      setIsComplete(true);
      toast.success('Transfer completed successfully!');
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send transfer: ${errMsg}`);
      toast.error('Transfer failed', { description: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsComplete(false);
    setCryptoTxHash(null);
    setValue('amount', '');
    setValue('cryptoAddress', '');
  };

  const currentBalance = sourceToken === 'eth' ? ethBalance : usdcBalance;
  const currentDecimals = sourceToken === 'eth' ? 18 : 6;
  const currentSymbol = sourceToken === 'eth' ? 'ETH' : 'USDC';

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
                Transfer complete
              </h3>
              <p className="text-[14px] text-[#101010]/65 max-w-md">
                Your {currentSymbol} transfer has been sent successfully.
              </p>
            </div>
            {cryptoTxHash && (
              <a
                href={`https://basescan.org/tx/${cryptoTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] text-[#1B29FF] hover:text-[#1420CC] underline underline-offset-2"
              >
                View on BaseScan: {cryptoTxHash.slice(0, 10)}...
              </a>
            )}
            <Button
              onClick={handleReset}
              className="bg-[#1B29FF] hover:bg-[#1420CC] text-white px-6 py-2.5 text-[14px] font-medium"
            >
              Make Another Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="bg-white">
      <div className="border-b border-[#101010]/10 px-5 sm:px-6 py-4">
        <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
          CRYPTO TRANSFER
        </p>
        <h2 className="text-[22px] sm:text-[24px] font-semibold tracking-[-0.01em] text-[#101010]">
          Send to wallet address
        </h2>
      </div>

      <div className="p-5 sm:p-6">
        <form
          onSubmit={handleSubmit(handleCryptoTransfer)}
          className="space-y-5"
        >
          {/* Source Token Selection */}
          <div>
            <Label className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block">
              SELECT TOKEN
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('sourceToken', 'usdc')}
                className={cn(
                  'relative flex flex-col items-center justify-center bg-white border-2 rounded-[12px] p-4 cursor-pointer transition-all',
                  sourceToken === 'usdc'
                    ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                    : 'border-[#101010]/10 hover:bg-[#F7F7F2]/50',
                )}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold text-sm">$</span>
                </div>
                <span className="font-medium text-[14px] text-[#101010]">
                  USDC
                </span>
                <span className="text-[11px] text-[#101010]/60 mt-1">
                  {usdcBalance ? `${parseFloat(usdcBalance).toFixed(2)}` : '—'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setValue('sourceToken', 'eth')}
                className={cn(
                  'relative flex flex-col items-center justify-center bg-white border-2 rounded-[12px] p-4 cursor-pointer transition-all',
                  sourceToken === 'eth'
                    ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                    : 'border-[#101010]/10 hover:bg-[#F7F7F2]/50',
                )}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-purple-600 font-bold text-sm">Ξ</span>
                </div>
                <span className="font-medium text-[14px] text-[#101010]">
                  ETH
                </span>
                <span className="text-[11px] text-[#101010]/60 mt-1">
                  {ethBalance ? `${parseFloat(ethBalance).toFixed(4)}` : '—'}
                </span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-[#F7F7F2] border border-[#101010]/10 rounded-[12px] p-4 sm:p-5">
            <Label
              htmlFor="amount"
              className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block"
            >
              AMOUNT
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
                    const availableBalance = currentBalance
                      ? parseFloat(currentBalance)
                      : null;
                    if (availableBalance !== null && num > availableBalance)
                      return 'Amount exceeds your available balance.';
                    return true;
                  },
                })}
                placeholder="0.00"
                className="text-[20px] font-semibold tabular-nums h-12 border-[#101010]/10 bg-white pr-20"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                <span className="text-[12px] text-[#101010]/50">
                  {currentSymbol}
                </span>
                {currentBalance && (
                  <button
                    type="button"
                    onClick={() => {
                      setValue('amount', currentBalance, {
                        shouldValidate: true,
                      });
                    }}
                    className="text-[11px] text-[#1B29FF] hover:text-[#1420CC]"
                  >
                    MAX
                  </button>
                )}
              </div>
            </div>
            {errors.amount && (
              <p className="text-[12px] text-red-500 mt-2">
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Recipient Address */}
          <div className="bg-white border border-[#101010]/10 rounded-[12px] p-4 sm:p-5">
            <Label
              htmlFor="cryptoAddress"
              className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3 block"
            >
              RECIPIENT ADDRESS (BASE NETWORK)
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
              className="h-12 border-[#101010]/10 font-mono text-[13px]"
            />
            {errors.cryptoAddress && (
              <p className="text-[12px] text-red-500 mt-2">
                {errors.cryptoAddress.message}
              </p>
            )}
          </div>

          {/* Warning */}
          <Alert className="bg-[#FFF8E6] border-[#FFA500]/20">
            <AlertCircle className="h-4 w-4 text-[#FFA500]" />
            <AlertDescription className="text-[12px] text-[#101010]/70">
              Crypto transfers are irreversible. Please verify the address
              carefully.
            </AlertDescription>
          </Alert>

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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !isRelayReady}
            className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12 text-[14px] font-medium transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send {currentSymbol}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
