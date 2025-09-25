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
      const hasDefaultName = workspaceData.workspace.name === 'Personal Workspace';
      
      // Redirect to welcome if:
      // 1. User has default workspace name (new user)
      // 2. AND hasn't completed or skipped welcome before
      if (hasDefaultName && !hasCompletedWelcome) {
        router.push('/welcome');
      }
    }
  }, [workspaceData, isLoading, router, hasChecked]);

  return <>{children}</>;
}
