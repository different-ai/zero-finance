'use client';

import { type Address } from 'viem';
import { useEarnStats } from '../hooks/use-earn-stats';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatAmount, shortenAddress } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { Info, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsCardProps {
  safeAddress?: Address;
}

export function StatsCard({ safeAddress }: StatsCardProps) {
  const { data: stats, isLoading, isError, error } = useEarnStats(safeAddress);

  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Safe Address Required</AlertTitle>
            <AlertDescription>
              Please select or configure a primary safe to view earn statistics.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Performance</CardTitle>
          <CardDescription>Loading statistics for {shortenAddress(safeAddress)}...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Stats</AlertTitle>
            <AlertDescription>
              Could not load earn statistics: {error?.message || 'Unknown error'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Performance</CardTitle>
          <CardDescription>For Safe: {shortenAddress(safeAddress)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>No Deposits Found</AlertTitle>
            <AlertDescription>
              There are no recorded auto-earn deposits for this Safe yet. 
              Once deposits are made via the Earn Module, their performance will appear here.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-green-500" /> Auto-Earn Performance
        </CardTitle>
        <CardDescription>Track the growth of your assets in various vaults for Safe: {shortenAddress(safeAddress)}.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vault</TableHead>
              <TableHead>Token</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">Current Value</TableHead>
              <TableHead className="text-right">Yield</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((row) => (
              <TableRow key={row.vaultAddress}>
                <TableCell title={row.vaultAddress}>{shortenAddress(row.vaultAddress)}</TableCell>
                <TableCell title={row.tokenAddress}>{shortenAddress(row.tokenAddress)}</TableCell>
                <TableCell className="text-right">
                  {formatAmount(row.principal, row.tokenDecimals, 8)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(row.currentAssets, row.tokenDecimals, 8)}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-medium',
                    row.yield > 0n ? 'text-green-600' : row.yield < 0n ? 'text-red-600' : 'text-muted-foreground'
                  )}
                >
                  {row.yield === 0n ? '' : (row.yield > 0n ? '+' : '')}
                  {formatAmount(row.yield, row.tokenDecimals, 8)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 