'use client';

import { PiggyBank, ArrowDown, ArrowRight } from 'lucide-react';

export function AllocationSummaryCard() {
  // Mock allocation data
  const allocations = {
    tax: 20,
    liquidity: 35,
    yield: 45
  };

  return (
    <div className="bg-white border border-primary/20 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-medium mb-4">Allocation Summary</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border rounded-md p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <PiggyBank className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="text-lg font-medium">{allocations.tax}%</div>
          <div className="text-sm text-gray-500">Tax</div>
        </div>

        <div className="border rounded-md p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 p-2 rounded-full">
              <ArrowDown className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="text-lg font-medium">{allocations.liquidity}%</div>
          <div className="text-sm text-gray-500">Liquidity</div>
        </div>

        <div className="border rounded-md p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-purple-100 p-2 rounded-full">
              <ArrowRight className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="text-lg font-medium">{allocations.yield}%</div>
          <div className="text-sm text-gray-500">Yield</div>
        </div>
      </div>

      <div className="border rounded-md p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600">Allocation Strategy:</span> 
            <span className="ml-2 font-medium">Default Strategy</span>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Change
          </button>
        </div>
      </div>
    </div>
  );
} 