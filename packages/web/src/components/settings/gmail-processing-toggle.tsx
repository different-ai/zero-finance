'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, AlertCircle, CheckCircle, Plus, X, Info, Settings2, MoreVertical, Edit2, Trash2, GripVertical } from 'lucide-react';
import { api } from '@/trpc/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
// @ts-ignore - sonner toast import issue
import { toast } from 'sonner';

export function GmailProcessingToggle() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  
  // Classification settings state
  const [isClassificationDialogOpen, setIsClassificationDialogOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<string | null>(null);
  const [classificationFormData, setClassificationFormData] = useState({
    name: '',
    prompt: '',
    enabled: true,
  });

  const { data: connectionStatus } = api.inbox.checkGmailConnection.useQuery();
  const { data: processingStatus, refetch: refetchStatus } = api.inbox.getGmailProcessingStatus.useQuery();
  
  // Classification settings queries
  const utils = api.useUtils();
  const { data: classificationSettings, isLoading: isLoadingClassifications } = api.settings.classificationSettings.getUserClassificationSettings.useQuery();
  
  const toggleMutation = api.inbox.toggleGmailProcessing.useMutation({
    onSuccess: () => {
      refetchStatus();
      setIsAddingKeyword(false);
      setNewKeyword('');
    },
  });

  // Classification mutations
  const createClassificationMutation = api.settings.classificationSettings.createClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('Classification prompt created');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
      resetClassificationForm();
      setIsClassificationDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create classification prompt');
    },
  });

  const updateClassificationMutation = api.settings.classificationSettings.updateClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('Classification prompt updated');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
      resetClassificationForm();
      setIsClassificationDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update classification prompt');
    },
  });

  const deleteClassificationMutation = api.settings.classificationSettings.deleteClassificationPrompt.useMutation({
    onSuccess: () => {
      toast.success('Classification prompt deleted');
      utils.settings.classificationSettings.getUserClassificationSettings.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete classification prompt');
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

  // Classification settings functions
  const resetClassificationForm = () => {
    setEditingPrompt(null);
    setClassificationFormData({
      name: '',
      prompt: '',
      enabled: true,
    });
  };

  const handleClassificationSubmit = () => {
    if (!classificationFormData.name.trim() || !classificationFormData.prompt.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingPrompt) {
      updateClassificationMutation.mutate({
        id: editingPrompt,
        ...classificationFormData,
      });
    } else {
      createClassificationMutation.mutate(classificationFormData);
    }
  };

  const handleEditClassification = (setting: any) => {
    setEditingPrompt(setting.id);
    setClassificationFormData({
      name: setting.name,
      prompt: setting.prompt,
      enabled: setting.enabled,
    });
    setIsClassificationDialogOpen(true);
  };

  const handleToggleClassificationEnabled = (id: string, enabled: boolean) => {
    updateClassificationMutation.mutate({
      id,
      enabled,
    });
  };

  const canAddMoreClassifications = (classificationSettings?.length || 0) < 10;

  if (!connectionStatus?.isConnected) {
    return null;
  }

  return (
    <>
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
              
              {/* Keywords Section */}
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
              </div>

              <Separator />

              {/* Classification Settings Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Custom Classification Rules</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add custom rules to classify emails based on your specific needs
                    </p>
                  </div>
                  {canAddMoreClassifications && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        resetClassificationForm();
                        setIsClassificationDialogOpen(true);
                      }}
                      className="h-8"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Rule
                    </Button>
                  )}
                </div>

                {isLoadingClassifications ? (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    Loading classification rules...
                  </div>
                ) : classificationSettings?.length === 0 ? (
                  <div className="border border-dashed rounded-lg p-4 text-center">
                    <Settings2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No custom classification rules yet
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        resetClassificationForm();
                        setIsClassificationDialogOpen(true);
                      }}
                    >
                      Create your first rule
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {classificationSettings?.map((setting: any) => (
                      <Card key={setting.id} className="p-3">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 cursor-move opacity-50" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{setting.name}</h4>
                              <Switch
                                checked={setting.enabled}
                                onCheckedChange={(checked) => handleToggleClassificationEnabled(setting.id, checked)}
                                className="scale-75"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {setting.prompt}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClassification(setting)}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteClassificationMutation.mutate({ id: setting.id })}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {processingStatus.activatedAt && (
                <div className="text-xs text-muted-foreground">
                  Processing emails since: {new Date(processingStatus.activatedAt).toLocaleDateString()}
                </div>
              )}
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

      {/* Classification Dialog */}
      <Dialog open={isClassificationDialogOpen} onOpenChange={(open) => {
        if (!open) resetClassificationForm();
        setIsClassificationDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPrompt ? 'Edit Classification Rule' : 'Create Classification Rule'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="e.g., Vendor Categorization"
                value={classificationFormData.name}
                onChange={(e) => setClassificationFormData({ ...classificationFormData, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Classification Rule</label>
              <Textarea
                placeholder="e.g., If the email is from Amazon, AWS, or mentions Amazon services, classify it as 'Cloud Infrastructure'"
                value={classificationFormData.prompt}
                onChange={(e) => setClassificationFormData({ ...classificationFormData, prompt: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This rule will be added to the AI&apos;s classification logic
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={classificationFormData.enabled}
                onCheckedChange={(checked) => setClassificationFormData({ ...classificationFormData, enabled: checked })}
              />
              <label htmlFor="enabled" className="text-sm font-medium cursor-pointer">
                Enable this rule
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClassificationDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleClassificationSubmit}
              disabled={createClassificationMutation.isPending || updateClassificationMutation.isPending}
            >
              {editingPrompt ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 