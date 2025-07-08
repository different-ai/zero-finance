'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SignInPage() {
  const { login, authenticated, user } = usePrivy();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (authenticated) {
      window.location.href = '/dashboard';
    }
  }, [authenticated]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff] flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#0040FF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[#0040FF]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DDE0F2]/20 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-white/40 shadow-2xl relative z-10">
        <CardHeader className="text-center pb-8 pt-8">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-6">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={48}
              height={48}
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-semibold text-[#0040FF] tracking-tight">
              finance
            </span>
          </Link>

          <CardTitle className="text-3xl font-bold text-[#0f1e46] mb-2">Sign In</CardTitle>
          <CardDescription className="text-lg text-[#5a6b91]">
            Access your 0 finance dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-8">
          {/* Display minimal user info if somehow the page is hit while logged in before redirect */}
          {authenticated && user && (
            <div className="mb-6 p-4 bg-[#DDE0F2]/20 rounded-lg border border-[#0040FF]/10">
              <p className="text-sm text-[#5a6b91] text-center">
                Already signed in as {user.email?.address ?? 'your account'}. Redirecting...
              </p>
            </div>
          )}
          
          {/* Only show button if not authenticated */}
          {!authenticated && (
            <Button 
              onClick={login}
              className="w-full bg-[#0040FF] hover:bg-[#0040FF]/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0040FF]/25 text-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In / Sign Up
            </Button>
          )}

          {/* Back to home link */}
          <Link 
            href="/"
            className="mt-6 text-[#5a6b91] hover:text-[#0040FF] transition-colors text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
} 