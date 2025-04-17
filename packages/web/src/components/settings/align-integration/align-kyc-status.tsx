'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { AlignKycForm } from './align-kyc-form';


export function AlignKycStatus() {
  const [isOpening, setIsOpening] = useState(false);
  const [showKycForm, setShowKycForm] = useState(false);
  const [showRecoveryMessage, setShowRecoveryMessage] = useState(false);
  const [isCheckingExistingCustomer, setIsCheckingExistingCustomer] = useState(false);
  
  // Get customer status
  const { data: statusData, isLoading, refetch } = api.align.getCustomerStatus.useQuery(undefined, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  console.log('statusData', statusData);

  const initiateKycMutation = api.align.initiateKyc.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('KYC process initiated');
    },
    onError: (error) => {
      // Check if error appears to be about existing customer
      if (error.message.toLowerCase().includes('already exists')) {
        setShowRecoveryMessage(true);
        toast.error(`A customer with this email already exists in Align. Use recovery option.`);
      } else {
        toast.error(`Failed to initiate KYC: ${error.message}`);
      }
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

  const createKycSessionMutation = api.align.createKycSession.useMutation({
    onSuccess: (data) => {
      refetch();
      toast.success('New KYC session created');
      
      // If there's a flow link, open it automatically
      if (data.kycFlowLink) {
        openExternalKycFlow(data.kycFlowLink);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create KYC session: ${error.message}`);
    },
  });

  const recoverCustomerMutation = api.align.recoverCustomer.useMutation({
    onSuccess: (data) => {
      refetch();
      setIsCheckingExistingCustomer(false);
      
      if (data.recovered) {
        // Automatically proceed with the recovered customer
        toast.success('Successfully recovered your existing Align account');
        setShowRecoveryMessage(false);
        
        // If KYC is still pending or requires action, offer to continue
        if (data.kycStatus === 'pending' || data.kycStatus === 'action_required') {
          // If there's a flow link, open it automatically
          if (data.kycFlowLink) {
            openExternalKycFlow(data.kycFlowLink);
          }
        }
      } else if (data.alignCustomerId) {
        // Customer was already linked
        setShowRecoveryMessage(false);
      } else {
        // No customer found to recover
        setIsCheckingExistingCustomer(false);
      }
    },
    onError: (error) => {
      setIsCheckingExistingCustomer(false);
      console.error("Recovery check failed:", error);
      // Don't show an error to the user - just proceed normally
    },
  });

  // Run recovery check once when component mounts or status data changes
  useEffect(() => {
    // Only check if we have statusData and no alignCustomerId yet
    if (statusData && !statusData.alignCustomerId && !isCheckingExistingCustomer && !recoverCustomerMutation.isPending) {
      setIsCheckingExistingCustomer(true);
      // Run the recovery check
      recoverCustomerMutation.mutate();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData, isCheckingExistingCustomer]);  // Only depend on statusData changes

  const handleInitiateKyc = async () => {
    try {
      setShowKycForm(true);
    } catch (error) {
      // Error is handled in the mutation callbacks
    }
  };

  const handleCreateKycSession = async () => {
    try {
      await createKycSessionMutation.mutateAsync();
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

  const handleRecoverCustomer = async () => {
    try {
      await recoverCustomerMutation.mutateAsync();
    } catch (error) {
      // Error is handled in the mutation callbacks
    }
  };

  const openKycFlow = () => {
    console.log('statusData', statusData);
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
  
  // Determine if we need to create a new KYC session
  const needsNewKycSession = statusData?.alignCustomerId && 
    (statusData.kycStatus === 'pending' || statusData.kycStatus === 'action_required') && 
    !statusData.kycFlowLink;

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
        {isLoading || isCheckingExistingCustomer ? (
          <div className="flex flex-col items-center py-4 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-gray-500">
              {isCheckingExistingCustomer ? 'Checking for existing account...' : 'Loading status...'}
            </span>
          </div>
        ) : showRecoveryMessage ? (
          <Alert className="bg-amber-50 border border-amber-100">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-gray-800 font-medium">Customer Already Exists</AlertTitle>
            <AlertDescription className="text-gray-600 text-sm">
              It appears a customer with your email already exists in Align but is not linked in our database.
              Click the &quot;Recover Account&quot; button below to link your existing Align account.
            </AlertDescription>
          </Alert>
        ) : needsNewKycSession ? (
          <Alert className="bg-amber-50 border border-amber-100">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-gray-800 font-medium">KYC Session Needed</AlertTitle>
            <AlertDescription className="text-gray-600 text-sm">
              Your account is set up, but you need to create a new KYC session to continue verification.
              Click the &quot;Create KYC Session&quot; button below to proceed.
            </AlertDescription>
          </Alert>
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
        {isLoading || isCheckingExistingCustomer ? (
          <Button 
            disabled
            className="w-full sm:w-auto text-gray-700 border-gray-200 hover:bg-gray-50"
            variant="outline"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking Account Status...
          </Button>
        ) : showRecoveryMessage ? (
          <>
            <Button 
              onClick={handleRecoverCustomer} 
              disabled={recoverCustomerMutation.isPending}
              className="w-full sm:w-auto bg-amber-600 text-white hover:bg-amber-700"
            >
              {recoverCustomerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Recover Account
            </Button>
            <Button 
              onClick={() => setShowRecoveryMessage(false)} 
              variant="outline"
              className="w-full sm:w-auto text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </>
        ) : needsNewKycSession ? (
          <>
            <Button 
              onClick={handleCreateKycSession} 
              disabled={createKycSessionMutation.isPending}
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
            >
              {createKycSessionMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Create KYC Session
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
        ) : !statusData || statusData.kycStatus === 'none' || statusData.kycStatus === 'failed' ? (
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