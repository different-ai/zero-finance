'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';

export function BankAccountDemo() {
  return (
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard"
        title="Zero Finance - Smart Bank Account"
      >
        <div className="bg-gray-50 p-4 md:p-6">
          {/* Balance Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Personal • USD</p>
                </div>
              </div>
              <button className="text-sm text-gray-400">•••</button>
            </div>
            
            <div className="mb-4">
              <h2 className="text-3xl font-bold text-gray-900">$25,109.42</h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-green-600">↑</span> Savings Rule: Not active
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tip: Set Savings Rule to start automatically saving
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Move
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Set Savings Rule
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Transaction History</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-xs">↓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Received USDC</p>
                    <p className="text-xs text-gray-500">From Stripe Payout</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+$2,500.00</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs">↑</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sent USDC</p>
                    <p className="text-xs text-gray-500">To Circle Inc.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">-$1,000.00</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserWindow>
    </div>
  );
} 