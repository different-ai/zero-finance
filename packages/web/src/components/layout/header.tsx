'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        {/* Mobile menu button - only visible on small screens */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden p-2"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Page title - hidden on mobile when we have breadcrumbs */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Right side - can be extended with user menu, notifications, etc. */}
        <div className="flex items-center gap-4">
          {/* Placeholder for future header actions */}
        </div>
      </div>
    </header>
  );
} 