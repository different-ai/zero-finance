'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Copy, Check, ExternalLink, Wallet, Shield, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BimodalCard,
  useBimodal,
  BimodalProvider,
} from '@/components/ui/bimodal';

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
};

const CHAIN_EXPLORERS: Record<number, string> = {
  1: 'https://etherscan.io/address/',
  8453: 'https://basescan.org/address/',
  42161: 'https://arbiscan.io/address/',
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const { isTechnical } = useBimodal();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-1 rounded transition-colors',
        isTechnical ? 'hover:bg-[#1B29FF]/10' : 'hover:bg-[#101010]/5',
      )}
    >
      {copied ? (
        <Check
          className={cn(
            'h-3 w-3',
            isTechnical ? 'text-[#1B29FF]' : 'text-green-600',
          )}
        />
      ) : (
        <Copy
          className={cn(
            'h-3 w-3',
            isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
          )}
        />
      )}
    </button>
  );
}

function SafeCard({
  safe,
  position,
  workspaceId,
}: {
  safe: {
    id: string;
    address: string;
    chainId: number;
    safeType?: string;
  };
  position?: {
    usdcBalance: string;
    usdcBalanceRaw: string;
  };
  workspaceId?: string;
}) {
  const { isTechnical } = useBimodal();
  const chainName = CHAIN_NAMES[safe.chainId] || `Chain ${safe.chainId}`;
  const explorerUrl = CHAIN_EXPLORERS[safe.chainId] || '';
  const isPrimary = safe.safeType === 'primary';

  return (
    <BimodalCard isTechnical={isTechnical} className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center',
              isTechnical
                ? 'rounded-sm bg-[#1B29FF]/5 border border-[#1B29FF]/20 text-[#1B29FF]'
                : 'rounded-full bg-white border border-[#101010]/10 text-[#1B29FF]',
            )}
          >
            {isPrimary ? (
              <Shield className="h-5 w-5" />
            ) : (
              <Wallet className="h-5 w-5" />
            )}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p
                className={cn(
                  'text-[15px] font-semibold tracking-[-0.01em]',
                  isTechnical && 'font-mono text-[#1B29FF] uppercase',
                )}
              >
                {isTechnical
                  ? `SAFE::${safe.safeType?.toUpperCase() || 'UNKNOWN'}`
                  : safe.safeType || 'Safe'}
              </p>
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
                  isTechnical
                    ? 'bg-[#1B29FF]/10 text-[#1B29FF] font-mono rounded-sm border border-[#1B29FF]/20'
                    : isPrimary
                      ? 'bg-green-500/10 text-green-700 rounded-full'
                      : 'bg-gray-500/10 text-gray-700 rounded-full',
                )}
              >
                {chainName}
              </span>
            </div>
            <p
              className={cn(
                'text-[12px] text-[#101010]/60 mt-0.5',
                isTechnical && 'font-mono text-[10px]',
              )}
            >
              {isTechnical
                ? `CHAIN_ID::${safe.chainId}`
                : `Chain ID: ${safe.chainId}`}
            </p>
          </div>
        </div>
      </div>

      <dl className="space-y-3 text-[13px]">
        <div>
          <dt
            className={cn(
              'uppercase tracking-[0.16em] text-[10px] mb-1',
              isTechnical ? 'font-mono text-[#1B29FF]/70' : 'text-[#101010]/45',
            )}
          >
            {isTechnical ? 'ADDRESS' : 'Safe Address'}
          </dt>
          <dd
            className={cn(
              'text-[13px] font-mono break-all flex items-center gap-2',
              isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]',
            )}
          >
            <span className="flex-1">{safe.address}</span>
            <CopyButton value={safe.address} />
            {explorerUrl && (
              <a
                href={`${explorerUrl}${safe.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'p-1 rounded transition-colors',
                  isTechnical
                    ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]/60'
                    : 'hover:bg-[#101010]/5 text-[#101010]/40',
                )}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </dd>
        </div>

        {position && (
          <div>
            <dt
              className={cn(
                'uppercase tracking-[0.16em] text-[10px] mb-1',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/70'
                  : 'text-[#101010]/45',
              )}
            >
              {isTechnical ? 'BALANCE::USDC' : 'USDC Balance'}
            </dt>
            <dd
              className={cn(
                'text-[15px] font-semibold',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
              )}
            >
              $
              {parseFloat(position.usdcBalance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              {isTechnical && (
                <span className="text-[10px] ml-2 text-[#1B29FF]/60">
                  RAW::{position.usdcBalanceRaw}
                </span>
              )}
            </dd>
          </div>
        )}

        <div>
          <dt
            className={cn(
              'uppercase tracking-[0.16em] text-[10px] mb-1',
              isTechnical ? 'font-mono text-[#1B29FF]/70' : 'text-[#101010]/45',
            )}
          >
            {isTechnical ? 'RECORD_ID' : 'Database ID'}
          </dt>
          <dd
            className={cn(
              'text-[12px] font-mono',
              isTechnical ? 'text-[#1B29FF]/80' : 'text-[#101010]/60',
            )}
          >
            {safe.id}
          </dd>
        </div>

        {workspaceId && (
          <div>
            <dt
              className={cn(
                'uppercase tracking-[0.16em] text-[10px] mb-1',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/70'
                  : 'text-[#101010]/45',
              )}
            >
              {isTechnical ? 'WORKSPACE_ID' : 'Workspace ID'}
            </dt>
            <dd
              className={cn(
                'text-[12px] font-mono flex items-center gap-2',
                isTechnical ? 'text-[#1B29FF]/80' : 'text-[#101010]/60',
              )}
            >
              <Link2 className="h-3 w-3" />
              {workspaceId}
            </dd>
          </div>
        )}
      </dl>
    </BimodalCard>
  );
}

function SafeAdminContent() {
  const { isTechnical } = useBimodal();

  // Get multi-chain positions (workspace-scoped)
  const { data: positions, isLoading: isLoadingPositions } =
    trpc.earn.getMultiChainPositions.useQuery();

  // Get all safes from settings (workspace-scoped)
  const { data: settingsSafes, isLoading: isLoadingSafes } =
    trpc.settings.userSafes.list.useQuery();

  // Get current workspace info
  const { data: currentWorkspace } =
    trpc.workspace.getOrCreateWorkspace.useQuery();
  const { data: workspace } = trpc.workspace.getWorkspace.useQuery(
    { workspaceId: currentWorkspace?.workspaceId || '' },
    { enabled: !!currentWorkspace?.workspaceId },
  );

  const isLoading = isLoadingPositions || isLoadingSafes;

  // Create a map of safe address to position data
  const positionMap = new Map(
    positions?.positions?.map((p) => [p.safeAddress.toLowerCase(), p]) || [],
  );

  return (
    <div className="space-y-6 p-4 md:p-8">
      <header>
        <h1
          className={cn(
            'text-2xl font-bold tracking-[-0.02em]',
            isTechnical && 'font-mono text-[#1B29FF] uppercase',
          )}
        >
          {isTechnical ? 'SAFE::ADMIN_TOOLS' : 'Safe Admin Tools'}
        </h1>
        <p
          className={cn(
            'text-[14px] mt-1',
            isTechnical ? 'font-mono text-[#1B29FF]/60' : 'text-[#101010]/60',
          )}
        >
          {isTechnical
            ? 'DEBUG::WORKSPACE_SCOPED_SAFES // CHAIN_DATA::LIVE'
            : 'View all Safes linked to your current workspace across all chains'}
        </p>
      </header>

      {workspace && (
        <BimodalCard isTechnical={isTechnical} className="p-4">
          <div className="flex items-center gap-2">
            <Link2
              className={cn(
                'h-4 w-4',
                isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
              )}
            />
            <span
              className={cn(
                'text-[12px] uppercase tracking-[0.12em]',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/70'
                  : 'text-[#101010]/45',
              )}
            >
              {isTechnical ? 'CURRENT_WORKSPACE' : 'Current Workspace'}
            </span>
          </div>
          <p
            className={cn(
              'mt-2 text-[14px] font-medium',
              isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
            )}
          >
            {workspace.name || 'Unnamed Workspace'}
          </p>
          <p
            className={cn(
              'text-[11px] font-mono mt-1',
              isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
            )}
          >
            ID: {workspace.id}
          </p>
        </BimodalCard>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'h-48 animate-pulse rounded-lg',
                isTechnical ? 'bg-[#1B29FF]/5' : 'bg-[#101010]/5',
              )}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Safes from getMultiChainPositions */}
          {positions?.safes && positions.safes.length > 0 && (
            <section>
              <h2
                className={cn(
                  'text-[15px] font-semibold mb-4',
                  isTechnical && 'font-mono text-[#1B29FF] uppercase',
                )}
              >
                {isTechnical
                  ? 'SOURCE::GET_MULTI_CHAIN_POSITIONS'
                  : 'Multi-Chain Positions'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {positions.safes.map((safe) => {
                  const position = positions.positions?.find(
                    (p) =>
                      p.safeAddress.toLowerCase() ===
                      safe.address.toLowerCase(),
                  );
                  return (
                    <SafeCard
                      key={`pos-${safe.id}`}
                      safe={{
                        id: safe.id,
                        address: safe.address,
                        chainId: safe.chainId,
                        safeType: 'primary',
                      }}
                      position={position}
                      workspaceId={workspace?.id}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Safes from settings.userSafes.list */}
          {settingsSafes && settingsSafes.length > 0 && (
            <section>
              <h2
                className={cn(
                  'text-[15px] font-semibold mb-4',
                  isTechnical && 'font-mono text-[#1B29FF] uppercase',
                )}
              >
                {isTechnical
                  ? 'SOURCE::SETTINGS_USER_SAFES_LIST'
                  : 'Settings Safes List'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {settingsSafes.map((safe) => {
                  const position = positionMap.get(
                    safe.safeAddress.toLowerCase(),
                  );
                  return (
                    <SafeCard
                      key={`settings-${safe.id}`}
                      safe={{
                        id: safe.id,
                        address: safe.safeAddress,
                        chainId: safe.chainId,
                        safeType: safe.safeType,
                      }}
                      position={
                        position
                          ? {
                              usdcBalance: position.usdcBalance,
                              usdcBalanceRaw: position.usdcBalanceRaw,
                            }
                          : undefined
                      }
                      workspaceId={safe.workspaceId || undefined}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Summary Stats */}
          {positions && (
            <BimodalCard isTechnical={isTechnical} className="p-5">
              <h3
                className={cn(
                  'text-[14px] font-semibold mb-3',
                  isTechnical && 'font-mono text-[#1B29FF] uppercase',
                )}
              >
                {isTechnical ? 'STATS::SUMMARY' : 'Summary'}
              </h3>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <dt
                    className={cn(
                      'uppercase tracking-[0.16em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/45',
                    )}
                  >
                    {isTechnical ? 'TOTAL_SAFES' : 'Total Safes'}
                  </dt>
                  <dd
                    className={cn(
                      'text-[20px] font-bold mt-1',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]',
                    )}
                  >
                    {positions.safes?.length || 0}
                  </dd>
                </div>
                <div>
                  <dt
                    className={cn(
                      'uppercase tracking-[0.16em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/45',
                    )}
                  >
                    {isTechnical ? 'TOTAL_USDC' : 'Total USDC'}
                  </dt>
                  <dd
                    className={cn(
                      'text-[20px] font-bold mt-1',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]',
                    )}
                  >
                    $
                    {positions.totalBalance
                      ? parseFloat(positions.totalBalance).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )
                      : '0.00'}
                  </dd>
                </div>
                <div>
                  <dt
                    className={cn(
                      'uppercase tracking-[0.16em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/45',
                    )}
                  >
                    {isTechnical ? 'CHAINS_ACTIVE' : 'Active Chains'}
                  </dt>
                  <dd
                    className={cn(
                      'text-[20px] font-bold mt-1',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-[#101010]',
                    )}
                  >
                    {new Set(positions.safes?.map((s) => s.chainId) || []).size}
                  </dd>
                </div>
                <div>
                  <dt
                    className={cn(
                      'uppercase tracking-[0.16em] text-[10px]',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]/70'
                        : 'text-[#101010]/45',
                    )}
                  >
                    {isTechnical ? 'WORKSPACE_BOUND' : 'Workspace Bound'}
                  </dt>
                  <dd
                    className={cn(
                      'text-[20px] font-bold mt-1',
                      isTechnical
                        ? 'font-mono text-[#1B29FF]'
                        : 'text-green-600',
                    )}
                  >
                    {isTechnical ? 'TRUE' : 'Yes'}
                  </dd>
                </div>
              </dl>
            </BimodalCard>
          )}

          {(!positions?.safes || positions.safes.length === 0) &&
            (!settingsSafes || settingsSafes.length === 0) && (
              <BimodalCard
                isTechnical={isTechnical}
                className="p-8 text-center"
              >
                <Wallet
                  className={cn(
                    'h-12 w-12 mx-auto mb-4',
                    isTechnical ? 'text-[#1B29FF]/40' : 'text-[#101010]/20',
                  )}
                />
                <p
                  className={cn(
                    'text-[14px]',
                    isTechnical
                      ? 'font-mono text-[#1B29FF]/60'
                      : 'text-[#101010]/60',
                  )}
                >
                  {isTechnical
                    ? 'NO_SAFES_FOUND::WORKSPACE_SCOPE'
                    : 'No Safes found for this workspace'}
                </p>
              </BimodalCard>
            )}
        </>
      )}
    </div>
  );
}

export default function SafeAdminPage() {
  return (
    <BimodalProvider>
      <SafeAdminContent />
    </BimodalProvider>
  );
}
