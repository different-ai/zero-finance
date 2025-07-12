'use client';

import React, { useState, useRef } from 'react';
import { SimplifiedInvoiceForm } from '@/components/invoice/simplified-invoice-form';
import { Toaster } from 'sonner';
import { ClientDragPrevention } from '@/components/invoice/client-drag-prevention';
import { AuthGuard } from '@/components/auth/auth-guard';
import { RawTextPrefill } from '@/components/invoice/raw-text-prefill';

export default function CreateInvoicePage() {
  const [extractedData, setExtractedData] = useState<any>(null);

  return (
    <AuthGuard>
      <ClientDragPrevention>
        <div className="w-full min-h-screen">
          <Toaster richColors />
          
          <div className="p-4 flex flex-row gap-4 h-screen">
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
                {/* Simplified Form component */}
                <SimplifiedInvoiceForm extractedData={extractedData} />
              </div>
            </div>
            
            {/* Raw Text Prefill - Right Side */}
            <div className="w-[30%] max-w-md overflow-y-auto pb-8 pr-2">
              <RawTextPrefill onExtractedData={setExtractedData} />
            </div>
          </div>
        </div>
      </ClientDragPrevention>
    </AuthGuard>
  );
} 