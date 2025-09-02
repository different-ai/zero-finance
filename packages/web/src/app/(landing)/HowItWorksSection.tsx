'use client';

import React from 'react';

export function HowItWorksSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-16 py-16 bg-blue-50">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0f1e46] mb-6 text-center">
            How <span className="text-[#0040FF]">you get your funds</span> and
            stay in control
          </h3>
          <p className="text-lg text-[#5a6b91] mb-8 text-center max-w-3xl mx-auto">
            Your money, your control - with the convenience of traditional
            banking
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#0040FF] font-bold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                  Sign Up with Your Email
                </h4>
                <p className="text-[#5a6b91] text-sm leading-relaxed">
                  Get started in minutes with just your email address. Simple
                  onboarding process to get you up and running quickly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#0040FF] font-bold text-sm">2</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                  Create Your Bank Accounts (US & EU)
                </h4>
                <p className="text-[#5a6b91] text-sm leading-relaxed">
                  Instantly receive{' '}
                  <span className="font-semibold italic text-orange-600">
                    ACH routing numbers
                  </span>{' '}
                  and{' '}
                  <span className="font-semibold italic text-orange-600">
                    SEPA IBANs
                  </span>{' '}
                  linked to your wallet. Set up both regions in seconds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#0040FF] font-bold text-sm">3</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                  Deposit USD, EUR, or USDC
                </h4>
                <p className="text-[#5a6b91] text-sm leading-relaxed">
                  Fund your account via{' '}
                  <span className="font-semibold italic text-orange-600">
                    ACH/Wire transfers
                  </span>
                  ,{' '}
                  <span className="font-semibold italic text-orange-600">
                    SEPA payments
                  </span>
                  , or{' '}
                  <span className="font-semibold italic text-orange-600">
                    onchain USDC transfers
                  </span>
                  . All fiat automatically converts to USDC.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#0040FF] font-bold text-sm">4</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                  Start Earning 10% APY on Idle Funds
                </h4>
                <p className="text-[#5a6b91] text-sm leading-relaxed">
                  Your USDC holdings immediately begin earning{' '}
                  <span className="font-semibold italic text-orange-600">
                    10% annual yield
                  </span>{' '}
                  with enterprise-grade insurance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-[#0040FF] font-bold text-sm">5</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0f1e46] mb-2 text-base">
                  Spend Like a Regular Bank
                </h4>
                <p className="text-[#5a6b91] text-sm leading-relaxed">
                  Send money via{' '}
                  <span className="font-semibold italic text-orange-600">
                    ACH, Wire, or SEPA
                  </span>{' '}
                  to third parties, or transfer{' '}
                  <span className="font-semibold italic text-orange-600">
                    USDC onchain
                  </span>{' '}
                  for instant payments.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              <strong>Bottom line:</strong> Your startup gets enterprise-grade
              banking with 10% yield, global accounts, and full custody - all in
              minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
