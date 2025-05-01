'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { AlignKycForm } from './align-kyc-form';
import { useQueryClient } from '@tanstack/react-query';

// Define KYC status type to match our database schema
type KycStatus = 'none' | 'pending' | 'approved' | 'rejected';

export function AlignKycStatus() {
  const [isOpening, setIsOpening] = useState(false);
  const [showKycForm, setShowKycForm] = useState(false);
  const [showRecoveryMessage, setShowRecoveryMessage] = useState(false);
  const [isCheckingExistingCustomer, setIsCheckingExistingCustomer] = useState(false);
  const [initialCheckAttempted, setInitialCheckAttempted] = useState(false);
  const [skipCheckExisting, setSkipCheckExisting] = useState(false);
  
  // Get queryClient instance
  const queryClient = useQueryClient();
  
  // Get customer status
  const { data: statusData, isLoading, refetch } = api.align.getCustomerStatus.useQuery(undefined, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  // Log statusData whenever it changes
  useEffect(() => {
    console.log('[AlignKycStatus] statusData updated:', statusData);
  }, [statusData]);

  const initiateKycMutation = api.align.initiateKyc.useMutation({
    onSuccess: () => {
      // Invalidate status query using the correct key structure
      queryClient.invalidateQueries({ queryKey: [['align', 'getCustomerStatus']] });
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
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: [['align', 'getCustomerStatus']] });
      toast.success('KYC status refreshed');
    },
    onError: (error) => {
      toast.error(`Failed to refresh KYC status: ${error.message}`);
    },
  });

  const createKycSessionMutation = api.align.createKycSession.useMutation({
    onSuccess: (data) => {
      console.log('[AlignKycStatus] createKycSession success data:', data);
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: [['align', 'getCustomerStatus']] });
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
      // Ensure loading state is turned off first
      setIsCheckingExistingCustomer(false);
      console.log('[AlignKycStatus] recoverCustomer success data:', data);
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: [['align', 'getCustomerStatus']] });
      setInitialCheckAttempted(true);
      
      if (data.recovered) {
        // Automatically proceed with the recovered customer
        toast.success('Successfully recovered your existing Align account');
        setShowRecoveryMessage(false);
        
        // If KYC is still pending or requires action, offer to continue
        if (data.kycStatus === 'pending') {
          // If there's a flow link, open it automatically
          if (data.kycFlowLink) {
            openExternalKycFlow(data.kycFlowLink);
          }
        }
      } else if (data.alignCustomerId) {
        // Customer was already linked, maybe status needs refreshing
        setShowRecoveryMessage(false);
        toast.info('Account was already linked. Refreshing status.');
        refetch(); // Ensure status is up-to-date
      } else {
        // No customer found to recover - this is expected if it's a new user
        console.log("No existing Align customer found for this email.");
        setShowRecoveryMessage(false); // Hide recovery message if it was shown
      }
    },
    onError: (error) => {
      // Ensure loading state is turned off first
      setIsCheckingExistingCustomer(false);
      // Mark the check as attempted even on error
      setInitialCheckAttempted(true); 
      console.error("Recovery check failed:", error);
      // Don't show a user-facing error, just log it and allow normal flow
      // Maybe the user genuinely doesn't have an account
      setShowRecoveryMessage(false); // Hide recovery message if it was shown
    },
  });

  // Run recovery check only when necessary conditions are met and check hasn't been attempted
  useEffect(() => {
    // Conditions: status loaded, no customer ID linked yet, not currently checking, mutation not pending, AND initial check not yet attempted
    const shouldCheck = statusData && !statusData.alignCustomerId && !isCheckingExistingCustomer && !recoverCustomerMutation.isPending && !initialCheckAttempted;

    if (shouldCheck) {
      console.log('Attempting initial check for existing Align customer...');
      setIsCheckingExistingCustomer(true);
      // Mark check as attempted immediately to prevent re-triggering on re-renders before mutation starts/finishes
      setInitialCheckAttempted(true); 
      
      // Start the recovery check mutation
      recoverCustomerMutation.mutate();
      // If the mutation finishes *before* the timeout, the onSuccess/onError will also set initialCheckAttempted, which is fine.

      // Set a safety timeout: If the mutation hasn't finished after 5 seconds,
      // assume something went wrong (network issue?) and reset the checking state
      // to unblock the UI.
      const timeoutId = setTimeout(() => {
        // Check if we are *still* in the checking state after 5s
        if (recoverCustomerMutation.isPending) {
          console.warn('Recovery check mutation timed out after 5 seconds. Resetting UI.');
          setIsCheckingExistingCustomer(false);
          // Ensure we mark check as attempted even on timeout to prevent loop
          setInitialCheckAttempted(true); 
          // Optionally, you could cancel the mutation here if the library supports it,
          // but simply resetting the UI state might be sufficient.
        }
      }, 5000); // 5 seconds timeout

      // Cleanup function: Clear the timeout if the component unmounts
      // or if the effect re-runs before the timeout fires.
      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData, isCheckingExistingCustomer, recoverCustomerMutation.isPending, initialCheckAttempted]); // Add initialCheckAttempted to dependencies

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
    console.log('[AlignKycStatus] Attempting to open KYC flow. Current statusData:', statusData);
    if (statusData?.kycFlowLink) {
      console.log(`[AlignKycStatus] Opening link: ${statusData.kycFlowLink}`);
      openExternalKycFlow(statusData.kycFlowLink);
    } else {
      console.warn('[AlignKycStatus] Cannot open KYC flow: kycFlowLink is missing in statusData.');
      toast.error('KYC link not available. Please try refreshing the status or creating a new session.');
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

    const status = statusData.kycStatus as KycStatus;

    switch (status) {
      case 'approved':
        return {
          title: 'Approved',
          description: 'Your identity has been verified. You can now request a virtual account.',
          icon: <CheckCircle className="h-5 w-5 text-primary" />,
        };
      case 'pending':
        return {
          title: 'Pending Verification',
          description: 'Your identity verification is processing via Align. This can take a few minutes to several hours. Please check back later. You can refresh the status below.',
          icon: <Loader2 className="h-5 w-5 text-primary animate-spin" />,
        };
      case 'rejected':
        return {
          title: 'Verification Failed',
          description: 'Your identity verification was rejected. Please try again.',
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
    (statusData.kycStatus === 'pending' as KycStatus) && 
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
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center space-x-3">
          {isLoading || isCheckingExistingCustomer ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            statusInfo.icon
          )}
          <div>
            <p className="font-medium">{isLoading || isCheckingExistingCustomer ? 'Checking Status...' : statusInfo.title}</p>
            <p className="text-sm text-gray-600">
              {isLoading || isCheckingExistingCustomer ? 'Please wait while we check your KYC status...' : statusInfo.description}
            </p>
          </div>
        </div>

        {/* Informational section about requirements (Show if not approved) */}
        {statusData?.kycStatus !== 'approved' && (
          <Alert variant="default" className="mt-4 border-blue-200 bg-blue-50 text-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900">What You&apos;ll Need</AlertTitle>
            <AlertDescription className="text-blue-700">
              <ul className="list-disc pl-5 space-y-1 mt-1 text-sm">
                <li>Access to a digital copy of your government-issued photo ID (passport, driver&apos;s license). You can take a picture during the process.</li>
                <li>Access to a recent proof of address document (utility bill, bank statement).</li>
                <li>A device with a camera for liveness verification.</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Positive reinforcement for pending status */}
        {statusData?.kycStatus === 'pending' && (
          <Alert variant="default" className="mt-4 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">Information Submitted</AlertTitle>
            <AlertDescription className="text-green-700">
              Your verification information has been successfully submitted and is now under review by Align.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons based on status */}
        {/* Show KYC Form Trigger Button if status is 'none' and form isn't already shown */}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-100 mt-4">
        {isCheckingExistingCustomer ? (
          <Button 
            disabled
            className="w-full sm:w-auto text-gray-700 border-gray-200 hover:bg-gray-50"
            variant="outline"
          >
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking Account Status...
          </Button>
        ) : showRecoveryMessage ? (
          // Recovery Options
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
        ) : statusData?.kycStatus === 'none' || !statusData || isLoading ? (
          // Status: None, Not Loaded, or Loading -> Show Start Button
          <Button 
            onClick={handleInitiateKyc} 
            disabled={initiateKycMutation.isPending}
            className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
          >
            {initiateKycMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Start KYC Process
          </Button>
        ) : statusData.kycStatus === 'pending' ? (
          // Status: Pending -> Show Continue (if link) and Refresh
          <>
            {statusData.kycFlowLink && (
              <Button 
                onClick={openKycFlow} 
                disabled={isOpening}
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
            )}
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
        ) : statusData.kycStatus === 'rejected' ? (
           // Status: Rejected -> Show Create Session and Refresh
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
              Create New KYC Session
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
           // Status: Approved (or other unexpected) -> Show only Refresh
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