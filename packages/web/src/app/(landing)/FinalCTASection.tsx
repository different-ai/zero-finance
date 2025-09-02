'use client';

import React from 'react';
import Link from 'next/link';

export function FinalCTASection() {
  return (
    <>
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f1e46] mb-4 leading-tight">
              Ready to <span className="text-[#0040FF]">bank smarter</span> with
              your company&apos;s funds?
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#5a6b91] mb-8">
              Join companies that{' '}
              <span className="font-semibold italic text-orange-600">
                earn while they bank
              </span>
              .
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signin?source=crypto"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Sign Up
              </Link>
              <Link
                href="https://cal.com/potato/0-finance-onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 sm:px-10 py-4 sm:py-5 bg-white text-[#0050ff] text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg border-2 border-[#0050ff]"
              >
                Schedule Call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
