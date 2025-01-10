'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useSettings } from '@/hooks/use-settings';
import { useMercuryConnection } from '@/hooks/use-mercury-connection';
import { getConfigurationStatus } from '@/lib/auto-pay-settings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AutoPayPage() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { isConnected, isConnecting, testConnection, disconnect } =
    useMercuryConnection();
  const config = getConfigurationStatus(settings);
  const [formData, setFormData] = useState({
    mercuryApiKey: settings?.mercuryApiKey,
    mercuryAccountId: settings?.mercuryAccountId,
  });
  // Show onboarding dialog when no provider is configured
  useEffect(() => {
    if (!config.isAnyConfigured) {
      setShowSettings(true);
    }
  }, [config.isAnyConfigured]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      await updateSettings({
        namespace: 'auto-pay',
        isPartialUpdate: true,
        value: {
          mercuryApiKey: formData.mercuryApiKey,
          mercuryAccountId: formData.mercuryAccountId,
        },
      });

      toast({
        title: 'Settings Saved',
        description: 'Mercury settings have been saved.',
      });

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
    <main className="container max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <ReloadIcon className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>

      </Dialog>
    </main>
  );
}
