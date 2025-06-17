'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight, ArrowUpRight, ArrowDownLeft, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface TransactionItem {
  type: 'incoming' | 'outgoing' | 'module';
  title: string;
  description: string;
  amount: string;
  timestamp: Date;
}

const mockTransactions: TransactionItem[] = [
  {
    type: 'incoming',
    title: 'Received USDC',
    description: 'From Stripe Payout',
    amount: '+ $2,500.00',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'outgoing',
    title: 'Sent USDC',
    description: 'To Circle Inc.',
    amount: '- $1,000.00',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'module',
    title: 'Earn Yield',
    description: 'Deposited into Aave',
    amount: '- $500.00',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'incoming',
    title: 'Received USDC',
    description: 'From Coinbase',
    amount: '+ $1,250.00',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

const getTransactionIcon = (type: TransactionItem['type']) => {
  switch (type) {
    case 'incoming':
      return <ArrowDownLeft className="h-5 w-5" />;
    case 'outgoing':
      return <ArrowUpRight className="h-5 w-5" />;
    case 'module':
      return <Code className="h-5 w-5" />;
    default:
      return <Code className="h-5 w-5" />;
  }
};

const getTransactionColor = (type: TransactionItem['type']) => {
  switch (type) {
    case 'incoming':
      return 'bg-green-500';
    case 'outgoing':
      return 'bg-blue-500';
    case 'module':
      return 'bg-purple-500';
    default:
      return 'bg-gray-400';
  }
};

export function MockTransactionHistoryList() {
  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm mt-6">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
        <p className="text-sm text-gray-500">Primary Account activity.</p>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-100">
          {mockTransactions.map((tx, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={cn('text-white', getTransactionColor(tx.type))}>
                    {getTransactionIcon(tx.type)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-800">{tx.title}</p>
                  <p className="text-sm text-gray-500">{tx.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-semibold',
                  tx.type === 'incoming' ? 'text-green-600' : 'text-gray-800'
                )}>
                  {tx.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
} 