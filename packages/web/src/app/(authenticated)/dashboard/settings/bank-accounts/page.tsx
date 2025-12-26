'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import {
  Trash2,
  CreditCard,
  Loader2,
  Building2,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useBimodal } from '@/components/ui/bimodal';

export default function BankAccountsPage() {
  const router = useRouter();
  const { isTechnical } = useBimodal();
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

  return (
    <div
      className={cn(
        'min-h-screen',
        isTechnical ? 'bg-[#F8F9FA]' : 'bg-[#F7F7F2]',
      )}
    >
      {/* Header */}
      <header
        className={cn(
          'sticky top-0 z-40 border-b',
          isTechnical
            ? 'bg-[#F8F9FA] border-[#1B29FF]/20'
            : 'bg-[#F7F7F2] border-[#101010]/10',
        )}
      >
        <div className="h-[60px] flex items-center px-4 sm:px-6 max-w-[1400px] mx-auto mt-1">
          <button
            onClick={() => router.push('/dashboard/settings')}
            className={cn(
              'mr-4 p-2 -ml-2 rounded-lg transition-colors',
              isTechnical
                ? 'hover:bg-[#1B29FF]/10 text-[#1B29FF]'
                : 'hover:bg-[#101010]/5 text-[#101010]/60',
            )}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p
              className={cn(
                'uppercase tracking-[0.14em] text-[11px]',
                isTechnical ? 'text-[#1B29FF] font-mono' : 'text-[#101010]/60',
              )}
            >
              {isTechnical ? 'SETTINGS::BANK' : 'Settings'}
            </p>
            <h1
              className={cn(
                'leading-[1] text-[#101010]',
                isTechnical
                  ? 'font-mono text-[20px] sm:text-[24px]'
                  : 'font-serif text-[22px] sm:text-[26px]',
              )}
            >
              {isTechnical ? 'Bank Accounts' : 'Saved Bank Accounts'}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-6 sm:py-8 max-w-[1400px] mx-auto">
        <div
          className={cn(
            'p-5 sm:p-6',
            isTechnical
              ? 'bg-white border border-[#1B29FF]/20'
              : 'bg-white border border-[#101010]/10 rounded-lg',
          )}
        >
          <div className="flex items-start gap-3 mb-6">
            <Building2
              className={cn(
                'h-5 w-5 mt-1 flex-shrink-0',
                isTechnical ? 'text-[#1B29FF]' : 'text-[#0050ff]',
              )}
            />
            <div>
              <h2
                className={cn(
                  'text-[15px] sm:text-[16px] font-medium text-[#101010]',
                  isTechnical && 'font-mono',
                )}
              >
                {isTechnical
                  ? 'Recipient Accounts'
                  : 'Manage Saved Bank Accounts'}
              </h2>
              <p
                className={cn(
                  'mt-1 text-[13px]',
                  isTechnical
                    ? 'text-[#101010]/60 font-mono'
                    : 'text-[#101010]/60',
                )}
              >
                {isTechnical
                  ? 'View and remove saved recipient accounts used for off-ramp transfers'
                  : "These are bank accounts you've saved when making transfers. You can delete any account you no longer need."}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#101010]/40" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!bankAccounts || bankAccounts.length === 0) && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-[#101010]/20 mx-auto mb-4" />
              <p
                className={cn(
                  'text-[15px] text-[#101010]/60',
                  isTechnical && 'font-mono',
                )}
              >
                No saved bank accounts
              </p>
              <p
                className={cn(
                  'text-[13px] text-[#101010]/40 mt-2 max-w-md mx-auto',
                  isTechnical && 'font-mono',
                )}
              >
                {isTechnical
                  ? 'Bank accounts are persisted when executing off-ramp transfers with save option enabled'
                  : 'Bank accounts are saved when you make a transfer and choose to save the details for future use'}
              </p>
            </div>
          )}

          {/* Bank Accounts List */}
          {!isLoading && bankAccounts && bankAccounts.length > 0 && (
            <div className="space-y-3">
              {bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className={cn(
                    'flex items-center justify-between p-4 rounded-lg border',
                    isTechnical
                      ? 'bg-[#F8F9FA] border-[#1B29FF]/10'
                      : 'bg-[#F7F7F2] border-[#101010]/5',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center border',
                        isTechnical
                          ? 'bg-white border-[#1B29FF]/20'
                          : 'bg-white border-[#101010]/10',
                      )}
                    >
                      <CreditCard
                        className={cn(
                          'h-5 w-5',
                          isTechnical
                            ? 'text-[#1B29FF]/60'
                            : 'text-[#101010]/60',
                        )}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-[14px] font-medium text-[#101010]',
                          isTechnical && 'font-mono',
                        )}
                      >
                        {account.accountName}
                      </p>
                      <p
                        className={cn(
                          'text-[12px] text-[#101010]/60',
                          isTechnical && 'font-mono',
                        )}
                      >
                        {account.bankName} &middot;{' '}
                        {account.accountType === 'us' ? 'ACH' : 'IBAN'} &middot;{' '}
                        {account.maskedAccountNumber ||
                          account.maskedIbanNumber}
                      </p>
                      <p
                        className={cn(
                          'text-[11px] text-[#101010]/40 mt-0.5',
                          isTechnical && 'font-mono',
                        )}
                      >
                        {account.accountHolderType === 'individual'
                          ? `${account.accountHolderFirstName} ${account.accountHolderLastName}`
                          : account.accountHolderBusinessName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'hover:bg-red-50',
                      isTechnical
                        ? 'text-[#1B29FF]/40 hover:text-red-600'
                        : 'text-[#101010]/40 hover:text-red-600',
                    )}
                    onClick={() => setDeleteAccountId(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteAccountId}
        onOpenChange={(open) => !open && setDeleteAccountId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={cn(isTechnical && 'font-mono')}>
              {isTechnical ? 'Delete bank account?' : 'Delete bank account?'}
            </AlertDialogTitle>
            <AlertDialogDescription className={cn(isTechnical && 'font-mono')}>
              {isTechnical
                ? 'This will remove the saved account from your workspace. You can add it again during a future transfer.'
                : 'This will remove the saved bank account from your list. You can always add it again later when making a transfer.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={cn(isTechnical && 'font-mono')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteAccountId && handleDelete(deleteAccountId)}
              className={cn(
                'bg-red-600 hover:bg-red-700',
                isTechnical && 'font-mono',
              )}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
