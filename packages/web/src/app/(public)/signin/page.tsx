'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  const { login, authenticated, user } = usePrivy();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (authenticated) {
      // Use window.location for simple redirect outside Next router if needed,
      // or ideally use useRouter from next/navigation if this component is
      // within a Next.js layout that provides the router context.
      window.location.href = '/dashboard';
    }
  }, [authenticated]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Access your Zero Finance dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* Display minimal user info if somehow the page is hit while logged in before redirect */}
          {authenticated && user && (
            <p className="text-sm text-gray-600 mb-4">Already signed in as {user.email?.address ?? 'your account'}. Redirecting...</p>
          )}
          
          {/* Only show button if not authenticated */}
          {!authenticated && (
            <Button 
              onClick={login}
              className="w-full bg-gray-900 text-white hover:bg-gray-800"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In / Sign Up
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 