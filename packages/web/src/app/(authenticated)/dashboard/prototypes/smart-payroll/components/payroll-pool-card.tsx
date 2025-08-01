'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wallet, Plus, ArrowUpRight, AlertCircle } from 'lucide-react';
import { mockPayrollPool } from '../mock-data';
import { FundPoolModal } from './fund-pool-modal';

export function PayrollPoolCard() {
  const [showFundModal, setShowFundModal] = useState(false);
  const lowBalance = mockPayrollPool.totalValueUSD < mockPayrollPool.lowBalanceThreshold;

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Payroll Pool
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={() => setShowFundModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Fund Pool
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
              <p className="text-3xl font-bold">${mockPayrollPool.totalValueUSD.toLocaleString()}</p>
              <Progress 
                value={(mockPayrollPool.totalValueUSD / 50000) * 100} 
                className="mt-2"
              />
            </div>
            
            {/* Chain Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Ethereum */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Ethereum</p>
                  <span className="text-xs text-muted-foreground">
                    ${mockPayrollPool.balances.ethereum.valueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">USDC</span>
                    <span>{mockPayrollPool.balances.ethereum.USDC}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ETH</span>
                    <span>{mockPayrollPool.balances.ethereum.ETH}</span>
                  </div>
                </div>
              </div>
              
              {/* Base */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Base</p>
                  <span className="text-xs text-muted-foreground">
                    ${mockPayrollPool.balances.base.valueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">USDC</span>
                    <span>{mockPayrollPool.balances.base.USDC}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ETH</span>
                    <span>{mockPayrollPool.balances.base.ETH}</span>
                  </div>
                </div>
              </div>
              
              {/* Solana */}
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Solana</p>
                  <span className="text-xs text-muted-foreground">
                    ${mockPayrollPool.balances.solana.valueUSD.toLocaleString()}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">USDC</span>
                    <span>{mockPayrollPool.balances.solana.USDC}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SOL</span>
                    <span>{mockPayrollPool.balances.solana.SOL}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <p className="text-sm font-medium mb-3">Recent Activity</p>
              <div className="space-y-2">
                {mockPayrollPool.transactions.slice(0, 3).map((tx, idx) => (
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
      
      {showFundModal && (
        <FundPoolModal 
          open={showFundModal} 
          onClose={() => setShowFundModal(false)} 
        />
      )}
    </>
  );
}