import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { trpc, RouterOutputs } from '@/utils/trpc';
import { Loader2, AlertCircle, UploadCloud, Banknote } from 'lucide-react';
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

export function BankTransfersList() {
  const utils = trpc.useUtils();
  const [syncError, setSyncError] = React.useState<string | null>(null);
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
        setSyncError(message);
      } else {
        setSyncError(null);
      }
    };

    void runInitialSync();
  }, [syncOnramp, syncOfframp]);

  const isLoading = loadingIncoming || loadingOutgoing;
  const isError = errorIncoming || errorOutgoing;
  const errorMsg = incomingError?.message || outgoingError?.message;

  const transfers: CombinedTransfer[] = React.useMemo(() => {
    const inc =
      incoming?.map((t) => ({ ...t, _direction: 'incoming' as const })) ?? [];
    const out =
      outgoing?.map((t) => ({ ...t, _direction: 'outgoing' as const })) ?? [];
    return [...inc, ...out].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [incoming, outgoing]);

  const displaySyncError = syncError && !isError;

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
        ) : transfers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No bank transfers found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transfers.map((tx) => {
              const amountValue = Number(tx.amount ?? 0);
              const currencyCode =
                ('source_currency' in tx ? tx.source_currency : undefined) ??
                ('destination_currency' in tx
                  ? tx.destination_currency
                  : undefined) ??
                ('quote' in tx ? tx.quote?.deposit_currency : undefined);

              return (
                <div
                  key={tx.id}
                  className="w-full px-6 py-4 flex items-center gap-4"
                >
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
