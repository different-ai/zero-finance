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
import { Loader2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import Safe from '@safe-global/protocol-kit';
import { encodeFunctionData, type Address } from 'viem';
import { SAFE_ABI } from '@/lib/sponsor-tx/core';
import { toast } from 'sonner';
import { useBimodal } from '@/components/ui/bimodal';

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
    if (!primarySafeAddress || !smartClient?.account || !transfer) {
      toast.error('Required information is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
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
        <DialogContent className="sm:max-w-md">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
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
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Transfer Processing
              </h3>
              <p className="text-sm text-gray-500">
                Your transfer is being processed. Funds will arrive in 1-2
                business days.
              </p>
            </div>
            {isTechnical && (
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#1B29FF] hover:text-[#1420CC]"
              >
                <span>View on Basescan</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume Transfer</DialogTitle>
        </DialogHeader>

        {isExpired ? (
          <div className="py-6 space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                This transfer&apos;s quote has expired. Please dismiss this
                transfer and create a new one.
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Transfer summary */}
            <div className="space-y-4">
              {/* You send */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    You send
                  </span>
                  <span className="text-xs font-medium text-gray-600 bg-gray-200 px-2 py-0.5 rounded">
                    USDC
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-gray-900">
                  {depositAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                {feeAmount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Includes{' '}
                    {feeAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}{' '}
                    USDC fee
                  </p>
                )}
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                </div>
              </div>

              {/* Bank receives */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-green-700 uppercase tracking-wider">
                    Bank receives
                  </span>
                  <span className="text-xs font-medium text-green-700 bg-green-200 px-2 py-0.5 rounded">
                    {destinationCurrency}
                  </span>
                </div>
                <p className="text-2xl font-bold tabular-nums text-green-700">
                  {currencySymbol}
                  {Number(transfer.amount || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Arrives in 1-2 business days
                </p>
              </div>
            </div>

            {/* Details - only show in technical mode */}
            {isTechnical && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Network</span>
                  <span className="font-medium text-gray-900">
                    {(transfer.deposit_network || 'BASE').toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Deposit Address</span>
                  <span className="font-mono text-xs text-gray-600 truncate max-w-[180px]">
                    {transfer.deposit_address}
                  </span>
                </div>
              </div>
            )}

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleSendFunds}
                disabled={isLoading}
                className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white h-12"
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
                className="w-full text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
