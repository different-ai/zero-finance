'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo } from 'react';
import { UseChatHelpers } from '@ai-sdk/react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Research yield opportunities',
      label: 'for 10,000 USDC on Ethereum',
      action: 'Research yield opportunities for 10,000 USDC on Ethereum with moderate risk',
    },
    {
      title: 'What is the current price',
      label: 'of ETH and MATIC?',
      action: 'What is the current price of ETH and MATIC?',
    },
    {
      title: 'Compare swap costs',
      label: 'for ETH to USDC on different chains',
      action: 'Compare the swap costs for 1 ETH to USDC on Ethereum, Arbitrum, and Optimism',
    },
    {
      title: 'Find the highest yield',
      label: 'stablecoin pools on Arbitrum',
      action: 'Find the highest yield stablecoin pools on Arbitrum with low risk',
    },
  ];

  return (
    <div
      data-testid="suggested-actions"
      className="grid sm:grid-cols-2 gap-2 w-full pt-8"
    >
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {
              window.history.replaceState({}, '', `/chat/${chatId}`);

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
