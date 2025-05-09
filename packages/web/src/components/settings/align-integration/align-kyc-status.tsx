'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw, Copy, Loader2, Info } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { AlignKycForm } from './align-kyc-form';
import { useQueryClient } from '@tanstack/react-query';
import { ALIGN_QUERY_KEYS } from '@/trpc/query-keys';

// Define KYC status type from DB
type DbKycStatus = 'none' | 'pending' | 'approved' | 'rejected';

// Define the steps in the new KYC flow
type KycStep =
  | 'initialLoading'         // Initial check of KYC status from DB
  | 'showKycForm'            // Displaying AlignKycForm to input user details
  | 'awaitingLink'           // Form submitted, waiting for kycFlowLink from Align
  | 'linkReady'              // Link available, user can start external verification
  | 'verificationInProgress' // User has clicked "Start Verification", now in Align/Sumsub portal
  | 'statusApproved'         // KYC is approved
  | 'statusRejected'         // KYC is rejected
  | 'statusActionRequired'   // KYC is pending, and a link is available (user needs to act)
  | 'statusPendingReview';   // KYC is pending, link was used (or user claims finished), awaiting Align review

interface AlignKycStatusProps {
  onKycApproved?: () => void;
  onKycUserAwaitingReview?: () => void; // New: Called when user clicks "I've Finished" to navigate to interstitial page
  variant?: 'standalone' | 'embedded';
}

export function AlignKycStatus({ onKycApproved, onKycUserAwaitingReview, variant = 'standalone' }: AlignKycStatusProps) {
  const [currentStep, setCurrentStep] = useState<KycStep>('initialLoading');
  const [isOpeningExternalLink, setIsOpeningExternalLink] = useState(false);
  
  const queryClient = useQueryClient();
  const getCustomerStatusQueryKey = ALIGN_QUERY_KEYS.getCustomerStatus();

  const { data: statusData, isLoading: isLoadingStatusData, refetch: refetchStatusData, isError: isStatusError } = api.align.getCustomerStatus.useQuery(undefined, {
    // Configure polling for 'awaitingLink' step or when status is 'pending' without a link
    refetchInterval: (query) => {
      const data = query.state.data;
      if (currentStep === 'awaitingLink' && !data?.kycFlowLink) return 5000; // Poll for link
      if (data?.kycStatus === 'pending' && !data?.kycFlowLink && currentStep !== 'showKycForm' && currentStep !== 'initialLoading') return 7000; // Poll if pending and link somehow got lost
      return false; // No polling otherwise by default
    },
    refetchOnWindowFocus: true, // Keep true for general status updates
    staleTime: 1000 * 30, // Data considered fresh for 30 seconds
  });

  const recoverCustomerMutation = api.align.recoverCustomer.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      if (data.recovered) {
        toast.success('Successfully recovered your existing Align account.');
      } else if (data.alignCustomerId) {
        // Already linked, status will be updated by the invalidated query
      } 
      // If no customer found, statusData will reflect that, leading to 'showKycForm' or 'initialLoading' then 'showKycForm'
      // The main effect hook will handle step transition based on new statusData
    },
    onError: (error) => {
      toast.error(`Failed to check for existing account: ${error.message}`);
      // If recovery fails, allow user to proceed to form manually
      setCurrentStep('showKycForm'); 
    },
  });

  const createKycSessionMutation = api.align.createKycSession.useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      toast.success('New KYC session created.');
      if (data.kycFlowLink) {
        openExternalKycFlow(data.kycFlowLink); // Open immediately
        setCurrentStep('verificationInProgress');
      } else {
        // Should not happen if createKycSession succeeds with a link
        setCurrentStep('awaitingLink'); // Fallback to polling for the link
      }
    },
    onError: (error) => {
      toast.error(`Failed to create KYC session: ${error.message}`);
      // Stay in a state where user can retry or refresh
      if(statusData?.alignCustomerId) setCurrentStep('statusActionRequired');
      else setCurrentStep('showKycForm');
    },
  });

  // Effect to determine initial step and manage transitions based on statusData
  useEffect(() => {
    if (isLoadingStatusData) {
      setCurrentStep('initialLoading');
      return;
    }

    if (isStatusError || !statusData) {
        // If error loading status, or no status data, implies new user or issue.
        // Attempt recovery first unless already done.
        if (!recoverCustomerMutation.isPending && currentStep !== 'showKycForm') {
             // Check if alignCustomerId is already present from a previous load that errored
            const existingCustomerId = queryClient.getQueryData<typeof statusData>(getCustomerStatusQueryKey)?.alignCustomerId;
            if (!existingCustomerId) {
                console.log("Initial status error/no data, attempting recovery.");
                recoverCustomerMutation.mutate();
            } else {
                // Already have customer ID, but query failed. Default to showing form or allowing refresh.
                setCurrentStep('statusActionRequired'); // Or a generic error step
            }
        }
        return;
    }

    // At this point, statusData is available
    const { alignCustomerId, kycStatus, kycFlowLink } = statusData;

    if (kycStatus === 'approved') {
      setCurrentStep('statusApproved');
      onKycApproved?.();
      return;
    }

    if (kycStatus === 'rejected') {
      setCurrentStep('statusRejected');
      return;
    }

    // If in the middle of form submission steps, don't override yet
    if (currentStep === 'awaitingLink' && !kycFlowLink) return; // Still waiting for link
    if (currentStep === 'awaitingLink' && kycFlowLink) {
        setCurrentStep('linkReady');
        return;
    }

    // Default logic based on fetched status
    if (!alignCustomerId) {
      // No Align customer yet, try to recover first if not already attempted by error block
      if (!recoverCustomerMutation.isIdle && !recoverCustomerMutation.isPending) {
          // if mutation has been called (isIdle is false) and not pending means it finished
      } else if (recoverCustomerMutation.isIdle) {
        console.log("No Align Customer ID, attempting recovery.");
        recoverCustomerMutation.mutate();
        // currentStep remains 'initialLoading' or will be set by mutation callbacks
        return;
      }
      // If recovery ongoing or failed and led here, default to showing form
      if (currentStep !== 'showKycForm') setCurrentStep('showKycForm');

    } else if (kycStatus === 'pending') {
      if (kycFlowLink) {
        // If current step is verificationInProgress, user is in sumsub. If they come back and it's still pending with link, that's 'statusActionRequired'
        // If they clicked "I've finished" it would be 'statusPendingReview' (handled by onKycUserAwaitingReview)
        if (currentStep !== 'verificationInProgress' && currentStep !== 'statusPendingReview') {
             setCurrentStep('statusActionRequired'); // Has link, needs to act
        }
      } else {
        // Pending but no link - try to create session or await link via polling
        // This state could also be 'awaitingLink' if form was just submitted.
        if (currentStep !== 'awaitingLink') {
            setCurrentStep('awaitingLink'); 
        }
      }
    } else if (kycStatus === 'none') {
      // Has Align customer, but KYC not started/pending
      setCurrentStep('showKycForm');
    }

  // Adding onKycApproved to dependencies as per user request regarding callback timing
  }, [statusData, isLoadingStatusData, isStatusError, currentStep, recoverCustomerMutation, queryClient, getCustomerStatusQueryKey, onKycApproved]); 


  const handleFormSubmitted = () => {
    setCurrentStep('awaitingLink'); // Move to polling for the link
    refetchStatusData(); // Trigger an immediate refetch, polling will take over if link not present
  };

  const handleStartVerification = () => {
    if (statusData?.kycFlowLink) {
      openExternalKycFlow(statusData.kycFlowLink);
      setCurrentStep('verificationInProgress');
    } else {
      toast.error('KYC link is not available. Please refresh.');
      // Attempt to create a session if link is missing
      if (statusData?.alignCustomerId && statusData.kycStatus === 'pending') {
        createKycSessionMutation.mutate();
      }
    }
  };

  const handleCopyLink = async () => {
    if (statusData?.kycFlowLink) {
      try {
        await navigator.clipboard.writeText(statusData.kycFlowLink);
        toast.success('KYC link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link.');
      }
    } else {
      toast.error('KYC link is not available to copy.');
    }
  };

  const openExternalKycFlow = (link: string) => {
    setIsOpeningExternalLink(true);
    window.open(link, '_blank');
    setTimeout(() => setIsOpeningExternalLink(false), 1500);
  };

  const handleRefresh = () => {
    refetchStatusData();
  };
  
  const handleTryAgain = () => {
    if (statusData?.alignCustomerId) {
        // If customer exists, try creating a new session (especially if rejected or link missing)
        createKycSessionMutation.mutate();
    } else {
        // If no customer, go back to form
        setCurrentStep('showKycForm');
    }
  };

  const handleUserFinishedVerification = () => {
    // This is the new step where user indicates they are done with external process
    setCurrentStep('statusPendingReview'); // Update local step first for UI change
    // Then call the callback to navigate to the new interstitial page
    onKycUserAwaitingReview?.();
  };

  // Render logic based on currentStep
  let title = '';
  let description: React.ReactNode = '';
  let icon: React.ReactNode = <Loader2 className="h-5 w-5 animate-spin text-gray-500" />;
  let actions: React.ReactNode = null;

  switch (currentStep) {
    case 'initialLoading':
      title = 'Checking KYC Status';
      description = 'Please wait while we fetch your current verification status...';
      break;

    case 'showKycForm':
      return <AlignKycForm onFormSubmitted={handleFormSubmitted} />;

    case 'awaitingLink':
      title = 'Preparing Verification Link';
      description = 'Your information has been submitted. We are now generating your secure verification link. This may take a few moments.';
      icon = <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      actions = (
        <Button onClick={handleRefresh} disabled={isLoadingStatusData || recoverCustomerMutation.isPending} variant="outline" className="w-full">
          {isLoadingStatusData || recoverCustomerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Refresh Status
        </Button>
      );
      break;

    case 'linkReady':
      title = 'Verification Link Ready';
      description = 'Your secure link for identity verification is ready. Click below to start the process.';
      icon = <CheckCircle className="h-5 w-5 text-green-500" />;
      actions = (
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Button onClick={handleStartVerification} className="flex-1 bg-primary text-white hover:bg-primary/90 font-semibold">
            <ExternalLink className="mr-2 h-4 w-4" /> Start Verification Process
          </Button>
          <Button onClick={handleCopyLink} variant="outline" className="flex-1 sm:flex-none">
            <Copy className="mr-2 h-4 w-4" /> Copy Link
          </Button>
        </div>
      );
      break;

    case 'verificationInProgress':
      title = 'Complete Your Verification';
      description = (
        <>
          Please complete the identity verification in the new tab/window that was opened. 
          Once you have finished all steps in the Align/Sumsub portal (e.g., see a confirmation message from them or complete document submission), 
          click the button below.
        </>
      );
      icon = <Info className="h-5 w-5 text-blue-500" />;
      actions = (
        <div className="w-full flex flex-col gap-2">
            <Button onClick={handleUserFinishedVerification} className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="mr-2 h-4 w-4" /> I&apos;ve Finished My Verification
            </Button>
            <Button onClick={handleStartVerification} variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" /> Re-open Verification Tab
            </Button>
        </div>
      );
      break;

    case 'statusApproved':
      title = 'KYC Approved!';
      description = 'Your identity has been successfully verified. You can now proceed with account setup.';
      icon = <CheckCircle className="h-5 w-5 text-primary" />;
      // No actions needed here usually, parent component might navigate away or enable features
      // Optionally, if this component stays, offer a way to proceed.
      if (onKycApproved && variant === 'standalone') { // Assuming onKycApproved might trigger navigation
        actions = <Button onClick={onKycApproved} className="w-full">Continue</Button>;
      }
      break;

    case 'statusRejected':
      title = 'Verification Failed';
      description = 'Unfortunately, your identity verification could not be approved. You can try the process again.';
      icon = <AlertCircle className="h-5 w-5 text-destructive" />;
      actions = (
        <Button onClick={handleTryAgain} disabled={createKycSessionMutation.isPending} className="w-full">
          {createKycSessionMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Try Again
        </Button>
      );
      break;

    case 'statusActionRequired': // Pending with a link
      title = 'Action Required';
      description = 'Your identity verification is pending. Please continue the process using the link.';
      icon = <AlertCircle className="h-5 w-5 text-amber-500" />;
      actions = (
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Button onClick={handleStartVerification} className="flex-1">
            <ExternalLink className="mr-2 h-4 w-4" /> Continue Verification
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Status
          </Button>
        </div>
      );
      break;

    case 'statusPendingReview': // User clicked "I'm done", actual status is pending
        // This state is largely managed by the interstitial page after onKycUserAwaitingReview is called.
        // If this component remains visible briefly, or if navigation fails:
        title = 'Verification Submitted';
        description = 'Your documents are under review. This can take from a few minutes up to 12 hours. We will notify you of any updates.';
        icon = <CheckCircle className="h-5 w-5 text-green-500" />;
        actions = (
            <Button onClick={handleRefresh} disabled={isLoadingStatusData} variant="outline" className="w-full">
                {isLoadingStatusData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Refresh Status
            </Button>
        );
        break;

    default: // Should not happen
      title = 'Unknown State';
      description = 'An unexpected error occurred. Please refresh or try again later.';
      icon = <AlertCircle className="h-5 w-5 text-destructive" />;
      actions = <Button onClick={() => window.location.reload()} className="w-full">Refresh Page</Button>;
      break;
  }

  // Requirements message shown for certain steps
  const showRequirements = [
    'showKycForm', 'awaitingLink', 'linkReady', 'verificationInProgress', 'statusActionRequired'
  ].includes(currentStep) && currentStep !== 'statusApproved' && currentStep !== 'statusPendingReview';

  const cardContent = (
    <>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="font-medium text-gray-900 text-sm">{title}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
      {showRequirements && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 flex items-start gap-2 text-xs text-blue-900">
          <Info className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
          <div>
            <div className="font-semibold mb-1">What you&apos;ll need</div>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Photo ID (passport or driver&apos;s license)</li>
              <li>Proof of address (utility bill, bank statement)</li>
              <li>Camera-enabled device</li>
            </ul>
          </div>
        </div>
      )}
      {currentStep === 'statusPendingReview' && statusData?.kycStatus === 'pending' && (
         <div className="mt-4 rounded-lg border border-green-100 bg-green-50 px-3 py-2 flex items-start gap-2 text-xs text-green-900">
          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
          <div>
            <div className="font-semibold mb-1">Review in Progress</div>
            <div>Your verification information has been submitted and is under review by Align. This may take up to 12 hours.</div>
          </div>
        </div>
      )}
    </>
  );

  if (variant === 'embedded') {
    return (
      <div className="space-y-4 w-full">
        {cardContent}
        {actions && (
          <div className="w-full flex flex-col gap-3 pt-4 border-t border-gray-100 mt-4">
            {actions}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="mb-6 w-full bg-white border border-gray-100 shadow-sm rounded-xl">
      <CardHeader className="pb-1 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-gray-800">Identity Verification (KYC)</span>
        </div>
        <CardDescription className="text-xs text-gray-500 mt-1">
          {currentStep === 'statusApproved' 
            ? 'Your identity is verified.' 
            : 'Complete the KYC process to secure your account and enable all features.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 py-5">
        {cardContent}
      </CardContent>
      {actions && (
        <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 bg-gray-50 rounded-b-xl px-4 py-3">
          {actions}
        </CardFooter>
      )}
    </Card>
  );
}