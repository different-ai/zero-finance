'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { InboxContent } from '@/components/inbox-content';

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

const steps = [
  {
    num: '1',
    title: 'EMAIL INTEGRATION',
    description:
      'we connect to your email & politely nudge clients when invoices are due',
  },
  {
    num: '2',
    title: 'SMART MATCHING',
    description:
      'we verify deposits match your invoices and update your books automatically',
  },
];

export function ProductPeek() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-6" id="demo">
      {/* See how it works section */}
      <div className="w-full max-w-5xl mx-auto mb-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            see how it works
          </h2>
          <p className="text-lg text-white">
            automate your financial workflow with intelligent banking
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Feature Card 1 */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-md">
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
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-md">
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
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-md">
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
      </div>

      <div className="relative">
        <BrowserWindow
          url="0.finance/dashboard"
          title="Zero Finance - Smart Inbox Demo"
        >
          <InboxContent />
        </BrowserWindow>
        
        {/* Step captions below - clean card style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white border border-neutral-200 p-8 rounded-xl shadow-md flex items-start space-x-4"
            >
              <div className="w-14 h-14 flex items-center justify-center bg-[#0064ff] text-white font-bold text-xl rounded-full">
                {s.num}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-900 mb-2 text-lg uppercase tracking-tight">
                  {s.title}
                </h3>
                <p className="text-neutral-600 font-medium">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
