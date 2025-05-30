'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo } from 'react';

import { ModelSelector } from './model-selector';
import { Button } from './ui/button';
import { PlusIcon } from './icons';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { VisibilityType, VisibilitySelector } from './visibility-selector';
import { useResearchPlanStore } from '../lib/store/research-plan-store';
import { ResearchPlanToggle } from './research-plan-toggle';

function PureSimpleChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const isResearchActive = useResearchPlanStore((state: { isActive: boolean }) => state.isActive);

  return (
    <header className="flex sticky top-0 bg-white border-b border-primary/10 py-1.5 items-center px-4 md:px-4 gap-2 z-10">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0 nostalgic-button-secondary"
            onClick={() => {
              router.push('/');
              router.refresh();
            }}
          >
            <PlusIcon size={14} />
            <span className="hidden md:inline">New Chat</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>New Chat</TooltipContent>
      </Tooltip>

      {!isReadonly && (
        <ModelSelector
          selectedModelId={selectedModelId}
          className="order-1 md:order-2"
        />
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
          className="order-1 md:order-3"
        />
      )}

      {isResearchActive && (
        <div className="order-4 mx-2">
          <ResearchPlanToggle />
        </div>
      )}

      <div className="flex items-center order-5 md:ml-auto h-[34px]">
        <Image 
          src="/images/zero-finance-long-logo.png" 
          alt="Zero Finance" 
          className="h-[34px] object-contain"
          width={136}
          height={34}
        />
      </div>
    </header>
  );
}

export const SimpleChatHeader = memo(PureSimpleChatHeader, (prevProps, nextProps) => {
  return prevProps.selectedModelId === nextProps.selectedModelId;
}); 