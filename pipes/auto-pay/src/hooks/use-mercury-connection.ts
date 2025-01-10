import { useState, useCallback } from 'react';
import { useSettings } from './use-settings';
import { toast } from '@/components/ui/use-toast';

interface MercuryConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  accountId: string | null;
  testConnection: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export function useMercuryConnection(): MercuryConnectionState {
  const { settings, updateSettings } = useSettings();
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = Boolean(
    settings?.customSettings?.['auto-pay']?.mercuryApiKey &&
    settings?.customSettings?.['auto-pay']?.mercuryAccountId
  );

  const accountId = settings?.customSettings?.['auto-pay']?.mercuryAccountId || null;

  const testConnection = useCallback(async () => {
    if (!settings?.customSettings?.['auto-pay']?.mercuryApiKey) {
      toast({
        title: "Missing API Key",
        description: "Please enter your Mercury API key first.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Test connection using server endpoint
      const response = await fetch('/api/mercury/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: settings.customSettings['auto-pay'].mercuryApiKey,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect to Mercury');
      }

      const { accountId } = await response.json();

      // Update settings with account ID
      await updateSettings({
        namespace: 'auto-pay',
        isPartialUpdate: true,
        value: {
          mercuryAccountId: accountId,
        },
      });

      toast({
        title: "Connected to Mercury",
        description: "Successfully connected to your Mercury account.",
      });
    } catch (error) {
      console.error('Mercury connection error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to Mercury.",
        variant: "destructive"
      });

      // Clear settings on failure
      await updateSettings({
        namespace: 'auto-pay',
        isPartialUpdate: true,
        value: {
          mercuryApiKey: '',
          mercuryAccountId: '',
        },
      });
    } finally {
      setIsConnecting(false);
    }
  }, [settings, updateSettings]);

  const disconnect = useCallback(async () => {
    await updateSettings({
      namespace: 'auto-pay',
      isPartialUpdate: true,
      value: {
        mercuryApiKey: '',
        mercuryAccountId: '',
      },
    });

    toast({
      title: "Disconnected from Mercury",
      description: "Your Mercury account has been disconnected.",
    });
  }, [updateSettings]);

  return {
    isConnected,
    isConnecting,
    accountId,
    testConnection,
    disconnect,
  };
} 