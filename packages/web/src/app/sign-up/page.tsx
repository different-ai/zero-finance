'use client';

import React, { Suspense, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

// Cannot have metadata in client components - would need to create a metadata.ts file
// or just let it inherit from the parent

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, ready, authenticated } = usePrivy();
  
  // Get redirect URL from query params or default to dashboard
  const redirectUrl = searchParams?.get('redirect') || '/dashboard';
  
  // If user is already authenticated, redirect them
  useEffect(() => {
    if (ready && authenticated) {
      router.push(redirectUrl);
    }
  }, [ready, authenticated, router, redirectUrl]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center mb-6">
          <div className="">
            <Image
              src="/request-req-logo.png"
              alt="Invoice App Logo"
              width={40}
              height={40}
              className="blue-overlay"
            />
          </div>
          <span className="logo-text font-medium text-xl ml-2 tracking-tight">Invoice App</span>
        </Link>

        <h1 className="text-3xl font-bold text-center text-gray-900">Create your account</h1>
        <p className="mt-2 text-center text-gray-600">
          Get started with our new unified platform
        </p>
      </div>

      <div className="w-full max-w-md justify-center flex">
        <button 
          onClick={() => login()}
          className="nostalgic-button text-white px-6 py-3 w-full"
        >
          Sign Up with Privy
        </button>
      </div>
      
      <p className="mt-6 text-sm text-gray-600 text-center">
        By continuing, you agree to our terms of service and privacy policy
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}