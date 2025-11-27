'use client';

import React from 'react';
import {
  Shield,
  DollarSign,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

interface DashboardDemoProps {
  onDepositClick: () => void;
  onTransferClick: () => void;
}

export function DashboardDemo({
  onDepositClick,
  onTransferClick,
}: DashboardDemoProps) {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-[#0f1e46] mb-6 sm:mb-8 px-2">
          See how it works:{' '}
          <span className="text-[#0040FF] block sm:inline">
            Deposit → Earn → Spend
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900">Deposit Funds</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-2">
                  Wire funds to your account:
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Routing:</span>
                    <span className="font-mono text-xs font-semibold">
                      021000021
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Account:</span>
                    <span className="font-mono text-xs font-semibold">
                      1234567890
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onDepositClick}
                className="w-full py-2.5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white font-semibold rounded-md transition-all text-sm"
              >
                Deposit USD/EUR/USDC
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <DollarSign className="w-4 h-4" />
                <ArrowRight className="w-3 h-3" />
                <span className="font-semibold">Auto-converts to USDC</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#0050ff]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#0050ff] font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900">Earn 10% APY</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <p className="text-xs text-gray-600 mb-3">Your balance:</p>
                <div className="text-2xl font-bold text-gray-800">$500,000</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-green-600 font-medium">
                    Earning daily:
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    +$136.99
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <p className="text-xs text-blue-800">
                    <strong>Insured by Chainproof (licensed insurer)</strong>
                  </p>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Coverage up to $1M.{' '}
                  <a href="/legal/insurance-terms" className="underline">
                    Learn more
                  </a>
                </p>
              </div>

              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto" />
                <p className="text-xs text-gray-600 mt-2">
                  Annual earnings:{' '}
                  <strong className="text-green-600">$50,000</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900">Spend with Card</h3>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                Soon
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#0050ff] to-[#0040ff] rounded-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="white" />
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p className="text-xs opacity-80 mb-3">Corporate Debit Card</p>
                <div className="font-mono text-sm tracking-wider mb-3">
                  •••• •••• •••• 4242
                </div>
                <div className="flex justify-between">
                  <span className="text-xs">Your Company</span>
                  <span className="text-xs">10/28</span>
                </div>
              </div>

              <button
                onClick={onTransferClick}
                className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md transition-all text-sm border border-gray-200"
              >
                Send Wire/ACH/SEPA
              </button>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Instant global payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Auto-converts from USDC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span>Real-time spending controls</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <p className="text-center text-sm text-gray-700">
              <strong>Your complete banking flow:</strong> Deposit from any
              source → Earn 10% automatically → Spend globally with cards or
              wires.
              <span className="text-[#0050ff] font-semibold">
                {' '}
                All while maintaining full custody.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
