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
} from 'lucide-react';
import { GradientBackground } from '@/app/(landing)/gradient-background';
import GeneratedComponent from '@/app/(landing)/welcome-gradient';
import { EnsureEmbeddedWallet } from '@/components/auth/ensure-embedded-wallet';
import {
  StepStatus,
  usePrimaryAccountSetup,
} from '@/hooks/use-primary-account-setup';

export default function WelcomePage() {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceStatus, setWorkspaceStatus] = useState<StepStatus>('pending');
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { data: workspaceData, isLoading: workspaceLoading } =
    api.workspace.getOrCreateWorkspaceV2.useQuery(undefined, {
      enabled: ready && authenticated,
    });

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
      router.push('/dashboard');
    } catch (error) {
      console.error('Primary account setup failed:', error);
    }
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
