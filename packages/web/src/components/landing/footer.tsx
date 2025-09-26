'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-12 mt-0">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/new-logo-bluer.png"
                alt="Zero Finance"
                width={48}
                height={48}
                className="w-12 h-12 object-contain rounded-md"
              />
              <span className="text-xl font-semibold text-[#0050ff] tracking-tight">
                finance
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              the crypto bank account that earns yield while you bank globally
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Product</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="#pricing" className="hover:text-blue-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#demo" className="hover:text-blue-600">
                  Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Company</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/careers" className="hover:text-blue-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/different-ai/zero-finance"
                  target="_blank"
                  className="hover:text-blue-600"
                >
                  Open Source
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Legal</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <span className="text-neutral-400">Coming soon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} 0 finance • crypto-native banking with
            yield
          </p>
        </div>
      </div>
    </footer>
  );
}
