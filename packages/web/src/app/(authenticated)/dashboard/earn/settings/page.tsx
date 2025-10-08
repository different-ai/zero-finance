'use client';

import { api } from '@/trpc/react';
import { Slider } from '@/components/ui/slider'; // Corrected import
import { useRouter } from 'next/navigation';
import FullScreenSpinner from '../full-screen-spinner';
import ErrorView from '../error-view';
import Link from 'next/link';
import { useState } from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useUserSafes } from '@/hooks/use-user-safes';
import { EnableSafeModuleButton } from '../../tools/earn-module/components/enable-safe-module-button';
import { InstallConfigButton } from '../../tools/earn-module/components/install-config-button';

export default function EarnSettingsPage() {
  // Renamed to avoid conflict if exported as EarnSettings
  const router = useRouter();
  const { data } = useUserSafes();
  const safeAddress = data?.[0]?.safeAddress as `0x${string}` | undefined;
  const safeId = safeAddress?.toString();

  const {
    data: state,
    isLoading,
    error,
    refetch,
  } = api.earn.getState.useQuery(
    {
      safeAddress: safeId!,
    },
    {
      enabled: !!safeId,
    },
  );

  const setAlloc = api.earn.setAllocation.useMutation({
    onSuccess: () => {
      refetch(); // Refetch state to show updated allocation
      // Optionally, show a success toast
    },
    onError: (error) => {
      console.error('Failed to set allocation:', error);
      // Optionally, show an error toast
    },
  });

  const disable = api.earn.disableAutoEarn.useMutation({
    onSuccess: () => {
      router.refresh(); // This should trigger EarnPage to re-evaluate and show Stepper
      // router.push('/dashboard/earn'); // Alternative: force navigation to ensure EarnPage re-renders correctly
    },
    onError: (error) => {
      console.error('Failed to disable module:', error);
      // Optionally, show an error toast
    },
  });

  const [sliderValue, setSliderValue] = useState(() =>
    state ? [state.allocation] : [0],
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  if (isLoading || !safeId) return <FullScreenSpinner />;
  if (error)
    return <ErrorView msg={`Could not load earn settings: ${error.message}`} />;
  if (!state)
    return <ErrorView msg="Could not load earn settings (no data)." />;

  // If module is not enabled, perhaps redirect or show a different message?
  // For now, settings are shown, but actions might not make sense if not enabled.
  // However, the user might want to set allocation BEFORE enabling via stepper (though current flow doesn't support that easily)

  return (
    <div className="mx-auto max-w-md py-8 px-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Earn Settings</h1>
        <Link
          href="/dashboard/earn"
          className="text-sm text-blue-600 hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <label className="block">
          <span className="text-sm font-medium text-gray-700 mb-2 block">
            Allocation Percentage
          </span>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full flex items-center">
              <Slider
                value={sliderValue}
                onValueChange={(val) => {
                  setSliderValue(val);
                  setIsDragging(true);
                }}
                onValueCommit={(val) => {
                  setIsDragging(false);
                  if (
                    safeId &&
                    val &&
                    val.length > 0 &&
                    val[0] !== state.allocation
                  ) {
                    setAlloc.mutate({
                      safeAddress: safeId,
                      percentage: val[0],
                    });
                  }
                }}
                min={0}
                max={100}
                step={1}
                disabled={
                  setAlloc.isPending || disable.isPending || !state.enabled
                }
                className="mt-1 w-full h-8"
                onPointerUp={() => setIsDragging(false)}
                renderThumb={(_index, value) => (
                  <Tooltip open={isDragging || isHovering}>
                    <TooltipTrigger asChild>
                      <div
                        className=""
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs font-bold">
                      {value}%
                    </TooltipContent>
                  </Tooltip>
                )}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Current allocation: {state.allocation}%. Slide to change.
            </p>
          </div>
        </label>
      </div>
      {/* Auto-Earn setup actions */}
      <div className="space-y-4">
        <EnableSafeModuleButton safeAddress={safeAddress} />
        <InstallConfigButton safeAddress={safeAddress} />
      </div>
    </div>
  );
}
