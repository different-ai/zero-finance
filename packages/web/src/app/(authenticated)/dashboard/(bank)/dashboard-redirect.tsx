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
      // Check if user has explicitly completed the welcome flow
      const welcomeStatus = localStorage.getItem('company_name_collected');
      
      // If user hasn't explicitly completed welcome (either 'true' or 'skipped')
      // then redirect them to welcome page
      if (!welcomeStatus) {
        console.log('No welcome status found, redirecting to welcome');
        router.push('/welcome');
      } else {
        console.log('Welcome already completed:', welcomeStatus);
      }
    }
  }, [workspaceData, isLoading, router, hasChecked]);

  return <>{children}</>;
}
