'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, Loader2, FileText, ArrowRight, Receipt } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { useInvoiceStore } from '@/lib/store/invoice-store';

interface InvoiceChatbotProps {
  onSuggestion?: (suggestion: any) => void;
}

export function InvoiceChatbot({ onSuggestion }: InvoiceChatbotProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<any>(null);
  
  // Use Zustand store for invoice data
  const { 
    setDetectedInvoiceData,
    detectedInvoiceData,
    applyDataToForm 
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
  
  // Handle applying invoice data to the form
  const applyInvoiceData = (data: any) => {
    if (!data) return;
    
    // Store the data in the Zustand store
    setDetectedInvoiceData(data);
    
    // For backward compatibility
    if (onSuggestion) {
      onSuggestion(data);
    }
    
    toast.success('Invoice data applied to form!');
    
    // Add confirmation message from assistant
    append({
      role: 'assistant',
      content: '✅ I\'ve added the invoice data to your form. Please review and make any necessary adjustments.'
    });
    
    // Clear the current invoice data reference
    setCurrentInvoiceData(null);
  };
  
  // Handle form submission with special commands
  const handleSubmitWithCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };
  
  // Format invoice sections for nicer display
  const formatInvoiceDisplay = (data: any) => {
    if (!data) return null;
    
    const { invoice } = data;
    
    return (
      <div className="space-y-3 invoice-data-display rounded-md border border-primary/20 p-3 mt-2 bg-primary/5">
        <div className="flex justify-between items-center border-b border-primary/20 pb-2">
          <h4 className="font-semibold text-primary">Invoice Data Found</h4>
          <button 
            onClick={() => applyInvoiceData(invoice)}
            className="bg-primary text-white text-xs px-3 py-1 rounded-md flex items-center gap-1 hover:bg-primary/90"
          >
            <ArrowRight className="h-3 w-3" />
            <span>Use in Invoice</span>
          </button>
        </div>
        
        {/* More compact invoice summary */}
        <div className="text-xs space-y-2">
          {/* Basic details row */}
          <div className="grid grid-cols-2 gap-x-2">
            <div><span className="text-primary/70">Invoice #:</span> {invoice.invoiceNumber || 'N/A'}</div>
            <div><span className="text-primary/70">Currency:</span> {invoice.defaultCurrency || 'N/A'}</div>
            <div><span className="text-primary/70">Date:</span> {invoice.creationDate?.slice(0, 10) || 'N/A'}</div>
            <div><span className="text-primary/70">Due:</span> {invoice.paymentTerms?.dueDate?.slice(0, 10) || 'N/A'}</div>
          </div>

          {/* Seller/Buyer row */}
          <div className="grid grid-cols-2 gap-x-2 border-t border-primary/10 pt-1">
            <div>
              <div className="text-primary/70">From:</div>
              <div className="font-medium">{invoice.sellerInfo?.businessName || 'N/A'}</div>
              <div className="text-xs truncate">{invoice.sellerInfo?.email || ''}</div>
            </div>
            <div>
              <div className="text-primary/70">To:</div>
              <div className="font-medium">{invoice.buyerInfo?.businessName || 'N/A'}</div>
              <div className="text-xs truncate">{invoice.buyerInfo?.email || ''}</div>
            </div>
          </div>
          
          {/* Items section (limited) */}
          {invoice.invoiceItems && invoice.invoiceItems.length > 0 && (
            <div className="border-t border-primary/10 pt-1">
              <div className="text-primary/70">Items ({invoice.invoiceItems.length}):</div>
              <div className="overflow-hidden max-h-24">
                <table className="w-full text-left">
                  <tbody>
                    {invoice.invoiceItems.slice(0, 3).map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-primary/10 last:border-0">
                        <td className="py-0.5">{item.name || 'Item ' + (idx+1)}</td>
                        <td className="py-0.5 text-right w-8">{item.quantity || '1'}</td>
                        <td className="py-0.5 text-right w-16">{item.unitPrice ? `$${Number(item.unitPrice)/100}` : 'N/A'}</td>
                      </tr>
                    ))}
                    {invoice.invoiceItems.length > 3 && (
                      <tr>
                        <td colSpan={3} className="text-center text-primary/60 italic text-xs py-0.5">
                          + {invoice.invoiceItems.length - 3} more items
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
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
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
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
                {/* Render message content based on its type */}
                {message.parts ? (
                  message.parts.map((part, partIndex) => {
                    if (part.type === 'text') {
                      return <div key={`text-${partIndex}`} className="whitespace-pre-wrap">{part.text}</div>;
                    } else if (part.type === 'tool-invocation') {
                      // Only render specific tool invocations
                      const toolCall = part.toolInvocation;
                      
                      if (toolCall.toolName === 'invoiceAnswer' && toolCall.state === 'result') {
                        // Store this data for potential use
                        if (toolCall.result && toolCall.result.invoiceData && !currentInvoiceData) {
                          setCurrentInvoiceData(toolCall.result);
                        }
                        
                        // Render the formatted invoice data UI
                        return (
                          <div key={`tool-${partIndex}`}>
                            {formatInvoiceDisplay({ invoice: toolCall.result.invoiceData })}
                          </div>
                        );
                      }
                      
                      if (toolCall.toolName === 'screenpipeSearch' && toolCall.state === 'result') {
                        // Don't show search messages - they're duplicative and noisy
                        return null;
                      }
                      
                      // Don't render other tool calls
                      return null;
                    }
                    return null;
                  })
                ) : (
                  // Simple text message
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
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
                  append({
                    role: 'user',
                    content: action.text
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
            className={`text-white p-2 rounded-md ${
              isLoading || !input.trim()
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'nostalgic-button'
            }`}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Persistent button to apply current invoice data */}
        {currentInvoiceData && (
          <div className="border-t border-primary/10 p-3 bg-primary/5">
            <button
              onClick={() => applyInvoiceData(currentInvoiceData.invoiceData)}
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