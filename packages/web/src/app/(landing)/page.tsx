'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import {
  Landmark,
  CircleDollarSign,
  Euro,
  Wallet,
  ArrowRight,
  ChevronRight,
  Building,
  BarChart3,
  Receipt,
  CreditCard,
  PieChart,
  ScrollText,
  Copy,
  Check,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { authenticated, login, user } = usePrivy();
  const router = useRouter();
  const [navShadow, setNavShadow] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Nav shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate hero on mount
  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-[#fafafa] flex flex-col">
        {/* Navigation Bar */}
        <nav
          className={`border-b border-zinc-200 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50 transition-shadow duration-300 ${navShadow ? 'shadow-lg' : ''}`}
          style={{ boxShadow: navShadow ? '0 4px 16px rgba(0,0,0,0.06)' : undefined }}
        >
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-lg tracking-tight text-[#111827] hover:underline focus:underline transition-all font-bold lowercase">
                hyprsqrl
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/careers"
                className="text-sm font-medium text-[#111827] hover:underline focus:underline transition-all"
              >
                careers
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {authenticated && (
                <div className="relative flex items-center mr-2">
                  {/* Placeholder avatar, replace with user.avatar if available */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 to-purple-100 border border-zinc-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#4b5563]" />
                  </div>
                  {/* Badge */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                </div>
              )}
              {!authenticated ? (
                <Button
                  onClick={login}
                  size="lg"
                  className="bg-[#111827] text-white rounded-full hover:bg-[#222] focus:ring-2 focus:ring-[#2563eb] focus:outline-none transition-all px-8 py-3 font-semibold text-base shadow-md border border-[#111827] animate-hero-btn"
                  style={{ minWidth: 160 }}
                >
                  get started
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#2563eb] text-white rounded-full hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#2563eb] focus:outline-none transition-all px-8 font-semibold text-base shadow-md border border-[#2563eb] flex items-center gap-2"
                  style={{ minWidth: 160 }}
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  go to dashboard
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* HERO SECTION - Full width, mesh gradient, left-aligned headline, layered elements */}
        <div
          ref={heroRef}
          className={`relative w-full flex flex-col md:flex-row items-center md:items-start justify-between px-0 md:px-0 pt-20 pb-24 min-h-[520px] transition-opacity duration-700 ${heroVisible ? 'opacity-100 animate-fade-in' : 'opacity-0'}`}
          style={{ overflow: 'visible' }}
        >
          {/* Mesh gradient background */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <radialGradient id="mesh1" cx="60%" cy="30%" r="80%" gradientTransform="matrix(1 0 0 0.7 0 0)">
                  <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.13" />
                </radialGradient>
              </defs>
              <rect width="1440" height="600" fill="url(#mesh1)" style={{ mixBlendMode: 'screen' }} />
            </svg>
            {/* Optional: floating abstract shape for depth */}
            <svg className="absolute left-[-80px] top-[-60px] w-[320px] h-[320px] opacity-40 blur-2xl" viewBox="0 0 320 320" fill="none">
              <ellipse cx="160" cy="160" rx="160" ry="120" fill="#ede9fe" />
            </svg>
            {/* Optional: subtle mascot (squirrel) shape, very faint */}
            {/* <svg className="absolute right-12 bottom-0 w-32 h-32 opacity-10" ...>...</svg> */}
          </div>
          {/* Hero content */}
          <div className="relative z-10 flex flex-col items-start justify-center w-full max-w-2xl pl-8 md:pl-24 pr-8 md:pr-0">
            <h1 className="text-[48px] md:text-[56px] font-bold leading-tight text-[#111827] lowercase font-sans mb-4 tracking-tight hero-headline">
              get paid globally<br />
              <span className="text-[#111827] hero-headline-gradient">save more, pay less</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4b5563] mb-8 max-w-2xl font-normal leading-relaxed" style={{ fontWeight: 400, lineHeight: 1.5 }}>
              modern banking for freelancers and remote teams. usd or eur accounts, earn 10%+ on idle balance, zero hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mb-2">
              <Button
                onClick={login}
                className="bg-[#111827] text-white font-bold rounded-full px-8 py-5 text-base shadow-md border border-[#111827] hover:bg-[#222] focus:ring-2 focus:ring-[#2563eb] focus:outline-none transition-all animate-hero-btn"
                style={{ minWidth: 180 }}
              >
                get started
              </Button>
              <button
                onClick={() => window.open('https://cal.com/team/different-ai/onboarding', '_blank')}
                className="text-[#2563eb] font-medium border border-[#2563eb] bg-white rounded-full px-8 py-2 text-base hover:bg-[#f5f5f5] transition-all outline-none flex items-center gap-2 shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#2563eb]"
                style={{ minWidth: 120 }}
              >
                <ArrowRight className="w-4 h-4" />
                see it in action
              </button>
            </div>
          </div>
          {/* Optionally, floating UI element for depth (e.g., a card preview or stat) */}
          <div className="hidden md:block relative z-10 w-[420px] h-[340px] mr-[-40px] mt-8 animate-float-card">
            <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-white/80 shadow-xl border border-zinc-200 backdrop-blur-md flex flex-col items-center justify-center p-8">
              <div className="flex flex-col items-center gap-2">
                <PieChart className="w-10 h-10 text-[#10b981] mb-2" />
                <span className="text-2xl font-bold text-[#111827]">10% APY</span>
                <span className="text-sm text-[#4b5563]">on idle assets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Icons Row */}
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto mb-8 px-4 animate-fade-in">
          <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
            {/* Feature: Multi-currency */}
            <div className="flex flex-col items-center bg-[#f5f5f5] rounded-xl border border-zinc-200 px-4 py-3 min-w-[120px] max-w-[160px]">
              <Wallet className="h-6 w-6 text-[#2563eb] mb-1" />
              <span className="text-sm font-medium text-[#111827]">multi-currency</span>
            </div>
            {/* Feature: Auto yield */}
            <div className="flex flex-col items-center bg-[#f5f5f5] rounded-xl border border-zinc-200 px-4 py-3 min-w-[120px] max-w-[160px]">
              <BarChart3 className="h-6 w-6 text-[#2563eb] mb-1" />
              <span className="text-sm font-medium text-[#111827]">auto yield</span>
            </div>
            {/* Feature: Instant invoicing */}
            <div className="flex flex-col items-center bg-[#f5f5f5] rounded-xl border border-zinc-200 px-4 py-3 min-w-[120px] max-w-[160px]">
              <Receipt className="h-6 w-6 text-[#2563eb] mb-1" />
              <span className="text-sm font-medium text-[#111827]">instant invoicing</span>
            </div>
            {/* Feature: Secure transfers */}
            <div className="flex flex-col items-center bg-[#f5f5f5] rounded-xl border border-zinc-200 px-4 py-3 min-w-[120px] max-w-[160px]">
              <CreditCard className="h-6 w-6 text-[#2563eb] mb-1" />
              <span className="text-sm font-medium text-[#111827]">secure transfers</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-28 pt-10" id="features">
          <h2 className="text-4xl font-bold mb-6 text-center">
            The complete freelance banking toolkit
          </h2>
          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-16">
            Everything you need to run your business efficiently and save
            more, with none of the complexity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border border-blue-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <div className="rounded-full bg-blue-600/10 w-16 h-16 flex items-center justify-center mb-6 shadow-inner">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-9 h-9 flex items-center justify-center shadow-sm">
                  <CreditCard className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Global Banking
              </h3>
              <p className="text-gray-700">
                Receive USD and EUR payments from anywhere in the world. One
                account, multiple currencies, zero complexity.
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-blue-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                  US bank account with routing number
                </li>
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-blue-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                  European IBAN for EUR payments
                </li>
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-blue-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  </div>
                  Instant conversion to stablecoins
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 border border-purple-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <div className="rounded-full bg-purple-600/10 w-16 h-16 flex items-center justify-center mb-6 shadow-inner">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-9 h-9 flex items-center justify-center shadow-sm">
                  <PieChart className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Allocations
              </h3>
              <p className="text-gray-700">
                Automatically set aside money for taxes and expenses. Never be
                caught short when tax season comes.
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-purple-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  </div>
                  Automatic tax reservations
                </li>
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-purple-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  </div>
                  Custom allocation percentages
                </li>
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-purple-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                  </div>
                  Full control over transfers
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/40 border border-green-200/60 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <div className="rounded-full bg-green-600/10 w-16 h-16 flex items-center justify-center mb-6 shadow-inner">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full w-9 h-9 flex items-center justify-center shadow-sm">
                  <ScrollText className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Invoicing
              </h3>
              <p className="text-gray-700">
                Create, send and track professional invoices with multiple
                payment options including crypto and fiat.
              </p>
              <ul className="mt-5 space-y-2">
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-green-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  </div>
                  Professional invoice templates
                </li>
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-green-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  </div>
                  Multiple currency support
                </li>
                <li className="flex items-center text-gray-700 text-sm">
                  <div className="rounded-full bg-green-600/10 w-5 h-5 flex items-center justify-center mr-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                  </div>
                  Payment tracking & notifications
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing-section" className="mb-28 pt-10">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/40 border border-indigo-200/60 rounded-3xl p-12 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
            <h2 className="text-4xl font-bold mb-6 tracking-tight text-gray-900">
              Hands-on Onboarding Session
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-100 shadow-sm">
                <p className="text-3xl font-bold text-indigo-600 mb-2">$50</p>
                <p className="text-gray-600">One-time fee</p>
              </div>
              <div className="max-w-lg">
                <ul className="space-y-3 text-left">
                  <li className="flex items-start">
                    <div className="rounded-full bg-indigo-600/10 w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-700">
                      Personalized setup assistance to get your account
                      running
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-indigo-600/10 w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-700">
                      Detailed explanations on how the platform works
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-indigo-600/10 w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-700">
                      Strategies to maximize your yield and optimize returns
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <Button
              onClick={() =>
                window.open(
                  'https://cal.com/team/different-ai/onboarding',
                  '_blank',
                )
              }
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Book Your Session
            </Button>
          </div>
        </div>

        {/* What's New Section */}
        <div id="savings" className="mb-28 pt-10">
          <div className="relative mx-auto max-w-3xl rounded-3xl bg-white border border-[rgba(40,200,200,0.1)] px-8 py-12 flex flex-col items-center text-center transition hover:shadow-2xl hover:scale-105">
            <div className="flex items-center mb-2">
              <ArrowUpRight className="w-8 h-8 text-neutral-600 mr-2" />
              <span className="text-6xl font-extrabold tracking-tight text-neutral-900">
                10%
              </span>
              <span className="text-3xl font-semibold text-neutral-800 ml-2">
                APY on idle assets
              </span>
            </div>
            <div className="mt-2 text-lg text-neutral-600">
              Our high-yield vault is currently in
              <span className="inline-block bg-neutral-100 text-neutral-600 rounded-full px-3 py-1 text-xs font-semibold ml-2 align-middle">
                early access
              </span>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="mb-24">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Not ready to fully commit, but want to stay in the loop?
            </h2>
            <WaitlistForm />
          </div>
        </div>

        {/* BIOS Container */}
        <div className="w-full mb-20">
          <BiosContainer />
        </div>

        {/* Footer */}
        <div
          className="bios-footer text-center py-5 mt-auto border-t border-black/10 bg-[#F9F8FA] text-gray-500 text-xs font-sans"
        >
          <div className="copyright">
            © 2025 hyprsqrl • open source • crypto banking •{' '}
            <Link href="/careers" className="hover:underline">
              careers
            </Link>
          </div>
        </div>
      </div>
      <style jsx global>{`
        :root {
          --accent: #3DD68C;
          --accent-dark: #2FCB7F;
        }
        .bg-accent { background-color: var(--accent) !important; }
        .bg-accent-dark { background-color: var(--accent-dark) !important; }
        .text-accent { color: var(--accent) !important; }
        .border-accent { border-color: var(--accent) !important; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(32px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(48px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        /* Animate hero button */
        @keyframes hero-btn {
          0% { transform: scale(0.96); opacity: 0; }
          60% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-hero-btn { animation: hero-btn 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both; }
        /* Floating card animation */
        @keyframes float-card {
          0% { transform: translateY(24px) scale(0.98); opacity: 0; }
          60% { transform: translateY(-8px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-float-card { animation: float-card 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both; }
        /* Headline gradient (for split color) */
        .hero-headline-gradient {
          background: linear-gradient(90deg, #fef3c7 0%, #ede9fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
      `}</style>
    </>
  );
}

