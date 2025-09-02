'use client';

import React from 'react';

export function TestimonialSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-[#0f1e46] italic mb-6 leading-tight">
          &ldquo;Earning{' '}
          <span className="text-orange-600 font-bold not-italic">
            10% on our idle funds
          </span>{' '}
          has helped us almost pay for another employee a year.&rdquo;
        </blockquote>
        <p className="text-lg text-[#5a6b91]">— Sarah Chen, Tech Startup CFO</p>
      </div>
    </section>
  );
}
