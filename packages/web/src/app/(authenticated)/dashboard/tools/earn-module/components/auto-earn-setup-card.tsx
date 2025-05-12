'use client';

import { useState, useEffect } from 'react';
import { type Address } from 'viem';
import { toast } from 'sonner';
import { api } from '@/trpc/react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';

interface AutoEarnSetupCardProps {
  safeAddress?: Address;
}

export function AutoEarnSetupCard({ safeAddress }: AutoEarnSetupCardProps) {
  const [isAutoEarnEnabled, setIsAutoEarnEnabled] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<number>(50); // Default to 50%
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Check if auto-earn is already configured
  const { data: configData, isLoading: isLoadingConfig, refetch: refetchConfig } = api.earn.getAutoEarnConfig.useQuery(
    { safeAddress: safeAddress! },
    {
      enabled: !!safeAddress,
    }
  );

  // Use an effect to update local state when config data changes
  useEffect(() => {
    if (configData) {
      // If pct > 0, auto-earn is enabled
      setIsAutoEarnEnabled(configData.pct > 0);
      if (configData.pct > 0) {
        setPercentage(configData.pct);
      }
    }
  }, [configData]);

  // Mutation to set auto-earn percentage
  const setAutoEarnMutation = api.earn.setAutoEarnPct.useMutation({
    onSuccess: () => {
      toast.success('Auto-earn settings saved successfully');
      setIsSubmitting(false);
      refetchConfig(); // Refresh config data after successful update
    },
    onError: (error) => {
      toast.error(`Failed to save auto-earn settings: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Mutation to disable auto-earn
  const disableAutoEarnMutation = api.earn.disableAutoEarn.useMutation({
    onSuccess: () => {
      toast.success('Auto-earn has been disabled');
      setIsSubmitting(false);
      refetchConfig(); // Refresh config data after successful disable
    },
    onError: (error) => {
      toast.error(`Failed to disable auto-earn: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleSave = async () => {
    if (!safeAddress) {
      toast.error('No safe address detected');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isAutoEarnEnabled) {
        // Save with the selected percentage
        await setAutoEarnMutation.mutateAsync({
          safeAddress,
          pct: percentage,
        });
      } else {
        // If turning off, use the dedicated disable endpoint
        await disableAutoEarnMutation.mutateAsync({
          safeAddress,
        });
      }
    } catch (error) {
      console.error('Error saving auto-earn settings:', error);
      setIsSubmitting(false);
    }
  };

  if (!safeAddress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-500">
            No primary safe detected or selected.
          </p>
          <CardDescription className="text-xs text-gray-500 mt-2">
            Please ensure a primary safe is active to use this feature.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Auto-Earn Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-1/3" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Earn Settings</CardTitle>
        <CardDescription>
          Configure how much of your USDC should automatically move to Seamless vault to earn yield
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <RadioGroup
            value={isAutoEarnEnabled ? 'enabled' : 'disabled'}
            onValueChange={(value) => setIsAutoEarnEnabled(value === 'enabled')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="enabled" id="enabled" />
              <Label htmlFor="enabled">Earn yield automatically</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="disabled" id="disabled" />
              <Label htmlFor="disabled">Keep all funds in my safe</Label>
            </div>
          </RadioGroup>
        </div>

        {isAutoEarnEnabled && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="percentage" className="block mb-2">
                Move this % of every incoming USDC to the vault
              </Label>
              <div className="flex items-center space-x-4">
                <Slider
                  id="percentage"
                  min={1}
                  max={100}
                  step={1}
                  value={[percentage]}
                  onValueChange={(values) => setPercentage(values[0])}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
} 