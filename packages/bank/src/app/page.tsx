'use client';

import { useEffect } from 'react';
import { usePrivy, useLogin } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated }) => {
      console.log('Privy login complete', { 
        userId: user.id, 
        isNewUser, 
        wasAlreadyAuthenticated 
      });
      // Redirect handled by useEffect below
    },
    onError: (error) => {
      console.error('Privy login error:', error);
      // Handle login errors (e.g., show a toast message)
    },
  });

  // Redirect to dashboard if authenticated
  useEffect(() => {
    if (ready && authenticated) {
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  // Disable login button until Privy is ready
  const disableLogin = !ready || authenticated;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-background">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center max-w-sm w-full border border-primary/20">
        <h1 className="text-3xl font-bold text-primary mb-2">Hypr Bank</h1>
        <p className="text-gray-600 mb-6">Your Automated Web3 Treasury</p>
        
        {ready && !authenticated && (
          <Button 
            onClick={login} 
            disabled={disableLogin}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            Sign In / Sign Up
          </Button>
        )}

        {!ready && (
           <div className="flex justify-center items-center text-gray-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Loading Authentication...</span>
           </div>
        )}

        {ready && authenticated && (
           <div className="flex justify-center items-center text-green-600">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Redirecting to Dashboard...</span>
           </div>
        )}
      </div>
    </div>
  );
}