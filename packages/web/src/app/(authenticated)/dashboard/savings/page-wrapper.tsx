'use client';

import { useUserSafes } from '@/hooks/use-user-safes-demo';
import { useRealSavingsState } from '@/components/savings/hooks/use-real-savings-state';
import {
  useDemoSavingsState,
  useDemoVaultStats,
  useDemoUserPositions,
  useDemoSavingsActivation,
  useIsDemoMode,
  type SavingsExperienceMode,
} from '@/hooks/use-demo-savings';
import { trpc, type RouterOutputs } from '@/utils/trpc';
import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Wallet,
  ExternalLink,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Mail,
  CalendarDays,
  ArrowRightCircle,
  Info,
  Building2,
  DollarSign,
  Euro,
  Copy,
  Check,
} from 'lucide-react';
import { WithdrawEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/withdraw-earn-card';
import { DepositEarnCard } from '@/app/(authenticated)/dashboard/tools/earn-module/components/deposit-earn-card';
import { formatUsd, cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { OpenSavingsAccountButton } from '@/components/savings/components/open-savings-account-button';
import { Address } from 'viem';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';
import { AnimatedYieldCounter } from '@/components/animated-yield-counter';
import { AnimatedTotalEarned } from '@/components/animated-total-earned';
import { AnimatedTotalEarnedV2 } from '@/components/animated-total-earned-v2';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { BankingInstructionsDisplay } from '@/components/virtual-accounts/banking-instructions-display';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import Image from 'next/image';
import { USDC_ADDRESS } from '@/lib/constants';
import { useRouter } from 'next/navigation';

const ZERO_LOGO_SRC = '/images/new-logo-bluer.png';
const INSURANCE_CONTACT = {
  email: 'raghav@0.finance',
  scheduleUrl: 'https://cal.com/team/0finance/30',
};
const INSURED_VAULT_IDS = new Set<string>();

const demoFundingSources = [
  {
    id: 'demo-ach-1',
    accountTier: 'starter' as const,
    sourceAccountType: 'us_ach' as const,
    sourceBankName: 'JPMorgan Chase',
    sourceCurrency: 'USD',
    sourceAccountNumber: '****5678',
    sourceRoutingNumber: '021000021',
    sourceBankBeneficiaryName: 'Demo Company Inc.',
    sourceIban: null,
    sourceBicSwift: null,
    destinationCurrency: 'USDC',
    destinationPaymentRail: 'Base',
  },
  {
    id: 'demo-iban-1',
    accountTier: 'starter' as const,
    sourceAccountType: 'iban' as const,
    sourceBankName: 'Deutsche Bank',
    sourceCurrency: 'EUR',
    sourceAccountNumber: null,
    sourceRoutingNumber: null,
    sourceIban: 'DE89 3704 0044 0532 0130 00',
    sourceBicSwift: 'DEUTDEFF',
    sourceBankBeneficiaryName: 'Bridge Building Sp.z.o.o.',
    sourceBankAddress: 'Taunusanlage 12, 60325 Frankfurt am Main, Germany',
    destinationCurrency: 'USDC',
    destinationPaymentRail: 'Base',
  },
];

const demoUserData = {
  firstName: 'John',
  lastName: 'Doe',
  companyName: 'Demo Company Inc.',
};

const getRecipientName = (source: any, userData: any) => {
  if (source.sourceAccountType === 'iban') {
    return 'Bridge Building Sp.z.o.o.';
  }
  if (source.sourceAccountType === 'us_ach') {
    if (userData?.companyName) return userData.companyName;
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName} ${userData.lastName}`;
    }
    if (source.sourceBankBeneficiaryName) {
      return source.sourceBankBeneficiaryName;
    }
    return 'Account Holder';
  }
  return source.sourceBankBeneficiaryName || 'Account Holder';
};

const insuredPillAnimation = `
  @keyframes insuredShine {
    0%, 55% {
      transform: translateX(-160%);
      opacity: 0;
    }
    60% {
      opacity: 0.85;
    }
    64% {
      transform: translateX(160%);
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .insured-pill {
    position: relative;
    overflow: hidden;
    isolation: isolate;
  }

  .insured-pill::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-160%);
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%);
    mix-blend-mode: screen;
    opacity: 0;
    pointer-events: none;
    animation: insuredShine 6s ease-in-out infinite;
  }
`;

type CheckingActionsCardProps = {
  balanceUsd: number;
  safeAddress: string | null;
  isDemoMode: boolean;
};

function CheckingActionsCard({
  balanceUsd,
  safeAddress,
  isDemoMode,
}: CheckingActionsCardProps) {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);
  const isMobile = useIsMobile();
  const { ready, authenticated, user } = usePrivy();

  const {
    data: accountData,
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: !isDemoMode && ready && authenticated && !!user?.id,
  });

  const fundingSources = isDemoMode
    ? demoFundingSources
    : accountData?.fundingSources || [];
  const userData = isDemoMode ? demoUserData : accountData?.userData;
  const hasCompletedKyc = isDemoMode
    ? false
    : accountData?.hasCompletedKyc || false;

  const achAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'us_ach',
  );
  const ibanAccount = fundingSources.find(
    (source) => source.sourceAccountType === 'iban',
  );

  const hasVirtualAccounts = Boolean(achAccount || ibanAccount);

  const handleCopyAddress = () => {
    if (!safeAddress || typeof navigator === 'undefined') return;
    navigator.clipboard
      .writeText(safeAddress)
      .then(() => {
        setIsAddressCopied(true);
        setTimeout(() => setIsAddressCopied(false), 2000);
      })
      .catch((error) => console.error('Failed to copy address', error));
  };

  const hasOnlyStarterAccounts = !hasCompletedKyc && fundingSources.length > 0;
  const canInitiateMove =
    (isDemoMode || balanceUsd > 0) && !!safeAddress && !hasOnlyStarterAccounts;
  const disableReason = !safeAddress
    ? 'Add a treasury safe to move funds'
    : balanceUsd <= 0
      ? 'No withdrawable balance available'
      : hasOnlyStarterAccounts
        ? 'Complete business verification to enable withdrawals'
        : undefined;

  return (
    <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="uppercase tracking-[0.12em] text-[11px] text-[#101010]/60 mb-2">
            Treasury Checking
          </p>
          <p className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.01em] text-[#101010]">
            Withdrawable balance
          </p>
          <p className="mt-2 text-[32px] sm:text-[36px] font-semibold leading-[1.1] tabular-nums text-[#101010]">
            {formatUsd(balanceUsd)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-semibold text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
              disabled={!isDemoMode && !canInitiateMove}
              title={
                !isDemoMode && !canInitiateMove ? disableReason : undefined
              }
            >
              <ArrowRightCircle className="h-5 w-5" />
              Move Funds
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0' : 'max-w-2xl'}`}
          >
            <SimplifiedOffRamp fundingSources={fundingSources} />
          </DialogContent>
        </Dialog>

        <Dialog
          onOpenChange={(open) => {
            if (open && !isDemoMode) {
              void refetchFundingSources();
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-[15px] font-semibold text-[#101010] border border-[#101010]/10 hover:border-[#1B29FF]/20 hover:text-[#1B29FF] hover:bg-[#F7F7F2] transition-colors"
            >
              <Info className="h-5 w-5 text-[#101010]/60" />
              Details
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-[#101010]/10 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-[#101010]/10 pb-4">
              <div>
                <p className="uppercase tracking-[0.12em] text-[11px] text-[#101010]/60 mb-2">
                  Banking instructions
                </p>
                <DialogTitle className="text-[22px] font-semibold tracking-[-0.01em] text-[#101010] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#101010]/60" />
                  Virtual account details
                </DialogTitle>
                {safeAddress && (
                  <div className="mt-6 border-t border-[#101010]/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedDetails((prev) => !prev)}
                      className="inline-flex items-center gap-2 text-[12px] font-medium text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                    >
                      {showAdvancedDetails ? 'Hide advanced' : 'Show advanced'}{' '}
                      details
                    </button>

                    {showAdvancedDetails && (
                      <div className="mt-3 rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-3 text-[12px] text-[#101010]/70">
                        <p className="uppercase tracking-[0.14em] text-[10px] text-[#101010]/50 mb-2">
                          Treasury safe address
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <code className="font-mono text-[11px] text-[#101010]">
                            {safeAddress}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyAddress}
                            className="inline-flex items-center gap-1 rounded-full border border-[#101010]/15 bg-white px-3 py-1 text-[11px] text-[#101010] hover:border-[#1B29FF]/30 hover:text-[#1B29FF] transition-colors"
                          >
                            {isAddressCopied ? (
                              <>
                                <Check className="h-3 w-3" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                        <p className="mt-2 text-[11px] text-[#101010]/50">
                          Use this address only for advanced treasury workflows.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </DialogHeader>

            {isLoadingFundingSources ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-12 w-full bg-[#101010]/5" />
                ))}
              </div>
            ) : hasVirtualAccounts ? (
              <BankingInstructionsDisplay
                accounts={fundingSources}
                hasCompletedKyc={hasCompletedKyc}
                userData={userData}
              />
            ) : (
              <div className="py-6 text-[14px] text-[#101010]/70">
                No virtual bank accounts are connected yet. Connect an account
                in onboarding to enable transfers.
              </div>
            )}

            {isDemoMode && (
              <div className="mt-4 rounded-[10px] border border-[#101010]/10 bg-[#F7F7F2] p-4 text-[12px] text-[#101010]/70">
                Demo mode shows sample banking instructions. Sign in to your
                live workspace to view real account numbers.
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <p className="text-[12px] text-[#101010]/60">
        {isDemoMode
          ? 'Use these controls to explore how deposits and withdrawals work in Zero Finance.'
          : hasVirtualAccounts
            ? 'Transfers settle directly into your Zero treasury safe.'
            : 'Once your virtual account is approved, you can pull cash into savings here.'}
      </p>
    </div>
  );
}

export type SavingsPageWrapperProps = {
  mode?: SavingsExperienceMode;
  initialSafeAddress?: string | null;
  initialCheckingBalance?: RouterOutputs['safe']['getBalance'] | null;
};

export default function SavingsPageWrapper({
  mode = 'real',
  initialSafeAddress = null,
  initialCheckingBalance = null,
}: SavingsPageWrapperProps) {
  const isDemoMode = useIsDemoMode(mode);
  const router = useRouter();
  const {
    isActivated: isDemoActivated,
    activateSavings: persistDemoActivation,
  } = useDemoSavingsActivation(mode);
  const [isActivatingDemo, setIsActivatingDemo] = useState(false);
  const [activationStep, setActivationStep] = useState(0);
  const activationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const refetchTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const activationSteps = [
    'Verifying account...',
    'Setting up savings vault...',
    'Configuring auto-save...',
    'Activating yield generation...',
    'Finalizing setup...',
  ];

  const handleDemoActivate = () => {
    if (!isDemoMode || isDemoActivated || isActivatingDemo) return;

    setIsActivatingDemo(true);
    setActivationStep(0);

    if (activationIntervalRef.current) {
      clearInterval(activationIntervalRef.current);
    }

    activationIntervalRef.current = setInterval(() => {
      setActivationStep((prev) => {
        if (prev >= activationSteps.length - 1) {
          if (activationIntervalRef.current) {
            clearInterval(activationIntervalRef.current);
            activationIntervalRef.current = null;
          }

          setTimeout(() => {
            persistDemoActivation();
            setIsActivatingDemo(false);
          }, 500);

          return prev;
        }

        return prev + 1;
      });
    }, 600);
  };

  useEffect(() => {
    return () => {
      if (activationIntervalRef.current) {
        clearInterval(activationIntervalRef.current);
      }
      refetchTimeoutsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      refetchTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (!isDemoActivated) {
      setActivationStep(0);
      setIsActivatingDemo(false);
    }
  }, [isDemoActivated]);

  // Get safe data
  const safesQuery = useUserSafes();
  const safesData = safesQuery.data;
  const safesError = safesQuery.isError;
  const isLoadingSafes = safesQuery.isLoading && !initialSafeAddress;

  const primarySafe = safesData?.[0];
  const safeAddress = primarySafe?.safeAddress || initialSafeAddress || null;

  // Fetch checking account balance
  const { data: checkingBalance } = trpc.safe.getBalance.useQuery(
    {
      safeAddress: safeAddress!,
      tokenAddress: USDC_ADDRESS,
    },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
      initialData: initialCheckingBalance ?? undefined,
    },
  );

  const effectiveCheckingBalance = checkingBalance ?? initialCheckingBalance;
  const checkingBalanceUsd = effectiveCheckingBalance
    ? Number(effectiveCheckingBalance.balance) / 1e6
    : 0;
  const withdrawableBalanceUsd = isDemoMode ? 2500000 : checkingBalanceUsd;

  // Get user profile to check insurance status
  const { data: userProfile } = trpc.user.getProfile.useQuery(undefined, {
    enabled: !isDemoMode,
  });
  const userIsInsured = userProfile?.isInsured || false;

  // Get real savings state
  const { savingsState: realSavingsState, isLoading: isLoadingRealState } =
    useRealSavingsState(safeAddress, 0);

  // Apply demo overrides
  const { savingsState, isLoading: isLoadingState } = useDemoSavingsState(
    realSavingsState,
    isLoadingRealState,
    mode,
  );

  // Get demo data if in demo mode
  const demoVaultStats = useDemoVaultStats(mode);
  const demoUserPositions = useDemoUserPositions(mode);

  // Check earn module initialization status
  const realEarnStatus =
    trpc.earn.getEarnModuleOnChainInitializationStatus.useQuery(
      { safeAddress: safeAddress! },
      { enabled: !!safeAddress && !isDemoMode },
    );

  const isEarnModuleInitialized = isDemoMode
    ? isDemoActivated
    : realEarnStatus.data?.isInitializedOnChain || false;

  // Fetch vault stats
  const realVaultStats = trpc.earn.stats.useQuery(
    { safeAddress: safeAddress! },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const vaultStats = isDemoMode ? demoVaultStats : realVaultStats.data;

  // Base vaults configuration
  const BASE_VAULTS = BASE_USDC_VAULTS;
  const baseVaultAddresses = useMemo(
    () => BASE_VAULTS.map((v) => v.address),
    [BASE_VAULTS],
  );

  // Fetch multi-vault stats
  const realVaultStatsMany = trpc.earn.statsByVault.useQuery(
    { safeAddress: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  // Fetch user positions
  const realUserPositions = trpc.earn.userPositions.useQuery(
    { userSafe: safeAddress!, vaultAddresses: baseVaultAddresses },
    {
      enabled: !!safeAddress && !isDemoMode,
      refetchInterval: 10000,
    },
  );

  const vaultStatsMany = isDemoMode ? demoVaultStats : realVaultStatsMany.data;
  const userPositions = isDemoMode ? demoUserPositions : realUserPositions.data;

  const { refetch: refetchVaultStats } = realVaultStats;
  const { refetch: refetchVaultsMany } = realVaultStatsMany;
  const { refetch: refetchUserPositions } = realUserPositions;

  // State for vault action modals with transition support
  const [selectedVault, setSelectedVault] = useState<{
    action: 'deposit' | 'withdraw' | 'insure' | null;
    vaultAddress: string | null;
    vaultName: string | null;
  }>({
    action: null,
    vaultAddress: null,
    vaultName: null,
  });

  // Track expansion state for smooth animations
  const [expandingVault, setExpandingVault] = useState<string | null>(null);
  const [collapsingVault, setCollapsingVault] = useState<string | null>(null);

  const toggleVaultAction = useCallback(
    (
      action: 'deposit' | 'withdraw' | 'insure',
      vault: { address: string; name: string },
    ) => {
      const normalizedAddress = vault.address.toLowerCase();

      setSelectedVault((prev) => {
        const isCurrentlyOpen =
          prev.action === action &&
          prev.vaultAddress?.toLowerCase() === normalizedAddress;

        if (isCurrentlyOpen) {
          // Start collapse animation
          setCollapsingVault(normalizedAddress);
          setTimeout(() => {
            setCollapsingVault(null);
          }, 300);
          return { action: null, vaultAddress: null, vaultName: null };
        }

        // Start expand animation
        if (prev.vaultAddress) {
          // If another vault is open, collapse it first
          setCollapsingVault(prev.vaultAddress.toLowerCase());
          setTimeout(() => {
            setCollapsingVault(null);
          }, 150);
        }

        setExpandingVault(normalizedAddress);
        setTimeout(() => {
          setExpandingVault(null);
        }, 300);

        return {
          action,
          vaultAddress: vault.address,
          vaultName: vault.name,
        };
      });
    },
    [],
  );

  const triggerVaultRefresh = useCallback(() => {
    if (isDemoMode || !safeAddress) {
      return;
    }

    const runRefetches = () => {
      void refetchVaultStats();
      void refetchVaultsMany();
      void refetchUserPositions();
    };

    runRefetches();

    refetchTimeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    refetchTimeoutsRef.current = [];

    const scheduleRefetch = (delay: number) => {
      const timeoutId = setTimeout(runRefetches, delay);
      refetchTimeoutsRef.current.push(timeoutId);
    };

    scheduleRefetch(3000);
    scheduleRefetch(7000);
  }, [
    isDemoMode,
    refetchUserPositions,
    refetchVaultStats,
    refetchVaultsMany,
    safeAddress,
  ]);

  const handleDepositSuccess = useCallback(() => {
    triggerVaultRefresh();
  }, [triggerVaultRefresh]);

  const handleWithdrawSuccess = useCallback(() => {
    triggerVaultRefresh();
  }, [triggerVaultRefresh]);

  useEffect(() => {
    setSelectedVault({
      action: null,
      vaultAddress: null,
      vaultName: null,
    });
  }, [isDemoMode, safeAddress]);

  // Compute vault view models
  const vaultsVM = useMemo(() => {
    const toNumberOrFallback = (
      value: number | string | null | undefined,
      fallback: number,
    ) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    return BASE_VAULTS.map((v) => {
      const stat = vaultStatsMany?.find(
        (s) => s.vaultAddress.toLowerCase() === v.address.toLowerCase(),
      );
      const pos = userPositions?.find(
        (p) => p.vaultAddress.toLowerCase() === v.address.toLowerCase(),
      );

      const balanceUsd = pos?.assetsUsd ? Number(pos.assetsUsd) : 0;

      const extendedStat =
        stat && typeof stat === 'object' && 'principal' in stat
          ? (stat as {
              principal: bigint;
              principalRecorded?: bigint | null;
              yieldRecorded?: bigint | null;
              yieldCorrectionApplied?: 'ledger_shortfall' | 'rounding' | null;
            })
          : null;

      const principalUsd = extendedStat
        ? Number(extendedStat.principal) / 1e6
        : balanceUsd;

      const recordedPrincipalUsd =
        extendedStat?.principalRecorded !== undefined &&
        extendedStat?.principalRecorded !== null
          ? Number(extendedStat.principalRecorded) / 1e6
          : principalUsd;

      // APY is often returned as a decimal (0.0737 for 7.37%), convert to percentage
      const statWithApyFields = stat as
        | {
            monthlyNetApy?: number | string | null;
            monthlyApy?: number | string | null;
            netApy?: number | string | null;
            apy?: number | string | null;
          }
        | undefined;

      const displayApySource = toNumberOrFallback(
        statWithApyFields?.monthlyNetApy,
        toNumberOrFallback(
          statWithApyFields?.monthlyApy,
          toNumberOrFallback(
            statWithApyFields?.netApy,
            toNumberOrFallback(statWithApyFields?.apy, 0.08),
          ),
        ),
      );

      const netApySource = toNumberOrFallback(
        statWithApyFields?.netApy,
        toNumberOrFallback(statWithApyFields?.apy, displayApySource),
      );

      const apyDecimal =
        displayApySource > 1 ? displayApySource / 100 : displayApySource;
      const apy = apyDecimal * 100;
      const instantApy = netApySource > 1 ? netApySource / 100 : netApySource;

      // Try multiple fields for earned amount
      // Handle BigInt conversion for yield field
      const rawEarnedUsd =
        extendedStat?.yieldRecorded !== undefined &&
        extendedStat?.yieldRecorded !== null
          ? Number(extendedStat.yieldRecorded) / 1e6
          : null;

      const correctionReason = extendedStat?.yieldCorrectionApplied ?? null;

      const ledgerEarnedUsd =
        stat?.yield !== undefined && stat?.yield !== null
          ? Number(stat.yield) / 1e6
          : null;

      const fallbackEarnedUsd = balanceUsd - principalUsd;

      let earnedUsd = 0;

      // First priority: Use actual yield from ledger
      if (
        ledgerEarnedUsd !== null &&
        Number.isFinite(ledgerEarnedUsd) &&
        ledgerEarnedUsd >= 0
      ) {
        earnedUsd = ledgerEarnedUsd;
      }
      // Second priority: Use the difference between balance and principal if both are available
      else if (fallbackEarnedUsd > 0 && principalUsd > 0) {
        earnedUsd = fallbackEarnedUsd;
      }
      // Last resort: Estimate based on current balance and APY
      else if (balanceUsd > 0 && apy > 0) {
        // Use a more reasonable estimate - 14 days of earnings instead of 1
        // This prevents the animation from appearing to start from near 0
        // Most users have funds in the vault for at least 2 weeks
        earnedUsd = ((balanceUsd * (apy / 100)) / 365) * 14;
      }

      // Ensure non-negative earnings
      if (earnedUsd < 0) {
        earnedUsd = 0;
      }

      return {
        id: v.id,
        name: v.name,
        risk: v.risk,
        curator: v.curator,
        address: v.address,
        appUrl: v.appUrl,
        apy,
        balanceUsd,
        earnedUsd,
        principalUsd,
        recordedPrincipalUsd,
        rawEarnedUsd,
        yieldCorrectionReason: correctionReason,
        isAuto: v.id === 'morphoGauntlet',
        instantApy,
        isInsured:
          INSURED_VAULT_IDS.has(v.id) ||
          (userIsInsured && v.id === 'morphoGauntlet'),
        isContactOnly: false,
      };
    });
  }, [BASE_VAULTS, vaultStatsMany, userPositions]);

  // Calculate totals
  const insuredVaultEntry = useMemo(
    () => ({
      id: 'insured-vault',
      name: 'Insured Vault',
      risk: 'Conservative',
      curator: '0 Finance',
      address: 'insured-contact',
      appUrl: '',
      apy: 8,
      balanceUsd: 0,
      earnedUsd: 0,
      isAuto: false,
      instantApy: 0.08,
      isInsured: true,
      isContactOnly: true,
      insuranceSummary:
        'Dedicated coverage arranged by the 0 Finance insurance desk.',
    }),
    [],
  );

  const displayVaults = useMemo(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('insured-pill-animation');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'insured-pill-animation';
        style.innerHTML = insuredPillAnimation;
        document.head.appendChild(style);
      }
    }

    // Don't show the mock insured vault if user has real insurance
    const insured = userIsInsured
      ? [...vaultsVM.filter((vault) => vault.isInsured)]
      : [insuredVaultEntry, ...vaultsVM.filter((vault) => vault.isInsured)];
    const others = vaultsVM.filter((vault) => !vault.isInsured);
    return [...insured, ...others];
  }, [insuredVaultEntry, vaultsVM, userIsInsured]);

  const hasYieldCorrection = useMemo(
    () => vaultsVM.some((vault) => Boolean(vault.yieldCorrectionReason)),
    [vaultsVM],
  );

  const hasLedgerShortfallCorrection = useMemo(
    () =>
      vaultsVM.some(
        (vault) => vault.yieldCorrectionReason === 'ledger_shortfall',
      ),
    [vaultsVM],
  );

  const showYieldCorrectionBanner = !isDemoMode && hasYieldCorrection;

  const InsuranceContactPanel = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={ZERO_LOGO_SRC}
            alt="0 Finance logo"
            width={42}
            height={42}
            className="h-10 w-10 rounded-md"
          />
          <div>
            <p className="text-[15px] font-medium text-[#101010]">
              Speak with our coverage team
            </p>
            <p className="text-[13px] text-[#101010]/70 max-w-[420px]">
              We arrange bespoke insurance policies for treasury deposits. Reach
              out to secure coverage on this 8% vault.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`mailto:${INSURANCE_CONTACT.email}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
          >
            <Mail className="h-4 w-4" /> Email {INSURANCE_CONTACT.email}
          </a>
          <a
            href={INSURANCE_CONTACT.scheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium text-[#101010] border border-[#101010]/15 hover:bg-[#F7F7F2] transition-colors"
          >
            <CalendarDays className="h-4 w-4" /> Schedule a call
          </a>
        </div>
      </div>
      <div className="border border-dashed border-[#1B29FF]/30 rounded-lg p-4 bg-[#1B29FF]/5">
        <p className="text-[13px] text-[#1B29FF]">
          Coverage is issued through our underwriting partners after a short
          call. We’ll validate treasury size, coverage needs, and onboard you
          end-to-end.
        </p>
      </div>
    </div>
  );

  const totalSaved = vaultsVM.reduce((sum, v) => sum + v.balanceUsd, 0);
  const totalEarned = vaultsVM.reduce((sum, v) => sum + v.earnedUsd, 0);
  const averageApy =
    vaultsVM.length > 0
      ? vaultsVM.reduce((sum, v) => sum + v.apy, 0) / vaultsVM.length
      : 8.0;

  const averageInstantApy = (() => {
    if (totalSaved > 0) {
      const weightedSum = vaultsVM.reduce(
        (sum, v) => sum + v.instantApy * v.balanceUsd,
        0,
      );
      return weightedSum / totalSaved;
    }

    if (vaultsVM.length > 0) {
      return (
        vaultsVM.reduce((sum, v) => sum + v.instantApy, 0) / vaultsVM.length
      );
    }

    return 0.08;
  })();

  const animatedInitialEarned = isDemoMode ? 0 : totalEarned;
  const animatedBalance = isDemoMode ? totalSaved || 2500000 : totalSaved;
  const fallbackApyPercent = Number.isFinite(averageInstantApy)
    ? averageInstantApy * 100
    : 8;

  const isInitialLoading =
    isLoadingSafes ||
    isLoadingState ||
    (!isDemoMode &&
      ((realVaultStats.isLoading && !realVaultStats.data) ||
        (realVaultStatsMany.isLoading && !realVaultStatsMany.data) ||
        (realUserPositions.isLoading && !realUserPositions.data)));

  // Loading state with skeleton
  if (isInitialLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-[#101010]/5 rounded animate-pulse" />
          <div className="h-10 w-64 bg-[#101010]/5 rounded animate-pulse" />
          <div className="h-4 w-full max-w-[440px] bg-[#101010]/5 rounded animate-pulse" />
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10 rounded-lg overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 space-y-3">
                <div className="h-3 w-20 bg-[#101010]/5 rounded animate-pulse" />
                <div className="h-8 w-28 bg-[#101010]/5 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#101010]/10 rounded-lg p-6 space-y-4">
            <div className="h-3 w-36 bg-[#101010]/5 rounded animate-pulse" />
            <div className="h-12 w-52 bg-[#101010]/5 rounded animate-pulse" />
          </div>

          <div className="bg-white border border-[#101010]/10 rounded-lg">
            <div className="p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
              <div className="h-4 w-full bg-[#101010]/5 rounded animate-pulse" />
            </div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 border-b border-[#101010]/5">
                <div className="h-6 w-full bg-[#101010]/5 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show activation prompt for users without a safe (new users)
  if (!safeAddress && !isDemoMode) {
    return (
      <div className="py-10 text-center">
        <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
        <h2 className="font-serif text-[32px] leading-[1.1] text-[#101010] mb-3">
          Activate Your Savings Account
        </h2>
        <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[400px] mx-auto">
          Start earning 8% APY on your business funds. Complete your account
          setup to get started.
        </p>
        <Link href="/onboarding/kyc">
          <Button className="bg-[#1B29FF] hover:bg-[#1B29FF]/90">
            Complete Setup to Activate
          </Button>
        </Link>
      </div>
    );
  }

  // Error state only for actual errors
  if (safesError) {
    return (
      <Alert className="border-[#101010]/10">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-[#101010]/70">
          Unable to load savings data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      {/* Always show the full savings interface - auto-earn module is now optional */}
      <div className="space-y-12">
        {/* Portfolio Overview - Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          <CheckingActionsCard
            balanceUsd={withdrawableBalanceUsd}
            safeAddress={safeAddress}
            isDemoMode={isDemoMode}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Savings Balance
              </p>
              <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#101010]">
                {formatUsd(totalSaved)}
              </p>
              <p className="mt-2 text-[13px] text-[#101010]/60">
                Deposited across {vaultsVM.length} active strategies.
              </p>
            </div>

            <div className="bg-white border border-[#101010]/10 rounded-[12px] p-6">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Earnings (Live)
              </p>
              <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
                {isDemoMode ? (
                  <AnimatedTotalEarned
                    initialEarned={animatedInitialEarned}
                    apy={averageInstantApy}
                    balance={animatedBalance}
                  />
                ) : safeAddress ? (
                  <AnimatedTotalEarnedV2
                    safeAddress={safeAddress}
                    fallbackApy={fallbackApyPercent}
                    fallbackBalance={totalSaved}
                    className="inline-block"
                  />
                ) : (
                  <span className="text-[#101010]/40">Calculating...</span>
                )}
              </p>
              <p className="mt-2 text-[13px] text-[#101010]/60">
                Live counter refreshes as vault yield accrues.
              </p>
            </div>
          </div>
        </div>

        {/* Live Yield Counter - Premium Card */}
        {totalSaved > 0 && (
          <div className="bg-white border border-[#101010]/10 p-8">
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-6">
              Real-Time Yield Accumulation
            </p>
            <AnimatedYieldCounter
              principal={totalSaved}
              apy={averageApy}
              showDaily={true}
              showMonthly={true}
              showYearly={true}
              formatOptions={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              }}
            />
          </div>
        )}

        {/* Vaults Section - Editorial Table Style */}
        <div id="vaults-section">
          <div className="mb-8">
            <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60">
              Available Strategies
            </p>
          </div>

          {/* Vault Table - Responsive */}
          <div className="bg-white border border-[#101010]/10 overflow-x-auto">
            {/* Desktop Table View */}
            <div className="hidden lg:block min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
                <div className="col-span-5">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    Vault Name
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    APY
                  </p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    Balance
                  </p>
                </div>
                <div className="col-span-3 text-right">
                  <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                    Actions
                  </p>
                </div>
              </div>

              {/* Vault Rows */}
              {displayVaults.map((vault, index) => {
                const normalizedAddress = vault.address.toLowerCase();
                const isSelected =
                  selectedVault.vaultAddress?.toLowerCase() ===
                  normalizedAddress;
                const expandedAction = isSelected ? selectedVault.action : null;
                const isExpanding = expandingVault === normalizedAddress;
                const isCollapsing = collapsingVault === normalizedAddress;

                return (
                  <div
                    key={vault.id}
                    className={cn(
                      'group relative overflow-hidden',
                      index !== displayVaults.length - 1 &&
                        !isSelected &&
                        'border-b border-[#101010]/10',
                    )}
                  >
                    <div
                      className={cn(
                        'grid grid-cols-12 gap-3 p-4 items-center transition-all duration-200 relative z-10',
                        vault.isInsured
                          ? 'bg-[#1B29FF]/5 hover:bg-[#1B29FF]/10 border-l-2 border-[#1B29FF]'
                          : 'hover:bg-[#F7F7F2]/30',
                        isSelected &&
                          (vault.isInsured
                            ? 'ring-1 ring-[#1B29FF]/30 bg-[#1B29FF]/12'
                            : 'bg-[#F7F7F2]/50'),
                        (isExpanding || isCollapsing) && 'transition-none',
                      )}
                    >
                      <div className="col-span-5">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {vault.isAuto && (
                                <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider shrink-0">
                                  Auto
                                </span>
                              )}
                              <p className="text-[15px] font-medium text-[#101010] truncate">
                                {vault.name}
                              </p>
                              {vault.isInsured && (
                                <span className="insured-pill animate-glow inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#1B29FF]/15 text-[#1B29FF] text-[10px] font-semibold uppercase tracking-[0.18em]">
                                  <Image
                                    src={ZERO_LOGO_SRC}
                                    alt="0 Finance insured"
                                    width={14}
                                    height={14}
                                    className="h-3.5 w-3.5"
                                  />
                                  Insured
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#101010]/60 truncate mt-1">
                              {vault.curator}
                              {vault.risk ? ` · ${vault.risk}` : ''}
                              {vault.isContactOnly &&
                                ' · Coverage arranged via 0 Finance'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      <div className="col-span-2 text-right">
                        <p className="text-[16px] tabular-nums text-[#101010]">
                          {vault.isContactOnly
                            ? '—'
                            : formatUsd(vault.balanceUsd)}
                        </p>
                        {vault.earnedUsd > 0 && !vault.isContactOnly && (
                          <p className="text-[12px] tabular-nums text-[#1B29FF]">
                            +{formatUsd(vault.earnedUsd)}
                          </p>
                        )}
                      </div>

                      <div className="col-span-3 flex justify-end gap-1">
                        {vault.isContactOnly ? (
                          <button
                            onClick={() => toggleVaultAction('insure', vault)}
                            className={cn(
                              'px-3 py-2 text-[12px] font-medium text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
                              expandedAction === 'insure' &&
                                isSelected &&
                                'ring-2 ring-offset-1 ring-[#1B29FF]/40',
                            )}
                          >
                            Connect with coverage
                          </button>
                        ) : isDemoMode ? (
                          <>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to deposit funds from your real account.',
                                )
                              }
                              className="px-2.5 py-1 text-[12px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to withdraw from live vault positions.',
                                )
                              }
                              className="px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                toggleVaultAction('deposit', vault)
                              }
                              className={cn(
                                'px-2.5 py-1 text-[12px] text-white transition-colors',
                                expandedAction === 'deposit' && isSelected
                                  ? 'bg-[#1420CC]'
                                  : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                              )}
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toggleVaultAction('withdraw', vault)
                              }
                              className={cn(
                                'px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 transition-colors',
                                expandedAction === 'withdraw' && isSelected
                                  ? 'bg-[#F7F7F2]'
                                  : 'bg-white hover:bg-[#F7F7F2]',
                              )}
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 text-[#101010]/60 hover:text-[#101010] transition-colors flex items-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Accordion Content - Clean Integrated Design */}
                    {(expandedAction === 'insure' && isSelected) ||
                    (!isDemoMode && expandedAction && isSelected) ? (
                      <div
                        className={cn(
                          'transition-all duration-300 ease-out overflow-hidden',
                          expandedAction && isSelected
                            ? 'max-h-[800px] opacity-100'
                            : 'max-h-0 opacity-0',
                          isExpanding &&
                            'animate-in fade-in slide-in-from-top-1',
                        )}
                      >
                        <div className="px-4 pb-4 bg-[#F7F7F2]/50">
                          <div className="bg-white border border-[#101010]/10 p-5 sm:p-6">
                            {expandedAction === 'insure' && isSelected ? (
                              <InsuranceContactPanel />
                            ) : expandedAction === 'deposit' && isSelected ? (
                              <DepositEarnCard
                                key={`deposit-${vault.address}`}
                                safeAddress={safeAddress as Address}
                                vaultAddress={vault.address as Address}
                                onDepositSuccess={handleDepositSuccess}
                              />
                            ) : expandedAction === 'withdraw' && isSelected ? (
                              <WithdrawEarnCard
                                key={`withdraw-${vault.address}`}
                                safeAddress={safeAddress as Address}
                                vaultAddress={vault.address as Address}
                                onWithdrawSuccess={handleWithdrawSuccess}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden">
              {displayVaults.map((vault, index) => {
                const normalizedAddress = vault.address.toLowerCase();
                const isSelected =
                  selectedVault.vaultAddress?.toLowerCase() ===
                  normalizedAddress;
                const expandedAction = isSelected ? selectedVault.action : null;
                const isExpanding = expandingVault === normalizedAddress;
                const isCollapsing = collapsingVault === normalizedAddress;

                return (
                  <div
                    key={vault.id}
                    className={cn(
                      'relative overflow-hidden transition-all duration-200',
                      index !== displayVaults.length - 1 &&
                        !isSelected &&
                        'border-b border-[#101010]/5',
                    )}
                  >
                    <div
                      className={cn(
                        'p-4 space-y-3 transition-all duration-200',
                        vault.isInsured ? 'bg-[#1B29FF]/10' : 'bg-white',
                        isSelected &&
                          (vault.isInsured
                            ? 'ring-1 ring-[#1B29FF]/40 bg-[#1B29FF]/14'
                            : 'bg-[#F7F7F2]/40'),
                        (isExpanding || isCollapsing) && 'transition-none',
                      )}
                    >
                      {/* Vault Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {vault.isAuto && (
                                <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider">
                                  Auto
                                </span>
                              )}
                              <p className="text-[15px] font-medium text-[#101010]">
                                {vault.name}
                              </p>
                              {vault.isInsured && (
                                <span className="insured-pill animate-glow inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1B29FF]/15 text-[#1B29FF] text-[10px] font-semibold uppercase tracking-[0.18em]">
                                  <Image
                                    src={ZERO_LOGO_SRC}
                                    alt="0 Finance insured"
                                    width={14}
                                    height={14}
                                    className="h-3.5 w-3.5"
                                  />
                                  Insured
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#101010]/60">
                              {vault.curator}
                              {vault.risk ? ` · ${vault.risk}` : ''}
                              {vault.isContactOnly &&
                                ' · Coverage arranged via 0 Finance'}
                            </p>
                          </div>
                        </div>
                        <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
                          {vault.apy.toFixed(1)}%
                        </p>
                      </div>

                      {/* Vault Stats */}
                      <div className="flex justify-between text-[14px]">
                        <span className="text-[#101010]/60">Balance</span>
                        <span className="tabular-nums text-[#101010]">
                          {vault.isContactOnly
                            ? '—'
                            : formatUsd(vault.balanceUsd)}
                        </span>
                      </div>
                      {vault.earnedUsd > 0 && !vault.isContactOnly && (
                        <div className="flex justify-between text-[14px]">
                          <span className="text-[#101010]/60">Earned</span>
                          <span className="tabular-nums text-[#1B29FF]">
                            +{formatUsd(vault.earnedUsd)}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        {vault.isContactOnly ? (
                          <button
                            onClick={() => toggleVaultAction('insure', vault)}
                            className={cn(
                              'flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors',
                              expandedAction === 'insure' &&
                                isSelected &&
                                'ring-2 ring-offset-1 ring-[#1B29FF]/40',
                            )}
                          >
                            Connect with coverage
                          </button>
                        ) : isDemoMode ? (
                          <>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to deposit funds from your real account.',
                                )
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toast(
                                  'Sign in to withdraw from live vault positions.',
                                )
                              }
                              className="flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors flex items-center justify-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() =>
                                toggleVaultAction('deposit', vault)
                              }
                              className={cn(
                                'flex-1 px-3 py-2 text-[13px] text-white transition-colors',
                                expandedAction === 'deposit' && isSelected
                                  ? 'bg-[#1420CC]'
                                  : 'bg-[#1B29FF] hover:bg-[#1420CC]',
                              )}
                            >
                              Deposit
                            </button>
                            <button
                              onClick={() =>
                                toggleVaultAction('withdraw', vault)
                              }
                              className={cn(
                                'flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 transition-colors',
                                expandedAction === 'withdraw' && isSelected
                                  ? 'bg-[#F7F7F2]'
                                  : 'bg-white hover:bg-[#F7F7F2]',
                              )}
                            >
                              Withdraw
                            </button>
                            {vault.appUrl && (
                              <a
                                href={vault.appUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-2 text-[13px] text-[#101010]/60 hover:text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors flex items-center justify-center"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        )}
                      </div>

                      {/* Mobile Accordion Content */}
                      {(expandedAction === 'insure' && isSelected) ||
                      (!isDemoMode && expandedAction && isSelected) ? (
                        <div
                          className={cn(
                            'transition-all duration-300 ease-out overflow-hidden',
                            expandedAction && isSelected
                              ? 'max-h-[800px] opacity-100'
                              : 'max-h-0 opacity-0',
                            isExpanding &&
                              'animate-in fade-in slide-in-from-top-1',
                          )}
                        >
                          <div className="px-4 pt-3 pb-4">
                            <div className="bg-white border border-[#101010]/10 p-4">
                              {expandedAction === 'insure' && isSelected ? (
                                <InsuranceContactPanel />
                              ) : expandedAction === 'deposit' && isSelected ? (
                                <DepositEarnCard
                                  key={`deposit-mobile-${vault.address}`}
                                  safeAddress={safeAddress as Address}
                                  vaultAddress={vault.address as Address}
                                  onDepositSuccess={handleDepositSuccess}
                                />
                              ) : expandedAction === 'withdraw' &&
                                isSelected ? (
                                <WithdrawEarnCard
                                  key={`withdraw-mobile-${vault.address}`}
                                  safeAddress={safeAddress as Address}
                                  vaultAddress={vault.address as Address}
                                  onWithdrawSuccess={handleWithdrawSuccess}
                                />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Auto-Savings Status - Minimal Card */}
        {savingsState?.enabled && (
          <div className="bg-[#F6F5EF] border border-[#101010]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Auto-Savings Active
                </p>
                <p className="text-[16px] text-[#101010]">
                  Automatically saving {savingsState.allocation}% of incoming
                  deposits
                </p>
              </div>
              {isDemoMode ? (
                <button
                  onClick={() =>
                    toast(
                      'Configure auto-savings once your live account is activated.',
                    )
                  }
                  className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
                >
                  Configure →
                </button>
              ) : (
                <Link
                  href="/dashboard/savings/settings"
                  className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
                >
                  Configure →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
