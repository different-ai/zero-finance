'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { PlusIcon, PencilIcon, TrashIcon, BanknoteIcon, CheckCircleIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { RouterOutputs } from '@/utils/trpc';
import { AddBankAccountForm, type AddBankAccountFormValues } from './add-bank-account-form';

// Infer type using RouterOutputs
type DestinationBankAccountListItem = RouterOutputs['settings']['bankAccounts']['listBankAccounts'][number];
// Type for the full details fetched for editing (includes fields masked in the list)
type FullDestinationBankAccount = RouterOutputs['settings']['bankAccounts']['getBankAccountDetails'];

// Define subset of values for update form (matching update schema)
type UpdateBankAccountFormValues = Pick<AddBankAccountFormValues, 'accountName' | 'bankName' | 'isDefault'>;

export default function BankAccountSettings() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // Store the ID of the account being edited/fetched
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  // Store the fully fetched account details for the form
  const [fetchedAccountDetails, setFetchedAccountDetails] = useState<FullDestinationBankAccount | null>(null);
  // State for Delete Confirmation Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const [deletingAccountName, setDeletingAccountName] = useState<string | null>(null);

  const utils = api.useUtils();
  const { 
    data: bankAccounts,
    isLoading: isLoadingAccounts,
    error: accountsError 
  } = api.settings.bankAccounts.listBankAccounts.useQuery();

  // Query to fetch full details when editingAccountId is set
  const { 
      data: queryResultFetchedDetails,
      isLoading: isLoadingDetails, 
      error: detailsError 
  } = api.settings.bankAccounts.getBankAccountDetails.useQuery(
      { accountId: editingAccountId! }, // Ensure accountId is not null
      { enabled: !!editingAccountId } // Only run query when editingAccountId is set
  );

  // Effect to update state when details are fetched
  useEffect(() => {
      if (queryResultFetchedDetails) {
          setFetchedAccountDetails(queryResultFetchedDetails);
          setIsEditDialogOpen(true); // Open dialog once details are fetched
      } else if (detailsError) {
          toast.error("Failed to load account details for editing.", { description: detailsError.message });
          setEditingAccountId(null); // Reset on error
      }
  }, [queryResultFetchedDetails, detailsError]);

  // Add Bank Account Mutation
  const addMutation = api.settings.bankAccounts.addBankAccount.useMutation({
    async onSuccess() {
      toast.success('Bank account added successfully!');
      await utils.settings.bankAccounts.listBankAccounts.invalidate();
      setIsAddDialogOpen(false); // Close dialog on success
    },
    onError(error) {
      toast.error('Failed to add bank account', {
        description: error.message,
      });
    },
  });

  // Update Bank Account Mutation
  const updateMutation = api.settings.bankAccounts.updateBankAccount.useMutation({
      async onSuccess(data) {
          toast.success(`Bank account "${data.accountName}" updated successfully!`);
          await utils.settings.bankAccounts.listBankAccounts.invalidate();
          closeEditDialog();
      },
      onError(error) {
          toast.error('Failed to update bank account', {
              description: error.message,
          });
      },
  });

  // Delete Bank Account Mutation
  const deleteMutation = api.settings.bankAccounts.deleteBankAccount.useMutation({
    async onSuccess(data, variables) {
      toast.success(`Bank account "${deletingAccountName ?? variables.accountId}" deleted successfully!`);
      await utils.settings.bankAccounts.listBankAccounts.invalidate();
      closeDeleteDialog();
    },
    onError(error) {
      toast.error('Failed to delete bank account', {
        description: error.message,
      });
    },
  });

  const handleAddFormSubmit = async (values: AddBankAccountFormValues) => {
    await addMutation.mutateAsync(values);
  };

  // Set the ID to trigger the details query
  const handleEditAccountClick = (account: DestinationBankAccountListItem) => {
    setFetchedAccountDetails(null); // Clear previous details
    setEditingAccountId(account.id);
    // Dialog will open via useEffect when data arrives
  };

  // Close edit dialog and clear state
  const closeEditDialog = () => {
      setIsEditDialogOpen(false);
      setEditingAccountId(null);
      setFetchedAccountDetails(null);
  }

  // Submit using the correct types
  const handleEditFormSubmit = async (values: UpdateBankAccountFormValues) => {
      if (!editingAccountId) return;
      await updateMutation.mutateAsync({
          accountId: editingAccountId,
          ...values 
      });
  };

  // Open delete confirmation dialog
  const handleDeleteAccountClick = (accountId: string, accountName: string) => {
    setDeletingAccountId(accountId);
    setDeletingAccountName(accountName);
    setIsDeleteDialogOpen(true);
  };

  // Close delete dialog and clear state
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingAccountId(null);
    setDeletingAccountName(null);
  };

  // Handle confirmed deletion
  const handleConfirmDelete = async () => {
    if (!deletingAccountId) return;
    await deleteMutation.mutateAsync({ accountId: deletingAccountId });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Saved Accounts</CardTitle>
          <CardDescription>Your saved bank accounts for withdrawals.</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
             <Button size="sm">
               <PlusIcon className="mr-2 h-4 w-4" /> Add Account
             </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Destination Bank Account</DialogTitle>
              <DialogDescription>
Enter the details of the bank account where you want to receive funds.
              </DialogDescription>
            </DialogHeader>
            <AddBankAccountForm 
              onSubmit={handleAddFormSubmit}
              isSubmitting={addMutation.isPending}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoadingAccounts && (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {accountsError && (
          <Alert variant="destructive">
            <AlertTitle>Error Loading Accounts</AlertTitle>
            <AlertDescription>{accountsError.message}</AlertDescription>
          </Alert>
        )}
        {!isLoadingAccounts && !accountsError && bankAccounts && (
          <div className="space-y-4">
            {bankAccounts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                You haven&apos;t added any destination bank accounts yet.
              </p>
            )}
            {bankAccounts.map((account: DestinationBankAccountListItem) => (
              <div 
                key={account.id} 
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center space-x-4">
                    <BanknoteIcon className="h-6 w-6 text-muted-foreground" />
                    <div>
                        <p className="font-medium flex items-center">
                            {account.accountName}
                            {account.isDefault && (
                                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    <CheckCircleIcon className="-ml-0.5 mr-1 h-3 w-3 text-green-600" />
                                    Default
                                </span>
                            )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {account.bankName} ({account.country})
                            {' - '}
                            {account.accountType === 'us' && account.maskedAccountNumber}
                            {account.accountType === 'iban' && account.maskedIbanNumber}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditAccountClick(account)}
                    disabled={isLoadingDetails && editingAccountId === account.id} // Disable while loading details
                  >
                    {isLoadingDetails && editingAccountId === account.id 
                        ? <Loader2 className="h-4 w-4 animate-spin" /> 
                        : <PencilIcon className="h-4 w-4" />}
                    <span className="sr-only">Edit Account</span>
                  </Button>
                  <AlertDialog open={isDeleteDialogOpen && deletingAccountId === account.id} onOpenChange={(open) => !open && closeDeleteDialog()}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteAccountClick(account.id, account.accountName)}
                        disabled={deleteMutation.isPending && deletingAccountId === account.id}
                      >
                        {deleteMutation.isPending && deletingAccountId === account.id 
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : <TrashIcon className="h-4 w-4" /> }
                        <span className="sr-only">Delete Account</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the bank account 
                          &quot;{deletingAccountName}&quot;.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
                          {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                          Yes, delete account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Account Dialog - Opens via state change in useEffect */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && closeEditDialog()}> {/* Close handler */} 
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Bank Account</DialogTitle>
              {/* Use fetched details for title if available */}
              <DialogDescription>
                Update the details for &quot;{fetchedAccountDetails?.accountName ?? '...'}&quot;.
              </DialogDescription>
            </DialogHeader>
            {/* Show loader while details are loading */}
            {isLoadingDetails && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/></div>}
            {/* Show form only when details are fetched */}
            {!isLoadingDetails && fetchedAccountDetails && (
               <AddBankAccountForm 
                 key={fetchedAccountDetails.id} 
                 onSubmit={async (values) => { 
                     const updateValues: UpdateBankAccountFormValues = {
                         accountName: values.accountName,
                         bankName: values.bankName, 
                         isDefault: values.isDefault,
                     };
                     await handleEditFormSubmit(updateValues);
                 }}
                 isSubmitting={updateMutation.isPending}
                 onCancel={closeEditDialog} // Use close handler
                 initialValues={{
                     ...fetchedAccountDetails,
                     // Ensure form receives values expected by its schema
                     accountName: fetchedAccountDetails.accountName ?? '',
                     bankName: fetchedAccountDetails.bankName ?? '',
                     accountHolderType: fetchedAccountDetails.accountHolderType,
                     accountHolderFirstName: fetchedAccountDetails.accountHolderFirstName ?? undefined,
                     accountHolderLastName: fetchedAccountDetails.accountHolderLastName ?? undefined,
                     accountHolderBusinessName: fetchedAccountDetails.accountHolderBusinessName ?? undefined,
                     country: fetchedAccountDetails.country ?? '',
                     city: fetchedAccountDetails.city ?? '',
                     streetLine1: fetchedAccountDetails.streetLine1 ?? '',
                     streetLine2: fetchedAccountDetails.streetLine2 ?? undefined,
                     postalCode: fetchedAccountDetails.postalCode ?? '',
                     accountType: fetchedAccountDetails.accountType,
                     isDefault: fetchedAccountDetails.isDefault ?? false,
                     // Pass masked values from getDetails for editing (or handle separately)
                     accountNumber: fetchedAccountDetails.accountNumber ?? undefined, 
                     routingNumber: fetchedAccountDetails.routingNumber ?? undefined,
                     ibanNumber: fetchedAccountDetails.ibanNumber ?? undefined,
                     bicSwift: fetchedAccountDetails.bicSwift ?? undefined,
                 }}
               />
            )}
          </DialogContent>
        </Dialog>
    </Card>
  );
} 