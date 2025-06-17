'use client';

import React from 'react';
import { CheckCircle, Zap, Clock } from 'lucide-react';

const features = [
  {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    title: 'Global Bank Accounts',
    description: 'Get paid globally with ACH and IBAN payment details.',
    status: 'Live',
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    title: 'Maximize Idle Cash',
    description: 'Earn more on your balance with automated high-yield strategies.',
    status: 'Alpha',
    statusColor: 'bg-yellow-100 text-yellow-800',
  },
  {
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    title: 'Auto-Fill Invoices',
    description: 'Create and send invoices in seconds with AI-powered data entry.',
    status: 'Coming Soon',
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    title: 'Automated Invoice Chasing',
    description: 'Let personalized LLM messages follow up on unpaid invoices for you.',
    status: 'Coming Soon',
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    title: 'Automated Tax Set-Aside',
    description: 'Automatically reserve a percentage of your income for taxes.',
    status: 'Coming Soon',
    statusColor: 'bg-blue-100 text-blue-800',
  },
];

export function FeatureList() {
  return (
    <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800">Everything your business needs</h2>
            <p className="text-neutral-600 mt-2 max-w-2xl mx-auto">
                From global payments to automated accounting, we have you covered.
            </p>
        </div>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 mr-4">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">{feature.title}</h3>
                <p className="text-sm text-neutral-600">{feature.description}</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${feature.statusColor}`}
            >
              {feature.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 