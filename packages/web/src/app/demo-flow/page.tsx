'use client';

import React, { useEffect, useState } from 'react';
import { DemoModeProvider, useDemoMode } from '@/providers/demo-mode-provider';
import { DemoOverlay } from '@/components/demo/demo-overlay';
import { FundsDisplay } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/funds-display';
import { TransactionTabs } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard/transaction-tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatUsd } from '@/lib/utils';
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  TrendingUp,
  Wallet,
  Settings,
  Info,
  ChevronRight,
  Sparkles,
  Shield,
  Clock,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import BaseLogo from 'public/logos/_base-logo.svg';

function DemoDashboard() {
  const demo = useDemoMode();
  const [selectedVault, setSelectedVault] = useState<string | null>(null);

  // Auto-navigate based on demo step
  useEffect(() => {
    if (demo.currentStep === 'savings-page' && typeof window !== 'undefined') {
      // Scroll to savings section
      document
        .getElementById('savings-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [demo.currentStep]);

  const isShowingEmptyState = demo.currentStep === 'empty-dashboard';
  const isShowingFunds = [
    'funded-dashboard',
    'savings-page',
    'activate-savings',
    'savings-active',
    'withdrawal',
  ].includes(demo.currentStep);
  const isShowingSavings = [
    'savings-page',
    'activate-savings',
    'savings-active',
    'withdrawal',
  ].includes(demo.currentStep);

  return (
    <div className="min-h-screen bg-background">
      {/* Main app header - mimicking your real app */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <span className="font-semibold text-lg">Zero Finance</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-primary">
                Dashboard
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Savings
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Transactions
              </a>
              <a
                href="#"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Settings
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="hidden sm:flex">
              <Building2 className="h-3 w-3 mr-1" />
              TechStartup Inc.
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Funds Display - Using real component with demo data */}
        <div className={isShowingEmptyState ? 'opacity-50' : ''}>
          <FundsDisplay
            totalBalance={isShowingFunds ? demo.demoBalance : 0}
            walletAddress="0x742d35Cc6634C0532AD746845C9E38e21a1E7"
          />
        </div>

        {/* Quick Actions */}
        {isShowingFunds && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Monthly Burn</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$140,000</div>
                <p className="text-xs text-muted-foreground">
                  18 months runway
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Savings Rate</CardTitle>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {demo.demoSavingsEnabled ? '8.0%' : '0%'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {demo.demoSavingsEnabled ? 'APY on savings' : 'Not activated'}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Yield Earned</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  +${demo.demoYieldEarned.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions */}
        {isShowingFunds && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demo.demoTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === 'deposit' ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tx.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.amount > 0 ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {formatUsd(Math.abs(tx.amount))}
                      </p>
                      {tx.category && (
                        <Badge variant="outline" className="text-xs">
                          {tx.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Savings Section */}
        {isShowingSavings && (
          <div id="savings-section" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Savings</h2>
              <p className="text-muted-foreground">
                Grow your wealth with high-yield vaults on Base
              </p>
            </div>

            {demo.demoSavingsEnabled && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium mb-1">Auto-Savings Active</h3>
                      <p className="text-sm text-muted-foreground">
                        Saving 20% of deposits automatically at 8% APY
                      </p>
                    </div>
                    <Badge className="bg-primary text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Available Vaults</h3>
                  <p className="text-sm text-muted-foreground">
                    USDC vaults on Base
                  </p>
                </div>
                <Image src={BaseLogo} alt="Base" width={48} height={48} />
              </div>

              {/* Vault options */}
              {[
                {
                  id: 'seamless',
                  name: 'Seamless Protocol',
                  apy: 8.0,
                  risk: 'Conservative',
                  balance: demo.demoSavingsEnabled
                    ? demo.demoSavingsBalance
                    : 0,
                  isAuto: true,
                },
                {
                  id: 'moonwell',
                  name: 'Moonwell',
                  apy: 5.2,
                  risk: 'Conservative',
                  balance: 0,
                  isAuto: false,
                },
                {
                  id: 'aave',
                  name: 'Aave V3',
                  apy: 12.5,
                  risk: 'Balanced',
                  balance: 0,
                  isAuto: false,
                },
              ].map((vault) => (
                <Card
                  key={vault.id}
                  className={`${
                    vault.isAuto && demo.demoSavingsEnabled
                      ? 'border-primary/20 bg-primary/5'
                      : ''
                  } ${selectedVault === vault.id ? 'ring-2 ring-primary' : ''}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{vault.name}</h3>
                          {vault.isAuto && demo.demoSavingsEnabled && (
                            <Badge variant="secondary" className="text-xs">
                              AUTO
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            vault.risk === 'Conservative'
                              ? 'text-green-600 border-green-600'
                              : 'text-yellow-600 border-yellow-600'
                          }
                        >
                          {vault.risk}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className="font-semibold">
                          {formatUsd(vault.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">APY</p>
                        <p className="font-semibold text-primary">
                          {vault.apy}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-semibold">
                          {vault.balance > 0 ? 'Active' : 'Available'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant={
                          selectedVault === vault.id ? 'default' : 'outline'
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedVault(vault.id)}
                      >
                        {vault.balance > 0 ? 'Manage' : 'Deposit'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Demo Overlay */}
      <DemoOverlay />
    </div>
  );
}

export default function DemoFlowPage() {
  return (
    <DemoModeProvider>
      <DemoDashboard />
    </DemoModeProvider>
  );
}
