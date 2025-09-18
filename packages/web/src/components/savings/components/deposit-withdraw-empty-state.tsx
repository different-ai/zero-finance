'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ArrowDownToLine, Wallet, RefreshCw } from 'lucide-react';

interface DepositWithdrawEmptyStateProps {
  type: 'deposit' | 'withdraw';
  isLoadingStats?: boolean;
  hasNoVaultData?: boolean;
  onRefresh?: () => void;
}

export function DepositWithdrawEmptyState({
  type,
  isLoadingStats,
  hasNoVaultData,
  onRefresh,
}: DepositWithdrawEmptyStateProps) {
  const isDeposit = type === 'deposit';
  const Icon = isDeposit ? ArrowDownToLine : Wallet;
  const title = isDeposit ? 'Deposit Funds' : 'Withdraw Funds';

  if (isLoadingStats) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading vault information...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasNoVaultData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>
            {isDeposit
              ? 'Add funds to your savings vault'
              : 'Withdraw from your savings vault'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Vault initialization in progress</strong>
              <p className="mt-1">
                Your savings account has been set up, but the vault connection
                is still initializing. This usually takes a few moments after
                your first setup.
              </p>
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              {isDeposit
                ? "Once initialized, you'll be able to deposit USDC into your high-yield savings vault."
                : "Once initialized, you'll be able to withdraw your funds at any time with no penalties."}
            </p>
            <p className="text-sm text-muted-foreground">
              The vault earns approximately 8% APY through the Morpho × Gauntlet
              optimized yield strategy.
            </p>
          </div>

          {onRefresh && (
            <Button variant="outline" onClick={onRefresh} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Fallback for any other empty state
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            {isDeposit
              ? 'Deposit functionality is currently unavailable.'
              : 'Withdrawal functionality is currently unavailable.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
