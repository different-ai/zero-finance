'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, AlertCircle, CheckCircle, Plus, X, Info } from 'lucide-react';
import { api } from '@/trpc/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function GmailProcessingToggle() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);

  const { data: connectionStatus } = api.inbox.checkGmailConnection.useQuery();
  const { data: processingStatus, refetch: refetchStatus } = api.inbox.getGmailProcessingStatus.useQuery();
  
  const toggleMutation = api.inbox.toggleGmailProcessing.useMutation({
    onSuccess: () => {
      refetchStatus();
      setIsAddingKeyword(false);
      setNewKeyword('');
    },
  });

  useEffect(() => {
    if (processingStatus?.keywords) {
      setKeywords(processingStatus.keywords);
    }
  }, [processingStatus]);

  const handleToggle = (enabled: boolean) => {
    toggleMutation.mutate({ 
      enabled,
      keywords: keywords.length > 0 ? keywords : undefined,
    });
  };

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim().toLowerCase();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      const updatedKeywords = [...keywords, trimmedKeyword];
      setKeywords(updatedKeywords);
      toggleMutation.mutate({
        enabled: processingStatus?.isEnabled || false,
        keywords: updatedKeywords,
      });
      setNewKeyword('');
      setIsAddingKeyword(false);
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    // Don't allow removing all keywords
    if (keywords.length <= 1) {
      return;
    }
    
    const updatedKeywords = keywords.filter(k => k !== keywordToRemove);
    setKeywords(updatedKeywords);
    toggleMutation.mutate({
      enabled: processingStatus?.isEnabled || false,
      keywords: updatedKeywords,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    } else if (e.key === 'Escape') {
      setIsAddingKeyword(false);
      setNewKeyword('');
    }
  };

  if (!connectionStatus?.isConnected) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>AI Email Processing</CardTitle>
            <CardDescription>
              Automatically scan and process emails containing specific keywords
            </CardDescription>
          </div>
          <Switch
            checked={processingStatus?.isEnabled || false}
            onCheckedChange={handleToggle}
            disabled={toggleMutation.isPending}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {toggleMutation.isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating settings...
          </div>
        )}
        
        {processingStatus?.isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                AI processing is active. Emails are automatically scanned every 5 minutes.
                {processingStatus.lastSyncedAt && (
                  <span className="block mt-1">
                    Last synced: {new Date(processingStatus.lastSyncedAt).toLocaleString()}
                  </span>
                )}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base">Filter Keywords</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingKeyword(true)}
                  disabled={isAddingKeyword}
                  className="h-8"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Keyword
                </Button>
              </div>
              
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Only emails containing at least one of these keywords will be processed. 
                  You must have at least one keyword.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <AnimatePresence mode="popLayout">
                  {keywords.map((keyword) => (
                    <motion.div
                      key={keyword}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="pl-3 pr-1 py-1.5 flex items-center gap-1.5"
                      >
                        <span>{keyword}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleRemoveKeyword(keyword)}
                          disabled={keywords.length <= 1}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                  
                  {isAddingKeyword && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter keyword"
                        className="h-8 w-32 text-sm"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={handleAddKeyword}
                        disabled={!newKeyword.trim()}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setIsAddingKeyword(false);
                          setNewKeyword('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {processingStatus.activatedAt && (
                <div className="text-xs text-muted-foreground">
                  Processing emails since: {new Date(processingStatus.activatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {!processingStatus?.isEnabled && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Enable AI processing to automatically scan your Gmail for invoices, bills, and receipts.
              Only emails matching your keywords will be processed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 