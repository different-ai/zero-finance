'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-6 px-2 rounded bg-neutral-900 text-white font-bold text-sm flex items-center">
                zero
              </div>
              <span className="ml-1 font-semibold text-neutral-800">finance</span>
            </div>
            <p className="text-sm text-neutral-600">
              the bank account that chases invoices and fills tax buckets automatically
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Product</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#pricing" className="hover:text-blue-600">Pricing</Link></li>
              <li><Link href="#demo" className="hover:text-blue-600">Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="/careers" className="hover:text-blue-600">Careers</Link></li>
              <li><Link href="https://github.com/different-ai/zero-finance" target="_blank" className="hover:text-blue-600">Open Source</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Legal</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><span className="text-neutral-400">Coming soon</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-200 pt-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} zero finance • crypto banking for modern freelancers
          </p>
        </div>
      </div>
    </footer>
  );
} 