'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AllocationCard from './allocation-card';
import ConfirmCard from './confirm-card';

export default function ComponentTest() {
  const [view, setView] = useState<'allocation' | 'confirm'>('allocation');
  const [allocation, setAllocation] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setView('confirm');
    }, 1000);
  };

  const handleFinish = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard/earn';
    }, 1000);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Component Test Page</h1>
      
      <div className="flex gap-4 mb-6">
        <Button
          variant={view === 'allocation' ? 'default' : 'outline'}
          onClick={() => setView('allocation')}
        >
          Show Allocation Card
        </Button>
        <Button
          variant={view === 'confirm' ? 'default' : 'outline'}
          onClick={() => setView('confirm')}
        >
          Show Confirm Card
        </Button>
      </div>

      {view === 'allocation' && (
        <AllocationCard
          value={allocation}
          onChange={setAllocation}
          onNext={handleNext}
          isLoading={isLoading}
        />
      )}

      {view === 'confirm' && (
        <ConfirmCard
          onFinish={handleFinish}
          isLoading={isLoading}
          allocation={allocation}
        />
      )}
    </div>
  );
} 