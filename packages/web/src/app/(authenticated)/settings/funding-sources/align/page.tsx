import { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { AlignKycStatus, AlignVirtualAccountRequestForm, AlignAccountDisplay } from '@/components/settings/align-integration';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Virtual Bank Account - Hypr',
  description: 'Set up a virtual bank account with Align to receive fiat payments and convert to crypto',
};

export default function AlignAccountPage() {
  return (
    <div className="container max-w-6xl pb-12">
      <PageHeader
        title="Virtual Bank Accounts"
        description="Manage your virtual bank accounts or set up a new one to receive payments."
      />

      <div className="mt-8">
        <Alert variant="default" className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-900">Identity Verification Required</AlertTitle>
          <AlertDescription className="text-blue-700">
            To set up a virtual bank account for receiving fiat payments (USD/EUR), we need to verify your identity (KYC - Know Your Customer). This is a standard security measure. Please follow the steps below.
          </AlertDescription>
        </Alert>

        {/* KYC Status first - always visible */}
        <AlignKycStatus />

        {/* Display existing accounts and the form to request new ones sequentially */}
        <div className="mt-8 space-y-8">
          <div>
            <AlignVirtualAccountRequestForm />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Your Virtual Accounts</h2>
            <AlignAccountDisplay />
          </div>
        </div>
      </div>
    </div>
  );
} 