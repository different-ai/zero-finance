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
      <div className="min-h-screen w-full bg-[#F9F8FA] flex flex-col">
        {/* Navigation Bar */}
        <nav className="border-b border-black/10 py-4 sticky top-0 bg-[#F9F8FA]/80 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center font-bold text-lg tracking-tight text-gray-900 hover:underline focus:underline transition-all">
                hyprsqrl
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/careers"
                className="text-sm font-medium text-gray-700 hover:text-black hover:underline focus:underline transition-all"
              >
                careers
              </Link>
            </div>
            <div>
              {!authenticated ? (
                <Button
                  onClick={login}
                  className="bg-[#3DD68C] text-white rounded-full hover:shadow-lg hover:bg-[#2FCB7F] focus:ring-2 focus:ring-[#3DD68C] focus:outline-none transition-all px-8 py-3 font-medium text-base shadow-md"
                  style={{ minWidth: 160 }}
                >
                  get started
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-[#3DD68C] text-white rounded-full hover:shadow-lg hover:bg-[#2FCB7F] focus:ring-2 focus:ring-[#3DD68C] focus:outline-none transition-all px-8 py-3 font-medium text-base shadow-md"
                  style={{ minWidth: 160 }}
                >
                  go to dashboard
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* HERO SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full px-2 md:px-0 mt-12 mb-12 gap-8 max-w-7xl mx-auto">
          {/* Card */}
          <div className="relative w-full max-w-3xl bg-white border border-black/10 rounded-3xl shadow-xl px-8 md:px-12 py-12 flex flex-col items-start text-left animate-fade-in">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 lowercase font-sans leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
              get paid globally<br />
              <span className="text-black">save more, pay less</span>
            </h1>
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl font-medium lowercase font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
              modern banking for freelancers and remote teams. usd or eur accounts, earn 10%+ on idle balance, zero hidden fees.
            </p>
            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mb-2">
              <Button
                onClick={login}
                className="bg-[#3DD68C] text-white font-bold rounded-full px-8 py-3 text-base shadow-md hover:scale-105 hover:bg-[#2FCB7F] focus:ring-2 focus:ring-[#3DD68C] focus:outline-none transition-all"
                style={{ minWidth: 180 }}
              >
                get started
              </Button>
              <button
                onClick={() => window.open('https://cal.com/team/different-ai/onboarding', '_blank')}
                className="text-[#3DD68C] font-medium underline underline-offset-2 hover:text-[#2FCB7F] transition-all px-2 py-3 rounded-full"
                style={{ minWidth: 120 }}
              >
                see it in action
              </button>
            </div>
          </div>
          {/* Illustration (mocked squirrel + geometric scatter) */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-md md:max-w-lg animate-fade-in md:animate-slide-in-right mt-8 md:mt-0">
            {/* Geometric scatter (mocked) */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#E1F9EC] rounded-full blur-2xl opacity-60 z-0" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#E1F9EC] rounded-full blur-2xl opacity-40 z-0" />
            {/* Squirrel SVG (mocked) */}
            <div className="relative z-10">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="90" cy="90" rx="90" ry="90" fill="#E1F9EC"/>
                <ellipse cx="110" cy="120" rx="40" ry="30" fill="#fff"/>
                <ellipse cx="70" cy="80" rx="30" ry="40" fill="#fff"/>
                <ellipse cx="120" cy="70" rx="20" ry="30" fill="#fff"/>
                <ellipse cx="90" cy="90" rx="30" ry="30" fill="#fff"/>
                <ellipse cx="90" cy="90" rx="15" ry="15" fill="#3DD68C"/>
                {/* Squirrel face (mocked) */}
                <ellipse cx="90" cy="100" rx="8" ry="6" fill="#FBBF24"/>
                <ellipse cx="85" cy="98" rx="2" ry="2" fill="#000"/>
                <ellipse cx="95" cy="98" rx="2" ry="2" fill="#000"/>
                <ellipse cx="90" cy="104" rx="3" ry="1.5" fill="#000"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Feature Icons Row */}
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto mb-8 px-4 animate-fade-in">
          <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
            {/* Feature: Multi-currency */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-sm px-4 py-3 min-w-[120px] max-w-[160px]">
              <Wallet className="h-6 w-6 text-[#3DD68C] mb-1" />
              <span className="text-sm font-medium text-gray-700">multi-currency</span>
            </div>
            {/* Feature: Auto yield */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-sm px-4 py-3 min-w-[120px] max-w-[160px]">
              <BarChart3 className="h-6 w-6 text-[#3DD68C] mb-1" />
              <span className="text-sm font-medium text-gray-700">auto yield</span>
            </div>
            {/* Feature: Instant invoicing */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-sm px-4 py-3 min-w-[120px] max-w-[160px]">
              <Receipt className="h-6 w-6 text-[#3DD68C] mb-1" />
              <span className="text-sm font-medium text-gray-700">instant invoicing</span>
            </div>
            {/* Feature: Secure transfers */}
            <div className="flex flex-col items-center bg-white rounded-xl shadow-sm px-4 py-3 min-w-[120px] max-w-[160px]">
              <CreditCard className="h-6 w-6 text-[#3DD68C] mb-1" />
              <span className="text-sm font-medium text-gray-700">secure transfers</span>
            </div>
          </div>
        </div>

        {/* Trust Logos Row */}
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto mb-12 px-4 animate-fade-in">
          <div className="text-xs text-gray-400 mb-2">trusted by</div>
          <div className="flex flex-row items-center justify-center gap-6 opacity-80">
            {/* TODO: Replace with real logos */}
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none"><rect width="60" height="20" rx="4" fill="#E5E7EB"/><text x="30" y="14" textAnchor="middle" fill="#6B7280" fontSize="10">stripe</text></svg>
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none"><rect width="60" height="20" rx="4" fill="#E5E7EB"/><text x="30" y="14" textAnchor="middle" fill="#6B7280" fontSize="10">wise</text></svg>
            <svg width="60" height="20" viewBox="0 0 60 20" fill="none"><rect width="60" height="20" rx="4" fill="#E5E7EB"/><text x="30" y="14" textAnchor="middle" fill="#6B7280" fontSize="10">deel</text></svg>
          </div>
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
    </>
  );
}

