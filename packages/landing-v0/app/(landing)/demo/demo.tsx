'use client';
import { BrowserWindow } from './browser-window';
import { ModernDashboardDemo } from '../components/modern-dashboard-demo';

export const Demo = () => {
  return (
    <BrowserWindow>
      <ModernDashboardDemo />
    </BrowserWindow>
  );
};