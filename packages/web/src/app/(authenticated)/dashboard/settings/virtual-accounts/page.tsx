import { Metadata } from 'next';
import { VirtualAccountsDisplay } from '@/components/settings/align-integration/virtual-accounts-display';

export const metadata: Metadata = {
  title: 'Virtual Bank Accounts | Settings',
  description: 'Manage your virtual bank accounts for receiving payments',
};

export default function VirtualAccountsPage() {
  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Virtual Bank Accounts</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your virtual bank accounts for receiving fiat payments that automatically convert to crypto.
        </p>
      </div>
      
      <VirtualAccountsDisplay />
    </div>
  );
}