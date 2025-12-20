'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { trpc, RouterOutputs } from '@/utils/trpc';
import {
  Loader2,
  AlertCircle,
  UploadCloud,
  Banknote,
  Building2,
  X,
  ChevronDown,
  ChevronUp,
  Clock,
  Play,
  ArrowRight,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useSmartWallets } from '@privy-io/react-auth/smart-wallets';
import { api } from '@/trpc/react';
import Safe from '@safe-global/protocol-kit';
import { encodeFunctionData, type Address } from 'viem';
import { SAFE_ABI } from '@/lib/sponsor-tx/core';

type OnrampTransfer = RouterOutputs['align']['listOnrampTransfers'][number] & {
  created_at?: string | null;
};
type OfframpTransfer =
  RouterOutputs['align']['listOfframpTransfers'][number] & {
    created_at?: string | null;
  };
type CombinedTransfer =
  | (OnrampTransfer & { _direction: 'incoming' })
  | (OfframpTransfer & { _direction: 'outgoing' });

// Helper to check if an error is a "no customer" error that should show empty state
function isNoCustomerError(message: string | undefined): boolean {
  if (!message) return false;
  return (
    message.toLowerCase().includes('no align customer') ||
    message.toLowerCase().includes('customer id') ||
    message.toLowerCase().includes('not found for user')
  );
}

// Helper to build prevalidated signature for Safe
function buildPrevalidatedSig(ownerAddress: string): `0x${string}` {
  const r = ownerAddress.slice(2).padStart(64, '0');
  const s = '0'.repeat(64);
  const v = '01';
  return `0x${r}${s}${v}` as `0x${string}`;
}

// Transfer row component for reuse
function TransferRow({
  tx,
  onDismiss,
  onResume,
  isDismissing,
}: {
  tx: CombinedTransfer;
  onDismiss?: () => void;
  onResume?: () => void;
  isDismissing?: boolean;
}) {
  const amountValue = Number(tx.amount ?? 0);
  const currencyCode =
    ('source_currency' in tx ? tx.source_currency : undefined) ??
    ('destination_currency' in tx ? tx.destination_currency : undefined) ??
    ('quote' in tx ? tx.quote?.deposit_currency : undefined);

  // Check if this is an agent-proposed transfer
  const isAgentProposal =
    tx._direction === 'outgoing' &&
    'proposed_by_agent' in tx &&
    tx.proposed_by_agent;
  const agentMessage =
    tx._direction === 'outgoing' && 'agent_proposal_message' in tx
      ? tx.agent_proposal_message
      : null;

  return (
    <div className="w-full px-6 py-4 flex items-center gap-4">
      <div
        className={`h-10 w-10 flex items-center justify-center rounded-full ${
          isAgentProposal
            ? 'bg-violet-600/10 text-violet-600'
            : tx._direction === 'incoming'
              ? 'bg-emerald-600/10 text-emerald-600'
              : 'bg-sky-600/10 text-sky-600'
        }`}
      >
        {isAgentProposal ? (
          <Bot className="h-5 w-5" />
        ) : tx._direction === 'incoming' ? (
          <UploadCloud className="h-5 w-5" />
        ) : (
          <Banknote className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-gray-800 font-medium truncate">
            {amountValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            {currencyCode ? currencyCode.toUpperCase() : ''}
          </p>
          {isAgentProposal && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="bg-violet-100 text-violet-700 hover:bg-violet-100 text-xs px-1.5 py-0"
                  >
                    <Bot className="h-3 w-3 mr-0.5" />
                    Agent
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[200px]">
                    {agentMessage || 'Proposed by AI agent'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-gray-500 text-sm truncate">
          {tx._direction === 'incoming' ? 'Incoming' : 'Outgoing'} ·{' '}
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onResume && (
          <Button
            variant="outline"
            size="sm"
            onClick={onResume}
            className="text-[#1B29FF] border-[#1B29FF]/30 hover:bg-[#1B29FF]/5 h-8 px-3"
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            {isAgentProposal ? 'Approve' : 'Resume'}
          </Button>
        )}
        {onDismiss && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            disabled={isDismissing}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 p-0"
            title={isAgentProposal ? 'Reject proposal' : 'Dismiss transfer'}
          >
            {isDismissing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Resume Transfer Modal
function ResumeTransferModal({
  transfer,
  isOpen,
  onClose,
  onSuccess,
}: {
  transfer: OfframpTransfer & { _direction: 'outgoing' };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { client: smartClient } = useSmartWallets();

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
    if (!primarySafeAddress || !smartClient?.account) {
      toast.error('Required information is missing.');
      return;
    }

    setIsLoading(true);
    setError(null);
    const alignTransferId = transfer.id;

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
        to: primarySafeAddress as Address,
        data: encodedExecData as `0x${string}`,
      });

      setTxHash(txResponse);
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
            <a
              href={`https://basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#1B29FF] hover:text-[#1420CC]"
            >
              <span>View on Basescan</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
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

            {/* Details */}
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

export function BankTransfersList() {
  const utils = trpc.useUtils();
  const [syncError, setSyncError] = React.useState<string | null>(null);
  const [pendingExpanded, setPendingExpanded] = React.useState(true);
  const [dismissingIds, setDismissingIds] = React.useState<Set<string>>(
    new Set(),
  );
  const [resumeTransfer, setResumeTransfer] = React.useState<
    (OfframpTransfer & { _direction: 'outgoing' }) | null
  >(null);
  const hasSyncedRef = React.useRef(false);

  const {
    data: incoming,
    isLoading: loadingIncoming,
    isError: errorIncoming,
    error: incomingError,
  } = trpc.align.listOnrampTransfers.useQuery({ limit: 10 });

  const {
    data: outgoing,
    isLoading: loadingOutgoing,
    isError: errorOutgoing,
    error: outgoingError,
  } = trpc.align.listOfframpTransfers.useQuery({ limit: 10 });

  const syncOnramp = trpc.align.syncOnrampTransfers.useMutation({
    onSettled: () => {
      utils.align.listOnrampTransfers.invalidate();
    },
  });

  const syncOfframp = trpc.align.syncOfframpTransfers.useMutation({
    onSettled: () => {
      utils.align.listOfframpTransfers.invalidate();
    },
  });

  const dismissTransfer = trpc.align.dismissOfframpTransfer.useMutation({
    onSuccess: () => {
      utils.align.listOfframpTransfers.invalidate();
    },
  });

  // Sync data on mount and surface failures so we do not silently show stale data
  React.useEffect(() => {
    if (hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const runInitialSync = async () => {
      const results = await Promise.allSettled([
        syncOnramp.mutateAsync(),
        syncOfframp.mutateAsync(),
      ]);

      const failure = results.find((result) => result.status === 'rejected');

      if (failure && failure.status === 'rejected') {
        const message =
          failure.reason instanceof Error
            ? failure.reason.message
            : 'Failed to refresh bank transfers.';
        // Don't show "no customer" errors as sync errors - treat as empty state
        if (!isNoCustomerError(message)) {
          setSyncError(message);
        }
      } else {
        setSyncError(null);
      }
    };

    void runInitialSync();
  }, [syncOnramp, syncOfframp]);

  const handleDismiss = async (alignTransferId: string) => {
    setDismissingIds((prev) => new Set(prev).add(alignTransferId));
    try {
      await dismissTransfer.mutateAsync({ alignTransferId });
      toast.success('Transfer dismissed');
    } catch (error) {
      console.error('Failed to dismiss transfer:', error);
      toast.error('Failed to dismiss transfer');
    } finally {
      setDismissingIds((prev) => {
        const next = new Set(prev);
        next.delete(alignTransferId);
        return next;
      });
    }
  };

  const handleResumeSuccess = () => {
    setResumeTransfer(null);
    utils.align.listOfframpTransfers.invalidate();
  };

  const isLoading = loadingIncoming || loadingOutgoing;

  // Check if it's a "no customer" error - treat as empty state, not error
  const incomingIsNoCustomer = isNoCustomerError(incomingError?.message);
  const outgoingIsNoCustomer = isNoCustomerError(outgoingError?.message);
  const isNoCustomerState = incomingIsNoCustomer || outgoingIsNoCustomer;

  // Only show error state for real errors, not "no customer" errors
  const isError =
    (errorIncoming && !incomingIsNoCustomer) ||
    (errorOutgoing && !outgoingIsNoCustomer);
  const errorMsg =
    (!incomingIsNoCustomer && incomingError?.message) ||
    (!outgoingIsNoCustomer && outgoingError?.message);

  // Combine and categorize transfers
  const { pendingTransfers, activeTransfers } = React.useMemo(() => {
    const inc =
      incoming?.map((t) => ({ ...t, _direction: 'incoming' as const })) ?? [];
    const out =
      outgoing?.map((t) => ({ ...t, _direction: 'outgoing' as const })) ?? [];
    const all = [...inc, ...out].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    // Pending = status is 'pending' (these require action like crypto deposit)
    // Active = everything else (processing, completed, failed, canceled)
    const pending = all.filter((t) => t.status === 'pending');
    const active = all.filter((t) => t.status !== 'pending');

    return { pendingTransfers: pending, activeTransfers: active };
  }, [incoming, outgoing]);

  const displaySyncError = syncError && !isError;
  const hasTransfers =
    pendingTransfers.length > 0 || activeTransfers.length > 0;

  return (
    <>
      <Card className="bg-white border-gray-200 rounded-lg shadow-sm">
        <CardHeader className="pb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Bank Transfers
          </h3>
          <p className="text-sm text-gray-500">
            Recent incoming and outgoing transfers.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {displaySyncError ? (
            <div className="flex items-center gap-2 px-6 py-3 text-sm text-amber-700 bg-amber-50 border-b border-amber-100">
              <AlertCircle className="h-4 w-4" />
              <span>{syncError}</span>
            </div>
          ) : null}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : isError ? (
            <div className="px-6 py-8">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Error loading transfers</p>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {errorMsg ||
                  syncError ||
                  'Could not fetch transfers. Please try again later.'}
              </p>
            </div>
          ) : !hasTransfers || isNoCustomerState ? (
            <div className="px-6 py-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#F7F7F2] flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#101010]/40" />
                </div>
              </div>
              <p className="text-[15px] font-medium text-[#101010] mb-1">
                No bank transfers yet
              </p>
              <p className="text-[13px] text-[#101010]/60 max-w-[300px] mx-auto">
                When you receive or send bank transfers, they will appear here.
              </p>
            </div>
          ) : (
            <div>
              {/* Pending Action Required Section */}
              {pendingTransfers.length > 0 && (
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setPendingExpanded(!pendingExpanded)}
                    className="w-full px-6 py-3 flex items-center justify-between bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        Pending Action ({pendingTransfers.length})
                      </span>
                    </div>
                    {pendingExpanded ? (
                      <ChevronUp className="h-4 w-4 text-amber-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-amber-600" />
                    )}
                  </button>
                  {pendingExpanded && (
                    <div className="divide-y divide-gray-200 bg-amber-50/30">
                      {pendingTransfers.map((tx) => (
                        <TransferRow
                          key={tx.id}
                          tx={tx}
                          // Only allow resume/dismiss for outgoing (offramp) transfers
                          onResume={
                            tx._direction === 'outgoing'
                              ? () =>
                                  setResumeTransfer(
                                    tx as OfframpTransfer & {
                                      _direction: 'outgoing';
                                    },
                                  )
                              : undefined
                          }
                          onDismiss={
                            tx._direction === 'outgoing'
                              ? () => handleDismiss(tx.id)
                              : undefined
                          }
                          isDismissing={dismissingIds.has(tx.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Active Transfers Section */}
              {activeTransfers.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {activeTransfers.map((tx) => (
                    <TransferRow key={tx.id} tx={tx} />
                  ))}
                </div>
              )}

              {/* Show message if only pending transfers exist */}
              {activeTransfers.length === 0 && pendingTransfers.length > 0 && (
                <div className="px-6 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No completed transfers yet. Complete a pending transfer to
                    see it here.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resume Transfer Modal */}
      {resumeTransfer && (
        <ResumeTransferModal
          transfer={resumeTransfer}
          isOpen={!!resumeTransfer}
          onClose={() => setResumeTransfer(null)}
          onSuccess={handleResumeSuccess}
        />
      )}
    </>
  );
}
