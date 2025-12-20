import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import React from 'react';

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

// Transfer row component for reuse
function TransferRow({
  tx,
  onDismiss,
  isDismissing,
}: {
  tx: CombinedTransfer;
  onDismiss?: () => void;
  isDismissing?: boolean;
}) {
  const amountValue = Number(tx.amount ?? 0);
  const currencyCode =
    ('source_currency' in tx ? tx.source_currency : undefined) ??
    ('destination_currency' in tx ? tx.destination_currency : undefined) ??
    ('quote' in tx ? tx.quote?.deposit_currency : undefined);

  return (
    <div className="w-full px-6 py-4 flex items-center gap-4">
      <div
        className={`h-10 w-10 flex items-center justify-center rounded-full ${
          tx._direction === 'incoming'
            ? 'bg-emerald-600/10 text-emerald-600'
            : 'bg-sky-600/10 text-sky-600'
        }`}
      >
        {tx._direction === 'incoming' ? (
          <UploadCloud className="h-5 w-5" />
        ) : (
          <Banknote className="h-5 w-5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 font-medium truncate">
          {amountValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          {currencyCode ? currencyCode.toUpperCase() : ''}
        </p>
        <p className="text-gray-500 text-sm truncate">
          {tx._direction === 'incoming' ? 'Incoming' : 'Outgoing'} ·{' '}
          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
        </p>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          disabled={isDismissing}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 h-8 w-8 p-0"
          title="Dismiss transfer"
        >
          {isDismissing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}

export function BankTransfersList() {
  const utils = trpc.useUtils();
  const [syncError, setSyncError] = React.useState<string | null>(null);
  const [pendingExpanded, setPendingExpanded] = React.useState(true);
  const [dismissingIds, setDismissingIds] = React.useState<Set<string>>(
    new Set(),
  );
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
    } catch (error) {
      console.error('Failed to dismiss transfer:', error);
    } finally {
      setDismissingIds((prev) => {
        const next = new Set(prev);
        next.delete(alignTransferId);
        return next;
      });
    }
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
    <Card className="bg-white border-gray-200 rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Bank Transfers</h3>
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
                        // Only allow dismissing outgoing (offramp) transfers
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
                  No completed transfers yet. Complete a pending transfer to see
                  it here.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
