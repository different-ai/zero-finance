'use client';

import { useMemo } from 'react';
import { Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VaultRowDesktop, VaultRowMobile } from './vault-row';
import { CHAIN_CONFIG } from '@/lib/constants/chains';
import type {
  VaultViewModel,
  SelectedVaultState,
  ActiveVaultAction,
} from './types';

type VaultsSectionProps = {
  vaults: VaultViewModel[];
  safeAddress: string | null;
  isDemoMode: boolean;
  isTechnical: boolean;
  selectedVault: SelectedVaultState;
  expandingVault: string | null;
  collapsingVault: string | null;
  onToggleAction: (
    action: ActiveVaultAction,
    vault: { address: string; name: string },
  ) => void;
  onDepositSuccess: () => void;
  onWithdrawSuccess: () => void;
};

/**
 * Vaults Section Component
 *
 * Renders the complete vaults table/grid with header, rows, and footer.
 * Handles both desktop (table) and mobile (cards) views.
 *
 * Supports bimodal display:
 * - Banking mode: Clean table with soft colors and user-friendly language
 * - Technical mode: Blueprint-style with protocol headers and contract info
 */
export function VaultsSection({
  vaults,
  safeAddress,
  isDemoMode,
  isTechnical,
  selectedVault,
  expandingVault,
  collapsingVault,
  onToggleAction,
  onDepositSuccess,
  onWithdrawSuccess,
}: VaultsSectionProps) {
  return (
    <div id="vaults-section" className="relative">
      {/* Blueprint Grid Background (Technical only) */}
      {isTechnical && (
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-60"
        
        >
          {/* Architectural Crosshairs */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#1B29FF]/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#1B29FF]/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#1B29FF]/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#1B29FF]/30" />
        </div>
      )}

      {/* Section Header */}
      <div className="relative z-10 mb-8">
        <p
          className={cn(
            isTechnical
              ? 'font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase'
              : 'uppercase tracking-[0.18em] text-[11px] text-[#101010]/60',
          )}
        >
          {isTechnical ? 'VAULT::STRATEGIES' : 'Available Strategies'}
        </p>
      </div>

      {/* Technical Mode Headers */}
      {isTechnical && (
        <div className="relative z-10 px-4 py-2 grid grid-cols-12 gap-3 border-b border-[#1B29FF]/10 mb-2">
          <span className="col-span-4 font-mono text-[10px] text-[#1B29FF]/50">
            STRATEGY_ID
          </span>
          <span className="col-span-2 font-mono text-[10px] text-[#1B29FF]/50 text-right">
            APY_VAR
          </span>
          <span className="col-span-3 font-mono text-[10px] text-[#1B29FF]/50 text-right">
            POSITION
          </span>
          <span className="col-span-3 font-mono text-[10px] text-[#1B29FF]/50 text-right">
            EXECUTE
          </span>
        </div>
      )}

      {/* Vault Table Container */}
      <div
        className={cn(
          'relative z-10 overflow-x-auto transition-all duration-300',
          isTechnical
            ? 'bg-white border border-[#1B29FF]/20 rounded-sm shadow-none'
            : 'bg-white border border-[#101010]/10',
        )}
      >
        {/* Desktop Table View */}
        <div className="hidden lg:block min-w-[800px]">
          {/* Table Header - Hidden in technical mode (shown above) */}
          {!isTechnical && (
            <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
              <div className="col-span-4">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  Strategy
                </p>
              </div>
              <div className="col-span-2 text-right">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  APY
                </p>
              </div>
              <div className="col-span-3 text-right">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  Your Position
                </p>
              </div>
              <div className="col-span-3 text-right">
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                  Actions
                </p>
              </div>
            </div>
          )}

          {/* Vault Rows */}
          {vaults.map((vault, index) => {
            const normalizedAddress = vault.address.toLowerCase();
            const isSelected =
              selectedVault.vaultAddress?.toLowerCase() === normalizedAddress;
            const expandedAction = isSelected ? selectedVault.action : null;
            const isExpanding = expandingVault === normalizedAddress;
            const isCollapsing = collapsingVault === normalizedAddress;

            return (
              <VaultRowDesktop
                key={vault.id}
                vault={vault}
                safeAddress={safeAddress}
                isDemoMode={isDemoMode}
                isTechnical={isTechnical}
                isSelected={isSelected}
                expandedAction={expandedAction}
                isExpanding={isExpanding}
                isCollapsing={isCollapsing}
                onToggleAction={onToggleAction}
                onDepositSuccess={onDepositSuccess}
                onWithdrawSuccess={onWithdrawSuccess}
                isLastRow={index === vaults.length - 1}
              />
            );
          })}
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden">
          {vaults.map((vault, index) => {
            const normalizedAddress = vault.address.toLowerCase();
            const isSelected =
              selectedVault.vaultAddress?.toLowerCase() === normalizedAddress;
            const expandedAction = isSelected ? selectedVault.action : null;
            const isExpanding = expandingVault === normalizedAddress;
            const isCollapsing = collapsingVault === normalizedAddress;

            return (
              <VaultRowMobile
                key={vault.id}
                vault={vault}
                safeAddress={safeAddress}
                isDemoMode={isDemoMode}
                isTechnical={isTechnical}
                isSelected={isSelected}
                expandedAction={expandedAction}
                isExpanding={isExpanding}
                isCollapsing={isCollapsing}
                onToggleAction={onToggleAction}
                onDepositSuccess={onDepositSuccess}
                onWithdrawSuccess={onWithdrawSuccess}
                isLastRow={index === vaults.length - 1}
              />
            );
          })}
        </div>
      </div>

      {/* Footer Status */}
      <FooterStatus vaults={vaults} isTechnical={isTechnical} />
    </div>
  );
}

/**
 * Footer status showing active chains and contract info
 */
function FooterStatus({
  vaults,
  isTechnical,
}: {
  vaults: VaultViewModel[];
  isTechnical: boolean;
}) {
  // Get unique chains from vaults
  const activeChains = useMemo(() => {
    const chainIds = [...new Set(vaults.map((v) => v.chainId))];
    return chainIds.map((id) => CHAIN_CONFIG[id].name.toUpperCase());
  }, [vaults]);

  if (isTechnical) {
    return (
      <div className="mt-8 flex items-center justify-center">
        <div className="font-mono text-[11px] text-[#1B29FF]/60 text-center p-4 border border-dashed border-[#1B29FF]/20 bg-[#1B29FF]/5 rounded">
          SYS_STATUS: ONLINE | CHAINS: {activeChains.join(', ')} | CONTRACTS:
          ERC-4626
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-center">
      <p className="flex items-center gap-2 text-[13px] text-[#101010]/40">
        <Lock className="w-4 h-4" />
        Your funds are held securely with instant access
      </p>
    </div>
  );
}
