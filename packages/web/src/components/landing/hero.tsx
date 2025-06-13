'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export function Hero() {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();

  return (
    <section className="py-24 text-center max-w-4xl mx-auto px-6 relative">
      {/* Brutalist background blocks */}
      <div className="absolute inset-0 -z-10 bg-white border-4 border-black"></div>
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500 transform rotate-12 opacity-80"></div>
      <div className="absolute bottom-12 right-12 w-32 h-32 bg-red-500 transform -rotate-12 opacity-70"></div>
      <div className="absolute top-1/2 left-8 w-16 h-16 bg-yellow-400 transform rotate-45"></div>
      
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-tight border-4 border-black bg-white p-6 transform -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        a bank account that works <span className="text-blue-600">for you</span>
      </h1>

      <p className="text-lg md:text-xl text-black mb-10 max-w-2xl mx-auto leading-tight font-bold bg-yellow-300 p-4 border-2 border-black transform rotate-1">
        we help you get paid faster, earn more on idle cash, and make sure you have enough money to pay your taxes.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {ready ? (
          authenticated ? (
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="bg-black text-white font-black px-8 py-3 rounded-none border-4 border-black hover:bg-white hover:text-black transition-colors transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              go to dashboard
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/demo')}
              size="lg"
              className="bg-black text-white font-black px-8 py-3 rounded-none border-4 border-black hover:bg-white hover:text-black transition-colors transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              watch 90-sec demo
            </Button>
          )
        ) : (
          <Button
            disabled
            size="lg"
            className="bg-neutral-400 text-neutral-600 px-8 py-3 rounded-none border-4 border-neutral-400 cursor-not-allowed"
          >
            loading...
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => {
            const waitlistSection = document.getElementById('waitlist-section');
            if (waitlistSection) {
              waitlistSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="border-4 border-black text-black hover:bg-black hover:text-white font-black px-8 py-3 rounded-none transition-colors transform hover:-translate-y-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          join waitlist
        </Button>
      </div>
    </section>
  );
} 