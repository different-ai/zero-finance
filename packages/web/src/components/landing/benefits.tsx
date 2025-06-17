'use client';

import React from 'react';

const benefits = [
  {
    icon: '⚡',
    title: 'Get paid 3× faster',
    description: 'Automated follow-ups and deposit matching cut payment time from 27 to 9 days.'
  },
  {
    icon: '🏛️',
    title: 'Never miss tax payments',
    description: 'Exact tax vault funded the moment cash lands. No more thumb-rule guessing.'
  },
  {
    icon: '📊',
    title: 'Zero reconciliation work',
    description: 'Obligation-linked ledger tracks everything live. No weekly spreadsheet cleanup.'
  }
];

export function Benefits() {
  return (
    <section className="py-16 max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900">
          stop chasing. start earning.
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          three core problems solved with one obligation-linked ledger
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="text-center p-6 rounded-xl bg-white border border-neutral-200 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="text-4xl mb-4">{benefit.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-neutral-900">
              {benefit.title}
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 