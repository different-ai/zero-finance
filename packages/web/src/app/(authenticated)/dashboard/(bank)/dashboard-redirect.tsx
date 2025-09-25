'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export function DashboardRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);
  const { data: workspaceData, isLoading } = api.workspace.getOrCreateWorkspace.useQuery();

  useEffect(() => {
    // Don't check until workspace data is loaded
    if (isLoading || hasChecked) return;
    
    // Only check once per mount
    setHasChecked(true);

    if (workspaceData?.workspace) {
      const hasCompletedWelcome = localStorage.getItem('company_name_collected');
      const workspaceName = workspaceData.workspace.name;
      const hasDefaultName = workspaceName === 'Personal Workspace';
      
      // Check if the workspace has a suspiciously short or test-like name
      const hasInvalidName = hasDefaultName || 
                            !workspaceName || 
                            workspaceName.length < 2 ||
                            workspaceName.toLowerCase() === 'test' ||
                            workspaceName.toLowerCase() === 'fdsf';
      
      // Redirect to welcome if:
      // 1. User has invalid/default workspace name
      // 2. AND hasn't explicitly completed or skipped welcome
      if (hasInvalidName && hasCompletedWelcome !== 'true') {
        console.log('Redirecting to welcome - invalid company name:', workspaceName);
        router.push('/welcome');
      }
    }
  }, [workspaceData, isLoading, router, hasChecked]);

  return <>{children}</>;
}
