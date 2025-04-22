'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  Landmark,
  CircleDollarSign,
  FileText,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { authenticated, login } = usePrivy();
  const router = useRouter();

  return (
    <section className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-24">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-center text-gray-900">
              Get paid in fiat & save in crypto
            </h1>
            <p className="text-gray-600 text-lg mb-12 max-w-3xl text-center">
              Manage invoices, bank accounts, tax allocations, and yield
              strategies in one place
            </p>

            {!authenticated && (
              <Button onClick={login} size="lg" className="mb-6 bg-gray-900 hover:bg-gray-800 text-white">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {authenticated && (
              <Button
                onClick={() => router.push('/dashboard')}
                size="lg"
                className="mb-6 bg-gray-900 hover:bg-gray-800 text-white"
              >
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-10 mb-20 bg-white shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Key Features
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Wallet className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Bank Account</h4>
                  <p className="text-gray-600 text-sm">
                    Create and manage your crypto bank accounts with automatic
                    allocations
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Invoice Management
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Create, send, and track professional invoices with
                    cryptocurrency payments
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <Landmark className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Tax Allocations
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Automatically set aside funds for taxes with our smart
                    allocation system
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                  <CircleDollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    Yield Strategies
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Grow your funds with automated yield-generating strategies
                    (coming soon)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-10 mb-20 bg-white shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Latest Updates</h3>
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">April 22nd</span>
                <span className="text-gray-700">Released outgoing bank transfers - send your USDC anywhere in the world.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">April 17th</span>
                <span className="text-gray-700">Released bank account - get paid in USD and hold USDC.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">March 24th</span>
                <span className="text-gray-700">Released yield search - a chat to find the best yield opportunities.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">March 17th</span>
                <span className="text-gray-700 flex items-center gap-2">
                  Released request invoicing{'.'}
                  <img src="/request-req-logo.png" alt="Request Network Logo" className="h-4 w-4 inline-block" />
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center mb-20">
            <WaitlistForm />
          </div>

          <div className="border border-gray-200 rounded-lg p-10 bg-gradient-to-r from-gray-50 to-blue-50 mb-20 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to streamline your finances?
              </h3>
              <p className="text-gray-600 mb-8 max-w-lg">
                Sign up today to get started with managing your crypto finances
                efficiently.
              </p>
              {!authenticated ? (
                <Button onClick={login} variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-100">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="w-full mb-20">
            <BiosContainer />
          </div>

          <div className="text-center text-gray-500 text-sm pt-10 border-t border-gray-200"></div>
        </div>
      </div>

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
