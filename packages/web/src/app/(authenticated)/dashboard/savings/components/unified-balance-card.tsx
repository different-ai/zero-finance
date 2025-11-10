'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { cn, formatUsd } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Unified Balance Card - Progressive Disclosure
 *
 * Level a) Grand total (collapsed by default)
 * Level b) Total liquid + Total savings (click to expand)
 * Level c) Per-chain breakdown (click each chain to see details)
 */
export function UnifiedBalanceCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedChains, setExpandedChains] = useState<Set<number>>(new Set());

  const { data: unifiedBalance, isLoading } =
    trpc.earn.getUnifiedBalance.useQuery(undefined, {
      refetchInterval: 10000, // Refresh every 10s
    });

  if (isLoading || !unifiedBalance) {
    return (
      <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-[#101010]/5 rounded w-1/4"></div>
          <div className="h-8 bg-[#101010]/5 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const toggleChain = (chainId: number) => {
    const newExpanded = new Set(expandedChains);
    if (newExpanded.has(chainId)) {
      newExpanded.delete(chainId);
    } else {
      newExpanded.add(chainId);
    }
    setExpandedChains(newExpanded);
  };

  return (
    <div className="bg-white border border-[#101010]/10 rounded-[12px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
      {/* Level a) Grand Total */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
            Total Balance
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-[#101010]/40" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-[13px]">
                  Combined value across all chains and positions
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-[32px] sm:text-[36px] font-semibold tracking-[-0.01em] tabular-nums text-[#101010]">
            {formatUsd(unifiedBalance.grandTotal.usdValue)}
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
          >
            <span>{isExpanded ? 'Hide' : 'View'} breakdown</span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Level b) Liquid vs Savings */}
      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Liquid Balance */}
            <div className="space-y-1">
              <div className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                Available
              </div>
              <div className="text-[20px] font-medium tabular-nums text-[#101010]">
                {formatUsd(unifiedBalance.totalLiquid.usdValue)}
              </div>
              <div className="text-[12px] text-[#101010]/60">
                Liquid in checking
              </div>
            </div>

            {/* Savings Balance */}
            <div className="space-y-1">
              <div className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                Savings
              </div>
              <div className="text-[20px] font-medium tabular-nums text-[#10b981]">
                {formatUsd(unifiedBalance.totalSavings.usdValue)}
              </div>
              <div className="text-[12px] text-[#101010]/60">
                Earning yield
              </div>
            </div>
          </div>

          {/* Level c) Per-Chain Breakdown */}
          <div className="pt-4 border-t border-[#101010]/10">
            <div className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-3">
              By Chain
            </div>

            <div className="space-y-2">
              {unifiedBalance.chains.map((chain) => (
                <div
                  key={chain.chainId}
                  className="border border-[#101010]/10 rounded-md overflow-hidden"
                >
                  {/* Chain Header */}
                  <button
                    onClick={() => toggleChain(chain.chainId)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#101010]/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full',
                          chain.chainId === 8453 && 'bg-[#0050ff]',
                          chain.chainId === 42161 && 'bg-[#1B29FF]',
                        )}
                      />
                      <div className="text-left">
                        <div className="text-[14px] font-medium text-[#101010]">
                          {chain.chainName}
                        </div>
                        <div className="text-[12px] text-[#101010]/60 font-mono">
                          {chain.safeAddress.slice(0, 6)}...
                          {chain.safeAddress.slice(-4)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-[15px] font-medium tabular-nums text-[#101010]">
                        {formatUsd(chain.totalBalance.usdValue)}
                      </div>
                      {expandedChains.has(chain.chainId) ? (
                        <ChevronDown className="w-4 h-4 text-[#101010]/40" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#101010]/40" />
                      )}
                    </div>
                  </button>

                  {/* Chain Details (Expanded) */}
                  {expandedChains.has(chain.chainId) && (
                    <div className="px-3 pb-3 space-y-2 bg-[#101010]/5">
                      {/* Liquid Balance */}
                      {chain.liquidBalance.usdValue > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-[13px] text-[#101010]/70">
                            Liquid USDC
                          </span>
                          <span className="text-[13px] font-medium tabular-nums text-[#101010]">
                            {formatUsd(chain.liquidBalance.usdValue)}
                          </span>
                        </div>
                      )}

                      {/* Vault Positions */}
                      {chain.vaultBalances.map((vault) => (
                        <div
                          key={vault.vaultAddress}
                          className="flex justify-between items-center py-2 border-t border-[#101010]/10"
                        >
                          <div className="space-y-0.5">
                            <div className="text-[13px] text-[#101010]/70">
                              {vault.vaultName}
                            </div>
                            <div className="text-[11px] text-[#101010]/50 font-mono">
                              {vault.vaultAddress.slice(0, 6)}...
                              {vault.vaultAddress.slice(-4)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[13px] font-medium tabular-nums text-[#10b981]">
                              {formatUsd(vault.usdValue)}
                            </div>
                            <div className="text-[11px] text-[#101010]/50">
                              {parseFloat(vault.formatted).toFixed(2)} USDC
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Empty State */}
                      {chain.liquidBalance.usdValue === 0 &&
                        chain.vaultBalances.length === 0 && (
                          <div className="text-center py-4 text-[13px] text-[#101010]/50">
                            No funds on this chain
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
