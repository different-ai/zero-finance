'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, FileSpreadsheet, X, Loader2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useToast } from '../ui/use-toast';
import { processDocument } from '@/lib/document-processor';

interface UnifiedDropzoneProps {
  onUploadComplete?: () => void;
  className?: string;
}

type FileType = 'document' | 'csv';

interface UploadingFile {
  id: string;
  file: File;
  type: FileType;
  progress: number;
  status: 'uploading' | 'parsing' | 'processing' | 'success' | 'error';
  statusText: string;
  error?: string;
  processedCount?: number;
  totalCount?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function UnifiedDropzone({ onUploadComplete, className }: UnifiedDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processCSVMutation = api.inbox.processCSV.useMutation();
  const uploadDocumentMutation = api.inbox.uploadDocument.useMutation();

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

  const detectFileType = (file: File): FileType => {
    if (file.name.endsWith('.csv')) {
      return 'csv';
    }
    return 'document';
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds 5MB limit`;
    }

    const fileType = detectFileType(file);
    if (fileType === 'csv' && !file.name.endsWith('.csv')) {
      return `File "${file.name}" is not a CSV file`;
    }
    
    if (fileType === 'document') {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf'];
      const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!allowedTypes.includes(file.type) && !hasValidExtension) {
        return `File "${file.name}" is not a supported document type (PNG, JPG, PDF)`;
      }
    }

    return null;
  };

  const updateFileStatus = (uploadId: string, status: UploadingFile['status'], error?: string, processedCount?: number, totalCount?: number) => {
    setUploadingFiles(prev => 
      prev.map(f => f.id === uploadId ? { 
        ...f, 
        status, 
        statusText: getStatusText(status, f.type),
        progress: getProgressForStatus(status),
        error,
        processedCount,
        totalCount
      } : f)
    );
  };

  const getStatusText = (status: UploadingFile['status'], type: FileType): string => {
    const texts = {
      uploading: type === 'csv' ? 'Uploading CSV...' : 'Uploading document...',
      parsing: type === 'csv' ? 'Parsing data...' : 'Reading document...',
      processing: type === 'csv' ? 'Processing records...' : 'Extracting information...',
      success: type === 'csv' ? 'Import complete!' : 'Document processed!',
      error: 'Failed'
    };
    return texts[status];
  };

  const getProgressForStatus = (status: UploadingFile['status']): number => {
    const progress = {
      uploading: 25,
      parsing: 50,
      processing: 75,
      success: 100,
      error: 0
    };
    return progress[status];
  };

  const uploadFile = async (file: File, uploadId: string, type: FileType) => {
    try {
      updateFileStatus(uploadId, 'uploading');
      
      if (type === 'csv') {
        // Handle CSV upload
        const content = await file.text();
        updateFileStatus(uploadId, 'parsing');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        updateFileStatus(uploadId, 'processing');
        const result = await processCSVMutation.mutateAsync({
          csvContent: content,
          fileName: file.name,
        });

        if (result.success) {
          updateFileStatus(uploadId, 'success', undefined, result.processedCount, result.totalCount);
          toast({
            title: "CSV imported successfully",
            description: `${result.processedCount} records imported to your inbox`,
          });
        } else {
          updateFileStatus(uploadId, 'error', result.message);
          toast({
            title: "CSV import failed",
            description: result.message,
            variant: "destructive",
          });
        }
      } else {
        // Handle document upload
        updateFileStatus(uploadId, 'parsing');
        const processedDoc = await processDocument(file);
        
        updateFileStatus(uploadId, 'processing');
        const result = await uploadDocumentMutation.mutateAsync({
          document: processedDoc,
          fileName: file.name,
        });

        if (result.success) {
          updateFileStatus(uploadId, 'success');
          toast({
            title: "Document processed",
            description: "Financial information extracted successfully",
          });
        } else {
          updateFileStatus(uploadId, 'error', result.message);
          toast({
            title: "Processing failed",
            description: result.message,
            variant: "destructive",
          });
        }
      }

      // Remove from list after 3 seconds on success
      if (uploadingFiles.find(f => f.id === uploadId)?.status === 'success') {
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 3000);
      }

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      updateFileStatus(uploadId, 'error', error instanceof Error ? error.message : 'Upload failed');
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
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

      const fileType = detectFileType(file);
      const uploadId = `${Date.now()}-${i}`;
      
      newFiles.push({
        id: uploadId,
        file,
        type: fileType,
        progress: 0,
        status: 'uploading',
        statusText: getStatusText('uploading', fileType),
      });
    }

    if (newFiles.length > 0) {
      setUploadingFiles(prev => [...prev, ...newFiles]);
      
      // Start uploads
      newFiles.forEach(({ id, file, type }) => {
        uploadFile(file, id, type);
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

  return (
    <div className={cn("w-full", className)}>
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-200 overflow-hidden cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-gray-300 hover:border-gray-400",
          uploadingFiles.length > 0 && "mb-4"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.png,.jpg,.jpeg,.pdf,image/*,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
          >
            <Plus className={cn(
              "h-8 w-8 transition-colors",
              isDragging ? "text-primary" : "text-gray-400"
            )} />
          </motion.div>

          <h3 className="text-lg font-semibold mb-2">
            Drop files here to process
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload invoices, receipts, bills (PNG, JPG, PDF) or CSV files
          </p>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>CSV Files</span>
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
              const Icon = file.type === 'csv' ? FileSpreadsheet : FileText;
              const StatusIcon = file.status === 'processing' ? Loader2 : 
                               file.status === 'success' ? CheckCircle :
                               file.status === 'error' ? AlertCircle : Upload;
              
              return (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-gray-900 border rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      file.status === 'success' ? "bg-green-100 dark:bg-green-900/20" :
                      file.status === 'error' ? "bg-red-100 dark:bg-red-900/20" :
                      "bg-blue-50 dark:bg-blue-900/20"
                    )}>
                      <Icon className={cn(
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
                      <StatusIcon className={cn(
                        "h-4 w-4",
                        file.status === 'processing' && "animate-spin",
                        file.status === 'success' ? "text-green-600" :
                        file.status === 'error' ? "text-red-600" :
                        "text-primary"
                      )} />
                      
                      <span className="text-xs text-muted-foreground min-w-[120px]">
                        {file.statusText}
                      </span>
                      
                      {file.status === 'success' && file.type === 'csv' && (
                        <span className="text-xs text-green-600">
                          {file.processedCount}/{file.totalCount} imported
                        </span>
                      )}
                      
                      {file.status === 'error' && (
                        <span className="text-xs text-red-600 truncate max-w-32">
                          {file.error}
                        </span>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
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
    </div>
  );
}