'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatDisplayCurrency } from '@/lib/utils';

// Explicitly define the type for a user object returned by listUsers query
// This should match the actual structure from userService.listUsers()
interface AdminUserDisplay {
  privyDid: string;
  email: string;
  businessName: string | null; // Assuming it can be null based on usage `user.businessName || 'N/A'`
  createdAt: string | Date | null; // Can be string or Date from DB/API
  skippedOrCompletedOnboardingStepper: boolean | null;
  alignCustomerId: string | null;
  kycStatus: string | null;
  kycFlowLink?: string | null; // Optional if not always present
  // Add other fields if they exist and are used, e.g., from your DB schema
  // loopsContactSynced?: boolean | null;
  // companyProfileId?: string | null;
  // etc.
}

// Type for the direct Align KYC details from getAlignCustomerDirectDetails
interface AlignDirectDetailsType {
  customer_id: string;
  email: string;
  kycs: {
    status: 'pending' | 'approved' | 'rejected' | null;
    kyc_flow_link: string | null;
  } | null;
}

export default function AdminPanel() {
  const [adminToken, setAdminToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ privyDid: string, email: string } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<{ privyDid: string, email: string } | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  
  const [userForAlignDirectDetails, setUserForAlignDirectDetails] = useState<AdminUserDisplay | null>(null);
  const [isAlignDirectDetailsDialogOpen, setIsAlignDirectDetailsDialogOpen] = useState(false);
  
  const [userToOverrideKyc, setUserToOverrideKyc] = useState<{ privyDid: string, email: string } | null>(null);
  const [isOverrideKycDialogOpen, setIsOverrideKycDialogOpen] = useState(false);
  
  const [userToCreateKyc, setUserToCreateKyc] = useState<{ privyDid: string, email: string } | null>(null);
  const [isCreateKycDialogOpen, setIsCreateKycDialogOpen] = useState(false);
  
  const [userToCreateAlignCustomer, setUserToCreateAlignCustomer] = useState<{ privyDid: string, email: string } | null>(null);
  const [isCreateAlignCustomerDialogOpen, setIsCreateAlignCustomerDialogOpen] = useState(false);
  
  const [alignCustomerForm, setAlignCustomerForm] = useState({
    firstName: '',
    lastName: '',
    beneficiaryType: 'individual' as 'individual' | 'corporate'
  });
  
  const [userToSyncAlign, setUserToSyncAlign] = useState<{ privyDid: string, email: string } | null>(null);
  const [isSyncAlignDialogOpen, setIsSyncAlignDialogOpen] = useState(false);
  
  const { data: usersData, isLoading: isLoadingUsers, error: usersError, refetch: refetchUsers } = api.admin.listUsers.useQuery(
    { adminToken },
    {
      enabled: isTokenValid,
      retry: false,
    }
  );
  // Fetch total deposited across platform
  const {
    data: totalDepositedData,
    isLoading: isLoadingTotalDeposits,
    error: totalDepositsError,
    refetch: refetchTotalDeposits,
  } = api.admin.getTotalDeposited.useQuery(
    { adminToken },
    {
      enabled: isTokenValid,
      retry: false,
    },
  );

  // Derived formatted value
  const formattedTotalDeposited = totalDepositedData?.totalDeposited
    ? formatDisplayCurrency(totalDepositedData.totalDeposited, 'USDC', 'base')
    : 'N/A';

  // Explicitly cast here after fetching. `usersData` type is inferred from the query.
  const users: AdminUserDisplay[] | undefined = usersData as AdminUserDisplay[] | undefined;

  const {
    data: alignDirectDetailsData, 
    isLoading: isLoadingAlignDirectDetails,
    isError: isAlignDirectDetailsError, // Using isError for boolean check
    error: alignDirectDetailsErrorData, // Actual error object
    refetch: fetchAlignDirectDetailsQuery,
  } = api.admin.getAlignCustomerDirectDetails.useQuery(
    {
      adminToken,
      privyDid: userForAlignDirectDetails?.privyDid ?? '', 
    },
    {
      enabled: !!userForAlignDirectDetails?.privyDid && isAlignDirectDetailsDialogOpen, 
      retry: false,
      // onSuccess and onError are not standard options here for side-effects like toasts
      // These are handled by useEffect below or globally in QueryClient
    }
  );
  // Use the data from the query directly in the dialog
  const alignDirectDetails: AlignDirectDetailsType | null | undefined = alignDirectDetailsData;

  // Effect for handling users query errors
  useEffect(() => {
    if (usersError) {
      console.error('Error fetching users:', usersError);
      toast.error(`Error fetching users: ${usersError.message}`);
      setIsTokenValid(false);
    }
  }, [usersError]);

  // Effect for handling Align direct details query side-effects (toasts)
  useEffect(() => {
    if (userForAlignDirectDetails) { // Only show toasts if a fetch was attempted for a user
        if (alignDirectDetailsData && !isLoadingAlignDirectDetails && !isAlignDirectDetailsError) {
            // Check if it's not the initial undefined state and not loading
            if (alignDirectDetailsData !== undefined) { // Avoid toast on initial mount before fetch attempt
                 // toast.success('Align details fetched successfully.'); // Can be noisy, enable if desired
            }
        } else if (isAlignDirectDetailsError && alignDirectDetailsErrorData) {
            toast.error(`Failed to fetch Align details: ${alignDirectDetailsErrorData.message}`);
        }
    }
  }, [alignDirectDetailsData, isLoadingAlignDirectDetails, isAlignDirectDetailsError, alignDirectDetailsErrorData, userForAlignDirectDetails]);
  
  const deleteMutation = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      refetchUsers();
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  });
  
  const resetAlignMutation = api.admin.resetUserAlignData.useMutation({
    onSuccess: (data) => {
      setIsResetDialogOpen(false);
      setUserToReset(null);
      toast.success(data.message);
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Failed to reset Align data: ${error.message}`);
    }
  });
  
  const overrideKycMutation = api.admin.overrideKycStatusFromAlign.useMutation({
    onSuccess: (data) => {
      setIsOverrideKycDialogOpen(false);
      setUserToOverrideKyc(null);
      toast.success(data.message);
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Failed to override KYC status: ${error.message}`);
    }
  });
  
  const createKycMutation = api.admin.createKycSession.useMutation({
    onSuccess: (data) => {
      setIsCreateKycDialogOpen(false);
      setUserToCreateKyc(null);
      toast.success(data.message);
      if (data.kycFlowLink) {
        toast.info('KYC flow link has been updated for the user.');
      }
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Failed to create KYC session: ${error.message}`);
    }
  });
  
  const createAlignCustomerMutation = api.admin.createAlignCustomer.useMutation({
    onSuccess: (data) => {
      setIsCreateAlignCustomerDialogOpen(false);
      setUserToCreateAlignCustomer(null);
      setAlignCustomerForm({ firstName: '', lastName: '', beneficiaryType: 'individual' });
      toast.success(data.message);
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Failed to create Align customer: ${error.message}`);
    }
  });
  
  const syncAlignMutation = api.admin.syncAlignCustomer.useMutation({
    onSuccess: (data) => {
      setIsSyncAlignDialogOpen(false);
      setUserToSyncAlign(null);
      toast.success(data.message);
      if (data.wasFoundByEmail) {
        toast.info('Customer was found by email and linked to the user.');
      }
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Failed to sync with Align: ${error.message}`);
    }
  });
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminToken.trim() === '') {
      toast.error('Please enter an admin token');
      return;
    }
    setIsTokenValid(true); // This will trigger the users query via `enabled` flag
  };
  
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteMutation.mutate({ adminToken, privyDid: userToDelete.privyDid });
  };
  
  const handleResetAlignData = () => {
    if (!userToReset) return;
    resetAlignMutation.mutate({ adminToken, privyDid: userToReset.privyDid });
  };
  
  const handleOverrideKycStatus = () => {
    if (!userToOverrideKyc) return;
    overrideKycMutation.mutate({ adminToken, privyDid: userToOverrideKyc.privyDid });
  };
  
  const handleCreateKycSession = () => {
    if (!userToCreateKyc) return;
    createKycMutation.mutate({ adminToken, privyDid: userToCreateKyc.privyDid });
  };
  
  const handleCreateAlignCustomer = () => {
    if (!userToCreateAlignCustomer) return;
    
    // Validate form fields
    if (!alignCustomerForm.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!alignCustomerForm.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }
    
    createAlignCustomerMutation.mutate({ 
      adminToken, 
      privyDid: userToCreateAlignCustomer.privyDid,
      firstName: alignCustomerForm.firstName.trim(),
      lastName: alignCustomerForm.lastName.trim(),
      beneficiaryType: alignCustomerForm.beneficiaryType
    });
  };
  
  const handleSyncAlign = () => {
    if (!userToSyncAlign) return;
    syncAlignMutation.mutate({ adminToken, privyDid: userToSyncAlign.privyDid });
  };
  
  const openAlignDirectDetailsDialog = (user: AdminUserDisplay) => {
    setUserForAlignDirectDetails(user); 
    setIsAlignDirectDetailsDialogOpen(true);
    // The query will be enabled by the state change. 
    // If an explicit re-fetch is needed (e.g. user clicks button again for same user):
    if (user.privyDid === userForAlignDirectDetails?.privyDid) {
        fetchAlignDirectDetailsQuery();
    } // Otherwise, the change in userForAlignDirectDetails (and thus privyDid in query key) will trigger it if dialog is open.
  };
  
  const openCreateAlignCustomerDialog = (user: AdminUserDisplay) => {
    setUserToCreateAlignCustomer({ privyDid: user.privyDid, email: user.email });
    setAlignCustomerForm({ firstName: '', lastName: '', beneficiaryType: 'individual' });
    setIsCreateAlignCustomerDialogOpen(true);
  };
  
  const formatDate = (dateInput: string | null | undefined | Date) => {
    if (!dateInput) return 'N/A';
    try {
      return format(new Date(dateInput), 'MMM d, yyyy HH:mm');
    } catch (e) {
      console.error('Error formatting date:', dateInput, e);
      return 'Invalid Date';
    }
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
          {/* Platform Stats */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Platform Funds</CardTitle>
              <CardDescription>Total USDC currently held across all user safes (live on-chain)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTotalDeposits ? (
                <div className="text-center py-4">Calculating total deposits...</div>
              ) : totalDepositsError ? (
                <div className="text-center py-4 text-red-500">
                  Error: {totalDepositsError.message}
                </div>
              ) : (
                <div className="text-3xl font-bold text-center">
                  {formattedTotalDeposited}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" size="sm" onClick={() => refetchTotalDeposits()} disabled={isLoadingTotalDeposits}>
                Refresh
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="text-center py-4">Loading users...</div>
              ) : usersError ? (
                <div className="text-center py-4 text-red-500">
                  Error loading users: {usersError.message}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Onboarding</TableHead>
                      <TableHead>DB KYC Status</TableHead>
                      <TableHead>Align Customer ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users && users.length > 0 ? (
                      users.map((user: AdminUserDisplay) => ( 
                        <TableRow key={user.privyDid}>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.businessName || 'N/A'}</TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>{user.skippedOrCompletedOnboardingStepper ? 'Complete' : 'Incomplete'}</TableCell>
                          <TableCell>{user.kycStatus || 'N/A'}</TableCell>
                          <TableCell>{user.alignCustomerId || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
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
                                      <strong> {userToDelete?.email}</strong> and all associated data including invoices and wallets.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteUser}
                                      disabled={deleteMutation.isPending}
                                    >
                                      {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog open={isResetDialogOpen && userToReset?.privyDid === user.privyDid} onOpenChange={setIsResetDialogOpen}>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                      setUserToReset({ privyDid: user.privyDid, email: user.email });
                                      setIsResetDialogOpen(true);
                                    }}
                                  >
                                    Reset Align
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Reset Align Data?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will reset the Align KYC status and remove any associated virtual account details for user
                                      <strong> {userToReset?.email}</strong>. The user will need to redo the KYC process.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setUserToReset(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleResetAlignData}
                                      disabled={resetAlignMutation.isPending}
                                      className="bg-yellow-600 hover:bg-yellow-700"
                                    >
                                      {resetAlignMutation.isPending ? 'Resetting...' : 'Confirm Reset'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog 
                                open={isOverrideKycDialogOpen && userToOverrideKyc?.privyDid === user.privyDid} 
                                onOpenChange={setIsOverrideKycDialogOpen}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-green-600 text-green-700 hover:bg-green-50"
                                    onClick={() => {
                                      setUserToOverrideKyc({ privyDid: user.privyDid, email: user.email });
                                      setIsOverrideKycDialogOpen(true);
                                    }}
                                    disabled={!user.alignCustomerId}
                                    title={!user.alignCustomerId ? "User needs Align Customer ID" : "Override KYC status from Align"}
                                  >
                                    Override KYC
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Override KYC Status from Align?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will fetch the current KYC status from Align and update the database for user <strong>{userToOverrideKyc?.email}</strong>.
                                      <br /><br />
                                      This action will override the current DB KYC status with the latest status from Align.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setUserToOverrideKyc(null)}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleOverrideKycStatus}
                                      disabled={overrideKycMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      {overrideKycMutation.isPending ? 'Updating...' : 'Override KYC Status'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog 
                                open={isAlignDirectDetailsDialogOpen && userForAlignDirectDetails?.privyDid === user.privyDid} 
                                onOpenChange={(isOpen) => {
                                  setIsAlignDirectDetailsDialogOpen(isOpen);
                                  if (!isOpen) setUserForAlignDirectDetails(null); 
                                }}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-blue-600 text-blue-700 hover:bg-blue-50"
                                    onClick={() => openAlignDirectDetailsDialog(user)}
                                  >
                                    Align Data
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Align Customer Details (Direct)</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Directly fetched KYC and customer information from Align for <strong>{userForAlignDirectDetails?.email}</strong>.
                                      <br/>DB Record - Align Customer ID: {userForAlignDirectDetails?.alignCustomerId || 'N/A'}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  
                                  <div className="py-4 space-y-3 text-sm">
                                    {isLoadingAlignDirectDetails ? (
                                      <p>Loading Align details...</p>
                                    ) : isAlignDirectDetailsError ? (
                                      <p className="text-red-500">Error: {alignDirectDetailsErrorData?.message || 'Failed to load Align details.'}</p>
                                    ) : alignDirectDetails === null && userForAlignDirectDetails ? ( // Check userForAlignDirectDetails to ensure a fetch was attempted
                                      <p className="text-gray-500">No Align customer ID found for this user, or no details returned from Align.</p>
                                    ) : alignDirectDetails ? (
                                      <>
                                        <p><strong>Align Customer ID:</strong> {alignDirectDetails.customer_id}</p>
                                        <p><strong>Align Email:</strong> {alignDirectDetails.email}</p>
                                        {alignDirectDetails.kycs ? (
                                          <>
                                            <p><strong>KYC Status (Align):</strong> <span className={`font-semibold ${alignDirectDetails.kycs.status === 'approved' ? 'text-green-600' : alignDirectDetails.kycs.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{alignDirectDetails.kycs.status || 'N/A'}</span></p>
                                            <p><strong>KYC Flow Link (Align):</strong> {alignDirectDetails.kycs.kyc_flow_link ? <a href={alignDirectDetails.kycs.kyc_flow_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open Link</a> : 'N/A'}</p>
                                          </>
                                        ) : (
                                          <p className="text-orange-500">No KYC details returned from Align for this customer.</p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-gray-500">Select a user and open dialog to fetch details.</p> 
                                    )}
                                  </div>
                                  
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {
                                        setIsAlignDirectDetailsDialogOpen(false);
                                        setUserForAlignDirectDetails(null);
                                    }}>
                                      Close
                                    </AlertDialogCancel>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog 
                                open={isCreateAlignCustomerDialogOpen && userToCreateAlignCustomer?.privyDid === user.privyDid} 
                                onOpenChange={setIsCreateAlignCustomerDialogOpen}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-orange-600 text-orange-700 hover:bg-orange-50"
                                    onClick={() => openCreateAlignCustomerDialog(user)}
                                    disabled={!!user.alignCustomerId}
                                    title={user.alignCustomerId ? "User already has Align Customer ID" : "Create Align customer for this user"}
                                  >
                                    Create Align Customer
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Create Align Customer</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Create a new Align customer for <strong>{userToCreateAlignCustomer?.email}</strong>.
                                      Please provide the required information below.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  
                                  <div className="py-4 space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="firstName">First Name *</Label>
                                      <Input
                                        id="firstName"
                                        value={alignCustomerForm.firstName}
                                        onChange={(e) => setAlignCustomerForm(prev => ({ ...prev, firstName: e.target.value }))}
                                        placeholder="Enter first name"
                                        className="w-full"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="lastName">Last Name *</Label>
                                      <Input
                                        id="lastName"
                                        value={alignCustomerForm.lastName}
                                        onChange={(e) => setAlignCustomerForm(prev => ({ ...prev, lastName: e.target.value }))}
                                        placeholder="Enter last name"
                                        className="w-full"
                                      />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Beneficiary Type</Label>
                                      <RadioGroup
                                        value={alignCustomerForm.beneficiaryType}
                                        onValueChange={(value: 'individual' | 'corporate') => 
                                          setAlignCustomerForm(prev => ({ ...prev, beneficiaryType: value }))
                                        }
                                        className="flex flex-row space-x-4"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="individual" id="individual" />
                                          <Label htmlFor="individual">Individual</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="corporate" id="corporate" />
                                          <Label htmlFor="corporate">Corporate</Label>
                                        </div>
                                      </RadioGroup>
                                    </div>
                                    
                                    <div className="text-sm text-gray-600">
                                      <p><strong>Email:</strong> {userToCreateAlignCustomer?.email}</p>
                                      <p className="text-xs mt-1">* Required fields</p>
                                    </div>
                                  </div>
                                  
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {
                                      setUserToCreateAlignCustomer(null);
                                      setAlignCustomerForm({ firstName: '', lastName: '', beneficiaryType: 'individual' });
                                    }}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleCreateAlignCustomer}
                                      disabled={createAlignCustomerMutation.isPending || !alignCustomerForm.firstName.trim() || !alignCustomerForm.lastName.trim()}
                                      className="bg-orange-600 hover:bg-orange-700"
                                    >
                                      {createAlignCustomerMutation.isPending ? 'Creating...' : 'Create Align Customer'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog 
                                open={isCreateKycDialogOpen && userToCreateKyc?.privyDid === user.privyDid} 
                                onOpenChange={setIsCreateKycDialogOpen}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-purple-600 text-purple-700 hover:bg-purple-50"
                                    onClick={() => {
                                      setUserToCreateKyc({ privyDid: user.privyDid, email: user.email });
                                      setIsCreateKycDialogOpen(true);
                                    }}
                                    disabled={!user.alignCustomerId}
                                    title={!user.alignCustomerId ? "User needs Align Customer ID" : "Create/restart KYC session"}
                                  >
                                    Create KYC
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Create KYC Session?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will create a new KYC session in Align for user <strong>{userToCreateKyc?.email}</strong>.
                                      <br /><br />
                                      If the user already has a KYC session, this will restart the process. The user will receive a new KYC flow link to complete their verification.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setUserToCreateKyc(null)}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleCreateKycSession}
                                      disabled={createKycMutation.isPending}
                                      className="bg-purple-600 hover:bg-purple-700"
                                    >
                                      {createKycMutation.isPending ? 'Creating...' : 'Create KYC Session'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              <AlertDialog 
                                open={isSyncAlignDialogOpen && userToSyncAlign?.privyDid === user.privyDid} 
                                onOpenChange={setIsSyncAlignDialogOpen}
                              >
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-cyan-600 text-cyan-700 hover:bg-cyan-50"
                                    onClick={() => {
                                      setUserToSyncAlign({ privyDid: user.privyDid, email: user.email });
                                      setIsSyncAlignDialogOpen(true);
                                    }}
                                    title="Sync user data with Align&apos;s remote information"
                                  >
                                    Sync Align
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Sync with Align?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will sync user <strong>{userToSyncAlign?.email}</strong> with Align&apos;s remote information.
                                      <br /><br />
                                      This action will:
                                      <ul className="list-disc list-inside mt-2 space-y-1">
                                        <li>Search for the customer in Align by email if no customer ID exists</li>
                                        <li>Update the customer ID if found</li>
                                        <li>Sync the KYC status from Align</li>
                                        <li>Update the KYC flow link if available</li>
                                      </ul>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setUserToSyncAlign(null)}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleSyncAlign}
                                      disabled={syncAlignMutation.isPending}
                                      className="bg-cyan-600 hover:bg-cyan-700"
                                    >
                                      {syncAlignMutation.isPending ? 'Syncing...' : 'Sync with Align'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No users found or token invalid.
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
                  setUserForAlignDirectDetails(null); 
                }}
              >
                Log Out
              </Button>
              <Button
                onClick={() => refetchUsers()} 
                disabled={isLoadingUsers} 
              >
                Refresh Users
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
} 