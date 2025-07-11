'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, AlertCircle, CheckCircle, Plus, X, Info, Settings2, MoreVertical, Edit, Trash2, GripVertical, Brain, TestTube } from 'lucide-react';
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
  DialogDescription,
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

  // Testing state
  const [testingRuleId, setTestingRuleId] = useState<string | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testEmailContent, setTestEmailContent] = useState('');
  const [testResults, setTestResults] = useState<any>(null);

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

  // Test classification mutation
  const testClassificationMutation = api.inbox.testClassificationRule.useMutation({
    onSuccess: (result: any) => {
      setTestResults(result);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to test classification');
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

  const handleTestRule = (ruleId: string, ruleName: string) => {
    setTestingRuleId(ruleId);
    setTestDialogOpen(true);
    setTestEmailContent('');
    setTestResults(null);
  };

  const runTest = () => {
    if (!testEmailContent.trim() || !testingRuleId) {
      toast.error('Please enter email content to test');
      return;
    }

    const rule = classificationSettings?.find(s => s.id === testingRuleId);
    if (!rule) return;

    testClassificationMutation.mutate({
      emailContent: testEmailContent,
      classificationPrompts: [rule.prompt],
    });
  };

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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">AI Rules</h3>
                    <p className="text-sm text-muted-foreground">
                      Create custom rules to automatically categorize, tag, or pre-approve actions for your emails
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      resetClassificationForm();
                      setIsClassificationDialogOpen(true);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>

                {isLoadingClassifications ? (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    Loading rules...
                  </div>
                ) : !classificationSettings || classificationSettings.length === 0 ? (
                  <Card className="p-6 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">No AI rules yet</p>
                        <p className="text-sm text-muted-foreground">
                          Create rules to automatically process specific types of emails
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          resetClassificationForm();
                          setIsClassificationDialogOpen(true);
                        }}
                        size="sm"
                        className="mt-2"
                      >
                        Create your first rule
                      </Button>
                    </div>
                  </Card>
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
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleTestRule(setting.id, setting.name)}>
                                <TestTube className="h-4 w-4 mr-2" />
                                Test Rule
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClassification(setting)}>
                                <Edit className="h-4 w-4 mr-2" />
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
      <Dialog open={isClassificationDialogOpen} onOpenChange={setIsClassificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingPrompt ? 'Edit AI Rule' : 'Create AI Rule'}
            </DialogTitle>
            <DialogDescription>
              Define a rule that will be applied to incoming emails. You can specify conditions for categorization, tagging, or even auto-approval of actions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rule Name</Label>
              <Input
                id="name"
                placeholder="e.g., Dev Tools Auto-Approve"
                value={classificationFormData.name}
                onChange={(e) => setClassificationFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">Rule Description</Label>
              <Textarea
                id="prompt"
                placeholder="e.g., If the email is a receipt from a developer tool service (GitHub, Vercel, AWS, etc.), automatically categorize it as 'Dev Tools' and mark it as pre-approved for expense tracking."
                value={classificationFormData.prompt}
                onChange={(e) => setClassificationFormData(prev => ({ ...prev, prompt: e.target.value }))}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what emails this rule should match and what actions to take. Mention &quot;auto-approve&quot; or &quot;pre-approve&quot; if you want the AI to automatically execute actions.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={classificationFormData.enabled}
                onCheckedChange={(checked) => setClassificationFormData(prev => ({ ...prev, enabled: checked }))}
              />
              <Label htmlFor="enabled">Enable this rule immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsClassificationDialogOpen(false);
              resetClassificationForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleClassificationSubmit}>
              {editingPrompt ? 'Update Rule' : 'Create Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Test AI Rule</DialogTitle>
            <DialogDescription>
              Paste an email to test if your rule would match and what action would be taken.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test-content">Email Content</Label>
              <Textarea
                id="test-content"
                placeholder="Paste email subject and body here..."
                value={testEmailContent}
                onChange={(e) => setTestEmailContent(e.target.value)}
                rows={6}
              />
            </div>
            
            {testResults && (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-medium text-sm mb-2">Test Results:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Document Type:</span>
                      <Badge variant="outline">{testResults.documentType}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Confidence:</span>
                      <Badge variant={testResults.confidence >= 80 ? "default" : "secondary"}>
                        {testResults.confidence}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Rule Matched:</span>
                      <Badge variant={testResults.triggeredClassifications?.length > 0 ? "default" : "secondary"}>
                        {testResults.triggeredClassifications?.length > 0 ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    {testResults.shouldAutoApprove && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Would be auto-approved</span>
                      </div>
                    )}
                    {testResults.cardTitle && (
                      <div>
                        <span className="text-muted-foreground">Card Title:</span>
                        <p className="mt-1">{testResults.cardTitle}</p>
                      </div>
                    )}
                    {testResults.aiRationale && (
                      <div>
                        <span className="text-muted-foreground">AI Analysis:</span>
                        <p className="mt-1 text-xs">{testResults.aiRationale}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setTestDialogOpen(false);
              setTestResults(null);
              setTestEmailContent('');
            }}>
              Close
            </Button>
            <Button 
              onClick={runTest}
              disabled={testClassificationMutation.isPending}
            >
              {testClassificationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Run Test'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 