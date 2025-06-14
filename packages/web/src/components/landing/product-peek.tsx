'use client';

import React from 'react';
import { SeeHowItWorks } from './see-how-it-works';
import { FeatureCards } from './feature-cards';
import { ProductDemo } from './product-demo';
import { ProcessSteps } from './process-steps';

export function ProductPeek() {
  return (
    <section className="py-16 bg-white rounded-2xl shadow-xl border border-neutral-200 mx-6 max-w-7xl lg:mx-auto" id="demo">
      <div className="px-6">
        {/* See how it works section */}
        <div className="w-full max-w-5xl mx-auto mb-16">
          <SeeHowItWorks />
          <FeatureCards />
        </div>

        <ProductDemo />
        <ProcessSteps />
      </div>
    </section>
  );
}
