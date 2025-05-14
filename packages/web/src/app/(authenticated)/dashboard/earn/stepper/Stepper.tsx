'use client';
import { api } from '@/trpc/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, NextRouter } from 'next/navigation'; // Corrected import for App Router

// Placeholder components - these should be created in @/components/earn/
import EnableCard from '@/components/earn/EnableCard';
import AllocationCard from '@/components/earn/AllocationCard';
import ConfirmCard from '@/components/earn/ConfirmCard';
import ProgressDots from '@/components/earn/ProgressDots';

const steps = ['enable', 'allocate', 'confirm'] as const;
type Step = typeof steps[number];

// A placeholder for CONFIG_HASH. This should be managed appropriately, e.g., via environment variables or a constants file.
const CONFIG_HASH = '0xYourConfigHashPlaceHolder';

interface StepperProps {
  initialAllocation: number;
  safeId: string;
  router: ReturnType<typeof useRouter>; // Pass router instance for refresh
}

export default function Stepper({ initialAllocation, safeId, router }: StepperProps) {
  const [step, setStep] = useState<Step>('enable');
  const [allocation, setAllocation] = useState(initialAllocation);
  
  const enable = api.earn.enableModule.useMutation();
  const setAlloc = api.earn.setAllocation.useMutation();

  const next = async () => {
    if (step === 'enable') {
      try {
        await enable.mutateAsync({ safeId, configHash: CONFIG_HASH });
        setStep('allocate');
      } catch (error) {
        console.error("Failed to enable module:", error);
        // Handle error (e.g., show toast notification)
      }
    } else if (step === 'allocate') {
      try {
        await setAlloc.mutateAsync({ safeId, percentage: allocation });
        setStep('confirm');
      } catch (error) {
        console.error("Failed to set allocation:", error);
        // Handle error
      }
    } else { // confirm step
      router.refresh(); // Re-fetches data for EarnPage, which should now show the dashboard
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md py-12">
      {/* Render step indicator before cards for better layout control if needed */}
      <ProgressDots currentStep={step} steps={steps as any} />

      {step === 'enable' && <EnableCard onNext={next} isLoading={enable.isPending} />}
      {step === 'allocate' && (
        <AllocationCard
          value={allocation}
          onChange={setAllocation}
          onNext={next}
          isLoading={setAlloc.isPending}
        />
      )}
      {step === 'confirm' && <ConfirmCard onFinish={next} isLoading={false} />}
    </motion.div>
  );
} 