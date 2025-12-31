'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Banknote,
  Cpu,
  Mail,
  Copy,
  Check,
} from 'lucide-react';
import GeneratedComponent from '@/app/(landing)/welcome-gradient';
import { cn } from '@/lib/utils';
import { EnsureEmbeddedWallet } from '@/components/auth/ensure-embedded-wallet';
import {
  StepStatus,
  usePrimaryAccountSetup,
} from '@/hooks/use-primary-account-setup';
import { toast } from 'sonner';

export default function WelcomePage() {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceStatus, setWorkspaceStatus] = useState<StepStatus>('pending');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showAiEmailIntro, setShowAiEmailIntro] = useState(false);
  const [fundingMode, setFundingMode] = useState<'bank' | 'crypto'>('bank');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { data: workspaceData, isLoading: workspaceLoading } =
    api.workspace.getOrCreateWorkspaceV2.useQuery(undefined, {
      enabled: ready && authenticated,
    });

  // Fetch AI email address after setup completes
  const { data: aiEmailData } = api.workspace.getAiEmailAddress.useQuery(
    { workspaceId: workspaceData?.workspaceId ?? '' },
    { enabled: !!workspaceData?.workspaceId && isSetupComplete },
  );

  const handleCopyEmail = async () => {
    if (aiEmailData?.email) {
      await navigator.clipboard.writeText(aiEmailData.email);
      setCopiedEmail(true);
      toast.success('Email address copied!');
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const updateCompanyMutation = api.workspace.updateCompanyName.useMutation();
  const {
    progress,
    isRunning: isSettingUp,
    error: setupError,
    runSetup,
    reset,
  } = usePrimaryAccountSetup();

  const isProcessing = updateCompanyMutation.isPending || isSettingUp;

  useEffect(() => {
    // Only redirect if not authenticated
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim() || !workspaceData?.workspaceId) {
      return;
    }

    setSubmissionError(null);
    setWorkspaceStatus('in_progress');

    // Save the funding mode preference to localStorage
    try {
      const isTechnical = fundingMode === 'crypto';
      localStorage.setItem('zero-finance-bimodal-mode', String(isTechnical));
    } catch (e) {
      // localStorage not available, continue anyway
    }

    try {
      await updateCompanyMutation.mutateAsync({
        workspaceId: workspaceData.workspaceId,
        companyName: workspaceName.trim(),
        userName: user?.google?.name || user?.email?.address?.split('@')[0],
        userEmail: user?.email?.address || user?.google?.email,
      });
      setWorkspaceStatus('success');
    } catch (error) {
      console.error('Failed to update workspace name:', error);
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      setSubmissionError(message);
      setWorkspaceStatus('error');
      return;
    }

    try {
      await runSetup();
      setIsSetupComplete(true);
      setShowAiEmailIntro(true);
    } catch (error) {
      console.error('Primary account setup failed:', error);
    }
  };

  const handleContinueToDashboard = () => {
    router.push('/dashboard');
  };

  const handleRetry = async () => {
    setSubmissionError(null);
    setWorkspaceStatus('success');
    reset();
    try {
      await runSetup();
      setIsSetupComplete(true);
      router.push('/dashboard');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      setSubmissionError(message);
    }
  };

  const statusItems = useMemo(() => {
    return [
      {
        title: 'Save workspace details',
        status: workspaceStatus,
        detail:
          workspaceStatus === 'success'
            ? `Workspace set to ${workspaceName.trim()}`
            : undefined,
      },
      ...progress.map((item) => ({
        title: item.label,
        status: item.status,
        detail: item.detail,
      })),
    ];
  }, [progress, workspaceName, workspaceStatus]);

  const canRetrySetup = workspaceStatus === 'success' && !!setupError;

  if (!ready || !authenticated || workspaceLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0050ff] border-t-transparent" />
      </div>
    );
  }

  const renderStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="h-5 w-5 animate-spin text-[#0050ff]" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  // AI Email Introduction View
  if (showAiEmailIntro) {
    return (
      <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
        <GeneratedComponent className="z-0 bg-[#F6F5EF]" />
        <div className="relative z-10 w-full max-w-[500px] px-4">
          <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
            <div className="space-y-6">
              {/* Success Header */}
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
                </div>
                <p className="uppercase tracking-[0.14em] text-[11px] font-medium text-[#10B981] mb-2">
                  ACCOUNT READY
                </p>
                <h1 className="font-serif text-[32px] sm:text-[40px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                  You&apos;re all set!
                </h1>
              </div>

              {/* AI Email Feature Intro */}
              <div className="bg-[#1B29FF]/5 border border-[#1B29FF]/20 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#1B29FF]/10 rounded-full">
                    <Mail className="h-5 w-5 text-[#1B29FF]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-medium text-[#101010]">
                      Meet your AI assistant
                    </h3>
                    <p className="text-[12px] text-[#101010]/60">
                      Create invoices by forwarding emails
                    </p>
                  </div>
                </div>

                {aiEmailData?.email ? (
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[#101010]/50">
                      Your AI Email Address
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white border border-[#101010]/10 px-4 py-3 rounded">
                        <code className="text-[13px] font-medium text-[#101010]">
                          {aiEmailData.email}
                        </code>
                      </div>
                      <button
                        onClick={handleCopyEmail}
                        className="h-12 w-12 flex items-center justify-center border border-[#101010]/10 rounded hover:bg-[#F7F7F2] transition-colors"
                        title="Copy email address"
                      >
                        {copiedEmail ? (
                          <Check className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <Copy className="h-4 w-4 text-[#101010]/60" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-12 animate-pulse bg-[#101010]/5 rounded" />
                )}

                <div className="space-y-2 pt-2">
                  <p className="text-[12px] font-medium text-[#101010]/80">
                    How it works:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-[12px] text-[#101010]/60">
                    <li>
                      Forward any email with invoice details to this address
                    </li>
                    <li>AI extracts recipient, amount, and description</li>
                    <li>Reply YES to send the invoice to your client</li>
                  </ol>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleContinueToDashboard}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-[#0050ff] hover:bg-[#0040dd] rounded-md transition-colors"
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              {/* Footer note */}
              <p className="text-[12px] text-[#101010]/50 text-center">
                You can always find your AI email address in{' '}
                <span className="text-[#101010]/70">
                  Settings → Integrations
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
      {/* Gradient Background - positioned behind content */}
      <GeneratedComponent className="z-0 bg-[#F6F5EF]" />

      {/* Content - positioned above gradient */}
      <div className="relative z-10 w-full max-w-[500px] px-4">
        <EnsureEmbeddedWallet />
        <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] font-medium text-[#101010]/70 mb-3">
                WELCOME TO ZERO FINANCE
              </p>
              <h1 className="font-serif text-[36px] sm:text-[44px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                Let&apos;s get started
              </h1>
              <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.5] text-[#101010]/70">
                Name your workspace to get started. You can create companies and
                invite team members later.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="workspace-name"
                  className="block text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium"
                >
                  Workspace Name
                </label>
                <input
                  id="workspace-name"
                  type="text"
                  placeholder="e.g., Acme Corp, My Freelance Business"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  disabled={isProcessing || isSetupComplete}
                  className="w-full h-12 px-4 border border-[#101010]/10 rounded-md text-[15px] sm:text-[16px] text-[#101010] placeholder:text-[#101010]/40 focus:border-[#0050ff] focus:outline-none focus:ring-1 focus:ring-[#0050ff]/20 transition-all disabled:bg-[#F2F2EC] disabled:text-[#101010]/50"
                  autoFocus
                />
                <p className="text-[12px] text-[#101010]/50 mt-1">
                  This is your personal workspace. You can create company
                  profiles separately.
                </p>
              </div>

              {/* Funding Mode Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#101010]/60 font-medium">
                  How will you fund your account?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Bank Transfer Option */}
                  <button
                    type="button"
                    onClick={() => setFundingMode('bank')}
                    disabled={isProcessing || isSetupComplete}
                    className={cn(
                      'relative p-4 rounded-lg border-2 text-left transition-all disabled:opacity-50',
                      fundingMode === 'bank'
                        ? 'border-[#0050ff] bg-[#0050ff]/5'
                        : 'border-[#101010]/10 hover:border-[#101010]/20 bg-white',
                    )}
                  >
                    {fundingMode === 'bank' && (
                      <div className="absolute top-2 right-2">
                        <div className="h-4 w-4 rounded-full bg-[#0050ff] flex items-center justify-center">
                          <svg
                            className="h-2.5 w-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Banknote
                        className={cn(
                          'h-5 w-5',
                          fundingMode === 'bank'
                            ? 'text-[#0050ff]'
                            : 'text-[#101010]/40',
                        )}
                      />
                      <span className="text-[13px] font-medium text-[#101010]">
                        Bank Transfer
                      </span>
                    </div>
                    <p className="text-[11px] text-[#101010]/60 leading-[1.4]">
                      ACH, wire, or SEPA transfers
                    </p>
                  </button>

                  {/* Crypto Option */}
                  <button
                    type="button"
                    onClick={() => setFundingMode('crypto')}
                    disabled={isProcessing || isSetupComplete}
                    className={cn(
                      'relative p-4 rounded-lg border-2 text-left transition-all disabled:opacity-50',
                      fundingMode === 'crypto'
                        ? 'border-[#1B29FF] bg-[#1B29FF]/5'
                        : 'border-[#101010]/10 hover:border-[#101010]/20 bg-white',
                    )}
                  >
                    {fundingMode === 'crypto' && (
                      <div className="absolute top-2 right-2">
                        <div className="h-4 w-4 rounded-full bg-[#1B29FF] flex items-center justify-center">
                          <svg
                            className="h-2.5 w-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu
                        className={cn(
                          'h-5 w-5',
                          fundingMode === 'crypto'
                            ? 'text-[#1B29FF]'
                            : 'text-[#101010]/40',
                        )}
                      />
                      <span className="text-[13px] font-medium text-[#101010]">
                        Cryptocurrency
                      </span>
                    </div>
                    <p className="text-[11px] text-[#101010]/60 leading-[1.4]">
                      USDC on Base network
                    </p>
                  </button>
                </div>
                <p className="text-[11px] text-[#101010]/40 mt-1">
                  You can change this anytime in Settings → Preferences
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={
                    !workspaceName.trim() || isProcessing || isSetupComplete
                  }
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#0050ff] hover:bg-[#0040dd] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your account...
                    </>
                  ) : isSetupComplete ? (
                    <>
                      Redirecting to Dashboard
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Continue to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Progress */}
            <div className="space-y-3 border border-[#101010]/10 rounded-md px-4 py-4 bg-[#F9F9F3]">
              <p className="text-[12px] uppercase tracking-[0.12em] text-[#101010]/60">
                Account Setup Progress
              </p>
              <ul className="space-y-3">
                {statusItems.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {renderStatusIcon(item.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#101010]">
                        {item.title}
                      </p>
                      {item.detail && (
                        <p className="text-xs text-[#101010]/70 mt-1">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {(submissionError || setupError) && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {submissionError || setupError}
                </div>
              )}

              {isSetupComplete && (
                <div className="rounded-md border border-[#0050ff]/20 bg-[#EAF0FF] px-3 py-2 text-sm text-[#0038cc]">
                  All set! Redirecting you to the dashboard.
                </div>
              )}

              {canRetrySetup && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#101010] hover:bg-[#040404] rounded-md transition-colors"
                >
                  Retry setup
                </button>
              )}
            </div>

            {/* Footer note */}
            <div className="pt-4 border-t border-[#101010]/10">
              <p className="text-[12px] sm:text-[13px] text-[#101010]/50 text-center">
                You can update workspace settings and create companies anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
