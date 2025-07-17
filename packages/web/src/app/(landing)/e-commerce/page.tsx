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

export default function EcommerceLandingPage() {
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
              <span className="text-[#0040FF]">Master</span> <span className="text-black">your</span>
              <br />
              <span className="text-black">multi-currency cash.</span>
            </h1>
            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                Track <span className="text-[#0040FF] font-semibold italic">USD, CNY, INR, MXN</span> in real-time.
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                and <span className="text-orange-600 font-semibold italic">save 3-6% on FX fees</span> instantly.
              </p>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-[#5a6b91] mt-6 max-w-3xl mx-auto leading-relaxed">
              Zero Finance gives e-commerce sellers multi-currency business accounts with AI-powered 
              FX optimization, VAT management, and instant cash visibility—all in one place.
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

            {/* Multi-Currency Balances */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Multi-Currency Vaults</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-[#0040FF]" />
                    <span className="text-sm text-gray-600 font-medium">USD</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">$125,420.30</p>
                  <p className="text-xs text-green-600 mt-1">+$12,350 today</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0040FF]">¥</span>
                    <span className="text-sm text-gray-600 font-medium">CNY</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">¥485,210</p>
                  <p className="text-xs text-gray-600 mt-1">≈ $67,109</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0040FF]">₹</span>
                    <span className="text-sm text-gray-600 font-medium">INR</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">₹2,150,000</p>
                  <p className="text-xs text-gray-600 mt-1">≈ $25,893</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0040FF]">MX$</span>
                    <span className="text-sm text-gray-600 font-medium">MXN</span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">MX$320,500</p>
                  <p className="text-xs text-gray-600 mt-1">≈ $18,850</p>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900">Total Balance (USD): $237,272.30</p>
                <p className="text-xs text-blue-700 mt-1">Real-time FX rates • 0.2% better than market average</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button className="px-4 py-2 bg-[#0040FF] text-white rounded-lg font-medium hover:bg-[#0040FF]/90 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Convert
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Pay Supplier</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">VAT Report</button>
            </div>

            {/* Inbox Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">E-commerce Operations Hub</h3>
                <div className="flex items-center gap-4">
                  <button className="text-sm px-3 py-1 bg-blue-100 text-[#0040FF] rounded-full font-medium">
                    4 urgent
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    12 today
                  </button>
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    48 total
                  </button>
                </div>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6 text-center">
                <div>
                  <p className="text-sm text-gray-600">FX Savings MTD</p>
                  <p className="text-2xl font-bold text-green-600">$4,231</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">¥182,500</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">VAT Due</p>
                  <p className="text-2xl font-bold text-orange-600">$8,924</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cash Available</p>
                  <p className="text-2xl font-bold text-gray-900">$125,420</p>
                </div>
              </div>

              {/* Inbox Items */}
              <div className="space-y-3">
                <div className="border border-red-200 bg-red-50 rounded-lg p-4 hover:border-red-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">🚨 VAT Payment Due: EU Q3 2024</h4>
                      <p className="text-sm text-gray-600">Your quarterly VAT payment of €8,234 is due in 3 days. Based on your EU sales ($142,350), we&apos;ve prepared your OSS return.</p>
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Critical</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-red-600 font-semibold">Due in 3 days</span>
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">vat</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">eu-oss</span>
                    <button className="ml-auto text-red-600 hover:text-red-700 font-medium">Pay Now</button>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">💰 FX Opportunity: CNY → USD @ 7.21</h4>
                      <p className="text-sm text-gray-600">Current rate 0.3% better than 30-day average. Convert ¥485,210 to save ~$201 vs standard bank rates.</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Save $201</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-600 font-semibold">Rate: 7.21</span>
                    <span>Expires in 2h</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">fx-optimization</span>
                    <button className="ml-auto text-green-600 hover:text-green-700 font-medium">Convert Now</button>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Supplier Payment Scheduled: Shenzhen Electronics Co.</h4>
                      <p className="text-sm text-gray-600">Invoice #SZ-2024-892 for ¥182,500 scheduled for payment tomorrow. Early payment discount of 2% available if paid today.</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Scheduled</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-blue-600 font-semibold">¥182,500</span>
                    <span>Save ¥3,650 with early pay</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">supplier</span>
                    <button className="ml-auto text-blue-600 hover:text-blue-700">Pay Early & Save</button>
                  </div>
                </div>

                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Amazon Rolling Reserve Released: $12,350</h4>
                      <p className="text-sm text-gray-600">Your 14-day rolling reserve from Amazon US has been released. Funds now available in your USD vault.</p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">Released</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-600">+$12,350 USD</span>
                    <span>Today at 9:00 AM</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">marketplace</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">View Details</button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">Inventory Payment Due: Mumbai Textiles - ₹850,000</h4>
                      <p className="text-sm text-gray-600">Payment for Order #MT-3421 due in 7 days. Current INR rate favorable for conversion from USD.</p>
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>₹850,000 (~$10,241)</span>
                    <span>Due July 24</span>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">inventory</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">Schedule Payment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Stats & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Total Cash (USD)</h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$237,272</p>
              <p className="text-xs text-gray-500 mt-1">Across 4 currencies</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">FX Savings YTD</h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">$31,420</p>
              <p className="text-xs text-green-600 mt-1">3.2% of gross sales</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Pending Supplier</h3>
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$48,350</p>
              <p className="text-xs text-orange-600 mt-1">12 invoices</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-red-100 bg-red-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-red-700">VAT Due</h3>
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-lg font-bold text-red-700">€8,234</p>
              <p className="text-xs text-red-600 mt-1 font-medium">Due in 3 days!</p>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">📋 Critical Cash Flow Items</h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>EU VAT payment €8,234 due in 3 days - ensure USD → EUR conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>FX opportunity: Save $201 by converting CNY reserves at current rate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>$15,200 in early payment discounts available across 4 suppliers</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/signin"
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
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">3-6%</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">saved on FX fees</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">9.7M</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">Amazon sellers worldwide</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">1.9M</p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">active US sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Your <span className="text-[#0040FF]">Multi-Currency</span> Command Center
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Stop losing <span className="font-semibold italic text-orange-600">3-6% on every transaction</span> to hidden fees and poor FX rates
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <DollarSign className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Currency Vaults</h3>
              <p className="text-sm text-[#5a6b91]">Hold USD, CNY, INR, MXN without conversion fees</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <FileText className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">VAT Automation</h3>
              <p className="text-sm text-[#5a6b91]">Track OSS, file returns, never miss deadlines</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Clock className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Real Cash Visibility</h3>
              <p className="text-sm text-[#5a6b91]">See actual available funds across marketplaces</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <TrendingUp className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">Smart FX Timing</h3>
              <p className="text-sm text-[#5a6b91]">AI alerts for optimal conversion opportunities</p>
            </div>
          </div>

          {/* Three key capabilities demos - Mobile responsive layout */}
          <div className="space-y-8 sm:space-y-10 lg:space-y-8 max-w-6xl mx-auto">
            {/* First row: Multi-Currency Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <FollowUpsDemo />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1e46]">
                  <span className="text-[#0040FF]">Unified</span> Currency Management
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-light text-[#5a6b91]">
                  No more juggling multiple bank accounts—Zero Finance <span className="font-semibold text-black">consolidates all currencies</span> in one place. 
                  See your true cash position instantly across USD, CNY, INR, and MXN.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Hold multiple currencies without conversion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Real-time FX rates 0.2-0.5% better than banks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Instant supplier payments in their currency</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Second row: Cash Flow Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1e46]">
                  <span className="text-orange-600">True</span> Cash Visibility
                </h3>
                <p className="text-base sm:text-lg lg:text-xl font-light text-[#5a6b91]">
                  Know your <span className="font-semibold text-black">actual available cash</span> after rolling reserves, VAT obligations, and pending payments. 
                  Make informed decisions with complete financial clarity.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Track marketplace rolling reserves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">VAT obligations calculated automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Supplier payment schedules integrated</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <InsightsDemo />
                </div>
              </div>
            </div>

            {/* Third row: VAT & Tax Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="shadow-xl rounded-xl overflow-hidden">
                  <CategorizationDemo />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 order-1 lg:order-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46]">
                  VAT Compliance Made Simple
                </h3>
                <p className="text-base sm:text-lg text-[#5a6b91]">
                  AI automatically tracks VAT across all EU countries, prepares OSS returns, 
                  and ensures you never miss a deadline. Stay compliant without the headache.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Automatic VAT calculation per country</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">OSS return preparation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Deadline reminders and auto-filing</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fourth row: FX Optimization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46]">
                  Smart FX Optimization
                </h3>
                <p className="text-base sm:text-lg text-[#5a6b91]">
                  Our AI monitors exchange rates 24/7 and alerts you to conversion opportunities. 
                  Save 3-6% on every international transaction with optimal timing.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Real-time rate monitoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Conversion opportunity alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#5a6b91]">Batch conversions for better rates</span>
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

      {/* Built for E-commerce Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Built for <span className="text-[#0040FF]">International Sellers</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Whether you sell on <span className="font-semibold italic text-orange-600">Amazon, Shopify, or direct</span>, we understand the unique challenges 
              of managing global cash flows, supplier payments, and tax compliance.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Enterprise Security</h3>
              <p className="text-[#5a6b91]">Bank-grade encryption for all your multi-currency transactions and data.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Save 3-6% on FX</h3>
              <p className="text-[#5a6b91]">Better rates and timing optimization saves thousands on international payments.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <DollarSign className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">Clear Cash Position</h3>
              <p className="text-[#5a6b91]">Know exactly how much you can spend after reserves and obligations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
            "Zero Finance saved us <span className="text-orange-600 font-bold not-italic">$45,000 last year</span> on FX fees alone. The VAT automation is a game-changer."
          </blockquote>
          <p className="text-lg text-[#5a6b91]">— Michael Zhang, 7-figure Amazon Seller</p>
        </div>
      </section>

      {/* Feature List Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Everything for <span className="text-[#0040FF]">Global Commerce</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-medium text-[#5a6b91] px-4">
              A complete financial operations platform for international e-commerce
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
              Stop Losing <span className="text-[#0040FF]">3-6%</span> to Bad FX Rates
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Join <span className="font-semibold italic text-orange-600">thousands of sellers</span> who&apos;ve optimized their international cash flows
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Start Free Trial
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