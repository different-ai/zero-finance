'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import {
  Copy,
  Check,
  ExternalLink,
  Wallet,
  Shield,
  Link2,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronRight,
  Users,
} from 'lucide-react';
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
      title="Copy to clipboard"
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
  workspaceName,
  workspaceId,
  isOwner,
  onRefreshBalance,
  isRefreshing,
}: {
  safe: {
    id: string;
    address: string;
    chainId: number;
    safeType?: string;
    createdAt?: Date | string;
  };
  position?: {
    usdcBalance: string;
    usdcBalanceRaw: string;
  };
  workspaceName?: string;
  workspaceId?: string;
  isOwner?: boolean;
  onRefreshBalance?: () => void;
  isRefreshing?: boolean;
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
              {isOwner !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em]',
                    isOwner
                      ? 'bg-blue-500/10 text-blue-700 rounded-full'
                      : 'bg-orange-500/10 text-orange-700 rounded-full',
                  )}
                >
                  {isOwner ? 'Owner' : 'Member'}
                </span>
              )}
            </div>
            {workspaceName && (
              <p
                className={cn(
                  'text-[12px] text-[#101010]/60 mt-0.5 flex items-center gap-1',
                  isTechnical && 'font-mono text-[10px]',
                )}
              >
                <Building2 className="h-3 w-3" />
                {workspaceName}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {onRefreshBalance && (
            <button
              onClick={onRefreshBalance}
              disabled={isRefreshing}
              className={cn(
                'p-2 rounded transition-colors',
                isTechnical
                  ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]/60'
                  : 'hover:bg-[#101010]/5 text-[#101010]/40',
                isRefreshing && 'animate-spin',
              )}
              title="Refresh balance"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          {explorerUrl && (
            <a
              href={`${explorerUrl}${safe.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'p-2 rounded transition-colors',
                isTechnical
                  ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]/60'
                  : 'hover:bg-[#101010]/5 text-[#101010]/40',
              )}
              title="View on explorer"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt
              className={cn(
                'uppercase tracking-[0.16em] text-[10px] mb-1',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/70'
                  : 'text-[#101010]/45',
              )}
            >
              {isTechnical ? 'RECORD_ID' : 'Database ID'}
            </dt>
            <dd
              className={cn(
                'text-[11px] font-mono truncate',
                isTechnical ? 'text-[#1B29FF]/80' : 'text-[#101010]/60',
              )}
              title={safe.id}
            >
              {safe.id.slice(0, 8)}...
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
                {isTechnical ? 'WORKSPACE_ID' : 'Workspace'}
              </dt>
              <dd
                className={cn(
                  'text-[11px] font-mono truncate flex items-center gap-1',
                  isTechnical ? 'text-[#1B29FF]/80' : 'text-[#101010]/60',
                )}
                title={workspaceId}
              >
                <Link2 className="h-3 w-3 flex-shrink-0" />
                {workspaceId.slice(0, 8)}...
              </dd>
            </div>
          )}
        </div>
      </dl>
    </BimodalCard>
  );
}

function WorkspaceSection({
  workspace,
  membership,
  safes,
  positionMap,
  isExpanded,
  onToggle,
}: {
  workspace: {
    id: string;
    name: string;
    companyName?: string | null;
  };
  membership: {
    role: string;
    isPrimary: boolean;
  };
  safes: Array<{
    id: string;
    safeAddress: string;
    chainId: number;
    safeType: string;
    isOwner: boolean;
    workspaceId: string | null;
  }>;
  positionMap: Map<string, { usdcBalance: string; usdcBalanceRaw: string }>;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { isTechnical } = useBimodal();

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-4 flex items-center justify-between transition-colors',
          isTechnical
            ? 'bg-[#1B29FF]/5 hover:bg-[#1B29FF]/10 border-b border-[#1B29FF]/20'
            : 'bg-[#101010]/5 hover:bg-[#101010]/10 border-b border-[#101010]/10',
        )}
      >
        <div className="flex items-center gap-3">
          <Building2
            className={cn(
              'h-5 w-5',
              isTechnical ? 'text-[#1B29FF]' : 'text-[#101010]/60',
            )}
          />
          <div className="text-left">
            <p
              className={cn(
                'text-[14px] font-semibold',
                isTechnical && 'font-mono text-[#1B29FF]',
              )}
            >
              {workspace.name}
            </p>
            <p
              className={cn(
                'text-[11px] flex items-center gap-2',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/60'
                  : 'text-[#101010]/50',
              )}
            >
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded text-[9px] uppercase',
                  membership.role === 'owner'
                    ? 'bg-blue-500/10 text-blue-700'
                    : 'bg-gray-500/10 text-gray-600',
                )}
              >
                {membership.role}
              </span>
              <span>
                {safes.length} Safe{safes.length !== 1 ? 's' : ''}
              </span>
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-[#101010]/40" />
        ) : (
          <ChevronRight className="h-5 w-5 text-[#101010]/40" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {safes.length === 0 ? (
            <p
              className={cn(
                'text-center py-4 text-[13px]',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/50'
                  : 'text-[#101010]/50',
              )}
            >
              No Safes in this workspace
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {safes.map((safe) => {
                const position = positionMap.get(
                  safe.safeAddress.toLowerCase(),
                );
                return (
                  <SafeCard
                    key={safe.id}
                    safe={{
                      id: safe.id,
                      address: safe.safeAddress,
                      chainId: safe.chainId,
                      safeType: safe.safeType,
                    }}
                    position={position}
                    workspaceId={safe.workspaceId || undefined}
                    isOwner={safe.isOwner}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SafeAdminContent() {
  const { isTechnical } = useBimodal();
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(
    new Set(),
  );

  // Get all accessible safes across all workspaces
  const {
    data: allAccessibleData,
    isLoading: isLoadingAllAccessible,
    refetch: refetchAllAccessible,
  } = trpc.settings.userSafes.listAllAccessible.useQuery();

  // Get multi-chain positions for current workspace (for balance data)
  const {
    data: positions,
    isLoading: isLoadingPositions,
    refetch: refetchPositions,
  } = trpc.earn.getMultiChainPositions.useQuery();

  // Get current workspace info
  const { data: currentWorkspace } =
    trpc.workspace.getOrCreateWorkspace.useQuery();
  const { data: workspace } = trpc.workspace.getWorkspace.useQuery(
    { workspaceId: currentWorkspace?.workspaceId || '' },
    { enabled: !!currentWorkspace?.workspaceId },
  );

  const isLoading = isLoadingAllAccessible || isLoadingPositions;

  // Create a map of safe address to position data
  const positionMap = new Map(
    positions?.positions?.map((p) => [p.safeAddress.toLowerCase(), p]) || [],
  );

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces((prev) => {
      const next = new Set(prev);
      if (next.has(workspaceId)) {
        next.delete(workspaceId);
      } else {
        next.add(workspaceId);
      }
      return next;
    });
  };

  const handleRefreshAll = () => {
    refetchAllAccessible();
    refetchPositions();
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <header className="flex items-start justify-between">
        <div>
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
              ? 'DEBUG::ALL_ACCESSIBLE_SAFES // CROSS_WORKSPACE'
              : 'View and manage all Safes you have access to across workspaces'}
          </p>
        </div>
        <button
          onClick={handleRefreshAll}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors',
            isTechnical
              ? 'bg-[#1B29FF]/10 text-[#1B29FF] hover:bg-[#1B29FF]/20 border border-[#1B29FF]/20'
              : 'bg-[#101010]/5 text-[#101010] hover:bg-[#101010]/10',
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      {/* Current Workspace Banner */}
      {workspace && (
        <BimodalCard isTechnical={isTechnical} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center',
                  isTechnical
                    ? 'bg-[#1B29FF]/10 border border-[#1B29FF]/20'
                    : 'bg-[#1B29FF]/10',
                )}
              >
                <Building2
                  className={cn(
                    'h-5 w-5',
                    isTechnical ? 'text-[#1B29FF]' : 'text-[#1B29FF]',
                  )}
                />
              </div>
              <div>
                <p
                  className={cn(
                    'text-[12px] uppercase tracking-[0.12em]',
                    isTechnical
                      ? 'font-mono text-[#1B29FF]/70'
                      : 'text-[#101010]/45',
                  )}
                >
                  {isTechnical ? 'CURRENT_WORKSPACE' : 'Current Workspace'}
                </p>
                <p
                  className={cn(
                    'text-[14px] font-medium',
                    isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
                  )}
                >
                  {workspace.name || 'Unnamed Workspace'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  'text-[11px] font-mono',
                  isTechnical ? 'text-[#1B29FF]/60' : 'text-[#101010]/40',
                )}
              >
                {workspace.id}
              </p>
            </div>
          </div>
        </BimodalCard>
      )}

      {/* Summary Stats */}
      {allAccessibleData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BimodalCard isTechnical={isTechnical} className="p-4">
            <dt
              className={cn(
                'uppercase tracking-[0.16em] text-[10px]',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/70'
                  : 'text-[#101010]/45',
              )}
            >
              {isTechnical ? 'TOTAL_WORKSPACES' : 'Workspaces'}
            </dt>
            <dd
              className={cn(
                'text-[24px] font-bold mt-1 flex items-center gap-2',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
              )}
            >
              <Users className="h-5 w-5 opacity-50" />
              {allAccessibleData.totalWorkspaces}
            </dd>
          </BimodalCard>

          <BimodalCard isTechnical={isTechnical} className="p-4">
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
                'text-[24px] font-bold mt-1 flex items-center gap-2',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
              )}
            >
              <Shield className="h-5 w-5 opacity-50" />
              {allAccessibleData.totalSafes}
            </dd>
          </BimodalCard>

          <BimodalCard isTechnical={isTechnical} className="p-4">
            <dt
              className={cn(
                'uppercase tracking-[0.16em] text-[10px]',
                isTechnical
                  ? 'font-mono text-[#1B29FF]/70'
                  : 'text-[#101010]/45',
              )}
            >
              {isTechnical ? 'CURRENT_WS_BALANCE' : 'Current Balance'}
            </dt>
            <dd
              className={cn(
                'text-[24px] font-bold mt-1',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
              )}
            >
              $
              {positions?.totalBalance
                ? parseFloat(positions.totalBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : '0.00'}
            </dd>
          </BimodalCard>

          <BimodalCard isTechnical={isTechnical} className="p-4">
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
                'text-[24px] font-bold mt-1',
                isTechnical ? 'font-mono text-[#1B29FF]' : 'text-[#101010]',
              )}
            >
              {
                new Set(allAccessibleData.safes?.map((s) => s.chainId) || [])
                  .size
              }
            </dd>
          </BimodalCard>
        </div>
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
          {/* All Workspaces with Safes */}
          {allAccessibleData?.workspaces &&
            allAccessibleData.workspaces.length > 0 && (
              <section>
                <h2
                  className={cn(
                    'text-[15px] font-semibold mb-4',
                    isTechnical && 'font-mono text-[#1B29FF] uppercase',
                  )}
                >
                  {isTechnical
                    ? 'ALL_WORKSPACES::SAFES'
                    : 'All Workspaces & Safes'}
                </h2>
                <div className="space-y-3">
                  {allAccessibleData.workspaces.map((ws) => (
                    <WorkspaceSection
                      key={ws.workspace.id}
                      workspace={ws.workspace}
                      membership={ws.membership}
                      safes={ws.safes}
                      positionMap={positionMap}
                      isExpanded={expandedWorkspaces.has(ws.workspace.id)}
                      onToggle={() => toggleWorkspace(ws.workspace.id)}
                    />
                  ))}
                </div>
              </section>
            )}

          {/* Current Workspace Positions */}
          {positions?.safes && positions.safes.length > 0 && (
            <section>
              <h2
                className={cn(
                  'text-[15px] font-semibold mb-4',
                  isTechnical && 'font-mono text-[#1B29FF] uppercase',
                )}
              >
                {isTechnical
                  ? 'CURRENT_WS::POSITIONS'
                  : 'Current Workspace Positions'}
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
                        safeType: safe.type,
                      }}
                      position={position}
                      workspaceName={workspace?.name || undefined}
                      workspaceId={workspace?.id}
                    />
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty State */}
          {(!allAccessibleData?.safes ||
            allAccessibleData.safes.length === 0) &&
            (!positions?.safes || positions.safes.length === 0) && (
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
                    ? 'NO_SAFES_FOUND::ALL_WORKSPACES'
                    : 'No Safes found across any of your workspaces'}
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
