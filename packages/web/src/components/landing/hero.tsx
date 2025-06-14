'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

function StatCard({
  label,
  value,
  change,
  dark = false,
}: {
  label: string;
  value: string;
  change?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`${
        dark ? 'bg-[#232830] text-white' : 'bg-white text-black'
      } rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-6 py-4 w-[220px]`}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        {change && (
          <span className="text-xs font-medium text-[#0064ff]">{change}</span>
        )}
      </div>
      <span className="uppercase text-xs tracking-wider text-[#888888]">
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const { authenticated, ready } = usePrivy();

  return (
    <section className="relative flex flex-col items-center text-center px-6 md:px-10 py-32">
      {/* Rotating Globe */}
      <div className="pointer-events-none absolute left-1/2 top-0 translate-x-[-50%] -translate-y-20 z-[-1]">
      
        <div
          className="w-[420px] h-[420px] rounded-full shadow-xl"
          style={{
            background:
              'radial-gradient(circle at 35% 35%, #fafafa 0%, #eaeaea 40%, #dcdcdc 100%)',
            animation: 'spin 80s linear infinite',
          }}
        />
        {/* Stat Cards */}
        <div className="absolute -top-6 -left-14">
          <StatCard label="invoices paid" value="92%" change="+14%" />
        </div>
        <div className="absolute top-14 right-0">
          <StatCard label="avg days to pay" value="9" change="-18" dark />
        </div>
        <div className="absolute bottom-8 -right-20">
          <StatCard label="late payments" value="-67%" />
        </div>
      </div>

      {/* Headline (original copy) */}
      <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight tracking-[-0.02em] text-black mb-6">
        a bank account that works <span className="text-[#0064ff]">for you</span>
      </h1>
      {/* Sub-headline */}
      <p className="text-lg md:text-xl max-w-[620px] text-[#666666] mb-10">
        Get paid faster, earn on idle cash and always stay on top of your taxes — all with one intelligent account.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {ready ? (
          authenticated ? (
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-[#0064ff] hover:bg-[#0057e9] text-white font-bold py-3 px-8 rounded-[28px] transition"
            >
              go to dashboard
            </button>
          ) : (
            <button
              onClick={() => router.push('/demo')}
              className="bg-[#0064ff] hover:bg-[#0057e9] text-white font-bold py-3 px-8 rounded-[28px] transition"
            >
              watch 90-sec demo
            </button>
          )
        ) : (
          <button
            disabled
            className="bg-neutral-400 text-neutral-600 font-bold py-3 px-8 rounded-[28px]"
          >
            loading...
          </button>
        )}
        <button
          onClick={() => {
            const section = document.getElementById('waitlist-section');
            section?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white border border-[#e5e5e5] text-[#222222] font-bold py-3 px-8 rounded-[28px] hover:shadow-md transition"
        >
          join waitlist
        </button>
      </div>
    </section>
  );
} 