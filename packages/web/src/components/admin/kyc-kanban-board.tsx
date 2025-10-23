'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  UserPlus,
  AlertTriangle,
  Paperclip,
} from 'lucide-react';

interface AdminUserDisplay {
  privyDid: string;
  email: string;
  businessName: string | null;
  createdAt: string | Date | null;
  skippedOrCompletedOnboardingStepper: boolean | null;
  alignCustomerId: string | null;
  kycStatus: string | null;
  kycSubStatus?: string | null;
  kycFlowLink?: string | null;
  workspaces?: Array<{
    id: string;
    name: string;
    role: string;
    isPrimary: boolean;
  }>;
}

interface KycKanbanBoardProps {
  users: AdminUserDisplay[] | undefined;
  isLoading: boolean;
  onUserClick?: (user: AdminUserDisplay) => void;
  onRefresh?: () => void;
}

type KycColumn = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  users: AdminUserDisplay[];
};

export default function KycKanbanBoard({
  users,
  isLoading,
  onUserClick,
  onRefresh,
}: KycKanbanBoardProps) {
  const [expandedColumns, setExpandedColumns] = useState<Set<string>>(
    new Set(['no_kyc', 'needs_documents', 'pending', 'approved', 'rejected']),
  );

  const toggleColumn = (columnId: string) => {
    const newExpanded = new Set(expandedColumns);
    if (newExpanded.has(columnId)) {
      newExpanded.delete(columnId);
    } else {
      newExpanded.add(columnId);
    }
    setExpandedColumns(newExpanded);
  };

  const formatDate = (dateInput: string | null | undefined | Date) => {
    if (!dateInput) return 'N/A';
    try {
      return format(new Date(dateInput), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getSubStatusLabel = (subStatus: string | null | undefined) => {
    switch (subStatus) {
      case 'kyc_form_submission_started':
        return 'Form Started';
      case 'kyc_form_submission_accepted':
        return 'Under Review';
      case 'kyc_form_resubmission_required':
        return 'Needs Resubmission';
      default:
        return null;
    }
  };

  const getSubStatusColor = (subStatus: string | null | undefined) => {
    switch (subStatus) {
      case 'kyc_form_submission_started':
        return 'bg-blue-100 text-blue-800';
      case 'kyc_form_submission_accepted':
        return 'bg-yellow-100 text-yellow-800';
      case 'kyc_form_resubmission_required':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Categorize users by KYC status
  // Be very specific about filtering to avoid misplaced users
  const columns: KycColumn[] = [
    {
      id: 'no_kyc',
      title: 'No KYC',
      icon: <UserPlus className="h-4 w-4" />,
      color: 'text-gray-700',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      users:
        users?.filter(
          (u) => (!u.kycStatus || u.kycStatus === 'none') && !u.alignCustomerId,
        ) || [],
    },
    {
      id: 'no_align',
      title: 'No Align Customer',
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      users:
        users?.filter(
          (u) => !u.alignCustomerId && u.kycStatus && u.kycStatus !== 'none',
        ) || [],
    },
    {
      id: 'needs_documents',
      title: 'Needs Documents',
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      users:
        users?.filter(
          (u) =>
            // Only show users who are pending AND need resubmission
            u.kycStatus === 'pending' &&
            u.kycSubStatus === 'kyc_form_resubmission_required',
        ) || [],
    },
    {
      id: 'pending',
      title: 'Under Review',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      users:
        users?.filter(
          (u) =>
            u.kycStatus === 'pending' &&
            // Exclude users who need document resubmission
            u.kycSubStatus !== 'kyc_form_resubmission_required',
        ) || [],
    },
    {
      id: 'approved',
      title: 'Approved',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      users:
        users?.filter(
          (u) =>
            u.kycStatus === 'approved' &&
            // Ensure they're not mistakenly marked as needing documents
            u.kycSubStatus !== 'kyc_form_resubmission_required',
        ) || [],
    },
    {
      id: 'rejected',
      title: 'Rejected',
      icon: <XCircle className="h-4 w-4" />,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      users: users?.filter((u) => u.kycStatus === 'rejected') || [],
    },
  ];

  const totalUsers = users?.length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading KYC data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {columns.map((column) => (
          <Card
            key={column.id}
            className={`${column.bgColor} border ${column.borderColor}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${column.color}`}>
                    {column.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {column.users.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {totalUsers > 0
                      ? `${((column.users.length / totalUsers) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
                <div className={column.color}>{column.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-0">
            <Card
              className={`h-full ${column.bgColor} border ${column.borderColor}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={`text-sm font-medium ${column.color} flex items-center gap-2`}
                  >
                    {column.icon}
                    <span>{column.title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {column.users.length}
                    </Badge>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleColumn(column.id)}
                    className="h-6 w-6 p-0"
                  >
                    {expandedColumns.has(column.id) ? '−' : '+'}
                  </Button>
                </div>
              </CardHeader>
              {expandedColumns.has(column.id) && (
                <CardContent className="pt-0 space-y-2 max-h-[600px] overflow-y-auto">
                  {column.users.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No users in this category
                    </p>
                  ) : (
                    column.users.map((user) => (
                      <Card
                        key={user.privyDid}
                        className={`cursor-pointer hover:shadow-md transition-shadow bg-white ${
                          user.kycSubStatus === 'kyc_form_resubmission_required'
                            ? 'ring-2 ring-purple-400'
                            : ''
                        }`}
                        onClick={() => onUserClick?.(user)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            {/* Document Alert Banner */}
                            {user.kycSubStatus ===
                              'kyc_form_resubmission_required' && (
                              <div className="bg-purple-100 border border-purple-300 rounded p-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-purple-700 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-xs font-semibold text-purple-900">
                                    Additional Documents Required
                                  </p>
                                  <p className="text-xs text-purple-700">
                                    User needs to submit more documents for
                                    verification
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-start justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {user.email}
                                  </p>
                                  {user.kycSubStatus ===
                                    'kyc_form_resubmission_required' && (
                                    <span title="Documents needed">
                                      <Paperclip className="h-3 w-3 text-purple-600" />
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                  {user.businessName || 'No business name'}
                                </p>
                              </div>
                            </div>

                            {user.kycSubStatus && (
                              <Badge
                                className={`text-xs ${
                                  user.kycSubStatus ===
                                  'kyc_form_resubmission_required'
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                    : getSubStatusColor(user.kycSubStatus)
                                }`}
                                variant="secondary"
                              >
                                {user.kycSubStatus ===
                                'kyc_form_resubmission_required'
                                  ? '⚠️ Needs Documents'
                                  : getSubStatusLabel(user.kycSubStatus)}
                              </Badge>
                            )}

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Joined {formatDate(user.createdAt)}</span>
                              {user.alignCustomerId && (
                                <span title="Has Align Customer ID">
                                  <FileText className="h-3 w-3" />
                                </span>
                              )}
                            </div>

                            {/* Workspace Information */}
                            {user.workspaces && user.workspaces.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs font-medium text-gray-700 mb-1">
                                  Workspaces ({user.workspaces.length})
                                </p>
                                <div className="space-y-1">
                                  {user.workspaces
                                    .slice(0, 2)
                                    .map((ws, idx) => (
                                      <div
                                        key={ws.id}
                                        className="flex items-center justify-between text-xs"
                                      >
                                        <span className="text-gray-600 truncate">
                                          {ws.name}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px] h-4 px-1"
                                          >
                                            {ws.role}
                                          </Badge>
                                          {ws.isPrimary && (
                                            <span
                                              className="text-blue-600"
                                              title="Primary"
                                            >
                                              ★
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  {user.workspaces.length > 2 && (
                                    <p className="text-[10px] text-gray-500">
                                      +{user.workspaces.length - 2} more
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {user.kycFlowLink && (
                              <div className="flex items-center gap-2">
                                <a
                                  href={user.kycFlowLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-xs hover:underline block flex-1 ${
                                    user.kycSubStatus ===
                                    'kyc_form_resubmission_required'
                                      ? 'text-purple-600 font-semibold'
                                      : 'text-blue-600'
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {user.kycSubStatus ===
                                  'kyc_form_resubmission_required'
                                    ? '📎 Upload Documents →'
                                    : 'KYC Flow Link →'}
                                </a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              )}
            </Card>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      {onRefresh && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh KYC Data
          </Button>
        </div>
      )}
    </div>
  );
}
