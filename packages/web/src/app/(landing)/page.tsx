'use client';

import React from 'react';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { ProductPeek } from '@/components/landing/product-peek';
import { Benefits } from '@/components/landing/benefits';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#f5f3f1]">
      {/* Hero Section with Contained Gradient Background */}
      <div className="min-h-screen w-full flex flex-col py-10 px-6 relative">
        {/* Navbar outside the gradient container */}
        <div className="w-full max-w-7xl mx-auto mb-6">
          <Navbar />
        </div>
        
        {/* Gradient Container */}
        <div 
          className="flex-1 w-full max-w-7xl mx-auto rounded-xl relative overflow-hidden"
          style={{
            background: `url('/new-bg.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Hero content */}
          <div className="relative z-10 flex flex-col min-h-full px-6 py-16">
            {/* Hero Section */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  a bank account that works for you
                </h1>
                
                <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Get paid faster, earn onIdle cash and always stay on top of your 
                  Taxes — all with one intelligent account.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors">
                    watch 30 sec demo
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors border border-white/20">
                    join waitlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ProductPeek overlapping at bottom of hero */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 w-full max-w-7xl px-6">
          <ProductPeek />
        </div>
      </div>
      
      {/* Rest of content with normal background - add top padding to account for overlapping ProductPeek */}
      <div className="bg-white pt-96">
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
