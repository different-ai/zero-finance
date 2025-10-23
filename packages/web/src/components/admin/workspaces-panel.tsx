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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatUnits } from 'viem';
import { Badge } from '@/components/ui/badge';

export default function WorkspacesPanel() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data: workspaces,
    isLoading,
    refetch,
  } = api.admin.listWorkspacesWithMembers.useQuery();

  const { data: workspaceDetails, isLoading: isLoadingDetails } =
    api.admin.getWorkspaceDetails.useQuery(
      {
        workspaceId: selectedWorkspace?.id || '',
      },
      {
        enabled: !!selectedWorkspace && isDetailsOpen,
        retry: false,
      },
    );

  const handleWorkspaceClick = (workspace: any) => {
    setSelectedWorkspace(workspace);
    setIsDetailsOpen(true);
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading workspaces...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Workspaces</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {workspaces?.length || 0} total workspaces
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces?.map((workspace: any) => (
          <Card
            key={workspace.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleWorkspaceClick(workspace)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {workspace.workspaceType || 'business'}
                  </CardDescription>
                </div>
                <Badge
                  className={getKycStatusColor(workspace.kycStatus || 'none')}
                  variant="outline"
                >
                  {workspace.kycStatus || 'none'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {workspace.companyName && (
                  <div>
                    <strong>Company:</strong> {workspace.companyName}
                  </div>
                )}
                <div>
                  <strong>Type:</strong> {workspace.beneficiaryType || 'N/A'}
                </div>
                <div>
                  <strong>Created:</strong>{' '}
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </div>
                {workspace.alignCustomerId && (
                  <div className="text-xs text-muted-foreground">
                    Align: {workspace.alignCustomerId.substring(0, 12)}...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedWorkspace?.name}</DialogTitle>
            <DialogDescription>
              Workspace ID: {selectedWorkspace?.id}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="py-8 text-center">Loading workspace details...</div>
          ) : workspaceDetails ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Workspace Type:</strong>{' '}
                      {workspaceDetails.workspace.workspaceType || 'business'}
                    </div>
                    <div>
                      <strong>KYC Status:</strong>{' '}
                      <Badge
                        className={getKycStatusColor(
                          workspaceDetails.workspace.kycStatus || 'none',
                        )}
                        variant="outline"
                      >
                        {workspaceDetails.workspace.kycStatus || 'none'}
                      </Badge>
                    </div>
                    <div>
                      <strong>Company:</strong>{' '}
                      {workspaceDetails.workspace.companyName || 'N/A'}
                    </div>
                    <div>
                      <strong>Beneficiary Type:</strong>{' '}
                      {workspaceDetails.workspace.beneficiaryType || 'N/A'}
                    </div>
                    {workspaceDetails.workspace.firstName && (
                      <div>
                        <strong>Contact:</strong>{' '}
                        {workspaceDetails.workspace.firstName}{' '}
                        {workspaceDetails.workspace.lastName}
                      </div>
                    )}
                    <div>
                      <strong>Created:</strong>{' '}
                      {new Date(
                        workspaceDetails.workspace.createdAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Total Deposited
                      </div>
                      <div className="text-2xl font-bold">
                        ${' '}
                        {formatUnits(
                          BigInt(workspaceDetails.finances.totalDeposited),
                          6,
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Deposits
                      </div>
                      <div className="text-2xl font-bold">
                        {workspaceDetails.finances.depositCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Safes</div>
                      <div className="text-2xl font-bold">
                        {workspaceDetails.finances.safeCount}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Auto-Earn Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {workspaceDetails.autoEarn.enabled ? (
                    <div className="space-y-3">
                      {workspaceDetails.autoEarn.configs.map((config, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-muted rounded-md space-y-1"
                        >
                          <div>
                            <strong>Safe:</strong> {config.safeAddress}
                          </div>
                          <div>
                            <strong>Allocation:</strong> {config.percentage}%
                          </div>
                          {config.lastTrigger && (
                            <div className="text-xs text-muted-foreground">
                              Last run:{' '}
                              {new Date(config.lastTrigger).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      Auto-earn not configured
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Members</CardTitle>
                </CardHeader>
                <CardContent>
                  {workspaceDetails.members.length > 0 ? (
                    <div className="space-y-2">
                      {workspaceDetails.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 border rounded-md"
                        >
                          <div>
                            <div className="font-medium">
                              {member.firstName} {member.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {member.userId}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">{member.role}</Badge>
                            {member.isPrimary && (
                              <Badge variant="default" className="ml-1">
                                Primary
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No members</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Safes</CardTitle>
                </CardHeader>
                <CardContent>
                  {workspaceDetails.safes.length > 0 ? (
                    <div className="space-y-2">
                      {workspaceDetails.safes.map((safe, idx) => (
                        <div
                          key={idx}
                          className="p-2 border rounded-md space-y-1 text-sm"
                        >
                          <div>
                            <strong>Address:</strong> {safe.safeAddress}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{safe.safeType}</Badge>
                            {safe.isEarnModuleEnabled && (
                              <Badge variant="default" className="bg-green-600">
                                Earn Enabled
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No safes</div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Banking & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>KYC Provider:</strong>{' '}
                      {workspaceDetails.workspace.kycProvider || 'N/A'}
                    </div>
                    <div>
                      <strong>KYC Status:</strong>{' '}
                      {workspaceDetails.workspace.kycStatus || 'N/A'}
                    </div>
                    <div>
                      <strong>Align Customer ID:</strong>{' '}
                      {workspaceDetails.workspace.alignCustomerId || 'N/A'}
                    </div>
                    <div>
                      <strong>Virtual Account:</strong>{' '}
                      {workspaceDetails.workspace.alignVirtualAccountId ||
                        'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
