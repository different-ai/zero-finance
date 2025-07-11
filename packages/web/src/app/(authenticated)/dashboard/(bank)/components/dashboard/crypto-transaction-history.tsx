'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, ExternalLink, Loader2, AlertCircle, ArrowUpRight, ArrowDownLeft, Code, Shield, Plus, TrendingUp, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserSafes } from '@/hooks/use-user-safes';
import type { Address } from 'viem';
import { formatUnits } from 'viem';
import { trpc } from '@/utils/trpc';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/lib/constants';

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
  swept?: boolean;
  sweptPercentage?: number;
  sweptAmount?: string;
  sweptTxHash?: string;
}

const formatDate = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `about ${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  
  // Otherwise, show the date
  return new Date(timestamp).toLocaleDateString();
};

const formatCurrency = (value: string, decimals: number, symbol: string): string => {
  const formatted = formatUnits(BigInt(value), decimals);
  const num = parseFloat(formatted);
  
  // Format with appropriate decimal places
  const displayValue = num < 0.01 && num > 0 
    ? '<0.01' 
    : num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  
  return `${displayValue} ${symbol}`;
};

const getTransactionIcon = (type: TransactionItem['type']) => {
  switch (type) {
    case 'incoming':
      return <ArrowDownLeft className="h-5 w-5" />;
    case 'outgoing':
      return <ArrowUpRight className="h-5 w-5" />;
    case 'module':
      return <Code className="h-5 w-5" />;
    case 'creation':
      return <Plus className="h-5 w-5" />;
    default:
      return <Shield className="h-5 w-5" />;
  }
};

const getTransactionColor = (type: TransactionItem['type'], methodName?: string) => {
  // For module transactions, check the method name for specific colors
  if (type === 'module' && methodName) {
    switch (methodName.toLowerCase()) {
      case 'transfer':
      case 'transferfrom':
        return 'bg-[#0050ff]'; // Same as outgoing
      case 'redeem':
      case 'withdraw':
        return 'bg-orange-500'; // Withdrawals
      case 'deposit':
        return 'bg-green-500'; // Same as incoming
      case 'swap':
        return 'bg-purple-500'; // Swaps
      case 'approve':
        return 'bg-gray-500'; // Approvals
      default:
        return 'bg-purple-500'; // Default module color
    }
  }
  
  switch (type) {
    case 'incoming':
      return 'bg-green-500';
    case 'outgoing':
      return 'bg-[#0050ff]';
    case 'module':
      return 'bg-purple-500';
    case 'creation':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getTransactionTitle = (tx: TransactionItem): string => {
  // Check if this is a token transfer
  if (tx.tokenSymbol && (tx.type === 'incoming' || tx.type === 'outgoing')) {
    return tx.type === 'incoming' ? `Received ${tx.tokenSymbol}` : `Sent ${tx.tokenSymbol}`;
  }
  
  // Check method name for token transfers in module executions
  if (tx.type === 'module' && tx.methodName === 'transfer' && tx.tokenSymbol) {
    return `Sent ${tx.tokenSymbol}`;
  }
  
  if (tx.type === 'module' && tx.methodName === 'transferFrom' && tx.tokenSymbol) {
    return `Transfer ${tx.tokenSymbol}`;
  }
  
  // ETH transfers
  if ((tx.type === 'incoming' || tx.type === 'outgoing') && !tx.tokenSymbol) {
    return tx.type === 'incoming' ? 'Received ETH' : 'Sent ETH';
  }
  
  switch (tx.type) {
    case 'module':
      // Special handling for common module executions
      if (tx.methodName === 'redeem') return 'Redeemed';
      if (tx.methodName === 'withdraw') return 'Withdrawal';
      if (tx.methodName === 'deposit') return 'Deposit';
      if (tx.methodName === 'swap') return 'Swap';
      if (tx.methodName === 'approve') return 'Approval';
      if (tx.methodName) {
        // Capitalize first letter of method name
        return tx.methodName.charAt(0).toUpperCase() + tx.methodName.slice(1);
      }
      return 'Contract Interaction';
    case 'creation':
      return 'Safe Creation';
    default:
      return 'Unknown Transaction';
  }
};

const getTransactionDescription = (transaction: TransactionItem): string => {
  // Check if this is a swept transaction
  if (transaction.swept && transaction.sweptPercentage) {
    return `${transaction.sweptPercentage}% auto-saved • $${formatUnits(BigInt(transaction.sweptAmount || '0'), USDC_DECIMALS)}`;
  }
  
  // Original logic
  if (transaction.from) {
    const fromAddress = transaction.from.slice(0, 6) + '...' + transaction.from.slice(-4);
    if (transaction.type === 'incoming') {
      return `from ${fromAddress}`;
    } else if (transaction.type === 'outgoing' && transaction.to) {
      const toAddress = transaction.to.slice(0, 6) + '...' + transaction.to.slice(-4);
      return `to ${toAddress}`;
    }
  }
  
  if (transaction.type === 'module' && transaction.to) {
    const contractAddress = transaction.to.slice(0, 6) + '...' + transaction.to.slice(-4);
    return `Contract ${contractAddress}`;
  }
  
  if (transaction.type === 'creation') {
    return 'Safe deployment';
  }
  
  return 'Transaction';
};

export function CryptoTransactionHistory() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  const primarySafeAddress = userSafesData?.find((s) => s.safeType === 'primary')?.safeAddress as Address | undefined;

  // Debug logging
  console.log('[CryptoTransactionHistory] User safes data:', userSafesData);
  console.log('[CryptoTransactionHistory] Primary safe address:', primarySafeAddress);

  // Fetch enriched transactions using new endpoint
  const { 
    data: transactionsData, 
    isLoading: isLoadingTransactions, 
    isError, 
    error,
    refetch 
  } = trpc.safe.getEnrichedTransactions.useQuery(
    { safeAddress: primarySafeAddress!, limit: 10, syncFromBlockchain: true },
    { 
      enabled: !!primarySafeAddress,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0, // Data is immediately stale
      gcTime: 0, // Don't keep in cache after unmount (replaces cacheTime)
    }
  );

  // Debug logging for transactions
  console.log('[CryptoTransactionHistory] Transactions data:', transactionsData);

  const isLoading = isLoadingSafes || (!!primarySafeAddress && isLoadingTransactions);

  // Filter to show only USDC transactions
  const recentTransactions = (transactionsData || []).filter(tx => 
    tx.tokenSymbol === 'USDC' || 
    (tx.tokenAddress && tx.tokenAddress.toLowerCase() === USDC_ADDRESS.toLowerCase())
  );
  
  const handleTransactionClick = (hash: string) => {
    window.open(`https://basescan.org/tx/${hash}`, '_blank');
  };

  const handleSweptTransactionClick = (sweptTxHash: string) => {
    window.open(`https://basescan.org/tx/${sweptTxHash}`, '_blank');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">USDC Transaction History</h3>
          <p className="text-sm text-gray-500">Primary Account USDC activity.</p>
        </div>
        {primarySafeAddress && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        )}
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
              <p className="text-sm font-medium">Error loading transactions</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {error?.message || 'Could not fetch transaction details. Please try again later.'}
            </p>
          </div>
        ) : !primarySafeAddress ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">Connect your primary Safe to view transaction history.</p>
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No USDC transactions found for this Safe.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <div key={transaction.hash} className="relative">
                  <button
                    onClick={() => handleTransactionClick(transaction.hash)}
                    className={cn(
                      "w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group",
                      selectedTransaction === transaction.hash && "bg-gray-50"
                    )}
                  >
                    <Avatar className={cn("h-10 w-10", getTransactionColor(transaction.type, transaction.methodName))}>
                      <AvatarFallback className="text-white">
                        {getTransactionIcon(transaction.type)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 font-medium truncate">
                          {getTransactionTitle(transaction)}
                        </p>
                        {transaction.swept && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <TrendingUp className="h-3 w-3" />
                            Saved
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm truncate">
                        {getTransactionDescription(transaction)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        {transaction.value && (
                          <p className="text-gray-800 font-medium">
                            {transaction.tokenSymbol === 'USDC' 
                              ? `$${formatUnits(BigInt(transaction.value), USDC_DECIMALS)}`
                              : transaction.tokenSymbol && transaction.tokenDecimals
                                ? `${formatUnits(BigInt(transaction.value), transaction.tokenDecimals)} ${transaction.tokenSymbol}`
                                : transaction.tokenSymbol
                                  ? `${transaction.value} ${transaction.tokenSymbol}`
                                  : `${formatUnits(BigInt(transaction.value), 18)} ETH`
                            }
                          </p>
                        )}
                        <p className="text-gray-500 text-sm">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                  
                  {/* Swept transaction link */}
                  {transaction.swept && transaction.sweptTxHash && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSweptTransactionClick(transaction.sweptTxHash!);
                      }}
                      className="absolute right-6 bottom-1 text-xs text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      View savings tx
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full text-[#0050ff] hover:text-[#0050ff]/90 hover:bg-[#0050ff]/5"
                onClick={() => window.open(`https://basescan.org/address/${primarySafeAddress}`, '_blank')}
              >
                View all on Basescan
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 