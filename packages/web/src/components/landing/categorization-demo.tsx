'use client';

import React from 'react';
import { Tag, Coffee, Car, Laptop, Home, FileText } from 'lucide-react';

export function CategorizationDemo() {
  const expenses = [
    { icon: Coffee, category: 'Meals & Entertainment', vendor: 'Starbucks', amount: '$12.45', color: 'text-orange-600 bg-orange-50' },
    { icon: Car, category: 'Transportation', vendor: 'Uber', amount: '$34.20', color: 'text-blue-600 bg-blue-50' },
    { icon: Laptop, category: 'Equipment', vendor: 'Apple Store', amount: '$1,299.00', color: 'text-purple-600 bg-purple-50' },
    { icon: Home, category: 'Office', vendor: 'WeWork', amount: '$450.00', color: 'text-green-600 bg-green-50' },
    { icon: FileText, category: 'Software', vendor: 'Adobe', amount: '$54.99', color: 'text-pink-600 bg-pink-50' }
  ];

  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 h-[350px] sm:h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Auto-Categorization</h3>
        <Tag className="w-5 h-5 text-blue-500" />
      </div>
      
      <div className="space-y-2 flex-1 overflow-hidden">
        {expenses.map((expense, index) => {
          const Icon = expense.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${expense.color.split(' ')[1]}`}>
                <Icon className={`w-4 h-4 ${expense.color.split(' ')[0]}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{expense.vendor}</p>
                <p className="text-xs text-gray-500">{expense.category}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{expense.amount}</p>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-center text-gray-600">
          <span className="font-semibold text-blue-600">AI categorized</span> 127 transactions this month
        </p>
      </div>
    </div>
  );
}