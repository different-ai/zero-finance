'use client';

import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { useUserSafes } from '@/hooks/use-user-safes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import SavingsPanel from '@/components/savings/savings-panel';
import { trpc } from '@/utils/trpc';

export default function SavingsSettingsPage() {
  const router = useRouter();
  const {
    data: safesData,
    isLoading: isLoadingSafes,
    isError: safesError,
  } = useUserSafes();
  const primarySafe = safesData?.[0];
  const safeAddress = primarySafe?.safeAddress || null;

  const {
    savingsState,
    isLoading: isLoadingState,
    updateSavingsState,
  } = useRealSavingsState(safeAddress, 0);

  // Check earn module initialization status
  const {
    data: earnModuleStatus,
    isLoading: isLoadingEarnStatus,
  } = trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress },
  );

  const isEarnModuleInitialized =
    earnModuleStatus?.isInitializedOnChain || false;

  const isLoading = isLoadingSafes || isLoadingState || isLoadingEarnStatus;

  // Redirect if no safes
  useEffect(() => {
    if (
      !isLoadingSafes &&
      !safesError &&
      safesData !== undefined &&
      safesData.length === 0
    ) {
      router.push('/onboarding/create-safe');
    }
  }, [isLoadingSafes, safesError, safesData, router]);

  // Redirect if earn module not initialized
  useEffect(() => {
    if (!isLoadingEarnStatus && !isEarnModuleInitialized && safeAddress) {
      router.push('/dashboard/savings');
    }
  }, [isLoadingEarnStatus, isEarnModuleInitialized, safeAddress, router]);

  if (isLoading || !savingsState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/savings')}
            className="gap-2 mb-4"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Savings
          </Button>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Savings Settings
          </h1>
          <p className="text-gray-600">
            Configure your automatic savings preferences
          </p>
        </div>

        {/* Settings Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Auto-Savings Configuration</CardTitle>
              <CardDescription>
                Set what percentage of incoming deposits should be automatically saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SavingsPanel
                initialSavingsState={savingsState}
                onStateChange={(newState) => {
                  updateSavingsState(newState);
                  // Show success message
                  if (newState.enabled !== savingsState.enabled) {
                    const message = newState.enabled 
                      ? 'Auto-savings enabled successfully!' 
                      : 'Auto-savings disabled';
                    // You can add a toast here if you have a toast system
                    console.log(message);
                  }
                }}
                mainBalance={0}
                safeAddress={safeAddress!}
                isInitialSetup={false}
              />
            </CardContent>
          </Card>

          {/* Additional Settings Info */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur mt-6">
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <p>
                When auto-savings is enabled, a percentage of every incoming USDC 
                deposit will automatically be moved to your high-yield savings vault.
              </p>
              <p>
                Your funds earn {savingsState?.apy.toFixed(2) || '4.96'}% APY in the 
                Seamless vault on Base network.
              </p>
              <p>
                You can withdraw your savings at any time with no penalties or 
                lock-up periods.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}