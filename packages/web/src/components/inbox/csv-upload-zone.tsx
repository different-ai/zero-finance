'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, X, Loader2, CheckCircle, AlertCircle, FileText, Download, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useToast } from '../ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CSVUploadZoneProps {
  onUploadComplete?: () => void;
  className?: string;
}

type UploadStatus = 
  | 'uploading'     
  | 'parsing'      
  | 'processing'    
  | 'success'       
  | 'error';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  statusText: string;
  error?: string;
  processedCount?: number;
  totalCount?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['text/csv', 'application/vnd.ms-excel'];

const STATUS_CONFIGS: Record<UploadStatus, { text: string; icon: any; progress: number }> = {
  uploading: { text: 'Uploading CSV...', icon: Upload, progress: 25 },
  parsing: { text: 'Parsing data...', icon: Table, progress: 50 },
  processing: { text: 'Processing records...', icon: Loader2, progress: 75 },
  success: { text: 'Import complete!', icon: CheckCircle, progress: 100 },
  error: { text: 'Failed', icon: AlertCircle, progress: 0 },
};

export function CSVUploadZone({ onUploadComplete, className }: CSVUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [showSampleDialog, setShowSampleDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processCSVMutation = api.inbox.processCSV.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "CSV imported successfully",
          description: `${result.processedCount} records imported to your inbox`,
        });
        onUploadComplete?.();
      } else {
        toast({
          title: "CSV import failed",
          description: result.message,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Processing failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds 5MB limit`;
    }
    if (!file.name.endsWith('.csv')) {
      return `File "${file.name}" is not a CSV file`;
    }
    return null;
  };

  const updateFileStatus = (uploadId: string, status: UploadStatus, error?: string, processedCount?: number, totalCount?: number) => {
    setUploadingFiles(prev => 
      prev.map(f => f.id === uploadId ? { 
        ...f, 
        status, 
        statusText: STATUS_CONFIGS[status].text,
        progress: STATUS_CONFIGS[status].progress,
        error: error,
        processedCount,
        totalCount
      } : f)
    );
  };

  const uploadFile = async (file: File, uploadId: string) => {
    try {
      // Phase 1: Upload file
      updateFileStatus(uploadId, 'uploading');
      
      // Read file content
      const content = await file.text();
      
      // Phase 2: Parse CSV
      updateFileStatus(uploadId, 'parsing');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Phase 3: Process records
      updateFileStatus(uploadId, 'processing');
      
      // Process through API
      const result = await processCSVMutation.mutateAsync({
        csvContent: content,
        fileName: file.name,
      });

      if (result.success) {
        updateFileStatus(uploadId, 'success', undefined, result.processedCount, result.totalCount);
        
        // Remove from list after 3 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 3000);
      } else {
        updateFileStatus(uploadId, 'error', result.message);
      }

    } catch (error) {
      console.error('Upload error:', error);
      updateFileStatus(uploadId, 'error', error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadingFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      
      if (error) {
        toast({
          title: "Invalid file",
          description: error,
          variant: "destructive",
        });
        continue;
      }

      const uploadId = `${Date.now()}-${i}`;
      newFiles.push({
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading',
        statusText: STATUS_CONFIGS.uploading.text,
      });
    }

    if (newFiles.length > 0) {
      setUploadingFiles(prev => [...prev, ...newFiles]);
      
      // Start uploads
      newFiles.forEach(({ id, file }) => {
        uploadFile(file, id);
      });
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const downloadSampleCSV = () => {
    const sampleData = `Date,Vendor,Description,Amount,Type
2024-01-15,Acme Corp,Invoice #INV-001,1250.00,invoice
2024-01-16,Office Supplies Inc,Receipt for supplies,89.99,receipt
2024-01-17,Electric Company,Monthly bill,156.78,bill
2024-01-18,Cloud Services Ltd,Subscription payment,49.99,payment
2024-01-19,Freelancer John,Payment confirmation,500.00,payment`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-financial-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Sample CSV downloaded",
      description: "Check your downloads folder for the sample file",
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-200 overflow-hidden",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-gray-300 hover:border-gray-400",
          uploadingFiles.length > 0 && "mb-4"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-4 text-center flex items-center justify-center min-h-[5rem]">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: isDragging ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                isDragging ? "bg-primary/20" : "bg-gray-100"
              )}>
                <FileSpreadsheet className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-primary" : "text-gray-400"
                )} />
              </div>
            </motion.div>

            <div className="text-left flex-1">
              <h3 className="text-sm font-semibold">
                Import from CSV
              </h3>
              <p className="text-xs text-muted-foreground">
                Upload financial data in CSV format
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setShowSampleDialog(true)}
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Format
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <Upload className="h-4 w-4 mr-2" />
                Select CSV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Upload Progress List */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {uploadingFiles.map((file) => {
              const StatusIcon = STATUS_CONFIGS[file.status].icon;
              
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white border rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      file.status === 'success' ? "bg-green-100" :
                      file.status === 'error' ? "bg-red-100" :
                      "bg-blue-50"
                    )}>
                      <FileSpreadsheet className={cn(
                        "h-5 w-5",
                        file.status === 'success' ? "text-green-600" :
                        file.status === 'error' ? "text-red-600" :
                        "text-blue-600"
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status !== 'success' && file.status !== 'error' && (
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn(
                            "h-4 w-4",
                            file.status === 'processing' ? "animate-spin" : "animate-pulse",
                            "text-primary"
                          )} />
                          <span className="text-xs text-muted-foreground min-w-[120px]">
                            {file.statusText}
                          </span>
                        </div>
                      )}
                      
                      {file.status === 'success' && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600">
                            {file.processedCount}/{file.totalCount} imported
                          </span>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600 truncate max-w-32">
                            {file.error}
                          </span>
                        </div>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {file.status !== 'success' && file.status !== 'error' && (
                    <div className="mt-2">
                      <Progress value={file.progress} className="h-1" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Format Dialog */}
      <Dialog open={showSampleDialog} onOpenChange={setShowSampleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>CSV Format Guide</DialogTitle>
            <DialogDescription>
              Your CSV file should include the following columns
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Required Columns:</h4>
              <ul className="space-y-2 text-sm">
                <li><strong>Date</strong> - Transaction date (YYYY-MM-DD format)</li>
                <li><strong>Vendor</strong> - Company or person name</li>
                <li><strong>Description</strong> - Brief description of the transaction</li>
                <li><strong>Amount</strong> - Transaction amount (numeric value)</li>
                <li><strong>Type</strong> - One of: invoice, receipt, bill, payment</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Example:</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`Date,Vendor,Description,Amount,Type
2024-01-15,Acme Corp,Invoice #INV-001,1250.00,invoice
2024-01-16,Office Supplies Inc,Receipt for supplies,89.99,receipt
2024-01-17,Electric Company,Monthly bill,156.78,bill`}
              </pre>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSampleDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  downloadSampleCSV();
                  setShowSampleDialog(false);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}