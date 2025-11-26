'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import AdminPanel from '@/components/admin/admin-panel';
import KycKanbanBoard from '@/components/admin/kyc-kanban-board';
import WorkspacesPanel from '@/components/admin/workspaces-panel';
import { PlatformOverviewStats } from '@/components/admin/platform-overview-stats';
import VaultAnalyticsPanel from '@/components/admin/vault-analytics-panel';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TableIcon,
  LayoutGrid,
  RefreshCw,
  ShieldAlert,
  Building2,
  TrendingUp,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminPage() {
  const { user, authenticated, login } = usePrivy();
  const [activeView, setActiveView] = useState<
    'workspaces' | 'table' | 'kanban' | 'vaults'
  >('workspaces');
  const [isSyncing, setIsSyncing] = useState(false);

  // Check if user is admin
  const {
    data: isAdminData,
    isLoading: isCheckingAdmin,
    error: adminCheckError,
  } = api.admin.checkIsAdmin.useQuery(undefined, {
    enabled: authenticated && !!user?.id,
    retry: false,
  });

  const isAdmin = isAdminData?.isAdmin ?? false;

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = api.admin.listUsers.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  const {
    data: userDetails,
    isLoading: isLoadingDetails,
    refetch: refetchUserDetails,
  } = api.admin.getUserDetails.useQuery(
    {
      privyDid: selectedUser?.privyDid || '',
    },
    {
      enabled: !!selectedUser && isUserDetailsOpen && isAdmin,
      retry: false,
    },
  );

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleSyncKyc = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/admin/sync-all-kyc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `KYC sync completed: ${data.summary.updated} updated, ${data.summary.unchanged} unchanged, ${data.summary.errors} errors`,
        );
        refetchUsers();
      } else {
        toast.error(`Sync failed: ${data.error}`);
      }
    } catch (error) {
      toast.error('Failed to sync KYC data');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Show loading state while checking admin status
  if (!authenticated || isCheckingAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>
              {!authenticated
                ? 'Please authenticate to access the admin panel'
                : 'Checking admin privileges...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!authenticated ? (
              <Button onClick={login} className="w-full">
                Sign In
              </Button>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Verifying admin access...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
            <CardDescription>
              You do not have permission to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Admin access is restricted to authorized personnel only.
            </p>
            <p className="text-xs text-muted-foreground">
              User ID: {user?.id?.substring(0, 20)}...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as admin
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSyncKyc}
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Sync All KYC'}
          </Button>
        </div>
      </div>

      {/* Platform Overview Stats - Always Visible */}
      <PlatformOverviewStats />

      <Tabs
        value={activeView}
        onValueChange={(v) =>
          setActiveView(v as 'workspaces' | 'table' | 'kanban' | 'vaults')
        }
      >
        <TabsList className="mb-6">
          <TabsTrigger value="workspaces" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Workspaces
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            KYC Kanban
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="vaults" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Vaults
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workspaces">
          <WorkspacesPanel />
        </TabsContent>

        <TabsContent value="kanban">
          <KycKanbanBoard
            users={usersData as any}
            isLoading={isLoadingUsers}
            onUserClick={handleUserClick}
            onRefresh={refetchUsers}
          />
        </TabsContent>

        <TabsContent value="table">
          <AdminPanel />
        </TabsContent>

        <TabsContent value="vaults">
          <VaultAnalyticsPanel />
        </TabsContent>
      </Tabs>

      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="py-8 text-center">Loading user details...</div>
          ) : userDetails ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>Email:</strong> {selectedUser?.email}
                    </div>
                    <div>
                      <strong>User Role:</strong>{' '}
                      {userDetails.user.userRole || 'N/A'}
                    </div>
                    <div>
                      <strong>First Name:</strong>{' '}
                      {userDetails.user.firstName || 'N/A'}
                    </div>
                    <div>
                      <strong>Last Name:</strong>{' '}
                      {userDetails.user.lastName || 'N/A'}
                    </div>
                    <div>
                      <strong>Company:</strong>{' '}
                      {userDetails.user.companyName || 'N/A'}
                    </div>
                    <div>
                      <strong>Beneficiary Type:</strong>{' '}
                      {userDetails.user.beneficiaryType || 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workspace</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {userDetails.primaryWorkspace ? (
                    <>
                      <div>
                        <strong>Primary Workspace:</strong>{' '}
                        {userDetails.primaryWorkspace.name}
                      </div>
                      <div>
                        <strong>Workspace ID:</strong>{' '}
                        {userDetails.primaryWorkspace.id}
                      </div>
                    </>
                  ) : (
                    <div className="text-muted-foreground">
                      No primary workspace
                    </div>
                  )}

                  {userDetails.workspaceMemberships.length > 0 && (
                    <div className="mt-4">
                      <strong>All Workspaces:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {userDetails.workspaceMemberships.map((wm: any) => (
                          <li key={wm.workspaceId}>
                            {wm.workspaceName} ({wm.role})
                            {wm.isPrimary && ' - Primary'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <strong>Savings Enabled:</strong>{' '}
                    <span
                      className={
                        userDetails.hasSavings
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {userDetails.hasSavings ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {userDetails.features.length > 0 ? (
                    <div className="mt-4">
                      <strong>All Features:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {userDetails.features.map((f: any) => (
                          <li key={f.featureName}>
                            {f.featureName} -{' '}
                            {f.isActive ? 'Active' : 'Inactive'}
                            {f.purchaseSource && ` (${f.purchaseSource})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-2 text-muted-foreground">
                      No features enabled
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <strong>KYC Status:</strong>{' '}
                      <span
                        className={
                          userDetails.user.kycStatus === 'approved'
                            ? 'text-green-600'
                            : userDetails.user.kycStatus === 'rejected'
                              ? 'text-red-600'
                              : userDetails.user.kycStatus === 'pending'
                                ? 'text-yellow-600'
                                : ''
                        }
                      >
                        {userDetails.user.kycStatus || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <strong>KYC Provider:</strong>{' '}
                      {userDetails.user.kycProvider || 'N/A'}
                    </div>
                    <div>
                      <strong>Align Customer ID:</strong>{' '}
                      {userDetails.user.alignCustomerId || 'N/A'}
                    </div>
                    <div>
                      <strong>Virtual Account:</strong>{' '}
                      {userDetails.user.alignVirtualAccountId || 'N/A'}
                    </div>
                    <div>
                      <strong>Loops Synced:</strong>{' '}
                      {userDetails.user.loopsContactSynced ? 'Yes' : 'No'}
                    </div>
                    <div>
                      <strong>Created At:</strong>{' '}
                      {new Date(
                        userDetails.user.createdAt,
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button onClick={() => refetchUserDetails()} size="sm">
                  Refresh Details
                </Button>
              </div>
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
