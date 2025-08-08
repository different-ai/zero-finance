'use client';

import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { LogIn, Check, Building2, Mail } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';
import { api } from '@/trpc/react';

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
    { enabled: !!inviteToken }
  );

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (authenticated) {
      const redirectUrl = inviteToken ? `/dashboard?invite=${inviteToken}` : '/dashboard';
      window.location.href = redirectUrl;
    }
  }, [authenticated, inviteToken]);

  // Track page view with source
  useEffect(() => {
    posthog?.capture('signin_page_viewed', {
      source: source || 'direct',
    });
  }, [source, posthog]);

  const handleSignIn = () => {
    posthog?.capture('signin_attempted', {
      source: source || 'direct',
    });
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
        {/* Left side - Simple Marketing Content */}
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
              <span className="text-xl font-semibold text-[#0040FF] tracking-tight">finance</span>
            </Link>

            {/* Focused value prop */}
            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[#0f1e46] mb-6">
              <span className="text-[#0040FF]">USDC</span> banking pros
            </h2>
            <ul className="space-y-4 mb-8">
              {[
                'Virtual accounts to get paid anywhere',
                'Fastest ways to off/on-ramp USDC',
                'Receive/Send invoices',
                'Earn yield on your idle cash',
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

          {/* Backed by Orange DAO */}
          <div className="mt-6">
            <p className="text-xs text-[#5a6b91] mb-3 uppercase tracking-wider">Backed by</p>
            <a
              href="https://www.orangedao.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block opacity-70 hover:opacity-100 transition-opacity"
            >
              <OrangeDAOLogo className="h-8 w-auto" />
            </a>
          </div>
        </div>

        {/* Right side - Signin */}
        <div className="p-8 lg:p-12 bg-white flex flex-col justify-center">
          {/* Invite badge */}
          {inviteToken && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1">🎉 You're invited to join a company!</h3>
                  {inviteCompany ? (
                    <div className="space-y-1">
                      <p className="text-sm text-blue-800 font-medium">{inviteCompany.name}</p>
                      <p className="text-xs text-blue-700 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {inviteCompany.email}
                      </p>
                      <p className="text-xs text-blue-600">Sign in to accept this invitation and start creating invoices</p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-700">Sign in to accept your company invitation</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-3 text-[#0f1e46]">
              {inviteToken ? "You've been invited!" : 'Welcome to 0 finance'}
            </h1>
            <p className="text-[#5a6b91] text-lg">
              {inviteToken ? 'Sign in to accept your company invitation' : 'Sign in or create your account'}
            </p>
          </div>

          {/* Display user info if somehow authenticated before redirect */}
          {authenticated && user && (
            <div className="mb-6 p-4 bg-[#DDE0F2]/20 rounded-lg border border-[#0040FF]/10">
              <p className="text-sm text-[#5a6b91] text-center">
                Already signed in as {user.email?.address ?? 'your account'}. Redirecting to dashboard...
              </p>
            </div>
          )}

          {!authenticated && (
            <Button
              onClick={handleSignIn}
              className="w-full bg-[#0040FF] hover:bg-[#0040FF]/90 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0040FF]/25 text-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In / Sign Up
            </Button>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-[#5a6b91]">Secure authentication powered by Privy</p>
            <div className="mt-4">
              <Link href={source ? `/${source}` : '/'} className="text-[#5a6b91] hover:text-[#0040FF] transition-colors font-medium">
                ← Back to {source ? `${source.charAt(0).toUpperCase() + source.slice(1)} page` : 'Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
