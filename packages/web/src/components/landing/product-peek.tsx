'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { InboxContent } from '@/components/inbox-content';

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
        
        {/* Feature highlights - Brutalist style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-purple-400 border-4 border-black p-6 transform -rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-black border-4 border-white flex items-center justify-center mx-auto mb-4 transform rotate-45">
              <span className="text-white text-2xl font-black transform -rotate-45">💰</span>
            </div>
            <h3 className="font-black text-black mb-2 text-lg">MAXIMIZE IDLE CASH</h3>
            <p className="text-black font-bold">surface opportunities to earn more on money sitting in your account</p>
          </div>
          
          <div className="bg-blue-400 border-4 border-black p-6 transform rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-black border-4 border-white flex items-center justify-center mx-auto mb-4 transform -rotate-12">
              <span className="text-white text-2xl font-black transform rotate-12">📧</span>
            </div>
            <h3 className="font-black text-black mb-2 text-lg">CHASE INVOICES</h3>
            <p className="text-black font-bold">automatically remind clients to pay their outstanding invoices</p>
          </div>
          
          <div className="bg-green-400 border-4 border-black p-6 transform rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-black border-4 border-white flex items-center justify-center mx-auto mb-4 transform rotate-45">
              <span className="text-white text-2xl font-black transform -rotate-45">📊</span>
            </div>
            <h3 className="font-black text-black mb-2 text-lg">TRACK EXPENSES</h3>
            <p className="text-black font-bold">easily see and pay vendors and people you owe money to</p>
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
        
        {/* Step captions below - Brutalist style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="relative group">
            <div className="bg-cyan-300 border-4 border-black p-8 transform -rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:transform hover:rotate-0 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-black text-white border-2 border-white flex items-center justify-center font-black text-2xl">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-black mb-2 text-lg">EMAIL INTEGRATION</h3>
                  <p className="text-black font-bold">we connect to your email &amp; politely nudge clients when invoices are due</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="bg-orange-300 border-4 border-black p-8 transform rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:transform hover:rotate-0 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-black text-white border-2 border-white flex items-center justify-center font-black text-2xl">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-black mb-2 text-lg">SMART MATCHING</h3>
                  <p className="text-black font-bold">we verify deposits match your invoices and update your books automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 