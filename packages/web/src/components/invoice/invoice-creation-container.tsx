'use client';

import React, { useState, useRef } from 'react';
import { InvoiceForm } from './invoice-form';
import { InvoiceChatbot } from './invoice-chatbot';
import { Toaster } from 'sonner';
import { useInvoiceStore } from '@/lib/store/invoice-store';
import { DocumentUploadZone } from './document-upload-zone';
import { ClientDragPrevention } from './client-drag-prevention';

export function InvoiceCreationContainer() {
  const [showChatbot, setShowChatbot] = useState(true);
  
  // Reference to the invoice form
  const invoiceFormRef = useRef<any>(null);

  return (
    <ClientDragPrevention>
      <div className="w-full min-h-screen">
        <Toaster richColors />
        
        <div className="flex flex-row gap-4 h-screen">
          {/* Invoice Form - Left Side */}
          <div className="flex-1 overflow-y-auto pb-8 relative">

            
            {/* Form container */}
            <div 
              className="relative"
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {/* Document upload zone for drag-and-drop */}
              {/* <DocumentUploadZone /> */}
              
              {/* Form component */}
              <InvoiceForm ref={invoiceFormRef} />
            </div>
          </div>
          
          {/* Chatbot - Right Side */}
          {showChatbot ? (
            <div className="w-96 flex flex-col sticky top-0 max-h-screen overflow-hidden">
              <div className="mb-2 flex-shrink-0">
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
              <div className="flex-1 min-h-0">
                {/* <InvoiceChatbot /> */}
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
      </div>
    </ClientDragPrevention>
  );
}