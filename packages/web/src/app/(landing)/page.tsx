'use client';

import React, { useEffect, useState } from 'react';
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
import FeatureHero from '@/components/landing/feature-hero';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  return (
    <>
      <div className="min-h-screen w-full  flex flex-col">
        {/* Navigation Bar */}
        <nav className="border-b border-zinc-200 py-4 sticky top-0 bg-[#fafafa]/80 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-lg tracking-tight text-[#111827] hover:underline focus:underline transition-all"
              >
                hyprsqrl
              </Link>
            </div>
            <div className="flex items-center space-x-6 ">
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <Link
                  href="/careers"
                  className="text-sm font-medium text-[#111827] hover:underline focus:underline transition-all"
                >
                  careers
                </Link>
                <Link
                  href="https://github.com/different-ai/hyprsqrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[#111827] hover:underline focus:underline transition-all"
                >
                  open source
                </Link>
              </div>
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
          <div
            className="relative w-full"
          >
            <Image
              src="/hero.png"
              alt="Hero background"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
              className="z-0"
            />
            <div className="absolute inset-0 bg-black opacity-50 z-10" /> {/* Overlay */}
            
            <div className="relative z-20 flex flex-col md:flex-row items-center justify-center w-full px-2 md:px-0 mt-12 mb-12 gap-8 max-w-9xl mx-auto">
              {/* Card */}
              <div className="relative w-full max-w-7xl px-8 md:px-12 py-12 flex flex-col items-center text-left animate-in fade-in duration-700 ease-in-out shadow-none">
                {/* Headline */}
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-white  font-sans leading-tight text-center">
                  banking for the remote world
                </h1>
                {/* Subheadline */}
                <p className="text-lg md:text-xl text-white font-bold mb-6 max-w-2xl font-mono uppercase text-center">
                  get a Usd or Eur account from anywhere in the world, earn 10%+ on idle balance, zero hidden fees.
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
                    className="text-[#2563eb] font-medium border border-[#2563eb] bg-white rounded-full px-8 py-2 text-base hover:bg-[#f5f5f5] transition-all outline-none"
                    style={{ minWidth: 120 }}
                  >
                    {/*  href to the onboarding section below with anchore */}
                    <a href="#pricinsection">see it in action</a>
                  </button>
                </div>
              </div>
              {/* Remove illustration for Swiss-style restraint */}
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-28 pt-10" id="features">
            <FeatureHero />
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
                        Advice to help you pay the lowest transfer fees
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
          <div className="bios-footer text-center py-5 mt-auto border-t border-black/10 bg-[#F9F8FA] text-gray-500 text-xs font-sans">
            <div className="copyright">
              © 2025 hyprsqrl •{' '}
              <Link
                href="https://github.com/different-ai/hyprsqrl"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                open source
              </Link>{' '}
              • crypto banking •{' '}
              <Link href="/careers" className="hover:underline">
                careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
