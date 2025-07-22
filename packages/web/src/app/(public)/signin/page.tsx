import React, { Suspense } from 'react';
import SignInContent from '@/app/(public)/signin/signin-content';

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff] flex items-center justify-center">
        <div className="text-[#5a6b91]">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}