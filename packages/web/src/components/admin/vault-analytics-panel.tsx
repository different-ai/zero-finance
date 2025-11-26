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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  RefreshCw,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Copy,
  Check,
  Shield,
  ShieldCheck,
  Star,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

// Simple sparkline component using SVG
function Sparkline({
  data,
  color = '#1B29FF',
  height = 40,
  width = 120,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  if (!data || data.length < 2) {
    return (
      <div
        className="bg-[#101010]/5 rounded flex items-center justify-center text-[10px] text-[#101010]/40"
        style={{ width, height }}
      >
        No data
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={
            height - ((data[data.length - 1] - min) / range) * (height - 8) - 4
          }
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
}

// Format APY as percentage
function formatApy(apy: number | undefined): string {
  if (apy === undefined || apy === null) return '-';
  // APY comes as decimal (0.08 = 8%)
  return `${(apy * 100).toFixed(2)}%`;
}

// Format USD value
function formatUsd(value: number | undefined): string {
  if (value === undefined || value === null) return '-';
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
}

// Copy button component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
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
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3 text-[#101010]/50" />
      )}
    </Button>
  );
}

// Risk badge component
function RiskBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    Conservative: 'bg-green-100 text-green-700 border-green-200',
    Balanced: 'bg-blue-100 text-blue-700 border-blue-200',
    Optimized: 'bg-purple-100 text-purple-700 border-purple-200',
    'Market Risk': 'bg-orange-100 text-orange-700 border-orange-200',
    High: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <Badge variant="outline" className={colors[risk] || 'bg-gray-100'}>
      {risk}
    </Badge>
  );
}

// Insurance badge component
function InsuranceBadge({
  isInsured,
  coverage,
}: {
  isInsured: boolean;
  coverage?: { provider: string; amount: string; currency: string };
}) {
  if (!isInsured) return null;

  return (
    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 gap-1">
      <ShieldCheck className="h-3 w-3" />
      INSURED
    </Badge>
  );
}

// Primary vault indicator
function PrimaryBadge({ isPrimary }: { isPrimary?: boolean }) {
  if (!isPrimary) return null;

  return (
    <Badge
      variant="outline"
      className="bg-yellow-50 text-yellow-700 border-yellow-300 gap-1"
    >
      <Star className="h-3 w-3 fill-current" />
      Primary
    </Badge>
  );
}

// Vault detail dialog
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
      {
        enabled: open && !!vault,
      },
    );

  const historicalApyData = details?.historical?.apy?.map((p) => p.value) || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            {vault?.name || 'Vault Details'}
            <Badge variant="outline">{vault?.chainName}</Badge>
            {(vault?.isInsured || details?.isInsured) && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 gap-1">
                <ShieldCheck className="h-3 w-3" />
                INSURED
              </Badge>
            )}
            {vault?.isPrimary && (
              <Badge
                variant="outline"
                className="bg-yellow-50 text-yellow-700 border-yellow-300 gap-1"
              >
                <Star className="h-3 w-3 fill-current" />
                Primary
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Detailed metrics and historical data
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : details ? (
          <div className="space-y-6">
            {/* Insurance Info Banner */}
            {details.isInsured && details.insuranceCoverage && (
              <Card className="p-4 bg-emerald-50 border-emerald-200">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-800">
                      Insured Vault
                    </p>
                    <p className="text-[13px] text-emerald-700">
                      Coverage: $
                      {Number(
                        details.insuranceCoverage.amount,
                      ).toLocaleString()}{' '}
                      {details.insuranceCoverage.currency} via{' '}
                      {details.insuranceCoverage.provider}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-1">
                  Current APY
                </p>
                <p className="text-[24px] font-semibold tabular-nums text-[#1B29FF]">
                  {formatApy(details.metrics?.apy)}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-1">
                  TVL
                </p>
                <p className="text-[24px] font-semibold tabular-nums">
                  {formatUsd(details.metrics?.totalAssetsUsd)}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-1">
                  30d Avg APY
                </p>
                <p className="text-[24px] font-semibold tabular-nums">
                  {formatApy(details.apyStats?.average)}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-1">
                  30d Range
                </p>
                <p className="text-[16px] font-semibold tabular-nums">
                  {formatApy(details.apyStats?.low)} -{' '}
                  {formatApy(details.apyStats?.high)}
                </p>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* APY History Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[14px]">
                    APY History (30 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {historicalApyData.length > 0 ? (
                    <div className="h-[120px] flex items-center justify-center">
                      <Sparkline
                        data={historicalApyData}
                        width={280}
                        height={110}
                        color="#1B29FF"
                      />
                    </div>
                  ) : (
                    <div className="h-[120px] flex items-center justify-center text-[#101010]/40">
                      No historical data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* TVL History Chart (shows deposit/withdrawal trends) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-[14px]">
                    TVL / Deposits History (30 days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {details?.historical?.totalAssetsUsd &&
                  details.historical.totalAssetsUsd.length > 0 ? (
                    <div className="h-[120px] flex items-center justify-center">
                      <Sparkline
                        data={details.historical.totalAssetsUsd.map(
                          (p) => p.value,
                        )}
                        width={280}
                        height={110}
                        color="#10B981"
                      />
                    </div>
                  ) : (
                    <div className="h-[120px] flex items-center justify-center text-[#101010]/40">
                      No TVL history available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Vault Info */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[14px]">Vault Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-[13px]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[#101010]/60">Address</p>
                    <div className="flex items-center gap-1">
                      <code className="text-[12px] bg-[#101010]/5 px-1 py-0.5 rounded">
                        {vault?.address?.slice(0, 10)}...
                        {vault?.address?.slice(-8)}
                      </code>
                      <CopyButton text={vault?.address || ''} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[#101010]/60">Curator</p>
                    <p>{vault?.curator || details.metrics?.curator || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[#101010]/60">Asset</p>
                    <p>{details.metrics?.asset?.symbol || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[#101010]/60">Deployed</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#101010]/40" />
                      <p>
                        {details.deployment?.createdAt
                          ? new Date(
                              details.deployment.createdAt,
                            ).toLocaleDateString()
                          : 'Unknown'}
                        {details.vaultAge && (
                          <span className="text-[#101010]/50 ml-1">
                            ({details.vaultAge.formatted})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#101010]/60">Weekly APY</p>
                    <p>{formatApy(details.metrics?.weeklyApy)}</p>
                  </div>
                  <div>
                    <p className="text-[#101010]/60">Monthly APY</p>
                    <p>{formatApy(details.metrics?.monthlyApy)}</p>
                  </div>
                </div>

                {/* Notes */}
                {details.notes && (
                  <div className="mt-3 p-2 bg-[#F7F7F2] rounded text-[12px]">
                    <span className="text-[#101010]/60">Note:</span>{' '}
                    {details.notes}
                  </div>
                )}

                {/* Warnings */}
                {details.metrics?.warnings &&
                  details.metrics.warnings.length > 0 && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                      <div className="flex items-center gap-2 text-orange-700 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Warnings</span>
                      </div>
                      <ul className="list-disc list-inside text-[12px] text-orange-600">
                        {details.metrics.warnings.map((w: any, i: number) => (
                          <li key={i}>{w.type}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* External Link */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => window.open(vault?.appUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Morpho
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8 text-[#101010]/60">
            Unable to load vault details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Add vault dialog
function AddVaultDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [url, setUrl] = useState('');
  const parseVault = api.vaultAnalytics.parseAndFetchVault.useMutation({
    onSuccess: (data) => {
      toast.success(`Found vault: ${data.metrics?.name}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!url.trim()) return;
    parseVault.mutate({ url: url.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Vault by URL</DialogTitle>
          <DialogDescription>
            Paste a Morpho vault URL to fetch its data and compare
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
              onClick={handleSubmit}
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
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[16px]">
                    {parseVault.data.metrics?.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {parseVault.data.parsed?.chainName}
                    </Badge>
                    {parseVault.data.isTracked && (
                      <Badge className="bg-green-100 text-green-700">
                        Already Tracked
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                      Current APY
                    </p>
                    <p className="text-[20px] font-semibold text-[#1B29FF]">
                      {formatApy(parseVault.data.metrics?.apy)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                      TVL
                    </p>
                    <p className="text-[20px] font-semibold">
                      {formatUsd(parseVault.data.metrics?.totalAssetsUsd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                      30d High
                    </p>
                    <p className="text-[16px] font-semibold text-green-600">
                      {formatApy(parseVault.data.apyStats?.high)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#101010]/60">
                      30d Low
                    </p>
                    <p className="text-[16px] font-semibold text-red-600">
                      {formatApy(parseVault.data.apyStats?.low)}
                    </p>
                  </div>
                </div>

                <div className="text-[13px] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#101010]/60">Address:</span>
                    <code className="bg-[#101010]/5 px-1 rounded text-[12px]">
                      {parseVault.data.parsed?.vaultAddress}
                    </code>
                    <CopyButton
                      text={parseVault.data.parsed?.vaultAddress || ''}
                    />
                  </div>
                  <div>
                    <span className="text-[#101010]/60">Curator:</span>{' '}
                    {parseVault.data.metrics?.curator || 'Unknown'}
                  </div>
                  <div>
                    <span className="text-[#101010]/60">Deployed:</span>{' '}
                    {parseVault.data.deployment?.createdAt
                      ? new Date(
                          parseVault.data.deployment.createdAt,
                        ).toLocaleDateString()
                      : 'Unknown'}
                  </div>
                </div>

                {/* Sparkline */}
                {parseVault.data.historical?.apy && (
                  <div className="mt-4">
                    <p className="text-[11px] uppercase tracking-wider text-[#101010]/60 mb-2">
                      30-Day APY History
                    </p>
                    <Sparkline
                      data={parseVault.data.historical.apy.map((p) => p.value)}
                      width={400}
                      height={60}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main component
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

  // Debug: log any errors
  if (error) {
    console.error('Vault analytics error:', error);
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vault Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
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

  // Group by chain
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
                Monitor Morpho vault performance across chains
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Vault
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
        <CardContent>
          {Object.entries(vaultsByChain).map(([chain, chainVaults]) => (
            <div key={chain} className="mb-6 last:mb-0">
              <h3 className="text-[14px] font-medium mb-3 flex items-center gap-2">
                {chain}
                <Badge variant="outline" className="text-[10px]">
                  {chainVaults.length} vaults
                </Badge>
              </h3>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F7F7F2]">
                      <TableHead className="w-[220px]">Vault</TableHead>
                      <TableHead className="text-right">APY</TableHead>
                      <TableHead className="text-right">TVL</TableHead>
                      <TableHead className="text-right">30d Avg</TableHead>
                      <TableHead className="w-[70px] text-center">
                        Age
                      </TableHead>
                      <TableHead className="w-[120px]">Status</TableHead>
                      <TableHead className="w-[60px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chainVaults.map((vault) => {
                      const apy = vault.metrics?.apy || 0;
                      const avgApy = vault.metrics?.avgApy || 0;
                      const trend = apy >= avgApy ? 'up' : 'down';

                      return (
                        <TableRow
                          key={`${vault.chainId}-${vault.address}`}
                          className={`cursor-pointer hover:bg-[#F7F7F2]/50 ${
                            vault.isInsured ? 'bg-emerald-50/30' : ''
                          }`}
                          onClick={() => setSelectedVault(vault)}
                        >
                          <TableCell>
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-[13px] truncate">
                                    {vault.displayName || vault.name}
                                  </p>
                                  {vault.isPrimary && (
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-[11px] text-[#101010]/50">
                                  {vault.curator}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-semibold tabular-nums text-[#1B29FF]">
                              {formatApy(apy)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatUsd(vault.metrics?.totalAssetsUsd)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatApy(avgApy)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-[12px] text-[#101010]/70 tabular-nums">
                              {vault.vaultAge?.formatted || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {vault.isInsured ? (
                                <InsuranceBadge
                                  isInsured={vault.isInsured}
                                  coverage={vault.insuranceCoverage}
                                />
                              ) : (
                                <RiskBadge risk={vault.risk} />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}

          {vaults.length === 0 && (
            <div className="text-center py-8 text-[#101010]/60">
              No vaults configured
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vault Detail Dialog */}
      <VaultDetailDialog
        vault={selectedVault}
        open={!!selectedVault}
        onClose={() => setSelectedVault(null)}
      />

      {/* Add Vault Dialog */}
      <AddVaultDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </>
  );
}
