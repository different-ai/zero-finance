'use client'; // Make this a client component

import { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { AlignKycStatus, AlignVirtualAccountRequestForm, AlignAccountDisplay } from '@/components/settings/align-integration';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react'; // Added Loader2
import { api } from '@/trpc/react'; // Added for tRPC hook

// metadata export is fine in client components for now, though Next.js might change this.
// If issues arise, it can be moved to a layout.tsx or generateMetadata function.
export const metadata: Metadata = {
  title: 'Virtual Bank Account - Hypr',
  description: 'Set up a virtual bank account with Align to receive fiat payments and convert to crypto',
};

export default function AlignAccountPage() {
  const { data: kycData, isLoading: kycIsLoading } = api.align.getCustomerStatus.useQuery();
  const isKycApproved = kycData?.kycStatus === 'approved';

  return (
    <div className="container max-w-6xl pb-12">
      <PageHeader
        title="Virtual Bank Accounts"
        description="Manage your virtual bank accounts or set up a new one to receive payments."
      />

      <div className="mt-8">
        {kycIsLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!kycIsLoading && !isKycApproved && (
          <Alert variant="default" className="mb-6 border-blue-200 bg-blue-50 text-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Identity Verification Required</AlertTitle>
            <AlertDescription className="text-blue-700">
              To set up a virtual bank account for receiving fiat payments (USD/EUR), we need to verify your identity (KYC - Know Your Customer). This is a standard security measure. Please follow the steps below.
            </AlertDescription>
          </Alert>
        )}

        {/* KYC Status first - always visible, or conditionally if preferred after loading */}
        {/* If kycData is needed by AlignKycStatus, consider passing it as a prop if AlignKycStatus itself doesn't fetch */}
        <AlignKycStatus />

        {/* Display existing accounts and the form to request new ones sequentially */}
        {/* The form itself also checks for KYC status internally, which is fine */}
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