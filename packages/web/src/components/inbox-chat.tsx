'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles, Bot, User, X, Settings2 } from 'lucide-react';
import { FormEvent, useEffect, useRef, lazy, Suspense } from 'react';
import { useChat, type Message as VercelAiMessage } from '@ai-sdk/react';
import { InboxChatCard } from './inbox-chat-card';
import type { InboxCardDB } from '@/db/schema';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { ErrorBoundary } from '@/components/error-boundary';

const ClassificationSettings = lazy(() => import('@/components/inbox/classification-settings').then(m => ({ default: m.ClassificationSettings })));

// Helper to check if a string is a valid JSON array of cards
function tryParseCards(jsonString: string): InboxCardDB[] | null {
  try {
    const value = JSON.parse(jsonString);
    if (Array.isArray(value) && value.length > 0 && 'cardId' in value[0]) {
      return value;
    }
    return null;
  } catch (e) {
    return null;
  }
}

interface InboxChatProps {
  onCardsUpdated?: () => void;
  onClose?: () => void;
}

export function InboxChat({ onCardsUpdated, onClose }: InboxChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error: chatApiError,
    isLoading,
  } = useChat({
    api: '/api/inbox-chat',
    maxSteps: 4, // user -> tool-call -> tool-result -> assistant
  });

  const isMobile = useIsMobile();

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950">
      {/* Clean header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Assistant</h2>

        <div className="flex items-center gap-2">
          {isMobile && (
            <ErrorBoundary fallback={<div className="text-sm p-2">Failed to load</div>}>
              <Suspense fallback={<Loader2 className="h-4 w-4 animate-spin" />}>
                <ClassificationSettings className="h-8" />
              </Suspense>
            </ErrorBoundary>
          )}

          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages area - clean and minimal */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg: VercelAiMessage) => {
            // Case 1: Assistant message with tool invocations
            if (msg.role === 'assistant' && msg.toolInvocations && msg.toolInvocations.length > 0) {
              const toolInvocation = msg.toolInvocations[0];
              
              // Check if the tool call is still in progress (no result yet)
              if (toolInvocation.state === 'partial-call' || toolInvocation.state === 'call') {
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 px-2"
                  >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Using {toolInvocation.toolName}...</span>
                  </motion.div>
                );
              }
              
              // If tool has result, parse and display it
              if (toolInvocation.state === 'result') {
                // Handle get_receipts tool results
                if (toolInvocation.toolName === 'get_receipts') {
                  const cards = tryParseCards(String(toolInvocation.result));
                  if (cards) {
                    return (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="space-y-2">
                          {cards.map(card => <InboxChatCard key={card.id} card={card} />)}
                        </div>
                        {msg.content && (
                          <div className="text-sm text-neutral-700 dark:text-neutral-300 px-2">
                            {msg.content}
                          </div>
                        )}
                      </motion.div>
                    );
                  }
                }
                
                // Handle mark_cards tool results
                if (toolInvocation.toolName === 'mark_cards') {
                  try {
                    const result = JSON.parse(String(toolInvocation.result));
                    if (result.success) {
                      // Trigger the refresh when cards are successfully updated
                      if (onCardsUpdated) {
                        onCardsUpdated();
                      }
                      
                      return (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-2"
                        >
                          <div className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-3 py-2 rounded">
                            <p className="font-medium">✓ Updated {result.updatedCount} cards</p>
                            <p>Status: {result.newStatus}</p>
                          </div>
                          {msg.content && (
                            <div className="text-sm text-neutral-700 dark:text-neutral-300 px-2">
                              {msg.content}
                            </div>
                          )}
                        </motion.div>
                      );
                    }
                  } catch (e) {
                    console.error('Failed to parse mark_cards result:', e);
                  }
                }
              }
            }

            // Case 2: Regular user or assistant text message
            if (!msg.content) {
              return null;
            }
            
            const isUser = msg.role === 'user';
            
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-sm px-2",
                  isUser ? "text-neutral-900 dark:text-white font-medium" : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                <p className="leading-relaxed">{msg.content}</p>
                {!isUser && (
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? ''}
                  </p>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 px-2"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}

        {chatApiError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-red-600 dark:text-red-400 px-2"
          >
            Error: {chatApiError.message}
          </motion.div>
        )}
      </div>

      {/* Input form - minimal */}
      <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)} className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Ask about receipts..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 h-9 text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-9 px-3"
          >
            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </form>
    </div>
  );
} 