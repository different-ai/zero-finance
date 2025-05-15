'use client';

import { type Address } from 'viem';
import { AUTO_EARN_MODULE_ADDRESS } from '@/lib/earn-module-constants';
import { api } from '@/trpc/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EnableSafeModuleButton } from './enable-safe-module-button';
import { InstallConfigButton } from './install-config-button';

interface EnableEarnCardProps {
  safeAddress?: Address;
}

export function EnableEarnCard({ safeAddress }: EnableEarnCardProps) {
  // No local transactional state – handled by child components

  // 1. Check if module is enabled on Safe contract (on-chain)
  const { 
    data: onChainModuleStatus, 
    isLoading: isLoadingOnChainModuleStatus,
    isError: isOnChainModuleStatusError,
    refetch: refetchOnChainModuleStatus
  } = api.earn.isSafeModuleActivelyEnabled.useQuery(
    { safeAddress: safeAddress!, moduleAddress: AUTO_EARN_MODULE_ADDRESS },
    { 
      enabled: !!safeAddress,
      staleTime: 5000, // Refetch on-chain status occasionally
    }
  );
  const isModuleEnabledOnSafeContract = onChainModuleStatus?.isEnabled || false;

  // 2. Query for on-chain initialization status (source of truth for config installation)
  const { 
    data: earnModuleOnChainInitStatus, 
    isLoading: isLoadingEarnModuleOnChainInitStatus, // New loading state
    isError: isEarnModuleOnChainInitStatusError, // New error state
    refetch: refetchEarnModuleOnChainInitStatus,
  } = api.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: safeAddress! }, 
    { 
      enabled: !!safeAddress, // Enable if safeAddress exists
      staleTime: 5000,
      refetchInterval: false,
    }
  );

  const isConfigInstalledOnChain = earnModuleOnChainInitStatus?.isInitializedOnChain || false;

  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">
            No primary safe detected or selected.
          </p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure a primary safe is active to use this feature.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingOnChainModuleStatus || isLoadingEarnModuleOnChainInitStatus) { // Check loading for both crucial queries
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3 mr-2" />
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  if (isOnChainModuleStatusError || isEarnModuleOnChainInitStatusError) { // Check error for both
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading earn module status.</p>
          {isOnChainModuleStatusError && <p className="text-xs text-red-400">On-chain Safe module status check failed.</p>}
          {isEarnModuleOnChainInitStatusError && <p className="text-xs text-red-400">On-chain Earn module configuration status check failed.</p>}
          <Button onClick={() => {
            if (isOnChainModuleStatusError) refetchOnChainModuleStatus();
            if (isEarnModuleOnChainInitStatusError) refetchEarnModuleOnChainInitStatus();
          }} className="mt-2">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Earn (Morpho Seamless Vault)</CardTitle>
        {isModuleEnabledOnSafeContract && isConfigInstalledOnChain && (
          <Badge variant="default" className="bg-green-500 text-white">
            Auto-Earn Fully Active
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Enable the Auto-Earn module in two steps: 
          1. Enable the module on your Safe. 
          2. Install the specific earning configuration on the module.
        </p>
        {isModuleEnabledOnSafeContract && isConfigInstalledOnChain ? (
          <p>
            Your Safe is set up to automatically earn yield via the Morpho Seamless Vault.
          </p>
        ) : (
          <p>
            Follow the steps below to activate auto-earning.
          </p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start space-y-4">
        <EnableSafeModuleButton safeAddress={safeAddress} />

        <InstallConfigButton safeAddress={safeAddress} />

        {!isConfigInstalledOnChain && ( // Show if config is not yet installed on-chain
          <CardDescription className="text-xs text-gray-500 mt-2">
            These actions involve on-chain transactions. You can remove the module or change configurations later.
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  );
}
