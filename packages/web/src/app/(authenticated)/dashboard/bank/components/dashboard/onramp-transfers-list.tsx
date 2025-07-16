import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react';
import { trpc } from '@/utils/trpc';

export function OnrampTransfersList() {
  const {
    data: transfers,
    isLoading,
    isError,
    error,
  } = trpc.align.listOnrampTransfers.useQuery({ limit: 10 });

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">On-Ramp Transfers</h3>
        <p className="text-sm text-gray-500">Recent fiat deposits.</p>
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
              {error?.message ||
                'Could not fetch on-ramp transfers. Please try again later.'}
            </p>
          </div>
        ) : !transfers || transfers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No on-ramp transfers found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transfers.map((tx) => (
              <div
                key={tx.id}
                className="w-full px-6 py-4 flex items-center gap-4"
              >
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium truncate">
                    {parseFloat(tx.amount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    {tx.source_currency.toUpperCase()}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    Status: {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
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