'use client';

import { useState, useEffect } from 'react';

export default function TestEarningsPage() {
  const [percentage, setPercentage] = useState(8);
  const [amount, setAmount] = useState(1000); // Start with $1,000
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const yearlyEarnings = (amount * percentage) / 100;
  const dailyEarnings = yearlyEarnings / 365;
  const earningsPerSecond = dailyEarnings / 86400;

  useEffect(() => {
    if (!isAnimating) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const earned = elapsed * earningsPerSecond;
      setCurrentEarnings(earned);
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating, earningsPerSecond]);

  const handleStartAnimation = () => {
    setCurrentEarnings(0);
    setIsAnimating(true);
  };

  const handleStopAnimation = () => {
    setIsAnimating(false);
  };

  const handleReset = () => {
    setCurrentEarnings(0);
    setIsAnimating(false);
  };

  const formatAmount = (val: number) => {
    if (val >= 1000000) {
      return `$${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `$${(val / 1000).toFixed(1)}K`;
    }
    return `$${val}`;
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Earnings Animation Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                APY Percentage: {percentage}%
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Principal Amount: {formatAmount(amount)}
              </label>
              <input
                type="range"
                min="100"
                max="10000000"
                step="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100</span>
                <span>$500</span>
                <span>$1K</span>
                <span>$10K</span>
                <span>$100K</span>
                <span>$1M</span>
                <span>$10M</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setAmount(500)}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  $500
                </button>
                <button
                  onClick={() => setAmount(1000)}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  $1K
                </button>
                <button
                  onClick={() => setAmount(10000)}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  $10K
                </button>
                <button
                  onClick={() => setAmount(100000)}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  $100K
                </button>
                <button
                  onClick={() => setAmount(1000000)}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  $1M
                </button>
                <button
                  onClick={() => setAmount(2000000)}
                  className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
                >
                  $2M
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Earnings Display</h2>
          
          <div className="text-4xl font-bold text-green-600 mb-4">
            ${currentEarnings.toFixed(8)}
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>Yearly Earnings: ${yearlyEarnings.toFixed(2)}</p>
            <p>Daily Earnings: ${dailyEarnings.toFixed(4)}</p>
            <p>Per Second: ${earningsPerSecond.toFixed(10)}</p>
            <p>Per Hour: ${(earningsPerSecond * 3600).toFixed(6)}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleStartAnimation}
            disabled={isAnimating}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Start Animation
          </button>
          <button
            onClick={handleStopAnimation}
            disabled={!isAnimating}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            Stop Animation
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset
          </button>
        </div>

        <div className="bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <pre className="text-xs">
{JSON.stringify({
  isAnimating,
  currentEarnings,
  percentage,
  amount,
  yearlyEarnings,
  dailyEarnings,
  earningsPerSecond,
  earningsPerHour: earningsPerSecond * 3600,
  timestamp: new Date().toISOString()
}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
