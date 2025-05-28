'use client';

import { AlignKycStatus } from '@/components/settings/align-integration/align-kyc-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function KycPage() {
  const router = useRouter();

  const handleKycApproved = () => {
    toast.success('KYC Approved! You will be redirected to the dashboard.');
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const handleKycUserAwaitingReview = () => {
    toast.info("Your KYC information has been submitted and is pending review. We'll notify you of updates.");
    // Optional: redirect to a specific pending page or stay here
    // router.push('/dashboard/settings/kyc-pending');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 sm:py-12">
      <Card className="bg-white shadow-xl rounded-2xl">
        <CardHeader className="border-b border-gray-100 bg-slate-50/50 rounded-t-2xl px-6 py-5">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Identity Verification (KYC/KYB)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="mb-6 text-sm text-gray-600">
            To comply with regulations and ensure the security of our platform, we require identity verification.
            Please follow the steps below.
          </p>
          <AlignKycStatus
            onKycApproved={handleKycApproved}
            onKycUserAwaitingReview={handleKycUserAwaitingReview}
            variant="standalone"
          />
        </CardContent>
      </Card>
    </div>
  );
} 