'use client';

import { api } from '@/trpc/react';
import { Slider } from '@/components/ui/slider'; // Corrected import
import { useSafeId } from '../use-safe-id';
import { useRouter } from 'next/navigation';
import FullScreenSpinner from '../full-screen-spinner';
import ErrorView from '../error-view';
import Link from 'next/link';

export default function EarnSettingsPage() { // Renamed to avoid conflict if exported as EarnSettings
  const router = useRouter();
  const safeId = useSafeId();

  const { data: state, isLoading, error, refetch } = api.earn.getState.useQuery({
    safeId: safeId!,
  }, {
    enabled: !!safeId,
  });

  const setAlloc = api.earn.setAllocation.useMutation({
    onSuccess: () => {
      refetch(); // Refetch state to show updated allocation
      // Optionally, show a success toast
    },
    onError: (error) => {
      console.error("Failed to set allocation:", error);
      // Optionally, show an error toast
    }
  });

  const disable = api.earn.disableModule.useMutation({
    onSuccess: () => {
      router.refresh(); // This should trigger EarnPage to re-evaluate and show Stepper
      // router.push('/dashboard/earn'); // Alternative: force navigation to ensure EarnPage re-renders correctly
    },
    onError: (error) => {
      console.error("Failed to disable module:", error);
      // Optionally, show an error toast
    }
  });

  if (isLoading || !safeId) return <FullScreenSpinner />;
  if (error) return <ErrorView msg={`Could not load earn settings: ${error.message}`} />;
  if (!state) return <ErrorView msg="Could not load earn settings (no data)." />;

  // If module is not enabled, perhaps redirect or show a different message?
  // For now, settings are shown, but actions might not make sense if not enabled.
  // However, the user might want to set allocation BEFORE enabling via stepper (though current flow doesn't support that easily)

  return (
    <div className="mx-auto max-w-md py-8 px-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Earn Settings</h1>
        <Link href="/dashboard/earn" className="text-sm text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="p-4 border rounded-lg shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Allocation Percentage</span>
          <Slider
            value={[state.allocation]} // Pass as array if slider expects it
            onValueCommit={(newPercentage: number[]) => { 
              if (safeId && newPercentage && newPercentage.length > 0) {
                setAlloc.mutate({ safeId, percentage: newPercentage[0] });
              }
            }}
            min={0}
            max={100}
            step={1}
            disabled={setAlloc.isPending || disable.isPending || !state.enabled}
            className="mt-1" // Add some margin for better spacing
          />
          <p className="text-xs text-gray-500 mt-2">
            Current allocation: {state.allocation}%. Slide to change.
          </p>
        </label>
      </div>

      {state.enabled && (
        <button
          onClick={() => {
            if (safeId) {
              disable.mutate({ safeId });
            }
          }}
          disabled={disable.isPending || setAlloc.isPending}
          className="w-full rounded bg-red-600 py-2 text-white hover:bg-red-700 disabled:bg-gray-300 transition-colors"
        >
          {disable.isPending ? 'Pausing Earn...' : 'Pause Earn Module'}
        </button>
      )}
       {!state.enabled && (
        <p className="text-sm text-center text-gray-500">
          The Earn module is currently disabled. 
          Go to the <Link href="/dashboard/earn" className="underline text-blue-600">Earn page</Link> to enable it.
        </p>
      )}
    </div>
  );
} 