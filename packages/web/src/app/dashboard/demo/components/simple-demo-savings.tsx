'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, CheckCircle } from 'lucide-react';

export function SimpleDemoSavings() {
  const [isActivated, setIsActivated] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleActivate = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setIsActivated(true);
      setShowAnimation(false);
    }, 1500);
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-4">
        <h2 className="font-serif text-[24px] sm:text-[28px] leading-[1.1] tracking-[-0.01em] text-[#101010]">
          Savings
        </h2>
        <p className="mt-1 text-[14px] text-[#101010]/60">
          Earn 8% APY on your idle cash reserves
        </p>
      </div>

      {/* Savings Content */}
      <div className="bg-white border border-[#101010]/10 rounded-[12px] shadow-[0_2px_8px_rgba(16,16,16,0.04)]">
        {!isActivated && !showAnimation ? (
          // Show activation prompt
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#101010] mb-2">
                  Activate High-Yield Savings
                </h3>
                <p className="text-[#101010]/70">
                  Start earning 8% APY on your treasury. Your funds remain
                  liquid and withdrawable at any time.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#101010]/60">Available Balance</span>
                  <span className="font-semibold">$2,500,000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#101010]/60">Current APY</span>
                  <span className="font-semibold text-purple-600">8.0%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#101010]/60">
                    Projected Monthly Earnings
                  </span>
                  <span className="font-semibold text-green-600">+$16,666</span>
                </div>
              </div>

              <Button
                onClick={handleActivate}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Activate Savings
              </Button>

              <p className="text-xs text-[#101010]/50">
                Demo mode - Click to simulate savings activation
              </p>
            </div>
          </div>
        ) : showAnimation ? (
          // Show activation animation
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full animate-pulse">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-[#101010]">
                Activating Savings...
              </h3>
              <p className="text-[#101010]/70">
                Setting up your high-yield savings account
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-1500 ease-out"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>
        ) : (
          // Show active savings stats
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-[#101010]/60 mb-1">
                  Savings Balance
                </p>
                <p className="text-2xl font-bold text-[#101010]">$2,500,000</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-[#101010]/60 mb-1">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">+$16,849</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-[#101010]/60 mb-1">Current APY</p>
                <p className="text-2xl font-bold text-purple-600">8.0%</p>
              </div>
            </div>

            <div className="border-t border-[#101010]/10 pt-4">
              <h4 className="font-medium text-[#101010] mb-3">Active Vaults</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#101010]">Seamless USDC</p>
                    <p className="text-sm text-[#101010]/60">
                      Low Risk · 8.0% APY
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#101010]">$2,500,000</p>
                    <p className="text-sm text-green-600">+$16,849 earned</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Demo Tip:</strong> In production, your savings
                automatically compound and you can withdraw anytime without
                penalties.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
