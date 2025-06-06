'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface FundsDisplayProps {
  totalBalance?: number;
}

export function FundsDisplay({ totalBalance = 0 }: FundsDisplayProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-green-800">{formatCurrency(totalBalance)}</div>
      </CardContent>
    </Card>
  );
} 