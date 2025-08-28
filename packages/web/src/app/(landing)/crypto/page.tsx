'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  Calendar,
  Menu,
  Shield,
  Zap,
  ArrowRightLeft,
  Wallet,
  DollarSign,
  Globe,
  Lock,
  TrendingUp,
  Code,
  Clock,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
} from 'lucide-react';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export default function CryptoLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferDestination, setTransferDestination] = useState<
    'us' | 'eu' | 'crypto'
  >('us');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowDepositModal(false);
        setShowTransferModal(false);
      }
    };

    if (showDepositModal || showTransferModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDepositModal, showTransferModal]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      {/* Background Video - Responsive handling */}
      <div className="absolute inset-x-0 top-0 w-full h-screen overflow-hidden">
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
              href="/"
              className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/business"
              className="text-sm lg:text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors"
            >
              For Business
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
              href="/business"
              className="block text-base font-medium text-[#0f1e46] hover:text-[#0050ff] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Business
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
      <section
        className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24"
        style={{ paddingBottom: 'calc(6rem + 70px)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-[0.9] sm:leading-[0.85]">
              {/* on in blue and off in orange */}
              Deposit and <span className="text-[#0040FF]">earn 10%</span> on
              your business treasury
            </h1>

            {/* Feature Chips */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-[#0040FF]/10 text-[#0040FF] rounded-full border border-[#0040FF]/20 font-medium text-sm">
                10% APY fully insured
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-[#0040FF]/10 text-[#0040FF] rounded-full border border-[#0040FF]/20 font-medium text-sm">
                Instant US/EU Bank Account
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-[#0040FF]/10 text-[#0040FF] rounded-full border border-[#0040FF]/20 font-medium text-sm">
                Corporate cards
              </div>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-[1.2]">
                Get started by depositing{' '}
                <span className="text-[#0040FF] font-semibold">USD/EUR</span> or{' '}
                <span className="text-[#0040FF] font-semibold">USDC</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center m-8">
              <Link
                href="/signin?source=crypto"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Sign Up
              </Link>
            </div>

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

            {/* Try Me - At Bottom Edge of Hero Content */}
            <div className="flex items-center justify-center gap-2 mt-16">
              <span className="text-[#0050ff] text-lg font-semibold">
                Try Me
              </span>
              <span className="text-orange-600 text-lg font-semibold">
                <ArrowDown className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Demo Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto">
            {/* Simple Bank Dashboard Style */}
            <div className="space-y-6">
              {/* Balance Display */}
              <div className="border-b border-gray-100 pb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#0050ff] rounded-full flex items-center justify-center shadow-md shadow-[#0050ff]/20">
                      <span className="text-white font-semibold text-xl">
                        Ξ
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        Business Account · USD
                      </p>
                      <p className="text-xs text-gray-500">Powered by USDC</p>
                    </div>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  $4,823,291.00
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-md transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-all hover:scale-[1.01] active:scale-[0.99] border border-gray-200 shadow-sm hover:shadow-md"
                >
                  Transfer
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
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-purple-600"
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
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Wire Received
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +$250,000.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Employee Payroll
                        </p>
                        <p className="text-xs text-gray-500">5 hours ago</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-600">
                      -$83,200.00
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
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          USDC Yield
                        </p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +$16,890.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section - NEW */}
      <section
        id="demo"
        className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              What&apos;s inside your{' '}
              <span className="text-[#0040FF]">account</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Everything you need to manage money globally. Simple, fast, and{' '}
              <span className="font-semibold italic text-orange-600">
                always in your control
              </span>
              .
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 1. 10% Yield on USDC - Fully Insured */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <TrendingUp className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                10% APY on USDC - Fully Insured
              </h3>
              <p className="text-[#5a6b91]">
                Earn 10% annual yield on your USDC holdings with
                enterprise-grade insurance from{' '}
                <span className="font-semibold italic text-orange-600">
                  Munich Re
                </span>
                . Your funds are protected while generating consistent returns.
              </p>
            </div>

            {/* 2. US and EU Bank Account Opening in Seconds */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Globe className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Instant Global Banking
              </h3>
              <p className="text-[#5a6b91]">
                Open US and EU bank accounts in{' '}
                <span className="font-semibold italic text-orange-600">
                  seconds
                </span>
                . Get ACH routing numbers and SEPA IBANs instantly linked to
                your crypto wallet for seamless fiat-crypto operations.
              </p>
            </div>

            {/* 3. Corporate Cards with Spend Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Corporate Cards with Smart Controls
              </h3>
              <p className="text-[#5a6b91]">
                Spend directly from your balance{' '}
                <span className="font-semibold italic text-orange-600">
                  anywhere in the world
                </span>
                . Built-in spend management, real-time controls, and instant
                settlement from your USDC holdings.
                <span className="inline-flex items-center ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200">
                  Coming soon
                </span>
              </p>
            </div>

            {/* 4. Full Self Custody */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Lock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Complete Self-Custody
              </h3>
              <p className="text-[#5a6b91]">
                Maintain{' '}
                <span className="font-semibold italic text-orange-600">
                  full control
                </span>{' '}
                of your funds with your own keys. Choose between managed wallets
                for convenience or bring your own for maximum security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - NEW */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46] mb-6 text-center">
              How <span className="text-[#0040FF]">you get your funds</span> and
              stay in control
            </h3>
            <p className="text-lg text-[#5a6b91] mb-8 text-center max-w-3xl mx-auto">
              Your money, your control - with the convenience of traditional
              banking
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                    Sign Up with Your Email
                  </h4>
                  <p className="text-[#5a6b91] text-sm leading-relaxed">
                    Get started in minutes with just your email address. Simple
                    onboarding process to get you up and running quickly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                    Create Your Bank Accounts (US & EU)
                  </h4>
                  <p className="text-[#5a6b91] text-sm leading-relaxed">
                    Instantly receive{' '}
                    <span className="font-semibold italic text-orange-600">
                      ACH routing numbers
                    </span>{' '}
                    and{' '}
                    <span className="font-semibold italic text-orange-600">
                      SEPA IBANs
                    </span>{' '}
                    linked to your wallet. Set up both regions in seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                    Deposit USD, EUR, or USDC
                  </h4>
                  <p className="text-[#5a6b91] text-sm leading-relaxed">
                    Fund your account via{' '}
                    <span className="font-semibold italic text-orange-600">
                      ACH/Wire transfers
                    </span>
                    ,{' '}
                    <span className="font-semibold italic text-orange-600">
                      SEPA payments
                    </span>
                    , or{' '}
                    <span className="font-semibold italic text-orange-600">
                      onchain USDC transfers
                    </span>
                    . All fiat automatically converts to USDC.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                    Start Earning 10% APY on Idle Funds
                  </h4>
                  <p className="text-[#5a6b91] text-sm leading-relaxed">
                    Your USDC holdings immediately begin earning{' '}
                    <span className="font-semibold italic text-orange-600">
                      10% annual yield
                    </span>{' '}
                    with enterprise-grade insurance from Munich Re. No lock-up
                    periods or minimum balances.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                    Spend Like a Regular Bank
                  </h4>
                  <p className="text-[#5a6b91] text-sm leading-relaxed">
                    Send money via{' '}
                    <span className="font-semibold italic text-orange-600">
                      ACH, Wire, or SEPA
                    </span>{' '}
                    to yourself or third parties. Or transfer{' '}
                    <span className="font-semibold italic text-orange-600">
                      USDC onchain
                    </span>{' '}
                    for instant crypto payments. Your USDC converts
                    automatically to the destination currency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold text-sm">6</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-[#0f1e46] text-base">
                      Create Corporate Cards
                    </h4>
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200">
                      Coming soon
                    </span>
                  </div>
                  <p className="text-[#5a6b91] text-sm leading-relaxed">
                    Spend directly from your balance{' '}
                    <span className="font-semibold italic text-orange-600">
                      anywhere in the world
                    </span>
                    . Built-in spend management, real-time controls, and instant
                    settlement from your USDC holdings.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                <strong>Bottom line:</strong> Banking made simple. Your money
                stays yours, but works everywhere you need it to.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
            &ldquo;Earning{' '}
            <span className="text-orange-600 font-bold not-italic">
              10% on our idle funds
            </span>{' '}
            has helped us almost pay for another employee a year.&rdquo;
          </blockquote>
          <p className="text-lg text-[#5a6b91]">
            — Sarah Chen, Tech Startup CFO
          </p>
        </div>
      </section>

      {/* Visual Separator */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-4 leading-tight">
              Ready to <span className="text-[#0040FF]">bank smarter</span> with
              your company&apos;s funds?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Join companies that{' '}
              <span className="font-semibold italic text-orange-600">
                earn while they bank
              </span>
              .
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=crypto"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Sign Up
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Virtual ACH Account Details
              </h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Demo Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800 flex items-center gap-2">
                  <span className="font-semibold">⚠️ Demo Mode:</span> This is a
                  demonstration account. Do not send real funds.
                </p>
              </div>

              {/* Visual Flow */}
              <div className="bg-[#0050ff]/5 rounded-lg p-4 border border-[#0050ff]/20">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-[#0050ff] flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#0050ff]" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#0050ff]" />
                  <div className="w-12 h-12 bg-[#0050ff] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Ξ</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-700">
                  Fiat deposits{' '}
                  <span className="font-semibold text-[#0050ff]">
                    automatically convert
                  </span>{' '}
                  to USDC
                </p>
              </div>

              {/* Account Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  Wire to this account:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Routing Number:
                    </span>
                    <span className="font-mono font-semibold text-[#0050ff]">
                      021000021
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Account Number:
                    </span>
                    <span className="font-mono font-semibold text-[#0050ff]">
                      1234567890
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Name:</span>
                    <span className="font-semibold">Your Company LLC</span>
                  </div>
                </div>
              </div>

              {/* Safe Configuration */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://cdn.brandfetch.io/idEaF8VndV/idbs4VrGxp.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                      alt="Gnosis Safe"
                      className="h-5 w-auto"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Gnosis Safe
                    </span>
                  </div>
                  <button className="text-xs text-[#0050ff] hover:text-[#0050ff]/80 font-medium">
                    Change
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="self-custody"
                      name="custody"
                      defaultChecked
                      className="text-[#0050ff] focus:ring-[#0050ff]"
                    />
                    <label
                      htmlFor="self-custody"
                      className="text-sm text-gray-700"
                    >
                      Self-custodial Safe (You control the keys)
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="managed"
                      name="custody"
                      className="text-[#0050ff] focus:ring-[#0050ff]"
                    />
                    <label htmlFor="managed" className="text-sm text-gray-700">
                      0.finance managed (We handle security)
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Safe Address: <span className="font-mono">0x742d...b7d</span>
                </p>
              </div>

              {/* Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong> USD sent to this ACH account
                  instantly converts to USDC in your Gnosis Safe. You maintain
                  full control of your funds.
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href="/signin?source=crypto"
                className="block w-full py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-center font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Sign Up →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Transfer Funds
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Destination Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Send to
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTransferDestination('us')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      transferDestination === 'us'
                        ? 'border-[#0050ff] bg-[#0050ff]/5 text-[#0050ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-sm font-medium">US Bank</p>
                  </button>
                  <button
                    onClick={() => setTransferDestination('eu')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      transferDestination === 'eu'
                        ? 'border-[#0050ff] bg-[#0050ff]/5 text-[#0050ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-sm font-medium">EU SEPA</p>
                  </button>
                  <button
                    onClick={() => setTransferDestination('crypto')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      transferDestination === 'crypto'
                        ? 'border-[#0050ff] bg-[#0050ff]/5 text-[#0050ff]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Wallet className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-sm font-medium">Crypto</p>
                  </button>
                </div>
              </div>

              {/* Dynamic Form Fields */}
              {transferDestination === 'us' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Routing Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                </div>
              )}

              {transferDestination === 'eu' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="IBAN"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="BIC/SWIFT"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                </div>
              )}

              {transferDestination === 'crypto' && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Wallet Address (0x...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
                  />
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent">
                    <option>Ethereum</option>
                    <option>Base</option>
                    <option>Arbitrum</option>
                    <option>Polygon</option>
                  </select>
                </div>
              )}

              <input
                type="text"
                placeholder="Amount (USD)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0050ff] focus:border-transparent"
              />

              <button className="w-full py-3 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-lg transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25">
                Send Transfer
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your USDC will{' '}
                <span className="font-semibold italic text-orange-600">
                  convert automatically
                </span>{' '}
                to the destination currency
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
