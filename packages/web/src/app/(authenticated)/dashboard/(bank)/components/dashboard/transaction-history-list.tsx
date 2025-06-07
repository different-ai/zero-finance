'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, ExternalLink, Loader2, AlertCircle, ArrowUpRight, ArrowDownLeft, Code, Shield, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserSafes } from '@/hooks/use-user-safes';
import { type Address } from 'viem';
import { formatDistanceToNow } from 'date-fns';
import { formatUnits } from 'viem';
import { trpc } from '@/utils/trpc';

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

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (diffDays === 1) {
    return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
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

const getTransactionIcon = (type: TransactionItem['type'], methodName?: string) => {
  // For module transactions, check the method name for specific icons
  if (type === 'module' && methodName) {
    switch (methodName.toLowerCase()) {
      case 'transfer':
      case 'transferfrom':
        return <ArrowUpRight className="h-5 w-5" />;
      case 'redeem':
      case 'withdraw':
        return <ArrowDownLeft className="h-5 w-5" />;
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5" />;
      case 'swap':
        return <Code className="h-5 w-5" />;
      case 'approve':
        return <Shield className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  }
  
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
        return 'bg-blue-500'; // Same as outgoing
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
      return 'bg-blue-500';
    case 'module':
      return 'bg-purple-500';
    case 'creation':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
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

const getTransactionDescription = (tx: TransactionItem): string => {
  // For token transfers, show amount and from/to
  if (tx.value && tx.tokenDecimals !== undefined && tx.value !== '0') {
    const amount = formatCurrency(tx.value, tx.tokenDecimals, tx.tokenSymbol || 'Unknown');
    
    if (tx.type === 'incoming' && tx.from) {
      return `${amount} from ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`;
    } else if (tx.type === 'outgoing' && tx.to) {
      return `${amount} to ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`;
    } else if (tx.type === 'module' && (tx.methodName === 'transfer' || tx.methodName === 'transferFrom')) {
      // For token transfers via module execution
      if (tx.to) {
        return `${amount} to ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`;
      }
      return amount;
    } else {
      return amount;
    }
  }
  
  // For ETH transfers without token info
  if (tx.value && tx.value !== '0' && !tx.tokenSymbol) {
    try {
      const ethAmount = formatUnits(BigInt(tx.value), 18);
      const formattedEth = parseFloat(ethAmount).toFixed(4);
      
      if (tx.type === 'incoming' && tx.from) {
        return `${formattedEth} ETH from ${tx.from.slice(0, 6)}...${tx.from.slice(-4)}`;
      } else if (tx.type === 'outgoing' && tx.to) {
        return `${formattedEth} ETH to ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`;
      }
      return `${formattedEth} ETH`;
    } catch (e) {
      // Fallback if formatting fails
    }
  }
  
  // For module executions, show the contract interacted with
  if (tx.type === 'module' && tx.to) {
    return `Contract: ${tx.to.slice(0, 6)}...${tx.to.slice(-4)}`;
  }
  
  return formatDate(tx.timestamp);
};

export function TransactionHistoryList() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const { data: userSafesData, isLoading: isLoadingSafes } = useUserSafes();
  const primarySafeAddress = userSafesData?.find((s) => s.safeType === 'primary')?.safeAddress as Address | undefined;

  // Fetch transactions using tRPC query
  const { 
    data: transactionsData, 
    isLoading: isLoadingTransactions, 
    isError, 
    error 
  } = trpc.safe.getTransactions.useQuery(
    { safeAddress: primarySafeAddress! },
    { enabled: !!primarySafeAddress }
  );

  const isLoading = isLoadingSafes || (!!primarySafeAddress && isLoadingTransactions);

  // Limit to 10 most recent transactions for the dashboard view
  const recentTransactions = transactionsData?.slice(0, 10) || [];

  const handleTransactionClick = (hash: string) => {
    window.open(`https://basescan.org/tx/${hash}`, '_blank');
  };

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
        <p className="text-sm text-gray-500">Primary Account activity.</p>
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
            <p className="text-sm text-gray-500">No transactions found for this Safe.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <button
                  key={transaction.hash}
                  onClick={() => handleTransactionClick(transaction.hash)}
                  className={cn(
                    "w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left group",
                    selectedTransaction === transaction.hash && "bg-gray-50"
                  )}
                >
                  <Avatar className={cn("h-10 w-10", getTransactionColor(transaction.type, transaction.methodName))}>
                    <AvatarFallback className="text-white">
                      {getTransactionIcon(transaction.type, transaction.methodName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 font-medium truncate">
                      {getTransactionTitle(transaction)}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      {getTransactionDescription(transaction)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-gray-500 text-sm">
                        {formatDate(transaction.timestamp)}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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