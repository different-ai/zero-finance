'use client';

import React from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Landmark, CircleDollarSign, FileText, Wallet, ArrowRight } from 'lucide-react';
import { BiosContainer } from '@/components/bios-container';

export default function Home() {
  const { authenticated, login } = usePrivy();
  
  return (
    <section className="bg-white text-gray-800 min-h-screen">
      {/* Header section with generous whitespace */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-center">
            Get paid in fiat & save in crypto
          </h1>
          <p className="text-gray-500 text-lg mb-12 max-w-2xl text-center">
            Manage invoices, bank accounts, tax allocations, and yield strategies in one place
          </p>
          
          {/* Card with more subtle border and shadow */}
          <div className="w-full max-w-md bg-white border border-gray-100/50 rounded-lg shadow-sm p-8 mb-6">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-8">Start managing your crypto finances</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                {authenticated ? (
                  <>
                    <Link 
                      href="/dashboard" 
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Bank Account</h4>
                <p className="text-gray-500 text-sm">Create and manage your crypto bank accounts with automatic allocations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Invoice Management</h4>
                <p className="text-gray-500 text-sm">Create, send, and track professional invoices with cryptocurrency payments</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Landmark className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Tax Allocations</h4>
                <p className="text-gray-500 text-sm">Automatically set aside funds for taxes with our smart allocation system</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                <CircleDollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Yield Strategies</h4>
                <p className="text-gray-500 text-sm">Grow your funds with automated yield-generating strategies (coming soon)</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="border border-gray-100/50 rounded-lg p-8 bg-gradient-to-r from-amber-50 to-blue-50 mb-16 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ready to streamline your finances?</h3>
            <p className="text-gray-600 mb-6 max-w-lg">Join today</p>
            
            {!authenticated && (
              <button 
                onClick={() => login()}
                className="inline-flex items-center justify-center rounded-md px-6 py-3 font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* BiosContainer section */}
        <div className="w-full">
          <BiosContainer />
        </div>
        
        {/* Footer section with more subtle border */}
        <div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-100/50">
        </div>
      </div>
      
      {/* BIOS Footer from landing page */}
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
