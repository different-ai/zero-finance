'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { api } from '@/trpc/react';

export default function AdminPanel() {
  const [adminToken, setAdminToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ privyDid: string, email: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // List users query
  const { data: users, isLoading, error, refetch } = api.admin.listUsers.useQuery(
    { adminToken },
    { 
      enabled: isTokenValid,
      retry: false
    }
  );
  
  // Handle error with useEffect to avoid render loop
  useEffect(() => {
    if (error) {
      console.error('Error fetching users:', error);
      setIsTokenValid(false);
    }
  }, [error]);
  
  // Delete user mutation
  const deleteMutation = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      refetch();
    }
  });
  
  // Handle token submit
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminToken.trim() === '') {
      alert('Please enter an admin token');
      return;
    }
    
    setIsTokenValid(true);
  };
  
  // Handle user deletion
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    deleteMutation.mutate({
      adminToken,
      privyDid: userToDelete.privyDid,
    });
  };
  
  // Format date for display
  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM d, yyyy HH:mm');
  };
  
  return (
    <div className="space-y-8">
      {!isTokenValid ? (
        <Card>
          <CardHeader>
            <CardTitle>Admin Authentication</CardTitle>
            <CardDescription>Please enter your admin token to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="adminToken" className="text-sm font-medium">Admin Token</label>
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
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading users...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-500">
                  Error loading users: {error.message}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Onboarding</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.privyDid}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.businessName || 'N/A'}</TableCell>
                          <TableCell>{formatDate(user?.createdAt?.toString())}</TableCell>
                          <TableCell>{user.hasCompletedOnboarding ? 'Complete' : 'Incomplete'}</TableCell>
                          <TableCell>
                            <AlertDialog open={isDeleteDialogOpen && userToDelete?.privyDid === user.privyDid} onOpenChange={setIsDeleteDialogOpen}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setUserToDelete({ privyDid: user.privyDid, email: user.email });
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user
                                    <strong> {user.email}</strong> and all associated data including invoices, wallets, and company profiles.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteUser}
                                    disabled={deleteMutation.isPending}
                                  >
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIsTokenValid(false);
                  setAdminToken('');
                }}
              >
                Log Out
              </Button>
              <Button
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
} 