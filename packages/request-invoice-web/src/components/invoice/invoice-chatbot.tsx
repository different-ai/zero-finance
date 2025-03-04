'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, Loader2, CheckCircle, FileText, ArrowRight, Receipt } from 'lucide-react';
import { useChat, type Message } from '@ai-sdk/react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import Image from 'next/image';
import { useInvoiceStore } from '@/lib/store/invoice-store';

interface InvoiceChatbotProps {
  onSuggestion?: (suggestion: any) => void;
}

interface InvoiceData {
  invoiceData: any;
  missingFields?: string[];
}

// Custom type guard for tool invocation parts
function isToolInvocationPart(part: any, toolName: string): boolean {
  return part.type === 'tool-invocation' && part.tool === toolName;
}

export function InvoiceChatbot({ onSuggestion }: InvoiceChatbotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [foundInvoice, setFoundInvoice] = useState<boolean>(false);
  
  // Use Zustand store for invoice data
  const { 
    setDetectedInvoiceData, 
    detectedInvoiceData,
    clearDetectedInvoiceData,
    hasInvoiceData
  } = useInvoiceStore();
  
  // Use the AI SDK hook for chat functionality
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    append
  } = useChat({
    api: '/api/invoice-chat',
    initialMessages: [
      {
        id: 'welcome',
        content: '👋 Hi there! I can help retrieve invoice information. Simply ask me to get an invoice for you.',
        role: 'assistant',
      },
    ],
    onResponse: (response) => {
      // Handle successful response
      if (response.status !== 200) {
        toast.error('Failed to communicate with the invoice assistant');
      }
    },
    onError: (error) => {
      toast.error('An error occurred: ' + (error.message || 'Unknown error'));
    }
  });
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Process messages to extract invoice data from tool invocations
  useEffect(() => {
    // Check for tool invocation in the last message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.parts) {
      // Look for invoice tool invocation parts
      const invoiceTools = lastMessage.parts.filter(part => 
        isToolInvocationPart(part, 'invoiceAnswer')
      );
      
      if (invoiceTools && invoiceTools.length > 0) {
        const invoiceToolInvocation = invoiceTools[0];
        // Use type assertion to access the params property
        const invoiceData = (invoiceToolInvocation as any).params as InvoiceData;
        
        if (invoiceData && invoiceData.invoiceData) {
          // Store the detected invoice data in the Zustand store
          setDetectedInvoiceData(invoiceData.invoiceData);
          setFoundInvoice(true);
          
          // Show appropriate toast notification (quietly)
          if (invoiceData.missingFields && invoiceData.missingFields.length > 0) {
            toast.info(`Some fields may need completion`, { duration: 3000 });
          } else {
            toast.success('Invoice information detected!', { duration: 3000 });
          }
        }
      }
    }
  }, [messages, setDetectedInvoiceData]);
  
  // Function to handle using the detected invoice data
  const handleUseInvoiceData = () => {
    if (detectedInvoiceData) {
      // For backward compatibility
      if (onSuggestion) {
        onSuggestion(detectedInvoiceData);
      }
      
      toast.success('Invoice data applied to form!');
      
      // Add confirmation message from assistant
      append({
        role: 'assistant',
        content: '✅ I\'ve added the invoice data to your form. Please review and make any necessary adjustments.'
      });
      
      // Clear the found invoice state but retain the data for later use
      setFoundInvoice(false);
    }
  };
  
  // Handle form submission with special commands
  const handleSubmitWithCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check for invoice query commands
    const invoiceCommandRegex = /(get|retrieve|find|show|extract).*invoice/i;
    
    if (invoiceCommandRegex.test(input)) {
      // Add a loading message for better user experience
      append({
        role: 'user',
        content: input
      });
      
      // Clear the input field
      handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      
      // Let the AI handle the rest
      handleSubmit(e);
    } else {
      // For regular messages, just submit normally
      handleSubmit(e);
    }
  };
  
  // Format invoice data for display
  const formatInvoiceDisplay = (content: string) => {
    // Check if this is likely an invoice
    if (!content.includes('Invoice') && !content.includes('invoice')) {
      return <div className="whitespace-pre-wrap">{content}</div>;
    }
    
    // Extract invoice sections and format them
    const sections: {[key: string]: string[]} = {
      'Invoice Details': [],
      'From': [],
      'To': [],
      'Items': [],
      'Payment': [],
      'Other': []
    };
    
    const lines = content.split('\n');
    let currentSection = 'Other';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Identify section headers
      if (trimmedLine.match(/^Invoice\s+#|^Invoice\s+Number|^Date|^Due\s+Date/i)) {
        currentSection = 'Invoice Details';
        sections[currentSection].push(trimmedLine);
      } else if (trimmedLine.match(/^From:/i) || (currentSection === 'Invoice Details' && trimmedLine.match(/^[A-Za-z0-9\s]+:$/) && !trimmedLine.match(/^To:/i))) {
        currentSection = 'From';
        sections[currentSection].push(trimmedLine.replace(/^From:\s*/i, ''));
      } else if (trimmedLine.match(/^To:/i)) {
        currentSection = 'To';
        sections[currentSection].push(trimmedLine.replace(/^To:\s*/i, ''));
      } else if (trimmedLine.match(/^Items?:/i) || trimmedLine.match(/^\d+\.\s+/) || currentSection === 'Items') {
        currentSection = 'Items';
        sections[currentSection].push(trimmedLine.replace(/^Items?:\s*/i, ''));
      } else if (trimmedLine.match(/^Subtotal|^Tax|^Total|^Payment\s+Terms/i)) {
        currentSection = 'Payment';
        sections[currentSection].push(trimmedLine);
      } else {
        // Add to current section if not a header
        sections[currentSection].push(trimmedLine);
      }
    });
    
    // Remove empty sections
    Object.keys(sections).forEach(key => {
      if (sections[key].length === 0) {
        delete sections[key];
      }
    });
    
    return (
      <div className="space-y-3 text-sm invoice-data-display nostalgic-container p-3">
        {Object.entries(sections).map(([sectionName, lines], index) => (
          lines.length > 0 && (
            <div key={index} className="invoice-section">
              <h4 className="font-semibold mb-1 border-b pb-1 text-primary">{sectionName}</h4>
              <div className="pl-2 border-l-2 border-primary/20 space-y-1">
                {lines.map((line, i) => {
                  // Highlight monetary values
                  const formattedLine = line.replace(/(\$[\d,]+\.\d{2}|\d+\.\d{2})/g, 
                    '<span class="font-medium text-primary">$1</span>');
                  
                  return (
                    <div 
                      key={i} 
                      className={line.match(/total|subtotal|tax/i) ? 'font-medium' : ''}
                      dangerouslySetInnerHTML={{__html: formattedLine}}
                    />
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    );
  };
  
  // Render message content based on type
  const renderMessageContent = (message: Message) => {
    if (!message.content && !message.parts) return null;

    // Check if this message contains invoice information
    const hasInvoiceInfo = message.content && (
      message.content.includes("Invoice") || 
      message.content.includes("invoice") ||
      message.content.includes("Total:") ||
      message.content.match(/\$[\d,]+\.\d{2}/)
    );

    // If message has parts, render each part according to its type
    if (message.parts) {
      return message.parts.map((part: any, index) => {
        if (part.type === 'text') {
          // Check if text part contains invoice information
          if (part.text.includes("Invoice") || 
              part.text.includes("invoice") ||
              part.text.includes("Total:") ||
              part.text.match(/\$[\d,]+\.\d{2}/)) {
            return (
              <div key={index} className="invoice-info">
                {formatInvoiceDisplay(part.text)}
                {/* Show the "Use this in invoice" button only when invoice is first found */}
                {foundInvoice && detectedInvoiceData && (
                  <div className="mt-3 flex justify-center">
                    <button 
                      onClick={handleUseInvoiceData}
                      className="nostalgic-button flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Use this in invoice
                    </button>
                  </div>
                )}
              </div>
            );
          }
          return <div key={index} className="whitespace-pre-wrap">{part.text}</div>;
        } else if (part.type === 'tool-invocation') {
          // We don't render tool invocations directly
          return null;
        }
        return null;
      });
    }
    
    // Fallback to content with prettier formatting for invoice info
    return hasInvoiceInfo ? (
      <div className="invoice-info">
        {formatInvoiceDisplay(message.content)}
        {/* Show the "Use this in invoice" button only when invoice is first found */}
        {foundInvoice && detectedInvoiceData && (
          <div className="mt-3 flex justify-center">
            <button 
              onClick={handleUseInvoiceData}
              className="nostalgic-button flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium"
            >
              <ArrowRight className="h-4 w-4" />
              Use this in invoice
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="whitespace-pre-wrap">{message.content}</div>
    );
  };
  
  // Quick actions to demonstrate the user flow
  const quickActions = [
    { text: "Retrieve an invoice", icon: <Receipt className="h-4 w-4" /> },
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col nostalgic-container rounded-lg h-full">
        <div className="p-3 border-b border-primary/10 bg-white text-primary">
          <div className="flex items-center">
            <div className="digital-effect mr-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center blue-overlay">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            </div>
            <span className="logo-text font-medium text-sm">Invoice Assistant</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="digital-effect h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 blue-overlay">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div 
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white border border-primary/10'
                }`}
              >
                {renderMessageContent(message)}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="digital-effect h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 blue-overlay">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-white border border-primary/10 rounded-lg px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary/50" />
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 rounded-md text-red-700 text-sm">
              <p className="font-medium">Error</p>
              <p>{error.message || 'An error occurred'}</p>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick action buttons */}
        {messages.length < 3 && !isLoading && (
          <div className="px-4 py-2 flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  const actionText = action.text;
                  append({
                    role: 'user',
                    content: actionText
                  });
                  handleSubmit(new Event('submit') as any);
                }}
                className="nostalgic-button-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
              >
                {action.icon}
                {action.text}
              </button>
            ))}
          </div>
        )}
        
        <form 
          onSubmit={handleSubmitWithCheck}
          className="border-t border-primary/10 p-4 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me to retrieve an invoice..."
            className="flex-1 px-3 py-2 nostalgic-input text-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 rounded-md ${
              isLoading || !input.trim()
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'nostalgic-button'
            }`}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Persistent button to apply detected invoice data (only shows when invoice data is available but not currently shown in chat) */}
        {hasInvoiceData && detectedInvoiceData && !foundInvoice && (
          <div className="border-t border-primary/10 p-3 bg-primary/5">
            <button
              onClick={handleUseInvoiceData}
              className="w-full nostalgic-button flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium"
            >
              <FileText className="h-4 w-4" />
              <span>Use Detected Invoice Data</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}