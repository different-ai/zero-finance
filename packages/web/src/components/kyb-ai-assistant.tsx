'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, FileText } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';

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
  const { messages, sendMessage } = useChat();

  const [input, setInput] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
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

      sendMessage({
        text: "✓ Document generated! I've downloaded the shareholder registry as an HTML file. You can open it in your browser, print it to PDF, or upload it directly for KYB verification.",
      });
    } catch (error) {
      console.error('Error generating document:', error);
      sendMessage({
        text: "I couldn't generate the document. Please make sure you've provided information about your shareholders in our conversation first. Try telling me about your company structure and ownership.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-[400px]">
        {messages.map((message, index) => (
          <Message key={index} from={message.role}>
            <MessageContent>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <Response key={`${message.role}-${i}`}>
                        {part.text}
                      </Response>
                    );
                  default:
                    return null;
                }
              })}
            </MessageContent>
          </Message>
        ))}
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
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            size="sm"
            className="shrink-0"
          >
            <Send className="h-3 w-3" />
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
