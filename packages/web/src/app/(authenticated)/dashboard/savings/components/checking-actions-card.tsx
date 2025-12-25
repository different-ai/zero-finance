'use client';

import { useState } from 'react';
import {
  ArrowRightCircle,
  Info,
  Building2,
  Wallet,
  ArrowLeft,
  Loader2,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { AccountInfoDialog } from '@/components/virtual-accounts/account-info-dialog';
import { BankingInstructionsDisplay } from '@/components/virtual-accounts/banking-instructions-display';
import { CryptoDepositDisplay } from '@/components/virtual-accounts/crypto-deposit-display';
import { RedeemSuperOethModal } from './redeem-super-oeth-modal';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrivy } from '@privy-io/react-auth';
import { useSafeOwnerCheck } from '@/hooks/use-safe-owner-check';
import { api } from '@/trpc/react';
import { formatUsd, cn } from '@/lib/utils';
import { demoFundingSources } from '../demo-data';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/lib/constants';
import type { Address } from 'viem';
import { BlueprintGrid, Crosshairs } from '@/components/ui/bimodal';
import { type VaultPosition } from '@/app/(authenticated)/dashboard/(bank)/components/dashboard-summary-wrapper';
import { BASE_USDC_VAULTS } from '@/server/earn/base-vaults';

type DepositView = 'select' | 'bank' | 'crypto';

type CheckingActionsCardProps = {
  balanceUsd: number;
  safeAddress: string | null;
  isDemoMode: boolean;
  isTechnical?: boolean;
};

export function CheckingActionsCard({
  balanceUsd,
  safeAddress,
  isDemoMode,
  isTechnical = false,
}: CheckingActionsCardProps) {
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositView, setDepositView] = useState<DepositView>('select');
  const isMobile = useIsMobile();
  const { ready, authenticated, user } = usePrivy();

  // Reset deposit view when dialog closes
  const handleDepositOpenChange = (open: boolean) => {
    setIsDepositOpen(open);
    if (!open) {
      setDepositView('select');
    }
  };
  const { isOwner, isChecking: isCheckingOwnership } =
    useSafeOwnerCheck(safeAddress);

  const {
    data: accountData,
    isLoading: isLoadingFundingSources,
    refetch: refetchFundingSources,
  } = api.align.getVirtualAccountDetails.useQuery(undefined, {
    enabled: !isDemoMode && ready && authenticated && !!user?.id,
  });

  // Always fetch multi-chain data to show balances
  const { data: multiChainData, isLoading: isLoadingMultiChain } =
    api.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: !isDemoMode,
      staleTime: 30000, // Cache for 30 seconds
    });

  // Fetch balances for all safes
  const baseSafe = multiChainData?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.BASE,
  );
  const arbitrumSafe = multiChainData?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.ARBITRUM,
  );
  const gnosisSafe = multiChainData?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.GNOSIS,
  );

  // Fetch USDC balances with caching
  const { data: baseBalanceData } = api.earn.getSafeBalanceOnChain.useQuery(
    {
      safeAddress: baseSafe?.address || '',
      chainId: SUPPORTED_CHAINS.BASE,
    },
    {
      enabled: !!baseSafe?.address,
      staleTime: 30000, // Cache for 30 seconds
      refetchInterval: 60000, // Refetch every minute
    },
  );

  const { data: arbitrumBalanceData } = api.earn.getSafeBalanceOnChain.useQuery(
    {
      safeAddress: arbitrumSafe?.address || '',
      chainId: SUPPORTED_CHAINS.ARBITRUM,
    },
    {
      enabled: !!arbitrumSafe?.address,
      staleTime: 30000,
      refetchInterval: 60000,
    },
  );

  // Fetch ETH balances (native balance) with caching
  const { data: baseEthBalance } = api.earn.getNativeBalance.useQuery(
    {
      safeAddress: baseSafe?.address || '',
      chainId: SUPPORTED_CHAINS.BASE,
    },
    {
      enabled: !!baseSafe?.address,
      staleTime: 30000,
      refetchInterval: 60000,
    },
  );

  const { data: arbitrumEthBalance } = api.earn.getNativeBalance.useQuery(
    {
      safeAddress: arbitrumSafe?.address || '',
      chainId: SUPPORTED_CHAINS.ARBITRUM,
    },
    {
      enabled: !!arbitrumSafe?.address,
      staleTime: 30000,
      refetchInterval: 60000,
    },
  );

  // Fetch Gnosis xDAI balance (native token on Gnosis)
  const { data: gnosisXdaiBalance } = api.earn.getNativeBalance.useQuery(
    {
      safeAddress: gnosisSafe?.address || '',
      chainId: SUPPORTED_CHAINS.GNOSIS,
    },
    {
      enabled: !!gnosisSafe?.address,
      staleTime: 30000,
      refetchInterval: 60000,
    },
  );

  // Fetch Super OETH balance (yield-bearing ETH)
  // Prefetch eagerly when baseSafe is available to avoid UI delay
  const { data: superOethBalanceData, refetch: refetchSuperOeth } =
    api.earn.getSuperOethBalance.useQuery(
      {
        safeAddress: baseSafe?.address || '',
      },
      {
        enabled: !!baseSafe?.address,
        staleTime: 10000, // Lower staleTime for faster updates
        refetchInterval: 30000, // Refetch more frequently
      },
    );

  // Fetch vault positions for earning balance (USDC in vaults)
  const baseVaultAddresses = BASE_USDC_VAULTS.map((v) => v.address);

  const { data: userVaultPositions } = api.earn.userPositions.useQuery(
    { vaultAddresses: baseVaultAddresses },
    {
      enabled: !isDemoMode,
      staleTime: 30000,
      refetchInterval: 60000,
    },
  );

  // Fetch vault stats for APY data
  const { data: vaultStats } = api.earn.statsByVault.useQuery(
    {
      safeAddress: baseSafe?.address || '',
      vaultAddresses: baseVaultAddresses,
    },
    {
      enabled: !!baseSafe?.address && !isDemoMode,
      staleTime: 30000,
      refetchInterval: 60000,
    },
  );

  // Calculate total balance across all chains
  const baseUsdcBalance = baseBalanceData
    ? parseFloat(formatUnits(BigInt(baseBalanceData.balance), USDC_DECIMALS))
    : 0;
  const arbitrumUsdcBalance = arbitrumBalanceData
    ? parseFloat(
        formatUnits(BigInt(arbitrumBalanceData.balance), USDC_DECIMALS),
      )
    : 0;

  // ETH balances
  const baseEthBalanceNum = baseEthBalance
    ? parseFloat(formatUnits(BigInt(baseEthBalance.balance), 18))
    : 0;
  const arbitrumEthBalanceNum = arbitrumEthBalance
    ? parseFloat(formatUnits(BigInt(arbitrumEthBalance.balance), 18))
    : 0;

  // Gnosis xDAI balance (native token, 18 decimals, ~1:1 with USD)
  const gnosisXdaiBalanceNum = gnosisXdaiBalance
    ? parseFloat(formatUnits(BigInt(gnosisXdaiBalance.balance), 18))
    : 0;

  // ETH USD values (approximate)
  const ethPrice = 3000; // TODO: Fetch real-time price
  const baseEthUsd = baseEthBalanceNum * ethPrice;
  const arbitrumEthUsd = arbitrumEthBalanceNum * ethPrice;

  // Super OETH balance (yield-bearing ETH, ~1:1 with ETH)
  const superOethBalance = superOethBalanceData
    ? parseFloat(superOethBalanceData.formatted)
    : 0;
  const superOethUsd = superOethBalance * ethPrice;

  // Total per chain (USDC + ETH + superOETH in USD)
  const baseTotalUsd = baseUsdcBalance + baseEthUsd + superOethUsd;
  const arbitrumTotalUsd = arbitrumUsdcBalance + arbitrumEthUsd;
  const gnosisTotalUsd = gnosisXdaiBalanceNum; // xDAI is ~1:1 with USD

  // Total available balance (not in vaults) - this is the "idle" balance
  const totalAvailableBalance =
    baseTotalUsd + arbitrumTotalUsd + gnosisTotalUsd;

  // Calculate earning balance from vault positions (USDC earning yield)
  const earningBalance =
    userVaultPositions?.reduce((total, position) => {
      return total + (position.assetsUsd || 0);
    }, 0) || 0;

  // Idle balance = USDC in Safe (not earning) - using Base USDC for off-ramp
  const idleBalance = baseUsdcBalance;

  // Spendable = Total (Earning + Idle)
  const spendableBalance = earningBalance + idleBalance;

  // Build vault positions with APY for transfer flow (Base chain only)
  const vaultPositions: VaultPosition[] =
    userVaultPositions && vaultStats
      ? userVaultPositions
          .filter((p) => p.chainId === SUPPORTED_CHAINS.BASE && p.assetsUsd > 0)
          .map((position) => {
            const stat = vaultStats.find(
              (s) =>
                s.vaultAddress.toLowerCase() ===
                position.vaultAddress.toLowerCase(),
            );
            return {
              ...position,
              apy: stat?.apy ? stat.apy * 100 : 0, // Convert to percentage
            };
          })
      : [];

  const hasAnyBalance =
    totalAvailableBalance > 0 || balanceUsd > 0 || earningBalance > 0;

  const fundingSources = isDemoMode
    ? demoFundingSources
    : accountData?.fundingSources || [];
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

  const hasOnlyStarterAccounts = !hasCompletedKyc && fundingSources.length > 0;
  // In technical mode, bypass starter account AND ownership restrictions - power users can always withdraw
  // Ownership check is skipped in technical mode because workspace members share Safe access
  const canInitiateMove =
    (isDemoMode || totalAvailableBalance > 0) &&
    !!safeAddress &&
    (isTechnical || !hasOnlyStarterAccounts) &&
    (isTechnical || isOwner !== false);
  const disableReason = !safeAddress
    ? 'Add a treasury safe to move funds'
    : !isTechnical && isOwner === false
      ? 'You are not an owner of this Safe'
      : totalAvailableBalance <= 0
        ? 'No withdrawable balance available'
        : !isTechnical && hasOnlyStarterAccounts
          ? 'Complete business verification to enable withdrawals'
          : undefined;

  // In banking mode, only show Base USDC balance
  const displayBalance = isTechnical
    ? isDemoMode
      ? balanceUsd
      : totalAvailableBalance
    : isDemoMode
      ? balanceUsd
      : baseUsdcBalance;

  return (
    <div
      className={cn(
        'relative overflow-hidden p-6 space-y-6 transition-all duration-300',
        isTechnical
          ? 'bg-white border border-[#1B29FF]/20 rounded-sm shadow-none'
          : 'bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
      )}
    >
      {/* Blueprint Grid (Technical only) */}
      {isTechnical && <BlueprintGrid />}

      {/* Crosshairs (Technical only) */}
      {isTechnical && (
        <>
          <Crosshairs position="top-left" />
          <Crosshairs position="top-right" />
        </>
      )}

      {/* Meta Tag (Technical only) */}
      {isTechnical && (
        <div className="absolute top-2 right-8 font-mono text-[9px] text-[#101010]/40 tracking-wider">
          ID::TREASURY_001
        </div>
      )}

      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div className="flex-1">
          {isTechnical ? (
            <>
              <p className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase mb-2">
                FUNDS::READY_TO_ALLOCATE
              </p>
              <p className="font-mono text-[28px] tabular-nums text-[#101010]">
                {displayBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="ml-1 text-[14px] text-[#1B29FF]">USDC</span>
              </p>
              <p className="mt-2 font-mono text-[11px] text-[#101010]/60">
                ≈ {formatUsd(displayBalance)} USD
              </p>
            </>
          ) : (
            <>
              <p className="uppercase tracking-[0.16em] text-[11px] text-[#101010]/60 mb-2">
                Ready to Allocate
              </p>
              <p className="text-[32px] sm:text-[40px] font-semibold leading-[0.95] tabular-nums text-[#101010]">
                {formatUsd(displayBalance)}
              </p>
              <p className="mt-3 text-[13px] text-[#101010]/60">
                Funds available for vault deposits
              </p>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row flex-wrap gap-3">
        {/* Deposit Button */}
        <Dialog open={isDepositOpen} onOpenChange={handleDepositOpenChange}>
          <DialogTrigger asChild>
            <Button
              className={cn(
                'flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 transition-all duration-200',
                isTechnical
                  ? 'border-2 border-[#1B29FF] bg-[#1B29FF] text-white font-mono px-4 py-2.5 rounded-sm hover:bg-[#1420CC] text-[13px] font-medium'
                  : 'px-5 py-3 text-[15px] font-semibold text-white bg-[#1B29FF] hover:bg-[#1420CC]',
              )}
            >
              <Plus className="h-5 w-5" />
              {isTechnical ? '[ DEPOSIT ]' : 'Deposit'}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={cn(
              'bg-white border-[#101010]/10',
              depositView === 'select'
                ? 'max-w-md'
                : 'max-w-2xl max-h-[90vh] overflow-y-auto',
            )}
          >
            {/* Selection View */}
            {depositView === 'select' && (
              <>
                <DialogHeader className="border-b border-[#101010]/10 pb-4">
                  <DialogTitle
                    className={cn(
                      isTechnical
                        ? 'font-mono text-[18px] text-[#1B29FF]'
                        : 'text-[22px] font-semibold tracking-[-0.01em] text-[#101010]',
                    )}
                  >
                    {isTechnical ? 'DEPOSIT::FUNDS' : 'Deposit'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 pt-6 pb-2">
                  {/* Bank Transfer Option */}
                  <button
                    onClick={() => {
                      setDepositView('bank');
                    }}
                    className={cn(
                      'w-full flex items-center gap-4 p-5 transition-all group text-left',
                      isTechnical
                        ? 'border border-[#1B29FF]/20 hover:border-[#1B29FF]/40 hover:bg-[#1B29FF]/5'
                        : 'border border-[#101010]/10 rounded-[12px] hover:border-[#1B29FF]/30 hover:shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
                    )}
                  >
                    <div
                      className={cn(
                        'h-12 w-12 flex items-center justify-center',
                        isTechnical
                          ? 'bg-[#1B29FF]/10'
                          : 'bg-[#F7F7F2] rounded-full',
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-6 w-6',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/70',
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          'text-[16px] font-medium mb-0.5',
                          isTechnical
                            ? 'font-mono text-[#1B29FF]'
                            : 'text-[#101010]',
                        )}
                      >
                        {isTechnical ? 'ACH::WIRE' : 'ACH / Wire'}
                      </p>
                      <p
                        className={cn(
                          'text-[13px]',
                          isTechnical
                            ? 'font-mono text-[#101010]/60'
                            : 'text-[#101010]/60',
                        )}
                      >
                        {isTechnical
                          ? 'ACH / SEPA / Wire → USDC'
                          : 'Receive via ACH or wire transfer'}
                      </p>
                    </div>
                    <ArrowRightCircle
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isTechnical
                          ? 'text-[#1B29FF]/40 group-hover:text-[#1B29FF]'
                          : 'text-[#101010]/20 group-hover:text-[#1B29FF]',
                      )}
                    />
                  </button>

                  {/* Crypto Deposit Option */}
                  {(baseSafe || safeAddress) && (
                    <button
                      onClick={() => setDepositView('crypto')}
                      className={cn(
                        'w-full flex items-center gap-4 p-5 transition-all group text-left',
                        isTechnical
                          ? 'border border-[#1B29FF]/20 hover:border-[#1B29FF]/40 hover:bg-[#1B29FF]/5'
                          : 'border border-[#101010]/10 rounded-[12px] hover:border-[#1B29FF]/30 hover:shadow-[0_2px_8px_rgba(16,16,16,0.04)]',
                      )}
                    >
                      <div
                        className={cn(
                          'h-12 w-12 flex items-center justify-center',
                          isTechnical
                            ? 'bg-[#1B29FF]/10'
                            : 'bg-[#F7F7F2] rounded-full',
                        )}
                      >
                        <Wallet
                          className={cn(
                            'h-6 w-6',
                            isTechnical
                              ? 'text-[#1B29FF]'
                              : 'text-[#101010]/70',
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-[16px] font-medium mb-0.5',
                            isTechnical
                              ? 'font-mono text-[#1B29FF]'
                              : 'text-[#101010]',
                          )}
                        >
                          {isTechnical ? 'CRYPTO::DEPOSIT' : 'Crypto Deposit'}
                        </p>
                        <p
                          className={cn(
                            'text-[13px]',
                            isTechnical
                              ? 'font-mono text-[#101010]/60'
                              : 'text-[#101010]/60',
                          )}
                        >
                          {isTechnical
                            ? 'USDC on Base → Direct to Safe'
                            : 'Send USDC on Base network'}
                        </p>
                      </div>
                      <ArrowRightCircle
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isTechnical
                            ? 'text-[#1B29FF]/40 group-hover:text-[#1B29FF]'
                            : 'text-[#101010]/20 group-hover:text-[#1B29FF]',
                        )}
                      />
                    </button>
                  )}
                </div>
              </>
            )}

            {/* Bank Transfer View */}
            {depositView === 'bank' && (
              <>
                <DialogHeader className="border-b border-[#101010]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDepositView('select')}
                      className={cn(
                        'p-2 -ml-2 transition-colors',
                        isTechnical
                          ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]'
                          : 'hover:bg-[#F7F7F2] text-[#101010]/60 rounded-full',
                      )}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <DialogTitle
                      className={cn(
                        'flex items-center gap-2',
                        isTechnical
                          ? 'font-mono text-[18px] text-[#1B29FF]'
                          : 'text-[22px] font-semibold tracking-[-0.01em] text-[#101010]',
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-5 w-5',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
                        )}
                      />
                      {isTechnical ? 'ACH::WIRE' : 'ACH / Wire Transfer'}
                    </DialogTitle>
                  </div>
                </DialogHeader>

                {isLoadingFundingSources ? (
                  <div className="py-12 text-center">
                    <Loader2
                      className={cn(
                        'h-8 w-8 animate-spin mx-auto mb-4',
                        'text-[#1B29FF]',
                      )}
                    />
                    <p
                      className={cn(
                        'text-[14px]',
                        isTechnical
                          ? 'font-mono text-[#1B29FF]'
                          : 'text-[#101010]/60',
                      )}
                    >
                      {isTechnical
                        ? 'LOADING::ACCOUNTS'
                        : 'Loading accounts...'}
                    </p>
                  </div>
                ) : fundingSources.length > 0 ? (
                  <BankingInstructionsDisplay
                    accounts={fundingSources}
                    userData={accountData?.userData}
                  />
                ) : (
                  <div
                    className={cn(
                      'py-12 text-center',
                      isTechnical && 'font-mono',
                    )}
                  >
                    <div
                      className={cn(
                        'mx-auto mb-4 h-16 w-16 flex items-center justify-center',
                        isTechnical
                          ? 'bg-[#1B29FF]/10'
                          : 'bg-[#F7F7F2] rounded-full',
                      )}
                    >
                      <Building2
                        className={cn(
                          'h-8 w-8',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/40',
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        'text-[16px] font-medium mb-2',
                        isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
                      )}
                    >
                      {isTechnical
                        ? 'NO_ACCOUNTS::FOUND'
                        : 'No bank accounts yet'}
                    </p>
                    <p
                      className={cn(
                        'text-[14px] max-w-[300px] mx-auto',
                        'text-[#101010]/60',
                      )}
                    >
                      {isTechnical
                        ? 'INIT::ONBOARDING -> CREATE::VIRTUAL_ACCOUNTS'
                        : 'Complete onboarding to get your virtual bank accounts.'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Crypto Deposit View */}
            {depositView === 'crypto' && (baseSafe || safeAddress) && (
              <>
                <DialogHeader className="border-b border-[#101010]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDepositView('select')}
                      className={cn(
                        'p-2 -ml-2 transition-colors',
                        isTechnical
                          ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]'
                          : 'hover:bg-[#F7F7F2] text-[#101010]/60 rounded-full',
                      )}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <DialogTitle
                      className={cn(
                        'flex items-center gap-2',
                        isTechnical
                          ? 'font-mono text-[18px] text-[#1B29FF]'
                          : 'text-[22px] font-semibold tracking-[-0.01em] text-[#101010]',
                      )}
                    >
                      <Wallet
                        className={cn(
                          'h-5 w-5',
                          isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
                        )}
                      />
                      {isTechnical ? 'CRYPTO::DEPOSIT' : 'Crypto Deposit'}
                    </DialogTitle>
                  </div>
                </DialogHeader>

                <div className="py-6">
                  <CryptoDepositDisplay
                    safeAddress={baseSafe?.address || safeAddress || ''}
                    chainName="Base"
                  />
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Transfer Button */}
        <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 transition-all duration-200',
                isTechnical
                  ? 'border border-[#1B29FF]/40 bg-white text-[#1B29FF] font-mono px-4 py-2.5 rounded-sm hover:border-[#1B29FF] hover:bg-[#1B29FF]/5 text-[13px]'
                  : 'px-5 py-3 text-[15px] font-semibold text-[#101010] border border-[#101010]/10 hover:border-[#1B29FF]/20 hover:text-[#1B29FF] hover:bg-[#F7F7F2]',
              )}
              disabled={
                !isDemoMode && (!canInitiateMove || isCheckingOwnership)
              }
              title={
                !isDemoMode && !canInitiateMove ? disableReason : undefined
              }
            >
              <ArrowRightCircle className="h-5 w-5" />
              {isTechnical ? '[ TRANSFER ]' : 'Transfer'}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0' : 'max-w-2xl'}`}
          >
            <SimplifiedOffRamp
              fundingSources={fundingSources}
              idleBalance={idleBalance}
              earningBalance={earningBalance}
              spendableBalance={spendableBalance}
              vaultPositions={vaultPositions}
            />
          </DialogContent>
        </Dialog>

        <AccountInfoDialog
          open={isAccountInfoOpen}
          onOpenChange={setIsAccountInfoOpen}
          isDemoMode={isDemoMode}
          safeAddress={safeAddress}
          trigger={
            <Button
              variant="outline"
              className={cn(
                'flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 transition-all duration-200',
                isTechnical
                  ? 'border border-[#1B29FF]/40 bg-white text-[#1B29FF] font-mono px-4 py-2.5 rounded-sm hover:border-[#1B29FF] hover:bg-[#1B29FF]/5 text-[13px]'
                  : 'px-5 py-3 text-[15px] font-semibold text-[#101010] border border-[#101010]/10 hover:border-[#1B29FF]/20 hover:text-[#1B29FF] hover:bg-[#F7F7F2]',
              )}
            >
              <Info
                className={cn(
                  'h-5 w-5',
                  isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
                )}
              />
              {isTechnical ? 'ACCOUNTS' : 'Account Info'}
            </Button>
          }
        />
      </div>

      <p
        className={cn(
          'relative z-10',
          isTechnical
            ? 'font-mono text-[11px] text-[#101010]/50'
            : 'text-[12px] text-[#101010]/60',
        )}
      >
        {isDemoMode
          ? 'Use these controls to explore how deposits and withdrawals work in Zero Finance.'
          : hasVirtualAccounts
            ? isTechnical
              ? 'Transfers settle to Safe contracts on respective chains.'
              : 'Transfers settle directly into your Zero treasury safe.'
            : 'Once your virtual account is approved, you can pull cash into savings here.'}
      </p>

      {/* Super OETH Redeem Modal - Technical Mode Only */}
      {isTechnical && baseSafe && (
        <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
          <DialogContent className="bg-white border-[#101010]/10 max-w-md p-0">
            <RedeemSuperOethModal
              safeAddress={baseSafe.address as Address}
              superOethBalance={superOethBalance}
              onSuccess={() => {
                setIsRedeemModalOpen(false);
                refetchSuperOeth();
              }}
              onClose={() => setIsRedeemModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
