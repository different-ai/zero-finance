'use client';

import React from 'react';

export function TestimonialSection() {
  return (
    <section className="border-t border-[#101010]/10 bg-white py-16">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="max-w-[800px] mx-auto">
          <div className="border-l-2 border-[#1B29FF] pl-8">
            <blockquote className="font-serif text-[32px] leading-[1.2] text-[#101010]">
              &ldquo;Earning{' '}
              <span className="text-[#1B29FF]">10% on our idle funds</span> has
              helped us almost pay for another employee a year.&rdquo;
            </blockquote>
            <cite className="mt-4 block text-[14px] text-[#101010]/60 not-italic">
              <span className="font-medium text-[#101010]">Sarah Chen</span>
              <span className="mx-2">•</span>
              Tech Startup CFO
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
}
