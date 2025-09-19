'use client';

import { BrowserWindow } from '@/components/ui/browser-window';
import { cn } from '@/lib/utils';

interface ConfigurableDemoProps {
  className?: string;
  backgroundColor?: string;
  headline?: string;
  description?: string;
}

/**
 * Minimal placeholder component that keeps the marketing pages compatible
 * after removing the legacy inbox demo implementation.
 */
export function ConfigurableDemo({
  className,
  backgroundColor = 'bg-slate-100',
  headline = 'Workspace automations',
  description = 'See how Zero orchestrates treasury moves, vendor payments, and reporting in one shared workspace.',
}: ConfigurableDemoProps) {
  return (
    <div className={cn('flex w-full justify-center px-4 py-12', backgroundColor, className)}>
      <BrowserWindow url="0.finance/dashboard" title="Zero Finance">
        <div className="flex h-[420px] flex-col items-start justify-between bg-white p-6 text-left">
          <div>
            <p className="text-xs font-medium text-slate-500">Automations Overview</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{headline}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
          <div className="grid w-full gap-3">
            <DemoCard
              title="Schedule tax sweep"
              body="Move 20% of the latest inflows to the tax vault and share the update with your accountant."
            />
            <DemoCard
              title="Approve vendor payout"
              body="Send the pending vendor payment via ACH and sync the receipt to your ledger without leaving the dashboard."
            />
            <DemoCard
              title="Reconcile deposits"
              body="Tag the latest bank deposits to open invoices so revenue reporting stays up to date."
            />
          </div>
        </div>
      </BrowserWindow>
    </div>
  );
}

interface DemoCardProps {
  title: string;
  body: string;
}

function DemoCard({ title, body }: DemoCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-600">{body}</p>
    </div>
  );
}
