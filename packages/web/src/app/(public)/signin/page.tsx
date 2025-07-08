'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { LogIn, Check, ArrowRight } from 'lucide-react';
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

      <div className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/40 grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Left side - Marketing Content */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-[#0040FF]/5 to-[#DDE0F2]/20 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8">
              <Image
                src="/new-logo-bluer.png"
                alt="Zero Finance"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-semibold text-[#0040FF] tracking-tight">
                finance
              </span>
            </Link>

            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[#0f1e46] mb-6">
              <span className="text-[#0040FF]">Simplify</span> your financial
              stack.
            </h2>

            <ul className="space-y-4 mb-8">
              {[
                'Open a dollar bank account wherever you are in the world',
                'Spend less time on financial admin with our AI CFO',
                'Park your idle cash in our high-yield vault',
                'Send & receive USD from anywhere in seconds',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0040FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#0040FF]" />
                  </div>
                  <span className="text-[#5a6b91] text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom call-to-action text */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-[#0040FF]/10 shadow-sm">
            <p className="text-[#5a6b91] text-lg leading-relaxed mb-2">
              <span className="font-semibold text-[#0f1e46]">
                Ready to get started?
              </span>
            </p>
            <p className="text-[#5a6b91]">
              Sign in to access your dashboard or create your account in
              seconds.
            </p>
          </div>
        </div>

        {/* Right side - Signin Form */}
        <div className="p-8 lg:p-12 bg-white flex flex-col justify-center">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-[#0f1e46]">
              Welcome to 0 finance
            </h1>
            <p className="text-[#5a6b91] text-lg">
              Access your dashboard or create your account
            </p>
          </div>

          {/* Display user info if somehow authenticated before redirect */}
          {authenticated && user && (
            <div className="mb-6 p-4 bg-[#DDE0F2]/20 rounded-lg border border-[#0040FF]/10">
              <p className="text-sm text-[#5a6b91] text-center">
                Already signed in as {user.email?.address ?? 'your account'}.
                Redirecting to dashboard...
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Main signin button */}
            {!authenticated && (
              <Button
                onClick={login}
                className="w-full bg-[#0040FF] hover:bg-[#0040FF]/90 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0040FF]/25 text-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Sign Up
              </Button>
            )}

            {/* Additional info */}
            <div className="text-center space-y-4">
              <p className="text-sm text-[#5a6b91]">
                Secure authentication powered by Privy
              </p>

              <div className="border-t border-[#DDE0F2]/50 pt-4">
                <p className="text-xs text-[#5a6b91] mb-3">
                  New to 0 finance? No problem! You&apos;ll be guided through
                  account setup.
                </p>

                {/* Quick benefits for new users */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#5a6b91]">
                    <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                    Free to start
                  </div>
                  <div className="flex items-center gap-2 text-[#5a6b91]">
                    <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                    5-min setup
                  </div>
                  <div className="flex items-center gap-2 text-[#5a6b91]">
                    <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                    Global access
                  </div>
                  <div className="flex items-center gap-2 text-[#5a6b91]">
                    <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                    AI-powered
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="mt-8 flex justify-center space-x-6 text-sm gap-6">
            <Link
              href="/"
              className="text-[#5a6b91] hover:text-[#0040FF] transition-colors font-medium"
            >
              ← Back to Home
            </Link>
            <a
              href="https://cal.com/potato/0-finance-onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5a6b91] hover:text-[#0040FF] transition-colors font-medium"
            >
              Book a demo →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
