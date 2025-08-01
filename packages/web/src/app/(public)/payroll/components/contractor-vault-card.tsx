'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, ArrowUpRight, AlertCircle, Building } from 'lucide-react';

interface ContractorVaultCardProps {
  qbSynced?: boolean;
}

export function ContractorVaultCard({ qbSynced = false }: ContractorVaultCardProps) {
  const [showFundModal, setShowFundModal] = useState(false);
  
  const mockVaultData = {
    totalValueUSD: 37500,
    lowBalanceThreshold: 5000,
    balances: {
      solana: { 
        USDC: '28000',
        SOL: '50',
        valueUSD: 28800
      },
      base: { 
        USDC: '8700',
        valueUSD: 8700
      }
    },
    transactions: [
      { 
        date: '2024-01-18', 
        type: 'payment' as const, 
        amount: '5000', 
        currency: 'USDC', 
        chain: 'solana' as const, 
        recipient: 'TechConsultants LLC',
        qbSynced: true
      },
      { 
        date: '2024-01-15', 
        type: 'deposit' as const, 
        amount: '20000', 
        currency: 'USDC', 
        chain: 'solana' as const,
      },
      { 
        date: '2024-01-12', 
        type: 'payment' as const, 
        amount: '3200', 
        currency: 'USDC', 
        chain: 'solana' as const, 
        recipient: 'DesignStudio.sol',
        qbSynced: true
      }
    ]
  };

  const lowBalance = mockVaultData.totalValueUSD < mockVaultData.lowBalanceThreshold;

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Contractor Payment Vault
              {qbSynced && (
                <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                  <Building className="h-3 w-3 mr-1" />
                  QuickBooks Connected
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setShowFundModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Fund Vault
              </Button>
              <Button variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Total Balance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                {lowBalance && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs">Low balance</span>
                  </div>
                )}
              </div>
              <p className="text-3xl font-bold">${mockVaultData.totalValueUSD.toLocaleString()}</p>
              <Progress 
                value={(mockVaultData.totalValueUSD / 50000) * 100} 
                className="mt-2"
              />
            </div>
            
            {/* Chain Balances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Solana */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-green-900 dark:text-green-100">Solana</p>
                  <span className="text-xs text-green-700 dark:text-green-300">
                    ${mockVaultData.balances.solana.valueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">USDC</span>
                    <span className="text-green-900 dark:text-green-100">{mockVaultData.balances.solana.USDC}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 dark:text-green-300">SOL</span>
                    <span className="text-green-900 dark:text-green-100">{mockVaultData.balances.solana.SOL}</span>
                  </div>
                </div>
              </div>
              
              {/* Base */}
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-purple-900 dark:text-purple-100">Base</p>
                  <span className="text-xs text-purple-700 dark:text-purple-300">
                    ${mockVaultData.balances.base.valueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-700 dark:text-purple-300">USDC</span>
                    <span className="text-purple-900 dark:text-purple-100">{mockVaultData.balances.base.USDC}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <p className="text-sm font-medium mb-3">Recent Activity</p>
              <div className="space-y-2">
                {mockVaultData.transactions.map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        tx.type === 'deposit' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-muted-foreground">
                        {tx.type === 'deposit' ? 'Deposited' : 'Paid'}
                      </span>
                      <span className="font-medium">
                        {tx.amount} {tx.currency}
                      </span>
                      {tx.recipient && (
                        <span className="text-muted-foreground">to {tx.recipient}</span>
                      )}
                      {tx.qbSynced && qbSynced && (
                        <Badge variant="outline" className="text-xs h-5">
                          <Building className="h-2 w-2 mr-1" />
                          QB
                        </Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}