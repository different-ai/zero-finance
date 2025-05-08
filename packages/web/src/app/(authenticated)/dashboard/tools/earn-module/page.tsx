'use client';

import { api } from '@/trpc/react';
import { EnableEarnCard } from './components/enable-earn-card';
import { AutoEarnListener } from './components/auto-earn-listener';
import { StatsCard } from './components/stats-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Info, AlertTriangle } from 'lucide-react';
import { AUTO_EARN_MODULE_ADDRESS } from '@/lib/earn-module-constants'; // Import constant

export default function EarnModulePage() {
  const { 
    data: primarySafeData, 
    isLoading: isLoadingPrimarySafe, 
    isError: isErrorPrimarySafe, 
    error: primarySafeError 
  } = api.user.getPrimarySafeAddress.useQuery();

  const primarySafeAddress = primarySafeData?.primarySafeAddress;

  // Fetch on-chain status for Safe module enablement
  const {
    data: onChainSafeModuleStatus,
    isLoading: isLoadingOnChainSafeModuleStatus,
    isError: isErrorOnChainSafeModuleStatus,
    error: errorOnChainSafeModuleStatus,
  } = api.earn.isSafeModuleActivelyEnabled.useQuery(
    { 
      safeAddress: primarySafeAddress!, 
      moduleAddress: AUTO_EARN_MODULE_ADDRESS 
    },
    { 
      enabled: !!primarySafeAddress,
      staleTime: 15000, // Check occasionally
    }
  );
  const isSafeModuleEnabledOnChain = onChainSafeModuleStatus?.isEnabled || false;

  // Fetch on-chain status for Earn module config installation (initialization)
  const {
    data: earnModuleOnChainInitStatus,
    isLoading: isLoadingEarnModuleOnChainInitStatus,
    isError: isErrorEarnModuleOnChainInitStatus,
    error: errorEarnModuleOnChainInitStatus,
  } = api.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: primarySafeAddress! },
    { 
      enabled: !!primarySafeAddress,
      staleTime: 15000, // Check occasionally
    }
  );
  const isEarnConfigInstalledOnChain = earnModuleOnChainInitStatus?.isInitializedOnChain || false;

  const isEarnFullySetUpOnChain = isSafeModuleEnabledOnChain && isEarnConfigInstalledOnChain;
  
  // This DB flag is still useful for knowing if the user *intended* to enable it via our UI flow.
  // The AutoEarnListener might use this for certain UI states if needed,
  // but critical enable/disable should rely on isEarnFullySetUpOnChain.
  const isEarnModuleEnabledInDb = (primarySafeData as any)?.isEarnModuleEnabled || false;


  if (isLoadingPrimarySafe || (primarySafeAddress && (isLoadingOnChainSafeModuleStatus || isLoadingEarnModuleOnChainInitStatus))) {
    return (
      <div className="space-y-4 p-4 md:p-8">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full md:w-1/2" />
        <Skeleton className="h-48 w-full md:w-1/2" />
        {primarySafeAddress && <Skeleton className="h-56 w-full md:w-1/2" />} {/* Skeleton for StatsCard if safeAddress is known */}
      </div>
    );
  }

  if (isErrorPrimarySafe) {
    return (
      <div className="p-4 md:p-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error Fetching Safe Information</AlertTitle>
          <AlertDescription>
            Could not load your primary safe address: {primarySafeError?.message || 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  const showOnChainStatusErrors = isErrorOnChainSafeModuleStatus || isErrorEarnModuleOnChainInitStatus;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Earn Module Management</h1>
        <p className="text-muted-foreground">
          Enable and manage the Auto-Earn module for your primary safe.
        </p>
      </header>
      
      <EnableEarnCard safeAddress={primarySafeAddress || undefined} />

      {/* Display StatsCard if primarySafeAddress is available */}
      {primarySafeAddress && (
        <StatsCard safeAddress={primarySafeAddress} />
      )}

      {primarySafeAddress && showOnChainStatusErrors && (
         <Alert variant="default">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Could Not Determine Full Auto-Earn On-Chain Status</AlertTitle>
          <AlertDescription>
            There was an issue fetching the complete on-chain status of the Auto-Earn module.
            {isErrorOnChainSafeModuleStatus && ` Safe Module Check: ${errorOnChainSafeModuleStatus?.message || 'Unknown error'}.`}
            {isErrorEarnModuleOnChainInitStatus && ` Earn Module Init Check: ${errorEarnModuleOnChainInitStatus?.message || 'Unknown error'}.`}
            The manual trigger might not function correctly.
          </AlertDescription>
        </Alert>
      )}

      {primarySafeAddress && (
        <AutoEarnListener 
          safeAddress={primarySafeAddress} 
          // Pass the comprehensive on-chain status for enabling the trigger
          isEarnModuleFullyActive={isEarnFullySetUpOnChain} 
          // The DB flag can be used for supplementary UI text if needed, e.g. "user has gone through setup"
          // but isEarnModuleFullyActive determines if the trigger button itself is operational.
          hasUserCompletedDbSetup={isEarnModuleEnabledInDb}
        />
      )}
      {!primarySafeAddress && (
        <Alert variant="default">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Auto-Earn Listener & Stats</AlertTitle>
          <AlertDescription>
            Once a primary safe is configured, the auto-earn manual trigger and stats will appear here.
          </AlertDescription>
        </Alert>
      )}

    </div>
  );
} 