'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw, Copy, Loader2, Info, AlertTriangle } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { AlignKycForm } from './align-kyc-form';
import { useQueryClient } from '@tanstack/react-query';
import { ALIGN_QUERY_KEYS } from '@/trpc/query-keys';
import { track } from '@vercel/analytics/react';

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
  | 'statusPendingReview'    // KYC is pending, link was used (or user claims finished), awaiting Align review
  | 'showKycIframe'          // New step for showing the iframe
  | 'notStarted'             // Initial loading state without KYC status
  | 'loading'                // Loading state for KYC status
  | 'error'                  // Error state for KYC
  | 'verified'               // KYC is verified
  | 'expired'                // KYC session is expired
  | 'manualReview'           // KYC requires manual review
  | 'pendingReview';         // KYC is pending review

interface AlignKycStatusProps {
  onKycApproved?: () => void;
  onKycUserAwaitingReview?: () => void; // New: Called when user clicks "I've Finished" to navigate to interstitial page
  variant?: 'standalone' | 'embedded';
}

const POLLING_INTERVAL_MS = 5000;

export function AlignKycStatus({ onKycApproved, onKycUserAwaitingReview, variant = 'standalone' }: AlignKycStatusProps) {
  const [currentStep, setCurrentStep] = useState<KycStep>('initialLoading');
  const [isOpeningExternalLink, setIsOpeningExternalLink] = useState(false);
  
  const queryClient = useQueryClient();
  const getCustomerStatusQueryKey = ALIGN_QUERY_KEYS.getCustomerStatus();

  const { data: statusData, isLoading: isLoadingStatusData, refetch: refetchStatusData, isError: isStatusError, isFetching } = api.align.getCustomerStatus.useQuery(undefined, {
    refetchInterval: (query) => {
      const data = query.state.data;
      const shouldPollForLink = currentStep === 'awaitingLink' && !data?.kycFlowLink;
      // console.log(`[AlignKycStatus Polling] Step: ${currentStep}, HasLink: ${!!data?.kycFlowLink}, ShouldPoll: ${shouldPollForLink}, IsFetching: ${isFetching}`);
      if (shouldPollForLink) return POLLING_INTERVAL_MS;
      return false; 
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Always treat data as stale to ensure invalidateQueries works immediately
    // Keep data only if currentStep is not initialLoading, to ensure fresh data on first real load after form
    // gcTime: currentStep === 'initialLoading' || currentStep === 'showKycForm' ? 0 : undefined,
    // enabled: currentStep !== 'showKycForm', // Prevent fetching while form is primary focus, will fetch on submit
  });

  const recoverCustomerMutation = api.align.recoverCustomer.useMutation({
    onSuccess: (data) => {
      console.log('[AlignKycStatus recoverCustomerMutation] Success:', data);
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey }); //This will trigger the main useEffect
      if (data.recovered) {
        toast.success('Successfully recovered your existing Align account.');
      } else if (data.alignCustomerId) {
        // Already linked, status will be updated by the invalidated query
      } else {
        // No customer found, force showing the form if not already there
        console.log('[AlignKycStatus recoverCustomerMutation] No customer found, setting to showKycForm');
        setCurrentStep('showKycForm');
      }
    },
    onError: (error) => {
      toast.error(`Failed to check for existing account: ${error.message}`);
      console.error('[AlignKycStatus recoverCustomerMutation] Error:', error);
      setCurrentStep('showKycForm'); 
    },
  });

  const markKycDoneMutation = api.align.markKycDone.useMutation({
    onSuccess: () => {
      // Optimistically update the cache with kycMarkedDone: true
      queryClient.setQueryData(getCustomerStatusQueryKey, (oldData: any) => {
        if (oldData) {
          return { ...oldData, kycMarkedDone: true };
        }
        return oldData;
      });
      
      // Immediately transition to pendingReview state
      setCurrentStep('pendingReview');
      // Call the callback to notify parent components
      onKycUserAwaitingReview?.();
      // Invalidate queries to get fresh data and force a refetch
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      // Force a refetch to ensure we get the latest data
      refetchStatusData();
      toast.success('Marked as completed. We will check your KYC status regularly.');
    },
    onError: (error) => {
      toast.error(`Failed to mark KYC as done: ${error.message}`);
    }
  });

  const unmarkKycDoneMutation = api.align.unmarkKycDone.useMutation({
    onSuccess: () => {
      // Optimistically update the cache with kycMarkedDone: false
      queryClient.setQueryData(getCustomerStatusQueryKey, (oldData: any) => {
        if (oldData) {
          return { ...oldData, kycMarkedDone: false };
        }
        return oldData;
      });

      // Immediately transition back to appropriate state based on available link
      if (statusData?.kycFlowLink) {
        setCurrentStep('showKycIframe');
      } else {
        setCurrentStep('statusActionRequired');
      }
      // Invalidate queries to get fresh data and force a refetch
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      // Force a refetch to ensure we get the latest data
      refetchStatusData();
      toast.success('Unmarked. You can complete the verification again.');
    },
    onError: (error) => {
      toast.error(`Failed to unmark KYC: ${error.message}`);
    }
  });

  const createKycSessionMutation = api.align.createKycSession.useMutation({
    onSuccess: (data) => {
      console.log('[AlignKycStatus createKycSessionMutation] Success:', data);
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });//This will trigger the main useEffect
      toast.success('New KYC session created.');
      // Main useEffect will handle transition to linkReady or verificationInProgress if link is now present
      // No, we should be more direct if we get a link back
      if (data.kycFlowLink) {
        openExternalKycFlow(data.kycFlowLink);
        setCurrentStep('verificationInProgress');
      } else {
        setCurrentStep('awaitingLink'); // Fallback to polling if link wasn't in direct response (should be)
      }
    },
    onError: (error) => {
      toast.error(`Failed to create KYC session: ${error.message}`);
      console.error('[AlignKycStatus createKycSessionMutation] Error:', error);
      // Stay in a state where user can retry or refresh
      if(statusData?.alignCustomerId && statusData.kycFlowLink) setCurrentStep('statusActionRequired');
      else if (statusData?.alignCustomerId) setCurrentStep('awaitingLink'); // Customer exists, but link failed, try polling
      else setCurrentStep('showKycForm');
    },
  });

  useEffect(() => {
    console.log('[AlignKycStatus Effect] Current Step:', currentStep, 'IsLoading:', isLoadingStatusData, 'IsFetching:', isFetching, 'StatusData:', JSON.stringify(statusData));

    if (isLoadingStatusData && !statusData) { // Only true initial loading, not background refetches
      console.log('[AlignKycStatus Effect] Still initial loading status data, current step:', currentStep);
      if (currentStep !== 'initialLoading') setCurrentStep('initialLoading');
      return;
    }

    // This effect should primarily react to changes in statusData and currentStep (if externally forced)
    // Avoid setting currentStep to initialLoading if data is already there, even if isLoading is true due to a refetch
    if (currentStep === 'initialLoading' && statusData) {
        // Data has loaded, proceed to determine next step
        console.log('[AlignKycStatus Effect] Initial data loaded, determining next step from initialLoading.');
    } else if (isLoadingStatusData && currentStep === 'initialLoading') {
        // Still in initial loading state, and query is loading, so wait.
        return;
    }

    if (isStatusError && currentStep !== 'showKycForm') {
        console.error('[AlignKycStatus Effect] Error loading status. Current step:', currentStep);
        // Attempt recovery only if not already showing form due to previous error
        if (!recoverCustomerMutation.isPending) {
            const existingCustomerId = queryClient.getQueryData<typeof statusData>(getCustomerStatusQueryKey)?.alignCustomerId;
            if (!existingCustomerId) {
                console.log("[AlignKycStatus Effect] Status error, no customerId in cache, attempting recovery.");
                recoverCustomerMutation.mutate();
            } else {
                console.log("[AlignKycStatus Effect] Status error, customerId exists in cache. Setting to actionRequired.");
                setCurrentStep('statusActionRequired');
            }
        }
        return;
    }

    if (!statusData && currentStep !== 'showKycForm' && currentStep !== 'initialLoading') {
        console.log('[AlignKycStatus Effect] No statusData, not showing form. Attempting recovery or showing form.');
        if (!recoverCustomerMutation.isPending && !recoverCustomerMutation.isSuccess) {
            recoverCustomerMutation.mutate();
        } else if (!recoverCustomerMutation.isPending) {
             // Recovery finished (success or error handled by mutation callbacks), now decide
            const lastRecoveredData = recoverCustomerMutation.data;
            if (!lastRecoveredData?.alignCustomerId) {
                setCurrentStep('showKycForm');
            }
            // if alignCustomerId exists, other parts of this effect will handle it.
        }
        return;
    }
    
    // If statusData is now available (even if a mutation just updated it)
    if (statusData) {
        const { alignCustomerId, kycStatus, kycFlowLink } = statusData;
        console.log(`[AlignKycStatus Effect] Processing Status: CustomerID: ${alignCustomerId}, KYC Status: ${kycStatus}, HasLink: ${!!kycFlowLink}, CurrentStep: ${currentStep}`);

        if (kycStatus === 'approved') {
            if (currentStep !== 'statusApproved') {
                console.log('[AlignKycStatus Effect] Transition to statusApproved');
                setCurrentStep('statusApproved');
                onKycApproved?.();
            }
        return;
      }

        if (kycStatus === 'rejected') {
            if (currentStep !== 'statusRejected') {
                console.log('[AlignKycStatus Effect] Transition to statusRejected');
                setCurrentStep('statusRejected');
            }
            return;
        }

        if (currentStep === 'awaitingLink') {
            if (kycFlowLink) {
                console.log('[AlignKycStatus Effect] Link received in awaitingLink! Transition to linkReady');
                setCurrentStep('linkReady');
    } else {
                console.log('[AlignKycStatus Effect] Still awaitingLink, no link yet.');
                // Polling is active, do nothing here, let polling refetch
            }
            return; // Explicitly return to prevent further processing in this effect run for this step
        }
        
        // If we are in verificationInProgress, user is external. Don't change step based on polling here.
        if (currentStep === 'verificationInProgress' || currentStep === 'statusPendingReview') {
            console.log(`[AlignKycStatus Effect] In step ${currentStep}, not changing based on polling.`);
            return;
        }

        // Check if user has marked KYC as done but status is still pending
        if (statusData.kycMarkedDone && kycStatus === 'pending') {
            if (currentStep !== 'pendingReview') {
                console.log('[AlignKycStatus Effect] User marked KYC as done, transition to pendingReview');
                setCurrentStep('pendingReview');
            }
            return;
        }

        // Check if user has unmarked KYC (was marked done but no longer is) 
        if (!statusData.kycMarkedDone && kycStatus === 'pending' && currentStep === 'pendingReview') {
            console.log('[AlignKycStatus Effect] User unmarked KYC, transition back to appropriate state');
            if (kycFlowLink) {
                setCurrentStep('showKycIframe');
            } else {
                setCurrentStep('statusActionRequired');
            }
            return;
        }

        // Default logic if not in a user-driven intermediate step like awaitingLink or verificationInProgress
        if (!alignCustomerId) {
            console.log('[AlignKycStatus Effect] No Align Customer ID found.');
            if (recoverCustomerMutation.isIdle || (!recoverCustomerMutation.isPending && !recoverCustomerMutation.isError)) {
                // If recovery hasn't run, or ran and found nothing, or ran and errored (but error didn't set form).
                console.log('[AlignKycStatus Effect] Attempting recovery or setting to showKycForm.');
                if (!recoverCustomerMutation.isPending && !recoverCustomerMutation.isSuccess) recoverCustomerMutation.mutate();
                else if (!recoverCustomerMutation.isPending) setCurrentStep('showKycForm');
            } else if (!recoverCustomerMutation.isPending && recoverCustomerMutation.isError) {
                setCurrentStep('showKycForm'); // Recovery errored, show form.
            }
        } else if (kycStatus === 'pending') {
            if (kycFlowLink) {
                console.log('[AlignKycStatus Effect] KYC pending with link. Transition to showKycIframe');
                setCurrentStep('showKycIframe');
            } else {
                console.log('[AlignKycStatus Effect] KYC pending, no link. Transition to awaitingLink (will trigger polling or session creation attempt).');
                setCurrentStep('awaitingLink'); 
            }
        } else if (kycStatus === 'none') {
            console.log('[AlignKycStatus Effect] KYC status none. Transition to showKycForm');
            setCurrentStep('showKycForm');
        } else {
            console.log('[AlignKycStatus Effect] Unhandled kycStatus or scenario:', kycStatus, 'currentStep:', currentStep);
        }
    }

  }, [
    statusData, 
    isLoadingStatusData, 
    isFetching, 
    isStatusError, 
    currentStep, 
    recoverCustomerMutation.data, 
    recoverCustomerMutation.isError, 
    recoverCustomerMutation.isIdle, 
    recoverCustomerMutation.isPending, 
    recoverCustomerMutation.isSuccess,
    onKycApproved
  ]);

  const handleFormSubmitted = () => {
    console.log('[AlignKycStatus] Form submitted.');
    setCurrentStep('awaitingLink'); 
    refetchStatusData(); // Trigger an immediate refetch, polling will take over if link not present
  };

  const handleStartVerification = () => {
    if (statusData?.kycFlowLink) {
      openExternalKycFlow(statusData.kycFlowLink);
      setCurrentStep('verificationInProgress');
    } else {
      toast.error('KYC link is not available. Please refresh or try creating a new session.');
      console.warn('[AlignKycStatus handleStartVerification] KYC link not available. StatusData:', statusData);
      if (statusData?.alignCustomerId && statusData.kycStatus === 'pending' && !statusData.kycFlowLink) {
        console.log('[AlignKycStatus handleStartVerification] Attempting to create new session as link is missing.');
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
    console.log('[AlignKycStatus] Manual refresh triggered.');
    refetchStatusData();
  };
  
  const handleTryAgain = () => {
    console.log('[AlignKycStatus] Try Again clicked. Current StatusData:', statusData);
    if (statusData?.alignCustomerId) {
        createKycSessionMutation.mutate();
    } else {
        setCurrentStep('showKycForm');
    }
  };

  const handleUserFinishedVerification = () => {
    console.log(`[AlignKycStatus] User clicked I've Finished My Verification`);
    markKycDoneMutation.mutate();
    // Note: State transition happens in markKycDoneMutation.onSuccess
  };

  const handleUnmarkFinishedVerification = () => {
    console.log(`[AlignKycStatus] User clicked to unmark finished verification`);
    unmarkKycDoneMutation.mutate();
  };

  // Render logic based on currentStep
  let title = '';
  let description: React.ReactNode = '';
  let icon: React.ReactNode = <Loader2 className="h-5 w-5 animate-spin text-gray-500" />;
  let actions: React.ReactNode = null;

  // Default to loading if currentStep is initialLoading and we don't have data yet
  if (currentStep === 'initialLoading' && !statusData && isLoadingStatusData) {
    title = 'Checking KYC Status';
    description = 'Please wait while we fetch your current verification status...';
  } else {
      switch (currentStep) {
        case 'initialLoading': // Should have transitioned out if data arrived, or show form if error/no data
          title = 'Initializing...';
          description = 'Setting up KYC process...';
          // Actions might include a manual way to start if stuck
          if (!isLoadingStatusData && !isFetching) {
            actions = <Button onClick={() => setCurrentStep('showKycForm')} className="w-full">Start Manually</Button>;
          }
          break;
    
        case 'showKycForm':
          // Form is rendered directly, so this case in switch is for completeness or if we wanted to wrap it
          return <AlignKycForm onFormSubmitted={handleFormSubmitted} />;
    
        case 'awaitingLink':
          title = 'Preparing Verification Link';
          description = 'Your information has been submitted. We are now generating your secure verification link. This may take a few moments.';
          icon = <Loader2 className="h-5 w-5 animate-spin text-primary" />;
          actions = (
            <Button onClick={handleRefresh} disabled={isFetching} variant="outline" className="w-full">
              {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Refresh Status
            </Button>
          );
          break;
    
        case 'linkReady':
          title = 'Verification Link Ready';
          description = 'Your secure link for identity verification is ready. Click below to start the process.';
          icon = <CheckCircle className="h-5 w-5 text-green-500" />;
          actions = (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button onClick={handleStartVerification} className="flex-1 bg-primary text-white hover:bg-primary/90 font-semibold" disabled={isOpeningExternalLink}>
                {isOpeningExternalLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />} Start Verification Process
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
            <span className="text-xs sm:text-sm">
              Please complete the identity verification in the new tab/window that was opened. 
              Once you have finished all steps in the Align/Sumsub portal (e.g., see a confirmation message from them or complete document submission), 
              click the button below.
            </span>
          );
          icon = <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
          actions = (
            <div className="w-full flex flex-col gap-2">
                <Button onClick={handleUserFinishedVerification} className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-3 sm:py-2">
                    <CheckCircle className="mr-2 h-4 w-4" /> I&apos;ve Finished My Verification
                </Button>
                <Button onClick={handleStartVerification} variant="outline" className="w-full text-sm sm:text-base" disabled={isOpeningExternalLink}>
                    {isOpeningExternalLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />} Re-open Verification Tab
                </Button>
            </div>
          );
          break;
    
        case 'statusApproved':
          title = 'KYC Approved!';
          description = 'Your identity has been successfully verified. You can now proceed with account setup.';
          icon = <CheckCircle className="h-5 w-5 text-primary" />;
          if (onKycApproved && variant === 'standalone') { 
            actions = <Button onClick={onKycApproved} className="w-full">Continue</Button>;
          }
          break;
    
        case 'statusRejected':
          title = 'Verification Failed';
          description = 'Unfortunately, your identity verification could not be approved. You can try the process again.';
          icon = <AlertCircle className="h-5 w-5 text-destructive" />;
          actions = (
            <Button onClick={handleTryAgain} disabled={createKycSessionMutation.isPending || isFetching} className="w-full">
              {createKycSessionMutation.isPending || isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Try Again
            </Button>
          );
          break;
    
        case 'statusActionRequired': 
          title = 'Action Required';
          description = 'Your identity verification is pending. Please continue the process using the link provided.';
          icon = <AlertCircle className="h-5 w-5 text-amber-500" />;
          actions = (
            <div className="w-full flex flex-col sm:flex-row gap-2">
              <Button onClick={handleStartVerification} className="flex-1" disabled={isOpeningExternalLink || !statusData?.kycFlowLink}>
                {isOpeningExternalLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />} 
                {statusData?.kycFlowLink ? 'Continue Verification' : 'Link Not Available'}
              </Button>
              <Button onClick={handleRefresh} variant="outline" className="flex-1" disabled={isFetching}>
                {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />} Refresh Status
              </Button>
            </div>
          );
          break;
    
        case 'statusPendingReview': 
            title = 'Verification Submitted';
            description = 'Your documents are under review. This can take from a few minutes up to 12 hours. We will notify you of any updates.';
            icon = <CheckCircle className="h-5 w-5 text-green-500" />;
            actions = (
                <Button onClick={handleRefresh} disabled={isFetching} variant="outline" className="w-full">
                    {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}Refresh Status
                </Button>
            );
            break;
    
        case 'showKycIframe':
          return (
            <div className="min-h-screen bg-gray-50 -m-4 md:-m-6">
              {/* Header - Mobile optimized */}
              <div className="bg-white border-b border-gray-200 p-3 md:p-4">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 text-center">
                    Complete Your KYC Verification
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center mb-3">
                    Please complete the form below. For the best experience, you can also open this in a new tab.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-2">
                    <Button 
                      onClick={handleStartVerification} 
                      variant="outline"
                      size="sm"
                      disabled={isOpeningExternalLink}
                      className="w-full sm:w-auto text-xs md:text-sm"
                    >
                      {isOpeningExternalLink ? <Loader2 className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" /> : <ExternalLink className="mr-2 h-3 w-3 md:h-4 md:w-4" />}
                      Open in New Tab
                    </Button>
                    <Button 
                      onClick={handleCopyLink} 
                      variant="ghost" 
                      size="sm"
                      className="w-full sm:w-auto text-xs md:text-sm"
                    >
                      <Copy className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Copy Link
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Iframe container - Responsive height */}
              <div className="w-full overflow-hidden" style={{ 
                height: 'calc(100vh - 200px)', // Mobile: smaller header/footer
                minHeight: '400px' // Minimum height for usability
              }}>
                <iframe
                  src={statusData?.kycFlowLink || ''}
                  title="KYC Verification"
                  className="w-full h-full border-0"
                  allow="camera; microphone; fullscreen; autoplay"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
                  loading="lazy"
                />
              </div>
              
              {/* Footer - Mobile optimized */}
              <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleUserFinishedVerification} 
                      disabled={isOpeningExternalLink || isFetching}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm md:text-base py-3 md:py-2"
                    >
                      {isOpeningExternalLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      I&apos;ve Finished My Verification
                    </Button>
                    <Button 
                      onClick={handleStartVerification} 
                      variant="outline"
                      className="w-full text-sm md:text-base" 
                      disabled={isOpeningExternalLink || isFetching}>
                      {isOpeningExternalLink ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                      Reload Form
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Complete all steps in the form above, then click &quot;I&apos;ve Finished My Verification&quot;
                  </p>
                </div>
              </div>
            </div>
          );
    
        case 'notStarted':
          return (
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Verify Your Identity
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                To use Align banking features, you need to complete a one-time
                identity verification (KYC).
              </p>
              <Button onClick={handleStartVerification} disabled={createKycSessionMutation.isPending}>
                {createKycSessionMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Start KYC Verification
              </Button>
            </div>
          );
    
        case 'loading':
          return (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-gray-600">Loading KYC status...</p>
            </div>
          );
    
        case 'error':
          return (
            <div className="flex flex-col items-center justify-center p-6 bg-red-50 text-red-700 rounded-lg shadow">
              <AlertTriangle className="h-8 w-8 mb-3" />
              <p className="text-sm font-semibold">Error</p>
              <p className="text-xs text-center mb-4">An unexpected error occurred.</p>
              <Button onClick={handleRefresh} disabled={isFetching || createKycSessionMutation.isPending} className="mb-2">
                {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Try Refreshing Status
              </Button>
              {statusData?.alignCustomerId && (
                <Button onClick={handleStartVerification} variant="outline" disabled={createKycSessionMutation.isPending}>
                  {createKycSessionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create New KYC Session
                </Button>
              )}
            </div>
          );
    
        case 'verified':
          return (
            <div className="p-6 bg-green-50 text-green-700 rounded-lg shadow text-center">
              <CheckCircle className="h-8 w-8 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">KYC Verified!</h3>
              <p className="text-sm">
                Your identity has been successfully verified. You can now access
                all Align banking features.
              </p>
            </div>
          );
    
        case 'expired':
          return (
            <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow text-center">
              <AlertTriangle className="h-8 w-8 mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">KYC Session Expired</h3>
              <p className="text-sm mb-4">
                Your KYC verification session has expired or the link is no longer valid. Please start a new one.
              </p>
              <Button onClick={handleStartVerification} disabled={createKycSessionMutation.isPending}>
                {createKycSessionMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Start New KYC Session
              </Button>
            </div>
          );
    
        case 'manualReview':
          return (
            <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow text-center">
              <Loader2 className="h-8 w-8 animate-spin mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">
                Verification Under Manual Review
              </h3>
              <p className="text-sm mb-4">
                Your KYC information requires manual review. This may take a bit
                longer. We appreciate your patience and will update you soon.
              </p>
              <Button onClick={handleRefresh} disabled={isFetching || createKycSessionMutation.isPending}>
                {(isFetching || createKycSessionMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Refresh Status
              </Button>
            </div>
          );
    
        case 'pendingReview':
          return (
            <div className="p-6 bg-blue-50 text-blue-700 rounded-lg shadow text-center">
              <Loader2 className="h-8 w-8 animate-spin mb-3 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">
                Verification Pending Review
              </h3>
              <p className="text-sm mb-4">
                {statusData?.kycMarkedDone 
                  ? "You&apos;ve marked your verification as complete. We&apos;re checking with our verification partner for updates."
                  : "Your KYC information has been submitted and is currently under review. This usually takes a few minutes to a couple of hours. We&apos;ll notify you once it&apos;s processed."
                }
              </p>
              <div className="space-y-2">
                <Button onClick={handleRefresh} disabled={isFetching || createKycSessionMutation.isPending}>
                  {(isFetching || createKycSessionMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Refresh Status
                </Button>
                {statusData?.kycMarkedDone && (
                  <Button
                    onClick={handleUnmarkFinishedVerification}
                    variant="outline"
                    size="sm"
                    disabled={unmarkKycDoneMutation.isPending}
                    className="text-xs"
                  >
                    {unmarkKycDoneMutation.isPending && (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    )}
                    I haven&apos;t finished yet
                  </Button>
                )}
              </div>
            </div>
          );
    
        default:
          const exhaustiveCheck: never = currentStep;
          title = 'Unknown State';
          description = `An unexpected error occurred (state: ${exhaustiveCheck}). Please refresh or try again later.`;
          icon = <AlertCircle className="h-5 w-5 text-destructive" />;
          actions = <Button onClick={() => window.location.reload()} className="w-full">Refresh Page</Button>;
          break;
      }
  }

  const showRequirements = [
    'showKycForm', 'awaitingLink', 'linkReady', 'verificationInProgress', 'statusActionRequired'
  ].includes(currentStep) && currentStep !== 'statusApproved' && currentStep !== 'statusPendingReview';

  const cardContent = (
    <>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-gray-900 text-sm sm:text-base">{title}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1 break-words">{description}</div>
        </div>
      </div>
      {showRequirements && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 flex items-start gap-2 text-xs sm:text-sm text-blue-900">
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
         <div className="mt-4 rounded-lg border border-green-100 bg-green-50 px-3 py-2 flex items-start gap-2 text-xs sm:text-sm text-green-900">
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
      <CardHeader className="pb-1 border-b border-gray-100 bg-gray-50 rounded-t-xl p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm sm:text-base text-gray-800">Identity Verification (KYC)</span>
        </div>
        <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
          {currentStep === 'statusApproved' 
            ? 'Your identity is verified.' 
            : 'Complete the KYC process to secure your account and enable all features.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 py-4 sm:py-5 px-4 sm:px-6">
        {cardContent}
      </CardContent>
      {actions && (
      <CardFooter className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 rounded-b-xl px-4 sm:px-6 py-3 sm:py-4">
          {actions}
      </CardFooter>
      )}
    </Card>
  );
}