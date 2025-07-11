'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2, CheckCircle, AlertCircle, FileImage, File, RotateCcw, Archive, Brain, Search, Tags, Sparkles } from 'lucide-react';
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

type UploadStatus = 
  | 'uploading'     // File being uploaded to blob storage (0-15%)
  | 'analyzing'     // AI analyzing document content (15-35%)
  | 'validating'    // Checking if financial document + confidence (35-50%)
  | 'categorizing'  // Applying user classification rules (50-75%)
  | 'finalizing'    // Adding to your inbox (75-90%)
  | 'archiving'     // Organizing and filing (90-100%)
  | 'success'       // Complete (100%)
  | 'error';        // Failed

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  statusText: string;
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

const STATUS_CONFIGS: Record<UploadStatus, { text: string; icon: any; progress: number }> = {
  uploading: { text: 'Uploading file...', icon: Upload, progress: 15 },
  analyzing: { text: 'AI reading document...', icon: Brain, progress: 35 },
  validating: { text: 'Checking document type...', icon: Search, progress: 50 },
  categorizing: { text: 'Applying smart rules...', icon: Tags, progress: 75 },
  finalizing: { text: 'Adding to your inbox...', icon: FileText, progress: 90 },
  archiving: { text: 'Organizing and filing...', icon: Archive, progress: 100 },
  success: { text: 'Added to inbox!', icon: CheckCircle, progress: 100 },
  error: { text: 'Failed', icon: AlertCircle, progress: 0 },
};

export function DocumentDropZone({ onUploadComplete, className }: DocumentDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processDocumentMutation = api.inbox.processDocument.useMutation({
    onSuccess: (result, variables) => {
      // Find the file being processed
      const fileName = variables.fileName;
      
      if (result.success) {
        // Show success toast with basic info
        toast({
          title: "Document processed successfully",
          description: `${fileName} has been added to your inbox`,
        });
        
        // We'll show more detailed results in the uploadFile function
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

  // We'll fetch card details manually for detailed feedback

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

  const updateFileStatus = (uploadId: string, status: UploadStatus, error?: string) => {
    setUploadingFiles(prev => 
      prev.map(f => f.id === uploadId ? { 
        ...f, 
        status, 
        statusText: STATUS_CONFIGS[status].text,
        progress: STATUS_CONFIGS[status].progress,
        error: error
      } : f)
    );
  };

  const showDetailedResultToasts = (fileName: string) => {
    // Show general processing success toasts with helpful feedback
    
    // Document type recognition toast
    toast({
      title: "🤖 AI Processing Complete",
      description: `${fileName} has been analyzed and categorized`,
    });

    // Delay additional toasts to show them sequentially
    setTimeout(() => {
      toast({
        title: "🏷️ Smart rules applied",
        description: "Classification rules and categories have been checked",
      });
    }, 1000);

    setTimeout(() => {
      toast({
        title: "📋 Ready for review",
        description: "Check your inbox to review and take action",
      });
    }, 2000);
  };

  const uploadFile = async (file: File, uploadId: string) => {
    try {
      // Phase 1: Upload file to blob storage
      updateFileStatus(uploadId, 'uploading');
      
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

      // Phase 2: AI Analysis starting
      updateFileStatus(uploadId, 'analyzing');
      await new Promise(resolve => setTimeout(resolve, 800)); // Slightly longer to read
      
      // Phase 3: Validation (this happens internally in processDocument)
      updateFileStatus(uploadId, 'validating');
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Phase 4: Classification rules
      updateFileStatus(uploadId, 'categorizing');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Phase 5: Finalizing
      updateFileStatus(uploadId, 'finalizing');
      await new Promise(resolve => setTimeout(resolve, 800)); // Make this slower to read

      // Process through AI pipeline
      const result = await processDocumentMutation.mutateAsync({
        fileUrl: url,
        fileName: file.name,
        fileType: file.type,
      });

      if (result.success) {
        // Phase 6: Archiving/organizing
        updateFileStatus(uploadId, 'archiving');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Slower for readability
        
        // Success!
        updateFileStatus(uploadId, 'success');

        // Show detailed result toasts
        setTimeout(() => {
          showDetailedResultToasts(file.name);
        }, 500);

        // Remove from list after 4 seconds (longer to see success message)
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
        }, 4000);
      } else {
        // Document was rejected
        updateFileStatus(uploadId, 'error', result.message || 'Document not accepted');
      }

    } catch (error) {
      console.error('Upload error:', error);
      updateFileStatus(uploadId, 'error', error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const retryUpload = useCallback((uploadId: string) => {
    const fileToRetry = uploadingFiles.find(f => f.id === uploadId);
    if (fileToRetry) {
      uploadFile(fileToRetry.file, uploadId);
    }
  }, [uploadingFiles]);

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
      
      // Clear file input to allow re-uploading same files
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return FileImage;
    if (fileType === 'application/pdf') return FileText;
    return File;
  };

  const getStatusIcon = (status: UploadStatus) => {
    return STATUS_CONFIGS[status].icon;
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
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp"
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
                <Upload className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-primary" : "text-gray-400"
                )} />
              </div>
            </motion.div>

            <div className="text-left flex-1">
              <h3 className="text-sm font-semibold">
                Drop documents here to process
              </h3>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="flex-shrink-0"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Files
            </Button>
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
              const FileIcon = getFileIcon(file.file.type);
              const StatusIcon = getStatusIcon(file.status);
              
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
                      <FileIcon className={cn(
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
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status !== 'success' && file.status !== 'error' && (
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4 animate-pulse text-primary" />
                          <span className="text-xs text-muted-foreground min-w-[120px]">
                            {file.statusText}
                          </span>
                        </div>
                      )}
                      
                      {file.status === 'success' && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-green-600">Added to inbox</span>
                        </div>
                      )}
                      
                      {file.status === 'error' && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-xs text-red-600 truncate max-w-32">
                            {file.error}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => retryUpload(file.id)}
                            title="Retry upload"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
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
    </div>
  );
} 