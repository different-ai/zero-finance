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
            <p className="text-sm text-neutral-600 mb-2">
              Automated savings for startups and freelancers
            </p>
            <p className="text-xs text-neutral-400">
              A product by Different AI Inc.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-neutral-900">Product</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600">
                  How It Works
                </Link>
              </li>
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
                <Link href="/legal" className="hover:text-blue-600">
                  Legal & Security
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/insurance-terms"
                  className="hover:text-blue-600"
                >
                  Insurance Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Important Disclosure */}
        <div className="border-t border-neutral-200 pt-6 mb-6">
          <p className="text-xs text-neutral-400 max-w-4xl mx-auto text-center leading-relaxed">
            0 Finance is not a bank. Your funds are held in self-custody
            wallets, not bank accounts. Not FDIC insured. Yield rates are
            variable and not guaranteed. Smart contract insurance provided by
            Chainproof covers technical failures only, not market risks. Digital
            assets involve risk; past performance does not guarantee future
            results.
          </p>
        </div>

        <div className="border-t border-neutral-200 pt-6 text-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Different AI Inc. • Delaware, USA
          </p>
        </div>
      </div>
    </footer>
  );
}
