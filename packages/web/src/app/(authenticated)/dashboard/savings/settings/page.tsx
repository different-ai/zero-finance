'use client';

import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { useUserSafes } from '@/hooks/use-user-safes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ExternalLink, AlertCircle, Info } from 'lucide-react';
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
  const { data: earnModuleStatus, isLoading: isLoadingEarnStatus } =
    trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
      { safeAddress: safeAddress! },
      { enabled: !!safeAddress },
    );

  const isEarnModuleInitialized =
    earnModuleStatus?.isInitializedOnChain || false;

  // Fetch vault stats for live APY
  const { data: vaultStats } = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    { enabled: !!safeAddress },
  );

  // Get the APY from the first vault (Seamless) - handle decimal representation
  const apyRaw = vaultStats?.[0]?.supplyApy
    ? vaultStats[0].supplyApy
    : savingsState?.apy || 0.08;

  // Convert decimal to percentage if needed
  const liveApy = apyRaw < 1 ? apyRaw * 100 : apyRaw;

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
      router.push('/dashboard');
    }
  }, [isLoadingEarnStatus, isEarnModuleInitialized, safeAddress, router]);

  if (isLoading || !savingsState) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header Section */}
      <div className="border-b border-[#101010]/10 bg-white">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="gap-2 mb-4 text-[#101010]/70 hover:text-[#101010] hover:bg-[#F7F7F2]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Savings
          </Button>
          <div>
            <p className="uppercase tracking-[0.14em] text-[11px] sm:text-[12px] text-[#101010]/60">
              Configuration
            </p>
            <h1 className="mt-2 font-serif text-[28px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
              Savings Settings
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="space-y-6">
          {/* Settings Panel */}
          <div className="border border-[#101010]/10 bg-white rounded-md">
            <div className="p-6 border-b border-[#101010]/10">
              <h2 className="text-[20px] font-medium text-[#101010]">
                Auto-Savings Configuration
              </h2>
              <p className="text-[14px] text-[#101010]/70 mt-1">
                Automatically save a percentage of your incoming deposits
              </p>
            </div>
            <div className="p-6">
              <SavingsPanel
                initialSavingsState={savingsState}
                onStateChange={(newState) => {
                  updateSavingsState(newState);
                  // Show success message
                  if (newState.enabled !== savingsState.enabled) {
                    const message = newState.enabled
                      ? 'Auto-savings enabled successfully!'
                      : 'Auto-savings disabled';
                    console.log(message);
                  }
                }}
                mainBalance={0}
                safeAddress={safeAddress!}
                isInitialSetup={false}
              />
            </div>
          </div>

          {/* How It Works Section */}
          <div className="border border-[#101010]/10 bg-white rounded-md">
            <div className="p-6 border-b border-[#101010]/10">
              <h2 className="text-[20px] font-medium text-[#101010]">
                How Auto-Savings Works
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1B29FF] text-white flex items-center justify-center text-[14px] font-medium">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#101010] mb-1">
                    Automatic Deposits
                  </p>
                  <p className="text-[14px] text-[#101010]/70">
                    When you receive any USDC payment,{' '}
                    {savingsState?.allocation || 20}% will be instantly and
                    automatically deposited into high-yield vaults on Base
                    network.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1B29FF] text-white flex items-center justify-center text-[14px] font-medium">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#101010] mb-1">
                    Current Yield
                  </p>
                  <p className="text-[14px] text-[#101010]/70">
                    Your funds currently earn{' '}
                    <span className="font-medium text-[#1B29FF]">
                      {liveApy.toFixed(2)}% APY
                    </span>{' '}
                    (live rate) in the Gauntlet USDC Frontier vault, a
                    collaboration between Morpho and Gauntlet optimizing for
                    maximum yield.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#1B29FF] text-white flex items-center justify-center text-[14px] font-medium">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#101010] mb-1">
                    Instant Withdrawals
                  </p>
                  <p className="text-[14px] text-[#101010]/70">
                    Access your savings anytime - no lock-up periods, no
                    withdrawal fees, no penalties. Your money is always yours.
                  </p>
                </div>
              </div>

              {/* Vault Link */}
              <div className="pt-4 border-t border-[#101010]/10">
                <Link
                  href="https://app.morpho.org/ethereum/vault/0xc582F04d8a82795aa2Ff9c8bb4c1c889fe7b754e/gauntlet-usdc-frontier"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[14px] text-[#1B29FF] hover:text-[#1420CC] transition-colors"
                >
                  View Seamless USDC Vault on Morpho
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Risk Disclosure */}
          <div className="border border-[#FFA500]/20 bg-[#FFF8E6] rounded-md p-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-[14px] font-medium text-[#101010] mb-2">
                  Important Risk Disclosure
                </p>
                <p className="text-[13px] text-[#101010]/70 leading-relaxed">
                  While the Seamless vault is managed by Gauntlet (a leading
                  DeFi risk manager) and has undergone audits, all DeFi
                  protocols carry inherent risks including smart contract
                  vulnerabilities, market volatility, and potential loss of
                  funds. Past performance does not guarantee future returns. APY
                  rates are variable and can change at any time based on market
                  conditions. Only deposit what you can afford to lose. This is
                  not financial advice - please do your own research before
                  using any DeFi protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
