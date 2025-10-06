import React, { Suspense } from 'react';
import SignInContent from '@/app/(public)/signin/signin-content';
import GeneratedComponent from '@/app/(landing)/welcome-gradient';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <section className="relative min-h-screen border-y border-[#101010]/10 bg-white/90 overflow-hidden flex items-center justify-center">
          <GeneratedComponent className="z-0 bg-[#F6F5EF]" />
          <div className="relative z-10 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-[#1B29FF]" />
            <span className="text-[14px] text-[#101010]/70">Loading...</span>
          </div>
        </section>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
