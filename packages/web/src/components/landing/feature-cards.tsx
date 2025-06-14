'use client';

import React from 'react';

const featureHighlights = [
  {
    emoji: '💰',
    title: 'MAXIMIZE IDLE CASH',
    description:
      'surface opportunities to earn more on money sitting in your account',
  },
  {
    emoji: '📧',
    title: 'CHASE INVOICES',
    description:
      'automatically remind clients to pay their outstanding invoices',
  },
  {
    emoji: '📊',
    title: 'TRACK EXPENSES',
    description: 'easily see and pay vendors and people you owe money to',
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {/* Feature Card 1 */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">$</span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-3 text-center">
          MAXIMIZE IDLE CASH
        </h3>
        <p className="text-neutral-600 text-center text-sm leading-relaxed">
          surface opportunities to earn more on 
          money sitting in your account
        </p>
      </div>
      
      {/* Feature Card 2 */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
          <div className="w-6 h-6 bg-blue-400 rounded grid grid-cols-2 gap-0.5 p-1">
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
            <div className="bg-white rounded-sm"></div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-3 text-center">
          CHASE INVOICES
        </h3>
        <p className="text-neutral-600 text-center text-sm leading-relaxed">
          automatically remind clients to pay 
          their outstanding invoices
        </p>
      </div>
      
      {/* Feature Card 3 */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-sm">
        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
          <div className="w-6 h-6 bg-purple-400 rounded flex items-center justify-center">
            <div className="flex space-x-0.5">
              <div className="w-0.5 h-3 bg-white rounded"></div>
              <div className="w-0.5 h-4 bg-white rounded"></div>
              <div className="w-0.5 h-2 bg-white rounded"></div>
            </div>
          </div>
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-3 text-center">
          TRACK EXPENSES
        </h3>
        <p className="text-neutral-600 text-center text-sm leading-relaxed">
          easily see and pay vendors and people 
          you owe money to
        </p>
      </div>
    </div>
  );
} 