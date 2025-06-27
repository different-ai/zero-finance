import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertCircle, Banknote, Loader2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { formatDistanceToNow } from 'date-fns';
import dayjs from 'dayjs';

function formatDate(date: Date): string {
  const now = new Date();
  const diffDays = dayjs(now).diff(dayjs(date), 'day');
  if (diffDays === 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export function OfframpTransfersList() {
  const {
    data: transfers,
    isLoading,
    isError,
    error,
  } = trpc.align.listOfframpTransfers.useQuery({ limit: 10 });

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Off-Ramp Transfers</h3>
        <p className="text-sm text-gray-500">Recent fiat withdrawals.</p>
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
              {error?.message || 'Could not fetch off-ramp transfers. Please try again later.'}
            </p>
          </div>
        ) : !transfers || transfers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No off-ramp transfers found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transfers.map((tx) => (
              <div key={tx.id} className="w-full px-6 py-4 flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-sky-600/10 text-sky-600">
                  <Banknote className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium truncate">
                    {parseFloat(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {tx.destination_currency.toUpperCase()}
                  </p>
                  <p className="text-gray-500 text-sm truncate">
                    Status: {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)} · {formatDate(new Date(tx.created_at ?? tx.createdAt ?? new Date()))}
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