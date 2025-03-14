import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Sign Up - Invoice App',
  description: 'Create a new account',
};

export default function SignUpPage() {
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

        <h1 className="text-3xl font-bold text-center text-gray-900">Create a new account</h1>
        <p className="mt-2 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="w-full max-w-md justify-center flex">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'nostalgic-button text-white',
                formFieldInput: 'nostalgic-input',
                footerAction: 'text-primary hover:underline'
              }
            }}
            redirectUrl="/dashboard/invoices"
          />
        </div>
    </div>
  );
}