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
    description:
      'easily see and pay vendors and people you owe money to',
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
    <section className="py-16 max-w-6xl mx-auto px-6" id="demo">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4 text-neutral-900">
          see how it works
        </h2>
        <p className="text-lg text-neutral-600 mb-12 max-w-2xl mx-auto">
          automate your financial workflow with intelligent banking
        </p>
        
        {/* Feature highlights - clean card style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featureHighlights.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-neutral-200 rounded-xl p-6 shadow-md flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#f0f4ff] mb-4 text-2xl">
                {f.emoji}
              </div>
              <h3 className="font-bold text-neutral-900 mb-2 text-lg uppercase tracking-tight">
                {f.title}
              </h3>
              <p className="text-neutral-600 font-medium">
                {f.description}
              </p>
            </div>
          ))}
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