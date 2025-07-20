'use client';

import React, { useState } from 'react';
import { FeatureList } from '@/components/landing/feature-list';
import { TestimonialsSection } from '@/components/landing/testimonials-section';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import { X, Calendar, Menu, CheckCircle2, Clock, DollarSign, FileText, TrendingUp, Shield } from 'lucide-react';
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

export default function SoloLandingPage() {
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[0.9] sm:leading-[0.85]">
              <span className="text-[#0040FF]">Automate</span> <span className="text-black">your</span>
              <br />
              <span className="text-black">financial admin.</span>
            </h1>
            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                Track <span className="text-[#0040FF] font-semibold italic">every invoice</span> automatically.
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                and <span className="text-orange-600 font-semibold italic">never miss a tax deadline</span> again.
              </p>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-[#5a6b91] mt-6 max-w-3xl mx-auto leading-relaxed">
              Zero Finance gives solopreneurs a USD business account with AI-powered bookkeeping, 
              automatic expense tracking, and smart tax reminders—all in one place.
            </h2>
          </div>

          {/* Dashboard Demo Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-8 max-w-5xl mx-auto">
            {/* Browser Window Style Header */}
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-100 rounded-md px-3 py-1 text-xs text-gray-600 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  https://0.finance/dashboard
                </div>
              </div>
            </div>

            {/* Header with Available Balance */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-[#0040FF]" />
                <span className="text-sm text-gray-600 font-medium">Business • USD</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-[#0f1e46] tracking-tight">$25,109.42</h2>
              <p className="text-gray-600 mt-1 text-lg font-light">Available balance</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button className="px-4 py-2 bg-[#0040FF] text-white rounded-lg font-medium hover:bg-[#0040FF]/90 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">+ Invoice</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Request</button>
            </div>

            {/* Inbox Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Inbox</h3>
                <div className="flex items-center gap-4">
                  <button className="text-sm px-3 py-1 bg-blue-100 text-[#0040FF] rounded-full font-medium">
                    ST pending
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    0 today
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    1 total
                  </button>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                <div>
                  <p className="text-sm text-gray-600">Total Pending</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requires Action</p>
                  <p className="text-2xl font-bold text-gray-900">4</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Auto-Processed</p>
                  <p className="text-2xl font-bold text-gray-900">23</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">$8,468</p>
                </div>
              </div>

              {/* Inbox Items */}
              <div className="space-y-3">
                <div className="border border-red-200 bg-red-50 rounded-lg p-4 hover:border-red-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">🚨 Q4 2024 Tax Filing Reminder</h4>
                      <p className="text-sm text-gray-600">Your quarterly tax payment is due on July 31st. Based on your income this quarter ($32,159), estimated tax: $4,823. File Form 1040-ES to avoid penalties.</p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Urgent</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-red-600 font-semibold">Due in 15 days</span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">tax</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">quarterly-filing</span>
                    <button className="ml-auto text-red-600 hover:text-red-700 font-medium">File Now</button>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Invoice Sent: Web Design Project - $3,500</h4>
                      <p className="text-sm text-gray-600">Invoice #INV-2024-047 sent to TechStartup Inc. for responsive website redesign. Payment terms: Net 30. Auto-reminder scheduled for July 25th.</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Sent</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-blue-600 font-semibold">$3,500 USD</span>
                    <span>Sent 2 days ago</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">invoice</span>
                    <span>To: billing@techstartup.com</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">View</button>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">✅ Expense Auto-Categorized: AWS Services - $127.43</h4>
                      <p className="text-sm text-gray-600">Monthly AWS hosting bill automatically categorized as "Cloud Services" for tax deduction. YTD cloud expenses: $1,529.16</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Auto-filed</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-600">$127.43</span>
                    <span>Today</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">cloud-services</span>
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">deductible</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">Review</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Deel - ID Verification Needed</h4>
                      <p className="text-sm text-gray-600">Your government-issued ID on file will expire in 14 days. Upload a new valid ID and selfie to keep withdrawing funds.</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">90%</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Jul 8, 2025</span>
                    <span>From: alicia@deel.support</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">Update ID</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Coffee Meeting Receipt - $18.50 <span className="text-gray-500">(Pending Review)</span></h4>
                      <p className="text-sm text-gray-600">Starbucks receipt from client meeting. Add meeting notes to qualify as business expense deduction.</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Needs info</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>$18.50</span>
                    <span>Yesterday</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">needs-review</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">Add Notes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Stats & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Cash on Hand</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$25,109</p>
              <p className="text-xs text-gray-500 mt-1">Available now</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Amounts Owed</h3>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$7,050</p>
              <p className="text-xs text-orange-600 mt-1">3 invoices pending</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Monthly Revenue</h3>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$32,159</p>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-red-100 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-red-700">Tax Filing Due</h3>
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-lg font-bold text-red-700">Q4 2024</p>
              <p className="text-xs text-red-600 mt-1 font-medium">Due in 15 days!</p>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">📋 Important Items Requiring Your Attention</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Q4 2024 tax filing due in 15 days - estimated tax: $4,823</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>3 invoices overdue by 30+ days - total: $2,800</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>Business insurance renewal needed by end of month</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/signin?source=solo"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border border-[#0050ff]/20"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-8 sm:py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">5+ hours</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">saved per week</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">1000+</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">solopreneurs</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">4-8%</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">APY on idle cash</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Your <span className="text-[#0040FF]">AI</span> Financial Assistant
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Let AI handle the <span className="font-semibold italic text-orange-600">tedious work</span> while you focus on growing your business
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <DollarSign className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Easy Global Payments</h3>
              <p className="text-sm text-[#5a6b91]">Send and receive USD via ACH or IBAN, from anywhere</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <FileText className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Invoice Automation</h3>
              <p className="text-sm text-[#5a6b91]">AI auto-fills your invoices and payment links</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Clock className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Effortless Bookkeeping</h3>
              <p className="text-sm text-[#5a6b91]">Categorize expenses and reconcile payments instantly</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <TrendingUp className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Smart Savings</h3>
              <p className="text-sm text-[#5a6b91]">Automatically earn 4-8% interest on idle cash</p>
            </div>
          </div>

          {/* Three key capabilities demos - Mobile responsive layout */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-8 max-w-6xl mx-auto">
            {/* First row: Automated Follow-ups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <FollowUpsDemo />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1e46]">
                  <span className="text-[#0040FF]">Automated</span> Follow-Ups
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-light text-[#5a6b91]">
                  No more chasing payments—Zero Finance <span className="font-semibold text-black">gently reminds</span> your clients for you. 
                  Set it and forget it with customizable reminder schedules.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Polite payment reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Customizable reminder schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Track payment status in real-time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Second row: Instant Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1e46]">
                  <span className="text-orange-600">Instant</span> Insights
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-light text-[#5a6b91]">
                  Get <span className="font-semibold text-black">clear, real-time insights</span> into your financial health. 
                  Understand your cash flow, track expenses, and optimize your earnings.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Real-time financial dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Tax-ready expense reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Cash flow predictions</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <InsightsDemo />
                </div>
              </div>
            </div>

            {/* Third row: Auto-Categorization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <CategorizationDemo />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46]">
                  Auto-Categorization
                </h3>
                <p className="text-base sm:text-lg text-[#5a6b91]">
                  AI automatically categorizes every transaction for perfect bookkeeping. 
                  Tax-ready reports generated instantly with accurate expense tracking.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Smart expense categorization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Tax-optimized tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">One-click expense reports</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fourth row: AI CFO (Coming Soon) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46]">
                  Always One Question Away
                </h3>
                <p className="text-base sm:text-lg text-[#5a6b91]">
                  Your AI CFO is coming soon. Ask any financial question and get instant, 
                  actionable insights about your business finances.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Natural language queries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Personalized financial advice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Proactive insights & alerts</span>
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

      {/* Built for Solopreneurs Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Built for <span className="text-[#0040FF]">Solopreneurs</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Tailored for <span className="font-semibold italic text-orange-600">independent business owners</span>, creators, and freelancers who value their time. 
              No complexity, just smart, simple financial automation.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Bank-Level Security</h3>
              <p className="text-[#5a6b91]">Your funds are protected with enterprise-grade security and encryption.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Save 5+ Hours Weekly</h3>
              <p className="text-[#5a6b91]">Automate repetitive tasks and focus on what matters—growing your business.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <DollarSign className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Simple, Transparent Pricing</h3>
              <p className="text-[#5a6b91]">No hidden fees. Pay only for what you use with clear, upfront pricing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
            "Zero Finance saves me <span className="text-orange-600 font-bold not-italic">hours every week</span>. More time to build, less time on admin."
          </blockquote>
          <p className="text-lg text-[#5a6b91]">— Sarah Chen, Freelance Designer</p>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Everything You <span className="text-[#0040FF]">Need</span>, Nothing You Don't
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#5a6b91] px-4">
              A complete financial toolkit designed for solo business owners
            </p>
          </div>

          <FeatureList />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-4 leading-tight">
              Ready to <span className="text-[#0040FF]">Automate</span> Your Finances?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Join <span className="font-semibold italic text-orange-600">thousands of solopreneurs</span> who've simplified their financial operations
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=solo"
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
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}