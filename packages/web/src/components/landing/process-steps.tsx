'use client';

import React from 'react';

const steps = [
  {
    num: '1',
    title: 'EMAIL INTEGRATION',
    description:
      'we connect to your email & politely nudge clients when invoices are due',
  },
  {
    num: '2',
    title: 'SMART MATCHING',
    description:
      'we verify deposits match your invoices and update your books automatically',
  },
];

export function ProcessSteps() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
      {steps.map((s) => (
        <div
          key={s.num}
          className="bg-neutral-50 border border-neutral-200 p-8 rounded-xl shadow-sm flex items-start space-x-4"
        >
          <div className="w-14 h-14 flex items-center justify-center bg-[#0064ff] text-white font-bold text-xl rounded-full">
            {s.num}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-neutral-900 mb-2 text-lg uppercase tracking-tight">
              {s.title}
            </h3>
            <p className="text-neutral-600 font-medium">
              {s.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 