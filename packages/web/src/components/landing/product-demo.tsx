'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';

export function ProductDemo() {
  return (
    <div className="relative">
      <BrowserWindow url="0.finance/dashboard" title="Zero Finance">
        <div className="flex h-[360px] flex-col justify-between bg-white p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Workspace automation overview</h3>
            <p className="mt-2 text-sm text-slate-600">
              Track balances, pending approvals, and recent activity in a single shared workspace. Zero keeps your team aligned without swimming through an email inbox.
            </p>
          </div>
          <ul className="space-y-3">
            <li className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
              <strong className="block text-slate-900">Upcoming payouts</strong>
              Schedule vendor payouts and document transfers without leaving the dashboard.
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
              <strong className="block text-slate-900">Cash allocation</strong>
              Monitor bank balances and trigger treasury moves with built-in guardrails.
            </li>
            <li className="rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
              <strong className="block text-slate-900">Reporting shortcuts</strong>
              Export reconciled activity or share a live view with your finance partners.
            </li>
          </ul>
        </div>
      </BrowserWindow>
    </div>
  );
}
