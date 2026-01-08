'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc } from '@/utils/trpc';
import { api } from '@/trpc/react';
import {
  Loader2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ArrowDown,
} from 'lucide-react';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe from '@safe-global/protocol-kit';
import { encodeFunctionData, type Address } from 'viem';
import { SAFE_ABI } from '@/lib/sponsor-tx/core';
import { toast } from 'sonner';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

// Helper to build prevalidated signature for Safe
function buildPrevalidatedSig(ownerAddress: string): `0x${string}` {
  const r = ownerAddress.slice(2).padStart(64, '0');
  const s = '0'.repeat(64);
  const v = '01';
  return `0x${r}${s}${v}` as `0x${string}`;
}

interface ResumeTransferModalProps {
  transferId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResumeTransferModal({
  transferId,
  isOpen,
  onClose,
  onSuccess,
}: ResumeTransferModalProps) {
  const { isTechnical } = useBimodal();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { client: smartClient } = useSmartWallets();

  // Fetch full transfer details for the modal
  const { data: transfers } = trpc.align.listOfframpTransfers.useQuery({
    limit: 100,
  });
  const transfer = transfers?.find((t) => t.id === transferId);

  const { data: primarySafeAddress } =
    api.settings.userSafes.getPrimarySafeAddress.useQuery();

  const prepareTxMutation = api.align.prepareOfframpTokenTransfer.useMutation({
    onError: (err) =>
      setError(`Transaction preparation failed: ${err.message}`),
  });

  const completeTransferMutation =
    api.align.completeOfframpTransfer.useMutation({
      onSuccess: () => {
        toast.success('Transfer processing.');
        onSuccess();
      },
      onError: (err) => setError(`Failed to finalize transfer: ${err.message}`),
      onSettled: () => setIsLoading(false),
    });

  const handleSendFunds = async () => {
    if (!transfer) {
      toast.error('Transfer details not found.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock Mode Bypass - check this FIRST before requiring real wallet infrastructure
      if (transferId.startsWith('mock_')) {
        setLoadingMessage('Signing transaction...');
        // Fake delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoadingMessage('Finalizing...');
        const mockHash = `0x_mock_hash_${Date.now()}`;
        await completeTransferMutation.mutateAsync({
          alignTransferId: transferId,
          depositTransactionHash: mockHash,
        });
        setTxHash(mockHash);
        return;
      }

      // For real transfers, we need wallet infrastructure
      if (!primarySafeAddress || !smartClient?.account) {
        throw new Error('Wallet not connected. Please refresh and try again.');
      }

      setLoadingMessage('Preparing transaction...');
      const preparedData = await prepareTxMutation.mutateAsync({
        alignTransferId: transferId,
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
        transactions: [preparedData as any],
      });
      safeTransaction.data.safeTxGas = BigInt(220000).toString();

      setLoadingMessage('Signing transaction...');
      const ownerAddress = smartClient!.account.address;
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
      const txResponse = await smartClient!.sendTransaction({
        to: primarySafeAddress as Address,
        data: encodedExecData as `0x${string}`,
      });

      setTxHash(txResponse);
      setLoadingMessage('Finalizing...');
      completeTransferMutation.mutate({
        alignTransferId: transferId,
        depositTransactionHash: txResponse,
      });
    } catch (err: any) {
      const errMsg = err.message || 'An unknown error occurred.';
      setError(`Failed to send funds: ${errMsg}`);
      setIsLoading(false);
    }
  };

  if (!transfer) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border border-[#101010]/10 shadow-none rounded-sm">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#101010]/20" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Check if quote has expired
  const isExpired =
    transfer.quote_expires_at &&
    new Date(transfer.quote_expires_at) < new Date();

  const depositAmount = Number(transfer.deposit_amount || 0);
  const feeAmount = Number(transfer.fee_amount || 0);
  const destinationCurrency =
    transfer.destination_currency?.toUpperCase() || 'USD';
  const currencySymbol = destinationCurrency === 'EUR' ? '€' : '$';

  // Success state
  if (txHash) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white border border-[#101010]/10 shadow-none rounded-sm p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-[#10b981]/10 flex items-center justify-center">
              <div className="h-8 w-8 text-[#10b981]">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-[18px] font-semibold text-[#101010]">
                Transfer Processing
              </h3>
              <p className="text-[13px] text-[#101010]/60 max-w-[240px] mx-auto">
                Your funds are on the way. They will arrive in 1-2 business
                days.
              </p>
            </div>

            {isTechnical && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#1B29FF] hover:underline"
              >
                <span>TX::VIEW_ON_SCAN</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            <Button
              onClick={onClose}
              className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white rounded-sm h-10 font-medium text-[13px]"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'sm:max-w-md bg-white border border-[#101010]/10 shadow-none p-0 gap-0',
          isTechnical ? 'rounded-none border-[#1B29FF]/20' : 'rounded-sm',
        )}
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle
            className={cn(
              'text-[18px] font-medium text-[#101010]',
              isTechnical && 'font-mono text-[#1B29FF]',
            )}
          >
            {isTechnical ? 'EXECUTE::TRANSFER' : 'Resume Transfer'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          {isExpired ? (
            <div className="py-2 space-y-4">
              <Alert className="bg-amber-50/50 border-amber-200/60 rounded-sm">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-[13px]">
                  This quote has expired. Please create a new transfer.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full h-10 rounded-sm text-[13px]"
              >
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Transfer Details Card */}
              <div
                className={cn(
                  'border relative',
                  isTechnical
                    ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
                    : 'border-[#101010]/10 bg-[#F7F7F2]',
                )}
              >
                {/* You Send Section */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-[0.14em]',
                        isTechnical
                          ? 'font-mono text-[#1B29FF]/70'
                          : 'text-[#101010]/60',
                      )}
                    >
                      You Send
                    </span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                        isTechnical
                          ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono'
                          : 'bg-[#2775ca]/10 text-[#2775ca] rounded-sm',
                      )}
                    >
                      USDC
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-[24px] font-semibold tabular-nums text-[#101010]',
                      isTechnical && 'font-mono text-[#1B29FF]',
                    )}
                  >
                    {depositAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  {feeAmount > 0 && (
                    <p className="text-[11px] text-[#101010]/40 mt-1">
                      Includes{' '}
                      {feeAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      })}{' '}
                      USDC fee
                    </p>
                  )}
                </div>

                {/* Divider with Arrow */}
                <div className="relative h-px bg-[#101010]/10 flex justify-center">
                  <div
                    className={cn(
                      'absolute -top-3 p-1.5 border border-[#101010]/10',
                      isTechnical
                        ? 'bg-white border-[#1B29FF]/20 text-[#1B29FF]'
                        : 'bg-white text-[#101010]/40 rounded-full',
                    )}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </div>
                </div>

                {/* Bank Receives Section */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        'text-[10px] uppercase tracking-[0.14em]',
                        isTechnical
                          ? 'font-mono text-[#1B29FF]/70'
                          : 'text-[#101010]/60',
                      )}
                    >
                      Bank Receives
                    </span>
                    <span
                      className={cn(
                        'px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                        isTechnical
                          ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono'
                          : 'bg-[#10b981]/10 text-[#10b981] rounded-sm',
                      )}
                    >
                      {destinationCurrency}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-[24px] font-semibold tabular-nums text-[#10b981]',
                      isTechnical && 'font-mono',
                    )}
                  >
                    {currencySymbol}
                    {Number(transfer.amount || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-[11px] text-[#10b981] mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                    Arrives in 1-2 business days
                  </p>
                </div>
              </div>

              {/* Technical Details */}
              {isTechnical && (
                <div className="border border-[#1B29FF]/20 bg-white p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-[#1B29FF]/50 uppercase">
                      NETWORK
                    </span>
                    <span className="font-mono text-[10px] text-[#1B29FF]">
                      {(transfer.deposit_network || 'BASE').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-[#1B29FF]/50 uppercase">
                      DEPOSIT_ADDR
                    </span>
                    <span className="font-mono text-[10px] text-[#1B29FF] truncate max-w-[150px]">
                      {transfer.deposit_address}
                    </span>
                  </div>
                </div>
              )}

              {error && (
                <Alert className="bg-red-50/50 border-red-200/60 rounded-sm">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 text-[13px]">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleSendFunds}
                  disabled={isLoading}
                  className={cn(
                    'w-full h-11 text-[13px] font-medium transition-all',
                    isTechnical
                      ? 'bg-white border border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF]/5 rounded-none uppercase font-mono'
                      : 'bg-[#1B29FF] hover:bg-[#1420CC] text-white rounded-sm',
                  )}
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
                <Button
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  className={cn(
                    'w-full h-10 text-[12px]',
                    isTechnical
                      ? 'text-[#1B29FF]/60 hover:text-[#1B29FF] rounded-none uppercase font-mono'
                      : 'text-[#101010]/60 hover:text-[#101010] hover:bg-transparent',
                  )}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
