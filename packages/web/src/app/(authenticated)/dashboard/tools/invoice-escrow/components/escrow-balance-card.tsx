'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Lock, ArrowUpRight } from 'lucide-react';
import { formatEther } from 'viem';
import { api } from '@/trpc/react';

export function EscrowBalanceCard() {
  // Fetch escrow balance data
  const { data: escrowData, isLoading } = api.invoiceEscrow.getEscrowBalance.useQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrow Balance Overview</CardTitle>
        <CardDescription>
          Your current wallet and escrow balances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="text-xl font-semibold">
                {isLoading ? '...' : escrowData?.walletBalance ? 
                  `${parseFloat(formatEther(BigInt(escrowData.walletBalance))).toFixed(4)} ETH` : 
                  '0.0000 ETH'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Lock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Locked in Escrow</p>
              <p className="text-xl font-semibold">
                {isLoading ? '...' : escrowData?.lockedBalance ? 
                  `${parseFloat(formatEther(BigInt(escrowData.lockedBalance))).toFixed(4)} ETH` : 
                  '0.0000 ETH'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Released</p>
              <p className="text-xl font-semibold">
                {isLoading ? '...' : escrowData?.totalReleased ? 
                  `${parseFloat(formatEther(BigInt(escrowData.totalReleased))).toFixed(4)} ETH` : 
                  '0.0000 ETH'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}