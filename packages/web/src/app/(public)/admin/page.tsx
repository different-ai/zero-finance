'use client';

import { useState, useEffect } from 'react';
import AdminPanel from '@/components/admin/admin-panel';
import KycKanbanBoard from '@/components/admin/kyc-kanban-board';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TableIcon, LayoutGrid, RefreshCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');
  const [isSyncing, setIsSyncing] = useState(false);

  // Load admin token from session storage on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('adminToken');
    if (storedToken) {
      setAdminToken(storedToken);
      setIsTokenValid(true);
    }
  }, []);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = api.admin.listUsers.useQuery(
    { adminToken },
    {
      enabled: isTokenValid,
      retry: false,
    },
  );

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminToken.trim() === '') {
      toast.error('Please enter an admin token');
      return;
    }
    // Store admin token in session storage
    sessionStorage.setItem('adminToken', adminToken);
    setIsTokenValid(true);
  };

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  const {
    data: userDetails,
    isLoading: isLoadingDetails,
    refetch: refetchUserDetails,
  } = api.admin.getUserDetails.useQuery(
    {
      adminToken,
      privyDid: selectedUser?.privyDid || '',
    },
    {
      enabled: !!selectedUser && isUserDetailsOpen && isTokenValid,
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
        body: JSON.stringify({ adminToken }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `KYC sync completed: ${data.summary.updated} updated, ${data.summary.unchanged} unchanged, ${data.summary.errors} errors`,
        );
        // Refresh the users list
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

  if (!isTokenValid) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Admin Authentication</CardTitle>
            <CardDescription>
              Please enter your admin token to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="adminToken" className="text-sm font-medium">
                  Admin Token
                </label>
                <Input
                  id="adminToken"
                  type="password"
                  value={adminToken}
                  onChange={(e) => setAdminToken(e.target.value)}
                  placeholder="Enter admin token"
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Authenticate
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
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
          <Button
            variant="outline"
            onClick={() => {
              sessionStorage.removeItem('adminToken');
              setIsTokenValid(false);
              setAdminToken('');
              toast.success('Logged out successfully');
            }}
          >
            Log Out
          </Button>
        </div>
      </div>

      <Tabs
        value={activeView}
        onValueChange={(v) => setActiveView(v as 'table' | 'kanban')}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Table View
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            KYC Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <AdminPanel />
        </TabsContent>

        <TabsContent value="kanban">
          <KycKanbanBoard
            users={usersData as any}
            isLoading={isLoadingUsers}
            onUserClick={handleUserClick}
            onRefresh={refetchUsers}
          />
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
