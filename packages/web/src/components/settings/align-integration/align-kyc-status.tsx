'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw, Copy } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { AlignKycForm } from './align-kyc-form';
import { useQueryClient } from '@tanstack/react-query';
import { ALIGN_QUERY_KEYS } from '@/trpc/query-keys';

// Define KYC status type to match our database schema
type KycStatus = 'none' | 'pending' | 'approved' | 'rejected';

// Add the new props to the interface
interface AlignKycStatusProps {
  onKycApproved?: () => void;
  variant?: 'standalone' | 'embedded';
}

// localStorage keys
const KYC_LINK_KEY = 'align_kyc_link';
const KYC_VISITED_KEY = 'align_visited';
const KYC_WINDOW_CLOSED_KEY = 'align_window_closed';

export function AlignKycStatus({ onKycApproved, variant = 'standalone' }: AlignKycStatusProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showKycForm, setShowKycForm] = useState(false);
  const [showRecoveryMessage, setShowRecoveryMessage] = useState(false);
  const [isCheckingExistingCustomer, setIsCheckingExistingCustomer] = useState(false);
  const [initialCheckAttempted, setInitialCheckAttempted] = useState(false);
  const [skipCheckExisting, setSkipCheckExisting] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [windowClosed, setWindowClosed] = useState(false);
  const popupWindowRef = useRef<Window | null>(null);
  const popupCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get queryClient instance
  const queryClient = useQueryClient();
  
  // Get customer status
  const getCustomerStatusQueryKey = ALIGN_QUERY_KEYS.getCustomerStatus();
  const { data: statusData, isLoading, refetch } = api.align.getCustomerStatus.useQuery(undefined, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
  
  // Log statusData whenever it changes
  useEffect(() => {
    console.log('[AlignKycStatus] statusData updated:', statusData);
  }, [statusData]);

  // Load localStorage flags on component mount
  useEffect(() => {
    const visitedTimestamp = localStorage.getItem(KYC_VISITED_KEY);
    const windowClosedFlag = localStorage.getItem(KYC_WINDOW_CLOSED_KEY);
    
    setHasVisited(!!visitedTimestamp);
    setWindowClosed(windowClosedFlag === '1');
    
    // Clear polling interval when component unmounts
    return () => {
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
      }
    };
  }, []);

  // Clear localStorage flags when KYC is approved or rejected
  useEffect(() => {
    if (statusData?.kycStatus === 'approved' || statusData?.kycStatus === 'rejected') {
      localStorage.removeItem(KYC_VISITED_KEY);
      localStorage.removeItem(KYC_WINDOW_CLOSED_KEY);
      setHasVisited(false);
      setWindowClosed(false);
      
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
        popupCheckIntervalRef.current = null;
      }
    }
  }, [statusData?.kycStatus]);

  // Add useEffect to trigger the callback when KYC is approved
  useEffect(() => {
    if (statusData?.kycStatus === 'approved' && onKycApproved) {
      console.log('[AlignKycStatus] KYC status is approved, calling onKycApproved callback.');
      onKycApproved();
    }
    // Intentionally only run when statusData or the callback changes
    // to prevent multiple calls if other state updates trigger re-renders.
  }, [statusData, onKycApproved]);

  const refreshStatusMutation = api.align.refreshKycStatus.useMutation({
    onSuccess: (data) => {
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      toast.success('KYC status refreshed', {
        className: "bg-white border border-gray-200 shadow-md",
        position: "top-right",
        duration: 4000
      });
      
      // Cache the KYC link if it exists
      if (data.kycFlowLink) {
        localStorage.setItem(KYC_LINK_KEY, data.kycFlowLink);
      }
    },
    onError: (error) => {
      toast.error(`Failed to refresh KYC status: ${error.message}`, {
        className: "bg-white border border-gray-200 shadow-md",
        position: "top-right",
        duration: 4000
      });
    },
  });

  const createKycSessionMutation = api.align.createKycSession.useMutation({
    onSuccess: (data) => {
      console.log('[AlignKycStatus] createKycSession success data:', data);
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      toast.success('New KYC session created', {
        className: "bg-white border border-gray-200 shadow-md",
        position: "top-right",
        duration: 4000
      });
      
      // If there's a flow link, cache it and open it automatically
      if (data.kycFlowLink) {
        localStorage.setItem(KYC_LINK_KEY, data.kycFlowLink);
        openExternalKycFlow(data.kycFlowLink);
      }
    },
    onError: (error) => {
      toast.error(`Failed to create KYC session: ${error.message}`, {
        className: "bg-white border border-gray-200 shadow-md",
        position: "top-right",
        duration: 4000
      });
    },
  });

  const recoverCustomerMutation = api.align.recoverCustomer.useMutation({
    onSuccess: (data) => {
      // Ensure loading state is turned off first
      setIsCheckingExistingCustomer(false);
      console.log('[AlignKycStatus] recoverCustomer success data:', data);
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: getCustomerStatusQueryKey });
      setInitialCheckAttempted(true);
      
      if (data.recovered) {
        // Automatically proceed with the recovered customer
        toast.success('Successfully recovered your existing Align account', {
          className: "bg-white border border-gray-200 shadow-md",
          position: "top-right",
          duration: 4000
        });
        setShowRecoveryMessage(false);
        
        // If KYC is still pending or requires action, offer to continue
        if (data.kycStatus === 'pending') {
          // If there's a flow link, cache it and open it automatically
          if (data.kycFlowLink) {
            localStorage.setItem(KYC_LINK_KEY, data.kycFlowLink);
            openExternalKycFlow(data.kycFlowLink);
          }
        }
      } else if (data.alignCustomerId) {
        // Customer was already linked, maybe status needs refreshing
        setShowRecoveryMessage(false);
        toast.info('Account was already linked. Refreshing status.', {
          className: "bg-white border border-gray-200 shadow-md",
          position: "top-right",
          duration: 4000
        });
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

  const handleInitiateKyc = () => {
    setShowKycForm(true);
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
      // Cache the link before opening
      localStorage.setItem(KYC_LINK_KEY, flowLink);
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

  const openKycFlow = async () => {
    console.log('[AlignKycStatus] Attempting to open KYC flow. Current statusData:', statusData);
    // Try to use the most current link from statusData
    let flowLink = statusData?.kycFlowLink;
    
    // If no link in statusData, try cached link
    if (!flowLink) {
      flowLink = localStorage.getItem(KYC_LINK_KEY);
    }
    
    // If still no link, try to create a new session
    if (!flowLink) {
      console.log('[AlignKycStatus] No KYC link available. Creating new session...');
      try {
        await createKycSessionMutation.mutateAsync();
        await refetch();
        // After refresh, use the new link if available
        flowLink = statusData?.kycFlowLink || localStorage.getItem(KYC_LINK_KEY);
      } catch (error) {
        console.error('[AlignKycStatus] Failed to create new session:', error);
        toast.error('Could not create a new KYC session. Please try again.', {
          className: "bg-white border border-gray-200 shadow-md",
          position: "top-right",
          duration: 4000
        });
        return;
      }
    }
    
    if (flowLink) {
      console.log(`[AlignKycStatus] Opening link: ${flowLink}`);
      openExternalKycFlow(flowLink);
    } else {
      console.warn('[AlignKycStatus] Cannot open KYC flow: failed to get a valid KYC link.');
      toast.error('KYC link not available. Please try refreshing the status or creating a new session.', {
        className: "bg-white border border-gray-200 shadow-md",
        position: "top-right",
        duration: 4000
      });
    }
  };

  const copyKycLink = async () => {
    // Try to use the most current link from statusData
    let flowLink = statusData?.kycFlowLink;
    
    // If no link in statusData, try cached link
    if (!flowLink) {
      flowLink = localStorage.getItem(KYC_LINK_KEY);
    }
    
    // If still no link, try to create a new session
    if (!flowLink) {
      console.log('[AlignKycStatus] No KYC link available for copying. Creating new session...');
      try {
        await createKycSessionMutation.mutateAsync();
        await refetch();
        // After refresh, use the new link if available
        flowLink = statusData?.kycFlowLink || localStorage.getItem(KYC_LINK_KEY);
      } catch (error) {
        console.error('[AlignKycStatus] Failed to create new session for copy:', error);
        toast.error('Could not create a new KYC session to copy. Please try again.', {
          className: "bg-white border border-gray-200 shadow-md",
          position: "top-right",
          duration: 4000
        });
        return;
      }
    }
    
    if (flowLink) {
      try {
        await navigator.clipboard.writeText(flowLink);
        toast.success('KYC link copied to clipboard', {
          className: "bg-white border border-gray-200 shadow-md",
          position: "top-right",
          duration: 4000
        });
        
        // Mark as visited when they copy the link
        localStorage.setItem(KYC_VISITED_KEY, Date.now().toString());
        setHasVisited(true);
      } catch (error) {
        console.error('Failed to copy:', error);
        toast.error('Failed to copy the link. Please try again.', {
          className: "bg-white border border-gray-200 shadow-md",
          position: "top-right",
          duration: 4000
        });
      }
    } else {
      toast.error('No KYC link available to copy', {
        className: "bg-white border border-gray-200 shadow-md",
        position: "top-right",
        duration: 4000
      });
    }
  };

  const openExternalKycFlow = (link: string) => {
    setIsOpening(true);
    
    // Mark as visited
    localStorage.setItem(KYC_VISITED_KEY, Date.now().toString());
    setHasVisited(true);
    
    // Clear previous window closed state
    localStorage.removeItem(KYC_WINDOW_CLOSED_KEY);
    setWindowClosed(false);
    
    // Open the window and save reference
    popupWindowRef.current = window.open(link, '_blank');
    
    // Set up polling to check if window is closed
    if (popupWindowRef.current) {
      // Clear any existing interval
      if (popupCheckIntervalRef.current) {
        clearInterval(popupCheckIntervalRef.current);
      }
      
      // Set up new interval to check window.closed
      popupCheckIntervalRef.current = setInterval(() => {
        if (popupWindowRef.current && popupWindowRef.current.closed) {
          console.log('[AlignKycStatus] KYC window has been closed');
          localStorage.setItem(KYC_WINDOW_CLOSED_KEY, '1');
          setWindowClosed(true);
          
          // Clear the interval since we no longer need to check
          if (popupCheckIntervalRef.current) {
            clearInterval(popupCheckIntervalRef.current);
            popupCheckIntervalRef.current = null;
          }
        }
      }, 1000); // Check every second
    }
    
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
    const hasFlowLink = !!statusData.kycFlowLink;
    
    // Special case: Pending with window closed means user has submitted docs
    if (status === 'pending' && hasVisited && windowClosed) {
      return {
        title: 'Documents Submitted',
        description: 'Your documents have been submitted and are being reviewed by Align. This usually takes less than 12 hours.',
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      };
    }

    switch (status) {
      case 'approved':
        return {
          title: 'Approved',
          description: 'Your identity has been verified. You can now request a virtual account.',
          icon: <CheckCircle className="h-5 w-5 text-primary" />,
        };
      case 'pending':
        return {
          title: hasFlowLink ? 'Pending Verification' : 'Action Required',
          description: hasFlowLink ? 'Your identity verification is processing via Align. This can take a few minutes to several hours. Please check back later. You can refresh the status below.' : 'Your identity verification is pending. Please continue the verification process.',
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
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

  // Extract the main content to be used with or without card wrapper
  const contentElement = (
    <>
      <div className="flex items-center gap-3">
        {isLoading || isCheckingExistingCustomer ? (
          <AlertCircle className="h-5 w-5 text-gray-500" />
        ) : (
          statusInfo.icon
        )}
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {isLoading || isCheckingExistingCustomer ? 'Checking Status...' : statusInfo.title}
          </div>
          <div className="text-xs text-gray-500">
            {isLoading || isCheckingExistingCustomer ? 'Please wait while we check your KYC status...' : statusInfo.description}
          </div>
        </div>
      </div>
      {/* Requirements (minimal, inline, only if not approved) */}
      {statusData?.kycStatus !== 'approved' && (
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 flex items-start gap-2 text-xs text-blue-900">
          <AlertCircle className="h-4 w-4 mt-0.5 text-blue-500 shrink-0" />
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
      {/* Pending positive feedback */}
      {statusData?.kycStatus === 'pending' && (
        <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 flex items-start gap-2 text-xs text-green-900">
          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
          <div>
            <div className="font-semibold mb-1">Submitted for review</div>
            <div>Your verification information has been submitted and is under review.</div>
          </div>
        </div>
      )}
    </>
  );

  // In the actionsElement section, simplify the button layout to prevent overflow
  const actionsElement = (
    <>
      {isCheckingExistingCustomer ? (
        <Button disabled variant="outline" className="w-full text-gray-500">
          Checking Account Status...
        </Button>
      ) : showRecoveryMessage ? (
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleRecoverCustomer} 
            disabled={recoverCustomerMutation.isPending}
            className="flex-1 bg-amber-600 text-white hover:bg-amber-700"
          >
            {recoverCustomerMutation.isPending ? "Processing..." : "Recover Account"}
          </Button>
          <Button 
            onClick={() => setShowRecoveryMessage(false)} 
            variant="outline"
            className="flex-1 text-gray-500"
          >
            Cancel
          </Button>
        </div>
      ) : statusData?.kycStatus === 'none' || !statusData || isLoading ? (
        <Button 
          onClick={handleInitiateKyc} 
          className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
        >
          Start KYC Process
        </Button>
      ) : statusData.kycStatus === 'pending' ? (
        <div className="w-full flex flex-col gap-2">
          {/* Simplified layout for pending states */}
          {(hasVisited && windowClosed) ? (
            // When window is closed (docs submitted) - focus on refresh status and secondary actions
            <>
              <Button 
                onClick={handleRefreshStatus} 
                disabled={refreshStatusMutation.isPending}
                className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
              >
                {refreshStatusMutation.isPending ? "Refreshing..." : "Refresh Status"}
              </Button>
              
              {/* Secondary actions in a more compact row */}
              <div className="flex gap-2 w-full">
                <Button 
                  onClick={openKycFlow} 
                  variant="outline"
                  className="flex-1"
                >
                  Reopen Verification
                </Button>
                <Button 
                  onClick={copyKycLink} 
                  variant="outline"
                  className="shrink-0"
                  title="Copy verification link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : statusData.kycFlowLink ? (
            // When link is available but window not yet closed
            <>
              <Button 
                onClick={openKycFlow} 
                disabled={isOpening}
                className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
              >
                {isOpening ? "Opening..." : "Continue Verification"}
              </Button>
              
              {/* Secondary actions in a row */}
              <div className="flex gap-2 w-full">
                <Button 
                  onClick={handleRefreshStatus} 
                  disabled={refreshStatusMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  {refreshStatusMutation.isPending ? "Refreshing..." : "Refresh Status"}
                </Button>
                <Button 
                  onClick={copyKycLink} 
                  variant="outline"
                  className="shrink-0"
                  title="Copy verification link"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            // No link available - create new session
            <Button 
              onClick={handleCreateKycSession} 
              disabled={createKycSessionMutation.isPending}
              className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
            >
              {createKycSessionMutation.isPending ? "Creating Session..." : "Create New KYC Session"}
            </Button>
          )}
        </div>
      ) : statusData.kycStatus === 'rejected' ? (
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleCreateKycSession} 
            disabled={createKycSessionMutation.isPending}
            className="flex-1 bg-primary text-white hover:bg-primary/90 font-semibold"
          >
            {createKycSessionMutation.isPending ? "Creating Session..." : "Try Again"}
          </Button>
          <Button 
            onClick={handleRefreshStatus} 
            disabled={refreshStatusMutation.isPending}
            variant="outline"
            className="flex-1 text-gray-500"
          >
            {refreshStatusMutation.isPending ? "Refreshing..." : "Refresh Status"}
          </Button>
        </div>
      ) : ( 
        <Button 
          onClick={handleRefreshStatus} 
          disabled={refreshStatusMutation.isPending}
          variant="outline"
          className="w-full text-gray-500"
        >
          {refreshStatusMutation.isPending ? "Refreshing..." : "Refresh Status"}
        </Button>
      )}
    </>
  );

  // If showing KYC form, render that instead of the status card
  if (showKycForm) {
    return <AlignKycForm onCompleted={handleFormCompleted} />;
  }

  // Check if this is in an onboarding page context and we're not in the embedded variant
  const isOnboardingPage = typeof window !== 'undefined' && window.location.pathname.includes('/onboarding/');

  // Choose the rendering pattern based on the variant prop
  if (variant === 'embedded') {
    // No card wrapper for embedded version - just the content and actions
    return (
      <div className="space-y-4 w-full">
        {contentElement}
        <div className="w-full flex flex-col gap-3 pt-4 border-t border-gray-100">
          {actionsElement}
        </div>
      </div>
    );
  }

  // Standalone version with card wrapper (original)
  return (
    <Card className="mb-6 w-full bg-white border border-gray-100 shadow-sm rounded-xl">
      <CardHeader className="pb-1 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-base text-gray-800">Get a Virtual Account</span>
        </div>
        <CardDescription className="text-xs text-gray-500 mt-1">
          To get a virtual account, complete the KYC process.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 py-5">
        {contentElement}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 bg-gray-50 rounded-b-xl px-4 py-3">
        {actionsElement}
      </CardFooter>
    </Card>
  );
}