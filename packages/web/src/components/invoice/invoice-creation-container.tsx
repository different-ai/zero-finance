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
          

        </div>
      </div>
    </ClientDragPrevention>
  );
}