'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { useBimodal } from '@/components/ui/bimodal';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isTechnical } = useBimodal();

  return (
    <header
      className={cn(
        'h-16 border-b flex items-center justify-between px-4 sm:px-6 transition-colors duration-200',
        isTechnical
          ? 'border-[#1B29FF]/20 bg-[#F8F9FA]'
          : 'border-[#101010]/10 bg-white',
      )}
    >
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
