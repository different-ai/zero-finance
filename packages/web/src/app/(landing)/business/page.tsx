'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Calendar,
  Menu,
  Shield,
  Ban,
  Building,
  Globe2,
  DollarSign,
  TrendingUp,
  Clock,
  FileText,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export default function BusinessLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cashBalance, setCashBalance] = useState(250000);
  const [yearlyEarnings, setYearlyEarnings] = useState(15000);

  React.useEffect(() => {
    const earnings = Math.round(cashBalance * 0.06);
    setYearlyEarnings(earnings);
  }, [cashBalance]);

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value) || 0;
    setCashBalance(numValue);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

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

      {/* Header */}
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
              href="/"
              className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/crypto"
              className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              For Crypto
            </Link>
            <Link
              href="/signin"
              className="flex items-center gap-2 bg-[#0040FF] text-white px-3 lg:px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm hover:bg-[#0050ff] focus-visible:ring-2 focus-visible:ring-[#0040FF] focus:outline-none"
            >
              Sign In
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
              href="/"
              className="block text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/crypto"
              className="block text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Crypto
            </Link>
            <Link
              href="/signin"
              className="flex items-center gap-2 bg-[#0040FF] text-white px-4 py-3 rounded-lg font-semibold text-base transition-colors shadow-sm hover:bg-[#0050ff]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-red-300">
              <AlertCircle className="w-4 h-4" />
              Tired of Bank Closures?
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[0.9] sm:leading-[0.85]">
              <span className="text-[#0040FF]">Business banking</span>
              <br />
              <span className="text-black">they can't shut down.</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black max-w-4xl mx-auto leading-[1.2] mb-4">
              Self-custody accounts for businesses facing{' '}
              <span className="font-semibold italic text-orange-600">
                repeated closures
              </span>
              .
            </p>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-[#5a6b91] mt-6 max-w-3xl mx-auto leading-relaxed">
              High-risk industry? Multiple entities? International operations?
              Get a US business account that works like a bank but can't be
              closed.
            </h2>

            {/* Backed by Orange DAO */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <span className="text-xs text-[#5a6b91] uppercase tracking-wider">
                Backed by
              </span>
              <a
                href="https://www.orangedao.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <OrangeDAOLogo className="h-6 w-auto" />
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signin?source=business"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              Open Your Account
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg border-2 border-[#0050ff]"
            >
              See How It Works
            </Link>
          </div>

          {/* Dashboard Demo Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto mb-12">
            {/* Simple Bank Dashboard Style */}
            <div className="space-y-6">
              {/* Balance Display */}
              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#0050ff] rounded-full flex items-center justify-center shadow-md shadow-[#0050ff]/20">
                      <span className="text-white font-semibold text-xl">
                        $
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Business · USD
                      </p>
                      <p className="text-xs text-gray-500">Self-custody</p>
                    </div>
                  </div>
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                    Never Closes
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-800">
                    $845,320.00
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-green-600 font-medium">
                      +5.8% APY
                    </span>
                    <span className="text-xs text-gray-500">
                      • Earning $49,028/year
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-md transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25">
                  Send Wire
                </button>
                <button className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] border border-gray-200 shadow-sm hover:shadow-md">
                  Receive Payment
                </button>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Client Payment
                        </p>
                        <p className="text-xs text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +$12,450.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Supplier Wire
                        </p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      -$35,000.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          International Transfer
                        </p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +$28,300.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Sound familiar?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Mercury closed your account after 6 months
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Wise limited your account without explanation
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Traditional banks won't even open an account
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Payoneer froze funds during "review"
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Multiple entities trigger compliance flags
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Ban className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">
                    Can't scale due to banking limitations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Beautiful Style */}
      <section
        id="how-it-works"
        className="px-4 sm:px-6 lg:px-16 py-16 bg-blue-50"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46] mb-6 text-center">
              How <span className="text-[#0040FF]">self-custody banking</span>{' '}
              works for businesses
            </h3>
            <p className="text-lg text-[#5a6b91] mb-8 text-center max-w-3xl mx-auto">
              Traditional banking security meets cryptographic ownership
            </p>

            {/* Visual Diagram */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Your Wallet */}
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                    <div className="w-16 h-16 bg-[#0040FF] rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#0f1e46]">
                      Your Wallet
                    </h4>
                    <p className="text-sm text-[#5a6b91] mt-1">
                      Self-custody USDC
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Only you have the keys
                  </p>
                </div>

                {/* Bridge */}
                <div className="text-center">
                  <div className="hidden md:block">
                    <svg className="w-full h-12" viewBox="0 0 200 50">
                      <line
                        x1="20"
                        y1="25"
                        x2="180"
                        y2="25"
                        stroke="#0040FF"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <polygon points="180,25 175,20 175,30" fill="#0040FF" />
                      <polygon points="20,25 25,20 25,30" fill="#0040FF" />
                    </svg>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                    <h4 className="font-semibold text-[#0040FF]">
                      Virtual Bridge
                    </h4>
                    <p className="text-xs text-[#5a6b91] mt-1">
                      Instant conversion
                    </p>
                  </div>
                </div>

                {/* Banking Network */}
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                    <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#0f1e46]">
                      Banking Network
                    </h4>
                    <p className="text-sm text-[#5a6b91] mt-1">
                      IBAN/ACH/SWIFT
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">Traditional rails</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f1e46] mb-1">
                    Self-Custody Cryptographic Wallets
                  </h4>
                  <p className="text-[#5a6b91]">
                    Your business funds are stored as USDC (USD stablecoin) in
                    wallets controlled by cryptographic keys. Only you have
                    access - no bank, government, or even 0.finance can touch
                    your money.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f1e46] mb-1">
                    Fiat-to-Stablecoin Bridge
                  </h4>
                  <p className="text-[#5a6b91]">
                    Virtual bank accounts (IBAN/ACH) act as bridges. When
                    clients send you dollars, they're instantly converted to
                    USDC and deposited in your wallet. When you pay suppliers,
                    USDC converts back to fiat seamlessly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f1e46] mb-1">
                    Banking Without Banks
                  </h4>
                  <p className="text-[#5a6b91]">
                    Send wires, receive payments, manage multiple currencies -
                    all the banking features you need, but your funds remain in
                    your control. No bank can freeze, close, or restrict your
                    account because there's no traditional bank account to shut
                    down.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                <strong>Bottom line:</strong> Real banking functionality with
                cryptographic security. Your business account that no one can
                shut down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Perfect for "high-risk" businesses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Globe2 className="w-10 h-10 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                International E-commerce
              </h3>
              <p className="text-gray-600">
                Multiple entities across countries? Banks see that as a red
                flag. We see it as normal business.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <FileText className="w-10 h-10 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Digital Agencies
              </h3>
              <p className="text-gray-600">
                High transaction volumes from various sources trigger bank
                reviews. Not with self-custody.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <DollarSign className="w-10 h-10 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                FX & Trading
              </h3>
              <p className="text-gray-600">
                Currency trading or arbitrage business? Traditional banks run
                away. We're built for it.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Building className="w-10 h-10 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Offshore Companies
              </h3>
              <p className="text-gray-600">
                BVI, Cayman, or other offshore entity? Get US banking without
                the discrimination.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <Shield className="w-10 h-10 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Dropshipping
              </h3>
              <p className="text-gray-600">
                High refund rates and supplier payments across borders? No
                problem for self-custody accounts.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <TrendingUp className="w-10 h-10 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                High-Growth Startups
              </h3>
              <p className="text-gray-600">
                Scaling fast with complex operations? Don't let banking slow you
                down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Yield Calculator Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Plus, earn on your operating cash
            </h2>
            <p className="text-xl text-gray-600">
              While traditional banks give you 0%, earn 4-8% APY automatically
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Calculate Your Earnings
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Average Cash Balance
                </label>
                <div className="mt-2 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                    $
                  </span>
                  <input
                    type="text"
                    value={formatNumber(cashBalance)}
                    onChange={handleBalanceChange}
                    className="w-full pl-8 pr-3 py-3 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Traditional Bank</p>
                  <p className="text-2xl font-bold text-gray-400">$0/year</p>
                  <p className="text-xs text-gray-500">0% APY + monthly fees</p>
                </div>
                <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                  <p className="text-sm text-green-700 mb-1">With 0.finance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${formatNumber(yearlyEarnings)}/year
                  </p>
                  <p className="text-xs text-green-600">
                    6% APY average + $0 fees
                  </p>
                </div>
              </div>

              <div className="bg-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold text-center">
                  Extra ${formatNumber(yearlyEarnings)} for growth, not bank
                  fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <blockquote className="text-xl sm:text-2xl font-light text-gray-700 italic mb-6">
              "After our 4th bank closure in 2 years, we were desperate. Zero
              Finance saved our business. We've been running smoothly for 8
              months now - no compliance calls, no frozen funds, just banking
              that works."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-semibold text-gray-900">Michael Chen</p>
                <p className="text-gray-600">CEO, Global Retail Co.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything you need, nothing that can hurt you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  US Banking Details
                </h3>
                <p className="text-gray-600">
                  Real ACH routing and account numbers for receiving payments
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  International Wires
                </h3>
                <p className="text-gray-600">
                  Send and receive SWIFT payments globally
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Instant Access
                </h3>
                <p className="text-gray-600">
                  Your money available 24/7, no holds or delays
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Multi-Currency
                </h3>
                <p className="text-gray-600">
                  Hold and transact in USD, EUR, GBP and more
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Team Access
                </h3>
                <p className="text-gray-600">
                  Add team members with custom permissions (coming soon)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">API Access</h3>
                <p className="text-gray-600">
                  Integrate with your existing systems
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Comparison Table */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-12">
            Zero Finance vs. Traditional Banking
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
                      Traditional Banks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Account Closures
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      Never
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Common for high-risk
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Yield on Cash
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      4-8% APY
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">0%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Monthly Fees
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      $0
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      $25-100+
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      Control
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      Self-custody
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      Bank controlled
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-[#0f1e46] font-medium">
                      High-Risk Business OK
                    </td>
                    <td className="px-6 py-4 text-center text-[#0040FF] font-bold">
                      ✓
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Common questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is this legal?
              </h3>
              <p className="text-gray-600">
                Yes, completely legal. You're simply holding USD-backed
                stablecoins (USDC) in a self-custody wallet, with banking
                services layered on top. It's the same technology used by many
                fintech companies.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What if USDC loses its peg?
              </h3>
              <p className="text-gray-600">
                USDC is fully backed 1:1 by US dollars held at regulated
                financial institutions. It's audited monthly and has maintained
                its peg through multiple market cycles. Your funds are as safe
                as the US dollar itself.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How do I pay suppliers who only accept bank transfers?
              </h3>
              <p className="text-gray-600">
                Simply initiate a wire or ACH payment from your dashboard. Your
                USDC automatically converts to USD and sends via traditional
                banking rails. Recipients see it as a normal bank transfer.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What about accounting and taxes?
              </h3>
              <p className="text-gray-600">
                We provide standard bank statements and transaction exports
                compatible with QuickBooks, Xero, and other accounting software.
                For tax purposes, it functions like any business bank account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for High-Risk Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Built for{' '}
              <span className="text-[#0040FF]">"high-risk" businesses</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Whether you're international, multi-entity, or in a challenging
              industry -{' '}
              <span className="font-semibold italic text-orange-600">
                bank closures shouldn't stop you
              </span>
              .
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Unshuttable Accounts
              </h3>
              <p className="text-[#5a6b91]">
                Self-custody crypto means no bank can freeze or close your
                account. Ever.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Pay Suppliers Fast
              </h3>
              <p className="text-[#5a6b91]">
                No more wire delays or crazy fees. Instant global payments.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <DollarSign className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Earn on Idle Cash
              </h3>
              <p className="text-[#5a6b91]">
                4-8% APY automatically on all balances. Better than any bank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-4 leading-tight">
              Ready for <span className="text-[#0040FF]">unshuttable</span>{' '}
              banking?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Join businesses who never worry about{' '}
              <span className="font-semibold italic text-orange-600">
                bank closures again
              </span>
              .
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=business"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Open Unshuttable Account
              </Link>
              <Link
                href="https://cal.com/potato/0-finance-onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border-2 border-[#0050ff]"
              >
                Schedule Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
