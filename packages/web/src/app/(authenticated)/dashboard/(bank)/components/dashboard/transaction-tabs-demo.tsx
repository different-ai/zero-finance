'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, DollarSign } from 'lucide-react';
import { useDemoMode } from '@/context/demo-mode-context';
import { TransactionTabs } from './transaction-tabs';
import { formatUsd } from '@/lib/utils';

function DemoTransactionHistory() {
  const { demoStep } = useDemoMode();

  if (demoStep < 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </CardContent>
      </Card>
    );
  }

  const transactions = [
    ...(demoStep >= 3
      ? [
          {
            id: 'demo-1',
            type: 'deposit',
            amount: 2500000,
            description: 'Initial treasury deposit',
            from: 'Chase Bank',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
    ...(demoStep >= 4
      ? [
          {
            id: 'demo-2',
            type: 'payment',
            amount: 45000,
            description: 'AWS Infrastructure',
            to: 'Amazon Web Services',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'completed',
          },
          {
            id: 'demo-3',
            type: 'payment',
            amount: 125000,
            description: 'Monthly Payroll',
            to: 'Gusto Payroll',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
    ...(demoStep >= 5
      ? [
          {
            id: 'demo-4',
            type: 'savings',
            amount: 200000,
            description: 'Auto-save to Seamless vault (8% APY)',
            to: 'Seamless USDC Vault',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
    ...(demoStep >= 6
      ? [
          {
            id: 'demo-5',
            type: 'yield',
            amount: 43.84, // Daily yield on $200k at 8% APY
            description: 'Yield earned',
            from: 'Seamless Vault',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            status: 'completed',
          },
        ]
      : []),
  ];

  return (
    <Tabs defaultValue="bank" className="w-full">
      <TabsList className="mb-4 overflow-x-auto">
        <TabsTrigger value="bank">Bank Transfers</TabsTrigger>
        <TabsTrigger value="crypto">Crypto Transfers</TabsTrigger>
      </TabsList>

      <TabsContent value="bank">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type === 'deposit' || tx.type === 'yield'
                          ? 'bg-green-100'
                          : tx.type === 'savings'
                            ? 'bg-blue-100'
                            : 'bg-orange-100'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'yield' ? (
                        <ArrowDownLeft
                          className={`h-4 w-4 ${
                            tx.type === 'yield'
                              ? 'text-green-700'
                              : 'text-green-600'
                          }`}
                        />
                      ) : (
                        <ArrowUpRight
                          className={`h-4 w-4 ${
                            tx.type === 'savings'
                              ? 'text-blue-600'
                              : 'text-orange-600'
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {tx.from || tx.to} •{' '}
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        tx.type === 'deposit' || tx.type === 'yield'
                          ? 'text-green-600'
                          : tx.type === 'savings'
                            ? 'text-blue-600'
                            : 'text-orange-600'
                      }`}
                    >
                      {tx.type === 'deposit' || tx.type === 'yield' ? '+' : '-'}
                      {formatUsd(tx.amount)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="crypto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Crypto Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions
                .filter((tx) => tx.type === 'savings' || tx.type === 'yield')
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === 'yield' ? 'bg-green-100' : 'bg-blue-100'
                        }`}
                      >
                        <DollarSign
                          className={`h-4 w-4 ${
                            tx.type === 'yield'
                              ? 'text-green-600'
                              : 'text-blue-600'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          USDC on Base •{' '}
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === 'yield'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {tx.type === 'yield' ? '+' : ''}
                        {formatUsd(tx.amount)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        On-chain
                      </Badge>
                    </div>
                  </div>
                ))}
              {transactions.filter(
                (tx) => tx.type === 'savings' || tx.type === 'yield',
              ).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No crypto transactions yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export function TransactionTabsDemo() {
  const { isDemoMode } = useDemoMode();

  if (isDemoMode) {
    return <DemoTransactionHistory />;
  }

  return <TransactionTabs />;
}
