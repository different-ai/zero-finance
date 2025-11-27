'use client';

import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import type { Address } from 'viem';
import { parseUnits, encodeFunctionData } from 'viem';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import {
  getChainDisplayName,
  type SupportedChainId,
} from '@/lib/constants/chains';

// WETH addresses per chain
const WETH_ADDRESSES: Record<number, Address> = {
  8453: '0x4200000000000000000000000000000000000006', // Base
  42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // Arbitrum
};

// WETH ABI for withdraw (unwrap)
const WETH_ABI = [
  {
    name: 'withdraw',
    type: 'function',
    inputs: [{ name: 'wad', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'deposit',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
] as const;

interface SwapModalProps {
  safeAddress: Address;
  chainId: SupportedChainId;
  wethBalance: number;
  ethBalance: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

type SwapStep = 'idle' | 'processing' | 'success' | 'error';

interface SwapState {
  step: SwapStep;
  txHash?: string;
  errorMessage?: string;
}

type SwapDirection = 'weth-to-eth' | 'eth-to-weth';

export function SwapModal({
  safeAddress,
  chainId,
  wethBalance,
  ethBalance,
  onSuccess,
  onClose,
}: SwapModalProps) {
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState<SwapDirection>('weth-to-eth');
  const [swapState, setSwapState] = useState<SwapState>({ step: 'idle' });

  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    safeAddress,
    chainId,
  );

  const wethAddress = WETH_ADDRESSES[chainId];
  const sourceBalance = direction === 'weth-to-eth' ? wethBalance : ethBalance;
  const sourceToken = direction === 'weth-to-eth' ? 'WETH' : 'ETH';
  const destToken = direction === 'weth-to-eth' ? 'ETH' : 'WETH';

  const handleSwap = async () => {
    if (!amount || !isRelayReady || !wethAddress) return;

    try {
      setSwapState({ step: 'processing' });
      const amountWei = parseUnits(amount, 18);

      let txData: `0x${string}`;
      let txValue = '0';

      if (direction === 'weth-to-eth') {
        // Unwrap WETH to ETH
        txData = encodeFunctionData({
          abi: WETH_ABI,
          functionName: 'withdraw',
          args: [amountWei],
        });
      } else {
        // Wrap ETH to WETH (call deposit with ETH value)
        txData = encodeFunctionData({
          abi: WETH_ABI,
          functionName: 'deposit',
        });
        txValue = amountWei.toString();
      }

      const txsToRelay = [
        {
          to: wethAddress,
          value: txValue,
          data: txData,
        },
      ];

      const txHash = await sendTxViaRelay(txsToRelay, 100_000n);

      if (!txHash) throw new Error('Transaction failed');

      setSwapState({
        step: 'success',
        txHash,
      });

      toast.success(`${sourceToken} → ${destToken} swap completed`, {
        description: `Converted ${amount} ${sourceToken} to ${destToken}`,
      });

      setAmount('');
      onSuccess?.();
    } catch (error) {
      console.error('Swap error:', error);
      setSwapState({
        step: 'error',
        errorMessage: error instanceof Error ? error.message : 'Swap failed',
      });
    }
  };

  const handleMax = () => {
    if (sourceBalance > 0) {
      // Leave a small amount for gas if wrapping ETH
      const maxAmount =
        direction === 'eth-to-weth'
          ? Math.max(0, sourceBalance - 0.001)
          : sourceBalance;
      setAmount(maxAmount.toFixed(6));
    }
  };

  const toggleDirection = () => {
    setDirection((d) => (d === 'weth-to-eth' ? 'eth-to-weth' : 'weth-to-eth'));
    setAmount('');
  };

  const amountValue = parseFloat(amount) || 0;
  const insufficientBalance = amountValue > sourceBalance;
  const canSwap =
    amountValue > 0 &&
    !insufficientBalance &&
    isRelayReady &&
    swapState.step !== 'processing' &&
    wethAddress;

  if (swapState.step === 'success') {
    return (
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-6 w-6 text-[#10B981]" />
        </div>
        <div>
          <h3 className="text-[18px] font-semibold text-[#101010] mb-2">
            Swap Complete
          </h3>
          <p className="text-[14px] text-[#101010]/70">
            Successfully converted {sourceToken} to {destToken}.
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
          Wrap / Unwrap ETH
        </h3>
        <p className="text-[13px] text-[#101010]/60">
          Convert between ETH and WETH on {getChainDisplayName(chainId)}.
        </p>
      </div>

      {swapState.step === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{swapState.errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Source Token */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">From</Label>
        <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#101010]">
              {sourceToken}
            </span>
            <span className="text-[12px] text-[#101010]/60">
              Balance: {sourceBalance.toFixed(6)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-0 bg-transparent text-[20px] font-semibold p-0 h-auto focus-visible:ring-0"
              step="any"
              min="0"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleMax}
              className="h-6 px-2 text-[11px] text-[#1B29FF]"
            >
              MAX
            </Button>
          </div>
        </div>
        {insufficientBalance && (
          <p className="text-[11px] text-red-500">Insufficient balance</p>
        )}
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleDirection}
          className="rounded-full w-10 h-10 p-0 border-[#101010]/20 hover:border-[#1B29FF] hover:bg-[#1B29FF]/5"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Destination Token */}
      <div className="space-y-2">
        <Label className="text-[12px] text-[#101010]/60">To</Label>
        <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-medium text-[#101010]">
              {destToken}
            </span>
            <span className="text-[12px] text-[#101010]/60">
              Balance:{' '}
              {(direction === 'weth-to-eth' ? ethBalance : wethBalance).toFixed(
                6,
              )}
            </span>
          </div>
          <div className="text-[20px] font-semibold text-[#101010]">
            {amount || '0.0'}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2]/50 p-3 text-[12px] text-[#101010]/70">
        {direction === 'weth-to-eth' ? (
          <p>
            Unwrapping WETH converts it back to native ETH. This is useful after
            withdrawing from yield vaults that return WETH.
          </p>
        ) : (
          <p>
            Wrapping ETH converts it to WETH (Wrapped ETH), an ERC-20 token
            compatible with DeFi protocols.
          </p>
        )}
      </div>

      {/* Swap Button */}
      <Button
        onClick={handleSwap}
        disabled={!canSwap}
        className="w-full"
        size="lg"
      >
        {swapState.step === 'processing' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Convert ${sourceToken} to ${destToken}`
        )}
      </Button>

      <p className="text-[11px] text-[#101010]/50 text-center">
        1:1 conversion with no fees (only gas costs apply).
      </p>
    </div>
  );
}
