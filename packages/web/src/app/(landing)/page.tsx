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
            <div className="relative mx-auto max-w-3xl rounded-3xl bg-white border border-[rgba(40,200,200,0.1)] px-8 py-12 flex flex-col items-center text-center transition hover:shadow-2xl hover:scale-105">
              <div className="flex items-center mb-2">
                <ArrowUpRight className="w-8 h-8 text-neutral-600 mr-2" />
                <span className="text-6xl font-extrabold tracking-tight text-neutral-900">10%</span>
                <span className="text-3xl font-semibold text-neutral-800 ml-2">APY on idle assets</span>
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
  // Copy affordance state for each field
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});
  function handleCopy(label: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [label]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [label]: false })), 1200);
  }

  // Card data
  const cards = [
    {
      key: 'primary',
      icon: <CircleDollarSign className="h-8 w-8" />, // TODO: Replace with custom SVG
      iconBg: 'from-blue-400 to-blue-600',
      title: 'primary\naccount',
      subtitle: 'usd · ach / wire',
      fields: [
        { label: 'Account Number', value: '123456789' },
        { label: 'Routing Number', value: '021000021' },
      ],
      highlight: true,
    },
    {
      key: 'eur',
      icon: <Euro className="h-8 w-8" />, // TODO: Replace with custom SVG
      iconBg: 'from-violet-400 to-violet-600',
      title: 'eur\naccount',
      subtitle: 'eur · iban',
      fields: [
        { label: 'IBAN', value: 'NL91ABNA0417164300' },
      ],
      highlight: false,
    },
    {
      key: 'usdc',
      icon: <Wallet className="h-8 w-8" />, // TODO: Replace with custom SVG
      iconBg: 'from-emerald-400 to-emerald-600',
      title: 'usdc\nwallet',
      subtitle: 'usdc on base',
      fields: [
        { label: 'Address', value: '0xAbCd...1234' },
      ],
      highlight: false,
    },
  ];

  return (
    <div
      id="accounts"
      className="relative overflow-hidden rounded-3xl p-8 md:p-16 lg:p-20 mb-28"
    >
      {/* Floating brand SVG (blurred circle) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-sky-300 via-pink-200 to-teal-200 rounded-full blur-3xl opacity-40 z-0" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200 via-fuchsia-100 to-teal-100 rounded-full blur-2xl opacity-30 z-0" />
      {/* Section gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-sky-100 via-pink-100 to-teal-100" />
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-800 tracking-tight">
          Get paid with IBAN, ACH, or stablecoins—no matter where you live
        </h2>
        <p className="text-center text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Receive USD via ACH or wire, EUR via IBAN, or USDC onchain.
        </p>
        {/* Cards with fade-in animation */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch justify-center">
          {/* Card definitions inline for clarity and to match new titles */}
          {/* ACH / Wire account */}
          <div className="group relative flex flex-col gap-4 bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ease-out rounded-2xl px-4 py-5 md:px-5 md:py-6 max-w-xs w-full border border-white/30 ring-1 ring-inset ring-black/5 overflow-hidden animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg group-hover:animate-pulse">
                <CircleDollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight text-gray-800">ACH / Wire account</h3>
                <p className="text-xs text-muted-foreground">usd · ach / wire</p>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex items-center gap-1 w-full">
                <span className="text-xs text-gray-400 font-normal mr-1 min-w-[70px]">Account number</span>
                <span className="relative flex items-center w-full">
                  <span className={`font-mono text-sm text-gray-900 font-semibold bg-gray-100/80 rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap select-all max-w-full overflow-hidden text-ellipsis transition-colors duration-300 ${copied['achAccount'] ? 'bg-green-100/90' : ''}`}>{'123456789'}</span>
                  <button type="button" aria-label="Copy account number" className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center" onClick={() => handleCopy('achAccount', '123456789')} tabIndex={0} style={{ minWidth: 24, minHeight: 24 }}>{copied['achAccount'] ? (<Check className="h-4 w-4 text-green-500 transition-transform duration-200 scale-110" />) : (<Copy className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />)}</button>
                </span>
              </div>
              <div className="flex items-center gap-1 w-full">
                <span className="text-xs text-gray-400 font-normal mr-1 min-w-[70px]">Routing number</span>
                <span className="relative flex items-center w-full">
                  <span className={`font-mono text-sm text-gray-900 font-semibold bg-gray-100/80 rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap select-all max-w-full overflow-hidden text-ellipsis transition-colors duration-300 ${copied['achRouting'] ? 'bg-green-100/90' : ''}`}>{'021000021'}</span>
                  <button type="button" aria-label="Copy routing number" className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center" onClick={() => handleCopy('achRouting', '021000021')} tabIndex={0} style={{ minWidth: 24, minHeight: 24 }}>{copied['achRouting'] ? (<Check className="h-4 w-4 text-green-500 transition-transform duration-200 scale-110" />) : (<Copy className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />)}</button>
                </span>
              </div>
            </div>
          </div>
          {/* SEPA account */}
          <div className="group relative flex flex-col gap-4 bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ease-out rounded-2xl px-4 py-5 md:px-5 md:py-6 max-w-xs w-full border border-white/30 ring-1 ring-inset ring-black/5 overflow-hidden animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg group-hover:animate-pulse">
                <Euro className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight text-gray-800">SEPA account</h3>
                <p className="text-xs text-muted-foreground">eur · iban</p>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex items-center gap-1 w-full">
                <span className="text-xs text-gray-400 font-normal mr-1 min-w-[70px]">IBAN</span>
                <span className="relative flex items-center w-full">
                  <span className={`font-mono text-sm text-gray-900 font-semibold bg-gray-100/80 rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap select-all max-w-full overflow-hidden text-ellipsis transition-colors duration-300 ${copied['sepaIban'] ? 'bg-green-100/90' : ''}`}>{'NL91ABNA0417164300'}</span>
                  <button type="button" aria-label="Copy IBAN" className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center" onClick={() => handleCopy('sepaIban', 'NL91ABNA0417164300')} tabIndex={0} style={{ minWidth: 24, minHeight: 24 }}>{copied['sepaIban'] ? (<Check className="h-4 w-4 text-green-500 transition-transform duration-200 scale-110" />) : (<Copy className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />)}</button>
                </span>
              </div>
            </div>
          </div>
          {/* Stablecoin wallet */}
          <div className="group relative flex flex-col gap-4 bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 ease-out rounded-2xl px-4 py-5 md:px-5 md:py-6 max-w-xs w-full border border-white/30 ring-1 ring-inset ring-black/5 overflow-hidden animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg group-hover:animate-pulse">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight text-gray-800">Stablecoin wallet</h3>
                <p className="text-xs text-muted-foreground">usdc on base</p>
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <div className="flex items-center gap-1 w-full">
                <span className="text-xs text-gray-400 font-normal mr-1 min-w-[70px]">Address</span>
                <span className="relative flex items-center w-full">
                  <span className={`font-mono text-sm text-gray-900 font-semibold bg-gray-100/80 rounded-full px-3 py-0.5 shadow-sm whitespace-nowrap select-all max-w-full overflow-hidden text-ellipsis transition-colors duration-300 ${copied['usdcAddress'] ? 'bg-green-100/90' : ''}`}>{'0xAbCd...1234'}</span>
                  <button type="button" aria-label="Copy address" className="ml-1 p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center" onClick={() => handleCopy('usdcAddress', '0xAbCd...1234')} tabIndex={0} style={{ minWidth: 24, minHeight: 24 }}>{copied['usdcAddress'] ? (<Check className="h-4 w-4 text-green-500 transition-transform duration-200 scale-110" />) : (<Copy className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />)}</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(32px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>
    </div>
  );
}
