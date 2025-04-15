'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, List, ExternalLink } from 'lucide-react';
import { useUserSafes } from '@/hooks/use-user-safes'; // To get the safe address
import { type Address } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { formatUnits } from 'viem';
import { trpc } from '@/utils/trpc'; // Correct tRPC import
import { type UserSafe } from '@/db/schema'; // Import UserSafe type if not already there

// Define structure for a transaction item
interface TransactionItem {
  type: 'incoming' | 'outgoing' | 'module' | 'creation';
  hash: string;
  timestamp: number;
  from?: string;
  to?: string;
  value?: string; 
  tokenAddress?: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  methodName?: string;
}

export function TransactionHistoryList() {
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  const primarySafeAddress = userSafesData?.find((s: UserSafe) => s.safeType === 'primary')?.safeAddress as Address | undefined;

  // Fetch transactions using tRPC query
  const { 
      data: transactionsData, 
      isLoading: isLoadingTransactions, 
      isError, 
      error 
  } = trpc.safe.getTransactions.useQuery(
      { safeAddress: primarySafeAddress! }, // Query input
      { enabled: !!primarySafeAddress } // Only run query when safeAddress is available
  );

  const isLoading = isLoadingSafes || (!!primarySafeAddress && isLoadingTransactions);

  const renderTransactionItem = (tx: TransactionItem) => {
    const timeAgo = formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true });
    let description = 'Unknown Transaction';
    let valueDisplay = null;
    const explorerUrl = `https://basescan.org/tx/${tx.hash}`;

    // Format value if available
    if (tx.value && tx.tokenDecimals !== undefined) {
        const formattedValue = formatUnits(BigInt(tx.value), tx.tokenDecimals);
        valueDisplay = `${formattedValue} ${tx.tokenSymbol || 'Tokens'}`;
    }

    // Basic descriptions based on type
    if (tx.type === 'incoming' && tx.from) {
        description = `Received ${valueDisplay || ''} from ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`;
    } else if (tx.type === 'outgoing' && tx.to) {
        description = `Sent ${valueDisplay || ''} to ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`;
    } else if (tx.type === 'module' && tx.methodName) {
        description = `Module Execution: ${tx.methodName}`;
    } else if (tx.type === 'creation') {
        description = 'Safe Creation';
    }

    return (
        <li key={tx.hash} className="flex items-center justify-between py-3 border-b last:border-b-0">
            <div className="flex-1 overflow-hidden">
                <p className="text-sm truncate" title={description}>{description}</p>
                <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
            <a 
                href={explorerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-4 p-1 text-gray-400 hover:text-primary rounded hover:bg-muted"
                title="View on Basescan"
            >
                <ExternalLink className="h-4 w-4" />
            </a>
        </li>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <List className="h-5 w-5 mr-2 text-primary" /> Transaction History
        </CardTitle>
        <CardDescription>Recent activity for your Primary Safe.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
        {isError && !isLoading && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Transactions</AlertTitle>
                <AlertDescription>
                {error?.message || 'Could not fetch transaction details. Please try again later.'}
                </AlertDescription>
            </Alert>
        )}
        {!isLoading && !isError && !primarySafeAddress && (
            <Alert variant="default">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Primary Safe Needed</AlertTitle>
                <AlertDescription>
                Connect your primary Safe to view transaction history.
                </AlertDescription>
            </Alert>
        )}
         {!isLoading && !isError && primarySafeAddress && (!transactionsData || transactionsData.length === 0) && (
             <p className="text-sm text-gray-500 text-center py-4">No transactions found for this Safe.</p>
        )}
        {!isLoading && !isError && primarySafeAddress && transactionsData && transactionsData.length > 0 && (
            <ul className="max-h-96 overflow-y-auto divide-y divide-border -mb-4">
                {transactionsData.map(renderTransactionItem)}
            </ul>
        )}
      </CardContent>
    </Card>
  );
} 