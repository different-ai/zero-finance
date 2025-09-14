'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import { formatUsd } from '@/lib/utils';

export function DemoSavingsWrapper() {
  const [isInitialized, setIsInitialized] = useState(false);

  const handleActivate = () => {
    setIsInitialized(true);
  };

  // Demo data
  const totalSaved = 2500000;
  const totalEarned = 16849;
  const averageApy = 8.0;

  const vaults = [
    {
      id: 'seamless',
      name: 'Seamless USDC',
      curator: 'Seamless Protocol',
      risk: 'Low Risk',
      apy: 8.0,
      balance: isInitialized ? 2500000 : 0,
      earned: isInitialized ? 16849 : 0,
      isAuto: true,
    },
  ];

  return (
    <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
      {/* Not Initialized State */}
      {!isInitialized ? (
        <div className="bg-white border border-[#101010]/10 p-12 text-center">
          <Wallet className="h-12 w-12 text-[#101010]/40 mx-auto mb-6" />
          <h2 className="font-serif text-[36px] leading-[1.1] text-[#101010] mb-3">
            Activate Savings Account
          </h2>
          <p className="text-[16px] text-[#101010]/70 mb-8 max-w-[400px] mx-auto">
            Start earning up to {averageApy.toFixed(1)}% APY on your business
            funds.
          </p>
          <Button
            onClick={handleActivate}
            className="bg-[#1B29FF] hover:bg-[#1B29FF]/90"
          >
            Activate Savings
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Portfolio Overview - Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#101010]/10">
            <div className="bg-white p-6">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Savings Balance
              </p>
              <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#101010]">
                {formatUsd(totalSaved)}
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Earnings (Live)
              </p>
              <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
                +{formatUsd(totalEarned)}
              </p>
            </div>

            <div className="bg-white p-6">
              <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                Average APY
              </p>
              <p className="font-serif text-[28px] sm:text-[32px] leading-[1.1] tabular-nums text-[#1B29FF]">
                {averageApy.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Live Yield Counter - Premium Card */}
          <div className="bg-white border border-[#101010]/10 p-8">
            <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-6">
              Real-Time Yield Accumulation
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-[14px] text-[#101010]/60 mb-1">
                  Daily Yield
                </p>
                <p className="font-serif text-[32px] leading-[1.1] tabular-nums text-[#101010]">
                  ${((totalSaved * 0.08) / 365).toFixed(2)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[12px] text-[#101010]/60">Monthly</p>
                  <p className="text-[18px] tabular-nums text-[#101010]">
                    ${((totalSaved * 0.08) / 12).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[#101010]/60">Yearly</p>
                  <p className="text-[18px] tabular-nums text-[#101010]">
                    ${(totalSaved * 0.08).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vaults Section - Editorial Table Style */}
          <div>
            <div className="mb-8">
              <p className="uppercase tracking-[0.18em] text-[11px] text-[#101010]/60">
                Available Strategies
              </p>
            </div>

            {/* Vault Table - Desktop View */}
            <div className="bg-white border border-[#101010]/10 overflow-x-auto">
              <div className="hidden lg:block min-w-[800px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-3 p-4 border-b border-[#101010]/10 bg-[#F7F7F2]">
                  <div className="col-span-5">
                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Vault Name
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      APY
                    </p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Balance
                    </p>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60">
                      Actions
                    </p>
                  </div>
                </div>

                {/* Vault Rows */}
                {vaults.map((vault, index) => (
                  <div
                    key={vault.id}
                    className={`grid grid-cols-12 gap-3 p-4 items-center transition-colors hover:bg-[#F7F7F2]/50 ${
                      index !== vaults.length - 1
                        ? 'border-b border-[#101010]/5'
                        : ''
                    }`}
                  >
                    <div className="col-span-5">
                      <div className="flex items-start gap-2">
                        {vault.isAuto && (
                          <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider shrink-0">
                            Auto
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium text-[#101010] truncate">
                            {vault.name}
                          </p>
                          <p className="text-[12px] text-[#101010]/60 truncate">
                            {vault.curator} · {vault.risk}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
                        {vault.apy.toFixed(1)}%
                      </p>
                    </div>

                    <div className="col-span-2 text-right">
                      <p className="text-[16px] tabular-nums text-[#101010]">
                        {formatUsd(vault.balance)}
                      </p>
                      {vault.earned > 0 && (
                        <p className="text-[12px] tabular-nums text-[#1B29FF]">
                          +{formatUsd(vault.earned)}
                        </p>
                      )}
                    </div>

                    <div className="col-span-3 flex justify-end gap-1">
                      <button
                        onClick={() => alert('Demo: Deposit functionality')}
                        className="px-2.5 py-1 text-[12px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => alert('Demo: Withdraw functionality')}
                        className="px-2.5 py-1 text-[12px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                {vaults.map((vault, index) => (
                  <div
                    key={vault.id}
                    className={`p-4 space-y-3 ${
                      index !== vaults.length - 1
                        ? 'border-b border-[#101010]/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {vault.isAuto && (
                          <span className="px-1.5 py-0.5 bg-[#1B29FF] text-white text-[9px] uppercase tracking-wider">
                            Auto
                          </span>
                        )}
                        <div>
                          <p className="text-[15px] font-medium text-[#101010]">
                            {vault.name}
                          </p>
                          <p className="text-[12px] text-[#101010]/60">
                            {vault.curator} · {vault.risk}
                          </p>
                        </div>
                      </div>
                      <p className="text-[18px] font-medium tabular-nums text-[#1B29FF]">
                        {vault.apy.toFixed(1)}%
                      </p>
                    </div>

                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#101010]/60">Balance</span>
                      <span className="tabular-nums text-[#101010]">
                        {formatUsd(vault.balance)}
                      </span>
                    </div>
                    {vault.earned > 0 && (
                      <div className="flex justify-between text-[14px]">
                        <span className="text-[#101010]/60">Earned</span>
                        <span className="tabular-nums text-[#1B29FF]">
                          +{formatUsd(vault.earned)}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => alert('Demo: Deposit functionality')}
                        className="flex-1 px-3 py-2 text-[13px] text-white bg-[#1B29FF] hover:bg-[#1420CC] transition-colors"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => alert('Demo: Withdraw functionality')}
                        className="flex-1 px-3 py-2 text-[13px] text-[#101010] border border-[#101010]/10 hover:bg-[#F7F7F2] transition-colors"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-Savings Status - Minimal Card */}
          <div className="bg-[#F6F5EF] border border-[#101010]/10 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="uppercase tracking-[0.14em] text-[11px] text-[#101010]/60 mb-2">
                  Auto-Savings Active
                </p>
                <p className="text-[16px] text-[#101010]">
                  Automatically saving 100% of incoming deposits
                </p>
              </div>
              <button
                onClick={() => alert('Demo: Configure settings')}
                className="text-[14px] text-[#1B29FF] hover:text-[#1420CC] underline decoration-[#1B29FF]/30 underline-offset-[4px] transition-colors"
              >
                Configure →
              </button>
            </div>
          </div>

          {/* Risk Disclosure - Clean Alert */}
          <div className="bg-[#FFF8E6] border border-[#FFA500]/20 p-6">
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-[#FFA500] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-medium text-[#101010] mb-2">
                  Risk Disclosure
                </p>
                <p className="text-[13px] text-[#101010]/70 leading-relaxed">
                  All DeFi protocols carry inherent risks. Vaults are audited
                  and insured where possible, but past performance does not
                  guarantee future returns. APY rates are variable and subject
                  to market conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
