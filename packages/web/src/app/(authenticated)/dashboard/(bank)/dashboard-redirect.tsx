'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/trpc/react';

export function DashboardRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: workspaceData } = api.workspace.getOrCreateWorkspace.useQuery();

  useEffect(() => {
    // Check if this is a new user who needs to provide company name
    const hasCompletedWelcome =
      localStorage.getItem('company_name_collected') === 'true';

    // If we have a workspace but it still has the default name and user hasn't completed welcome
    if (
      workspaceData?.workspace &&
      workspaceData.workspace.name === 'Personal Workspace' &&
      !hasCompletedWelcome
    ) {
      router.push('/welcome');
    }
  }, [workspaceData, router]);

  return <>{children}</>;
}
