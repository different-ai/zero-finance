'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen w-full bg-[#fafafa] flex flex-col">
        {/* Navigation Bar */}
        <nav className="border-b border-zinc-200 py-4 sticky top-0 bg-[#fafafa]/80 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-lg tracking-tight text-[#111827] hover:underline focus:underline transition-all">
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
            <div>
              {!authenticated ? (
                <Button
                  onClick={login}
                  size="lg"
                  className="bg-[#2563eb] text-white rounded-full hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#2563eb] focus:outline-none transition-all px-8 py-3 font-medium text-base shadow-sm border border-[#2563eb]"
                  style={{ minWidth: 160 }}
                >
                  get started
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#2563eb] text-white rounded-full hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#2563eb] focus:outline-none transition-all px-8 font-medium text-base shadow-sm border border-[#2563eb]"
                  style={{ minWidth: 160 }}
                >
                  go to dashboard
                </Button>
              )}
            </div>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center w-full px-2 md:px-0 mt-12 mb-12 gap-8 max-w-7xl mx-auto">

        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full px-2 md:px-0 mt-12 mb-12 gap-8 max-w-9xl mx-auto">
          {/* Card */}
          <div className="relative w-full max-w-3xl border border-zinc-200 rounded-3xl px-8 md:px-12 py-12 flex flex-col items-start text-left animate-fade-in shadow-none">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-[#111827] lowercase font-sans leading-tight">
              get paid globally<br />
              <span className="text-[#111827]">save more, pay less</span>
            </h1>
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-[#6b7280] mb-6 max-w-2xl font-medium lowercase font-sans">
              modern banking for freelancers and remote teams. usd or eur accounts, earn 10%+ on idle balance, zero hidden fees.
            </p>
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mb-2">
              <Button
                onClick={login}
                className="bg-[#2563eb] text-white font-bold rounded-full px-8 py-5 text-base shadow-sm border border-[#2563eb] hover:bg-[#1d4ed8] focus:ring-2 focus:ring-[#2563eb] focus:outline-none transition-all"
                style={{ minWidth: 180 }}
              >
                get started
              </Button>
              <button
                onClick={() => window.open('https://cal.com/team/different-ai/onboarding', '_blank')}
                className="text-[#2563eb] font-medium border border-[#2563eb] bg-white rounded-full px-8 py-2 text-base hover:bg-[#f5f5f5] transition-all outline-none"
                style={{ minWidth: 120 }}
              >
                see it in action
              </button>
            </div>
          </div>
          {/* Remove illustration for Swiss-style restraint */}
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
      `}</style>
      </div>
    </>
  );
}

