'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import {
  Landmark,
  CircleDollarSign,
  FileText,
  Wallet,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  return (
    <section className="bg-white text-gray-900 min-h-screen">
      {/* Navigation Bar */}
      <nav className="border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/hyprsqrl-logo.svg" alt="Hyprsqrl" width={104} height={32} />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="#resources" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Resources
            </Link>
            <Link href="#updates" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Updates
            </Link>
          </div>
          <div>
            {!authenticated ? (
              <Button onClick={login} className="bg-black text-white rounded-md hover:bg-gray-800">
                Start free trial
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
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="flex flex-col items-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-center text-gray-900">
              Simplify your finances.<br />
              Get paid in USD. Save in crypto.
            </h1>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl text-center">
              Manage invoices, bank accounts, and taxes — all in one crypto-
              native dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {!authenticated ? (
                <Button onClick={login} size="lg" className="bg-black hover:bg-gray-800 text-white">
                  Start free trial
                </Button>
              ) : (
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Go to Dashboard
                </Button>
              )}
              <Button variant="outline" size="lg" className="border-gray-300">
                How it works
              </Button>
            </div>

            {/* Dashboard Preview */}
            <div className="w-full max-w-5xl mb-24 shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <Image 
                src="/dashboard-preview.png" 
                alt="Hyprsqrl Dashboard" 
                width={1200} 
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-24" id="features">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Everything you need to run your freelance business
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-50">
                    <Wallet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900">Crypto bank account</h4>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Manage USD and USDC in one place. Create and manage your crypto bank accounts with automatic allocations.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-50">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900">Invoice automation</h4>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Send professional invoices, get paid in crypto. Create, send, and track professional invoices with cryptocurrency payments.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-50">
                    <Landmark className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900">Tax allocations</h4>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Never forget to set aside for taxes again. Automatically set aside funds for taxes with our smart allocation system.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-50">
                    <CircleDollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl text-gray-900">Yield strategies</h4>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  Earn passive yield on idle crypto. Grow your funds with automated yield-generating strategies.
                </p>
              </div>
            </div>
          </div>

          {/* What's New Section */}
          <div className="mb-24" id="updates">
            <h2 className="text-3xl font-bold mb-8">What&apos;s new</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-600" />
                <span>Request invoicing</span>
                <ChevronRight className="h-4 w-4 text-blue-600" />
                <span>now live</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-blue-600" />
                <span>USDC bank transfers</span>
                <ChevronRight className="h-4 w-4 text-blue-600" />
                <span>send globally</span>
              </div>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="mb-24">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">Enter your email</h2>
              <WaitlistForm />
            </div>
          </div>

          {/* BIOS Container */}
          <div className="w-full mb-20">
            <BiosContainer />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="bios-footer"
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
          © 2025 HYPRSQRL • OPEN SOURCE • CRYPTO BANKING
        </div>
      </div>
    </section>
  );
}
