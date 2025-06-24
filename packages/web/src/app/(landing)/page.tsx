'use client';

import React from 'react';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Navbar } from '@/components/landing/navbar';
import { FeatureList } from '@/components/landing/feature-list';
import { ProductDemo } from '@/components/landing/product-demo';
import { Benefits } from '@/components/landing/benefits';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';
import { BankAccountDemo } from '@/components/landing/bank-account-demo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#F6F2F0]">
      {/* Hero Section with Contained Gradient Background */}
      <div className="min-h-screen w-full flex flex-col py-10 px-6 relative">
        {/* Navbar outside the gradient container */}
        <div className="w-full max-w-7xl mx-auto mb-6">
          <Navbar />
        </div>

        {/* Gradient Container */}
        <div className="flex-1 w-full max-w-7xl mx-auto rounded-xl  relative ">
          {/* add a black overlay */}
          <div
            className=" w-full h-full min-h-[1000px] absolute top-0 left-0 rounded-xl"
            style={{
              background: `url('bg.png')`,
              // reduce opacity to 0.5
              opacity: 0.8,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',

            }}
          />
        </div>
        {/* Dark overlay for better text readability */}

        {/* Hero content */}
        <div className="relative z-10 flex flex-col min-h-full px-6 pt-16  max-h-[700px]">
          {/* <div className="absolute inset-0 bg-black/20 z-20" /> */}
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                the ai-native bank account
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                we provide you a bank account that helps you get paid faster,
                earn more on idle cash, and make sure you have enough money to
                pay your taxes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  href="/signin"
                  className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20  px-8 py-4 rounded-lg font-semibold transition-colors border border-white/20"
                >
                  get started
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative max-w-5xl mx-auto w-full">
          <div className="my-12" />
          {/* Today's demo */}
          {/* white text */}
          {/* <div className="text-center mt-8 px-6 text-white mb-8">
            <h3 className="text-2xl font-bold text-white">
              what you can do today
            </h3>
            <p className="text-white/90 mt-2 max-w-2xl mx-auto">
              get an iban or ach account. send receive money from anywhere in
              the world. own usd wherever you are.
            </p>
          </div> */}

          <BankAccountDemo />
        </div>
      </div>

      {/* Individual Components with negative margin to create overlap effect */}
      <div className="relative z-10">
        <section
          className="py-16 bg-white rounded-2xl border border-neutral-200 mx-6 max-w-6xl lg:mx-auto mb-8 "
          id="demo"
        >
          <div className="px-6 m">
            {/* See how it works section */}
            <div className="w-full max-w-5xl mx-auto mb-16">
              <FeatureList />
            </div>

            {/* <ProcessSteps /> */}
            <div className="text-center mt-8 px-6 mb-16">
              <h3 className="text-2xl font-bold text-neutral-800">
                we&apos;re building a bank account that earns for you
              </h3>
              <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
                our smart bank account analyzes your cash flow and automatically
                moves idle funds into high-yield, safe investments so you can
                earn more, effortlessly. this feature is currently in
                development.
              </p>
            </div>
          </div>
          {/*  make max width 5xl */}
          <div className="max-w-5xl mx-auto">
            <ProductDemo />
          </div>
        </section>
      </div>

      {/* Rest of content with normal background */}
      <div className="bg-white">
        <Benefits />
        <Pricing />

        {/* Waitlist Form Section */}
        <section id="waitlist-section" className="py-16 bg-neutral-50">
          <div className="max-w-md mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-neutral-900">
                not ready to commit?
              </h2>
              <p className="text-neutral-600">
                join the waitlist and get notified when we launch
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
