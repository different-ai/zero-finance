'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Simple currency formatter for USD amounts
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
import { type Address } from 'viem';
import { Wallet, Building2, ArrowRight } from 'lucide-react';

interface SafeData {
  safeAddress: Address;
  safeType: 'primary' | 'secondary';
  name?: string;
}

interface VirtualAccountDetails {
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
  balance?: number;
}

interface FundsDisplayProps {
  safes: SafeData[];
  balances: Record<string, any>;
  virtualAccountDetails: VirtualAccountDetails | null;
}

export function FundsDisplay({ safes, balances, virtualAccountDetails }: FundsDisplayProps) {
  // Calculate total balance across all safes
  const totalCryptoBalance = safes.reduce((total, safe) => {
    const balance = balances[safe.safeAddress];
    if (balance && typeof balance.formatted === 'string') {
      return total + parseFloat(balance.formatted);
    }
    return total;
  }, 0);

  const virtualBalance = virtualAccountDetails?.balance || 0;
  const totalBalance = totalCryptoBalance + virtualBalance;

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200/60 rounded-2xl shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Your Funds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Balance Overview */}
        <div className="bg-white/60 rounded-xl p-4 border border-emerald-200/40">
          <div className="text-sm text-green-700 mb-1">Total Balance</div>
          <div className="text-3xl font-bold text-green-800">
            {formatCurrency(totalBalance)}
          </div>
        </div>

        {/* Virtual Account Balance */}
        {virtualAccountDetails && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <Building2 className="h-4 w-4" />
              Virtual Bank Account
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-emerald-200/40">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-green-600">USD Balance</div>
                  <div className="font-semibold text-green-800">
                    {formatCurrency(virtualBalance)}
                  </div>
                </div>
                {virtualAccountDetails.bankName && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    {virtualAccountDetails.bankName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Crypto Safes */}
        {safes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <Wallet className="h-4 w-4" />
              Crypto Wallets ({safes.length})
            </div>
            
            <div className="space-y-2">
              {safes.map((safe) => {
                const balance = balances[safe.safeAddress];
                const formattedBalance = balance?.formatted ? parseFloat(balance.formatted) : 0;
                
                return (
                  <div 
                    key={safe.safeAddress}
                    className="bg-white/60 rounded-lg p-3 border border-emerald-200/40"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-green-800">
                            {safe.name || `${safe.safeType === 'primary' ? 'Primary' : 'Secondary'} Safe`}
                          </span>
                          <Badge 
                            variant={safe.safeType === 'primary' ? 'default' : 'secondary'}
                            className={safe.safeType === 'primary' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : ''}
                          >
                            {safe.safeType}
                          </Badge>
                        </div>
                        <div className="text-xs text-green-600 font-mono">
                          {safe.safeAddress.slice(0, 6)}...{safe.safeAddress.slice(-4)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600">USDC</div>
                        <div className="font-semibold text-green-800">
                          {formatCurrency(formattedBalance)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalCryptoBalance > 0 && (
              <div className="bg-white/60 rounded-lg p-3 border border-emerald-200/40">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-700">Total Crypto</span>
                  <span className="font-semibold text-green-800">
                    {formatCurrency(totalCryptoBalance)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {safes.length === 0 && !virtualAccountDetails && (
          <div className="text-center py-6 text-green-600">
            <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No funds available yet</p>
            <p className="text-xs opacity-75">Connect your wallet or add funds to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 