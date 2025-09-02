'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

export function HeroSection() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 w-full h-screen overflow-hidden">
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 hidden sm:block"
        >
          <source
            src="https://cdn.midjourney.com/video/b1844fe8-1f77-48e4-81be-b5918c753e77/2.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff] sm:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#dfe7ff]/90" />
      </div>

      <section
        className="relative z-10 px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24"
        style={{ paddingBottom: 'calc(6rem + 70px)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-[0.9] sm:leading-[0.85]">
              Open a <span className="text-[#0040FF]">10% savings</span>
              <br />
              account for your startup
            </h1>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-[#0040FF]/10 text-[#0040FF] rounded-full border border-[#0040FF]/20 font-medium text-sm">
                10% APY fully insured
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-[#0040FF]/10 text-[#0040FF] rounded-full border border-[#0040FF]/20 font-medium text-sm">
                Instant US/EU Bank Account
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-[#0040FF]/10 text-[#0040FF] rounded-full border border-[#0040FF]/20 font-medium text-sm">
                Corporate cards
              </div>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-[1.2]">
                Get started by depositing{' '}
                <span className="text-[#0040FF] font-semibold">USD/EUR</span> or{' '}
                <span className="text-[#0040FF] font-semibold">USDC</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center m-8">
              <Link
                href="/signin?source=crypto"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#0050ff] hover:bg-[#0050ff]/90 text-white text-lg sm:text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.97] shadow-lg shadow-[#0050ff]/25"
              >
                Sign Up
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              <span className="text-xs text-[#5a6b91] uppercase tracking-wider">
                Backed by
              </span>
              <a
                href="https://www.orangedao.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <OrangeDAOLogo className="h-6 w-auto" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-2 mt-16">
              <span className="text-[#0050ff] text-lg font-semibold">
                Try Me
              </span>
              <span className="text-orange-600 text-lg font-semibold">
                <ArrowDown className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
