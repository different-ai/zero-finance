'use client';

import React from 'react';
import { BrowserWindow } from '@/components/ui/browser-window';
import { InboxContent } from '@/components/inbox-content';

export function ProductDemo() {
  return (
    <div className="relative">
      <BrowserWindow
        url="0.finance/inbox"
        title="Zero Finance - Smart Inbox Demo"
      >
        <InboxContent forceLoadDemo />
      </BrowserWindow>
    </div>
  );
} 