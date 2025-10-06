'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePrivy, useLoginWithEmail } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LogIn,
  Check,
  Building2,
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/trpc/react';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export type SourceType = 'adhd' | 'e-commerce' | 'solo' | null;

export default function SignInContent() {
  const { authenticated, user } = usePrivy();
  const { sendCode, loginWithCode, state } = useLoginWithEmail();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const source = (searchParams.get('source') as SourceType) || null;
  const inviteToken = searchParams.get('invite');

  // Fetch company info for invite
  const { data: inviteCompany } = api.company.getCompanyByInvite.useQuery(
    { token: inviteToken || '' },
    { enabled: !!inviteToken },
  );

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (authenticated) {
      let redirectUrl;

      if (inviteToken) {
        // Handle invite flow
        redirectUrl = `/dashboard?invite=${inviteToken}`;
      } else {
        // For regular signin/signup, go to dashboard
        // The dashboard will redirect to welcome if needed
        redirectUrl = '/dashboard';
      }

      window.location.href = redirectUrl;
    }
  }, [authenticated, inviteToken]);

  // Track page view with source
  useEffect(() => {
    posthog?.capture('signin_page_viewed', {
      source: source || 'direct',
    });
  }, [source, posthog]);

  // Auto-focus email input on mount
  useEffect(() => {
    if (!authenticated && state.status === 'initial') {
      emailInputRef.current?.focus();
    }
  }, [authenticated, state.status]);

  // Auto-focus code input when awaiting code
  useEffect(() => {
    if (state.status === 'awaiting-code-input') {
      codeInputRef.current?.focus();
    }
  }, [state.status]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmailError('');
    posthog?.capture('signin_code_sent', {
      source: source || 'direct',
    });

    try {
      await sendCode({ email: email.trim() });
    } catch (error) {
      setEmailError('Failed to send code. Please try again.');
    }
  };

  const handleLoginWithCode = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!code.trim() || code.length !== 6) {
      return;
    }

    posthog?.capture('signin_code_submitted', {
      source: source || 'direct',
    });

    try {
      await loginWithCode({ code: code.trim() });
    } catch (error) {
      // Error handled by state
    }
  };

  const handleResendCode = async () => {
    posthog?.capture('signin_code_resent', {
      source: source || 'direct',
    });

    try {
      await sendCode({ email: email.trim() });
    } catch (error) {
      setEmailError('Failed to resend code. Please try again.');
    }
  };

  const handleBackToEmail = () => {
    setCode('');
    setEmail('');
    setEmailError('');
  };
  return (
    <div className="min-h-screen bg-[#F7F7F2]">
      {/* Header */}
      <div className="border-b border-[#101010]/10 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={24}
              height={24}
              className="w-6 h-6 object-contain"
            />
            <span className="ml-1 text-[14px] font-bold text-[#0050ff] tracking-tight">
              finance
            </span>
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-[#101010]/10 max-w-5xl mx-auto">
          {/* Left side - Value Proposition */}
          <div className="bg-white p-8 lg:p-12">
            <div className="mb-8">
              <p className="uppercase tracking-[0.14em] text-[12px] text-[#101010]/60 mb-3">
                Business Savings Account
              </p>
              <h1 className="font-serif text-[36px] sm:text-[48px] lg:text-[56px] leading-[0.96] tracking-[-0.015em] text-[#101010] mb-6">
                Earn <span className="text-[#0050ff]">8% APY</span>
              </h1>
              <p className="text-[16px] leading-[1.5] text-[#101010]/80 max-w-[400px]">
                High-yield savings for startups. No minimums, no lock-ups, full
                liquidity.
              </p>
            </div>

            <div className="space-y-4 mb-12">
              {[
                'DeFi-powered high yields',
                'Same-day ACH transfers',
                'Works like your existing bank',
                'Start earning in 2 minutes',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#0050ff]" />
                  </div>
                  <span className="text-[14px] text-[#101010]/70">{item}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#101010]/10">
              <div>
                <p className="text-[24px] font-medium tabular-nums text-[#101010]">
                  $1M+
                </p>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/60 mt-1">
                  Total Deposits
                </p>
              </div>
              <div>
                <p className="text-[24px] font-medium tabular-nums text-[#101010]">
                  100+
                </p>
                <p className="text-[12px] uppercase tracking-[0.14em] text-[#101010]/60 mt-1">
                  Active Companies
                </p>
              </div>
            </div> */}
          </div>

          {/* Right side - Sign In */}
          <div className="bg-[#F6F5EF] p-8 lg:p-12 flex flex-col justify-center">
            {/* Invite Section */}
            {inviteToken && inviteCompany && (
              <div className="mb-8 p-4 bg-white border border-[#101010]/10 rounded-md">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#0050ff] mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#101010] mb-1">
                      Company Invitation
                    </p>
                    <p className="text-[14px] text-[#101010]/70">
                      {inviteCompany.name}
                    </p>
                    <p className="text-[13px] text-[#101010]/60 flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {inviteCompany.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-[24px] font-medium text-[#101010] mb-2">
                  {inviteToken ? 'Accept Invitation' : 'Get Started'}
                </h2>
                <p className="text-[14px] text-[#101010]/70">
                  {inviteToken
                    ? 'Sign in to join your company'
                    : 'Sign in or create your account'}
                </p>
              </div>

              {/* Already authenticated message */}
              {authenticated && user && (
                <div className="p-4 bg-white border border-[#101010]/10 rounded-md">
                  <p className="text-[13px] text-[#101010]/70 text-center">
                    Signed in as {user.email?.address}. Redirecting...
                  </p>
                </div>
              )}

              {/* Email/Code Input Flow */}
              {!authenticated && (
                <>
                  {/* Step 1: Email Input */}
                  {(state.status === 'initial' ||
                    state.status === 'sending-code') && (
                    <form onSubmit={handleSendCode} className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-[13px] font-medium text-[#101010]"
                        >
                          Email Address
                        </label>
                        <Input
                          ref={emailInputRef}
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                          }}
                          placeholder="you@company.com"
                          className="h-12 text-[15px] bg-white border-[#101010]/20 focus:border-[#1B29FF] focus:ring-[#1B29FF]/20"
                          disabled={state.status === 'sending-code'}
                        />
                        {emailError && (
                          <p className="text-[12px] text-red-600 mt-1">
                            {emailError}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={state.status === 'sending-code'}
                        className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium h-12 rounded-md transition-colors text-[15px] flex items-center justify-center gap-2"
                      >
                        {state.status === 'sending-code' ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending code...
                          </>
                        ) : (
                          <>
                            Continue
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Step 2: Code Sent Confirmation */}
                  {state.status === 'awaiting-code-input' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#EAF0FF] border border-[#1B29FF]/20 rounded-md">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-[#1B29FF] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-[14px] font-medium text-[#101010] mb-1">
                              Check your email
                            </p>
                            <p className="text-[13px] text-[#101010]/70">
                              We sent a 6-digit code to{' '}
                              <span className="font-medium">{email}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        onSubmit={handleLoginWithCode}
                        className="space-y-2"
                      >
                        <label
                          htmlFor="code"
                          className="text-[13px] font-medium text-[#101010]"
                        >
                          Verification Code
                        </label>
                        <Input
                          ref={codeInputRef}
                          id="code"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          value={code}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setCode(value);
                            // Auto-submit when 6 digits entered
                            if (value.length === 6) {
                              setTimeout(() => {
                                loginWithCode({ code: value.trim() });
                              }, 100);
                            }
                          }}
                          placeholder="000000"
                          className="h-12 text-[20px] tracking-[0.3em] text-center font-mono bg-white border-[#101010]/20 focus:border-[#1B29FF] focus:ring-[#1B29FF]/20"
                        />
                      </form>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={handleBackToEmail}
                          className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors flex items-center gap-1"
                        >
                          <ArrowLeft className="h-3 w-3" />
                          Change email
                        </button>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] transition-colors"
                        >
                          Resend code
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Submitting Code */}
                  {state.status === 'submitting-code' && (
                    <div className="p-6 bg-white border border-[#101010]/10 rounded-md">
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-[#1B29FF]" />
                        <p className="text-[14px] text-[#101010]/70">
                          Verifying code...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {state.status === 'error' && state.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-[13px] text-red-800 mb-3">
                        {state.error.message}
                      </p>
                      <Button
                        onClick={handleBackToEmail}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Try again
                      </Button>
                    </div>
                  )}
                </>
              )}

              <div className="space-y-3">
                <p className="text-[12px] text-[#101010]/60 text-center">
                  Secure authentication powered by{' '}
                  <img
                    src="/Privy_Brandmark_Black.svg"
                    alt="Privy"
                    className="inline-block h-4 "
                  />
                </p>

                <div className="text-center">
                  <Link
                    href={source ? `/${source}` : '/'}
                    className="text-[14px] text-[#101010]/70 hover:text-[#0050ff] transition-colors"
                  >
                    ← Back to {'Landing'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Backed by Orange DAO */}
            <div className="mt-8 pt-8 border-t border-[#101010]/10">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-4 text-center">
                Backed By
              </p>
              <div className="flex items-center justify-center">
                <OrangeDAOLogo className="h-8 w-auto opacity-70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
