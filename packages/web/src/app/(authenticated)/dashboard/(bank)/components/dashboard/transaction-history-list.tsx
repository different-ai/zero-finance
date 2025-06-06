'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
  type: 'debit' | 'credit';
  icon?: string;
  description?: string;
  balance?: number;
}

// Mock data - in real app this would come from API
const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Different Ai',
    amount: -13.16,
    date: new Date('2024-06-08T12:03:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
    balance: -14.99,
  },
  {
    id: '2',
    name: 'Different Ai',
    amount: -13.16,
    date: new Date('2024-06-08T12:03:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
    balance: -14.99,
  },
  {
    id: '3',
    name: 'Audible',
    amount: -9.95,
    date: new Date('2024-06-04T14:52:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
  },
  {
    id: '4',
    name: 'Fitness Sf Fillmore E',
    amount: -2.64,
    date: new Date('2024-06-04T09:54:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
    balance: -3.00,
  },
  {
    id: '5',
    name: 'Proton',
    amount: -10.00,
    date: new Date('2024-06-02T12:10:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
  },
  {
    id: '6',
    name: 'Fitness Sf Fillmore E',
    amount: -88.38,
    date: new Date('2024-06-01T16:50:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
    balance: -99.95,
  },
  {
    id: '7',
    name: 'From EUR Metal cashback',
    amount: 1.14,
    date: new Date('2024-06-01T03:14:00'),
    status: 'completed',
    type: 'credit',
    description: 'Your balance was still negative so we tried to recover it from another pocket',
  },
  {
    id: '8',
    name: 'Audible',
    amount: -9.95,
    date: new Date('2024-05-31T14:52:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
  },
  {
    id: '9',
    name: 'Different Ai',
    amount: -13.26,
    date: new Date('2024-05-31T13:03:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
    balance: -14.99,
  },
  {
    id: '10',
    name: 'Audible',
    amount: -9.95,
    date: new Date('2024-05-27T14:52:00'),
    status: 'completed',
    type: 'debit',
    description: 'Insufficient balance – please top up',
  },
];

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
};

const formatCurrency = (amount: number): string => {
  const absAmount = Math.abs(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

export function TransactionHistoryList() {
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {mockTransactions.map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => setSelectedTransaction(transaction.id)}
              className={cn(
                "w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left",
                selectedTransaction === transaction.id && "bg-gray-50"
              )}
            >
              <Avatar className={cn("h-10 w-10", getAvatarColor(transaction.name))}>
                <AvatarFallback className="text-white font-medium">
                  {transaction.icon || getInitials(transaction.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium truncate">{transaction.name}</p>
                <p className="text-gray-500 text-sm truncate">
                  {transaction.description || formatDate(transaction.date)}
                </p>
              </div>
              
              <div className="text-right">
                <p className={cn(
                  "font-medium",
                  transaction.type === 'credit' ? 'text-green-600' : 'text-gray-800'
                )}>
                  {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                {transaction.balance !== undefined && (
                  <p className="text-gray-500 text-sm">
                    {transaction.balance < 0 ? '-' : ''}{formatCurrency(Math.abs(transaction.balance))}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            See all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 