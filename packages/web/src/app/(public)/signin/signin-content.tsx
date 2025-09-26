'use client';

import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { LogIn, Check, Building2, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { api } from '@/trpc/react';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export type SourceType = 'adhd' | 'e-commerce' | 'solo' | null;

export default function SignInContent() {
  const { login, authenticated, user } = usePrivy();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

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
        redirectUrl = "/dashboard";
      }

      window.location.href = redirectUrl;
    }
  }, [authenticated, inviteToken]);

  // Track page view with source
  useEffect(() => {
    posthog?.capture("signin_page_viewed", {
      source: source || "direct",
    });
  }, [source, posthog]);

  const handleSignIn = () => {
    posthog?.capture("signin_attempted", {
      source: source || "direct",
    });
    login();
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

              {/* Sign In Button */}
              {!authenticated && (
                <Button
                  onClick={handleSignIn}
                  className="w-full bg-[#1B29FF] hover:bg-[#1420CC] text-white font-medium py-3 px-6 rounded-md transition-colors text-[16px] flex items-center justify-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Sign In / Sign Up
                  <ArrowRight className="h-4 w-4" />
                </Button>
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
