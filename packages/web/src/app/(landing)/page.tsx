'use client';

import React, { useState } from 'react';
import { FeatureList } from '@/components/landing/feature-list';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { Code2, Zap, Globe, X, Calendar, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic imports to prevent SSR issues
const BankAccountDemo = dynamic(
  () => import('@/components/landing/bank-account-demo').then(mod => ({ default: mod.BankAccountDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const InboxDemo = dynamic(
  () => import('@/components/landing/inbox-demo').then(mod => ({ default: mod.InboxDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[250px] sm:h-[300px] lg:h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const SavingsDemo = dynamic(
  () => import('@/components/landing/savings-demo').then(mod => ({ default: mod.SavingsDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[250px] sm:h-[350px] lg:h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);

export default function Home() {
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      {/* Background Video - Responsive handling */}
      <div className="absolute inset-x-0 top-0 w-full h-[100vh] sm:h-[100vh] overflow-hidden">
        <video
          autoPlay
          // loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 hidden sm:block"
        >
          <source
            src="https://cdn.midjourney.com/video/b1844fe8-1f77-48e4-81be-b5918c753e77/2.mp4"
            type="video/mp4"
          />
        </video>
        {/* Fallback gradient for mobile when video is hidden */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff] sm:hidden" />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#dfe7ff]/90" />
      </div>

      {/* Header - Mobile responsive */}
      <header className="relative z-20 w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/new-logo-bluer.png"
              alt="Zero Finance"
              width={48}
              height={48}
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-md"
            />
            <span className="text-xl sm:text-2xl font-semibold text-[#00225b] tracking-tight">
              finance
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              href="/careers"
              className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              Careers
            </Link>
            <Link
              href="https://github.com/different-ai/zero-finance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              Open Source
            </Link>
            <Link
              href="https://cal.com/potato/0-finance-onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 backdrop-blur-sm bg-[#0040FF]/10 text-[#0040FF] px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm border border-[#0040FF]/30 hover:border-[#0040FF] hover:bg-[#0040FF]/15 focus-visible:ring-2 focus-visible:ring-[#0040FF] focus:outline-none"
            >
              <Calendar className="w-4 lg:w-5 h-4 lg:h-5" />
              Book Demo
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0f1e46] hover:text-[#0050ff] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-4 space-y-4">
            <Link
              href="/careers"
              className="block text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Careers
            </Link>
            <Link
              href="https://github.com/different-ai/zero-finance"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Open Source
            </Link>
            <Link
              href="https://cal.com/potato/0-finance-onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0040FF]/10 text-[#0040FF] px-4 py-3 rounded-lg font-semibold text-base transition-colors border border-[#0040FF]/30 hover:border-[#0040FF] hover:bg-[#0040FF]/15"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="w-5 h-5" />
              Book Demo
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section - Mobile responsive */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        {/* Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Copy */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-black tracking-tight mb-4 leading-[1.1] sm:leading-[1.0]">
              <span className="text-[#0040FF]">Simplify</span> your financial
              stack.
              <br />
              <div className="flex flex-col gap-2 mt-3 sm:mt-4">
                <div className="text-black text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light tracking-normal">
                  Get a{' '}
                  <span className="text-[#0040FF] font-semibold italic">
                    USDC
                  </span>{' '}
                  business bank account.
                </div>
                <div className="text-black text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light tracking-normal">
                  and{' '}
                  <span className="text-orange-600 font-semibold italic">
                    spend less time
                  </span>{' '}
                  on financial admin.
                </div>
              </div>
            </h1>

            {/* Supporting Bullets */}
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#00225b] tracking-tight mb-6 sm:mb-8 leading-[1.2] lg:leading-[1.1] mt-4">
              Open a dollar-backed bank account wherever you are in the world,
              spend less time on financial admin with our AI CFO, and park your
              idle cash in our high-yield vault.
            </h2>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Right Column - Single Demo */}
          <div className="relative mt-8 lg:mt-0">
            <div className="w-full max-w-[400px] sm:max-w-[450px] lg:max-w-[500px] mx-auto shadow-2xl rounded-xl overflow-hidden">
              <BankAccountDemo />
            </div>
          </div>
        </div>
      </section>

      {/* What We Have Today Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              What you can do today
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#5a6b91] max-w-3xl mx-auto px-4">
              Get an IBAN or ACH account. Send and receive money from anywhere
              in the world. Own USD wherever you are.
            </p>
          </div>

          {/* Three key capabilities demos - Mobile responsive layout */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-8 max-w-6xl mx-auto">
            {/* First row: Bank + Savings - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Own dollars globally */}
              <div className="space-y-3 sm:space-y-4 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#0f1e46]">
                  Own dollars globally
                </h3>
                <p className="text-sm sm:text-base text-[#5a6b91]">
                  Send & receive USD from anywhere. Issue invoices or payment
                  links and get paid in seconds.
                </p>
                <div className="shadow-xl rounded-xl overflow-hidden flex-grow">
                  <BankAccountDemo />
                </div>
              </div>

              {/* Save more, effortlessly */}
              <div className="space-y-3 sm:space-y-4 flex flex-col">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#0f1e46]">
                  Save more, effortlessly
                </h3>
                <p className="text-sm sm:text-base text-[#5a6b91]">
                  Set aside a slice of every deposit into a&nbsp;4–8% APY vault.
                  Your funds stay in self-custody DeFi wrappers.
                </p>
                <div className="shadow-xl rounded-xl overflow-hidden flex-grow">
                  <SavingsDemo />
                </div>
              </div>
            </div>

            {/* Second row: Inbox centered - Better mobile sizing */}
            <div className="flex justify-center">
              {/* Do more with less */}
              <div className="space-y-3 sm:space-y-4 flex flex-col max-w-full sm:max-w-lg w-full">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#0f1e46] text-center">
                  Do more with less
                </h3>
                <p className="text-sm sm:text-base text-[#5a6b91] text-center">
                  Our AI&nbsp;Inbox parses invoices & receipts, so you can pay
                  and reconcile in one click.
                </p>
                <div className="shadow-xl rounded-xl overflow-hidden flex-grow">
                  <InboxDemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Everything your business needs
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#5a6b91] px-4">
              From global payments to automated accounting, we&apos;ve got you
              covered
            </p>
          </div>

          <FeatureList />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
