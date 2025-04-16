'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { AlignKycForm } from './align-kyc-form';


export function AlignKycStatus() {
  const [isOpening, setIsOpening] = useState(false);
  const [showKycForm, setShowKycForm] = useState(false);
  const { data: statusData, isLoading, refetch } = api.align.getCustomerStatus.useQuery(undefined, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  const initiateKycMutation = api.align.initiateKyc.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('KYC process initiated');
    },
    onError: (error) => {
      toast.error(`Failed to initiate KYC: ${error.message}`);
    },
  });

  const refreshStatusMutation = api.align.refreshKycStatus.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('KYC status refreshed');
    },
    onError: (error) => {
      toast.error(`Failed to refresh KYC status: ${error.message}`);
    },
  });

  const handleInitiateKyc = async () => {
    try {
      setShowKycForm(true);
    } catch (error) {
      // Error is handled in the mutation callbacks
    }
  };

  const handleFormCompleted = (flowLink: string) => {
    setShowKycForm(false);
    if (flowLink) {
      openExternalKycFlow(flowLink);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refreshStatusMutation.mutateAsync();
    } catch (error) {
      // Error is handled in the mutation callbacks
    }
  };

  const openKycFlow = () => {
    if (statusData?.kycFlowLink) {
      openExternalKycFlow(statusData.kycFlowLink);
    }
  };

  const openExternalKycFlow = (link: string) => {
    setIsOpening(true);
    window.open(link, '_blank');
    
    // Reset the opening state after a brief delay
    setTimeout(() => {
      setIsOpening(false);
    }, 1500);
  };

  // Determine the current status information
  const getStatusInfo = () => {
    if (!statusData) {
      return {
        title: 'Not Started',
        description: 'You need to start the KYC verification process.',
        icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
      };
    }

    const status = statusData.kycStatus;

    switch (status) {
      case 'verified':
        return {
          title: 'Verified',
          description: 'Your identity has been verified. You can now request a virtual account.',
          icon: <CheckCircle className="h-5 w-5 text-primary" />,
        };
      case 'pending':
        return {
          title: 'Pending Verification',
          description: 'Your identity verification is in progress. This process may take a few minutes to complete.',
          icon: <Loader2 className="h-5 w-5 text-primary animate-spin" />,
        };
      case 'action_required':
        return {
          title: 'Action Required',
          description: 'Additional information is needed to complete your verification. Please continue the KYC process.',
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        };
      case 'failed':
        return {
          title: 'Verification Failed',
          description: 'Your identity verification failed. Please try again.',
          icon: <AlertCircle className="h-5 w-5 text-destructive" />,
        };
      default:
        return {
          title: 'Not Started',
          description: 'You need to start the KYC verification process.',
          icon: <AlertCircle className="h-5 w-5 text-gray-500" />,
        };
    }
  };

  const statusInfo = getStatusInfo();

  // If showing KYC form, render that instead of the status card
  if (showKycForm) {
    return <AlignKycForm onCompleted={handleFormCompleted} />;
  }

  return (
    <Card className="mb-6 w-full bg-white border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          {statusInfo.icon}
          <span>KYC Status: {statusInfo.title}</span>
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">{statusInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : statusData?.kycStatus === 'pending' || statusData?.kycStatus === 'action_required' ? (
          <Alert className="bg-gray-50 border border-gray-100">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-gray-800 font-medium">Continue your verification</AlertTitle>
            <AlertDescription className="text-gray-600 text-sm">
              Please complete the verification process by clicking the button below.
              You&apos;ll be redirected to a secure verification page.
            </AlertDescription>
          </Alert>
        ) : statusData?.kycStatus === 'verified' ? (
          <Alert className="bg-gray-50 border border-gray-100">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertTitle className="text-gray-800 font-medium">Verification Complete</AlertTitle>
            <AlertDescription className="text-gray-600 text-sm">
              Your identity has been verified. You can now request a virtual account.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-gray-50 border border-gray-100">
            <AlertCircle className="h-4 w-4 text-gray-500" />
            <AlertTitle className="text-gray-800 font-medium">Verification Required</AlertTitle>
            <AlertDescription className="text-gray-600 text-sm">
              To create a virtual bank account, you&apos;ll need to verify your identity.
              This is a security requirement to prevent fraud.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100 mt-4">
        {!statusData || statusData.kycStatus === 'none' || statusData.kycStatus === 'failed' ? (
          <Button 
            onClick={handleInitiateKyc} 
            disabled={initiateKycMutation.isPending}
            className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
          >
            {initiateKycMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start KYC Process
          </Button>
        ) : statusData.kycStatus === 'pending' || statusData.kycStatus === 'action_required' ? (
          <>
            <Button 
              onClick={openKycFlow} 
              disabled={isOpening || !statusData.kycFlowLink}
              className="w-full sm:w-auto flex-1 bg-primary text-white hover:bg-primary/90"
              variant="default"
            >
              {isOpening ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              Continue Verification
            </Button>
            <Button 
              onClick={handleRefreshStatus} 
              disabled={refreshStatusMutation.isPending}
              variant="outline"
              className="w-full sm:w-auto text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              {refreshStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh Status
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleRefreshStatus} 
            disabled={refreshStatusMutation.isPending}
            variant="outline"
            className="w-full sm:w-auto text-gray-700 border-gray-200 hover:bg-gray-50"
          >
            {refreshStatusMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh Status
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}