import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import {
  Loader2,
  AlertCircle,
  UploadCloud,
  Banknote,
  RefreshCw,
} from 'lucide-react';
import React from 'react';

export function BankTransfersList() {
  const utils = trpc.useUtils();

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
    onSuccess: () => {
      utils.align.listOnrampTransfers.invalidate();
    },
  });

  const syncOfframp = trpc.align.syncOfframpTransfers.useMutation({
    onSuccess: () => {
      utils.align.listOfframpTransfers.invalidate();
    },
  });

  const handleRefresh = () => {
    syncOnramp.mutate();
    syncOfframp.mutate();
  };

  const isSyncing = syncOnramp.isPending || syncOfframp.isPending;

  const isLoading = loadingIncoming || loadingOutgoing;
  const isError = errorIncoming || errorOutgoing;
  const errorMsg = incomingError?.message || outgoingError?.message;

  const transfers = React.useMemo(() => {
    const inc =
      incoming?.map((t) => ({ ...t, _direction: 'incoming' as const })) ?? [];
    const out =
      outgoing?.map((t) => ({ ...t, _direction: 'outgoing' as const })) ?? [];
    return [...inc, ...out];
  }, [incoming, outgoing]);

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Bank Transfers
            </h3>
            <p className="text-sm text-gray-500">
              Recent incoming and outgoing transfers.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isSyncing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
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
              {errorMsg || 'Could not fetch transfers. Please try again later.'}
            </p>
          </div>
        ) : transfers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No bank transfers found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transfers.map((tx: any) => (
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
                    {parseFloat(tx.amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    {tx.source_currency
                      ? tx.source_currency.toUpperCase()
                      : tx.destination_currency.toUpperCase()}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    {tx._direction === 'incoming' ? 'Incoming' : 'Outgoing'} ·{' '}
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
