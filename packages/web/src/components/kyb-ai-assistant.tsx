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

const KYB_CONTEXT = `You are an expert KYB (Know Your Business) assistant helping businesses complete their verification for Delaware C-Corps or LLCs.

**Web Search Tool Available:**
You have access to real-time web search to help users find:
- Delaware business entity information and file numbers
- IRS EIN lookup and recovery information
- Specific incorporation service documentation (Stripe Atlas, Clerky, First Base, Carta)
- Current KYB requirements and regulations
- Document templates and examples

Use web search proactively when users need current information about:
- Where to find specific documents
- How to request replacements for lost documents
- Service-specific instructions for their incorporation platform
- Current Delaware Division of Corporations procedures
- IRS contact information and procedures

**Your Approach:**
1. **First Message** - Collect essentials:
   • Company name and entity type (C-Corp/LLC)
   • Co-founder names, emails, ownership percentages
   • Company address
   • Incorporation service (Clerky/Carta/Stripe Atlas/First Base) - CRITICAL for finding documents

2. **As They Ask Questions** - Use web search when helpful:
   • Search for current Delaware entity lookup procedures
   • Find service-specific document locations
   • Get latest IRS guidance on EIN recovery
   • Look up incorporation service help documentation

3. **Throughout Conversation** - Track what they share:
   • Store company details, ownership info, addresses
   • When you have enough info, suggest generating their shareholder registry

**Communication Style:**
- Conversational and helpful, never robotic
- Use **bold** for emphasis, • for bullets
- Give specific, actionable steps with current URLs when available
- Cite sources when providing information from web search
- Reference their incorporation service by name when giving guidance

**Documents Needed:**
- Business Entity ID (Delaware File Number - digits only, e.g., 7286832)
- Tax ID (EIN - 9 digits)
- Shareholder Registry (you'll generate this)
- Certificate of Incorporation or Good Standing
- Proof of Address (within 3 months)

Remember: Use web search to provide the most current, accurate information. Always cite your sources!`;

export function KybAiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "👋 Hi! I'm here to help you complete KYB verification faster.\n\n**To get started, tell me about your company:**\n\n• Company name and entity type (C-Corp or LLC)\n• Co-founder names, emails, and ownership %\n• Registered address\n• Are you using Clerky, Carta, First Base, or Stripe Atlas?\n\nOnce I have this info, I can help you fill out the KYB form and generate your shareholder registry automatically.",
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
          messages: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate document');

      const data = await response.json();

      // Create a proper HTML file with complete structure
      const htmlContent = data.html;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shareholder-registry.html';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "✓ Document generated! I've downloaded the shareholder registry as an HTML file. You can open it in your browser, print it to PDF, or upload it directly for KYB verification.",
        },
      ]);
    } catch (error) {
      console.error('Error generating document:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I couldn't generate the document. Please make sure you've provided information about your shareholders in our conversation first. Try telling me about your company structure and ownership.",
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
            <div
              className="whitespace-pre-wrap prose prose-xs max-w-none"
              dangerouslySetInnerHTML={{
                __html: message.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/•/g, '•')
                  .replace(/\n/g, '<br />'),
              }}
            />
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-[10px] opacity-70 mb-1">🔍 Sources:</p>
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
