'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePrivy, useLoginWithEmail } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
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
import GeneratedComponent from '@/app/(landing)/welcome-gradient';

export type SourceType = 'adhd' | 'e-commerce' | 'solo' | null;

interface SigninContentBase {
  badge: string;
  headline: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  description: string;
}

interface SigninContent extends SigninContentBase {
  features: string[];
}

const SIGNIN_CONTENT: SigninContent = {
  badge: 'Business Savings Account',
  headline: {
    prefix: 'Get paid on your',
    highlight: 'idle treasury',
    suffix: '',
  },
  description:
    'Earn more on your idle treasury. No minimums, no lock-ups. ',
  features: [
    '8% target APY with daily compounding',
    'Insurance included — up to $1M coverage',
    'Instant withdrawals — no lockups',
    'ACH and wire transfers in and out',
  ],
};

export default function SignInContent() {
  const { authenticated, user } = usePrivy();
  const { sendCode, loginWithCode, state } = useLoginWithEmail();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const content = SIGNIN_CONTENT;

  // Privy's `useLoginWithEmail` state machine doesn't expose a guaranteed "reset"
  // method. To make "Change email" reliable, we control the UI step locally.
  const [forceEmailStep, setForceEmailStep] = useState(false);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const autoSubmitTimeoutRef = useRef<number | null>(null);

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
    if (!authenticated && (forceEmailStep || state.status === 'initial')) {
      emailInputRef.current?.focus();
    }
  }, [authenticated, state.status, forceEmailStep]);

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
    setForceEmailStep(false);
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
      setForceEmailStep(false);
      await sendCode({ email: email.trim() });
    } catch (error) {
      setEmailError('Failed to resend code. Please try again.');
    }
  };

  const handleBackToEmail = () => {
    if (autoSubmitTimeoutRef.current) {
      window.clearTimeout(autoSubmitTimeoutRef.current);
      autoSubmitTimeoutRef.current = null;
    }
    setCode('');
    setEmailError('');
    setForceEmailStep(true);
    // Focus next tick so the email step has rendered.
    window.setTimeout(() => emailInputRef.current?.focus(), 0);
  };
  return (
    <section className="relative min-h-screen bg-[#F6F5EF] md:bg-white/90 overflow-hidden">
      {/* Gradient Background - Hidden on mobile for performance */}
      <div className="hidden md:block">
        <GeneratedComponent className="z-0 bg-[#F6F5EF]" />
      </div>

      {/* Header - Transparent, blends with gradient */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
      </header>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
          {/* Left side - Value Proposition - Hidden on mobile */}
          <div
            className="hidden lg:block backdrop-blur-sm p-8 lg:p-12 relative overflow-hidden bg-white/95"
          >
            <div className="relative z-10 mb-8">
              {/* Badge/Label */}
              <p className="uppercase tracking-[0.14em] text-[12px] mb-3 text-[#101010]/60">
                {content.badge}
              </p>

              {/* Headline */}
              <h1 className="font-serif text-[56px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010] mb-6">
                {content.headline.prefix && (
                  <span>{content.headline.prefix} </span>
                )}
                <span className="text-[#1B29FF]">{content.headline.highlight}</span>
                {content.headline.suffix && (
                  <span> {content.headline.suffix}</span>
                )}
              </h1>

              {/* Description */}
              <p className="max-w-[400px] text-[16px] leading-[1.5] text-[#101010]/80">
                {content.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-8 space-y-4">
              {content.features.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#1B29FF]" />
                  </div>
                  <span className="text-[14px] text-[#101010]/70">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Sign In */}
          <div className="bg-white/90 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-[#101010]/10 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Invite Section */}
            {inviteToken && inviteCompany && (
              <div className="mb-8 p-4 bg-[#EAF0FF] border border-[#1B29FF]/20 rounded-md">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-[#1B29FF] mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#101010] mb-1">
                      Company Invitation
                    </p>
                    <p className="text-[14px] text-[#101010]/80">
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
                <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#101010] mb-2">
                  {inviteToken ? 'Accept invitation' : 'Open your account'}
                </h2>
                <p className="text-[14px] text-[#101010]/70">
                  {inviteToken
                    ? 'Sign in to join your company'
                    : 'Enter your email to get a 6-digit sign-in code.'}
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
                  {(forceEmailStep ||
                    state.status === 'initial' ||
                    state.status === 'sending-code' ||
                    state.status === 'error') && (
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
                          inputMode="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck="false"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                          }}
                          placeholder="you@company.com"
                          className="h-12 text-[15px] bg-white border-[#101010]/20 focus:border-[#1B29FF] focus:ring-[#1B29FF]/20"
                          disabled={state.status === 'sending-code'}
                        />
                        {(emailError || state.status === 'error') && (
                          <p className="text-[12px] text-red-600 mt-1">
                            {emailError ||
                              (state.status === 'error'
                                ? state.error?.message
                                : '')}
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
                  {!forceEmailStep && state.status === 'awaiting-code-input' && (
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
                          className="text-[13px] font-medium text-[#101010] block mb-3"
                        >
                          Verification Code
                        </label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={code}
                            onChange={(value) => {
                              setCode(value);
                              // Auto-submit when 6 digits entered (cancelable so
                              // "Change email" is reliable).
                              if (autoSubmitTimeoutRef.current) {
                                window.clearTimeout(autoSubmitTimeoutRef.current);
                                autoSubmitTimeoutRef.current = null;
                              }
                              if (value.length === 6) {
                                autoSubmitTimeoutRef.current = window.setTimeout(
                                  () => {
                                    if (
                                      !forceEmailStep &&
                                      state.status === 'awaiting-code-input'
                                    ) {
                                      loginWithCode({ code: value.trim() });
                                    }
                                  },
                                  100,
                                );
                              }
                            }}
                            inputMode="numeric"
                            pattern="[0-9]*"
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
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
                  {!forceEmailStep && state.status === 'submitting-code' && (
                    <div className="p-6 bg-white border border-[#101010]/10 rounded-md">
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-[#1B29FF]" />
                        <p className="text-[14px] text-[#101010]/70">
                          Verifying code...
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="pt-6 border-t border-[#101010]/10 space-y-3">
                <p className="text-[12px] text-[#101010]/60 text-center">
                  Secure authentication powered by{' '}
                  <img
                    src="/Privy_Brandmark_Black.svg"
                    alt="Privy"
                    className="inline-block h-4"
                  />
                </p>

                <div className="text-center">
                  <Link
                    href="/"
                    className="text-[13px] text-[#101010]/70 hover:text-[#1B29FF] underline underline-offset-4 transition-colors"
                  >
                    ← Back to Landing
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust signals */}
            <div className="mt-8 pt-6 border-t border-[#101010]/10">
              <div className="flex flex-wrap items-center justify-center gap-4 text-[12px] text-[#101010]/50">
                <div className="flex items-center gap-2">
                  <span>Backed by</span>
                  <OrangeDAOLogo className="h-4 w-auto opacity-70" />
                </div>
                <span className="hidden sm:inline">·</span>
                <span>Built by ex-fintech engineers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
