'use client';

import React from 'react';
import { FeatureList } from '@/components/landing/feature-list';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, Zap, Globe } from 'lucide-react';
import { BankAccountDemo } from '@/components/landing/bank-account-demo';
import { InboxDemo } from '@/components/landing/inbox-demo';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      {/* Header */}
      <header className="w-full px-6 lg:px-[72px] py-6">
        <div className="max-w-[1296px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg border-2 border-[#0050ff] bg-white/60 p-1.5 flex items-center justify-center">
              <Image
                src="/logo-blue.png"
                alt="Zero Finance"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-semibold text-[#00225b] tracking-tight">
              finance
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8">
            <Link 
              href="/careers" 
              className="text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              careers
            </Link>
            <Link 
              href="https://github.com/different-ai/zero-finance" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              open-source
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-[72px] pt-12 pb-20">
        {/* Grid dots background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
        
        <div className="relative max-w-[1296px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#0f1e46] tracking-tight mb-8 leading-[1.1]">
              the open source ramp<br/>
              usdc business bank account<br/>
              for the eu & us.
            </h1>

            {/* Supporting Bullets */}
            <ul className="space-y-3 mb-10 text-lg md:text-xl font-medium text-[#37466a]">
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
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              get started
            </Link>
          </div>

          {/* Right Column - Demo Screenshots */}
          <div className="lg:col-span-5 relative h-[400px] lg:h-[500px] hidden lg:block">
            {/* Background Demo - Inbox */}
            <div className="absolute top-16 right-10 w-[90%] max-w-[320px] opacity-60 blur-[2px] transform scale-95">
              <InboxDemo />
            </div>

            {/* Foreground Demo - Balance */}
            <div className="absolute top-0 left-0 w-full max-w-[360px] z-10 shadow-2xl rounded-xl overflow-hidden">
              <BankAccountDemo />
            </div>
          </div>
        </div>

        {/* Mobile Demo Stack */}
        <div className="lg:hidden mt-12 space-y-4 max-w-md mx-auto">
          <div className="shadow-2xl rounded-xl overflow-hidden">
            <BankAccountDemo />
          </div>
        </div>
      </section>

      {/* Benefits Row */}
      <section className="px-6 lg:px-[72px] py-16 bg-white/50 backdrop-blur-sm border-y border-[#e2e8f0]">
        <div className="max-w-[1296px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
          {/* Open Source Core */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d1ddff] flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-[#0050ff]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                open source core
              </h3>
              <p className="text-base text-[#5a6b91]">
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
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                yield on idle
              </h3>
              <p className="text-base text-[#5a6b91]">
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
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                eu + us coverage
              </h3>
              <p className="text-base text-[#5a6b91]">
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f1e46] mb-4">
              everything your business needs
            </h2>
            <p className="text-lg md:text-xl font-medium text-[#5a6b91]">
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 mx-auto mb-8 shadow-lg" />

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl font-medium italic text-[#0f1e46] mb-6 leading-relaxed">
              &ldquo;i open zero once a week. the rest of the time my usdc just earns and my books close themselves.&rdquo;
            </blockquote>

            {/* Attribution */}
            <cite className="text-lg font-semibold text-[#0f1e46] not-italic">
              mike b., founder, clif
            </cite>

            {/* Secondary CTA */}
            <div className="mt-10">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
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
