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

  const handleUserClick = (user: any) => {
    // You can add logic here to show user details in a modal
    // or navigate to a user detail page
    console.log('User clicked:', user);
    toast.info(`Selected user: ${user.email}`);
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
    </div>
  );
}
