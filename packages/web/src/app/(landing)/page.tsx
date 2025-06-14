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
      <div className="min-h-screen w-full flex flex-col py-10 px-6">
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
              
              {/* See how it works section */}
              <div className="w-full max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    see how it works
                  </h2>
                  <p className="text-lg text-white/80">
                    automate your financial workflow with intelligent banking
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature Card 1 */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-sm">$</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 text-center">
                      MAXIMIZE IDLE CASH
                    </h3>
                    <p className="text-white/70 text-center text-sm leading-relaxed">
                      surface opportunities to earn more on 
                      money sitting in your account
                    </p>
                  </div>
                  
                  {/* Feature Card 2 */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <div className="w-6 h-6 bg-blue-400 rounded grid grid-cols-2 gap-0.5 p-1">
                        <div className="bg-white rounded-sm"></div>
                        <div className="bg-white rounded-sm"></div>
                        <div className="bg-white rounded-sm"></div>
                        <div className="bg-white rounded-sm"></div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 text-center">
                      CHASE INVOICES
                    </h3>
                    <p className="text-white/70 text-center text-sm leading-relaxed">
                      automatically remind clients to pay 
                      their outstanding invoices
                    </p>
                  </div>
                  
                  {/* Feature Card 3 */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <div className="w-6 h-6 bg-purple-400 rounded flex items-center justify-center">
                        <div className="flex space-x-0.5">
                          <div className="w-0.5 h-3 bg-white rounded"></div>
                          <div className="w-0.5 h-4 bg-white rounded"></div>
                          <div className="w-0.5 h-2 bg-white rounded"></div>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3 text-center">
                      TRACK EXPENSES
                    </h3>
                    <p className="text-white/70 text-center text-sm leading-relaxed">
                      easily see and pay vendors and people 
                      you owe money to
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rest of content with normal background */}
      <div className="bg-white">
        <ProductPeek />
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
