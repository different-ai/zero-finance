'use client';

import React from 'react';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { ProductPeek } from '@/components/landing/product-peek';
import { Benefits } from '@/components/landing/benefits';
import { Pricing } from '@/components/landing/pricing';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Brutalist background with animated grain */}
      <div className="fixed inset-0 -z-10 bg-neutral-100"></div>
      <div className="fixed inset-0 -z-10 opacity-40 bg-grain animate-grain"></div>
      
      <Navbar />
      <Hero />
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
  );
}
