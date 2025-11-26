'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Plus,
  Copy,
  Check,
  ShieldCheck,
  Star,
  Calendar,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================
// Chart Component - Area chart with gradient
// ============================================
function AreaChart({
  data,
  color = '#1B29FF',
  height = 120,
  label,
  formatValue,
}: {
  data: Array<{ timestamp: number; value: number }>;
  color?: string;
  height?: number;
  label: string;
  formatValue: (v: number) => string;
}) {
  if (!data || data.length < 2) {
    return (
      <div
        className="bg-[#F7F7F2] rounded-lg flex items-center justify-center text-[12px] text-[#101010]/40"
        style={{ height }}
      >
        No data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 100;
  const padding = 2;

  // Generate path for the area
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y =
      height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y, value: d.value };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const currentValue = data[data.length - 1]?.value;
  const firstValue = data[0]?.value;
  const change = firstValue
    ? ((currentValue - firstValue) / firstValue) * 100
    : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold tabular-nums">
            {formatValue(currentValue)}
          </span>
          <span
            className={`text-[11px] tabular-nums ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}
          >
            {change >= 0 ? '+' : ''}
            {change.toFixed(1)}%
          </span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`gradient-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#gradient-${label})`} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Current value dot */}
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="4"
          fill={color}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="flex justify-between text-[10px] text-[#101010]/40">
        <span>30d ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

// ============================================
// Utility Functions
// ============================================
function formatApy(apy: number | undefined): string {
  if (apy === undefined || apy === null) return '-';
  return `${(apy * 100).toFixed(2)}%`;
}

function formatUsd(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 w-6 p-0"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3 text-[#101010]/40" />
      )}
    </Button>
  );
}

// ============================================
// Vault Detail Modal
// ============================================
function VaultDetailDialog({
  vault,
  open,
  onClose,
}: {
  vault: any;
  open: boolean;
  onClose: () => void;
}) {
  const { data: details, isLoading } =
    api.vaultAnalytics.getVaultDetails.useQuery(
      {
        address: vault?.address || '',
        chainId: vault?.chainId || 0,
        historicalDays: 30,
      },
      { enabled: open && !!vault },
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
          <DialogHeader>
            <div className="flex items-center gap-3 flex-wrap">
              <DialogTitle className="text-xl">{vault?.name}</DialogTitle>
              <Badge variant="outline" className="font-normal">
                {vault?.chainName}
              </Badge>
              {vault?.isInsured && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Insured
                </Badge>
              )}
              {vault?.isPrimary && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
                  <Star className="h-3 w-3" />
                  Primary
                </Badge>
              )}
            </div>
            <DialogDescription className="flex items-center gap-2 mt-1">
              <span>{vault?.curator}</span>
              <span className="text-[#101010]/30">•</span>
              <code className="text-[11px] bg-[#F7F7F2] px-1.5 py-0.5 rounded">
                {vault?.address?.slice(0, 6)}...{vault?.address?.slice(-4)}
              </code>
              <CopyButton text={vault?.address || ''} />
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
              <Skeleton className="h-40" />
            </div>
          ) : details ? (
            <>
              {/* Insurance Banner */}
              {details.isInsured && details.insuranceCoverage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-800">
                      Insured Vault
                    </p>
                    <p className="text-[13px] text-emerald-700">
                      $
                      {Number(
                        details.insuranceCoverage.amount,
                      ).toLocaleString()}{' '}
                      coverage via {details.insuranceCoverage.provider}
                    </p>
                  </div>
                </div>
              )}

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#F7F7F2] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider mb-2">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Current APY
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-[#1B29FF]">
                    {formatApy(details.metrics?.apy)}
                  </p>
                </div>
                <div className="bg-[#F7F7F2] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider mb-2">
                    <DollarSign className="h-3.5 w-3.5" />
                    Total Value Locked
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {formatUsd(details.metrics?.totalAssetsUsd)}
                  </p>
                </div>
                <div className="bg-[#F7F7F2] rounded-xl p-4">
                  <div className="text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider mb-2">
                    30d Average APY
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {formatApy(details.apyStats?.average)}
                  </p>
                </div>
                <div className="bg-[#F7F7F2] rounded-xl p-4">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    Vault Age
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {details.vaultAge?.formatted ||
                      vault?.vaultAge?.formatted ||
                      '-'}
                  </p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-xl p-5">
                  <AreaChart
                    data={details.historical?.apy || []}
                    color="#1B29FF"
                    height={140}
                    label="APY History (30d)"
                    formatValue={formatApy}
                  />
                </div>
                <div className="bg-white border rounded-xl p-5">
                  <AreaChart
                    data={details.historical?.totalAssetsUsd || []}
                    color="#10B981"
                    height={140}
                    label="TVL History (30d)"
                    formatValue={formatUsd}
                  />
                </div>
              </div>

              {/* APY Range */}
              <div className="bg-white border rounded-xl p-5">
                <div className="text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider mb-4">
                  30-Day APY Range
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-[#F7F7F2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-emerald-400 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[12px] tabular-nums">
                      <span className="text-red-600 font-medium">
                        Low: {formatApy(details.apyStats?.low)}
                      </span>
                      <span className="text-[#101010]/50">
                        Avg: {formatApy(details.apyStats?.average)}
                      </span>
                      <span className="text-emerald-600 font-medium">
                        High: {formatApy(details.apyStats?.high)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#F7F7F2] rounded-xl p-4 space-y-3">
                  <div className="text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider">
                    Vault Details
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Asset</span>
                      <span className="font-medium">
                        {details.metrics?.asset?.symbol || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Weekly APY</span>
                      <span className="font-medium tabular-nums">
                        {formatApy(details.metrics?.weeklyApy)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Monthly APY</span>
                      <span className="font-medium tabular-nums">
                        {formatApy(details.metrics?.monthlyApy)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-[#F7F7F2] rounded-xl p-4 space-y-3">
                  <div className="text-[11px] font-medium text-[#101010]/60 uppercase tracking-wider">
                    Share Price
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Current Price</span>
                      <span className="font-medium tabular-nums">
                        ${details.metrics?.sharePriceUsd?.toFixed(4) || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#101010]/60">Created</span>
                      <span className="font-medium">
                        {details.vaultAge?.createdAt
                          ? new Date(
                              details.vaultAge.createdAt,
                            ).toLocaleDateString()
                          : vault?.vaultAge?.createdAt
                            ? new Date(
                                vault.vaultAge.createdAt,
                              ).toLocaleDateString()
                            : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {details.metrics?.warnings &&
                details.metrics.warnings.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium text-[13px]">Warnings</span>
                    </div>
                    <ul className="list-disc list-inside text-[12px] text-amber-600 space-y-1">
                      {details.metrics.warnings.map((w: any, i: number) => (
                        <li key={i}>{w.type}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </>
          ) : (
            <div className="text-center py-12 text-[#101010]/50">
              Unable to load vault details
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(vault?.appUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Morpho
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Add Vault Dialog
// ============================================
function AddVaultDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState('');
  const parseVault = api.vaultAnalytics.parseAndFetchVault.useMutation({
    onSuccess: (data) => toast.success(`Found: ${data.metrics?.name}`),
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Vault by URL</DialogTitle>
          <DialogDescription>
            Paste a Morpho vault URL to fetch its data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="https://app.morpho.org/base/vault/0x..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() =>
                url.trim() && parseVault.mutate({ url: url.trim() })
              }
              disabled={parseVault.isPending || !url.trim()}
            >
              {parseVault.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Fetch'
              )}
            </Button>
          </div>

          {parseVault.data && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {parseVault.data.metrics?.name}
                  </CardTitle>
                  <Badge variant="outline">
                    {parseVault.data.parsed?.chainName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-[#F7F7F2] rounded-lg p-3">
                    <p className="text-[10px] uppercase text-[#101010]/50 mb-1">
                      APY
                    </p>
                    <p className="text-lg font-bold text-[#1B29FF]">
                      {formatApy(parseVault.data.metrics?.apy)}
                    </p>
                  </div>
                  <div className="bg-[#F7F7F2] rounded-lg p-3">
                    <p className="text-[10px] uppercase text-[#101010]/50 mb-1">
                      TVL
                    </p>
                    <p className="text-lg font-bold">
                      {formatUsd(parseVault.data.metrics?.totalAssetsUsd)}
                    </p>
                  </div>
                  <div className="bg-[#F7F7F2] rounded-lg p-3">
                    <p className="text-[10px] uppercase text-[#101010]/50 mb-1">
                      30d High
                    </p>
                    <p className="text-lg font-bold text-emerald-600">
                      {formatApy(parseVault.data.apyStats?.high)}
                    </p>
                  </div>
                  <div className="bg-[#F7F7F2] rounded-lg p-3">
                    <p className="text-[10px] uppercase text-[#101010]/50 mb-1">
                      30d Low
                    </p>
                    <p className="text-lg font-bold text-red-500">
                      {formatApy(parseVault.data.apyStats?.low)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Main Component
// ============================================
export default function VaultAnalyticsPanel() {
  const [selectedVault, setSelectedVault] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    data: vaultsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = api.vaultAnalytics.getTrackedVaults.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vault Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vault Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 font-medium">Failed to load vaults</p>
            <p className="text-[13px] text-[#101010]/60 mt-1">
              {error.message}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const vaults = vaultsData?.vaults || [];
  const vaultsByChain = vaults.reduce(
    (acc: Record<string, typeof vaults>, vault) => {
      const chain = vault.chainName;
      if (!acc[chain]) acc[chain] = [];
      acc[chain].push(vault);
      return acc;
    },
    {},
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vault Analytics</CardTitle>
              <CardDescription>
                Monitor Morpho vault performance
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(vaultsByChain).map(([chain, chainVaults]) => (
            <div key={chain}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold">{chain}</h3>
                <Badge variant="secondary" className="text-[10px]">
                  {chainVaults.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {chainVaults.map((vault) => (
                  <div
                    key={`${vault.chainId}-${vault.address}`}
                    onClick={() => setSelectedVault(vault)}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border cursor-pointer
                      transition-all hover:shadow-md hover:border-[#1B29FF]/20
                      ${vault.isInsured ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{vault.name}</span>
                          {vault.isInsured && (
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          )}
                          {vault.isPrimary && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <p className="text-[12px] text-[#101010]/50">
                          {vault.curator}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-lg font-bold tabular-nums text-[#1B29FF]">
                          {formatApy(vault.metrics?.apy)}
                        </p>
                        <p className="text-[11px] text-[#101010]/50">APY</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-lg font-bold tabular-nums">
                          {formatUsd(vault.metrics?.totalAssetsUsd)}
                        </p>
                        <p className="text-[11px] text-[#101010]/50">TVL</p>
                      </div>
                      <div className="hidden md:block w-16">
                        <p className="text-sm font-medium tabular-nums">
                          {vault.vaultAge?.formatted || '-'}
                        </p>
                        <p className="text-[11px] text-[#101010]/50">Age</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(vault.appUrl, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {vaults.length === 0 && (
            <div className="text-center py-8 text-[#101010]/50">
              No vaults configured
            </div>
          )}
        </CardContent>
      </Card>

      <VaultDetailDialog
        vault={selectedVault}
        open={!!selectedVault}
        onClose={() => setSelectedVault(null)}
      />

      <AddVaultDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </>
  );
}
