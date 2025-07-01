'use client';

import React from 'react';
import { Navbar } from '@/components/landing/navbar';
import { FeatureList } from '@/components/landing/feature-list';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, Zap, Globe } from 'lucide-react';
import { BankAccountDemo } from '@/components/landing/bank-account-demo';
import { InboxDemo } from '@/components/landing/inbox-demo';

export default function Home() {
  return (
    <div className="min-h-screen w-full" style={{ 
      background: 'radial-gradient(120% 120% at 40% 0%, #eef4ff 0%, #dfe7ff 100%)' 
    }}>
      {/* Header */}
      <header className="w-full px-6 lg:px-[72px] py-6">
        <div className="max-w-[1296px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg border-2 border-[#0050ff] p-1">
              <Image
                src="/logo-blue.png"
                alt="Zero Finance"
                width={32}
                height={32}
                className="w-full h-full"
              />
            </div>
            <span className="text-[24px] font-semibold text-[#00225b] tracking-[-0.02em]" style={{ fontFamily: 'Inter' }}>
              finance
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            <Link 
              href="/careers" 
              className="text-[16px] font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              careers
            </Link>
            <Link 
              href="https://github.com/different-ai/zero-finance" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[16px] font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              open-source
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Grid Dots Background */}
      <section 
        className="relative px-6 lg:px-[72px] pt-20 pb-24"
        style={{
          backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
          backgroundPosition: '0 0',
        }}
      >
        <div className="max-w-[1296px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="lg:col-span-7">
            <h1 className="text-[40px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[64px] lg:leading-[84px] font-extrabold text-[#0f1e46] tracking-tight mb-8">
              the open source ramp<br/>
              usdc business bank account<br/>
              for the eu & us.
            </h1>

            {/* Supporting Bullets */}
            <ul className="space-y-3 mb-10 text-[20px] leading-[32px] font-medium text-[#37466a]">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>instant onboarding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>idle usdc earns yield</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>tax-ready statements</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>no manual transfers. ever.</span>
              </li>
            </ul>

            {/* Primary CTA */}
            <Link
              href="/signin"
              className="inline-flex items-center justify-center w-[196px] h-[56px] bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-[22px] leading-[30px] font-semibold rounded-[12px] transition-all hover:scale-[1.02] active:scale-[0.97]"
              style={{ boxShadow: '0 2px 12px 0 rgba(0, 80, 255, 0.25)' }}
            >
              get started
            </Link>
          </div>

          {/* Right Column - Demo Screenshots */}
          <div className="lg:col-span-5 relative h-[500px] hidden lg:block">
            {/* Background Demo - Inbox */}
            <div 
              className="absolute top-[60px] right-[40px] w-[348px] opacity-[0.88] blur-sm"
              style={{ 
                boxShadow: '0 4px 24px 0 rgba(0, 24, 80, 0.08)',
                transform: 'scale(0.9)'
              }}
            >
              <InboxDemo />
            </div>

            {/* Foreground Demo - Balance */}
            <div 
              className="absolute top-0 left-0 w-[376px] z-10"
              style={{ boxShadow: '0 4px 24px 0 rgba(0, 24, 80, 0.08)' }}
            >
              <BankAccountDemo />
            </div>
          </div>
        </div>

        {/* Mobile Demo Stack */}
        <div className="lg:hidden mt-12 space-y-4">
          <BankAccountDemo />
          <InboxDemo />
        </div>
      </section>

      {/* Benefits Row */}
      <section 
        className="px-6 lg:px-[72px] py-16 border-t border-[#e2e8f0]"
        style={{
          backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
          backgroundPosition: '0 0',
        }}
      >
        <div className="max-w-[1296px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Open Source Core */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#0f1e46] mb-2">
                open source core
              </h3>
              <p className="text-[16px] leading-[26px] text-[#5a6b91] max-w-[240px]">
                apache-2 licensed. self-host or one-click deploy
              </p>
            </div>
          </div>

          {/* Yield on Idle */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#0f1e46] mb-2">
                yield on idle
              </h3>
              <p className="text-[16px] leading-[26px] text-[#5a6b91] max-w-[240px]">
                surplus usdc auto-parks in short-term t-bill wrappers
              </p>
            </div>
          </div>

          {/* EU + US Coverage */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[22px] leading-[30px] font-semibold text-[#0f1e46] mb-2">
                eu + us coverage
              </h3>
              <p className="text-[16px] leading-[26px] text-[#5a6b91] max-w-[240px]">
                ach, sepa, iban, sort code—one account for both sides
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-6 lg:px-[72px] py-24 bg-white">
        <div className="max-w-[1296px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[48px] leading-[54px] font-extrabold text-[#0f1e46] mb-4">
              everything your business needs
            </h2>
            <p className="text-[20px] leading-[32px] font-medium text-[#5a6b91]">
              from global payments to automated accounting, we&apos;ve got you covered
            </p>
          </div>
          
          <FeatureList />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 lg:px-[72px] py-24 bg-gray-50">
        <div className="max-w-[1296px] mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Avatar */}
            <div className="w-[88px] h-[88px] rounded-full bg-gray-300 mx-auto mb-8 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
            </div>

            {/* Quote */}
            <blockquote className="text-[22px] leading-[34px] font-medium italic text-[#0f1e46] mb-6">
              &ldquo;i open zero once a week. the rest of the time my usdc just earns and my books close themselves.&rdquo;
            </blockquote>

            {/* Attribution */}
            <cite className="text-[18px] leading-[26px] font-semibold text-[#0f1e46] not-italic">
              mike b., founder, clif
            </cite>

            {/* Secondary CTA */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center w-[176px] h-[56px] bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-[22px] leading-[30px] font-semibold rounded-[12px] transition-all hover:scale-[1.02] active:scale-[0.97]"
                style={{ boxShadow: '0 2px 12px 0 rgba(0, 80, 255, 0.25)' }}
              >
                get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
