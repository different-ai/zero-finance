'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileText } from 'lucide-react';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { Response } from '@/components/ai-elements/response';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
} from '@/components/ai-elements/conversation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const KYB_CONTEXT = `You are an expert KYB (Know Your Business) assistant helping businesses complete their verification for Delaware C-Corps or LLCs.

**Critical Verification Information:**
- Verification is handled by **AiPrise** (business and identity verification provider)
- **Align** is the financial services provider (deposits and transfers), NOT verification
- ALL beneficial owners (25%+ ownership) and ALL founders MUST be added - this is required by financial regulations
- Each person added will receive an email from AiPrise to complete identity verification (ID + selfie)
- Verification cannot proceed until everyone completes their AiPrise verification

**Role Assignments (when users ask):**
- **Beneficial Owner:** Anyone with 25%+ ownership (required by regulations)
- **Controlling Person:** Executives, directors, key decision-makers
- **Authorized Representative:** Someone authorized to sign documents for the company
- One person can have multiple roles if they apply
- Only assign roles that actually describe the person

**Web Search Tool Available:**
You have access to real-time web search to help users find:
- Delaware business entity information and file numbers
- IRS EIN lookup and recovery information
- Specific incorporation service documentation (Stripe Atlas, Clerky, First Base, Carta)
- Current KYB requirements and regulations
- Document templates and examples

**Your Approach:**
1. **First Message** - Collect essentials:
   • Company name and entity type (C-Corp/LLC)
   • Co-founder names, emails, ownership percentages (CRITICAL: need ALL beneficial owners)
   • Company address
   • Incorporation service (Clerky/Carta/Stripe Atlas/First Base)

2. **When they ask about roles/people:**
   • Remind them ALL founders and 25%+ owners must be added (regulations)
   • Explain each person gets an AiPrise email for verification
   • Clarify role types if confused

3. **Throughout Conversation:**
   • Track company details, ownership info
   • When you have enough info, suggest generating shareholder registry
   • Use web search for current document locations and procedures

**Communication Style:**
- Conversational and helpful, never robotic
- Use **bold** for emphasis, • for bullets
- Give specific, actionable steps with current URLs when available
- Cite sources when using web search

**Documents Needed:**
- Business Entity ID (Delaware File Number - digits only, e.g., 7286832)
- Tax ID (EIN - 9 digits)
- Shareholder Registry (you can generate this)
- Certificate of Incorporation or Good Standing
- Proof of Address (within 3 months)

Remember: Emphasize that ALL beneficial owners/founders must be added - you cannot skip anyone!`;

const INITIAL_ASSISTANT_TEXT =
  "👋 Hi! I'm here to help you complete KYB verification faster.\n\n**To get started, tell me about your company:**\n\n• Company name and entity type (C-Corp or LLC)\n• Co-founder names, emails, and ownership %\n• Registered address\n• Are you using Clerky, Carta, First Base, or Stripe Atlas?\n\nOnce I have this info, I can help you fill out the KYB form and generate your shareholder registry automatically.";

export function KybAiAssistant() {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [input, setInput] = useState('');
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/kyb-assistant',
      body: { context: KYB_CONTEXT },
    }),
    messages: [
      {
        id: 'welcome-1',
        role: 'assistant',
        parts: [{ type: 'text', text: INITIAL_ASSISTANT_TEXT }],
      },
    ],
  });

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (promptMessage: PromptInputMessage) => {
    const hasText = Boolean(promptMessage.text);
    const hasAttachments = Boolean(promptMessage.files?.length);

    if (!(hasText || hasAttachments) || status === 'streaming') return;

    setInput('');

    await sendMessage({
      text: promptMessage.text || 'Sent with attachments',
    });
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const response = await fetch('/api/generate-shareholder-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
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
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Conversation>
        <ConversationContent className="flex-1 overflow-y-auto max-h-[400px] mb-3">
          {messages.map((msg) => (
            <Message key={msg.id} from={msg.role}>
              <MessageContent>
                {msg.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <Response key={`${msg.role}-${i}`}>{part.text}</Response>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
          <div ref={conversationEndRef} />
        </ConversationContent>
      </Conversation>

      <div className="space-y-2">
        <PromptInput onSubmit={handleSendMessage} className="w-full relative">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder="Ask about KYB requirements..."
            className="text-xs resize-none min-h-[60px] pr-12"
          />
          <PromptInputSubmit
            className="absolute bottom-1 right-1"
            disabled={!input}
            status={status}
          />
        </PromptInput>

        <Button
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
          variant="outline"
          size="sm"
          className="w-full text-xs"
          type="button"
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
