'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client component that guards routes requiring authentication
 * Redirects to home page if not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/?redirect=' + encodeURIComponent(window.location.pathname));
    }
  }, [ready, authenticated, router]);

  // Show nothing while loading
  if (!ready) {
    return null;
  }

  // Show fallback or nothing if not authenticated
  if (!authenticated) {
    return fallback || null;
  }

  // Show children if authenticated
  return <>{children}</>;
}