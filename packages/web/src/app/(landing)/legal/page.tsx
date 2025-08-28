'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building,
  Globe,
  DollarSign,
  Menu,
  X,
  Calendar,
} from 'lucide-react';

export default function LegalPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff]">
      {/* Header */}
      <header className="relative z-20 w-full px-4 sm:px-6 lg:px-16 py-4 sm:py-6 lg:py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200">
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
              href="/legal"
              className="text-sm lg:text-base font-medium text-[#0050ff] transition-colors"
            >
              Legal & Security
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
              href="/legal"
              className="block text-base font-medium text-[#0050ff] transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Legal & Security
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

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#0f1e46]">
              Legal & <span className="text-[#0040FF]">Security</span>
            </h1>
            <p className="text-xl text-[#5a6b91] max-w-3xl mx-auto">
              Understanding your protection, insurance, and regulatory
              compliance
            </p>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-[#0040FF] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1e46] mb-4">
              10% APY - Fully Insured
            </h2>
            <p className="text-lg text-[#5a6b91] max-w-3xl mx-auto">
              Your yield is protected by enterprise-grade smart contract
              insurance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
                Insurance Provider: Munich Re
              </h3>
              <p className="text-[#5a6b91] mb-4">
                Munich Re is the world's largest reinsurer with over 140 years
                of experience. They provide the backing for our smart contract
                insurance, ensuring that your funds are protected against
                technical risks.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Zero rug-pull risk with regulated reinsurer backing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Coverage for smart contract vulnerabilities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Direct payout mechanism in case of incidents
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
                Smart Contract Audits by Quantstamp
              </h3>
              <p className="text-[#5a6b91] mb-4">
                All yield-generating protocols are audited by Quantstamp, a
                leading blockchain security firm that has secured over $200B in
                digital asset value.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Comprehensive security audits before deployment
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Continuous monitoring of smart contracts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Regular re-audits for protocol updates
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
              How the 10% Yield Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0040FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Stable USD Yield Sources
                  </h4>
                  <p className="text-gray-700">
                    Your USDC is deployed to vetted DeFi protocols that generate
                    yield through lending, liquidity provision, and other
                    low-risk strategies. These are not speculative investments
                    but proven yield mechanisms.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0040FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Insurance Coverage
                  </h4>
                  <p className="text-gray-700">
                    Every dollar earning yield is covered by smart contract
                    insurance. If there's a technical failure or exploit, the
                    insurance pays out to make you whole.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0040FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    FDIC-Equivalent Protection
                  </h4>
                  <p className="text-gray-700">
                    The combination of USDC's regulatory compliance, smart
                    contract audits, and insurance coverage provides protection
                    comparable to traditional FDIC insurance, but with
                    significantly higher yields.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USDC Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <DollarSign className="w-16 h-16 text-[#0040FF] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1e46] mb-4">
              USDC: The Foundation of Your Account
            </h2>
            <p className="text-lg text-[#5a6b91] max-w-3xl mx-auto">
              Understanding the stability and regulation behind USD Coin
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
              What is USDC?
            </h3>
            <p className="text-[#5a6b91] mb-6">
              USDC (USD Coin) is a fully-reserved stablecoin pegged 1:1 to the
              US Dollar. It's issued by Circle, a regulated financial services
              company, and is one of the most trusted digital dollars in the
              world.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6">
                <Building className="w-10 h-10 text-[#0040FF] mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Regulated & Licensed
                </h4>
                <p className="text-sm text-gray-700">
                  Circle is licensed as a money transmitter in 48 US states and
                  holds regulatory licenses globally.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <FileText className="w-10 h-10 text-[#0040FF] mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  Monthly Audits
                </h4>
                <p className="text-sm text-gray-700">
                  Grant Thornton LLP provides monthly attestations confirming
                  USDC is 100% backed by cash and US Treasuries.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <Globe className="w-10 h-10 text-[#0040FF] mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">
                  $32B+ in Circulation
                </h4>
                <p className="text-sm text-gray-700">
                  Trusted by thousands of businesses worldwide with over $32
                  billion USDC in circulation.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
                USDC Reserve Composition
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">US Treasury Bills</span>
                  <span className="font-semibold text-[#0040FF]">80%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Cash at US Banks</span>
                  <span className="font-semibold text-[#0040FF]">20%</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Reserves held at BNY Mellon and other regulated financial
                institutions
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
                Why USDC vs Traditional Banking?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    24/7 instant global transfers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Programmable money with smart contracts
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Full transparency with blockchain verification
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Self-custody option for complete control
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Self-Custody Security Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Lock className="w-16 h-16 text-[#0040FF] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1e46] mb-4">
              Self-Custody Security Model
            </h2>
            <p className="text-lg text-[#5a6b91] max-w-3xl mx-auto">
              How we ensure your funds remain secure and in your control
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-xl font-bold text-[#0f1e46] mb-6">
              Wallet Infrastructure Powered by Privy
            </h3>
            <p className="text-[#5a6b91] mb-6">
              We use Privy's secure wallet infrastructure to give you the best
              of both worlds: easy onboarding with enterprise-grade security.
              Privy uses distributed key sharding to ensure neither Privy nor
              0.finance can access your keys — only you can.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Distributed Key Security
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Keys are split using shamir secret sharing. No single party
                  ever has access to your complete private key.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Keys only reconstituted in secure enclaves
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Regular security audits
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Multiple Wallet Options
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Connect your existing wallet or create an embedded wallet.
                  Support for all major wallets and chains.
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      MetaMask, WalletConnect, Coinbase
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">
                      Hardware wallet compatible
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
              Wallet Setup Options
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Option 1: Connect Your Existing Wallet
                </h4>
                <p className="text-gray-700 mb-3">
                  Already have a MetaMask, Coinbase, or other wallet? Connect it
                  directly. You maintain complete control of your keys as you
                  always have. Perfect for crypto-native users.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Best for: Users with existing wallets
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Option 2: Privy Embedded Wallet
                </h4>
                <p className="text-gray-700 mb-3">
                  Create a wallet with just your email. Privy's embedded wallets
                  use distributed key sharding - your key is split between your
                  device, Privy's secure enclave, and a recovery method you
                  control. Neither Privy nor 0.finance can access your funds.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Best for: New to crypto
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Option 3: Gnosis Safe Multi-Sig
                </h4>
                <p className="text-gray-700 mb-3">
                  For larger organizations, set up a Gnosis Safe with multiple
                  signers. Require 2-of-3 or custom threshold approvals for
                  transactions. Connect via Privy for seamless access while
                  maintaining institutional-grade security.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">
                    Best for: Teams & enterprises
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 mt-8">
            <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
              How Privy Protects Your Keys
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0040FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Distributed Key Sharding
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Your private key is split into multiple shards using
                    Shamir's Secret Sharing. These shards are distributed across
                    your device, Privy's secure infrastructure, and your chosen
                    recovery method.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0040FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Secure Execution Environment
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Keys are only reconstituted within secure enclaves at the
                    moment of signing. Neither Privy nor 0.finance ever has
                    access to your complete private key.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#0040FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    User-Controlled Recovery
                  </h4>
                  <p className="text-gray-700 text-sm">
                    You control your recovery methods - whether through email,
                    SMS, or social auth. Even if you lose access to one method,
                    you can recover your wallet securely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Setup Options Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
              Wallet Setup Options
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Option 1: Full Self-Custody
                </h4>
                <p className="text-gray-700 mb-3">
                  You generate and control all keys. 0.finance never has access.
                  Maximum security and control for technically sophisticated
                  users.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Recommended for: Crypto-native companies
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Option 2: Assisted Setup
                </h4>
                <p className="text-gray-700 mb-3">
                  We help you set up your Safe with best practices, but you
                  control the keys from day one. Good balance of security and
                  convenience.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Recommended for: Most businesses
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Option 3: Managed Wallet (Coming Soon)
                </h4>
                <p className="text-gray-700 mb-3">
                  We handle key management with enterprise-grade security. You
                  maintain control through our interface. Easiest option with
                  bank-like experience.
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-medium">
                    Recommended for: Traditional businesses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Compliance Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 text-[#0040FF] mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1e46] mb-4">
              Regulatory Compliance
            </h2>
            <p className="text-lg text-[#5a6b91] max-w-3xl mx-auto">
              Operating within the legal framework while pushing boundaries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
                What We Are
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Software provider for self-custody wallet management
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Interface to traditional banking rails through partners
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Connector between DeFi protocols and fiat systems
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    100% legal and compliant with US regulations
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
                What We're Not
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Not a bank (no fractional reserve banking)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Not a custodian (you control your keys)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Not a money transmitter (we don't hold funds)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Not FDIC insured (but privately insured)
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-8">
            <AlertCircle className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-[#0f1e46] mb-4">
              Important Disclosures
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>
                • Digital assets and DeFi protocols involve risk. Past
                performance doesn't guarantee future results.
              </li>
              <li>
                • The 10% APY is variable and subject to change based on market
                conditions and protocol performance.
              </li>
              <li>
                • Insurance covers smart contract risks but not market risks or
                USDC depegging events.
              </li>
              <li>
                • Tax treatment of digital assets varies by jurisdiction.
                Consult your tax advisor.
              </li>
              <li>
                • This is not investment advice. Do your own research and
                understand the risks.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is this actually legal?
              </h3>
              <p className="text-gray-700">
                Yes, completely legal. Self-custody wallets are explicitly legal
                in the US and most jurisdictions. We operate as a software
                provider, not a financial institution. You're simply using
                technology to manage your own digital assets with banking-like
                features.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How is the 10% yield sustainable?
              </h3>
              <p className="text-gray-700">
                The yield comes from established DeFi protocols that have been
                operating for years. These include lending markets (like Aave),
                liquidity provision, and other yield strategies. The 10%
                includes the base protocol yield plus additional optimization
                strategies. This is sustainable because it's based on real
                economic activity, not speculation.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What happens if 0.finance shuts down?
              </h3>
              <p className="text-gray-700">
                Your funds remain completely safe and accessible. Since you
                control the keys to your wallet, you can always access your
                funds directly through the blockchain, even without our
                interface. The Gnosis Safe can be managed through their
                interface or any compatible wallet. This is the beauty of
                self-custody.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                How does the insurance actually work?
              </h3>
              <p className="text-gray-700">
                The insurance is underwritten by Chainproof (backed by Munich
                Re) and covers smart contract failures. If a covered protocol is
                hacked or fails, claims are processed and paid out in USDC. The
                coverage is automatic - you don't need to file claims yourself.
                Insurance premiums are already factored into the yield you
                receive.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can the government freeze my account?
              </h3>
              <p className="text-gray-700">
                Since you hold the keys, no one can freeze your wallet - not the
                government, not banks, not even us. However, USDC itself (like
                any regulated stablecoin) has freeze functions that Circle can
                activate under court order. This is extremely rare and only
                happens in cases of proven illicit activity.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What about taxes?
              </h3>
              <p className="text-gray-700">
                We provide standard transaction reports and tax documents
                compatible with traditional accounting software. The yield is
                generally treated as interest income. Converting between USDC
                and USD is typically not a taxable event since they're pegged
                1:1. However, tax treatment varies by jurisdiction - consult
                your tax advisor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f1e46] mb-4">
            Ready to take control?
          </h2>
          <p className="text-xl text-[#5a6b91] mb-8">
            Join companies earning 10% APY with full custody and insurance
            protection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              Open Your Account
            </Link>
            <Link
              href="https://cal.com/potato/0-finance-onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0050ff] text-lg font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border-2 border-[#0050ff]"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
