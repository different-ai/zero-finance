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
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[0.9] sm:leading-[0.85]">
              {/* on in blue and off in orange */}
              Fastest way to get <span className="text-[#0040FF]">USDC</span>
              <br />
              <span className="text-black">for your business.</span>
            </h1>
            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                Get a <span className="text-[#0040FF] font-semibold">USDC</span>{' '}
                business bank account, and move funds{' '}
                <span className="text-orange-600 font-semibold italic">
                  faster
                </span>{' '}
                in and out of crypto.
              </p>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-[#5a6b91] mt-6 max-w-3xl mx-auto leading-relaxed">
              Virtual accounts you can spin up in minutes. Move funds between
              traditional banking and crypto instantly. Perfect for companies
              operating globally.
            </h2>

            {/* Platform Integration Badges */}
            <div className="flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#5a6b91]">Works with</span>
                {/* Solana Logo */}
                <img
                  src="https://solana.com/src/img/branding/solanaLogoMark.svg"
                  alt="Solana"
                  className="h-6 w-auto"
                />
                <span className="text-sm text-[#5a6b91]">•</span>
                {/* Gnosis Safe Logo */}
                <img
                  src="https://cdn.brandfetch.io/idEaF8VndV/idbs4VrGxp.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                  alt="Gnosis Safe"
                  className="h-5 w-auto"
                />
                <span className="text-sm text-[#5a6b91]">•</span>
                {/* Squads Logo */}
                <div className="flex items-center gap-1">
                  <img
                    src="/squads-logo-black.svg"
                    alt="Squads"
                    className="h-4 w-auto"
                  />
                  <span className="text-xs text-[#5a6b91] italic">(soon)</span>
                </div>
              </div>
              {/* Backed by Orange DAO */}
              <div className="flex items-center gap-2">
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
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center m-8">
            <Link
              href="/signin?source=crypto"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              Signup
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2">
            {/*  center it */}
            <div className="flex items-center gap-2">
              {/* make it more like a text for below less button-like like more like no backgroudn but still this orange thingy and maybe and arrow pointing below*/}
              {/* blue  */}
              <span className="text-[#0050ff] text-lg font-semibold">
                Try Me
              </span>
              <span className="text-orange-600 text-lg font-semibold">
                <ArrowDown className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Dashboard Demo Section */}
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
        className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-4">
            What's inside your account
          </h2>
          <p className="text-lg text-center text-[#5a6b91] mb-12 max-w-3xl mx-auto">
            Everything you need to manage money globally. Simple, fast, and{' '}
            <span className="font-semibold italic text-orange-600">
              always in your control
            </span>
            .
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <ArrowRightLeft className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Instant Bank Bridge
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Move money between traditional banks and crypto instantly.
                Perfect for companies operating globally.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                FREE - No wire fees
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-[#0040FF] rounded-lg flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Flexible Wallet Options
              </h3>
              <p className="text-[#5a6b91] mb-3">
                Choose between{' '}
                <span className="font-semibold italic text-orange-600">
                  managed wallets
                </span>{' '}
                for simplicity or bring your own for full control.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                Your choice, your control
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
                Add team members with custom permissions. Perfect for finance
                teams and accountants.
              </p>
              <p className="text-sm text-[#0040FF] font-semibold">
                Coming soon
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

            {/* Visual Diagram */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Your Wallet */}
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                    <div className="w-16 h-16 bg-[#0040FF] rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-[#0f1e46]">
                      Your Wallet
                    </h4>
                    <p className="text-sm text-[#5a6b91] mt-1">0x742d...b7d</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Your keys, your crypto
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
                      0.finance Bridge
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
                      ACH Account
                    </h4>
                    <div className="text-xs text-[#5a6b91] mt-1 space-y-1">
                      <div>Routing: 021000021</div>
                      <div>Account: 1234567890</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Incoming transforms to USDC
                  </p>
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
                    Connect Your Wallet
                  </h4>
                  <p className="text-[#5a6b91]">
                    Use your existing wallet or let us create one for you.
                    Options include
                    <span className="font-semibold italic text-orange-600">
                      {' '}
                      managed by 0.finance
                    </span>{' '}
                    for simplicity or{' '}
                    <span className="font-semibold">
                      bring your own wallet
                    </span>{' '}
                    for full control.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f1e46] mb-1">
                    Get Your ACH Account
                  </h4>
                  <p className="text-[#5a6b91]">
                    Instantly receive ACH routing numbers linked to your wallet.
                    When anyone sends you dollars, they{' '}
                    <span className="font-semibold italic text-orange-600">
                      automatically convert
                    </span>{' '}
                    to USDC in your wallet.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0040FF] font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-[#0f1e46] mb-1">
                    Send Anywhere
                  </h4>
                  <p className="text-[#5a6b91]">
                    Transfer to US banks, EU SEPA, or other crypto wallets. Your
                    USDC
                    <span className="font-semibold italic text-orange-600">
                      {' '}
                      converts on-the-fly
                    </span>{' '}
                    to whatever currency your recipient needs.
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

      {/* Built for Crypto Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
              Built for <span className="text-[#0040FF]">global companies</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
              Whether you're in tech, e-commerce, or services -{' '}
              <span className="font-semibold italic text-orange-600">
                manage money without borders
              </span>
              .
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Always In Control
              </h3>
              <p className="text-[#5a6b91]">
                Your money, your decisions.{' '}
                <span className="font-semibold italic text-orange-600">
                  No freezes
                </span>
                , no surprises.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <Clock className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Instant Transfers
              </h3>
              <p className="text-[#5a6b91]">
                Move money globally in{' '}
                <span className="font-semibold italic text-orange-600">
                  seconds
                </span>
                , not days.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <DollarSign className="w-12 h-12 text-[#0040FF] mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Pay Anyone
              </h3>
              <p className="text-[#5a6b91]">
                Employees, vendors, contractors -{' '}
                <span className="font-semibold italic text-orange-600">
                  anywhere
                </span>{' '}
                in the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
            &ldquo;We{' '}
            <span className="text-orange-600 font-bold not-italic">
              cut our finance ops time by 80%
            </span>{' '}
            and can finally pay international contractors instantly.&rdquo;
          </blockquote>
          <p className="text-lg text-[#5a6b91]">
            — Sarah Chen, Tech Startup CFO
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-4 leading-tight">
              Ready to <span className="text-[#0040FF]">simplify</span> your
              finances?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Join companies that{' '}
              <span className="font-semibold italic text-orange-600">
                spend less time on finance ops
              </span>
              .
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=crypto"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Get Started
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
                Get Your Own Virtual Account →
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
