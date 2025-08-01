'use client';

import React, { useState } from 'react';
import { FeatureList } from '@/components/landing/feature-list';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { X, Calendar, Menu, CheckCircle2, Clock, DollarSign, FileText, TrendingUp, AlertCircle, Brain, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

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
const FollowUpsDemo = dynamic(
  () => import('@/components/landing/follow-ups-demo').then(mod => ({ default: mod.FollowUpsDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[300px] sm:h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const InsightsDemo = dynamic(
  () => import('@/components/landing/insights-demo').then(mod => ({ default: mod.InsightsDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[300px] sm:h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const CategorizationDemo = dynamic(
  () => import('@/components/landing/categorization-demo').then(mod => ({ default: mod.CategorizationDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[350px] sm:h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);
const AICFODemo = dynamic(
  () => import('@/components/landing/ai-cfo-demo').then(mod => ({ default: mod.AICFODemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[350px] sm:h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    )
  }
);

// Import the demo data
import { allPossibleMessages, demoScript, adhdValuePopups } from '@/lib/demo-data/adhd-demo';

// Import the configurable demo component
const ConfigurableDemo = dynamic(
  () => import('@/components/configurable-demo').then(mod => ({ default: mod.ConfigurableDemo })),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[600px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading interactive demo...</div>
      </div>
    )
  }
);

// ADHD Demo Embed Component
const ADHDDemoEmbed = () => (
  <ConfigurableDemo
    messages={allPossibleMessages}
    demoScript={demoScript}
    showPlayer={false}
    showValuePopups={true}
    valuePopups={adhdValuePopups}
    autoPlay={true}
    className="h-[1000px]"
    useValueBanners={true}
    backgroundColor="bg-transparent"
  />
);

export default function ADHDLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      {/* Background Video - Responsive handling */}
      <div className="absolute inset-x-0 top-0 w-full h-[100vh] sm:h-[100vh] overflow-hidden">
        <video
          autoPlay
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

      {/* Hero Section - Dashboard Style */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-4 leading-[0.9] sm:leading-[0.85]">
              <span className="text-[#0040FF]">ADHD-friendly</span> <span className="text-black">finance</span>
              <br />
              <span className="text-black">on autopilot.</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2] mb-6">
              Stop losing <span className="text-orange-600 font-semibold italic">$500/month</span> to late fees.
            </p>
            
            {/* CTA Buttons - Moved Up */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/signin?source=adhd"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Get Started for Free
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border border-[#0050ff]/20"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Interactive Demo Section */}
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-8">
              See how it works in 60 seconds
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <ADHDDemoEmbed />
            </div>
          </div>

          {/* Important Stats & Reminders - ADHD Focused */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
            <div className="p-5 rounded-xl shadow-lg border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-red-700">URGENT TASKS</h3>
                <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-red-900">3</p>
              <p className="text-xs text-red-700 mt-1 font-semibold">Need action TODAY</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Time Saved</h3>
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">47 hrs</p>
              <p className="text-xs text-green-600 mt-1">This month alone</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Auto-Handled</h3>
                <Brain className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">89%</p>
              <p className="text-xs text-blue-600 mt-1">Of your admin tasks</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Penalties Avoided</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$740</p>
              <p className="text-xs text-green-600 mt-1">In late fees saved</p>
            </div>
          </div>

          {/* ADHD-Specific Benefits Banner */}
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-800 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Built for ADHD Brains - Reducing Cognitive Load Daily
              </h3>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Automated reminders that escalate until tasks are done</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>One-click actions for everything - no complex workflows</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span>Smart receipt scanner finds lost expenses in your email chaos</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Social Proof Section - ADHD Stats */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-8 sm:py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">6-10 hrs</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">saved monthly</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">15.5M</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">ADHD adults in US</p>
            </div>
         </div>
        </div>
      </section>

      {/* Primary Features Section - ADHD Focus */}
      <section id="features" className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Built for <span className="text-[#0040FF]">ADHD</span> Brains
            </h2>
          </div>

          {/* Feature Grid - ADHD Specific */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <AlertCircle className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Persistent Reminders</h3>
              <p className="text-sm text-[#5a6b91]">Escalating nudges until tasks are done</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Brain className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Auto-Categorization</h3>
              <p className="text-sm text-[#5a6b91]">AI handles all the boring organization</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Zap className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">One-Click Actions</h3>
              <p className="text-sm text-[#5a6b91]">Everything simplified to single taps</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Clock className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Time-Blindness Helper</h3>
              <p className="text-sm text-[#5a6b91]">Visual cues for approaching deadlines</p>
            </div>
          </div>

          {/* Three key capabilities demos - Mobile responsive layout */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-8 max-w-6xl mx-auto">
            {/* First row: Do-It-Already Nudges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <FollowUpsDemo />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1e46]">
                  <span className="text-[#0040FF]">&ldquo;Do-It-Already&rdquo;</span> Nudges
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-light text-[#5a6b91]">
                  Gentle reminders that <span className="font-semibold text-black">escalate appropriately</span> based on urgency. 
                  Never miss another deadline or payment with our ADHD-tuned notification system.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Progressive urgency levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Multi-channel alerts (email, SMS, app)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Snooze with smart re-reminders</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Second row: Receipt Chaos Solver */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1e46]">
                  <span className="text-orange-600">Receipt Chaos</span> Solved
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-light text-[#5a6b91]">
                  AI scans your <span className="font-semibold text-black">entire email inbox</span> to find and file receipts automatically. 
                  No more 6-hour receipt hunting sessions during tax time.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Scans all email accounts automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Extracts data from images and PDFs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Pre-categorized for tax deductions</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <InsightsDemo />
                </div>
              </div>
            </div>

            {/* Third row: Executive Function Support */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <CategorizationDemo />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46]">
                  Executive Function Support
                </h3>
                <p className="text-base sm:text-lg text-[#5a6b91]">
                  Reduce decision fatigue with AI that makes smart financial choices for you. 
                  Everything is automated, categorized, and ready when you need it.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Zero decisions needed for routine tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Smart defaults for everything</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Visual progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fourth row: Your ADHD Financial Coach */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46]">
                  Your ADHD Financial Coach
                </h3>
                <p className="text-base sm:text-lg text-[#5a6b91]">
                  Coming soon: An AI assistant that understands ADHD challenges and provides 
                  personalized financial guidance when executive function is low.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">ADHD-aware coaching strategies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Break down complex tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Celebrate wins and progress</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <AICFODemo />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Built for ADHD Minds Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Why <span className="text-[#0040FF]">ADHD</span> Founders Choose Us
            </h2>
          </div>

          {/* Benefits Grid - ADHD Specific */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Brain className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Cognitive Load Reduction</h3>
              <p className="text-[#5a6b91]">Every feature designed to minimize decision fatigue and mental overhead.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Time-Blindness Support</h3>
              <p className="text-[#5a6b91]">Visual cues, escalating reminders, and deadline tracking that actually works.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Zap className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Dopamine-Friendly Design</h3>
              <p className="text-[#5a6b91]">Quick wins, progress celebrations, and instant gratification built in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote - ADHD Specific */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
            &ldquo;I went from <span className="text-orange-600 font-bold not-italic">10 hours of receipt chaos</span> monthly to literally zero. 
            It&apos;s like having an executive assistant for my ADHD brain.&rdquo;
          </blockquote>
          <p className="text-lg text-[#5a6b91]">— Alex Rivera, ADHD Freelance Developer</p>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Every Feature <span className="text-[#0040FF]">ADHD-Optimized</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#5a6b91] px-4">
              Built from the ground up for neurodivergent entrepreneurs
            </p>
          </div>

          <FeatureList />
        </div>
      </section>

      {/* Final CTA Section - ADHD Focused */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-8 leading-tight">
              Ready to stop the <span className="text-[#0040FF]">ADHD tax</span>?
            </h2>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=adhd"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Get Started for Free
              </Link>
              <Link
                href="https://cal.com/potato/0-finance-onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border-2 border-[#0050ff]"
              >
                Book ADHD-Friendly Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Backed by Orange DAO */}
      <section className="px-4 sm:px-6 lg:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
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
      </section>

      <Footer />
    </div>
  );
}