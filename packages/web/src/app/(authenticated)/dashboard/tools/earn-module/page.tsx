'use client';

import { api } from '@/trpc/react';
import { EnableEarnCard } from './components/enable-earn-card';
import { AutoEarnListener } from './components/auto-earn-listener';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Info, AlertTriangle } from 'lucide-react';
import { Hex } from 'viem';

export default function EarnModulePage() {
  const { 
    data: primarySafeData, 
    isLoading: isLoadingPrimarySafe, 
    isError: isErrorPrimarySafe, 
    error: primarySafeError 
  } = api.user.getPrimarySafeAddress.useQuery();

  const primarySafeAddress = primarySafeData?.primarySafeAddress;
  const { 
    data: earnStatusData, 
    isLoading: isLoadingEarnStatus, 
    isError: isErrorEarnStatus,
    error: earnStatusError
  } = api.earn.status.useQuery(
    { safeAddress: primarySafeAddress! },
    { enabled: !!primarySafeAddress }
  );

  if (isLoadingPrimarySafe || (primarySafeAddress && isLoadingEarnStatus)) {
    return (
      <div className="space-y-4 p-4 md:p-8">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-64 w-full md:w-1/2" />
        <Skeleton className="h-48 w-full md:w-1/2" />
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
  
  const isEarnModuleEnabled = earnStatusData?.enabled || false;

  return (
    <div className="space-y-6 p-4 md:p-8">
      <header>
        <h1 className="text-2xl font-bold">Earn Module Management</h1>
        <p className="text-muted-foreground">
          Enable and manage the Auto-Earn module for your primary safe.
        </p>
      </header>
      
      <EnableEarnCard safeAddress={primarySafeAddress || undefined} />

      {isErrorEarnStatus && primarySafeAddress && (
         <Alert variant="default">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle>Could Not Determine Auto-Earn Status</AlertTitle>
          <AlertDescription>
            There was an issue fetching the current status of the Auto-Earn module for your safe ({primarySafeAddress?.slice(0,6)}...{primarySafeAddress?.slice(-4)}): {earnStatusError?.message || 'Unknown error'}. The listener might not function correctly.
          </AlertDescription>
        </Alert>
      )}

      {primarySafeAddress && (
        <AutoEarnListener 
          safeAddress={primarySafeAddress} 
          isEarnModuleEnabled={isEarnModuleEnabled} 
        />
      )}
      {!primarySafeAddress && (
        <Alert variant="default">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Auto-Earn Listener</AlertTitle>
          <AlertDescription>
            Once a primary safe is configured, the auto-earn listener will appear here.
          </AlertDescription>
        </Alert>
      )}

    </div>
  );
} 