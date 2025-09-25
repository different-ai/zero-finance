'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export function DashboardRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: workspaceData } = api.workspace.getOrCreateWorkspace.useQuery();

  useEffect(() => {
    // Check if user has been shown welcome page in this session
    const shownInSession = sessionStorage.getItem('company_name_collected');
    if (shownInSession) {
      return; // Already handled in this session
    }

    // Check if this is a new user who needs to provide company name
    const hasCompletedWelcome = localStorage.getItem('company_name_collected');

    // Only redirect new users who haven't seen welcome and have default workspace name
    if (
      workspaceData?.workspace &&
      workspaceData.workspace.name === 'Personal Workspace' &&
      !hasCompletedWelcome
    ) {
      // Mark that we're showing the welcome page in this session
      sessionStorage.setItem('welcome_redirect_shown', 'true');
      router.push('/welcome');
    }
  }, [workspaceData, router]);

  return <>{children}</>;
}
