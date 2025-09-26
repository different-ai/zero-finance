'use client';

import { useState } from 'react';
import { AnimatedEarningsV2 } from '@/components/animated-earnings-v2';
import type { EarningsEvent } from '@/lib/utils/event-based-earnings';
import {
  calculateTotalEarnings,
  formatEarnings,
} from '@/lib/utils/event-based-earnings';

export default function TestEarningsEventsPage() {
  const [events, setEvents] = useState<EarningsEvent[]>([
    {
      id: 'tx1',
      type: 'deposit',
      timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      amount: 1000000000n, // $1000 in USDC (6 decimals)
      vaultAddress: '0xVault1',
      apy: 8.5,
    },
    {
      id: 'tx2',
      type: 'deposit',
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      amount: 500000000n, // $500 in USDC
      vaultAddress: '0xVault1',
      apy: 8.2,
    },
    {
      id: 'tx3',
      type: 'deposit',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      amount: 2000000000n, // $2000 in USDC
      vaultAddress: '0xVault2',
      apy: 7.8,
    },
  ]);

  const addDeposit = () => {
    const newEvent: EarningsEvent = {
      id: `tx${events.length + 1}`,
      type: 'deposit',
      timestamp: new Date().toISOString(),
      amount: BigInt(Math.floor(Math.random() * 5000 + 500) * 1000000), // Random $500-$5500
      vaultAddress: Math.random() > 0.5 ? '0xVault1' : '0xVault2',
      apy: 7 + Math.random() * 3, // Random 7-10% APY
    };
    setEvents([...events, newEvent]);
  };

  const addWithdrawal = () => {
    const newEvent: EarningsEvent = {
      id: `tx${events.length + 1}`,
      type: 'withdrawal',
      timestamp: new Date().toISOString(),
      amount: 500000000n, // $500 withdrawal
      vaultAddress: '0xVault1',
      apy: 8.0,
    };
    setEvents([...events, newEvent]);
  };

  const resetEvents = () => {
    setEvents([]);
  };

  // Calculate current earnings for display
  const { totalEarnings, byVault, totalPrincipal } =
    calculateTotalEarnings(events);

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Event-Based Earnings Test</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Event Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Event History</h2>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <p className="text-gray-500">
                  No events yet. Add some deposits!
                </p>
              ) : (
                events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded border ${
                      event.type === 'deposit'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">
                          {event.type === 'deposit'
                            ? '💰 Deposit'
                            : '📤 Withdrawal'}
                        </span>
                        <p className="text-sm text-gray-600">
                          ${formatEarnings(event.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          APY: {event.apy}% | Vault: {event.vaultAddress}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        <p>{new Date(event.timestamp).toLocaleDateString()}</p>
                        <p>{new Date(event.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={addDeposit}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Deposit
              </button>
              <button
                onClick={addWithdrawal}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                disabled={
                  events.filter((e) => e.type === 'deposit').length === 0
                }
              >
                Add Withdrawal
              </button>
              <button
                onClick={resetEvents}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold mb-2">How This Works</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>• Each deposit tracks its own timestamp and APY</li>
              <li>• Earnings accumulate from each deposit's date</li>
              <li>• Withdrawals reduce all deposits proportionally</li>
              <li>• Animation starts from accumulated value, never 0</li>
              <li>
                • Uses integer math (bigint) to avoid floating point errors
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Earnings Display */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Live Earnings (Event-Based)
            </h2>

            <div className="text-4xl font-bold text-green-600 mb-4">
              <AnimatedEarningsV2
                events={events}
                fallbackApy={8}
                fallbackBalance={1000}
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Principal:</span>
                <span className="font-medium">
                  ${formatEarnings(totalPrincipal).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Accumulated Earnings:</span>
                <span className="font-medium text-green-600">
                  +${formatEarnings(totalEarnings).toFixed(6)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium">
                  ${formatEarnings(totalPrincipal + totalEarnings).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-3">Earnings by Vault</h3>

            <div className="space-y-2">
              {Array.from(byVault.entries()).map(([vault, earnings]) => (
                <div key={vault} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">{vault}:</span>
                  <span className="text-sm font-medium text-green-600">
                    +${formatEarnings(earnings).toFixed(6)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <h3 className="font-semibold mb-2">Key Improvements</h3>
            <ul className="text-sm space-y-1">
              <li>✅ Starts from accumulated earnings, not 0</li>
              <li>✅ Handles multiple deposits with different dates</li>
              <li>✅ Tracks APY at deposit time</li>
              <li>✅ Supports withdrawals (proportional reduction)</li>
              <li>✅ Multiple vaults with different rates</li>
              <li>✅ Uses BigInt to avoid rounding errors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
