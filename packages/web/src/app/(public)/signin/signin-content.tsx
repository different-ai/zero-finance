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
import { useBimodal, BimodalToggle } from '@/components/ui/bimodal';

export type SourceType = 'adhd' | 'e-commerce' | 'solo' | null;

interface TechnicalFeature {
  label: string;
  value: string;
  status: string;
}

interface SigninContentBase {
  badge: string;
  headline: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  description: string;
}

interface CompanySigninContent extends SigninContentBase {
  features: string[];
}

interface TechnicalSigninContent extends SigninContentBase {
  features: TechnicalFeature[];
}

interface BimodalSigninContent {
  company: CompanySigninContent;
  technical: TechnicalSigninContent;
}

const SIGNIN_CONTENT: BimodalSigninContent = {
  company: {
    badge: 'High-Yield Business Savings',
    headline: {
      prefix: '',
      highlight: 'High-Yield',
      suffix: 'on your idle treasury',
    },
    description:
      'High-yield savings for startups. No minimums, no lock-ups, full liquidity.',
    features: [
      'Insurance included — up to $1M coverage from a licensed insurer',
      'Wire USD — automatic conversion to earning balance',
      'Same-day ACH transfers in and out',
      'Start earning 8-10% APY in 2 minutes',
    ],
  },
  technical: {
    badge: 'PROTOCOL::TREASURY_AUTOMATION',
    headline: {
      prefix: '',
      highlight: 'yield.optimize()',
      suffix: '',
    },
    description:
      'Algorithmic yield optimization on battle-tested DeFi protocols. Non-custodial, audited, insured.',
    features: [
      {
        label: 'ARCH',
        value: 'Non-custodial smart contract wallets',
        status: 'active',
      },
      {
        label: 'AUDIT',
        value: 'Smart contract audited',
        status: 'verified',
      },
      {
        label: 'INSURANCE',
        value: 'Chainproof coverage enabled',
        status: 'active',
      },
      {
        label: 'YIELD',
        value: '8-10% APY • Real-time settlement',
        status: 'live',
      },
    ],
  },
};

// Blueprint grid background component for technical mode
const BlueprintGrid = ({ className }: { className?: string }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className || ''}`}
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(27,41,255,0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(27,41,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
    }}
  />
);

// Architectural crosshairs decoration
const Crosshairs = ({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) => {
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
  };

  return (
    <div className={`absolute h-3 w-3 ${positionClasses[position]}`}>
      <div className="absolute top-1/2 w-full h-px bg-[#1B29FF]/30" />
      <div className="absolute left-1/2 h-full w-px bg-[#1B29FF]/30" />
    </div>
  );
};

// Status indicator dot
const StatusDot = ({ status }: { status: string }) => {
  const colors = {
    active: 'bg-emerald-400',
    verified: 'bg-[#1B29FF]',
    live: 'bg-emerald-400 animate-pulse',
  };
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full ${colors[status as keyof typeof colors] || 'bg-[#1B29FF]'}`}
    />
  );
};

export default function SignInContent() {
  const { authenticated, user } = usePrivy();
  const { sendCode, loginWithCode, state } = useLoginWithEmail();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const { isTechnical, toggle } = useBimodal();

  const content = SIGNIN_CONTENT[isTechnical ? 'technical' : 'company'];

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
    <section className="relative min-h-screen border-y border-[#101010]/10 bg-[#F6F5EF] md:bg-white/90 overflow-hidden">
      {/* Gradient Background - Hidden on mobile for performance */}
      <div className="hidden md:block">
        <GeneratedComponent className="z-0 bg-[#F6F5EF]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-[#101010]/10 bg-white/80 backdrop-blur-sm">
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

            {/* Bimodal Toggle */}
            <div className="hidden md:flex items-center gap-2">
              <BimodalToggle
                isTechnical={isTechnical}
                onToggle={toggle}
                showLabels={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#101010]/10 shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
          {/* Left side - Value Proposition - Hidden on mobile */}
          <div
            className={`hidden lg:block backdrop-blur-sm p-8 lg:p-12 relative overflow-hidden transition-all duration-300 ${
              isTechnical
                ? 'bg-white border-r border-[#1B29FF]/10'
                : 'bg-white/95'
            }`}
          >
            {/* Blueprint Grid for Technical Mode */}
            {isTechnical && (
              <>
                <BlueprintGrid className="opacity-100" />
                <Crosshairs position="top-left" />
                <Crosshairs position="top-right" />
                <Crosshairs position="bottom-left" />
                <Crosshairs position="bottom-right" />
              </>
            )}

            <div className="relative z-10 mb-8">
              {/* Badge/Label */}
              {isTechnical ? (
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] text-[#1B29FF] tracking-[0.2em] uppercase bg-[#1B29FF]/5 px-2.5 py-1 rounded-sm border border-[#1B29FF]/20">
                    {content.badge}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ONLINE
                  </span>
                </div>
              ) : (
                <p className="uppercase tracking-[0.14em] text-[12px] mb-3 text-[#101010]/60">
                  {content.badge}
                </p>
              )}

              {/* Headline */}
              {isTechnical ? (
                <div className="mb-6">
                  <div className="font-mono text-[10px] text-[#1B29FF]/60 mb-2 tracking-wider">
                    {'// Initialize treasury protocol'}
                  </div>
                  <h1 className="font-mono text-[42px] lg:text-[52px] leading-[1.1] tracking-tight text-[#101010]">
                    <span className="text-[#1B29FF]">{'>'}</span>{' '}
                    <span className="text-[#1B29FF]">
                      {content.headline.highlight}
                    </span>
                  </h1>
                  <div className="font-mono text-[11px] text-[#101010]/50 mt-2 flex items-center gap-2">
                    <span className="text-emerald-500">$</span>
                    <span>maximizing yield on idle assets...</span>
                    <span className="animate-pulse text-[#1B29FF]">_</span>
                  </div>
                </div>
              ) : (
                <h1 className="font-serif text-[56px] sm:text-[64px] lg:text-[72px] leading-[0.96] tracking-[-0.015em] text-[#101010] mb-6">
                  {content.headline.prefix && (
                    <span>{content.headline.prefix} </span>
                  )}
                  <span className="text-[#1B29FF]">
                    {content.headline.highlight}
                  </span>
                  {content.headline.suffix && (
                    <span> {content.headline.suffix}</span>
                  )}
                </h1>
              )}

              {/* Description */}
              <p
                className={`max-w-[400px] ${
                  isTechnical
                    ? 'font-mono text-[13px] leading-[1.6] text-[#101010]/70'
                    : 'text-[16px] leading-[1.5] text-[#101010]/80'
                }`}
              >
                {content.description}
              </p>
            </div>

            {/* Features */}
            <div className={`mb-8 ${isTechnical ? 'space-y-2' : 'space-y-4'}`}>
              {isTechnical ? (
                // Technical mode: Blueprint-style feature list (light theme)
                <div className="bg-[#F7F7F2] border border-[#1B29FF]/20 rounded-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1B29FF]/10 bg-white">
                    <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                      SYSTEM::STATUS
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-emerald-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <div className="p-3 space-y-2.5">
                    {(
                      content.features as Array<{
                        label: string;
                        value: string;
                        status: string;
                      }>
                    ).map((item, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="flex items-center gap-2 min-w-[80px]">
                          <StatusDot status={item.status} />
                          <span className="font-mono text-[10px] text-[#1B29FF] tracking-wider uppercase">
                            {item.label}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#101010]/70 leading-relaxed">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-[#1B29FF]/10 bg-white">
                    <div className="font-mono text-[10px] text-emerald-600 flex items-center gap-2">
                      <Check className="h-3 w-3" />
                      All systems operational
                    </div>
                  </div>
                </div>
              ) : (
                // Company mode: Standard feature list
                (content.features as string[]).map(
                  (item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-[#1B29FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-[#1B29FF]" />
                      </div>
                      <span className="text-[14px] text-[#101010]/70">
                        {item}
                      </span>
                    </div>
                  ),
                )
              )}
            </div>

            {/* Technical mode: Protocol info footer */}
            {isTechnical && (
              <div className="relative z-10 pt-4 border-t border-[#1B29FF]/10">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[10px] text-[#101010]/40 flex items-center gap-3">
                    <span>v2.4.1</span>
                    <span className="text-[#1B29FF]/30">|</span>
                    <span>Base L2</span>
                    <span className="text-[#1B29FF]/30">|</span>
                    <span>Morpho Blue</span>
                  </div>
                  <div className="font-mono text-[10px] text-[#1B29FF]/40">
                    [x:001 y:042]
                  </div>
                </div>
              </div>
            )}
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
                              // Auto-submit when 6 digits entered
                              if (value.length === 6) {
                                setTimeout(() => {
                                  loginWithCode({ code: value.trim() });
                                }, 100);
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

            {/* Backed by Orange DAO */}
            <div className="mt-8 pt-6 border-t border-[#101010]/10">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#101010]/60 mb-3 text-center">
                Backed By
              </p>
              <div className="flex items-center justify-center">
                <OrangeDAOLogo className="h-7 w-auto opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
