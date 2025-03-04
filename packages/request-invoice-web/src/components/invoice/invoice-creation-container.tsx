'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { InvoiceForm } from './invoice-form';
import { InvoiceChatbot } from './invoice-chatbot';
import { toast, Toaster } from 'sonner';
import { useInvoiceStore } from '@/lib/store/invoice-store';

export function InvoiceCreationContainer() {
  const router = useRouter();
  const [showChatbot, setShowChatbot] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [successData, setSuccessData] = useState<{ 
    url: string, 
    requestId: string 
  } | null>(null);
  
  // Reference to the invoice form
  const invoiceFormRef = useRef<any>(null);

  // Function to handle invoice submission
  const handleInvoiceSubmit = async (invoiceData: any) => {
    try {
      setIsCreating(true);
      
      // Call API to create the invoice
      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create invoice');
      }
      
      // Set success data with URL and request ID
      setSuccessData({
        url: result.url,
        requestId: result.requestId
      });
      
      toast.success('Invoice created successfully!');
      
      // Redirect to the invoices list after a short delay
      setTimeout(() => {
        router.push('/dashboard/invoices');
      }, 5000);
      
    } catch (error) {
      console.error('Failed to create invoice:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create invoice');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <Toaster richColors />
      
      {successData ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Invoice Created Successfully!</h3>
          <p className="mb-4">Your invoice has been created and can be shared with your client.</p>
          
          <div className="bg-white p-4 rounded border mb-4">
            <p className="font-medium">Invoice URL:</p>
            <div className="flex items-center mt-2">
              <input 
                type="text" 
                readOnly 
                value={successData.url} 
                className="flex-1 p-2 border rounded text-sm font-mono"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(successData.url);
                  toast.success('URL copied to clipboard!');
                }}
                className="ml-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            You will be redirected to your invoices in a few seconds...
          </p>
        </div>
      ) : (
        <div className="flex flex-row gap-4 h-screen">
          {/* Invoice Form - Left Side */}
          <div className="flex-1 overflow-y-auto pb-8">
            <InvoiceForm 
              ref={invoiceFormRef}
              onSubmit={handleInvoiceSubmit}
              isSubmitting={isCreating}
            />
          </div>
          
          {/* Chatbot - Right Side */}
          {showChatbot ? (
            <div className="w-96 h-screen flex flex-col sticky top-0">
              <div className="mb-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">AI Invoice Assistant</h3>
                  <div className="flex space-x-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Quick Add
                    </span>
                    <button
                      onClick={() => setShowChatbot(false)}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <InvoiceChatbot />
              </div>
            </div>
          ) : (
            <div className="self-start">
              <button
                onClick={() => setShowChatbot(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Show AI Assistant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}