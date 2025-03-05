'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, Loader2, FileText, ArrowRight, Receipt, ArrowDown } from 'lucide-react';
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
  
  // Track if any tool is currently being called
  const [isToolCalling, setIsToolCalling] = useState(false);
  const [activeToolName, setActiveToolName] = useState<string | null>(null);
  
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
  
  // Track if user has scrolled up manually
  const [userHasScrolledUp, setUserHasScrolledUp] = useState(false);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    // Only scroll to bottom if user hasn't manually scrolled up
    if (!userHasScrolledUp) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Vibrate when a new message is received (if supported)
    if (messages.length > 0 && 'vibrate' in navigator) {
      const lastMessage = messages[messages.length - 1];
      
      // Only vibrate for new assistant messages (not on initial load)
      if (lastMessage.role === 'assistant' && messages.length > 1) {
        navigator.vibrate(50); // Short vibration
      }
    }
    
    // Check for active tool calls
    let foundToolCall = false;
    
    // Only check the last message as that's the one that matters for the current state
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    
    if (lastMessage?.parts) {
      for (const part of lastMessage.parts) {
        if (part.type === 'tool-invocation') {
          const toolCall = part.toolInvocation;
          
          // Track tool states
          if (toolCall.state === 'call') {
            setIsToolCalling(true);
            
            // Access the name from the appropriate property
            // Check if we can determine the tool name from the available properties
            let toolName = '';
            
            if ('name' in toolCall && typeof toolCall.name === 'string') {
              toolName = toolCall.name;
            }
            
            if (toolName === 'screenpipeSearch') {
              setActiveToolName('screenpipeSearch');
              foundToolCall = true;
            } else if (toolName === 'invoiceAnswer') {
              setActiveToolName('invoiceAnswer');
              foundToolCall = true;
            }
          } else if (toolCall.state === 'result') {
            // If the tool has completed, clear its loading state
            let toolName = '';
            
            if ('name' in toolCall && typeof toolCall.name === 'string') {
              toolName = toolCall.name;
            }
            
            if (toolName === activeToolName) {
              setIsToolCalling(false);
              setActiveToolName(null);
            }
          }
        }
      }
    }
    
    // If we didn't find any active tool calls and we're not already loading, reset the state
    if (!foundToolCall && isToolCalling && !isLoading) {
      setIsToolCalling(false);
      setActiveToolName(null);
    }
  }, [messages, isToolCalling, isLoading]);
  
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
  
  // Reference to input element for focus management
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle form submission with special commands
  const handleSubmitWithCheck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vibrate on submit (if supported)
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30, 30]); // Pulse vibration pattern
    }
    
    handleSubmit(e);
    
    // Maintain focus on input after submission
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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
      <div className="flex flex-col nostalgic-container rounded-lg h-full max-h-[calc(100vh-2rem)] overflow-hidden">
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
        
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth relative"
          onScroll={(e) => {
            const target = e.currentTarget;
            const isScrolledToBottom = 
              Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 50;
            
            // If user scrolls up, set the flag
            setUserHasScrolledUp(!isScrolledToBottom);
            
            // If user scrolls back to bottom, reset the flag
            if (isScrolledToBottom) {
              setUserHasScrolledUp(false);
            }
          }}>
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
                      let toolName = '';
                      
                      if ('name' in toolCall && typeof toolCall.name === 'string') {
                        toolName = toolCall.name;
                      } else if ('toolName' in toolCall && typeof toolCall.toolName === 'string') {
                        toolName = toolCall.toolName;
                      }
                      
                      if (toolName === 'invoiceAnswer') {
                        if (toolCall.state === 'call') {
                          // Show loading state for invoice parsing
                          return (
                            <div key={`tool-${partIndex}`} className="mt-1 text-xs">
                              <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 border border-blue-100">
                                <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                                <span className="font-medium text-blue-700">Extracting invoice details...</span>
                              </div>
                            </div>
                          );
                        } else if (toolCall.state === 'result') {
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
                      }
                      
                      if (toolName === 'screenpipeSearch') {
                        if (toolCall.state === 'call') {
                          // Show a meaningful component when screenpipe is actively searching
                          return (
                            <div key={`tool-${partIndex}`} className="mt-1 text-xs">
                              <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
                                <Loader2 className="h-3 w-3 animate-spin text-primary/70" />
                                <span className="font-medium text-primary/80">Scanning screen captures for invoice data...</span>
                              </div>
                            </div>
                          );
                        } else if (toolCall.state === 'result' && toolCall.result && toolCall.result.length > 0) {
                          // When we have results, show what was found (briefly)
                          return (
                            <div key={`tool-${partIndex}`} className="mt-1 mb-2 text-xs">
                              <div className="p-2 rounded-md bg-green-50 border border-green-100">
                                <div className="flex items-center gap-1.5 text-green-700 font-medium mb-1">
                                  <FileText className="h-3 w-3" />
                                  <span>Found {toolCall.result.length} matching document{toolCall.result.length !== 1 ? 's' : ''}</span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        // Default case - don't show anything
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
          
          {/* Only show this loading indicator if we don't already have messages or 
              if the last message is from the user (to avoid duplication) */}
          {isLoading && (!messages.length || messages[messages.length - 1].role === 'user') && (
            <div className="flex justify-start" key="loading-indicator">
              <div className="digital-effect h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2 flex-shrink-0 blue-overlay">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-white border border-primary/10 rounded-lg px-4 py-3 flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary/50" />
                {activeToolName === 'screenpipeSearch' && (
                  <div className="text-sm text-primary/80">
                    <p className="font-medium">Analyzing screen captures</p>
                    <p className="text-xs text-primary/60">Looking for invoice information...</p>
                  </div>
                )}
                {activeToolName === 'invoiceAnswer' && (
                  <div className="text-sm text-primary/80">
                    <p className="font-medium">Processing invoice data</p>
                    <p className="text-xs text-primary/60">Structuring information into usable format...</p>
                  </div>
                )}
                {!activeToolName && (
                  <div className="text-sm text-primary/80">
                    <p className="text-xs">Thinking...</p>
                  </div>
                )}
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
          
          {/* Scroll to bottom button - appears when user has scrolled up */}
          {userHasScrolledUp && (
            <button
              className="absolute bottom-20 right-4 bg-primary/90 text-white rounded-full p-2 shadow-lg hover:bg-primary transition-opacity"
              onClick={() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                setUserHasScrolledUp(false);
                
                // Vibrate for feedback
                if ('vibrate' in navigator) {
                  navigator.vibrate(20);
                }
              }}
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          )}
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
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me to retrieve an invoice..."
            className="flex-1 px-3 py-2 nostalgic-input text-primary focus:outline-none"
            disabled={isLoading}
            autoComplete="off"
            onFocus={(e) => {
              // Move cursor to end of input when focused
              const val = e.target.value;
              e.target.value = '';
              e.target.value = val;
            }}
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
              className="text-white w-full nostalgic-button flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium"
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