'use client';

import React, { useRef, useState } from 'react';
import { Upload, File, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { upload } from '@vercel/blob/client';
import { useInvoiceStore } from '@/lib/store/invoice-store';

interface FileUploadProps {
  onUploadComplete?: (blobUrl: string, filename: string) => void;
  className?: string;
}

export function FileUpload({ onUploadComplete, className = '' }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setDetectedInvoiceData } = useInvoiceStore();

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Process the uploaded file
  const processFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or image file (JPEG, PNG, WebP)');
      return;
    }

    // Show loading state
    setIsUploading(true);

    try {
      // Upload to Vercel Blob
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      // Now that we have the blob URL, extract information from it
      const extractionResponse = await fetch('/api/file-extraction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: blob.url,
          filename: file.name,
        }),
      });

      if (!extractionResponse.ok) {
        throw new Error('Failed to extract data from file');
      }

      const extractionResult = await extractionResponse.json();

      // Try to parse the extracted text as JSON
      try {
        const invoiceData = JSON.parse(extractionResult.extractedText);
        // Store the extracted data in our invoice store
        setDetectedInvoiceData(invoiceData);
        toast.success('Successfully extracted invoice data!');
      } catch (e) {
        // If it's not JSON, store the raw text
        setDetectedInvoiceData({
          additionalNotes: extractionResult.extractedText
        });
        toast.info('Extracted text data, but could not parse structured invoice information.');
      }

      // Notify about upload completion
      if (onUploadComplete) {
        onUploadComplete(blob.url, file.name);
      }
    } catch (error: any) {
      console.error('Error processing file:', error);
      toast.error(error.message || 'Failed to process file');
    } finally {
      setIsUploading(false);
      setIsDragging(false);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    transition-colors duration-200 ease-in-out
                    ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
                    ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Uploading and processing file...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-4">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Upload invoice PDF or image</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, JPEG, PNG, WebP (max 25MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.webp"
            />
          </>
        )}
      </div>
    </div>
  );
}
