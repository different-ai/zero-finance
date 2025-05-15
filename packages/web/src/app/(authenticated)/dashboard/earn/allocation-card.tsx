'use client';

import { Slider } from '@/components/ui/slider';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AllocationCardProps {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  isLoading: boolean;
}

export default function AllocationCard({ value, onChange, onNext, isLoading }: AllocationCardProps) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle slider change
  const handleChange = (newValue: number[]) => {
    const percentage = newValue[0];
    setLocalValue(percentage);
    onChange(percentage);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-4">Choose Your Allocation</h2>
      <p className="text-gray-600 mb-6">
        Select what percentage of your funds should be automatically allocated to earn yield.
        We&apos;ll silently sweep this share of every incoming dollar into a yield vault.
      </p>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">0%</span>
          <span className="text-sm text-gray-500">100%</span>
        </div>
        
        <Slider
          defaultValue={[value]}
          value={[localValue]}
          onValueChange={handleChange}
          max={100}
          step={1}
          className="mb-4"
        />
        
        <div className="text-center">
          <span className="text-4xl font-bold text-blue-600">{localValue}%</span>
          <p className="text-sm text-gray-500 mt-1">of your funds will earn yield</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-700">
          <strong>How it works:</strong> When funds arrive in your account, we&apos;ll automatically allocate {localValue}% to earn yield. 
          Your money remains in your control at all times.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={isLoading} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isLoading ? 'Setting allocation...' : 'Continue'}
        </Button>
      </div>
    </motion.div>
  );
} 