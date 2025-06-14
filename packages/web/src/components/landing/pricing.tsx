'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const scrollToWaitlist = () => {
  const waitlistSection = document.getElementById('waitlist-section');
  waitlistSection?.scrollIntoView({ behavior: 'smooth' });
};

export function Pricing() {
  return (
    <section className="py-16 max-w-4xl mx-auto px-6" id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900">
          simple pricing
        </h2>
        <p className="text-lg text-neutral-600">
          free bank account, pay for AI features when you need them
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Tier */}
        <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-neutral-900">
            bank account
          </h3>
          <div className="text-3xl font-bold mb-2 text-neutral-900">
            Free
          </div>
          <p className="text-neutral-600 mb-6">
            ach in &amp; out, basic banking
          </p>
          <ul className="text-sm text-neutral-600 mb-8 space-y-2 text-left">
            <li>• virtual bank account</li>
            <li>• ach transfers in &amp; out</li>
            <li>• basic transaction history</li>
            <li>• mobile app access</li>
          </ul>
          <Button 
            variant="outline"
            className="w-full border border-neutral-300 hover:border-blue-500 hover:text-blue-600 shadow-sm"
            onClick={scrollToWaitlist}
          >
            join waitlist
          </Button>
        </div>

        {/* AI Features Tier */}
        <div className="bg-gradient-to-br from-[#e9f2ff] to-[#dbe8ff] border border-blue-200 rounded-xl p-8 text-center relative shadow-lg">
          <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            popular
          </div>
          
          <h3 className="text-xl font-semibold mb-4 text-blue-900">
            ai features
          </h3>
          <div className="text-3xl font-bold mb-2 text-blue-900">
            $20<span className="text-lg font-normal">/month</span>
          </div>
          <p className="text-blue-700 mb-6">
            everything in free + smart automation
          </p>
          <ul className="text-sm text-blue-700 mb-8 space-y-2 text-left">
            <li>• automated invoice reminders</li>
            <li>• deposit matching &amp; reconciliation</li>
            <li>• tax bucket automation</li>
            <li>• email integration</li>
            <li>• ai-powered insights</li>
          </ul>
          <Button 
            className="w-full bg-[#0064ff] hover:bg-[#0057e9] text-white font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={scrollToWaitlist}
          >
            join waitlist
          </Button>
        </div>
      </div>
    </section>
  );
} 