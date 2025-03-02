'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  
  // Use the invoice store to access detectedInvoiceData and its state
  const { detectedInvoiceData, hasInvoiceData, clearDetectedInvoiceData } = useInvoiceStore();
  
  // Reference to the invoice form for AI-generated data
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

  // Function to format and apply invoice data to the form
  const applyInvoiceDataToForm = (data: any) => {
    try {
      if (!data) return;
      
      // Format the invoice data for the form
      const formattedData = {
        // Seller info
        sellerBusinessName: data.sellerInfo?.businessName || '',
        sellerEmail: data.sellerInfo?.email || '',
        sellerAddress: data.sellerInfo?.address?.['street-address'] || '',
        sellerCity: data.sellerInfo?.address?.locality || '',
        sellerPostalCode: data.sellerInfo?.address?.['postal-code'] || '',
        sellerCountry: data.sellerInfo?.address?.['country-name'] || '',
        
        // Buyer info
        buyerBusinessName: data.buyerInfo?.businessName || '',
        buyerEmail: data.buyerInfo?.email || '',
        buyerAddress: data.buyerInfo?.address?.['street-address'] || '',
        buyerCity: data.buyerInfo?.address?.locality || '',
        buyerPostalCode: data.buyerInfo?.address?.['postal-code'] || '',
        buyerCountry: data.buyerInfo?.address?.['country-name'] || '',
        
        // Payment details
        network: data.network || 'gnosis',
        currency: data.currency || 'EUR',
        
        // Due date - parse if available, otherwise use default
        dueDate: data.paymentTerms?.dueDate 
          ? new Date(data.paymentTerms.dueDate).toISOString().slice(0, 10)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        
        // Notes and terms
        note: data.note || '',
        terms: data.terms || 'Payment due within 30 days',
      };
      
      // Get invoice items
      const invoiceItems = data.invoiceItems?.map((item: any) => ({
        id: Date.now() + Math.random(), // Generate a random ID for the item
        name: item.name || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || '',
        tax: item.tax?.amount ? parseInt(item.tax.amount, 10) : 0,
      })) || [];
      
      // Update the form with AI-generated data
      if (invoiceFormRef.current) {
        invoiceFormRef.current.updateFormData(formattedData, invoiceItems);
        
        // Show a toast notification
        toast.success('Invoice data applied to form!', {
          description: 'Review the data and make any necessary adjustments before submitting.',
        });
      }
    } catch (error) {
      console.error('Error applying invoice data to form:', error);
      toast.error('Failed to process the invoice data');
    }
  };

  // Watch for changes to detectedInvoiceData from the Zustand store
  useEffect(() => {
    if (detectedInvoiceData && hasInvoiceData) {
      // Apply the data to the form
      applyInvoiceDataToForm(detectedInvoiceData);
      // Clear the data after using it
      clearDetectedInvoiceData();
    }
  }, [detectedInvoiceData, hasInvoiceData, clearDetectedInvoiceData]);

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