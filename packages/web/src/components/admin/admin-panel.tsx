'use client';

import { useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatDisplayCurrency } from '@/lib/utils';
import {
  Search,
  TrendingUp,
  Users,
  Wallet,
  RefreshCw,
  UserPlus,
  Shield,
  Activity,
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
}

interface AlignDirectDetailsType {
  customer_id: string;
  email: string;
  kycs: {
    status: 'pending' | 'approved' | 'rejected' | null;
    sub_status?:
      | 'kyc_form_submission_started'
      | 'kyc_form_submission_accepted'
      | 'kyc_form_resubmission_required'
      | null;
    kyc_flow_link: string | null;
  } | null;
}

export default function AdminPanel() {
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [selectedUserPrivyDid, setSelectedUserPrivyDid] = useState<
    string | null
  >(null);

  const [userToDelete, setUserToDelete] = useState<{
    privyDid: string;
    email: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToReset, setUserToReset] = useState<{
    privyDid: string;
    email: string;
  } | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const [userForAlignDirectDetails, setUserForAlignDirectDetails] =
    useState<AdminUserDisplay | null>(null);
  const [isAlignDirectDetailsDialogOpen, setIsAlignDirectDetailsDialogOpen] =
    useState(false);

  const [userToOverrideKyc, setUserToOverrideKyc] = useState<{
    privyDid: string;
    email: string;
  } | null>(null);
  const [isOverrideKycDialogOpen, setIsOverrideKycDialogOpen] = useState(false);

  const [userToCreateKyc, setUserToCreateKyc] = useState<{
    privyDid: string;
    email: string;
  } | null>(null);
  const [isCreateKycDialogOpen, setIsCreateKycDialogOpen] = useState(false);

  const [userToCreateAlignCustomer, setUserToCreateAlignCustomer] = useState<{
    privyDid: string;
    email: string;
  } | null>(null);
  const [isCreateAlignCustomerDialogOpen, setIsCreateAlignCustomerDialogOpen] =
    useState(false);

  const [alignCustomerForm, setAlignCustomerForm] = useState({
    firstName: '',
    lastName: '',
    beneficiaryType: 'individual' as 'individual' | 'corporate',
  });

  const [userToSyncAlign, setUserToSyncAlign] = useState<{
    privyDid: string;
    email: string;
  } | null>(null);
  const [isSyncAlignDialogOpen, setIsSyncAlignDialogOpen] = useState(false);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = api.admin.listUsers.useQuery(undefined, {
    retry: false,
  });

  const {
    data: totalDepositedData,
    isLoading: isLoadingTotalDeposits,
    error: totalDepositsError,
    refetch: refetchTotalDeposits,
  } = api.admin.getTotalDeposited.useQuery(undefined, {
    retry: false,
  });

  const { data: userDepositData, isLoading: isLoadingUserDeposit } =
    api.admin.getUserDepositBreakdown.useQuery(
      { privyDid: selectedUserPrivyDid ?? '' },
      {
        enabled: !!selectedUserPrivyDid,
        retry: false,
      },
    );

  const {
    data: adminsList,
    isLoading: isLoadingAdmins,
    refetch: refetchAdmins,
  } = api.admin.listAdmins.useQuery(undefined, {
    retry: false,
  });

  const formattedTotalDeposited = totalDepositedData?.totalDeposited
    ? formatDisplayCurrency(totalDepositedData.totalDeposited, 'USDC', 'base')
    : 'N/A';

  const formattedInSafes = totalDepositedData?.breakdown?.inSafes
    ? formatDisplayCurrency(
        totalDepositedData.breakdown.inSafes,
        'USDC',
        'base',
      )
    : 'N/A';

  const formattedInVaults = totalDepositedData?.breakdown?.inVaults
    ? formatDisplayCurrency(
        totalDepositedData.breakdown.inVaults,
        'USDC',
        'base',
      )
    : 'N/A';

  const users: AdminUserDisplay[] | undefined = usersData as
    | AdminUserDisplay[]
    | undefined;

  const {
    data: alignDirectDetailsData,
    isLoading: isLoadingAlignDirectDetails,
    isError: isAlignDirectDetailsError,
    error: alignDirectDetailsErrorData,
    refetch: fetchAlignDirectDetailsQuery,
  } = api.admin.getAlignCustomerDirectDetails.useQuery(
    {
      privyDid: userForAlignDirectDetails?.privyDid ?? '',
    },
    {
      enabled:
        !!userForAlignDirectDetails?.privyDid && isAlignDirectDetailsDialogOpen,
      retry: false,
    },
  );

  const alignDirectDetails: AlignDirectDetailsType | null | undefined =
    alignDirectDetailsData;

  const deleteMutation = api.admin.deleteUser.useMutation({
    onSuccess: () => {
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      refetchUsers();
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
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
    },
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
    },
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
    },
  });

  const createAlignCustomerMutation = api.admin.createAlignCustomer.useMutation(
    {
      onSuccess: (data) => {
        setIsCreateAlignCustomerDialogOpen(false);
        setUserToCreateAlignCustomer(null);
        setAlignCustomerForm({
          firstName: '',
          lastName: '',
          beneficiaryType: 'individual',
        });
        toast.success(data.message);
        refetchUsers();
      },
      onError: (error) => {
        toast.error(`Failed to create Align customer: ${error.message}`);
      },
    },
  );

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
    },
  });

  const addAdminMutation = api.admin.addAdmin.useMutation({
    onSuccess: () => {
      setIsAddAdminDialogOpen(false);
      setNewAdminEmail('');
      toast.success('Admin added successfully');
      refetchAdmins();
    },
    onError: (error) => {
      toast.error(`Failed to add admin: ${error.message}`);
    },
  });

  const removeAdminMutation = api.admin.removeAdmin.useMutation({
    onSuccess: () => {
      toast.success('Admin removed successfully');
      refetchAdmins();
    },
    onError: (error) => {
      toast.error(`Failed to remove admin: ${error.message}`);
    },
  });

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteMutation.mutate({ privyDid: userToDelete.privyDid });
  };

  const handleResetAlignData = () => {
    if (!userToReset) return;
    resetAlignMutation.mutate({ privyDid: userToReset.privyDid });
  };

  const handleOverrideKycStatus = () => {
    if (!userToOverrideKyc) return;
    overrideKycMutation.mutate({
      privyDid: userToOverrideKyc.privyDid,
    });
  };

  const handleCreateKycSession = () => {
    if (!userToCreateKyc) return;
    createKycMutation.mutate({
      privyDid: userToCreateKyc.privyDid,
    });
  };

  const handleCreateAlignCustomer = () => {
    if (!userToCreateAlignCustomer) return;

    if (!alignCustomerForm.firstName.trim()) {
      toast.error('First name is required');
      return;
    }
    if (!alignCustomerForm.lastName.trim()) {
      toast.error('Last name is required');
      return;
    }

    createAlignCustomerMutation.mutate({
      privyDid: userToCreateAlignCustomer.privyDid,
      firstName: alignCustomerForm.firstName.trim(),
      lastName: alignCustomerForm.lastName.trim(),
      beneficiaryType: alignCustomerForm.beneficiaryType,
    });
  };

  const handleSyncAlign = () => {
    if (!userToSyncAlign) return;
    syncAlignMutation.mutate({
      privyDid: userToSyncAlign.privyDid,
    });
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    addAdminMutation.mutate({ email: newAdminEmail.trim() });
  };

  const openAlignDirectDetailsDialog = (user: AdminUserDisplay) => {
    setUserForAlignDirectDetails(user);
    setIsAlignDirectDetailsDialogOpen(true);
    if (user.privyDid === userForAlignDirectDetails?.privyDid) {
      fetchAlignDirectDetailsQuery();
    }
  };

  const openCreateAlignCustomerDialog = (user: AdminUserDisplay) => {
    setUserToCreateAlignCustomer({
      privyDid: user.privyDid,
      email: user.email,
    });
    setAlignCustomerForm({
      firstName: '',
      lastName: '',
      beneficiaryType: 'individual',
    });
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

  const filteredUsers = users?.filter(
    (user) =>
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.businessName
        ?.toLowerCase()
        .includes(userSearchQuery.toLowerCase()) ||
      user.privyDid.toLowerCase().includes(userSearchQuery.toLowerCase()),
  );

  const filteredAdmins = adminsList?.filter(
    (admin) =>
      admin.email?.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      admin.privyDid.toLowerCase().includes(adminSearchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">



      

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Admin Access Control</CardTitle>
              <CardDescription>
                Manage users with admin panel access
              </CardDescription>
            </div>
            <AlertDialog
              open={isAddAdminDialogOpen}
              onOpenChange={setIsAddAdminDialogOpen}
            >
              <AlertDialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Admin
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Add New Admin</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter the email address of the user you want to grant admin
                    access to.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Input
                    placeholder="admin@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setNewAdminEmail('')}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAddAdmin}
                    disabled={addAdminMutation.isPending}
                  >
                    {addAdminMutation.isPending ? 'Adding...' : 'Add Admin'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admins..."
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {isLoadingAdmins ? (
            <div className="text-center py-8 text-gray-500">
              Loading admins...
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAdmins?.map((admin) => (
                <div
                  key={admin.privyDid}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{admin.email || 'N/A'}</p>
                      <p className="text-sm text-gray-500">
                        Added {formatDate(admin.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      removeAdminMutation.mutate({ privyDid: admin.privyDid })
                    }
                    disabled={removeAdminMutation.isPending}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {filteredAdmins?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No admins found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage platform users</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchUsers();
                refetchTotalDeposits();
              }}
              disabled={isLoadingUsers}
              className="gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoadingUsers ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email, business name, or ID..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoadingUsers ? (
            <div className="text-center py-8 text-gray-500">
              Loading users...
            </div>
          ) : usersError ? (
            <div className="text-center py-8 text-red-500">
              Error loading users: {usersError.message}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Deposits</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>Align Customer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user: AdminUserDisplay) => (
                      <TableRow
                        key={user.privyDid}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedUserPrivyDid(user.privyDid)}
                      >
                        <TableCell className="font-medium">
                          {user.email}
                        </TableCell>
                        <TableCell>{user.businessName || 'N/A'}</TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          {selectedUserPrivyDid === user.privyDid &&
                          userDepositData ? (
                            <div className="text-sm">
                              <p className="font-semibold text-green-600">
                                {formatDisplayCurrency(
                                  userDepositData.totalDeposited,
                                  'USDC',
                                  'base',
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {userDepositData.breakdown.depositCount}{' '}
                                deposits
                              </p>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUserPrivyDid(user.privyDid);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div
                              className={`font-medium text-sm ${
                                user.kycStatus === 'approved'
                                  ? 'text-green-600'
                                  : user.kycStatus === 'rejected'
                                    ? 'text-red-600'
                                    : user.kycStatus === 'pending'
                                      ? 'text-yellow-600'
                                      : ''
                              }`}
                            >
                              {user.kycStatus || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.alignCustomerId ? (
                            <span className="text-green-600 text-sm">✓</span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-wrap gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAlignDirectDetailsDialog(user)}
                            >
                              Details
                            </Button>

                            <AlertDialog
                              open={
                                isDeleteDialogOpen &&
                                userToDelete?.privyDid === user.privyDid
                              }
                              onOpenChange={setIsDeleteDialogOpen}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    setUserToDelete({
                                      privyDid: user.privyDid,
                                      email: user.email,
                                    });
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the user
                                    <strong> {userToDelete?.email}</strong> and
                                    all associated data including invoices and
                                    wallets.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setUserToDelete(null)}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteUser}
                                    disabled={deleteMutation.isPending}
                                  >
                                    {deleteMutation.isPending
                                      ? 'Deleting...'
                                      : 'Delete User'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog
                              open={
                                isResetDialogOpen &&
                                userToReset?.privyDid === user.privyDid
                              }
                              onOpenChange={setIsResetDialogOpen}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setUserToReset({
                                      privyDid: user.privyDid,
                                      email: user.email,
                                    });
                                    setIsResetDialogOpen(true);
                                  }}
                                >
                                  Reset Align
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Reset Align Data?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will reset the Align KYC status and
                                    remove any associated virtual account
                                    details for user
                                    <strong> {userToReset?.email}</strong>. The
                                    user will need to redo the KYC process.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    onClick={() => setUserToReset(null)}
                                  >
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleResetAlignData}
                                    disabled={resetAlignMutation.isPending}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                  >
                                    {resetAlignMutation.isPending
                                      ? 'Resetting...'
                                      : 'Confirm Reset'}
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
                      <TableCell colSpan={7} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={isAlignDirectDetailsDialogOpen}
        onOpenChange={(isOpen) => {
          setIsAlignDirectDetailsDialogOpen(isOpen);
          if (!isOpen) setUserForAlignDirectDetails(null);
        }}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Align Customer Details</AlertDialogTitle>
            <AlertDialogDescription>
              Direct information from Align for{' '}
              <strong>{userForAlignDirectDetails?.email}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-3 text-sm max-h-96 overflow-y-auto">
            {isLoadingAlignDirectDetails ? (
              <p>Loading Align details...</p>
            ) : isAlignDirectDetailsError ? (
              <p className="text-red-500">
                Error:{' '}
                {alignDirectDetailsErrorData?.message || 'Failed to load'}
              </p>
            ) : alignDirectDetails === null ? (
              <p className="text-gray-500">No Align customer data available</p>
            ) : alignDirectDetails ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Customer ID</p>
                    <p className="font-medium">
                      {alignDirectDetails.customer_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium">{alignDirectDetails.email}</p>
                  </div>
                </div>

                {alignDirectDetails.kycs && (
                  <div className="border-t pt-3 mt-3">
                    <p className="text-xs text-gray-500 mb-2">KYC Status</p>
                    <p
                      className={`text-lg font-semibold ${
                        alignDirectDetails.kycs.status === 'approved'
                          ? 'text-green-600'
                          : alignDirectDetails.kycs.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {alignDirectDetails.kycs.status || 'N/A'}
                    </p>
                    {alignDirectDetails.kycs.kyc_flow_link && (
                      <a
                        href={alignDirectDetails.kycs.kyc_flow_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                      >
                        Open KYC Flow →
                      </a>
                    )}
                  </div>
                )}

                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-gray-500 mb-2">Raw JSON</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify(alignDirectDetails, null, 2)}
                  </pre>
                </div>
              </>
            ) : null}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
