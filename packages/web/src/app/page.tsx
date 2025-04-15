'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { authenticated, login } = usePrivy();
  
  return (
    <section className="bg-white text-gray-800 min-h-screen">
      {/* Header section with generous whitespace */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Get Paid in Crypto, Simply.
          </h1>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl text-center">
            The easiest way to create, manage, and pay invoices using cryptocurrency
          </p>
          
          {/* Card with more subtle border and shadow */}
          <div className="w-full max-w-md bg-white border border-gray-100/50 rounded-lg shadow-sm p-8 mb-6">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-8">Create crypto invoices in seconds</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                {authenticated ? (
                  <>
                    <Link 
                      href="/dashboard/invoices" 
                      className="inline-flex items-center justify-center rounded-md px-6 py-3 font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard/create-invoice" 
                      className="inline-flex items-center justify-center rounded-md px-6 py-3 font-medium bg-white border border-gray-200/70 text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      Create Invoice
                    </Link>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => login()}
                      className="inline-flex items-center justify-center rounded-md px-6 py-3 font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors w-full sm:w-auto"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => login()}
                      className="inline-flex items-center justify-center rounded-md px-6 py-3 font-medium bg-white border border-gray-200/70 text-gray-800 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section with more subtle border style */}
        <div className="border border-gray-100/50 rounded-lg p-8 mb-16 bg-white shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Key Features</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Professional Invoices</h4>
                <p className="text-gray-500 text-sm">Generate professional crypto invoices in seconds</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Secure Transactions</h4>
                <p className="text-gray-500 text-sm">Decentralized payment processing with on-chain security</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">AI Assistance</h4>
                <p className="text-gray-500 text-sm">AI-assisted invoice creation and management</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sample Data Visualization with refined border */}
        <div className="border border-gray-100/50 rounded-lg p-8 bg-white mb-16 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Market Overview</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100/60">
                  <th className="pb-4 text-left font-medium text-gray-500 text-sm">Asset</th>
                  <th className="pb-4 text-right font-medium text-gray-500 text-sm">Price</th>
                  <th className="pb-4 text-right font-medium text-gray-500 text-sm">24h Change</th>
                  <th className="pb-4 text-right font-medium text-gray-500 text-sm">Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-50/60">
                  <td className="py-4 flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 font-medium">₿</div>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-gray-500 text-sm">BTC</div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium">$64,253.00</td>
                  <td className="py-4 text-right text-green-600">+2.4%</td>
                  <td className="py-4 text-right">
                    <svg height="24" width="100" viewBox="0 0 100 24" className="inline-block">
                      <path d="M0,12 L10,14 L20,10 L30,16 L40,8 L50,12 L60,14 L70,6 L80,18 L90,12 L100,10" 
                        fill="none" 
                        stroke="#10B981" 
                        strokeWidth="1.5" />
                    </svg>
                  </td>
                </tr>
                <tr className="border-b border-gray-50/60">
                  <td className="py-4 flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-medium">Ξ</div>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <div className="text-gray-500 text-sm">ETH</div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium">$3,485.79</td>
                  <td className="py-4 text-right text-red-600">-0.8%</td>
                  <td className="py-4 text-right">
                    <svg height="24" width="100" viewBox="0 0 100 24" className="inline-block">
                      <path d="M0,10 L10,12 L20,8 L30,14 L40,16 L50,12 L60,18 L70,14 L80,16 L90,10 L100,12" 
                        fill="none" 
                        stroke="#EF4444" 
                        strokeWidth="1.5" />
                    </svg>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 flex items-center gap-2">
                    <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center text-green-500 font-medium">$</div>
                    <div>
                      <div className="font-medium">USD Coin</div>
                      <div className="text-gray-500 text-sm">USDC</div>
                    </div>
                  </td>
                  <td className="py-4 text-right font-medium">$1.00</td>
                  <td className="py-4 text-right text-gray-600">0.0%</td>
                  <td className="py-4 text-right">
                    <svg height="24" width="100" viewBox="0 0 100 24" className="inline-block">
                      <path d="M0,12 L20,12 L40,12 L60,12 L80,12 L100,12" 
                        fill="none" 
                        stroke="#9CA3AF" 
                        strokeWidth="1.5" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footer section with more subtle border */}
        <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-100/50">
          <p>Powered by Request Network • All transactions secured on-chain</p>
        </div>
      </div>
    </section>
  );
}
