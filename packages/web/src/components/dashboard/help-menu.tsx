'use client';

import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { WelcomeSlideshow } from '@/components/welcome-slideshow';

export function HelpMenu() {
  const [showSlideshow, setShowSlideshow] = useState(false);

  const handleReplayTutorial = () => {
    // Clear the completion flag and show slideshow
    localStorage.removeItem('zero-welcome-completed');
    setShowSlideshow(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">help menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>help & resources</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleReplayTutorial}>
            <PlayCircle className="mr-2 h-4 w-4" />
            <span>replay welcome tour</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => window.open('/how-it-works', '_blank')}>
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
          
          <DropdownMenuItem onClick={() => window.open('https://docs.0.finance', '_blank')}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>documentation</span>
            <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showSlideshow && (
        <WelcomeSlideshow 
          onComplete={() => setShowSlideshow(false)}
          showCloseButton={true}
        />
      )}
    </>
  );
} 