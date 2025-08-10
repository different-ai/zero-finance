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
import { ChevronLeft, ExternalLink, AlertCircle } from 'lucide-react';
import SavingsPanel from '@/components/savings/savings-panel';
import { trpc } from '@/utils/trpc';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

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

  // Fetch vault stats for live APY
  const { data: vaultStats } = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress }
  );

  // Get the APY from the first vault (Seamless)
  const liveApy = vaultStats?.[0]?.supplyApy 
    ? vaultStats[0].supplyApy
    : savingsState?.apy || 4.96;

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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
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
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Savings Settings
          </h1>
          <p className="text-muted-foreground">
            Configure your automatic savings preferences
          </p>
        </div>

        {/* Settings Card */}
        <div className="space-y-6 m-auto">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Auto-Savings Configuration</CardTitle>
              <CardDescription>
                Set what percentage of incoming deposits should be automatically saved
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">How Auto-Savings Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Automatic Deposits:</span> When you receive any USDC payment, {savingsState?.allocation || 20}% will be instantly and automatically deposited into the Seamless USDC vault on Base network.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        <span className="font-semibold text-foreground">Current Yield:</span> Your funds currently earn <span className="font-bold text-green-600">{liveApy.toFixed(2)}% APY</span> (live rate).
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        This is the Seamless USDC vault managed by Gauntlet on the Morpho protocol.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Instant Withdrawals:</span> Access your savings anytime - no lock-up periods, no withdrawal fees, no penalties. Your money is always yours.
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Link 
                    href="https://app.morpho.org/base/vault/0x616a4E1db48e22028f6bbf20444Cd3b8e3273738/seamless-usdc-vault"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    View Seamless USDC Vault on Morpho
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs text-amber-900">
                    <span className="font-semibold">Important Risk Disclosure:</span> While the Seamless vault is managed by Gauntlet (a leading DeFi risk manager) and has undergone audits, all DeFi protocols carry inherent risks including smart contract vulnerabilities, market volatility, and potential loss of funds. Past performance does not guarantee future returns. APY rates are variable and can change at any time based on market conditions. Only deposit what you can afford to lose. This is not financial advice - please do your own research before using any DeFi protocol.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}