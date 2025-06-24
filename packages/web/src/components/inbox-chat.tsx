'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { useChat, type Message as VercelAiMessage } from '@ai-sdk/react';
import { InboxChatCard } from './inbox-chat-card';
import type { InboxCardDB } from '@/db/schema';

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
    console.log('[Inbox-Chat-UI] Messages state updated:', messages);
    messages.forEach((msg, index) => {
      console.log(`[Inbox-Chat-UI] Message ${index}:`, {
        id: msg.id,
        role: msg.role,
        content: msg.content,
        toolInvocations: msg.toolInvocations,
        parts: msg.parts,
        createdAt: msg.createdAt
      });
    });
  }, [messages]);

  return (
    <div className="flex flex-col h-full border-l bg-slate-50 dark:bg-slate-900/50">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg: VercelAiMessage) => {
          console.log('[Inbox-Chat-UI] Rendering message:', {
            id: msg.id,
            role: msg.role,
            hasContent: !!msg.content,
            contentLength: msg.content?.length,
            toolInvocations: msg.toolInvocations,
            parts: msg.parts
          });
          
          // Case 1: Message from a tool
          if (msg.role === 'tool') {
            const cards = tryParseCards(msg.content);
            if (cards) {
              return (
                <div key={msg.id} className="space-y-2 my-4">
                  {cards.map(card => <InboxChatCard key={card.id} card={card} />)}
                </div>
              );
            }
            // Render plain text if tool result is not cards
            return (
              <div key={msg.id} className={`flex justify-start`}>
                    <div className="max-w-[70%] p-3 rounded-lg bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200">
                        <p className="text-sm font-semibold">Tool Result:</p>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
            )
          }

          // Case 2: Assistant message with tool invocations
          if (msg.role === 'assistant' && msg.toolInvocations && msg.toolInvocations.length > 0) {
            const toolInvocation = msg.toolInvocations[0];
            
            // Check if the tool call is still in progress (no result yet)
            if (toolInvocation.state === 'call' || !toolInvocation.result) {
              return (
                <div key={msg.id} className={`flex justify-start`}>
                    <div className="max-w-[70%] p-3 rounded-lg bg-muted">
                        <div className="flex items-center space-x-2 italic text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>
                            Calling tool: <strong>{toolInvocation.toolName}</strong>
                          </span>
                        </div>
                    </div>
                </div>
              );
            }
            
            // If tool has result, parse and display it
            if (toolInvocation.result) {
              // Handle get_receipts tool results
              if (toolInvocation.toolName === 'get_receipts') {
                const cards = tryParseCards(String(toolInvocation.result));
                if (cards) {
                  return (
                    <div key={msg.id} className="space-y-2 my-4">
                      {cards.map(card => <InboxChatCard key={card.id} card={card} />)}
                      {msg.content && (
                        <div className="mt-4">
                          <div className={`flex justify-start`}>
                            <div className={`max-w-[70%] p-3 rounded-lg bg-muted`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
                      <div key={msg.id} className="space-y-2 my-4">
                        <div className="flex justify-start">
                          <div className="p-3 rounded-lg bg-green-100 text-green-900 dark:bg-green-900/50 dark:text-green-200">
                            <p className="text-sm font-semibold">✓ Action completed</p>
                            <p className="text-sm">Updated {result.updatedCount} cards to status: {result.newStatus}</p>
                          </div>
                        </div>
                        {msg.content && (
                          <div className="mt-2">
                            <div className={`flex justify-start`}>
                              <div className={`max-w-[70%] p-3 rounded-lg bg-muted`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
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
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[70%] p-3 rounded-lg ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                 <p className="text-xs text-muted-foreground/70 mt-1 text-right">
                  {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? ''}
                </p>
              </div>
            </div>
          );
        })}
        
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className={`flex justify-start`}>
                 <div className={`max-w-[70%] p-3 rounded-lg bg-muted`}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                 </div>
            </div>
        )}

        {chatApiError && (
          <div className="text-red-500 p-2 bg-red-100 rounded">
            <p>Chat Error: {chatApiError.message}</p>
          </div>
        )}
      </div>

      <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)} className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type message..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!input.trim() || isLoading}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
} 