'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { FileText, Send, DollarSign } from 'lucide-react';

export function BankAccountDemo() {
  return (
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard"
        title="Zero Finance - Dashboard"
      >
        <div className="bg-gray-50 p-6">
          {/* Balance Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">$</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Business • USD</p>
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
              <p className="text-sm text-gray-500">Available balance</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send
              </button>
              <button className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Invoice
              </button>
              <button className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" />
                Request
              </button>
            </div>
          </div>

          {/* Recent Invoices */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Recent Invoices</h3>
            <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">INV-2024-001</p>
                    <p className="text-sm text-gray-500">Acme Corp</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$4,250.00</p>
                  <p className="text-xs text-green-600 font-medium">Paid</p>
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">INV-2024-002</p>
                    <p className="text-sm text-gray-500">Tech Solutions Ltd</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$2,800.00</p>
                  <p className="text-xs text-orange-600 font-medium">Pending</p>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">INV-2024-003</p>
                    <p className="text-sm text-gray-500">Design Studio</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$1,500.00</p>
                  <p className="text-xs text-gray-500 font-medium">Draft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserWindow>
    </div>
  );
} 