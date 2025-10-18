'use client';

import React from 'react';
import { CheckCircle, Clock, Send } from 'lucide-react';

export function FollowUpsDemo() {
  return (
    <div className="bg-white rounded-xl p-6 sm:p-8 h-[300px] sm:h-[350px] flex flex-col">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Automated Follow-Ups</h3>
      
      <div className="space-y-4 flex-1">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Send className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Invoice #2024-001</p>
              <p className="text-xs text-gray-600 mt-1">Reminder sent to client@company.com</p>
              <p className="text-xs text-gray-500 mt-1">2 days overdue</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Invoice #2024-002</p>
              <p className="text-xs text-gray-600 mt-1">Next reminder: Tomorrow at 9:00 AM</p>
              <p className="text-xs text-gray-500 mt-1">Due in 3 days</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-800 text-center">
            <span className="font-semibold">5 payment reminders</span> sent next week
          </p>
        </div>
      </div>
    </div>
  );
}