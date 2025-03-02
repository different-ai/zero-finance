'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, Loader2, CheckCircle, Copy, FileText } from 'lucide-react';
import { useChat, type Message } from '@ai-sdk/react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
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
  const [showToolUI, setShowToolUI] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [extractedInvoiceInfo, setExtractedInvoiceInfo] = useState<string>('');
  
  // Use Zustand store instead of local state
  const { 
    setDetectedInvoiceData, 
    detectedInvoiceData,
    clearDetectedInvoiceData,
    hasInvoiceData
  } = useInvoiceStore();
  
  // Use the Vercel AI SDK hook for chat functionality
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
        content: '👋 I\'m your Invoice Assistant! You can quickly add information to your invoice by typing "add this info to the invoice:" followed by the details you want to include.',
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

  // Process messages to handle tool invocations
  useEffect(() => {
    // Check for tool invocation in the last message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.parts) {
      // Look for tool invocation parts
      const invoiceTools = lastMessage.parts.filter(part => 
        isToolInvocationPart(part, 'invoiceAnswer')
      );
      
      if (invoiceTools && invoiceTools.length > 0) {
        const invoiceToolInvocation = invoiceTools[0];
        // Use type assertion to access the params property
        const invoiceData = (invoiceToolInvocation as any).params as InvoiceData;
        
        if (invoiceData) {
          // Store the detected invoice data in the Zustand store
          setDetectedInvoiceData(invoiceData.invoiceData);
          
          // Show toast notification about the invoice data
          if (invoiceData.missingFields && invoiceData.missingFields.length > 0) {
            toast.warning(`Invoice created with missing fields: ${invoiceData.missingFields.join(', ')}`);
          } else {
            toast.success('Invoice data generated successfully!');
          }
        }
      }
    }
  }, [messages, setDetectedInvoiceData]);
  
  // Client-side tool: Check for "add to invoice" command in user input
  const handleSubmitWithCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check for the "add this info to the invoice:" pattern
    const addToInvoiceRegex = /add\s+this\s+info\s+to\s+the\s+invoice\s*:(.+)/i;
    const match = input.match(addToInvoiceRegex);
    
    if (match) {
      // Extract the information to be added
      const extractedInfo = match[1].trim();
      
      if (extractedInfo) {
        // Store the extracted info and show confirmation UI
        setExtractedInvoiceInfo(extractedInfo);
        setConfirmationMessage(`Confirm adding '${extractedInfo}' to your invoice?`);
        setShowToolUI(true);
        
        // Add the user's message to the chat
        append({
          role: 'user',
          content: input
        });
        
        // Clear the input field
        handleInputChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
      } else {
        // If no information was provided after the colon
        handleSubmit(e);
      }
    } else {
      // For regular messages, just submit normally
      handleSubmit(e);
    }
  };
  
  // Function to handle using the detected invoice data
  const handleUseInvoiceData = () => {
    if (detectedInvoiceData) {
      // Still call the onSuggestion prop if provided (for backward compatibility)
      if (onSuggestion) {
        onSuggestion(detectedInvoiceData);
      }
      
      toast.success('Invoice data applied to form!');
      clearDetectedInvoiceData(); // Clear after using
      
      // Add confirmation message from assistant
      append({
        role: 'assistant',
        content: 'I\'ve added the invoice data to your form. Please review it and make any necessary adjustments.'
      });
    }
  };
  
  // Handle confirmation from tool UI
  const handleToolConfirm = (confirm: boolean) => {
    // Hide the confirmation UI
    setShowToolUI(false);
    
    if (confirm && extractedInvoiceInfo) {
      // Create a simple invoice data structure from the extracted info
      const simpleInvoiceData = {
        invoiceItems: [{
          name: extractedInvoiceInfo,
          quantity: 1,
          unitPrice: extractMonetaryValue(extractedInvoiceInfo) || "0",
        }],
        // Extract other potential fields based on the input
        sellerInfo: {},
        buyerInfo: {},
      };
      
      // Set the data in the store
      setDetectedInvoiceData(simpleInvoiceData);
      
      // Add confirmation message
      append({
        role: 'assistant',
        content: `I've added "${extractedInvoiceInfo}" to your invoice. You can now see it in the form.`
      });
    } else {
      // User declined, add response to that effect
      append({
        role: 'assistant',
        content: 'No problem. Let me know if you need anything else.'
      });
    }
    
    // Clear the extracted info
    setExtractedInvoiceInfo('');
  };
  
  // Helper function to extract monetary value from text
  const extractMonetaryValue = (text: string): string | null => {
    // Match patterns like $1,234.56 or 1234.56
    const monetaryPattern = /\$?\s*([\d,]+\.?\d*)/;
    const match = text.match(monetaryPattern);
    
    if (match && match[1]) {
      // Remove commas and return the numeric value
      return match[1].replace(/,/g, '');
    }
    
    return null;
  };
  
  // Format currency value
  const formatCurrency = (value: string) => {
    if (!value) return '';
    const numValue = parseFloat(value);
    return !isNaN(numValue) ? 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numValue) : 
      value;
  };
  
  // Render message content based on type
  const renderMessageContent = (message: Message) => {
    if (!message.content && !message.parts) return null;

    // Check if this message contains invoice information
    const hasInvoiceInfo = message.content && (
      message.content.includes("Invoice Number") || 
      message.content.includes("**Invoice Number:**") ||
      message.content.includes("Total:") ||
      message.content.includes("**Total:**")
    );

    // If message has parts, render each part according to its type
    if (message.parts) {
      return message.parts.map((part: any, index) => {
        if (part.type === 'text') {
          // Check if text part contains invoice information
          if (part.text.includes("Invoice Number") || 
              part.text.includes("**Invoice Number:**") ||
              part.text.includes("Total:") ||
              part.text.includes("**Total:**")) {
            return (
              <div key={index} className="invoice-info">
                {renderFormattedInvoiceText(part.text)}
              </div>
            );
          }
          return <div key={index}>{part.text}</div>;
        } else if (part.type === 'tool-invocation') {
          // We don't render tool invocations directly
          return null;
        } else if (part.type === 'reasoning' || part.type === 'source') {
          // Could add special rendering for these types if needed
          return null;
        }
        return null;
      });
    }
    
    // Fallback to content with prettier formatting for invoice info
    return hasInvoiceInfo ? 
      <div className="invoice-info">{renderFormattedInvoiceText(message.content)}</div> : 
      <div>{message.content}</div>;
  };
  
  // Function to format invoice text prettier
  const renderFormattedInvoiceText = (text: string) => {
    // Split the text by lines
    const lines = text.split('\n');
    
    // Extract invoice sections (headers, items, totals)
    let sections: { title: string, content: string[] }[] = [];
    let currentSection: { title: string, content: string[] } = { title: '', content: [] };
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Check if this is a section header (bold text or followed by colon)
      if (trimmedLine.startsWith('**') || trimmedLine.match(/^[A-Za-z\s]+(:|-)/) || 
          trimmedLine === 'Items:' || trimmedLine === 'From:' || trimmedLine === 'To:') {
        // Save previous section if it has content
        if (currentSection.title && currentSection.content.length) {
          sections.push({...currentSection});
        }
        // Start new section
        currentSection = { 
          title: trimmedLine.replace(/\*\*/g, '').replace(/:$/, ''), 
          content: [] 
        };
      } else if (trimmedLine && currentSection.title) {
        // Add content to current section
        currentSection.content.push(trimmedLine);
      }
    });
    
    // Add the last section
    if (currentSection.title && currentSection.content.length) {
      sections.push(currentSection);
    }
    
    // Render the formatted sections
    return (
      <div className="space-y-2 text-sm">
        {sections.map((section, idx) => (
          <div key={idx} className="invoice-section">
            <h4 className="font-semibold text-gray-700 mb-1">{section.title}</h4>
            <div className="pl-2 border-l-2 border-blue-200">
              {section.content.map((line, i) => {
                // Check if this is a price/amount line
                const isPriceLine = line.match(/\$[\d,]+\.\d{2}/) || 
                                   line.match(/Total:/) ||
                                   line.match(/Subtotal:/);
                
                return (
                  <div key={i} className={`${isPriceLine ? 'font-medium' : ''}`}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <>
      <Toaster position="top-right" richColors />
      
      <div className="flex flex-col bg-slate-50 rounded-lg border border-slate-200 h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              
              <div 
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-slate-200'
                }`}
              >
                {renderMessageContent(message)}
                
                {/* Add "Use This Info" button if message contains invoice data */}
                {message.role === 'assistant' && 
                 message.content && 
                 (message.content.includes("Invoice Number") || 
                  message.content.includes("**Invoice Number:**") ||
                  message.content.includes("Total:") ||
                  message.content.includes("**Total:**")) && 
                 detectedInvoiceData && (
                  <div className="mt-3 flex justify-end">
                    <button 
                      onClick={handleUseInvoiceData}
                      className="flex items-center text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Use This Info
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 rounded-md text-red-700 text-sm">
              <p className="font-medium">Error</p>
              <p>{error.message || 'An error occurred'}</p>
            </div>
          )}
          
          {/* Render the confirmation UI when active */}
          {showToolUI && (
            <div className="flex justify-start">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                <h4 className="font-medium mb-2">Confirm Action</h4>
                <p className="text-sm mb-3">
                  {confirmationMessage}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToolConfirm(true)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleToolConfirm(false)}
                    className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-300"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form 
          onSubmit={handleSubmitWithCheck}
          className="border-t border-slate-200 p-4 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type 'add this info to the invoice: $2500 design mockups'"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading || showToolUI}
          />
          <button
            type="submit"
            className={`p-2 rounded-md ${
              isLoading || !input.trim() || showToolUI
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isLoading || !input.trim() || showToolUI}
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        
        {/* Show a button to directly add data if available */}
        {hasInvoiceData && detectedInvoiceData && !showToolUI && (
          <div className="border-t border-slate-200 p-3 bg-blue-50">
            <button
              onClick={handleUseInvoiceData}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <FileText className="h-4 w-4" />
              <span>Add Invoice Data to Form</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}