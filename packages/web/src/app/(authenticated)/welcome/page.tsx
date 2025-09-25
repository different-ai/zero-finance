'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { user, ready, authenticated } = usePrivy();
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: workspaceData, isLoading: workspaceLoading } = api.workspace.getOrCreateWorkspace.useQuery(undefined, {
    enabled: ready && authenticated,
  });
  
  const updateCompanyMutation = api.workspace.updateCompanyName.useMutation();

  useEffect(() => {
    // Only redirect if not authenticated
    if (ready && !authenticated) {
      router.push('/signin');
    }
  }, [ready, authenticated, router]);

  // Pre-fill company name if workspace already has one
  useEffect(() => {
    if (workspaceData?.workspace && 
        workspaceData.workspace.name !== 'Personal Workspace' &&
        !companyName) {
      setCompanyName(workspaceData.workspace.name);
    }
  }, [workspaceData, companyName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim() || !workspaceData?.workspaceId) {
      return;
    }

    setIsLoading(true);

    try {
      await updateCompanyMutation.mutateAsync({
        workspaceId: workspaceData.workspaceId,
        companyName: companyName.trim(),
        userName: user?.google?.name || user?.email?.address?.split('@')[0],
        userEmail: user?.email?.address || user?.google?.email,
      });

      // Mark as completed
      localStorage.setItem('company_name_collected', 'true');
      
      // Go to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update company name:', error);
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
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#101010]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#101010]/10 rounded-[12px] p-8 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
          <div className="space-y-6">
            <div>
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                WELCOME TO ZERO FINANCE
              </p>
              <h1 className="font-serif text-[32px] sm:text-[36px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
                Let's get started
              </h1>
              <p className="mt-3 text-[#101010]/60 text-[15px] leading-relaxed">
                Tell us about your company to personalize your experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label 
                  htmlFor="company-name" 
                  className="text-[13px] font-medium text-[#101010]/80 uppercase tracking-wider"
                >
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-12 border-[#101010]/10 focus:border-[#101010]/20 text-[15px]"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  disabled={!companyName.trim() || isLoading}
                  className="w-full h-12 bg-[#101010] text-white hover:bg-[#101010]/90 font-medium text-[15px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    'Continue to Dashboard'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full h-10 text-[#101010]/60 hover:text-[#101010] text-[14px]"
                >
                  Skip for now
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
