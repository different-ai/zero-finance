'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Calendar,
  Menu,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Shield,
  ChevronRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

// Import the E-commerce demo data
import { allPossibleMessages, demoScript, ecommerceValuePopups } from '@/lib/demo-data/ecommerce-demo';

// Import the E-commerce demo components
const ConfigurableDemo = dynamic(
  () => import('@/components/configurable-demo').then(mod => ({ default: mod.ConfigurableDemo })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[600px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);

// E-commerce Demo Embed Component
const EcommerceDemoEmbed = () => (
  <ConfigurableDemo
    messages={allPossibleMessages}
    demoScript={demoScript}
    showPlayer={false}
    showValuePopups={true}
    valuePopups={ecommerceValuePopups}
    autoPlay={true}
    className="h-[1000px]"
    useValueBanners={true}
    backgroundColor="bg-transparent"
  />
);

// Dynamic imports to prevent SSR issues
const BankAccountDemo = dynamic(
  () =>
    import('@/components/landing/bank-account-demo').then((mod) => ({
      default: mod.BankAccountDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);
const InboxDemo = dynamic(
  () =>
    import('@/components/landing/inbox-demo').then((mod) => ({
      default: mod.InboxDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[250px] sm:h-[300px] lg:h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);
const SavingsDemo = dynamic(
  () =>
    import('@/components/landing/savings-demo').then((mod) => ({
      default: mod.SavingsDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[250px] sm:h-[350px] lg:h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);
const FollowUpsDemo = dynamic(
  () =>
    import('@/components/landing/follow-ups-demo').then((mod) => ({
      default: mod.FollowUpsDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[300px] sm:h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);
const InsightsDemo = dynamic(
  () =>
    import('@/components/landing/insights-demo').then((mod) => ({
      default: mod.InsightsDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[300px] sm:h-[350px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);
const CategorizationDemo = dynamic(
  () =>
    import('@/components/landing/categorization-demo').then((mod) => ({
      default: mod.CategorizationDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[350px] sm:h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
);
const AICFODemo = dynamic(
  () =>
    import('@/components/landing/ai-cfo-demo').then((mod) => ({
      default: mod.AICFODemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-50 h-[350px] sm:h-[400px] rounded-xl flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading demo...</div>
      </div>
    ),
  },
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
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
              <span className="text-[#0040FF]">Business banking</span>
              <br />
              <span className="text-black">for e-commerce.</span>
            </h1>
            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                The smart business account for{' '}
                <span className="text-orange-600 font-semibold italic">
                  global sellers
                </span>
                .
              </p>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-[#5a6b91] mt-6 max-w-3xl mx-auto leading-relaxed">
              Real business bank account (IBAN/ACH) + multi-currency payments +
              AI bookkeeping. All in one simple dashboard. No more juggling Your
              Bank + Wise + your bookkeeper.
            </h2>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center m-8">
            <Link
              href="/signin?source=e-commerce"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              Open Free Account
            </Link>
            <Link
              href="/demo-dashboard"
              target="_blank"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-orange-500/25"
            >
              Try Live Demo
            </Link>
            <Link
              href="#interactive-demo"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm hover:bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border border-[#0050ff]/20"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Watch Story Demo
            </Link>
          </div>

          {/* Live Demo Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mb-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">🎯 Try the Live Demo Dashboard</p>
                  <p className="text-xs text-gray-600">Experience real-time features: auto-updating balances, instant payments, AI chat</p>
                </div>
              </div>
              <Link
                href="/demo-dashboard"
                target="_blank"
                className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Open Demo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Dashboard Demo Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            {/* Browser Window Style Header */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100">
              <div className="flex gap-1.5">
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-red-500 rounded-full"></div>
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-gray-100 rounded-md px-2 sm:px-3 py-1 text-[10px] sm:text-xs text-gray-600 flex items-center gap-1 sm:gap-2">
                  <Shield className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="hidden sm:inline">https://</span>0.finance/dashboard
                </div>
              </div>
            </div>

            {/* Multi-Currency Balances */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Multi-Currency Vaults
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <DollarSign className="w-3 sm:w-4 h-3 sm:h-4 text-[#0040FF]" />
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                      USD
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#0f1e46]">
                    $125,420
                  </p>
                  <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">+$12,350</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0040FF]">¥</span>
                    <span className="text-sm text-gray-600 font-medium">
                      CNY
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">¥485,210</p>
                  <p className="text-xs text-gray-600 mt-1">≈ $67,109</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0040FF]">₹</span>
                    <span className="text-sm text-gray-600 font-medium">
                      INR
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">
                    ₹2,150,000
                  </p>
                  <p className="text-xs text-gray-600 mt-1">≈ $25,893</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#0040FF]">MX$</span>
                    <span className="text-sm text-gray-600 font-medium">
                      MXN
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#0f1e46]">
                    MX$320,500
                  </p>
                  <p className="text-xs text-gray-600 mt-1">≈ $18,850</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm font-medium text-blue-900">
                  Total Balance: $237,272
                </p>
                <p className="text-[10px] sm:text-xs text-blue-700 mt-0.5 sm:mt-1">
                  Real-time FX • 0.2% better rates
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#0040FF] text-white rounded-lg text-sm sm:text-base font-medium hover:bg-[#0040FF]/90 transition-colors flex items-center gap-1 sm:gap-2">
                <svg
                  className="w-3 sm:w-4 h-3 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Convert
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors">
                Pay Supplier
              </button>
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-200 transition-colors">
                VAT Report
              </button>
            </div>

            {/* Inbox Section */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  E-commerce Operations Hub
                </h3>
                <div className="flex items-center gap-2 sm:gap-4">
                  <button className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-[#0040FF] rounded-full font-medium">
                    4 urgent
                  </button>
                  <button className="text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                    12 today
                  </button>
                  <button className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 hidden sm:inline">
                    48 total
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 text-center">
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">FX Savings</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-green-600">$4,231</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">Pending</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">¥182.5K</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">VAT Due</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-orange-600">€8,234</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600">Available</p>
                  <p className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900">$125K</p>
                </div>
              </div>

              {/* Inbox Items */}
              <div className="space-y-2 sm:space-y-3">
                <div className="border border-red-200 bg-red-50 rounded-lg p-3 sm:p-4 hover:border-red-300 transition-colors cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                        🚨 VAT Payment Due: EU Q3 2024
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Your quarterly VAT payment of €8,234 is due in 3 days.
                        <span className="hidden sm:inline"> Based on your EU sales ($142,350), we've prepared your OSS return.</span>
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-xs bg-red-100 text-red-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                      Critical
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                    <span className="text-red-600 font-semibold">
                      Due in 3 days
                    </span>
                    <span className="bg-red-100 text-red-700 px-1.5 sm:px-2 py-0.5 rounded">
                      vat
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-1.5 sm:px-2 py-0.5 rounded hidden sm:inline">
                      eu-oss
                    </span>
                    <button className="ml-auto text-red-600 hover:text-red-700 font-medium">
                      Pay Now
                    </button>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        💰 FX Opportunity: CNY → USD @ 7.21
                      </h4>
                      <p className="text-sm text-gray-600">
                        Current rate 0.3% better than 30-day average. Convert
                        ¥485,210 to save ~$201 vs standard bank rates.
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Save $201
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-600 font-semibold">
                      Rate: 7.21
                    </span>
                    <span>Expires in 2h</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      fx-optimization
                    </span>
                    <button className="ml-auto text-green-600 hover:text-green-700 font-medium">
                      Convert Now
                    </button>
                  </div>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Supplier Payment Scheduled: Shenzhen Electronics Co.
                      </h4>
                      <p className="text-sm text-gray-600">
                        Invoice #SZ-2024-892 for ¥182,500 scheduled for payment
                        tomorrow. Early payment discount of 2% available if paid
                        today.
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Scheduled
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-blue-600 font-semibold">
                      ¥182,500
                    </span>
                    <span>Save ¥3,650 with early pay</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      supplier
                    </span>
                    <button className="ml-auto text-blue-600 hover:text-blue-700">
                      Pay Early & Save
                    </button>
                  </div>
                </div>

                <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Amazon Rolling Reserve Released: $12,350
                      </h4>
                      <p className="text-sm text-gray-600">
                        Your 14-day rolling reserve from Amazon US has been
                        released. Funds now available in your USD vault.
                      </p>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      Released
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-green-600">+$12,350 USD</span>
                    <span>Today at 9:00 AM</span>
                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      marketplace
                    </span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-gray-300 transition-colors cursor-pointer hidden sm:block">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                        Inventory Payment Due: Mumbai Textiles - ₹850,000
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        Payment for Order #MT-3421 due in 7 days. Current INR
                        rate favorable for conversion from USD.
                      </p>
                    </div>
                    <span className="text-[10px] sm:text-xs bg-yellow-100 text-yellow-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                      Pending
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs">
                    <span>₹850,000 (~$10,241)</span>
                    <span>Due July 24</span>
                    <span className="bg-yellow-100 text-yellow-700 px-1.5 sm:px-2 py-0.5 rounded">
                      inventory
                    </span>
                    <button className="ml-auto text-gray-600 hover:text-gray-900">
                      Schedule Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Stats & Reminders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Total Cash (USD)
                </h3>
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">$237,272</p>
              <p className="text-xs text-gray-500 mt-1">Across 4 currencies</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  FX Savings YTD
                </h3>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">$31,420</p>
              <p className="text-xs text-green-600 mt-1">3.2% of gross sales</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">
                  Pending Supplier
                </h3>
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
              <p className="text-xs text-red-600 mt-1 font-medium">
                Due in 3 days!
              </p>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 max-w-5xl mx-auto">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                📋 Critical Cash Flow Items
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>
                    EU VAT payment €8,234 due in 3 days - ensure USD → EUR
                    conversion
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>
                    FX opportunity: Save $201 by converting CNY reserves at
                    current rate
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600">•</span>
                  <span>
                    $15,200 in early payment discounts available across 4
                    suppliers
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section - NEW */}
      <section
        id="demo"
        className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-4">
            What&apos;s inside your account
          </h2>
          <p className="text-lg text-center text-[#5a6b91] mb-12 max-w-3xl mx-auto">
            Everything you need to run your e-commerce business. No add-ons, no
            upgrades, no surprises.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Real Bank Account
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Your own IBAN/ACH routing numbers. Accept payments from
                anywhere.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                FREE - Business bank account
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Multi-Currency Wallets
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Hold USD, EUR, CNY, INR. Pay suppliers directly. Best rates.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                0.3% FX - Best rates
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                AI Bookkeeping
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Every transaction categorized. Export to QuickBooks anytime.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                $20/mo - AI bookkeeping
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Transaction History
              </h3>
              <p className="text-[#5a6b91] mb-3">
                All your payments in one place. Search and filter easily.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                Always organized
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Supplier Payments
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Schedule payments. Get early-pay discounts. Track everything.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                Save on early-pay discounts
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Team Access
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Give your VAs safe access. They can pay bills, not withdraw.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                Unique feature
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section
        id="interactive-demo"
        className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-4">
            See it in action
          </h2>
          <p className="text-lg text-center text-[#5a6b91] mb-8 max-w-3xl mx-auto">
            Watch how 0.finance handles real e-commerce scenarios: supplier payments, 
            multi-currency transactions, and tax compliance - all automated.
          </p>
          
          {/* Demo Container */}
          <div>
            <EcommerceDemoEmbed />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-8 sm:py-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">
                10 min
              </p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">
                account approval
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">
                $0
              </p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">
                monthly fees
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-[#0040FF]">
                Global OK
              </p>
              <p className="text-sm sm:text-base text-[#5a6b91] mt-1 font-medium">
                offshore friendly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Features Section */}
      <section
        id="features"
        className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              How it&apos;s <span className="text-[#0040FF]">different</span>
            </h2>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Shield className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">
                No More Bans
              </h3>
              <p className="text-sm text-[#5a6b91]">
                E-commerce friendly • Complex structures OK
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <DollarSign className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">
                Pay Suppliers Direct
              </h3>
              <p className="text-sm text-[#5a6b91]">
                CNY, INR, USD - best rates guaranteed
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <Clock className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">
                Instant Approval
              </h3>
              <p className="text-sm text-[#5a6b91]">
                10 minutes, not 10 weeks like banks
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <FileText className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#0f1e46] mb-2">
                Export to QuickBooks
              </h3>
              <p className="text-sm text-[#5a6b91]">
                One-click CSV export for your accountant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Comparison Table */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-12">
            Zero Finance vs. Everyone else
          </h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-[#0f1e46]"></th>
                    <th className="text-center px-6 py-4 font-semibold text-[#0040FF]">
                      Zero Finance
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-600">
                      Mercury + Wise
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-600">
                      Payoneer
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Monthly Cost
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      $0
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      $200-400
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      $30+
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      FX Fees
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      0.3%
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      2-4%
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      2-3.5%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Real Bank Account
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      ✓
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">✓</td>
                    <td className="px-6 py-4 text-center text-gray-600">✗</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Multi-Currency
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      ✓
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Separate service
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Replaces Bookkeeper VA
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      ✓ ($20/mo)
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Need VA ($500+/mo)
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Need VA ($500+/mo)
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Complex Structures OK
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      ✓
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Sometimes
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Approval Time
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      10 minutes
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      2-4 weeks
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      1-2 weeks
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Assistant Section - NEW */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46] mb-4">
              Replace your{' '}
              <span className="text-[#0040FF]">bookkeeping VA</span> with AI
            </h3>
            <p className="text-lg text-[#5a6b91] mb-6">
              Save $280-780/month. AI categorizes every transaction
              automatically. Your other VAs can still pay bills.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 mb-3">
                  <Shield className="w-8 h-8 text-[#0040FF] mx-auto" />
                </div>
                <h4 className="font-semibold text-[#0f1e46]">
                  AI Does the Books
                </h4>
                <p className="text-sm text-[#5a6b91] mt-1">
                  No more paying VAs to categorize
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 mb-3">
                  <FileText className="w-8 h-8 text-[#0040FF] mx-auto" />
                </div>
                <h4 className="font-semibold text-[#0f1e46]">
                  QuickBooks Export
                </h4>
                <p className="text-sm text-[#5a6b91] mt-1">
                  One-click export when you need it
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-lg p-4 mb-3">
                  <Clock className="w-8 h-8 text-[#0040FF] mx-auto" />
                </div>
                <h4 className="font-semibold text-[#0f1e46]">Keep Other VAs</h4>
                <p className="text-sm text-[#5a6b91] mt-1">
                  They can still pay bills safely
                </p>
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
              Why <span className="text-[#0040FF]">Dropshippers</span> Choose Us
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              We get it—you need{' '}
              <span className="font-semibold italic text-orange-600">
                speed, flexibility, and no BS
              </span>
              . That&apos;s exactly what we built.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Bank-Proof Business
              </h3>
              <p className="text-[#5a6b91]">
                Stop worrying about sudden account closures. We understand
                e-commerce.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Pay Suppliers Fast
              </h3>
              <p className="text-[#5a6b91]">
                Direct CNY payments to China. No more wire delays or crazy fees.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <DollarSign className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Simple Pricing
              </h3>
              <p className="text-[#5a6b91]">
                Free bank account. $20/mo for AI bookkeeping. 0.3% on
                conversions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
            &ldquo;Finally a bank that{' '}
            <span className="text-orange-600 font-bold not-italic">
              doesn&apos;t ban me
            </span>{' '}
            every 6 months. Been stable for 2 years now.&rdquo;
          </blockquote>
          <p className="text-lg text-[#5a6b91]">
            — Ahmed K., International Amazon FBA ($3M/year)
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-4 leading-tight">
              Open your <span className="text-[#0040FF]">all-in-one</span>{' '}
              account
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Real bank account + multi-currency + bookkeeping.{' '}
              <span className="font-semibold italic text-orange-600">
                $0/month.
              </span>
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=e-commerce"
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
