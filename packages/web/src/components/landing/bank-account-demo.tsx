'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';

export function BankAccountDemo() {
  return (
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard"
        title="Zero Finance - Dashboard"
      >
        <div className="bg-gray-50 p-6">
          {/* Balance Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Personal • USD</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-2">$25,109.42</h2>
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-sm font-medium">↑ 7.2%</span>
                <span className="text-gray-500 text-sm">Earning yield above 7-day runway</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                Move
              </button>
              <button className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Set Savings Rule
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Recent Activity</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Stripe Payout</p>
                    <p className="text-sm text-gray-500">Payment received</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$2,500.00</p>
                  <p className="text-xs text-gray-500">Today</p>
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Contractor Payment</p>
                    <p className="text-sm text-gray-500">To Acme Design Co.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">-$1,250.00</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Yield Earned</p>
                    <p className="text-sm text-gray-500">Daily earnings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">+$12.47</p>
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