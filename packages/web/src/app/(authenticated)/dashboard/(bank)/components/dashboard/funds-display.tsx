'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { shortenAddress } from '@/lib/utils/formatters';
import { type Address } from 'viem';

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
  primarySafeAddress?: Address;
}

export function FundsDisplay({ totalBalance = 0, primarySafeAddress }: FundsDisplayProps) {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-4xl font-bold text-green-800">{formatCurrency(totalBalance)}</div>
        {primarySafeAddress && (
          <p className="text-sm text-green-700 font-mono">
            Primary Account: {shortenAddress(primarySafeAddress)}
          </p>
        )}
        {!primarySafeAddress && (
          <p className="text-sm text-green-700">No primary account found.</p>
        )}
      </CardContent>
    </Card>
  );
} 