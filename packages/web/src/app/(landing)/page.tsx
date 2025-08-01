'use client';

import React, { useState, useEffect } from 'react';
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
import { OrangeDAOLogo } from '@/components/orange-dao-logo';


export default function MainLandingPage() {
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

      {/* Hero Section - Clean and Simple */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 pt-8 sm:pt-12 lg:pt-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight mb-6 leading-[0.9] sm:leading-[0.85]">
              <span className="text-[#0040FF]">Self-custody</span>
              <br />
              <span className="text-black">business banking.</span>
            </h1>
            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-black leading-[1.2]">
                A new kind of business account where{' '}
                <span className="text-orange-600 font-semibold italic">
                  you control the keys
                </span>
                .
              </p>
            </div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-normal text-[#5a6b91] mt-6 max-w-3xl mx-auto leading-relaxed">
              Traditional banking features with cryptographic ownership. 
              Send wires, receive payments, earn yield - all while maintaining 
              complete control of your funds.
            </h2>

            {/* Backed by Orange DAO */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <span className="text-xs text-[#5a6b91] uppercase tracking-wider">Backed by</span>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center m-8">
            <Link
              href="/crypto"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
            >
              For Crypto Companies →
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white hover:bg-gray-50 text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.98] shadow-lg border-2 border-[#0050ff]"
            >
              For Traditional Business →
            </Link>
          </div>

        </div>
      </section>

      {/* How It Works Section - Moved Up */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f1e46] mb-4">
              How self-custody banking works
            </h2>
            <p className="text-xl text-[#5a6b91] max-w-3xl mx-auto">
              Traditional banking security meets cryptographic ownership. You get the best of both worlds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-[#0040FF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Your Keys, Your Control
              </h3>
              <p className="text-[#5a6b91]">
                Funds stored as USDC in wallets you control. No bank or government can freeze your assets.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#0040FF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Banking Rails Access
              </h3>
              <p className="text-[#5a6b91]">
                Send wires, receive ACH/IBAN payments. Seamless conversion between fiat and USDC.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#0040FF] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#0f1e46] mb-2">
                Bring Your Own Wallet
              </h3>
              <p className="text-[#5a6b91]">
                Already have a wallet? Connect it directly. Full compatibility with existing crypto infrastructure.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-semibold text-[#0f1e46] mb-4">
              Two paths, same powerful outcome
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Link
                href="/crypto"
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#0040FF]"
              >
                <h4 className="text-xl font-semibold text-[#0f1e46] mb-2">
                  Crypto Native Companies
                </h4>
                <p className="text-[#5a6b91] mb-4">
                  Bridge between DeFi and TradFi. Move funds from protocols to banking rails instantly.
                </p>
                <span className="text-[#0040FF] font-semibold">Learn more →</span>
              </Link>

              <Link
                href="/business"
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-[#0040FF]"
              >
                <h4 className="text-xl font-semibold text-[#0f1e46] mb-2">
                  Traditional Businesses
                </h4>
                <p className="text-[#5a6b91] mb-4">
                  Banking without the fear of sudden closures. Perfect for high-risk industries.
                </p>
                <span className="text-[#0040FF] font-semibold">Learn more →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* Key Benefits Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#0f1e46] mb-12">
            Why businesses choose self-custody banking
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <Shield className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                No Account Closures
              </h3>
              <p className="text-[#5a6b91]">
                Your keys, your control. No bank can freeze or close your account.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <TrendingUp className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Earn 4-8% APY
              </h3>
              <p className="text-[#5a6b91]">
                Your idle cash automatically earns yield. No action required.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <DollarSign className="w-12 h-12 text-[#0040FF] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
                Full Banking Features
              </h3>
              <p className="text-[#5a6b91]">
                Send wires, receive payments, manage multiple currencies.
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
              Choose your path to{' '}
              <span className="text-[#0040FF]">self-custody banking</span>
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Whether you're a crypto company or traditional business,{' '}
              <span className="font-semibold italic text-orange-600">
                we have a solution for you
              </span>
              .
            </p>
            {/* Secondary CTA */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/crypto"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                I'm a Crypto Company →
              </Link>
              <Link
                href="/business"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border-2 border-[#0050ff]"
              >
                I'm a Traditional Business →
              </Link>
            </div>
            <div className="mt-8">
              <Link
                href="https://cal.com/potato/0-finance-onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0050ff] hover:text-[#0050ff]/80 font-medium"
              >
                Not sure? Schedule a call →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
