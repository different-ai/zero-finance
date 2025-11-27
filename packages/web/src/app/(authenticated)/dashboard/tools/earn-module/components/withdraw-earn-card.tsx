'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Loader2,
  AlertCircle,
  ArrowUpFromLine,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';
import type { Address } from 'viem';
import { cn } from '@/lib/utils';
import {
  formatUnits,
  parseUnits,
  encodeFunctionData,
  parseAbi,
  createPublicClient,
  http,
} from 'viem';
import { base, arbitrum } from 'viem/chains';
import { useSafeRelay } from '@/hooks/use-safe-relay';
import { SUPPORTED_CHAINS } from '@/lib/constants/chains';
import { ALL_BASE_VAULTS } from '@/server/earn/base-vaults';
import { ALL_CROSS_CHAIN_VAULTS } from '@/server/earn/cross-chain-vaults';

interface WithdrawEarnCardProps {
  safeAddress: Address; // Base Safe address (used as fallback for Base chain)
  vaultAddress: Address;
  onWithdrawSuccess?: () => void;
  chainId?: number; // Target chain for the vault (default: Base)
  isTechnical?: boolean; // Bimodal interface toggle
}

interface VaultInfo {
  shares: bigint;
  assets: bigint;
  assetDecimals: number;
  shareDecimals: number;
  assetAddress: Address;
}

// ERC4626 Vault ABI for withdrawal
const VAULT_ABI = parseAbi([
  'function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assets)',
  'function convertToShares(uint256 assets) external view returns (uint256 shares)',
  'function decimals() external view returns (uint8)',
]);

export function WithdrawEarnCard({
  safeAddress,
  vaultAddress,
  onWithdrawSuccess,
  chainId = 8453, // Default to Base
  isTechnical = false,
}: WithdrawEarnCardProps) {
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [vaultInfo, setVaultInfo] = useState<VaultInfo | null>(null);

  // Look up vault config to determine asset symbol
  const vaultConfig = useMemo(() => {
    const allVaults = [...ALL_BASE_VAULTS, ...ALL_CROSS_CHAIN_VAULTS];
    return allVaults.find(
      (v) => v.address.toLowerCase() === vaultAddress.toLowerCase(),
    );
  }, [vaultAddress]);

  // Determine asset symbol for display - handle type differences
  const assetSymbol = useMemo(() => {
    if (vaultConfig && 'asset' in vaultConfig) {
      return (
        (vaultConfig as { asset?: { symbol?: string } }).asset?.symbol || 'USD'
      );
    }
    return 'USD';
  }, [vaultConfig]);

  const isNativeAsset = useMemo(() => {
    if (vaultConfig && 'asset' in vaultConfig) {
      return (
        (vaultConfig as { asset?: { isNative?: boolean } }).asset?.isNative ||
        false
      );
    }
    return false;
  }, [vaultConfig]);

  // Determine if this is a cross-chain withdrawal (vault on different chain than Base)
  const isCrossChain = chainId !== SUPPORTED_CHAINS.BASE;

  // Fetch user's multi-chain positions to get the correct Safe addresses
  // IMPORTANT: Always fetch - needed for Base chain too, not just cross-chain
  // The safeAddress prop may come from workspace-scoped query which can be wrong
  const { data: multiChainPositions, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery(undefined, {
      enabled: true, // Always fetch to get authoritative Safe addresses
      staleTime: 30000,
    });

  // Get the Safe address for the target chain from multiChainPositions
  // This is the authoritative source (user-scoped, not workspace-scoped)
  const baseSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === SUPPORTED_CHAINS.BASE,
  )?.address as Address | undefined;

  const targetSafeAddress = multiChainPositions?.safes.find(
    (s) => s.chainId === chainId,
  )?.address as Address | undefined;

  // Use the correct Safe address: prefer multiChainPositions, fallback to prop
  const effectiveSafeAddress = (
    isCrossChain
      ? targetSafeAddress || safeAddress
      : baseSafeAddress || safeAddress
  ) as Address;

  const { ready: isRelayReady, send: sendTxViaRelay } = useSafeRelay(
    effectiveSafeAddress,
    chainId,
  );

  // Select chain based on chainId
  const isArbitrum = chainId === 42161;
  const chain = isArbitrum ? arbitrum : base;
  const rpcUrl = isArbitrum
    ? process.env.NEXT_PUBLIC_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
    : process.env.NEXT_PUBLIC_BASE_RPC_URL;

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl),
  });

  // Reset state when vault changes
  useEffect(() => {
    console.log(
      '[WithdrawEarnCard] Vault address changed to:',
      vaultAddress,
      'chainId:',
      chainId,
    );
    setAmount('');
    setIsWithdrawing(false);
  }, [vaultAddress, chainId]);

  // Fetch vault info
  const {
    data: vaultData,
    isLoading: isLoadingVault,
    refetch: refetchVaultInfo,
  } = trpc.earn.getVaultInfo.useQuery(
    { vaultAddress, chainId },
    {
      enabled: !!vaultAddress,
      staleTime: 30000, // Consider data fresh for 30s
      refetchInterval: false, // Disable automatic refetching
    },
  );

  // Add mutation for recording withdrawal
  const recordWithdrawalMutation = trpc.earn.recordWithdrawal.useMutation();

  // Cache share decimals to avoid repeated RPC calls - use ref to avoid re-renders
  const cachedShareDecimalsRef = useRef<Record<string, number>>({});
  // Track if we're currently fetching to prevent duplicate calls
  const fetchingDecimalsRef = useRef<Set<string>>(new Set());

  // Update vault info when data changes
  useEffect(() => {
    if (!vaultData) return;

    const sharesBI = BigInt(vaultData.shares);
    const assetsBI = BigInt(vaultData.assets);

    // Check cache first to avoid repeated RPC calls
    const cachedDecimals = cachedShareDecimalsRef.current[vaultAddress];

    if (cachedDecimals !== undefined) {
      // Use cached value immediately
      setVaultInfo({
        shares: sharesBI,
        assets: assetsBI,
        assetDecimals: vaultData.decimals,
        shareDecimals: cachedDecimals,
        assetAddress: vaultData.assetAddress as Address,
      });
      return;
    }

    // Set default vault info immediately with fallback decimals
    setVaultInfo({
      shares: sharesBI,
      assets: assetsBI,
      assetDecimals: vaultData.decimals,
      shareDecimals: 18, // Default to 18 decimals
      assetAddress: vaultData.assetAddress as Address,
    });

    // Fetch decimals only if not already fetching
    if (!fetchingDecimalsRef.current.has(vaultAddress)) {
      fetchingDecimalsRef.current.add(vaultAddress);

      publicClient
        .readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'decimals',
        })
        .then((decimals) => {
          const decimalsNumber = Number(decimals);
          cachedShareDecimalsRef.current[vaultAddress] = decimalsNumber;
          fetchingDecimalsRef.current.delete(vaultAddress);

          // Update only if different from default
          if (decimalsNumber !== 18) {
            setVaultInfo((prev) =>
              prev
                ? {
                    ...prev,
                    shareDecimals: decimalsNumber,
                  }
                : null,
            );
          }
        })
        .catch((error) => {
          console.error('Failed to fetch share decimals:', error);
          cachedShareDecimalsRef.current[vaultAddress] = 18;
          fetchingDecimalsRef.current.delete(vaultAddress);
        });
    }
    // Only depend on vaultData and vaultAddress, not publicClient
  }, [vaultData, vaultAddress]);

  const handleWithdraw = async () => {
    if (!amount || !vaultInfo || !isRelayReady || !effectiveSafeAddress) return;

    try {
      setIsWithdrawing(true);
      const amountInSmallestUnit = parseUnits(amount, vaultInfo.assetDecimals);

      console.log('[WithdrawEarnCard] Starting withdrawal:', {
        chainId,
        isCrossChain,
        effectiveSafeAddress,
        targetSafeAddress,
        vaultAddress,
        amount: amountInSmallestUnit.toString(),
      });

      if (amountInSmallestUnit > vaultInfo.assets) {
        throw new Error('Amount exceeds available vault balance.');
      }

      const isMaxWithdrawal = amountInSmallestUnit >= vaultInfo.assets;

      // Convert the asset amount to shares using the vault's conversion function
      console.log('[WithdrawEarnCard] Converting assets to shares...', {
        assets: amountInSmallestUnit.toString(),
        vaultAddress,
      });

      let sharesToRedeem: bigint;

      if (isMaxWithdrawal) {
        sharesToRedeem = vaultInfo.shares;
      } else {
        sharesToRedeem = await publicClient.readContract({
          address: vaultAddress,
          abi: VAULT_ABI,
          functionName: 'convertToShares',
          args: [amountInSmallestUnit],
        });

        if (sharesToRedeem === 0n) {
          throw new Error(
            'Requested amount is below the minimum withdrawable size.',
          );
        }

        if (sharesToRedeem > vaultInfo.shares) {
          const roundingDelta = sharesToRedeem - vaultInfo.shares;
          // Allow for a one-wei rounding discrepancy, otherwise surface the error
          if (roundingDelta <= 1n) {
            sharesToRedeem = vaultInfo.shares;
          } else {
            throw new Error(
              `Insufficient shares. Required: ${formatUnits(sharesToRedeem, vaultInfo.shareDecimals)}, Available: ${formatUnits(vaultInfo.shares, vaultInfo.shareDecimals)}`,
            );
          }
        }
      }

      console.log(
        '[WithdrawEarnCard] Shares to redeem:',
        sharesToRedeem.toString(),
      );

      // Encode the redeem function call
      const redeemData = encodeFunctionData({
        abi: VAULT_ABI,
        functionName: 'redeem',
        args: [sharesToRedeem, effectiveSafeAddress, effectiveSafeAddress], // shares, receiver, owner
      });

      // Execute the withdrawal via Safe relay
      const transactions = [
        {
          to: vaultAddress,
          value: '0',
          data: redeemData,
          operation: 0,
        },
      ];

      console.log('[WithdrawEarnCard] Sending withdrawal tx via relay:', {
        safeAddress: effectiveSafeAddress,
        chainId,
        vaultAddress,
        transactions,
      });

      const userOpHash = await sendTxViaRelay(transactions, 1_200_000n); // Morpho/Gauntlet vaults need high gas for redeems

      console.log('[WithdrawEarnCard] Withdrawal tx hash:', userOpHash);

      if (userOpHash) {
        // Record the withdrawal in the database
        await recordWithdrawalMutation.mutateAsync({
          safeAddress: effectiveSafeAddress,
          vaultAddress: vaultAddress,
          tokenAddress: vaultInfo.assetAddress,
          assetsWithdrawn: amountInSmallestUnit.toString(),
          sharesBurned: sharesToRedeem.toString(),
          userOpHash: userOpHash,
        });

        toast.success('Withdrawal initiated', {
          description: `Withdrawing ${amount} ${assetSymbol}. Transaction ID: ${userOpHash.slice(0, 10)}...`,
        });

        // Reset form
        setAmount('');

        // Refetch vault info after a delay
        setTimeout(() => {
          refetchVaultInfo();
          if (onWithdrawSuccess) {
            onWithdrawSuccess();
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(
        `Withdrawal failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMax = () => {
    if (!vaultInfo) return;
    const maxAmount = formatUnits(vaultInfo.assets, vaultInfo.assetDecimals);
    setAmount(maxAmount);
  };

  // Loading state
  if (isLoadingVault || (isCrossChain && isLoadingPositions)) {
    return (
      <div className="space-y-4">
        <div className="h-20 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
        <div className="h-12 w-full bg-[#101010]/5 animate-pulse" />
      </div>
    );
  }

  // For cross-chain vaults, we need the target Safe to exist
  if (isCrossChain && !targetSafeAddress) {
    return (
      <div className="bg-[#FFF7ED] border border-[#F59E0B]/20 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#101010]/70">
            No account found on this chain. Please make a deposit first to
            create your account.
          </div>
        </div>
      </div>
    );
  }

  // No balance state
  if (!vaultInfo || vaultInfo.assets === 0n) {
    return (
      <div className="bg-[#F7F7F2] border border-[#101010]/10 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-4 w-4 text-[#101010]/40 flex-shrink-0 mt-0.5" />
          <div className="text-[12px] text-[#101010]/60">
            No funds available to withdraw from this vault.
          </div>
        </div>
      </div>
    );
  }

  const availableBalance = formatUnits(
    vaultInfo.assets,
    vaultInfo.assetDecimals,
  );
  const displayBalance = parseFloat(availableBalance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    },
  );

  const hasAmountInput = amount.trim().length > 0;
  let parsedAmount: bigint | null = null;
  let amountParseFailed = false;

  if (hasAmountInput && vaultInfo) {
    try {
      parsedAmount = parseUnits(amount, vaultInfo.assetDecimals);
    } catch {
      amountParseFailed = true;
    }
  }

  const amountIsPositive = parsedAmount !== null && parsedAmount > 0n;
  const amountExceedsBalance =
    parsedAmount !== null && parsedAmount > vaultInfo.assets;

  const disableWithdraw =
    !hasAmountInput ||
    amountParseFailed ||
    !amountIsPositive ||
    amountExceedsBalance ||
    isWithdrawing ||
    !isRelayReady ||
    !effectiveSafeAddress;

  return (
    <div
      className={cn(
        'space-y-4 relative',
        isTechnical && 'p-4 bg-[#F7F7F2] border border-[#1B29FF]/20',
      )}
    >
      {/* Blueprint grid overlay for technical mode */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1B29FF 1px, transparent 1px),
              linear-gradient(to bottom, #1B29FF 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Current Balance */}
      <div
        className={cn(
          'p-4 relative',
          isTechnical
            ? 'bg-white border border-[#1B29FF]/30'
            : 'bg-[#F7F7F2] border border-[#101010]/10',
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={cn(
                'uppercase tracking-[0.14em] text-[11px] mb-1',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/60',
              )}
            >
              {isTechnical ? 'BALANCE::REDEEMABLE' : 'Available to Withdraw'}
            </p>
            {isTechnical ? (
              <div>
                <p className="text-[24px] font-mono tabular-nums text-[#101010]">
                  {displayBalance} {isNativeAsset ? assetSymbol : 'USDC'}
                </p>
                {!isNativeAsset && (
                  <p className="text-[12px] font-mono text-[#101010]/50">
                    ≈ ${displayBalance} USD
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[24px] font-medium tabular-nums text-[#101010]">
                {isNativeAsset ? '' : '$'}
                {displayBalance} {isNativeAsset ? assetSymbol : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2 relative">
        <label
          htmlFor="withdraw-amount"
          className={cn(
            'text-[12px] font-medium',
            isTechnical
              ? 'font-mono text-[#1B29FF] uppercase'
              : 'text-[#101010]',
          )}
        >
          {isTechnical ? 'INPUT::AMOUNT' : 'Amount to Withdraw'}
        </label>
        <div className="relative">
          <input
            id="withdraw-amount"
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={cn(
              'w-full px-3 py-2 pr-20 text-[14px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              isTechnical
                ? 'font-mono bg-white border border-[#1B29FF]/30 text-[#101010] placeholder:text-[#101010]/30 focus:border-[#1B29FF] focus:outline-none'
                : 'bg-white border border-[#101010]/10 focus:border-[#1B29FF] focus:outline-none',
            )}
            step="0.000001"
            min="0"
            max={availableBalance}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span
              className={cn(
                'text-[11px]',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]/50',
              )}
            >
              {isNativeAsset ? assetSymbol : isTechnical ? 'USDC' : 'USD'}
            </span>
            <button
              type="button"
              onClick={handleMax}
              className={cn(
                'px-1.5 py-0.5 text-[10px] transition-colors',
                isTechnical
                  ? 'font-mono text-[#1B29FF] hover:text-[#1420CC] border border-[#1B29FF]/30 hover:border-[#1B29FF]'
                  : 'text-[#1B29FF] hover:text-[#1420CC]',
              )}
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={disableWithdraw}
        className={cn(
          'w-full px-4 py-2.5 text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 relative',
          isTechnical
            ? 'font-mono uppercase bg-white border-2 border-[#1B29FF] text-[#1B29FF] hover:bg-[#1B29FF] hover:text-white'
            : 'text-white bg-[#1B29FF] hover:bg-[#1420CC]',
        )}
      >
        {isWithdrawing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowUpFromLine className="h-4 w-4" />
        )}
        {isTechnical
          ? isWithdrawing
            ? 'PROCESSING...'
            : '[ EXECUTE ]'
          : isWithdrawing
            ? 'Processing...'
            : 'Withdraw'}
      </button>

      {/* Error states */}
      {amountParseFailed && (
        <div
          className={cn(
            'p-3 relative',
            isTechnical
              ? 'bg-[#EF4444]/5 border border-[#EF4444]/30'
              : 'bg-[#FEF2F2] border border-[#EF4444]/20',
          )}
        >
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <p
              className={cn(
                'text-[12px]',
                isTechnical ? 'font-mono text-[#EF4444]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical
                ? 'ERR: PARSE_FAILED'
                : 'Unable to parse the withdrawal amount. Please check the format.'}
            </p>
          </div>
        </div>
      )}

      {amountExceedsBalance && (
        <div
          className={cn(
            'p-3 relative',
            isTechnical
              ? 'bg-[#EF4444]/5 border border-[#EF4444]/30'
              : 'bg-[#FEF2F2] border border-[#EF4444]/20',
          )}
        >
          <div className="flex gap-2 items-start">
            <AlertCircle className="h-4 w-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
            <p
              className={cn(
                'text-[12px]',
                isTechnical ? 'font-mono text-[#EF4444]' : 'text-[#101010]/70',
              )}
            >
              {isTechnical
                ? 'ERR: AMOUNT > BALANCE'
                : 'Amount exceeds your available vault balance.'}
            </p>
          </div>
        </div>
      )}

      {/* Help text */}
      <p
        className={cn(
          'text-[11px] text-center relative',
          isTechnical ? 'font-mono text-[#1B29FF]/60' : 'text-[#101010]/50',
        )}
      >
        {isTechnical
          ? isNativeAsset
            ? 'OUTPUT: WETH (UNWRAP_REQUIRED)'
            : 'SETTLEMENT: IMMEDIATE'
          : isNativeAsset
            ? 'You will receive WETH which can be unwrapped to ETH'
            : 'Your funds will be available in your account immediately'}
      </p>
    </div>
  );
}
