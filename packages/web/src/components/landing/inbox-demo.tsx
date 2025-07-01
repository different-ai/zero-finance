'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { Inbox, CheckCircle2, Circle, FileText, AlertCircle } from 'lucide-react';

const mockInboxItems = [
  {
    id: 1,
    from: 'Stripe',
    subject: 'Payment received - $2,450.00',
    preview: 'You have received a payment of $2,450.00 from Client Corp...',
    time: '2 hours ago',
    read: false,
    type: 'payment'
  },
  {
    id: 2,
    from: 'Zero Finance',
    subject: 'Monthly statement ready',
    preview: 'Your monthly statement for December 2023 is now available...',
    time: '1 day ago',
    read: true,
    type: 'statement'
  },
  {
    id: 3,
    from: 'Tax Assistant',
    subject: 'Q4 estimated tax payment due',
    preview: 'Your Q4 estimated tax payment of $3,200 is due on January 15...',
    time: '3 days ago',
    read: true,
    type: 'tax'
  },
  {
    id: 4,
    from: 'Client ABC',
    subject: 'Invoice INV-2024-001 approved',
    preview: 'Your invoice has been approved and payment will be processed...',
    time: '5 days ago',
    read: true,
    type: 'invoice'
  }
];

export function InboxDemo() {
  return (
    <div className="relative pointer-events-none">
      <BrowserWindow
        url="0.finance/dashboard/inbox"
        title="Zero Finance - AI Inbox"
      >
        <div className="bg-gray-50 h-[400px] overflow-hidden">
          {/* Inbox Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Inbox className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">AI Inbox</h2>
                <span className="text-sm text-gray-500">(4 unread)</span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Mark all as read
              </button>
            </div>
          </div>

          {/* Inbox Items */}
          <div className="divide-y divide-gray-200">
            {mockInboxItems.map((item) => (
              <div
                key={item.id}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
                  !item.read ? 'bg-blue-50/50' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div className="mt-1">
                    {!item.read ? (
                      <Circle className="w-2 h-2 fill-blue-600 text-blue-600" />
                    ) : (
                      <div className="w-2 h-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm ${!item.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                        {item.from}
                      </h3>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <p className={`text-sm ${!item.read ? 'font-medium' : ''} text-gray-900 mb-1`}>
                      {item.subject}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{item.preview}</p>
                  </div>

                  {/* Type Icon */}
                  <div className="flex-shrink-0">
                    {item.type === 'payment' && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                    {item.type === 'statement' && (
                      <FileText className="w-5 h-5 text-gray-400" />
                    )}
                    {item.type === 'tax' && (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                    {item.type === 'invoice' && (
                      <FileText className="w-5 h-5 text-blue-500" />
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