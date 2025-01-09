'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from '@/components/ui/use-toast';
import { CheckCircledIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import type { PaymentMethod } from '@/types/payment';
import { useSettings } from '@/hooks/use-settings';
import { getConfigurationStatus } from '@/lib/auto-pay-settings';

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentMethod>('wise');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings } = useSettings();
  const config = getConfigurationStatus(settings);
  const [formData, setFormData] = useState({
    wiseApiKey: '',
    wiseProfileId: '',
    mercuryApiKey: '',
    mercuryAccountId: '',
  });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const settings = selectedProvider === 'wise'
        ? {
            wiseApiKey: formData.wiseApiKey,
            wiseProfileId: formData.wiseProfileId,
          }
        : {
            mercuryApiKey: formData.mercuryApiKey,
            mercuryAccountId: formData.mercuryAccountId,
          };

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namespace: 'auto-pay',
          isPartialUpdate: true,
          value: settings,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast({
        title: 'Settings Saved',
        description: `${selectedProvider === 'wise' ? 'Wise' : 'Mercury'} has been configured successfully.`,
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Provider Settings</DialogTitle>
          <DialogDescription>
            Configure your payment providers and view their status.
          </DialogDescription>
        </DialogHeader>

        {/* Configuration Status */}
        <div className="space-y-4 border rounded-lg p-4 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Wise</h3>
              {config.wise.isConfigured ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircledIcon className="mr-1 h-3 w-3" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
                  Not Configured
                </Badge>
              )}
            </div>
            {config.wise.missing.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Missing: {config.wise.missing.join(', ')}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">Mercury</h3>
              {config.mercury.isConfigured ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircledIcon className="mr-1 h-3 w-3" />
                  Configured
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
                  Not Configured
                </Badge>
              )}
            </div>
            {config.mercury.missing.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Missing: {config.mercury.missing.join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <ToggleGroup
              type="single"
              value={selectedProvider}
              onValueChange={(value: PaymentMethod) => setSelectedProvider(value)}
            >
              <ToggleGroupItem value="wise">Wise</ToggleGroupItem>
              <ToggleGroupItem value="mercury">Mercury</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {selectedProvider === 'wise' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wiseApiKey">Wise API Key</Label>
                <Input
                  id="wiseApiKey"
                  value={formData.wiseApiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wiseApiKey: e.target.value,
                    }))
                  }
                  placeholder="Enter your Wise API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wiseProfileId">Wise Profile ID</Label>
                <Input
                  id="wiseProfileId"
                  value={formData.wiseProfileId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      wiseProfileId: e.target.value,
                    }))
                  }
                  placeholder="Enter your Wise profile ID"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mercuryApiKey">Mercury API Key</Label>
                <Input
                  id="mercuryApiKey"
                  value={formData.mercuryApiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mercuryApiKey: e.target.value,
                    }))
                  }
                  placeholder="Enter your Mercury API key"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mercuryAccountId">Mercury Account ID</Label>
                <Input
                  id="mercuryAccountId"
                  value={formData.mercuryAccountId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mercuryAccountId: e.target.value,
                    }))
                  }
                  placeholder="Enter your Mercury account ID"
                />
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 