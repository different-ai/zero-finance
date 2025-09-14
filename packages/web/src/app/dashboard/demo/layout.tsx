import React from 'react';
import { DemoModeProvider } from '@/providers/demo-mode-provider';
import DashboardClientLayout from '@/app/(authenticated)/dashboard/dashboard-client-layout';

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoModeProvider>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </DemoModeProvider>
  );
}
