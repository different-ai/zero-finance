'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Sparkles, Bot, User, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
// TODO: Fix AI SDK integration - current version may have different API
// import { useChat, type UIMessage } from '@ai-sdk/react';
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
  onClose?: () => void;
}

export function InboxChat({ onCardsUpdated, onClose }: InboxChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; role: string; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Implement proper AI SDK integration
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Placeholder implementation
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: 'This is a placeholder response. AI chat functionality needs to be re-implemented with the current AI SDK version.' 
      }]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950">
      {/* Clean header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Assistant</h2>
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

      {/* Messages area - clean and minimal */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
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
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 px-2"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Thinking...</span>
          </motion.div>
        )}
      </div>

      {/* Input area - consistent with other chat components */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your receipts..."
            className="flex-1 min-h-[36px] rounded-full bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 focus:border-neutral-300 dark:focus:border-neutral-600"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            className="h-9 w-9 rounded-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900"
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
} 