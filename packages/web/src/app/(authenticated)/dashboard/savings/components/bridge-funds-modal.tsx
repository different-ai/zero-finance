'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import type { Address } from 'viem';
import { parseUnits, formatUnits } from 'viem';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import {
  SUPPORTED_CHAINS,
  getChainDisplayName,
  type SupportedChainId,
} from '@/lib/constants/chains';
import { USDC_DECIMALS } from '@/lib/constants';

interface BridgeFundsModalProps {
  safeAddress: Address;
  onSuccess?: () => void;
  onClose?: () => void;
}

type BridgeStep =
  | 'idle'
  | 'loading-quote'
  | 'confirming'
  | 'bridging'
  | 'success'
  | 'error';

interface BridgeState {
  step: BridgeStep;
  txHash?: string;
  errorMessage?: string;
}

export function BridgeFundsModal({
  safeAddress,
  onSuccess,
  onClose,
}: BridgeFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [sourceChain, setSourceChain] = useState<SupportedChainId>(
    SUPPORTED_CHAINS.BASE,
  );
  const [destChain, setDestChain] = useState<SupportedChainId>(
    SUPPORTED_CHAINS.ARBITRUM,
  );
  const [bridgeState, setBridgeState] = useState<BridgeState>({ step: 'idle' });

  // Get multi-chain positions to see available Safes and balances
  const { data: multiChainData, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery();

  // Find source Safe address based on selected chain
  const sourceSafe = multiChainData?.safes.find(
    (s) => s.chainId === sourceChain,
  );
  const sourceSafeAddress = (sourceSafe?.address as Address) || safeAddress;

  // Get balance on source chain
  const { data: balanceData } = trpc.earn.getSafeBalanceOnChain.useQuery(
    {
      safeAddress: sourceSafeAddress,
      chainId: sourceChain,
    },
    {
      enabled: !!sourceSafeAddress,
    },
  );

  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    sourceSafeAddress,
    sourceChain,
  );

  // Bridge mutations
  const bridgeFundsMutation = trpc.earn.bridgeFunds.useMutation();
  const updateBridgeStatusMutation =
    trpc.earn.updateBridgeDeposit.useMutation();

  // Get bridge quote
  const [quote, setQuote] = useState<{
    outputAmount: string;
    totalFee: string;
    estimatedFillTime: number;
  } | null>(null);

  const trpcUtils = trpc.useUtils();

  // Fetch quote when amount changes
  useEffect(() => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    const fetchQuote = async () => {
      try {
        setBridgeState({ step: 'loading-quote' });
        const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);
        const quoteData = await trpcUtils.earn.getBridgeQuote.fetch({
          amount: amountInSmallestUnit.toString(),
          sourceChainId: sourceChain,
          destChainId: destChain,
        });
        setQuote({
          outputAmount: quoteData.outputAmount,
          totalFee: quoteData.totalFee,
          estimatedFillTime: quoteData.estimatedFillTime,
        });
        setBridgeState({ step: 'idle' });
      } catch (error) {
        console.error('Failed to fetch quote:', error);
        setQuote(null);
        setBridgeState({ step: 'idle' });
      }
    };

    const debounce = setTimeout(fetchQuote, 500);
    return () => clearTimeout(debounce);
  }, [amount, sourceChain, destChain, trpcUtils]);

  const handleBridge = async () => {
    if (!amount || !isRelayReady) return;

    try {
      setBridgeState({ step: 'bridging' });

      const amountInSmallestUnit = parseUnits(amount, USDC_DECIMALS);

      const bridgeResult = await bridgeFundsMutation.mutateAsync({
        amount: amountInSmallestUnit.toString(),
        sourceChainId: sourceChain,
        destChainId: destChain,
      });

      if (bridgeResult.needsDeployment) {
        setBridgeState({
          step: 'error',
          errorMessage: `You need to create an account on ${getChainDisplayName(destChain as SupportedChainId)} first. Please deposit to a ${getChainDisplayName(destChain as SupportedChainId)} vault to set up your account.`,
        });
        return;
      }

      const { bridgeTransactionId, transaction: bridgeTxArray } =
        bridgeResult as any;

      // Execute bridge transaction
      const txsToRelay = bridgeTxArray.map((tx: any) => ({
        to: tx.to as Address,
        value: tx.value,
        data: tx.data as `0x${string}`,
      }));

      const bridgeTxHash = await sendTxViaRelay(txsToRelay, 500_000n);

      if (!bridgeTxHash) throw new Error('Bridge transaction failed');

      await updateBridgeStatusMutation.mutateAsync({
        bridgeTransactionId,
        depositTxHash: bridgeTxHash,
      });

      setBridgeState({
        step: 'success',
        txHash: bridgeTxHash,
      });

      toast.success('Transfer initiated', {
        description: `Moving $${amount} from ${getChainDisplayName(sourceChain as SupportedChainId)} to ${getChainDisplayName(destChain as SupportedChainId)}. Estimated arrival: ${Math.ceil((quote?.estimatedFillTime || 120) / 60)} minutes.`,
      });

      setAmount('');
      onSuccess?.();
    } catch (error) {
      console.error('Bridge error:', error);
      setBridgeState({
        step: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Transfer failed',
      });
    }
  };

  const handleMax = () => {
    if (balanceData?.formatted) {
      setAmount(balanceData.formatted);
    }
  };

  const balance = balanceData?.formatted || '0';
  const hasAmount = amount.trim().length > 0;
  const amountValue = parseFloat(amount) || 0;
  const balanceValue = parseFloat(balance) || 0;
  const insufficientBalance = amountValue > balanceValue;

  const canBridge =
    hasAmount &&
    amountValue > 0 &&
    !insufficientBalance &&
    isRelayReady &&
    bridgeState.step !== 'bridging' &&
    sourceChain !== destChain;

  if (bridgeState.step === 'success') {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-6 w-6 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-[#101010] mb-2">
            Transfer Initiated
          </h3>
          <p className="text-[14px] text-[#101010]/70">
            Your funds are being moved to{' '}
            {getChainDisplayName(destChain as SupportedChainId)}. This typically
            takes {Math.ceil((quote?.estimatedFillTime || 120) / 60)} minutes.
          </p>
        </div>
        <Button onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-[18px] font-semibold text-[#101010] mb-1">
          Move Funds
        </h3>
        <p className="text-[13px] text-[#101010]/60">
          Transfer funds between your accounts on different networks.
        </p>
      </div>

      {bridgeState.step === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{bridgeState.errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Source Chain */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">From</Label>
        <Select
          value={sourceChain.toString()}
          onValueChange={(v) => setSourceChain(parseInt(v) as SupportedChainId)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SUPPORTED_CHAINS.BASE.toString()}>
              {getChainDisplayName(SUPPORTED_CHAINS.BASE)}
            </SelectItem>
            <SelectItem value={SUPPORTED_CHAINS.ARBITRUM.toString()}>
              {getChainDisplayName(SUPPORTED_CHAINS.ARBITRUM)}
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[11px] text-[#101010]/50">
          Balance: $
          {parseFloat(balance).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          USD
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">Amount</Label>
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pr-20"
            step="0.01"
            min="0"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="text-[11px] text-[#101010]/50">USD</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMax}
              className="h-6 px-1.5 text-[11px]"
            >
              Max
            </Button>
          </div>
        </div>
        {insufficientBalance && (
          <p className="text-[11px] text-red-500">Insufficient balance</p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <ArrowRight className="h-5 w-5 text-[#101010]/30 rotate-90" />
      </div>

      {/* Destination Chain */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">To</Label>
        <Select
          value={destChain.toString()}
          onValueChange={(v) => setDestChain(parseInt(v) as SupportedChainId)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SUPPORTED_CHAINS.BASE.toString()}>
              {getChainDisplayName(SUPPORTED_CHAINS.BASE)}
            </SelectItem>
            <SelectItem value={SUPPORTED_CHAINS.ARBITRUM.toString()}>
              {getChainDisplayName(SUPPORTED_CHAINS.ARBITRUM)}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quote Info */}
      {quote && (
        <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-3 space-y-2 text-[12px]">
          <div className="flex justify-between">
            <span className="text-[#101010]/60">You receive</span>
            <span className="font-medium text-[#101010]">
              ${formatUnits(BigInt(quote.outputAmount), USDC_DECIMALS)} USD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Transfer fee</span>
            <span className="text-[#101010]">
              ${formatUnits(BigInt(quote.totalFee), USDC_DECIMALS)} USD
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#101010]/60">Estimated time</span>
            <span className="text-[#101010]">
              ~{Math.ceil(quote.estimatedFillTime / 60)} min
            </span>
          </div>
        </div>
      )}

      {sourceChain === destChain && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select different source and destination networks.
          </AlertDescription>
        </Alert>
      )}

      {/* Bridge Button */}
      <Button
        onClick={handleBridge}
        disabled={!canBridge}
        className="w-full"
        size="lg"
      >
        {bridgeState.step === 'bridging' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Transfer...
          </>
        ) : bridgeState.step === 'loading-quote' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Quote...
          </>
        ) : (
          'Move Funds'
        )}
      </Button>

      <p className="text-[11px] text-[#101010]/50 text-center">
        Transfers between networks are powered by Across Protocol and typically
        complete within 2-5 minutes.
      </p>
    </div>
  );
}
