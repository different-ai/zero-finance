'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { FormEvent } from 'react';
import { useChat, type Message as VercelAiMessage } from '@ai-sdk/react';

interface InboxChatProps {}

export function InboxChat({}: InboxChatProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error: chatApiError,
  } = useChat({
    api: '/api/inbox-chat',
  });

  return (
    <div className="flex flex-col h-full border-l bg-slate-50 dark:bg-slate-900/50">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg: VercelAiMessage) => {
          return (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs text-muted-foreground/70 mt-1 text-right">
                  {msg.createdAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? ''}
                </p>
              </div>
            </div>
          );
        })}
        {chatApiError && (
          <div className="text-red-500 p-2 bg-red-100 rounded">
            <p>Chat Error: {chatApiError.message}</p>
          </div>
        )}
      </div>

      <form onSubmit={(e: FormEvent<HTMLFormElement>) => handleSubmit(e)} className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground" title="Attach file (not implemented)">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            type="text" 
            placeholder="Type message..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
} 