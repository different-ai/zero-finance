'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HelpCircle,
  PlayCircle,
  BookOpen,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

export function HelpMenu() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Help menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.open('https://docs.zerofinance.io', '_blank')}
            className="cursor-pointer"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            <span>Product Tour</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => window.open('/how-it-works', '_blank')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>how it works</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => window.open('/support', '_blank')}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>contact support</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => window.open('https://docs.0.finance', '_blank')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>documentation</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
