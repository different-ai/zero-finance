'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GmailConnectionBannerProps {
  onConnect?: () => void;
  className?: string;
  isConnected?: boolean;
  isProcessingEnabled?: boolean;
}

export function GmailConnectionBanner({ 
  onConnect, 
  className,
  isConnected = false,
  isProcessingEnabled = false
}: GmailConnectionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isConnected || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative overflow-hidden",
          className
        )}
      >
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border-b border-blue-200/50 dark:border-blue-800/50">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-pulse" />
          </div>
          
          <div className="relative px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-sm">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Connect Gmail for automatic processing
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    AI will scan your emails for invoices, bills, and receipts automatically
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pl-11 sm:pl-0">
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Shield className="h-3 w-3" />
                  <span>Secure OAuth</span>
                </div>
                
                <Button
                  onClick={onConnect}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Connect Gmail
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
                
                <Button
                  onClick={() => setIsDismissed(true)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function AIProcessingBanner({ 
  onEnableProcessing, 
  className,
  isEnabled = false
}: {
  onEnableProcessing?: () => void;
  className?: string;
  isEnabled?: boolean;
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isEnabled || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative overflow-hidden",
          className
        )}
      >
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/20 border-b border-amber-200/50 dark:border-amber-800/50">
          <div className="relative px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-white/80 dark:bg-gray-900/80 rounded-lg shadow-sm">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    AI Processing is disabled
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Enable AI to automatically detect and process financial documents from your emails
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pl-11 sm:pl-0">
                <Button
                  onClick={onEnableProcessing}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  Enable AI Processing
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
                
                <Button
                  onClick={() => setIsDismissed(true)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}