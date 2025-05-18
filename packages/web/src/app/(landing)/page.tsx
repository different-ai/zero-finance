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
      <div className="min-h-screen w-full flex flex-col text-neutral-800">
        <nav className="border-b border-neutral-200 py-6 sticky top-0 bg-[#FAFAF4]/80 backdrop-blur-md z-50">
          <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-lg tracking-tight text-neutral-900 hover:text-[#2663FF] focus:text-[#2663FF] transition-all"
              >
                hyprsqrl
              </Link>
            </div>
            <div className="flex items-center space-x-6 ">
              <div className="hidden md:flex items-center space-x-6 mr-4">
                <Link
                  href="/careers"
                  className="text-sm font-medium text-neutral-700 hover:text-[#2663FF] focus:text-[#2663FF] transition-all"
                >
                  careers
                </Link>
                <Link
                  href="https://github.com/different-ai/hyprsqrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-700 hover:text-[#2663FF] focus:text-[#2663FF] transition-all"
                >
                  open source
                </Link>
              </div>
              {!authenticated ? (
                <Button
                  onClick={login}
                  size="lg"
                  className="bg-[#2663FF] text-white rounded-lg hover:bg-[#1A4FDB] focus:ring-2 focus:ring-[#2663FF] focus:outline-none transition-all px-8 py-3 font-medium text-base shadow-sm border border-[#2663FF]"
                  style={{ minWidth: 160 }}
                >
                  get started
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#2663FF] text-white rounded-lg hover:bg-[#1A4FDB] focus:ring-2 focus:ring-[#2663FF] focus:outline-none transition-all px-8 font-medium text-base shadow-sm border border-[#2663FF]"
                  style={{ minWidth: 160 }}
                >
                  go to dashboard
                </Button>
              )}
            </div>
          </div>
        </nav>
        <div className=" flex flex-col items-center justify-center w-full px-2 md:px-0 mt-16 mb-16 gap-16 max-w-7xl mx-auto">
          <div className="mx-auto relative">
            <div className="w-full max-w-6xl px-8 md:px-12 py-12 flex flex-col items-center text-center ">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight text-neutral-900 font-sans leading-tight">
                banking for the remote world
              </h1>
              <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl font-sans text-center">
                get a usd or eur account from anywhere in the world, earn 10%+
                on idle balance, zero hidden fees.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Button
                  onClick={() => {
                    if (authenticated) {
                      router.push('/dashboard');
                      return;
                    }
                    login();
                  }}
                  className="bg-[#2663FF] text-white font-bold rounded-lg px-8 py-3 text-base shadow-sm border border-[#2663FF] hover:bg-[#1A4FDB] focus:ring-2 focus:ring-[#2663FF] focus:outline-none transition-all"
                  style={{ minWidth: 180 }}
                >
                  get started
                </Button>
                <Button
                  variant="outline"
                  className="text-[#2663FF] font-medium border-[#2663FF] bg-transparent rounded-lg px-8 py-3 text-base hover:bg-[#2663FF]/10 transition-all outline-none"
                  style={{ minWidth: 180 }}
                  onClick={() => {
                    const el = document.getElementById('features');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  see it in action
                </Button>
              </div>
     
            </div>
       
          </div>

          <div id="features" className="w-full">
            <FeatureHero />
          </div>

          <div id="pricing-section" className="w-full max-w-4xl">
            <div className="bg-white border border-neutral-200 rounded-3xl p-8 sm:p-12 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
              <h2 className="text-4xl font-bold mb-6 tracking-tight text-neutral-800">
                Hands-on Onboarding Session
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-10 mb-8">
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 shadow-sm">
                  <p className="text-3xl font-bold text-[#2663FF] mb-2">$50</p>
                  <p className="text-neutral-600">One-time fee</p>
                </div>
                <div className="max-w-lg">
                  <ul className="space-y-3 text-left">
                    {[
                      'Personalized setup assistance to get your account running',
                      'Advice to help you pay the lowest transfer fees',
                      'Strategies to maximize your yield and optimize returns',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`rounded-full bg-[#2663FF]/10 w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}
                        >
                          <div
                            className={`w-2 h-2 bg-[#2663FF] rounded-full`}
                          ></div>
                        </div>
                        <p className="text-neutral-700">{item}</p>
                      </li>
                    ))}
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
                className="bg-[#2663FF] hover:bg-[#1A4FDB] text-white rounded-lg px-8 py-3"
              >
                Book Your Session
              </Button>
            </div>
          </div>

          <div id="savings" className="w-full max-w-3xl">
            <div className="relative mx-auto rounded-3xl bg-white border border-neutral-200 px-8 py-12 flex flex-col items-center text-center transition hover:shadow-2xl hover:scale-105 shadow-lg">
              <div className="flex items-center mb-2">
                <ArrowUpRight className="w-8 h-8 text-neutral-500 mr-2" />
                <span className="text-6xl font-extrabold tracking-tight text-neutral-800">
                  10%
                </span>
                <span className="text-3xl font-semibold text-neutral-700 ml-2">
                  APY on idle assets
                </span>
              </div>
              <div className="mt-2 text-lg text-neutral-600">
                Our high-yield vault is currently in
                <span className="inline-block bg-neutral-100 text-neutral-700 rounded-full px-3 py-1 text-xs font-semibold ml-2 align-middle border border-neutral-200">
                  early access
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
                Not ready to fully commit, but want to stay in the loop?
              </h2>
              <WaitlistForm />
            </div>
          </div>

          <div className="w-full">
            <BiosContainer />
          </div>

          <footer className="w-full text-center py-8 mt-auto border-t border-neutral-200 bg-white text-neutral-500 text-xs font-sans">
            <div className="max-w-6xl mx-auto px-6">
              <div className="mb-2">
                <Link
                  href="/"
                  className="text-neutral-600 hover:text-[#2663FF] mx-2"
                >
                  Product
                </Link>
                <Link
                  href="/careers"
                  className="text-neutral-600 hover:text-[#2663FF] mx-2"
                >
                  Company
                </Link>
              </div>
              <div className="copyright">
                © {new Date().getFullYear()} hyprsqrl •{' '}
                <Link
                  href="https://github.com/different-ai/hyprsqrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-600 hover:text-[#2663FF]"
                >
                  open source
                </Link>{' '}
                • crypto banking •{' '}
                <Link
                  href="/careers"
                  className="text-neutral-600 hover:text-[#2663FF]"
                >
                  careers
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
