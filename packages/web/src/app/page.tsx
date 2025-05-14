'use client';

import React from 'react';
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
} from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  return (
    <section className="bg-white text-gray-900 min-h-screen flex flex-col ">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 py-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              hyprsqrl
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="#features"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="#resources"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Resources
            </Link>
            <Link
              href="#updates"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Updates
            </Link> */}
            <Link
              href="/careers"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Careers
            </Link>
          </div>
          <div>
            {!authenticated ? (
              <Button
                onClick={login}
                className="bg-black text-white rounded-md hover:bg-gray-800"
              >
                Get started
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-black text-white rounded-md hover:bg-gray-800"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-20 flex-grow">
        <div className="relative z-10 borderp-8 transition-all duration-300 hover:translate-y-[-2px]">
          {/* Hero Section */}
          {/* hero section */}
          <div className="flex flex-col items-center mb-20 text-center bg-gradient-to-br from-slate-50 to-sky-100 border border-blue-200/60 rounded-2xl p-8 transition-all duration-300 hover:translate-y-[-2px]">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
              Get paid in USD or EUR
              <br />
              Save more & pay less
            </h1>

            <p className="text-gray-600 text-lg mb-10 max-w-3xl text-center">
              {`A checking account to get paid in USD or EUR — plus a savings account earning >10% on idle assets.`}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {!authenticated ? (
                <>
                  <Button
                    onClick={login}
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Get started
                  </Button>
                  <Button
                    onClick={() => {
                      const pricingSection = document.getElementById('pricing-section');
                      pricingSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Hands-on Onboarding
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Go to Dashboard
                </Button>
              )}
            </div>

            {/* Dashboard Preview */}
            {/* <div className="w-full max-w-5xl mb-16 shadow-xl rounded-lg overflow-hidden border border-gray-200 aspect-[16/7] bg-gray-50 flex items-center justify-center">
              <p className="text-gray-400 text-lg">Dashboard Preview Area</p>
              <Image
                src="/dashboard-preview.png"
                alt="Hyprsqrl Dashboard"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div> */}

          
          </div>

          <MultiCurrencyAccounts />

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
                    <CreditCard
                      className="h-5 w-5 text-white"
                      strokeWidth={1.5}
                    />
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
                    <PieChart
                      className="h-5 w-5 text-white"
                      strokeWidth={1.5}
                    />
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
                    <ScrollText
                      className="h-5 w-5 text-white"
                      strokeWidth={1.5}
                    />
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
                      <p className="text-gray-700">Personalized setup assistance to get your account running</p>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-indigo-600/10 w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      </div>
                      <p className="text-gray-700">Detailed explanations on how the platform works</p>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-indigo-600/10 w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      </div>
                      <p className="text-gray-700">Strategies to maximize your yield and optimize returns</p>
                    </li>
                  </ul>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://cal.com/team/different-ai/onboarding', '_blank')}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Book Your Session
              </Button>
            </div>
          </div>

          {/* What's New Section */}
          <div id="savings" className="mb-28 pt-10">
            <div className="bg-gradient-to-br from-sky-50 via-teal-50 to-green-50 border border-teal-200/60 rounded-3xl p-12 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-gray-900">
                {`>10% APY on idle assets`}
              </h2>
              <p className="text-lg text-gray-700" >
                our high‑yield vault is currently in{' '}
                <span className="font-semibold">early&nbsp;access</span>.
              </p>
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

          {/* --- Savings Section --- */}
        </div>
      </div>

      {/* Footer */}
      <div
        className="bios-footer text-center py-5 mt-auto"
        style={{
          backgroundColor: '#0000aa',
          color: 'white',
          textAlign: 'center',
          padding: '8px',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
      >
        <div className="copyright">
          © 2025 HYPRSQRL • OPEN SOURCE • CRYPTO BANKING •{' '}
          <Link href="/careers" className="hover:underline">
            Careers
          </Link>
        </div>
      </div>
    </section>
  );
}

function MultiCurrencyAccounts() {
  return (
    <div
      id="accounts"
      className="bg-gradient-to-br from-slate-50 to-sky-100 rounded-3xl p-10 mb-28"
    >
      <h2 className="text-4xl font-bold text-center mb-4">
        multi-currency bank accounts
      </h2>
      <p className="text-center text-gray-600 mb-10">
        receive usd via ach or wire or eur via iban — no matter where you live
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* usd */}
        <div className="flex flex-col gap-3 bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 hover:-translate-y-1 transition shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">
                primary
                <br />
                account
              </h3>
              <p className="text-sm text-muted-foreground">usd · ach / wire</p>
            </div>
          </div>
          <div className="mt-auto space-y-2">
            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-300">
              <p className="text-xs uppercase text-gray-500 font-medium mb-0.5">
                Account Number
              </p>
              <p className="font-mono text-sm text-gray-900 font-semibold">
                123456789
              </p>
            </div>
            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-300">
              <p className="text-xs uppercase text-gray-500 font-medium mb-0.5">
                Routing Number
              </p>
              <p className="font-mono text-sm text-gray-900 font-semibold">
                021000021
              </p>
            </div>
          </div>
        </div>

        {/* eur */}
        <div className="flex flex-col gap-3 bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 hover:-translate-y-1 transition shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-500 text-white">
              <Euro className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">
                eur
                <br />
                account
              </h3>
              <p className="text-sm text-muted-foreground">eur · iban</p>
            </div>
          </div>
          <div className="mt-auto space-y-2">
            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-300">
              <p className="text-xs uppercase text-gray-500 font-medium mb-0.5">
                IBAN
              </p>
              <p className="font-mono text-sm text-gray-900 font-semibold break-all">
                NL91ABNA0417164300
              </p>
            </div>
          </div>
        </div>

        {/* crypto */}
        <div className="flex flex-col gap-3 bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 hover:-translate-y-1 transition shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500 text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">
                crypto
                <br />
                wallet
              </h3>
              <p className="text-sm text-muted-foreground">usdc on base</p>
            </div>
          </div>
          <div className="mt-auto space-y-2">
            <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-300">
              <p className="text-xs uppercase text-gray-500 font-medium mb-0.5">
                Address
              </p>
              <p className="font-mono text-sm text-gray-900 font-semibold break-all">
                0xAbCd...1234
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
