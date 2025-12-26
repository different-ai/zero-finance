'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, CreditCard, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function SavedBankAccounts() {
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);

  const {
    data: bankAccounts,
    isLoading,
    refetch,
  } = api.settings.bankAccounts.listBankAccounts.useQuery();

  const deleteMutation =
    api.settings.bankAccounts.deleteBankAccount.useMutation({
      onSuccess: () => {
        toast.success('Bank account deleted');
        refetch();
        setDeleteAccountId(null);
      },
      onError: (error) => {
        toast.error('Failed to delete bank account', {
          description: error.message,
        });
      },
    });

  const handleDelete = (accountId: string) => {
    deleteMutation.mutate({ accountId });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#101010]/40" />
      </div>
    );
  }

  if (!bankAccounts || bankAccounts.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="h-10 w-10 text-[#101010]/20 mx-auto mb-3" />
        <p className="text-[14px] text-[#101010]/60">
          No saved bank accounts yet
        </p>
        <p className="text-[12px] text-[#101010]/40 mt-1">
          Bank accounts are saved when you make a transfer and choose to save
          the details
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {bankAccounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-[#F7F7F2] rounded-lg border border-[#101010]/5"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#101010]/10">
                <CreditCard className="h-5 w-5 text-[#101010]/60" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#101010]">
                  {account.accountName}
                </p>
                <p className="text-[12px] text-[#101010]/60">
                  {account.bankName} &middot;{' '}
                  {account.accountType === 'us' ? 'ACH' : 'IBAN'} &middot;{' '}
                  {account.maskedAccountNumber || account.maskedIbanNumber}
                </p>
                <p className="text-[11px] text-[#101010]/40 mt-0.5">
                  {account.accountHolderType === 'individual'
                    ? `${account.accountHolderFirstName} ${account.accountHolderLastName}`
                    : account.accountHolderBusinessName}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#101010]/40 hover:text-red-600 hover:bg-red-50"
              onClick={() => setDeleteAccountId(account.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!deleteAccountId}
        onOpenChange={(open) => !open && setDeleteAccountId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bank account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the saved bank account from your list. You can
              always add it again later when making a transfer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccountId && handleDelete(deleteAccountId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
