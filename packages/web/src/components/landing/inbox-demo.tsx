'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { Inbox, CheckCircle2, Circle, FileText, AlertCircle } from 'lucide-react';

const mockInboxItems = [
  {
    id: 1,
    from: 'Stripe',
    subject: 'Payment received - $2,450.00',
    preview: 'You have received a payment from Client Corp',
    time: '2h ago',
    read: false,
    type: 'payment'
  },
  {
    id: 2,
    from: 'Zero Finance',
    subject: 'Monthly statement ready',
    preview: 'Your December 2023 statement is available',
    time: '1d ago',
    read: true,
    type: 'statement'
  },
  {
    id: 3,
    from: 'Tax Assistant',
    subject: 'Q4 estimated tax due',
    preview: 'Payment of $3,200 due on January 15',
    time: '3d ago',
    read: true,
    type: 'tax'
  }
];

export function InboxDemo() {
  return (
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard"
        title="Zero Finance"
      >
        <div className="bg-gray-50 h-[350px] overflow-hidden">
          {/* Inbox Header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-gray-700" />
                <h2 className="text-sm font-semibold text-gray-900">AI Inbox</h2>
                <span className="text-xs text-gray-500">(1 unread)</span>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Mark all read
              </button>
            </div>
          </div>

          {/* Inbox Items */}
          <div className="divide-y divide-gray-200">
            {mockInboxItems.map((item) => (
              <div
                key={item.id}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                  !item.read ? 'bg-blue-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="mt-1">
                    {!item.read ? (
                      <Circle className="w-1.5 h-1.5 fill-blue-600 text-blue-600" />
                    ) : (
                      <div className="w-1.5 h-1.5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className={`text-xs ${!item.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                        {item.from}
                      </h3>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <p className={`text-xs ${!item.read ? 'font-medium' : ''} text-gray-900 mb-0.5`}>
                      {item.subject}
                    </p>
                    <p className="text-xs text-gray-600 truncate">{item.preview}</p>
                  </div>

                  {/* Type Icon */}
                  <div className="flex-shrink-0">
                    {item.type === 'payment' && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                    {item.type === 'statement' && (
                      <FileText className="w-4 h-4 text-gray-400" />
                    )}
                    {item.type === 'tax' && (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </BrowserWindow>
    </div>
  );
} 
