import { Button } from '@/components/ui/button'
import { track } from '@vercel/analytics/react'
import { trpc } from '@/utils/trpc'
import { AlertTriangle, Copy, Loader2, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

type KycStatus =
  | 'NOT_STARTED'
  | 'PENDING_REVIEW'
  | 'IN_PROGRESS'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'MANUAL_REVIEW'
  | 'ACTION_REQUIRED'

type KycStep =
  | 'loading'
  | 'error'
  | 'notStarted'
  | 'showKycIframe' // New step for showing the iframe
  | 'pendingReview'
  | 'verified'
  | 'rejected'
  | 'expired'
  | 'manualReview'
  | 'actionRequired' // Kept for cases where iframe cannot be shown initially or after an issue

interface AlignKycStatusProps {
  userId: string
  alignAccountId: string | null
  kycStatus: KycStatus | null
  kycFlowLink: string | null
  onKycSubmitted?: () => void
  onKycVerified?: () => void
}

export function AlignKycStatus({
  userId,
  alignAccountId,
  kycStatus: initialKycStatus,
  kycFlowLink: initialKycFlowLink,
  onKycSubmitted,
  onKycVerified,
}: AlignKycStatusProps) {
  const [currentStep, setCurrentStep] = useState<KycStep>('loading')
  const [kycStatus, setKycStatus] = useState<KycStatus | null>(
    initialKycStatus,
  )
  const [kycFlowLink, setKycFlowLink] = useState<string | null>(
    initialKycFlowLink,
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const utils = trpc.useUtils()

  const createKycSession = trpc.settings.createAlignKycSession.useMutation({
    onSuccess: (data) => {
      setKycFlowLink(data.kycLink)
      setKycStatus('IN_PROGRESS') // Assume in progress once link is generated
      setCurrentStep('showKycIframe') // Directly show iframe
      setErrorMessage(null)
      toast.success('KYC session created. Please complete the form below.')
    },
    onError: (error) => {
      setErrorMessage(
        `Failed to create KYC session: ${error.message}. Please try again.`,
      )
      setCurrentStep('error')
      toast.error('Failed to create KYC session.')
    },
  })

  const refreshKycStatus = trpc.settings.refreshAlignKycStatus.useMutation({
    onSuccess: (data) => {
      setKycStatus(data.kycStatus as KycStatus)
      if (data.kycLink) {
        setKycFlowLink(data.kycLink)
      }
      // Logic to determine step based on new status
      if (data.kycStatus === 'VERIFIED') {
        setCurrentStep('verified')
        if (onKycVerified) onKycVerified()
      } else if (data.kycStatus === 'PENDING_REVIEW') {
        setCurrentStep('pendingReview')
      } else if (data.kycStatus === 'IN_PROGRESS' && data.kycLink) {
        setCurrentStep('showKycIframe')
      } else if (data.kycStatus === 'REJECTED') {
        setCurrentStep('rejected')
      } else if (data.kycStatus === 'EXPIRED') {
        setCurrentStep('expired')
      } else if (data.kycStatus === 'MANUAL_REVIEW') {
        setCurrentStep('manualReview')
      } else if (data.kycStatus === 'ACTION_REQUIRED' && data.kycLink) {
        setCurrentStep('showKycIframe') // Show iframe if action is required and link exists
      } else if (data.kycStatus === 'ACTION_REQUIRED' && !data.kycLink) {
        setCurrentStep('actionRequired') // Fallback if no link for action_required
        setErrorMessage("KYC requires action, but we couldn't retrieve the form link. Please try refreshing or contact support.")
      } else if (data.kycStatus === 'NOT_STARTED') {
        setCurrentStep('notStarted')
      } else {
        // Default to a state that prompts user to start or refresh
        setCurrentStep('notStarted') // Or 'actionRequired' if more appropriate
      }
      toast.success('KYC status refreshed.')
    },
    onError: (error) => {
      setErrorMessage(
        `Failed to refresh KYC status: ${error.message}. Please try again.`,
      )
      setCurrentStep('error') // Or a more specific error state if needed
      toast.error('Failed to refresh KYC status.')
    },
    onSettled: () => {
      utils.settings.getAlignSettings.invalidate() // Invalidate cache for parent component
    },
  })

  useEffect(() => {
    if (kycStatus === 'VERIFIED') {
      setCurrentStep('verified')
      if (onKycVerified) onKycVerified()
    } else if (kycStatus === 'PENDING_REVIEW') {
      setCurrentStep('pendingReview')
    } else if (kycStatus === 'IN_PROGRESS' && kycFlowLink) {
      setCurrentStep('showKycIframe')
    } else if (kycStatus === 'REJECTED') {
      setCurrentStep('rejected')
    } else if (kycStatus === 'EXPIRED') {
      setCurrentStep('expired')
    } else if (kycStatus === 'MANUAL_REVIEW') {
      setCurrentStep('manualReview')
    } else if (kycStatus === 'ACTION_REQUIRED' && kycFlowLink) {
      setCurrentStep('showKycIframe')
    } else if (kycStatus === 'ACTION_REQUIRED' && !kycFlowLink) {
      setCurrentStep('actionRequired')
      setErrorMessage("KYC action required, but we couldn't load the form. Try refreshing the status or creating a new session.")
    } else if (kycStatus === 'NOT_STARTED') {
      setCurrentStep('notStarted')
    } else if (!kycStatus && !kycFlowLink && alignAccountId) {
      // If status and link are null but account exists, try to refresh
      // This handles cases where props might be stale on initial load
      refreshKycStatus.mutate({ userId })
    } else if (!alignAccountId) {
      // If there's no alignAccountId, it implies the user hasn't set up an Align account yet.
      // This state shouldn't ideally be reached if parent components gate this, but as a fallback:
      setCurrentStep('notStarted') // Or a new step like 'alignAccountMissing'
      setErrorMessage('Align account not found. Please set up your Align account first.')
    } else {
      // Fallback or initial loading state if no other conditions met
      setCurrentStep('loading')
    }
  }, [kycStatus, kycFlowLink, alignAccountId, userId, onKycVerified])


  const handleStartKyc = async () => {
    if (!alignAccountId) {
      toast.error(
        'Align account ID is missing. Cannot start KYC.',
      )
      setErrorMessage('Align account ID is missing.')
      setCurrentStep('error')
      return
    }
    track('Start Align KYC', { userId })
    createKycSession.mutate({ userId, alignAccountId })
  }

  const handleRefreshStatus = async () => {
    track('Refresh Align KYC Status', { userId })
    refreshKycStatus.mutate({ userId })
  }

  const handleCopyLink = () => {
    if (kycFlowLink) {
      navigator.clipboard.writeText(kycFlowLink)
      toast.success('KYC link copied to clipboard!')
      track('Copy Align KYC Link', { userId })
    }
  }
  
  const handleKycFormCompleted = () => {
    setIsSubmitting(true)
    // Optimistically set to pending review
    // setCurrentStep('pendingReview') 
    // No, we should refresh the status from the backend to get the true state.
    toast.info("We've noted you've completed the form. Refreshing status...")
    refreshKycStatus.mutate({ userId }) // Refresh status to see if it's PENDING_REVIEW or other
    if (onKycSubmitted) {
      onKycSubmitted()
    }
    setIsSubmitting(false)
     // Invalidate queries to refetch data for parent/dependent components
    utils.settings.getAlignSettings.invalidate()
  }


  const renderContent = () => {
    switch (currentStep) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-gray-600">Loading KYC status...</p>
          </div>
        )
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-6 bg-red-50 text-red-700 rounded-lg shadow">
            <AlertTriangle className="h-8 w-8 mb-3" />
            <p className="text-sm font-semibold">Error</p>
            <p className="text-xs text-center mb-4">{errorMessage}</p>
            <Button onClick={handleRefreshStatus} disabled={refreshKycStatus.isLoading || createKycSession.isLoading}>
              {refreshKycStatus.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Try Refreshing Status
            </Button>
            <Button onClick={handleStartKyc} variant="outline" className="mt-2" disabled={createKycSession.isLoading || refreshKycStatus.isLoading}>
              {createKycSession.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create New KYC Session
            </Button>
          </div>
        )
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
            <Button onClick={handleStartKyc} disabled={createKycSession.isLoading}>
              {createKycSession.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start KYC Verification
            </Button>
          </div>
        )
      case 'showKycIframe':
        if (!kycFlowLink) {
          return (
            <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow">
              <AlertTriangle className="h-8 w-8 mb-3" />
              <p className="text-sm font-semibold">KYC Link Missing</p>
              <p className="text-xs text-center mb-4">
                The KYC form link is not available. Please try creating a new session or refresh the status.
              </p>
              <Button onClick={handleStartKyc} className="mb-2" disabled={createKycSession.isLoading || refreshKycStatus.isLoading}>
                {createKycSession.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reload KYC Form (New Session)
              </Button>
              <Button onClick={handleRefreshStatus} variant="outline" disabled={refreshKycStatus.isLoading || createKycSession.isLoading}>
                {refreshKycStatus.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refresh Status
              </Button>
            </div>
          )
        }
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              Complete Your KYC Verification
            </h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Please fill out the form below. If the form doesn't load or you encounter issues, you can try reloading it or copy the link to open in a new tab.
            </p>
            <div className="aspect-[9/16] md:aspect-video w-full max-w-2xl mx-auto mb-4 border border-gray-300 rounded-md overflow-hidden">
              <iframe
                src={kycFlowLink}
                title="KYC Verification"
                className="w-full h-full"
                allow="camera; microphone"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <Button 
                onClick={handleKycFormCompleted} 
                disabled={isSubmitting || refreshKycStatus.isLoading}
                className="w-full sm:w-auto"
              >
                {isSubmitting || refreshKycStatus.isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                I've Finished My Verification
              </Button>
              <Button 
                onClick={handleStartKyc} 
                variant="outline"
                className="w-full sm:w-auto" 
                disabled={createKycSession.isLoading || refreshKycStatus.isLoading}>
                {createKycSession.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reload KYC Form (New Session)
              </Button>
              <Button 
                onClick={handleCopyLink} 
                variant="ghost" 
                size="sm" 
                className="w-full sm:w-auto"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </Button>
            </div>
          </div>
        )
      case 'pendingReview':
        return (
          <div className="p-6 bg-blue-50 text-blue-700 rounded-lg shadow text-center">
            <Loader2 className="h-8 w-8 animate-spin mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">
              Verification Pending Review
            </h3>
            <p className="text-sm mb-4">
              Your KYC information has been submitted and is currently under
              review. This usually takes a few minutes to a couple of hours. We'll notify you once it's processed.
            </p>
            <Button onClick={handleRefreshStatus} disabled={refreshKycStatus.isLoading}>
              {refreshKycStatus.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Refresh Status
            </Button>
          </div>
        )
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
        )
      case 'rejected':
        return (
          <div className="p-6 bg-red-50 text-red-700 rounded-lg shadow text-center">
            <AlertTriangle className="h-8 w-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">
              KYC Verification Rejected
            </h3>
            <p className="text-sm mb-4">
              Unfortunately, your KYC verification was rejected. This might be due
              to unclear documents or mismatched information. Please try again.
            </p>
            <Button onClick={handleStartKyc} disabled={createKycSession.isLoading}>
              {createKycSession.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Retry KYC Verification
            </Button>
          </div>
        )
      case 'expired':
        return (
          <div className="p-6 bg-yellow-50 text-yellow-700 rounded-lg shadow text-center">
            <AlertTriangle className="h-8 w-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">KYC Session Expired</h3>
            <p className="text-sm mb-4">
              Your KYC verification session has expired. Please start a new one.
            </p>
            <Button onClick={handleStartKyc} disabled={createKycSession.isLoading}>
              {createKycSession.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Start New KYC Session
            </Button>
          </div>
        )
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
            <Button onClick={handleRefreshStatus} disabled={refreshKycStatus.isLoading}>
              {refreshKycStatus.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Refresh Status
            </Button>
          </div>
        )
      case 'actionRequired':
        // This state is now primarily for when a link cannot be obtained for an ACTION_REQUIRED status
        // Or if kycFlowLink is null but status is ACTION_REQUIRED
        return (
          <div className="p-6 bg-orange-50 text-orange-700 rounded-lg shadow text-center">
            <AlertTriangle className="h-8 w-8 mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">Action Required</h3>
            <p className="text-sm mb-2">
              Your KYC verification requires further action. This could be due to missing information or other issues.
            </p>
            {errorMessage && <p className="text-xs text-orange-600 mb-3">{errorMessage}</p>}
            <p className="text-sm mb-4">
              Please try creating a new KYC session to address the required actions. If the problem persists, contact support.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <Button onClick={handleStartKyc} disabled={createKycSession.isLoading || refreshKycStatus.isLoading} className="w-full sm:w-auto">
                {createKycSession.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create New KYC Session
              </Button>
              <Button onClick={handleRefreshStatus} variant="outline" disabled={refreshKycStatus.isLoading || createKycSession.isLoading} className="w-full sm:w-auto">
                {refreshKycStatus.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refresh Status
              </Button>
            </div>
            {kycFlowLink && ( // Still provide copy link if by some chance it exists but iframe isn't shown
                <Button 
                  onClick={handleCopyLink} 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 w-full sm:w-auto"
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Link (If Available)
                </Button>
            )}
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow">
      {renderContent()}
    </div>
  )
} 