'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import { FormEvent, useEffect, useRef } from 'react';
import { useChat, type Message as VercelAiMessage } from '@ai-sdk/react';
import { InboxChatCard } from './inbox-chat-card';
import type { InboxCardDB } from '@/db/schema';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export function InboxChat({ onCardsUpdated }: InboxChatProps) {
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

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">AI Assistant</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">Ask questions about your inbox items</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg: VercelAiMessage) => {
            // Case 1: Message from a tool
            if (msg.role === 'tool') {
              const cards = tryParseCards(msg.content);
              if (cards) {
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 my-4"
                  >
                    {cards.map(card => <InboxChatCard key={card.id} card={card} />)}
                  </motion.div>
                );
              }
              // Render plain text if tool result is not cards
              return (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">Tool Result:</p>
                    <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              );
            }

            // Case 2: Assistant message with tool invocations
            if (msg.role === 'assistant' && msg.toolInvocations && msg.toolInvocations.length > 0) {
              const toolInvocation = msg.toolInvocations[0];
              
              // Check if the tool call is still in progress (no result yet)
              if (toolInvocation.state === 'call' || !toolInvocation.result) {
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                        <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                      </div>
                      <div className="max-w-[85%] p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">
                            Using tool: <strong className="text-neutral-900 dark:text-white">{toolInvocation.toolName}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }
              
              // If tool has result, parse and display it
              if (toolInvocation.result) {
                // Handle get_receipts tool results
                if (toolInvocation.toolName === 'get_receipts') {
                  const cards = tryParseCards(String(toolInvocation.result));
                  if (cards) {
                    return (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          {cards.map(card => <InboxChatCard key={card.id} card={card} />)}
                        </div>
                        {msg.content && (
                          <div className="flex justify-start">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                                <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                              </div>
                              <div className="max-w-[85%] p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{msg.content}</p>
                              </div>
                            </div>
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
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-start">
                            <div className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                              <p className="text-sm font-semibold text-green-900 dark:text-green-200">✓ Action completed</p>
                              <p className="text-sm text-green-800 dark:text-green-300">Updated {result.updatedCount} cards to status: {result.newStatus}</p>
                            </div>
                          </div>
                          {msg.content && (
                            <div className="flex justify-start">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                                  <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div className="max-w-[85%] p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{msg.content}</p>
                                </div>
                              </div>
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

            // Case 3: Regular user or assistant text message
            if (!msg.content) {
              return null;
            }
            
            const isUser = msg.role === 'user';
            
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, x: isUser ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("flex", isUser ? "justify-end" : "justify-start")}
              >
                {isUser ? (
                  <div className="flex items-end gap-3 max-w-[85%]">
                    <div className="p-4 rounded-2xl bg-primary text-white shadow-md">
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className="text-xs text-primary-foreground/70 mt-2 text-right">
                        {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? ''}
                      </p>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                    </div>
                    <div className="max-w-[85%] p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{msg.content}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                        {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? ''}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800">
                <Bot className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Thinking...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {chatApiError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-800 dark:text-red-200">Error: {chatApiError.message}</p>
          </motion.div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)} className="p-4 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Ask about your inbox..."
            value={input}
            onChange={handleInputChange}
            className="flex-1 h-12 px-4 text-sm bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-md"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
} 