'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '@/trpc/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GmailProcessingToggle() {
  const [keywords, setKeywords] = useState<string>('');
  const [showKeywordInput, setShowKeywordInput] = useState(false);

  const { data: connectionStatus } = api.inbox.checkGmailConnection.useQuery();
  const { data: processingStatus, refetch: refetchStatus } = api.inbox.getGmailProcessingStatus.useQuery();
  
  const toggleMutation = api.inbox.toggleGmailProcessing.useMutation({
    onSuccess: () => {
      refetchStatus();
      setShowKeywordInput(false);
    },
  });

  useEffect(() => {
    if (processingStatus?.keywords) {
      setKeywords(processingStatus.keywords.join(', '));
    }
  }, [processingStatus]);

  const handleToggle = (enabled: boolean) => {
    const keywordArray = showKeywordInput 
      ? keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      : undefined;

    toggleMutation.mutate({ 
      enabled,
      keywords: keywordArray,
    });
  };

  if (!connectionStatus?.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gmail Auto-Processing
          </CardTitle>
          <CardDescription>
            Automatically process new emails containing invoices, bills, and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Gmail must be connected before you can enable auto-processing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Auto-Processing
        </CardTitle>
        <CardDescription>
          Automatically process new emails containing invoices, bills, and payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="gmail-processing" className="text-base">
              Enable Auto-Processing
            </Label>
            <p className="text-sm text-muted-foreground">
              {processingStatus?.isEnabled 
                ? 'New emails matching your keywords will be automatically processed'
                : 'Enable to start processing new emails automatically'}
            </p>
          </div>
          <Switch
            id="gmail-processing"
            checked={processingStatus?.isEnabled ?? false}
            onCheckedChange={handleToggle}
            disabled={toggleMutation.isPending}
          />
        </div>

        {processingStatus?.isEnabled && processingStatus.activatedAt && (
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                Active since {new Date(processingStatus.activatedAt).toLocaleDateString()}
              </span>
            </div>
            
            {processingStatus.lastSyncedAt && (
              <div className="text-sm text-muted-foreground">
                Last synced: {new Date(processingStatus.lastSyncedAt).toLocaleString()}
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">Keywords</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeywordInput(!showKeywordInput)}
                >
                  {showKeywordInput ? 'Cancel' : 'Edit'}
                </Button>
              </div>
              
              {showKeywordInput ? (
                <div className="space-y-2">
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="invoice, bill, payment, receipt"
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleToggle(true)}
                    disabled={toggleMutation.isPending}
                  >
                    {toggleMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Update Keywords
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {processingStatus.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {toggleMutation.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {toggleMutation.error.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 