import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/page-header';
import { AlignKycStatus, AlignVirtualAccountRequestForm, AlignAccountDisplay } from '@/components/settings/align-integration';
import { Alert, AlertCircle, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Virtual Bank Account - Hypr',
  description: 'Set up a virtual bank account with Align to receive fiat payments and convert to crypto',
};

export default function AlignAccountPage() {
  return (
    <div className="container max-w-6xl pb-12">
      <PageHeader
        title="Virtual Bank Account"
        description="Set up a virtual bank account to receive payments via bank transfer"
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

        {/* Tabs for requesting new accounts and viewing existing ones */}
        <Tabs defaultValue="accounts" className="mt-8">
          <TabsList className="mb-4">
            <TabsTrigger value="accounts">Your Accounts</TabsTrigger>
            <TabsTrigger value="request">Request New Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accounts">
            <AlignAccountDisplay />
          </TabsContent>
          
          <TabsContent value="request">
            <AlignVirtualAccountRequestForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 