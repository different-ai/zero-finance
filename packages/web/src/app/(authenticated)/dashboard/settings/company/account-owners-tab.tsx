'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Check,
  Shield,
  User,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/trpc/react';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AccountOwnersTabProps {
  companyId?: string;
}

export function AccountOwnersTab({ companyId }: AccountOwnersTabProps) {
  const { user } = usePrivy();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Get current workspace
  const { data: workspace, isLoading: isLoadingWorkspace } =
    api.workspace.getOrCreateWorkspace.useQuery();

  // Get user's Safes to find the primary one
  const { data: userSafes, isLoading: isLoadingSafes } =
    api.settings.userSafes.list.useQuery(undefined, {
      enabled: !!workspace?.workspaceId,
    });

  // Get the primary Safe address (usually the first Safe for the workspace)
  const primarySafeAddress = userSafes?.find(
    (safe: any) => safe.workspaceId === workspace?.workspaceId,
  )?.safeAddress;

  // Get Safe owners for the primary Safe
  const {
    data: safeOwners,
    isLoading: isLoadingSafeOwners,
    error: safeOwnersError,
  } = api.safe.getSafeOwners.useQuery(
    {
      safeAddress: primarySafeAddress || '',
    },
    {
      enabled: !!primarySafeAddress,
      retry: false,
    },
  );

  // Get user's Privy addresses to match against Safe owners
  const userAddresses = user?.wallet?.address ? [user.wallet.address] : [];
  if (user?.linkedAccounts) {
    user.linkedAccounts.forEach((account) => {
      if (account.type === 'wallet' && account.address) {
        userAddresses.push(account.address);
      }
    });
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success('Address copied to clipboard');
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const isCurrentUser = (ownerAddress: string) => {
    return userAddresses.some(
      (userAddr) => userAddr.toLowerCase() === ownerAddress.toLowerCase(),
    );
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isLoadingWorkspace || isLoadingSafes) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!primarySafeAddress) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              No Primary Safe Found
            </CardTitle>
            <CardDescription>
              This workspace doesn't have a primary Safe configured yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-[#101010]/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#101010] mb-2">
                Set up your primary Safe
              </h3>
              <p className="text-[14px] text-[#101010]/60 max-w-[400px] mx-auto mb-6">
                A primary Safe is required to manage account owners and
                permissions.
              </p>
              <Button
                onClick={() =>
                  window.open('/dashboard/settings/advanced', '_blank')
                }
                className="bg-[#1B29FF] hover:bg-[#1420CC] text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Advanced Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Safe Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Primary Safe Information
          </CardTitle>
          <CardDescription>
            Your workspace's primary Safe wallet details and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#101010]">
                Safe Address
              </label>
              <div className="flex items-center gap-2 mt-1.5">
                <code className="flex-1 text-sm font-mono bg-[#F7F7F2] px-3 py-2 border border-[#101010]/10 rounded-md">
                  {primarySafeAddress}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyAddress(primarySafeAddress!)}
                  className="border-[#101010]/20 text-[#101010] hover:bg-[#101010]/5"
                >
                  {copiedAddress === primarySafeAddress ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {safeOwners && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-[#101010]">
                    Total Owners
                  </label>
                  <p className="text-[24px] font-serif text-[#101010] mt-1">
                    {safeOwners.owners.length}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#101010]">
                    Signature Threshold
                  </label>
                  <p className="text-[24px] font-serif text-[#101010] mt-1">
                    {safeOwners.threshold} of {safeOwners.owners.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Account Owners List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Owners
            {safeOwners && (
              <Badge variant="secondary">{safeOwners.owners.length}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            People who can approve transactions and manage this Safe wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSafeOwners ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : safeOwnersError ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#101010] mb-2">
                Failed to Load Owners
              </h3>
              <p className="text-[14px] text-[#101010]/60 mb-4">
                Unable to fetch Safe owners. Please check your network
                connection and try again.
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-[#101010]/20 text-[#101010] hover:bg-[#101010]/5"
              >
                Retry
              </Button>
            </div>
          ) : safeOwners && safeOwners.owners.length > 0 ? (
            <div className="space-y-3">
              {safeOwners.owners.map((ownerAddress: string, index: number) => {
                const isCurrent = isCurrentUser(ownerAddress);
                return (
                  <div
                    key={ownerAddress}
                    className={cn(
                      'flex items-center justify-between p-4 border rounded-lg transition-colors',
                      isCurrent
                        ? 'border-[#1B29FF]/20 bg-[#1B29FF]/5'
                        : 'border-[#101010]/10 hover:bg-[#F7F7F2]/50',
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#101010]/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-[#101010]/60" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#101010]">
                              Owner {index + 1}
                            </span>
                            {isCurrent && (
                              <Badge
                                variant="default"
                                className="bg-[#1B29FF] text-white"
                              >
                                Current User
                              </Badge>
                            )}
                          </div>
                          <code className="text-sm text-[#101010]/60 font-mono">
                            {formatAddress(ownerAddress)}
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyAddress(ownerAddress)}
                        className="border-[#101010]/20 text-[#101010] hover:bg-[#101010]/5"
                      >
                        {copiedAddress === ownerAddress ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-[#101010]/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#101010] mb-2">
                No Owners Found
              </h3>
              <p className="text-[14px] text-[#101010]/60">
                Unable to find any owners for this Safe.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle>Security Information</CardTitle>
          <CardDescription>
            Understanding your Safe's security model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Multi-Signature Security
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                This Safe requires{' '}
                <strong>
                  {safeOwners?.threshold || 'N/A'} out of{' '}
                  {safeOwners?.owners.length || 'N/A'}
                </strong>{' '}
                owner signatures to execute transactions.
              </p>
              <p>
                All owners have equal authority and can propose transactions. No
                single owner can move funds without the required threshold of
                signatures.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
