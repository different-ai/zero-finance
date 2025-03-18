'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { FileUp, FileText, Loader2, Check, X } from 'lucide-react';
import { useInvoiceStore, InvoiceData } from '@/lib/store/invoice-store';

interface DocumentUploadZoneProps {
  isStandalone?: boolean;
}

export function DocumentUploadZone({ isStandalone = false }: DocumentUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const { setDetectedInvoiceData } = useInvoiceStore();

  // Prevent default browser behavior for the whole document
  useEffect(() => {
    if (isStandalone) return;
    
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    
    // Add global event handlers
    window.addEventListener('dragover', preventDefaults, false);
    window.addEventListener('drop', preventDefaults, false);
    
    return () => {
      window.removeEventListener('dragover', preventDefaults);
      window.removeEventListener('drop', preventDefaults);
    };
  }, [isStandalone]);
  
  // Handle file processing
  const processFile = async (file: File) => {
    // Check if file is PDF, image, or document
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    // Special handling for PDFs which might have various mime types
    const isPDF = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
    
    if (!validTypes.includes(file.type) && !isPDF) {
      toast.error('Please upload a PDF, image, or document file.');
      return;
    }
    
    // Check file size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('File size exceeds 25MB limit.');
      return;
    }
    
    setIsDragging(false);
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/file-extraction', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = 'Failed to extract data from file';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // Error parsing response
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.success && data.invoiceData) {
        setExtractedData(data.invoiceData);
        setShowConfirmation(true);
        toast.success('Successfully extracted invoice data');
      } else {
        throw new Error('No invoice data found in the document');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Apply extracted data to form
  const applyExtractedData = () => {
    if (extractedData) {
      setDetectedInvoiceData(extractedData);
      toast.success('Applied data to invoice form');
      setShowConfirmation(false);
      setExtractedData(null);
    }
  };
  
  // Cancel and discard the extracted data
  const cancelExtractedData = () => {
    setShowConfirmation(false);
    setExtractedData(null);
    toast.info('Document data discarded');
  };
  
  // Handle click to upload
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };
  
  // Format the confirmation dialog data for better readability
  const formatDataPreview = () => {
    if (!extractedData) return null;
    
    const data = extractedData;
    const buyerInfo = data.buyerInfo || {};
    
    // Format due date safely
    let dueDate = 'Not specified';
    if (data.dueDate) {
      dueDate = new Date(data.dueDate).toLocaleDateString();
    } else if (data.paymentTerms) {
      if (typeof data.paymentTerms === 'string') {
        dueDate = data.paymentTerms;
      } else if (data.paymentTerms.dueDate) {
        dueDate = new Date(data.paymentTerms.dueDate).toLocaleDateString();
      }
    }
    
    // Format amount with currency
    const amount = data.amount || data.totalAmount || data.total;
    const currency = data.currency || 'EURe';
    const formattedAmount = amount ? 
      `${amount} ${currency}` : 
      'Not specified';
    
    return (
      <div className="text-sm">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2">
          <div className="col-span-1 font-medium text-base text-blue-600 mb-1">
            Buyer Information
          </div>
          <div>
            <span className="font-medium">Business: </span>
            {buyerInfo.businessName || data.toName || '—'}
          </div>
          <div>
            <span className="font-medium">Email: </span>
            {buyerInfo.email || data.toEmail || '—'}
          </div>
          
          <div className="col-span-1 font-medium text-base text-blue-600 mt-3 mb-1">
            Payment Information
          </div>
          <div>
            <span className="font-medium">Amount: </span>
            {formattedAmount}
          </div>
          <div>
            <span className="font-medium">Due Date: </span>
            {dueDate}
          </div>
          
          {data.invoiceItems && data.invoiceItems.length > 0 && (
            <div className="mt-1">
              <span className="font-medium">{data.invoiceItems.length} line items detected</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Component for the drag/drop overlay that appears when dragging
  const DragOverlay = () => (
    <div 
      className={`absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed 
                border-blue-500 rounded-lg flex items-center justify-center z-10
                ${isDragging ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="text-center p-4 rounded-lg bg-white shadow-lg">
        <FileUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
        <p className="text-blue-600 font-medium">Drop to extract invoice data</p>
      </div>
    </div>
  );
  
  // Data preview component with Apply/Cancel buttons
  const DataPreview = () => {
    if (!showConfirmation || !extractedData) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 overflow-hidden">
          <div className="p-5 bg-blue-50 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-800">
              <FileText className="inline-block mr-2 h-5 w-5" />
              Invoice Data Detected
            </h3>
            <button
              onClick={cancelExtractedData}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-5">
            <p className="mb-4 text-gray-600">
              We've detected the following information from your invoice.
              <span className="block mt-1 text-sm">
                You can apply this data to your form or make manual adjustments later.
              </span>
            </p>
            
            {formatDataPreview()}
          </div>
          
          <div className="p-3 border-t bg-gray-50 flex justify-end space-x-2">
            <button
              onClick={cancelExtractedData}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={applyExtractedData}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Apply to Form
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${isStandalone ? '' : 'mb-8'}`}>
      {/* Main drop zone */}
      <div
        ref={dropZoneRef}
        className={`
          relative border-2 border-dashed rounded-lg p-6 
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'} 
          transition-colors duration-150 ease-in-out
        `}
        onDragEnter={() => setIsDragging(true)}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
          }
        }}
        onClick={openFileDialog}
      >
        <DragOverlay />
        
        <div className="text-center">
          {isProcessing ? (
            <div className="py-4">
              <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
              <p className="text-gray-600">Extracting invoice data...</p>
            </div>
          ) : (
            <>
              <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                Upload any images or documents that contain invoice data and we will prefill the form.
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Supported formats: PDF, Images, Word, Text
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Select Invoice
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </div>
      
      {/* Add note about manual entry option */}
      <div className="mt-3 text-center text-sm text-gray-600">
        <p>You can also manually fill in the invoice form fields below.</p>
        <p className="mt-1">
          <span className="font-medium">Pro tip:</span> Upload an invoice to auto-fill the form first, then make any adjustments as needed.
        </p>
      </div>
      
      {/* Confirmation dialog */}
      <DataPreview />
    </div>
  );
}
