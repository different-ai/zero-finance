'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';
import { Loader2, ArrowRight } from 'lucide-react';
import { GradientBackground } from '@/app/(landing)/gradient-background';
import GeneratedComponent from '@/app/(landing)/welcome-gradient';

export default function WelcomePage() {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();
  const [workspaceName, setWorkspaceName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: workspaceData, isLoading: workspaceLoading } =
    api.workspace.getOrCreateWorkspace.useQuery(undefined, {
      enabled: ready && authenticated,
    });

  const updateCompanyMutation = api.workspace.updateCompanyName.useMutation();

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

    setIsLoading(true);

    try {
      await updateCompanyMutation.mutateAsync({
        workspaceId: workspaceData.workspaceId,
        companyName: workspaceName.trim(),
        userName: user?.google?.name || user?.email?.address?.split('@')[0],
        userEmail: user?.email?.address || user?.google?.email,
      });

      // Mark as completed
      localStorage.setItem('company_name_collected', 'true');

      // Go to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update workspace name:', error);
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark as collected to prevent future auto-redirects
    localStorage.setItem('company_name_collected', 'true');
    router.push('/dashboard');
  };

  if (!ready || !authenticated || workspaceLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0050ff] border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
      {/* Gradient Background - positioned behind content */}
      <GeneratedComponent className="z-0 bg-[#F6F5EF]" />
      
      {/* Content - positioned above gradient */}
      <div className="relative z-10 w-full max-w-[500px] px-4">
        <div className="bg-white/95 backdrop-blur-sm border border-[#101010]/10 rounded-lg shadow-[0_2px_8px_rgba(16,16,16,0.04)] p-8 sm:p-10">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[11px] sm:text-[12px] font-medium text-[#101010]/70 mb-3">
                WELCOME TO ZERO FINANCE
              </p>
              <h1 className="font-serif text-[36px] sm:text-[44px] leading-[0.96] tracking-[-0.015em] text-[#101010]">
                Let's get started
              </h1>
              <p className="mt-4 text-[15px] sm:text-[16px] leading-[1.5] text-[#101010]/70">
                Name your workspace to get started. You can create companies and invite team members later.
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
                  className="w-full h-12 px-4 border border-[#101010]/10 rounded-md text-[15px] sm:text-[16px] text-[#101010] placeholder:text-[#101010]/40 focus:border-[#0050ff] focus:outline-none focus:ring-1 focus:ring-[#0050ff]/20 transition-all"
                  autoFocus
                />
                <p className="text-[12px] text-[#101010]/50 mt-1">
                  This is your personal workspace. You can create company profiles separately.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={!workspaceName.trim() || isLoading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 text-[15px] sm:text-[16px] font-medium text-white bg-[#0050ff] hover:bg-[#0040dd] rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up your workspace...
                    </>
                  ) : (
                    <>
                      Continue to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full px-6 py-3 text-[14px] sm:text-[15px] text-[#101010]/60 hover:text-[#101010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip for now
                </button>
              </div>
            </form>

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
