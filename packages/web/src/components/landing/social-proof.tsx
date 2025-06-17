'use client';

import React from 'react';

export function SocialProof() {
  return (
    <section className="py-12 bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-neutral-600 mb-6 font-medium">
          trusted by early adopters
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-900 mb-1">27 → 9</div>
            <div className="text-sm text-neutral-600">days to payment</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-900 mb-1">67%</div>
            <div className="text-sm text-neutral-600">fewer late payments</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-neutral-900 mb-1">11</div>
            <div className="text-sm text-neutral-600">beta testers</div>
          </div>
        </div>
      </div>
    </section>
  );
} 