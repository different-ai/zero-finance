import React from 'react';
// import { Separator } from '@/components/ui/separator';
import { Separator } from '@/components/ui/separator';
import BankAccountSettings from '@/components/settings/bank-account-settings';
import { PageHeader } from '@/components/layout/page-header';
// import BankAccountSettings from '@/components/settings/bank-account-settings';

export default function BankAccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Destination Bank Accounts"
        description="Manage your bank accounts for receiving fiat withdrawals (off-ramp)."
      />
      <Separator />
      <BankAccountSettings />
    </div>
  );
}
