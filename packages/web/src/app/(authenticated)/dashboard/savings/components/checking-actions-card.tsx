'use client';

import { useState } from 'react';
import {
  ArrowRightCircle,
  Info,
  ArrowLeftRight,
  Wallet,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { SimplifiedOffRamp } from '@/components/transfers/simplified-off-ramp';
import { AccountInfoDialog } from '@/components/virtual-accounts/account-info-dialog';
import { BridgeFundsModal } from './bridge-funds-modal';
import { RedeemSuperOethModal } from './redeem-super-oeth-modal';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrivy } from '@privy-io/react-auth';
import { useSafeOwnerCheck } from '@/hooks/use-safe-owner-check';
import { api } from '@/trpc/react';
import { formatUsd, cn } from '@/lib/utils';
import { demoFundingSources, demoUserData } from '../demo-data';
import {
  getChainDisplayName,
  SUPPORTED_CHAINS,
  type SupportedChainId,
} from '@/lib/constants/chains';
import { formatUnits } from 'viem';
import { USDC_DECIMALS } from '@/lib/constants';
import type { Address } from 'viem';
import Image from 'next/image';
import { BlueprintGrid, Crosshairs } from '@/components/ui/bimodal';

// Chain logo mapping - using long logos that include chain names
const CHAIN_LOGOS: Record<SupportedChainId, { src: string; hasName: boolean }> =
  {
    [SUPPORTED_CHAINS.BASE]: { src: '/logos/_base-logo.svg', hasName: true },
    [SUPPORTED_CHAINS.ARBITRUM]: {
      src: '/logos/_arbitrum-logo.png',
      hasName: true,
    },
    [SUPPORTED_CHAINS.MAINNET]: {
      src: '/logos/_ethereum-logo.svg',
      hasName: false,
    },
  };

// Asset icons as inline SVG components for better performance
const UsdcIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 32 32"
    fill="none"
    className="flex-shrink-0"
  >
    <circle cx="16" cy="16" r="16" fill="#2775CA" />
    <path
      d="M20.5 18.5c0-2-1.2-2.7-3.6-3-.6-.1-1.2-.2-1.8-.4-.9-.2-1.4-.6-1.4-1.3 0-.7.6-1.2 1.7-1.2.9 0 1.5.3 1.8.9.1.2.3.3.5.3h.7c.3 0 .5-.2.5-.5 0-.1 0-.1-.1-.2-.3-.8-1-1.4-2-1.6v-1c0-.3-.2-.5-.5-.5h-.6c-.3 0-.5.2-.5.5v1c-1.5.3-2.5 1.3-2.5 2.6 0 1.9 1.2 2.6 3.6 2.9.6.1 1.2.2 1.8.4.9.2 1.3.6 1.3 1.3 0 .8-.7 1.3-1.9 1.3-1 0-1.8-.4-2.1-1.1-.1-.2-.3-.3-.5-.3h-.7c-.3 0-.5.2-.5.5v.1c.3.9 1.2 1.6 2.4 1.8v1c0 .3.2.5.5.5h.6c.3 0 .5-.2.5-.5v-1c1.5-.3 2.7-1.3 2.7-2.7z"
      fill="white"
    />
  </svg>
);

const EthIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 32 32"
    fill="none"
    className="flex-shrink-0"
  >
    <circle cx="16" cy="16" r="16" fill="#627EEA" />
    <path d="M16 4v8.87l7.5 3.35L16 4z" fill="white" fillOpacity="0.6" />
    <path d="M16 4L8.5 16.22 16 12.87V4z" fill="white" />
    <path
      d="M16 21.97v6.03l7.5-10.39L16 21.97z"
      fill="white"
      fillOpacity="0.6"
    />
    <path d="M16 28V21.97l-7.5-4.36L16 28z" fill="white" />
    <path d="M16 20.57l7.5-4.35L16 12.87v7.7z" fill="white" fillOpacity="0.2" />
    <path
      d="M8.5 16.22l7.5 4.35v-7.7l-7.5 3.35z"
      fill="white"
      fillOpacity="0.6"
    />
  </svg>
);

// Super OETH icon - Origin Protocol yield-bearing ETH
const SuperOethIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 32 32"
    fill="none"
    className="flex-shrink-0"
  >
    <circle cx="16" cy="16" r="16" fill="#0074F0" />
    <circle cx="16" cy="16" r="10" fill="white" fillOpacity="0.2" />
    <path d="M16 8L10 16l6 8 6-8-6-8z" fill="white" />
    <path d="M16 8v16M10 16h12" stroke="#0074F0" strokeWidth="1.5" />
  </svg>
);

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
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { ready, authenticated, user } = usePrivy();
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

  // Total available balance (not in vaults)
  const totalAvailableBalance = baseTotalUsd + arbitrumTotalUsd;
  const hasAnyBalance = totalAvailableBalance > 0 || balanceUsd > 0;

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

  const toggleAccountExpansion = (accountId: string) => {
    setExpandedAccount(expandedAccount === accountId ? null : accountId);
  };

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
                BALANCE::AVAILABLE
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
                Available Balance
              </p>
              <p className="text-[32px] sm:text-[40px] font-semibold leading-[0.95] tabular-nums text-[#101010]">
                {formatUsd(displayBalance)}
              </p>
              <p className="mt-3 text-[13px] text-[#101010]/60">
                Ready to transfer or invest
              </p>
            </>
          )}
        </div>
      </div>

      {/* Account Balances Section - Only in Technical Mode */}
      {isTechnical && !isDemoMode && (baseSafe || arbitrumSafe) && (
        <div
          className={cn(
            'relative z-10 pt-4',
            isTechnical
              ? 'border-t border-[#1B29FF]/10'
              : 'border-t border-[#101010]/10',
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className={cn(
                'flex items-center gap-1.5',
                isTechnical
                  ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
                  : 'uppercase tracking-[0.12em] text-[10px] text-[#101010]/50',
              )}
            >
              <Wallet className="h-3 w-3" />
              {isTechnical ? 'ACCOUNTS::MULTI_CHAIN' : 'Accounts'}
            </p>
          </div>
          <div className="space-y-2">
            {/* Base Account */}
            {baseSafe && (
              <div className="rounded-lg border border-[#101010]/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccountExpansion('base')}
                  className="w-full flex items-center justify-between py-3 px-4 bg-[#F7F7F2] hover:bg-[#F7F7F2]/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={CHAIN_LOGOS[SUPPORTED_CHAINS.BASE].src}
                      alt="Base"
                      width={60}
                      height={15}
                      className="h-[15px] w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold tabular-nums text-[#101010]">
                      {formatUsd(baseTotalUsd)}
                    </span>
                    {expandedAccount === 'base' ? (
                      <ChevronDown className="h-4 w-4 text-[#101010]/40" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#101010]/40" />
                    )}
                  </div>
                </button>
                {/* Expanded asset breakdown */}
                {expandedAccount === 'base' && (
                  <div className="border-t border-[#101010]/10 bg-white p-3 space-y-2">
                    {/* USDC */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <UsdcIcon />
                        <span className="text-[12px] text-[#101010]/70">
                          USDC
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-medium tabular-nums text-[#101010]">
                          {baseUsdcBalance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                    {/* ETH */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <EthIcon />
                        <span className="text-[12px] text-[#101010]/70">
                          ETH
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-medium tabular-nums text-[#101010]">
                          {baseEthBalanceNum.toFixed(6)}
                        </span>
                        <span className="text-[11px] text-[#101010]/50 ml-1">
                          ({formatUsd(baseEthUsd)})
                        </span>
                      </div>
                    </div>
                    {/* Super OETH - Yield-bearing ETH - Always show in technical mode */}
                    <div className="flex items-center justify-between py-1.5 bg-[#0074F0]/5 -mx-3 px-3 rounded">
                      <div className="flex items-center gap-2">
                        <SuperOethIcon />
                        <span className="text-[12px] text-[#101010]/70">
                          superOETH
                        </span>
                        <span className="text-[9px] bg-[#0074F0]/10 text-[#0074F0] px-1.5 py-0.5 rounded font-medium">
                          YIELD
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className="text-[12px] font-medium tabular-nums text-[#101010]">
                            {superOethBalance.toFixed(6)}
                          </span>
                          <span className="text-[11px] text-[#101010]/50 ml-1">
                            ({formatUsd(superOethUsd)})
                          </span>
                        </div>
                        {superOethBalance > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsRedeemModalOpen(true);
                            }}
                            className="text-[10px] font-mono text-[#0074F0] hover:text-[#0074F0]/80 underline"
                          >
                            REDEEM
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Arbitrum Account */}
            {arbitrumSafe && (
              <div className="rounded-lg border border-[#101010]/10 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleAccountExpansion('arbitrum')}
                  className="w-full flex items-center justify-between py-3 px-4 bg-[#F7F7F2] hover:bg-[#F7F7F2]/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {CHAIN_LOGOS[SUPPORTED_CHAINS.ARBITRUM].hasName ? (
                      <Image
                        src={CHAIN_LOGOS[SUPPORTED_CHAINS.ARBITRUM].src}
                        alt="Arbitrum"
                        width={60}
                        height={15}
                        className="h-[15px] w-auto object-contain"
                      />
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded-full bg-[#28A0F0] flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">
                            A
                          </span>
                        </div>
                        <span className="text-[13px] font-medium text-[#101010]">
                          {getChainDisplayName(SUPPORTED_CHAINS.ARBITRUM)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold tabular-nums text-[#101010]">
                      {formatUsd(arbitrumTotalUsd)}
                    </span>
                    {expandedAccount === 'arbitrum' ? (
                      <ChevronDown className="h-4 w-4 text-[#101010]/40" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#101010]/40" />
                    )}
                  </div>
                </button>
                {/* Expanded asset breakdown */}
                {expandedAccount === 'arbitrum' && (
                  <div className="border-t border-[#101010]/10 bg-white p-3 space-y-2">
                    {/* USDC */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <UsdcIcon />
                        <span className="text-[12px] text-[#101010]/70">
                          USDC
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-medium tabular-nums text-[#101010]">
                          {arbitrumUsdcBalance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                    {/* ETH */}
                    <div className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <EthIcon />
                        <span className="text-[12px] text-[#101010]/70">
                          ETH
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-medium tabular-nums text-[#101010]">
                          {arbitrumEthBalanceNum.toFixed(6)}
                        </span>
                        <span className="text-[11px] text-[#101010]/50 ml-1">
                          ({formatUsd(arbitrumEthUsd)})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col sm:flex-row flex-wrap gap-3">
        <Dialog open={isMoveModalOpen} onOpenChange={setIsMoveModalOpen}>
          <DialogTrigger asChild>
            <Button
              className={cn(
                'flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 transition-all duration-200',
                isTechnical
                  ? 'border-2 border-[#1B29FF] bg-white text-[#1B29FF] font-mono px-4 py-2.5 rounded-sm hover:bg-[#1B29FF] hover:text-white text-[13px] font-medium'
                  : 'px-5 py-3 text-[15px] font-semibold text-white bg-[#1B29FF] hover:bg-[#1420CC]',
              )}
              disabled={
                !isDemoMode && (!canInitiateMove || isCheckingOwnership)
              }
              title={
                !isDemoMode && !canInitiateMove ? disableReason : undefined
              }
            >
              <ArrowRightCircle className="h-5 w-5" />
              {isTechnical ? '[ WITHDRAW ]' : 'Withdraw'}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`p-0 ${isMobile ? 'h-screen max-h-screen w-screen max-w-none m-0' : 'max-w-2xl'}`}
          >
            <SimplifiedOffRamp
              fundingSources={fundingSources}
              maxBalance={totalAvailableBalance}
            />
          </DialogContent>
        </Dialog>

        {/* Transfer Between Networks */}
        {!isDemoMode && baseSafe && arbitrumSafe && (
          <Dialog open={isBridgeModalOpen} onOpenChange={setIsBridgeModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 transition-all duration-200',
                  isTechnical
                    ? 'border border-[#1B29FF]/40 bg-white text-[#1B29FF] font-mono px-4 py-2.5 rounded-sm hover:border-[#1B29FF] hover:bg-[#1B29FF]/5 text-[13px]'
                    : 'px-5 py-3 text-[15px] font-semibold text-[#101010] border border-[#101010]/10 hover:border-[#1B29FF]/20 hover:text-[#1B29FF] hover:bg-[#F7F7F2]',
                )}
                disabled={!hasAnyBalance}
                title={
                  !hasAnyBalance
                    ? 'No balance available to transfer'
                    : undefined
                }
              >
                <ArrowLeftRight className="h-5 w-5" />
                {isTechnical ? 'BRIDGE' : 'Transfer'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border-[#101010]/10 max-w-md">
              <BridgeFundsModal
                safeAddress={baseSafe.address as Address}
                onSuccess={() => setIsBridgeModalOpen(false)}
                onClose={() => setIsBridgeModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}

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
