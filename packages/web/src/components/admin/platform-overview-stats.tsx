'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { api } from '@/trpc/react';

export function PlatformOverviewStats() {
  const { data: platformStats, isLoading: isLoadingStats } =
    api.admin.getPlatformStats.useQuery(undefined, {
      refetchInterval: 60_000, // Refetch every 60 seconds
      staleTime: 50_000, // Consider data stale after 50 seconds
    });

  const { data: usersData, isLoading: isLoadingUsers } =
    api.admin.listUsers.useQuery(undefined, {
      refetchInterval: 120_000, // Refetch every 2 minutes
      staleTime: 110_000,
    });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Platform Overview</CardTitle>
        <CardDescription>Key metrics and platform statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Value</span>
            </div>
            {isLoadingStats ? (
              <div className="text-xl font-bold text-gray-400">Loading...</div>
            ) : platformStats ? (
              <div className="text-2xl font-bold">
                $
                {(Number(platformStats.totalValue) / 1_000_000).toLocaleString(
                  'en-US',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">—</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Value in Safes</span>
            </div>
            {isLoadingStats ? (
              <div className="text-xl font-bold text-gray-400">Loading...</div>
            ) : platformStats ? (
              <div className="text-2xl font-bold">
                $
                {(Number(platformStats.inSafes) / 1_000_000).toLocaleString(
                  'en-US',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">—</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Value in Vaults</span>
            </div>
            {isLoadingStats ? (
              <div className="text-xl font-bold text-gray-400">Loading...</div>
            ) : platformStats ? (
              <div className="text-2xl font-bold">
                $
                {(Number(platformStats.inVaults) / 1_000_000).toLocaleString(
                  'en-US',
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">—</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Total Users</span>
            </div>
            {isLoadingUsers ? (
              <div className="text-xl font-bold text-gray-400">Loading...</div>
            ) : (
              <div className="text-2xl font-bold">{usersData?.length || 0}</div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>KYC Approved</span>
            </div>
            {isLoadingUsers ? (
              <div className="text-xl font-bold text-gray-400">Loading...</div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {usersData?.filter((u: any) => u.kycStatus === 'approved')
                  .length || 0}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 text-yellow-600" />
              <span>KYC Pending</span>
            </div>
            {isLoadingUsers ? (
              <div className="text-xl font-bold text-gray-400">Loading...</div>
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {usersData?.filter((u: any) => u.kycStatus === 'pending')
                  .length || 0}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
