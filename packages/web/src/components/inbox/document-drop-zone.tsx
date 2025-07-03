'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, FileImage, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useToast } from '../ui/use-toast';

interface DocumentDropZoneProps {
  onUploadComplete?: () => void;
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'success' | 'error';
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export function DocumentDropZone({ onUploadComplete, className }: DocumentDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processDocumentMutation = api.inbox.processDocument.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast({
          title: "Document processed",
          description: "Your document has been added to the inbox",
        });
        onUploadComplete?.();
      } else {
        // Document was rejected for not being financial
        toast({
          title: "Document not accepted",
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
      return `File "${file.name}" exceeds 10MB limit`;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File "${file.name}" is not a supported format. Please upload PDF or image files.`;
    }
    return null;
  };

  const uploadFile = async (file: File, uploadId: string) => {
    try {
      // Update status to uploading
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadId ? { ...f, status: 'uploading' } : f)
      );

      // Upload to blob storage
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await response.json();

      // Update progress to 50% after upload
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadId ? { ...f, progress: 50, status: 'processing' } : f)
      );

      // Process through AI pipeline
      const result = await processDocumentMutation.mutateAsync({
        fileUrl: url,
        fileName: file.name,
        fileType: file.type,
      });

      if (result.success) {
        // Update to success
        setUploadingFiles(prev => 
          prev.map(f => f.id === uploadId ? { ...f, progress: 100, status: 'success' } : f)
        );

        // Remove from list after 3 seconds
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 3000);
      } else {
        // Document was rejected
        setUploadingFiles(prev => 
          prev.map(f => f.id === uploadId ? { 
            ...f, 
            status: 'error', 
            error: 'Not a financial document' 
          } : f)
        );
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadingFiles(prev => 
        prev.map(f => f.id === uploadId ? { 
          ...f, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f)
      );
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
      });
    }

    if (newFiles.length > 0) {
      setUploadingFiles(prev => [...prev, ...newFiles]);
      
      // Start uploads
      newFiles.forEach(({ id, file }) => {
        uploadFile(file, id);
      });
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  return (
    <div className={cn("w-full", className)}>
      <Card
        className={cn(
          "relative border-2 border-dashed transition-all duration-200",
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
        <div className="p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <motion.div
            animate={{ scale: isDragging ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
            className="mx-auto w-16 h-16 mb-4"
          >
            <div className={cn(
              "w-full h-full rounded-full flex items-center justify-center transition-colors",
              isDragging ? "bg-primary/20" : "bg-gray-100"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragging ? "text-primary" : "text-gray-400"
              )} />
            </div>
          </motion.div>

          <h3 className="text-lg font-semibold mb-2">
            Drop documents here to process
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload invoices, receipts, or bills (PDF, JPG, PNG up to 10MB)
          </p>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Select Files
          </Button>
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
              const Icon = getFileIcon(file.file.type);
              
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
                      "bg-gray-100"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        file.status === 'success' ? "text-green-600" :
                        file.status === 'error' ? "text-red-600" :
                        "text-gray-600"
                      )} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === 'uploading' && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                      {file.status === 'processing' && (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-xs text-muted-foreground">Processing...</span>
                        </div>
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {file.status === 'error' && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600">{file.error}</span>
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
                  
                  {(file.status === 'uploading' || file.status === 'processing') && (
                    <Progress value={file.progress} className="mt-2 h-1" />
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