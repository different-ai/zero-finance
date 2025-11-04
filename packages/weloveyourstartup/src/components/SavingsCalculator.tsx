'use client';

import { useState, useEffect, useRef } from 'react';
import { data } from '@/lib/data';

interface CalculatorProps {
  defaultAmount?: number;
  className?: string;
}

export function SavingsCalculator({
  defaultAmount = data.calculatorConfig.defaultAmount,
  className = '',
}: CalculatorProps) {
  const { calculatorConfig } = data;
  const [amount, setAmount] = useState(defaultAmount);
  const [inputValue, setInputValue] = useState(defaultAmount.toLocaleString());
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bankRate = calculatorConfig.bankRate;
  const zeroRate = calculatorConfig.zeroRate;

  const yearlyBankReturn = (amount * bankRate) / 100;
  const yearlyZeroReturn = (amount * zeroRate) / 100;
  const yearlyDifference = yearlyZeroReturn - yearlyBankReturn;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value ? parseInt(value).toLocaleString() : '');
    if (value) {
      setAmount(parseInt(value));
    }
  };

  useEffect(() => {
    setAmount(defaultAmount);
    setInputValue(defaultAmount.toLocaleString());
  }, [defaultAmount]);

  // Auto-focus input when calculator comes into view
  useEffect(() => {
    if (!containerRef.current || !inputRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && inputRef.current) {
            // Small delay to ensure smooth scroll
            setTimeout(() => {
              inputRef.current?.focus();
              // Select all text for easy editing
              inputRef.current?.select();
            }, 300);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of calculator is visible
        rootMargin: '-100px', // Offset to trigger slightly before fully visible
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <div className="space-y-8">
        {/* Large CAD-style Input */}
        <div className="space-y-4">
          <label className="block text-sm uppercase tracking-widest text-[#00FF00]/70 font-mono font-bold">
            [ INPUT: IDLE_CASH_AMOUNT ]
          </label>
          <div className="relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-6xl lg:text-8xl font-black text-[#00FF00]/20 font-mono pointer-events-none">
              $
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full bg-black border-4 border-[#00FF00] px-24 py-8 text-6xl lg:text-8xl font-black text-[#00FF00] font-mono tracking-tight focus:outline-none focus:border-white transition-colors placeholder:text-[#00FF00]/20"
              placeholder="0"
            />
          </div>
          <div className="text-sm text-white/50 font-mono uppercase tracking-wide">
            {'>> ENTER_AMOUNT_IN_USD'}
          </div>
        </div>

        {/* Primary Output - Raw Amount Earned */}
        <div className="bg-black border-4 border-white p-10">
          <div className="text-xs uppercase tracking-widest text-white/50 font-mono font-bold mb-3">
            [ OUTPUT: ANNUAL_YIELD_DELTA ]
          </div>
          <div className="text-7xl lg:text-9xl font-black text-white font-mono tracking-tighter">
            {formatCurrency(yearlyDifference)}
          </div>
          <div className="mt-4 text-lg text-white/50 font-mono uppercase tracking-wide">
            {'>> ADDITIONAL_EARNINGS_PER_YEAR'}
          </div>
        </div>

        {/* CRT-Style Table */}
        <div className="bg-black border-2 border-[#00FF00] p-1">
          <div
            className="relative overflow-hidden"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
            }}
          >
            {/* Scanline effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 0, 0.1) 1px, rgba(0, 255, 0, 0.1) 2px)',
              }}
            />

            {/* Table Header */}
            <div className="grid grid-cols-4 border-b-2 border-[#00FF00] bg-[#00FF00]/10">
              <div className="p-4 border-r border-[#00FF00]/30 text-xs uppercase tracking-widest text-[#00FF00] font-mono font-bold">
                PROVIDER
              </div>
              <div className="p-4 border-r border-[#00FF00]/30 text-xs uppercase tracking-widest text-[#00FF00] font-mono font-bold text-right">
                APY
              </div>
              <div className="p-4 border-r border-[#00FF00]/30 text-xs uppercase tracking-widest text-[#00FF00] font-mono font-bold text-right">
                ANNUAL_YIELD
              </div>
              <div className="p-4 text-xs uppercase tracking-widest text-[#00FF00] font-mono font-bold text-right">
                MONTHLY
              </div>
            </div>

            {/* Bank Row */}
            <div className="grid grid-cols-4 border-b border-[#00FF00]/20 hover:bg-white/5 transition-colors">
              <div className="p-4 border-r border-[#00FF00]/30 text-base text-white/70 font-mono font-bold uppercase">
                BANK_AVG
              </div>
              <div className="p-4 border-r border-[#00FF00]/30 text-xl text-white/70 font-mono text-right tabular-nums">
                {bankRate}%
              </div>
              <div className="p-4 border-r border-[#00FF00]/30 text-xl text-white/70 font-mono text-right tabular-nums">
                {formatCurrency(yearlyBankReturn)}
              </div>
              <div className="p-4 text-base text-white/50 font-mono text-right tabular-nums">
                {formatCurrency(yearlyBankReturn / 12)}
              </div>
            </div>

            {/* Zero Row */}
            <div className="grid grid-cols-4 border-b border-[#00FF00]/20 hover:bg-[#00FF00]/5 transition-colors">
              <div className="p-4 border-r border-[#00FF00]/30 text-base text-[#00FF00] font-mono font-bold uppercase">
                ZERO_FINANCE
              </div>
              <div className="p-4 border-r border-[#00FF00]/30 text-xl text-[#00FF00] font-mono text-right tabular-nums">
                {zeroRate}%
              </div>
              <div className="p-4 border-r border-[#00FF00]/30 text-xl text-[#00FF00] font-mono text-right tabular-nums">
                {formatCurrency(yearlyZeroReturn)}
              </div>
              <div className="p-4 text-base text-[#00FF00]/70 font-mono text-right tabular-nums">
                {formatCurrency(yearlyZeroReturn / 12)}
              </div>
            </div>

            {/* Delta Row (highlighted) */}
            <div className="grid grid-cols-4 bg-white/10 border-2 border-white">
              <div className="p-4 border-r border-white/50 text-base text-white font-mono font-bold uppercase">
                {'>> DELTA'}
              </div>
              <div className="p-4 border-r border-white/50 text-xl text-white font-mono text-right tabular-nums font-bold">
                +{zeroRate - bankRate}%
              </div>
              <div className="p-4 border-r border-white/50 text-xl text-white font-mono text-right tabular-nums font-bold">
                +{formatCurrency(yearlyDifference)}
              </div>
              <div className="p-4 text-base text-white font-mono text-right tabular-nums font-bold">
                +{formatCurrency(yearlyDifference / 12)}
              </div>
            </div>
          </div>

          {/* Table Footer Info */}
          <div className="p-3 bg-black border-t-2 border-[#00FF00] text-xs text-[#00FF00]/60 font-mono uppercase tracking-wide">
            {'>> CALCULATED_ON: '}{inputValue ? `$${inputValue}` : '$0'} IDLE_CASH
          </div>
        </div>
      </div>
    </div>
  );
}
