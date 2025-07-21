'use client';

import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { LogIn, Check, ArrowRight, Phone, Brain, DollarSign, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';

type SourceType = 'adhd' | 'e-commerce' | 'solo' | null;

interface SourceContent {
  title: React.ReactNode;
  subtitle: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

const sourceContent: Record<NonNullable<SourceType>, SourceContent> = {
  adhd: {
    title: (
      <>
        <span className="text-[#0040FF]">ADHD-friendly</span> finance on autopilot
      </>
    ),
    subtitle: "Stop losing $500/month to late fees. Built for ADHD brains.",
    features: [
      'Persistent reminders that escalate until done',
      'Auto-categorization for zero decision fatigue',
      'One-click actions for everything',
      'Time-blindness support with visual cues',
    ],
    icon: <Brain className="w-6 h-6" />,
    color: '#0040FF',
  },
  'e-commerce': {
    title: (
      <>
        <span className="text-[#0040FF]">Business banking</span> for global sellers
      </>
    ),
    subtitle: "Replace your Filipino bookkeeper with AI. Save $280-780/month.",
    features: [
      'Multi-currency accounts (USD, EUR, CNY, INR)',
      'AI bookkeeping for $20/month',
      'Direct supplier payments worldwide',
      'Real-time FX optimization',
    ],
    icon: <Globe className="w-6 h-6" />,
    color: '#0040FF',
  },
  solo: {
    title: (
      <>
        <span className="text-[#0040FF]">Automate</span> your financial admin
      </>
    ),
    subtitle: "Track every invoice automatically. Never miss a tax deadline again.",
    features: [
      'Open a dollar bank account from anywhere',
      'AI-powered bookkeeping and receipts',
      'Automated payment follow-ups',
      'Smart tax reminders and estimates',
    ],
    icon: <DollarSign className="w-6 h-6" />,
    color: '#0040FF',
  },
};

export default function SignInPage() {
  const { login, authenticated, user } = usePrivy();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasSubmittedPhone, setHasSubmittedPhone] = useState(false);
  
  const source = (searchParams.get('source') as SourceType) || null;
  const content = source && sourceContent[source] ? sourceContent[source] : null;

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (authenticated) {
      window.location.href = '/dashboard';
    }
  }, [authenticated]);

  // Track page view with source
  useEffect(() => {
    if (posthog) {
      posthog.capture('signin_page_viewed', {
        source: source || 'direct',
        has_custom_content: !!content,
      });
    }
  }, [source, posthog, content]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    // Track phone number submission
    if (posthog) {
      posthog.capture('phone_number_submitted', {
        source: source || 'direct',
        phone_country_code: phoneNumber.startsWith('+') ? phoneNumber.slice(0, 3) : 'unknown',
        phone_length: phoneNumber.length,
      });
    }

    setHasSubmittedPhone(true);
    
    // Store phone number for later use (after auth)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_phone_number', phoneNumber);
    }
  };

  const handleSignIn = () => {
    // Track signin attempt
    if (posthog) {
      posthog.capture('signin_attempted', {
        source: source || 'direct',
        has_phone: hasSubmittedPhone,
      });
    }
    
    login();
  };

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

            {/* Dynamic content based on source */}
            {content ? (
              <>
                <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[#0f1e46] mb-6">
                  {content.title}
                </h2>
                <p className="text-lg text-[#5a6b91] mb-8">{content.subtitle}</p>
                <ul className="space-y-4 mb-8">
                  {content.features.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0040FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-[#0040FF]" />
                      </div>
                      <span className="text-[#5a6b91] text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Bottom call-to-action text */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-[#0040FF]/10 shadow-sm">
            <p className="text-[#5a6b91] text-lg leading-relaxed mb-2">
              <span className="font-semibold text-[#0f1e46]">
                Ready to get started?
              </span>
            </p>
            <p className="text-[#5a6b91]">
              {source === 'adhd' 
                ? "Join thousands with ADHD who've automated their finances."
                : source === 'e-commerce'
                ? "Join global sellers saving hours on bookkeeping."
                : source === 'solo'
                ? "Join solopreneurs who've simplified their financial stack."
                : "Sign in to access your dashboard or create your account in seconds."}
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
              {hasSubmittedPhone 
                ? "Great! Now sign in to continue"
                : "Get early access and exclusive updates"}
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
            {/* Phone number input (optional) */}
            {!authenticated && !hasSubmittedPhone && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#0f1e46] mb-2">
                    Phone number (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-[#5a6b91]" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#0040FF] focus:border-[#0040FF] sm:text-sm transition-colors"
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#5a6b91]">
                    Get SMS updates about your account and early feature access
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={!phoneNumber.trim()}
                    className="flex-1 bg-[#0040FF]/10 hover:bg-[#0040FF]/20 text-[#0040FF] font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue with phone
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setHasSubmittedPhone(true)}
                    className="text-white font-medium py-3 px-4 transition-colors"
                  >
                    Skip
                  </Button>
                </div>
              </form>
            )}

            {/* Main signin button */}
            {!authenticated && hasSubmittedPhone && (
              <Button
                onClick={handleSignIn}
                className="w-full bg-[#0040FF] hover:bg-[#0040FF]/90 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0040FF]/25 text-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In / Sign Up
              </Button>
            )}

            {/* Additional info */}
            {hasSubmittedPhone && (
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
                      {source === 'adhd' ? 'ADHD-optimized' : 'Free to start'}
                    </div>
                    <div className="flex items-center gap-2 text-[#5a6b91]">
                      <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                      {source === 'e-commerce' ? 'Multi-currency' : '5-min setup'}
                    </div>
                    <div className="flex items-center gap-2 text-[#5a6b91]">
                      <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                      {source === 'solo' ? 'Tax-ready' : 'Global access'}
                    </div>
                    <div className="flex items-center gap-2 text-[#5a6b91]">
                      <div className="w-1.5 h-1.5 bg-[#0040FF] rounded-full"></div>
                      AI-powered
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation links */}
          <div className="mt-8 flex justify-center space-x-6 text-sm gap-6">
            <Link
              href={source ? `/${source}` : '/'}
              className="text-[#5a6b91] hover:text-[#0040FF] transition-colors font-medium"
            >
              ← Back to {source ? `${source.charAt(0).toUpperCase() + source.slice(1)} page` : 'Home'}
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