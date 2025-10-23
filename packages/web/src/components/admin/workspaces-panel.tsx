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
import { Badge } from '@/components/ui/badge';
import WorkspaceDetailsDialog from './workspace-details-dialog';

export default function WorkspacesPanel() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data: workspaces,
    isLoading,
    refetch,
  } = api.admin.listWorkspacesWithMembers.useQuery();

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

      <WorkspaceDetailsDialog
        workspace={selectedWorkspace}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
