import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In - Invoice App',
  description: 'Sign in to your account',
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  // Use the redirect parameter if available, otherwise default to dashboard
  const redirectUrl = searchParams.redirect || '/dashboard/invoices';
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex items-center mb-6">
          <div className="digital-effect">
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

        <h1 className="text-3xl font-bold text-center text-gray-900">Sign in to your account</h1>
        <p className="mt-2 text-center text-gray-600">
          Or{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="w-full max-w-md justify-center flex">
        <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'nostalgic-button text-white',
                formFieldInput: 'nostalgic-input',
                footerAction: 'text-primary hover:underline'
              }
            }}
            redirectUrl={redirectUrl}
          />
      </div>
    </div>
  );
}