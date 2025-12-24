'use client';

import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import { useUserSafes } from '@/hooks/use-user-safes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ExternalLink,
  AlertCircle,
  Info,
  Bot,
  Key,
  ChevronRight,
} from 'lucide-react';
import SavingsPanel from '@/components/savings/savings-panel';
import { trpc } from '@/utils/trpc';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useBimodal } from '@/components/ui/bimodal';

export default function SavingsSettingsPage() {
  const router = useRouter();
  const { isTechnical } = useBimodal();
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
                    {isTechnical
                      ? `When you receive any USDC payment, ${savingsState?.allocation || 20}% will be instantly and automatically deposited into high-yield vaults on Base network.`
                      : `When you receive any payment, ${savingsState?.allocation || 20}% will be instantly and automatically moved to your high-yield savings account.`}
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
                    {isTechnical
                      ? '(live rate) in the Gauntlet USDC Frontier vault, a collaboration between Morpho and Gauntlet optimizing for maximum yield.'
                      : '(live rate) through our institutional-grade savings strategy.'}
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

              {/* Vault Link - Only shown in Technical mode */}
              {isTechnical && (
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
              )}
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
                  {isTechnical
                    ? `While the Seamless vault is managed by Gauntlet (a leading DeFi risk manager) and has undergone audits, all DeFi protocols carry inherent risks including smart contract vulnerabilities, market volatility, and potential loss of funds. Past performance does not guarantee future returns. APY rates are variable and can change at any time based on market conditions. Only deposit what you can afford to lose. This is not financial advice - please do your own research before using any DeFi protocol.`
                    : `While our savings accounts use institutional-grade security and undergo regular audits, all investments carry inherent risks. Past performance does not guarantee future returns. APY rates are variable and can change at any time based on market conditions. Only save what you can afford to risk. This is not financial advice.`}
                </p>
              </div>
            </div>
          </div>

          {/* Workspace API Keys - Technical Mode Only */}
          {isTechnical && (
            <div className="border border-[#1B29FF]/20 bg-white rounded-md">
              <div className="p-6 border-b border-[#1B29FF]/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#1B29FF]/10 rounded-sm flex items-center justify-center">
                    <Bot className="h-5 w-5 text-[#1B29FF]" />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-medium text-[#101010] font-mono">
                      WORKSPACE::API_KEYS
                    </h2>
                    <p className="text-[14px] text-[#101010]/70 font-mono">
                      MCP access for AI agents (Claude, Cursor, etc.)
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-[14px] text-[#101010]/70 font-mono">
                  Create API keys to allow AI agents to interact with your
                  account via the Model Context Protocol. Enable automated
                  transactions, balance queries, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/dashboard/settings/integrations">
                    <Button className="w-full sm:w-auto font-mono bg-[#1B29FF] hover:bg-[#1420CC] text-white">
                      <Key className="mr-2 h-4 w-4" />
                      MANAGE_API_KEYS
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="pt-4 border-t border-[#1B29FF]/10">
                  <p className="text-[12px] text-[#101010]/50 font-mono">
                    MCP_ENDPOINT:{' '}
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/api/mcp`
                      : '/api/mcp'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
