'use client';

import React from 'react';
import { TrendingUp, Globe, Shield, Lock } from 'lucide-react';

export function WhatYouGetSection() {
  return (
    <section
      id="demo"
      className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-3 sm:mb-4">
            What&apos;s inside your{' '}
            <span className="text-[#0040FF]">account</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl font-light text-[#5a6b91] max-w-3xl mx-auto px-4">
            Everything you need to manage money globally. Simple, fast, and{' '}
            <span className="font-semibold italic text-orange-600">
              always in your control
            </span>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <TrendingUp className="w-12 h-12 text-[#0040FF] mb-4" />
            <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
              10% APY on USDC - Fully Insured
            </h3>
            <p className="text-[#5a6b91]">
              Earn 10% annual yield on your USDC holdings with enterprise-grade
              insurance from{' '}
              <span className="font-semibold italic text-orange-600">
                Munich Re
              </span>
              . Your funds are protected while generating consistent returns.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Globe className="w-12 h-12 text-[#0040FF] mb-4" />
            <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
              Instant Global Banking
            </h3>
            <p className="text-[#5a6b91]">
              Open US and EU bank accounts in{' '}
              <span className="font-semibold italic text-orange-600">
                seconds
              </span>
              . Get ACH routing numbers and SEPA IBANs instantly linked to your
              crypto wallet for seamless fiat-crypto operations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Shield className="w-12 h-12 text-[#0040FF] mb-4" />
            <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
              Corporate Cards with Smart Controls
            </h3>
            <p className="text-[#5a6b91]">
              Spend directly from your balance{' '}
              <span className="font-semibold italic text-orange-600">
                anywhere in the world
              </span>
              . Built-in spend management, real-time controls, and instant
              settlement from your USDC holdings.
              <span className="inline-flex items-center ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full border border-orange-200">
                Coming soon
              </span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <Lock className="w-12 h-12 text-[#0040FF] mb-4" />
            <h3 className="text-xl font-bold text-[#0f1e46] mb-3">
              Complete Self-Custody
            </h3>
            <p className="text-[#5a6b91]">
              Maintain{' '}
              <span className="font-semibold italic text-orange-600">
                full control
              </span>{' '}
              of your funds with your own keys. Choose between managed wallets
              for convenience or bring your own for maximum security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
