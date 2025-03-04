import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Client component that guards routes requiring authentication
 * Redirects to sign-in if not authenticated
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    }
  }, [isLoaded, userId, router]);

  // Show nothing while loading
  if (!isLoaded) {
    return null;
  }

  // Show fallback or nothing if not authenticated
  if (!userId) {
    return fallback || null;
  }

  // Show children if authenticated
  return <>{children}</>;
}