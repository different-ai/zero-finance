'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { api } from '@/trpc/react';
import { formatDisplayCurrency } from '@/lib/utils';
import {
  Search,
  TrendingUp,
  Users,
  Wallet,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Building2,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

type KycStatusFilter = 'all' | 'none' | 'pending' | 'approved' | 'rejected';
type BalanceFilter = 'all' | 'hasBalance' | 'noBalance';

export default function UnifiedAdminPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [kycFilter, setKycFilter] = useState<KycStatusFilter>('all');
  const [balanceFilter, setBalanceFilter] = useState<BalanceFilter>('all');
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: workspacesData,
    isLoading: isLoadingWorkspaces,
    error: workspacesError,
    refetch: refetchWorkspaces,
  } = api.admin.listWorkspacesWithMembers.useQuery(undefined, {
    retry: false,
  });

  const {
    data: totalDepositedData,
    isLoading: isLoadingTotalDeposits,
    refetch: refetchTotalDeposits,
  } = api.admin.getTotalDeposited.useQuery(undefined, {
    retry: false,
  });

  const filteredWorkspaces = useMemo(() => {
    if (!workspacesData) return [];

    return workspacesData.filter((workspace) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        workspace.name.toLowerCase().includes(searchLower) ||
        workspace.companyName?.toLowerCase().includes(searchLower) ||
        workspace.firstName?.toLowerCase().includes(searchLower) ||
        workspace.lastName?.toLowerCase().includes(searchLower) ||
        workspace.members.some(
          (m) =>
            m.email?.toLowerCase().includes(searchLower) ||
            m.businessName?.toLowerCase().includes(searchLower),
        );

      const matchesKyc =
        kycFilter === 'all' || workspace.kycStatus === kycFilter;

      const hasBalance = BigInt(workspace.totalBalance) > 0n;
      const matchesBalance =
        balanceFilter === 'all' ||
        (balanceFilter === 'hasBalance' && hasBalance) ||
        (balanceFilter === 'noBalance' && !hasBalance);

      return matchesSearch && matchesKyc && matchesBalance;
    });
  }, [workspacesData, searchQuery, kycFilter, balanceFilter]);

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(workspaceId)) {
        newSet.delete(workspaceId);
      } else {
        newSet.add(workspaceId);
      }
      return newSet;
    });
  };

  const getKycStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getKycStatusBadge = (status: string | null) => {
    const variants: Record<string, string> = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      none: 'bg-gray-100 text-gray-600 border-gray-200',
    };

    return (
      <Badge
        variant="outline"
        className={variants[status || 'none'] || variants.none}
      >
        {status || 'None'}
      </Badge>
    );
  };

  const formatDate = (dateInput: string | Date | null) => {
    if (!dateInput) return 'N/A';
    try {
      return format(new Date(dateInput), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const totalWorkspaces = workspacesData?.length ?? 0;
  const totalMembers =
    workspacesData?.reduce((sum, w) => sum + w.memberCount, 0) ?? 0;
  const workspacesWithKyc =
    workspacesData?.filter((w) => w.kycStatus === 'approved').length ?? 0;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Workspace Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage all workspaces and their members
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Platform Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTotalDeposits ? (
              <div className="text-2xl font-bold text-gray-400">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {totalDepositedData?.totalDeposited
                    ? formatDisplayCurrency(
                        totalDepositedData.totalDeposited,
                        'USDC',
                        'base',
                      )
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all workspaces
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workspaces</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkspaces}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {workspacesWithKyc} with KYC approved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all workspaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Vaults</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTotalDeposits ? (
              <div className="text-2xl font-bold text-gray-400">Loading...</div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">
                  {totalDepositedData?.breakdown?.inVaults
                    ? formatDisplayCurrency(
                        totalDepositedData.breakdown.inVaults,
                        'USDC',
                        'base',
                      )
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDepositedData?.breakdown?.depositCount ?? 0} deposits
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Workspaces</CardTitle>
              <CardDescription>
                Search by workspace name, company, or member email
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchWorkspaces();
                refetchTotalDeposits();
              }}
              disabled={isLoadingWorkspaces}
              className="gap-2 w-full md:w-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoadingWorkspaces ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workspaces, companies, members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select
                  value={kycFilter}
                  onValueChange={(value) =>
                    setKycFilter(value as KycStatusFilter)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All KYC Statuses</SelectItem>
                    <SelectItem value="approved">KYC Approved</SelectItem>
                    <SelectItem value="pending">KYC Pending</SelectItem>
                    <SelectItem value="rejected">KYC Rejected</SelectItem>
                    <SelectItem value="none">No KYC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <Select
                  value={balanceFilter}
                  onValueChange={(value) =>
                    setBalanceFilter(value as BalanceFilter)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by balance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Balances</SelectItem>
                    <SelectItem value="hasBalance">Has Balance</SelectItem>
                    <SelectItem value="noBalance">No Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {filteredWorkspaces.length} of {totalWorkspaces}{' '}
                workspaces
              </span>
            </div>
          </div>

          {isLoadingWorkspaces ? (
            <div className="text-center py-8 text-gray-500">
              Loading workspaces...
            </div>
          ) : workspacesError ? (
            <div className="text-center py-8 text-red-500">
              Error loading workspaces: {workspacesError.message}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWorkspaces.map((workspace) => {
                const isExpanded = expandedWorkspaces.has(workspace.id);
                const hasBalance = BigInt(workspace.totalBalance) > 0n;

                return (
                  <Collapsible
                    key={workspace.id}
                    open={isExpanded}
                    onOpenChange={() => toggleWorkspace(workspace.id)}
                  >
                    <div className="border rounded-lg hover:bg-gray-50 transition-colors">
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3 flex-1">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-500" />
                            )}

                            <div className="flex items-center gap-2">
                              {workspace.workspaceType === 'business' ? (
                                <Building2 className="h-5 w-5 text-blue-600" />
                              ) : (
                                <UserCheck className="h-5 w-5 text-purple-600" />
                              )}
                            </div>

                            <div className="text-left flex-1">
                              <div className="font-semibold text-gray-900">
                                {workspace.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {workspace.companyName ||
                                  `${workspace.firstName || ''} ${workspace.lastName || ''}`.trim() ||
                                  'No name'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {getKycStatusIcon(workspace.kycStatus)}
                                {getKycStatusBadge(workspace.kycStatus)}
                              </div>
                            </div>

                            <div className="text-right min-w-[120px]">
                              <div className="font-semibold text-gray-900">
                                {formatDisplayCurrency(
                                  workspace.totalBalance,
                                  'USDC',
                                  'base',
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {workspace.memberCount} member
                                {workspace.memberCount !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t bg-gray-50 p-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                In Safes
                              </div>
                              <div className="font-semibold">
                                {formatDisplayCurrency(
                                  workspace.balanceInSafes,
                                  'USDC',
                                  'base',
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                In Vaults
                              </div>
                              <div className="font-semibold text-green-600">
                                {formatDisplayCurrency(
                                  workspace.balanceInVaults,
                                  'USDC',
                                  'base',
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Deposits
                              </div>
                              <div className="font-semibold">
                                {workspace.depositCount}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">
                                Created
                              </div>
                              <div className="font-semibold text-sm">
                                {formatDate(workspace.createdAt)}
                              </div>
                            </div>
                          </div>

                          {workspace.alignCustomerId && (
                            <div className="text-sm">
                              <span className="text-gray-500">
                                Align Customer:{' '}
                              </span>
                              <span className="font-mono text-xs">
                                {workspace.alignCustomerId}
                              </span>
                            </div>
                          )}

                          {workspace.members.length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-2">
                                Members ({workspace.members.length})
                              </div>
                              <div className="space-y-2">
                                {workspace.members.map((member, idx) => (
                                  <div
                                    key={member.userId}
                                    className="flex items-center justify-between bg-white p-3 rounded border"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">
                                          {member.email?.[0]?.toUpperCase() ||
                                            'U'}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="font-medium text-sm">
                                          {member.email || 'No email'}
                                        </div>
                                        {member.businessName && (
                                          <div className="text-xs text-gray-500">
                                            {member.businessName}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {member.isPrimary && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Owner
                                        </Badge>
                                      )}
                                      <Badge
                                        variant="outline"
                                        className="text-xs capitalize"
                                      >
                                        {member.role}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}

              {filteredWorkspaces.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No workspaces found</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
