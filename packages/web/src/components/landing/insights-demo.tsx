'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export function InsightsDemo() {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 h-[300px] sm:h-[350px] flex flex-col">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Real-Time Insights</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-600">Monthly Revenue</p>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">$12,450</p>
          <p className="text-xs text-green-600">+15% vs last month</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-600">Expenses</p>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">$3,200</p>
          <p className="text-xs text-red-600">+8% vs last month</p>
        </div>
      </div>
      
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <p className="text-sm font-medium text-blue-900">Cash Flow Forecast</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-700">Next 7 days</span>
            <span className="text-sm font-semibold text-green-700">+$5,200</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-700">Next 30 days</span>
            <span className="text-sm font-semibold text-green-700">+$18,900</span>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-800">Tax estimate: $2,890 (Q1)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}