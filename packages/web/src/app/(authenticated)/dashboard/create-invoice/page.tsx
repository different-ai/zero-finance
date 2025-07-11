'use client';

import React, { useState, useRef } from 'react';
import { InvoiceForm } from '@/components/invoice/invoice-form';
import { Toaster } from 'sonner';
import { ClientDragPrevention } from '@/components/invoice/client-drag-prevention';
import { AuthGuard } from '@/components/auth/auth-guard';
import { RawTextPrefill } from '@/components/invoice/raw-text-prefill';

export default function CreateInvoicePage() {
  // Reference to the invoice form
  const invoiceFormRef = useRef<any>(null);

  return (
    <AuthGuard>
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
            
            {/* Raw Text Prefill - Right Side */}
            <div className="w-[30%] max-w-md overflow-y-auto pb-8 pr-2">
              {/* Spacer on small screens maybe hide? Use responsive classes if needed */}
              <RawTextPrefill />
            </div>
          </div>
        </div>
      </ClientDragPrevention>
    </AuthGuard>
  );
} 