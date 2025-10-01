'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ url: string; title?: string }>;
}

const KYB_CONTEXT = `You are helping a business complete their KYB (Know Your Business) verification for a Delaware C-Corp or LLC.

Key documents and information needed:
- Business Name: Legal company name as registered
- Business Entity ID: Delaware File Number (digits only, e.g., 7286832)
- Tax ID (EIN): 9-digit Federal Employer Identification Number
- Ultimate Beneficial Owners (UBOs) & Founders: All people who own or control the company
- Shareholders Registry: Cap table showing ownership (can be generated with ChatGPT)
- Business Registration Document: Certificate of Incorporation or Good Standing
- Source of Funds: Documentation showing where initial capital came from
- Proof of Address: Recent document (within 3 months) showing business address

Help users:
1. Understand what each field requires
2. Find documents they need
3. Generate shareholder registries using ChatGPT prompts
4. Answer specific questions about their situation

Be concise, helpful, and focus on actionable guidance.`;

export function KybAiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm here to help you complete your KYB verification. I can answer questions about required documents, help you generate a shareholder registry, or clarify any field requirements. What would you like help with?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/kyb-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: KYB_CONTEXT,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content,
          sources: data.sources,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I encountered an error. Please try again or contact support if the issue persists.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch('/api/generate-shareholder-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.filter((m) => m.role === 'user'),
        }),
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shareholder-registry.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I couldn't generate the PDF. Please make sure you've provided all the necessary information about your shareholders.",
        },
      ]);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-[400px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'p-3 rounded-lg text-xs',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground ml-4'
                : 'bg-muted mr-4',
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-[10px] opacity-70 mb-1">Sources:</p>
                {message.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] opacity-70 hover:opacity-100 underline block truncate"
                  >
                    {source.title || source.url}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-3">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about KYB requirements..."
            className="text-xs resize-none"
            rows={2}
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="sm"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </Button>
        </div>

        <Button
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
          variant="outline"
          size="sm"
          className="w-full text-xs"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="h-3 w-3 mr-2" />
              Generate Registry Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
