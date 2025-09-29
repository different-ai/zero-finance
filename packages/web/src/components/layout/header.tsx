'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 border-b border-[#101010]/10 bg-white flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <WorkspaceSwitcher />
      </div>
      <div className="flex items-center gap-2">
        {/* Additional header items can go here */}
      </div>
    </header>
  );
}
