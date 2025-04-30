'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/trpc/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { AllocationStrategy } from '@/db/schema'; // Import type
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils'; // Import cn utility

// Filter out 'yield'
const SAFE_TYPES: AllocationStrategy['destinationSafeType'][] = ['primary', 'tax'];

// Define typed colors object outside the loop, removing 'yield'
const colors: { [K in typeof SAFE_TYPES[number]]?: string } = {
  primary: 'bg-blue-600',
  tax: 'bg-amber-500',
  // yield: 'bg-green-500', // Removed yield color
};

export default function AllocationStrategySettings() {
    const utils = api.useUtils();
    const { data: currentStrategy, isLoading: isLoadingStrategy, error: strategyError } = api.allocationStrategy.get.useQuery();
    const setStrategyMutation = api.allocationStrategy.set.useMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            utils.allocationStrategy.get.invalidate(); // Invalidate query to refetch
            utils.allocations.getStatus.invalidate(); // Invalidate allocation status as well
        },
        onError: (error) => {
            toast.error(`Failed to save strategy: ${error.message}`);
        }
    });

    const [percentages, setPercentages] = useState<{ [key: string]: number }>({});
    const [totalPercentage, setTotalPercentage] = useState(0);
    const [formError, setFormError] = useState<string | null>(null);

    // Initialize form state from fetched strategy
    useEffect(() => {
        if (currentStrategy) {
            const initialPercentages = SAFE_TYPES.reduce((acc, type) => {
                const existing = currentStrategy.find(s => s.destinationSafeType === type);
                acc[type] = existing ? existing.percentage : 0;
                return acc;
            }, {} as { [key: string]: number });
            setPercentages(initialPercentages);
            setTotalPercentage(Object.values(initialPercentages).reduce((sum, p) => sum + p, 0));
        }
    }, [currentStrategy]);

    const handlePercentageChange = useCallback((type: string, value: string) => {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
            setPercentages(prev => {
                const newPercentages = { ...prev, [type]: numValue };
                setTotalPercentage(Object.values(newPercentages).reduce((sum, p) => sum + p, 0));
                return newPercentages;
            });
            setFormError(null); // Clear error on valid change
        }
    }, []);

    // New function to handle filling the remaining percentage
    const handleFillRemaining = useCallback((typeToFill: string) => {
        const currentTotalExcludingTarget = SAFE_TYPES.reduce((sum, type) => {
            if (type !== typeToFill) {
                return sum + (percentages[type] ?? 0);
            }
            return sum;
        }, 0);

        const remaining = 100 - currentTotalExcludingTarget;
        if (remaining >= 0 && remaining <= 100) {
            handlePercentageChange(typeToFill, String(remaining));
        }
    }, [percentages, handlePercentageChange]);

    const handleSave = () => {
        setFormError(null);
        if (totalPercentage !== 100) {
            setFormError('Percentages must sum to exactly 100%.');
            return;
        }

        const strategyPayload = SAFE_TYPES.map(type => ({
            destinationSafeType: type,
            percentage: percentages[type] ?? 0,
        }));

        // Additional check: Ensure all required types are present (though covered by input schema too)
        const presentTypes = new Set(strategyPayload.map(s => s.destinationSafeType));
        if (!SAFE_TYPES.every(type => presentTypes.has(type))) {
             setFormError('Strategy must include entries for primary, tax, and yield.');
             return;
        }

        setStrategyMutation.mutate(strategyPayload);
    };

    if (isLoadingStrategy) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="h-6 w-6 animate-spin" /> Loading strategy...</div>;
    }

    if (strategyError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Strategy</AlertTitle>
                <AlertDescription>{strategyError.message}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Allocation Strategy</CardTitle>
                <CardDescription>
                    Define how funds deposited into your primary safe should be automatically allocated across your different safes. Drag the sliders to adjust your allocation. Percentages must add up to 100%.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Allocation Bar Visualization */}
                <div className="flex flex-col gap-2">
                  <div className="flex w-full h-5 rounded overflow-hidden border border-muted bg-muted/50">
                    {SAFE_TYPES.map((type) => {
                      const pct = percentages[type] ?? 0;
                      // Check if the type is a valid key for colors
                      const colorClass = colors[type]; 
                      if (!colorClass) return null; // Skip rendering if color not defined for type
                      
                      return (
                        <div
                          key={type}
                          // Use the validated colorClass
                          className={`${colorClass} transition-all duration-300 h-full`}
                          style={{ width: pct + '%' }}
                          title={`${type.charAt(0).toUpperCase() + type.slice(1)} Safe: ${pct}%`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs mt-1 px-1 text-muted-foreground">
                    <span className="font-medium text-blue-700">Primary</span>
                    <span className="font-medium text-amber-600">Tax</span>
                    {/* <span className="font-medium text-green-700">Yield</span> Removed Yield Label */}
                  </div>
                </div>

                {/* Allocation Sliders */}
                <div className="flex flex-col gap-6">
                  {SAFE_TYPES.map((type, index) => (
                    <div key={type} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <Label htmlFor={`percentage-${type}`} className="capitalize w-28 md:text-right text-left">{type} Safe</Label>
                      <div 
                        className="flex-1 flex flex-col gap-1" 
                        // Add onDoubleClick handler here for non-primary safes
                        onDoubleClick={type !== 'primary' ? () => handleFillRemaining(type) : undefined}
                        title={type !== 'primary' ? 'Double-click to fill remaining' : ''}
                      >
                        <Slider
                          id={`percentage-${type}`}
                          min={0}
                          max={100}
                          step={1}
                          value={[percentages[type] ?? 0]}
                          onValueChange={([val]) => handlePercentageChange(type, String(val))}
                          disabled={setStrategyMutation.isPending}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="w-16 text-right font-semibold text-lg md:w-20 flex items-center justify-end gap-2">
                        <span className="tabular-nums">{percentages[type] ?? 0}%</span>
                         {/* Remove Fill Remaining button */}
                         {/* {type !== 'primary' && ( */}
                         {/*    <Button */}
                         {/*      variant="ghost" */}
                         {/*      size="icon" */}
                         {/*      onClick={() => handleFillRemaining(type)} */}
                         {/*      disabled={setStrategyMutation.isPending} */}
                         {/*      title={`Fill remaining for ${type}`} */}
                         {/*      className="h-7 w-7 text-muted-foreground hover:text-primary" */}
                         {/*    > */}
                         {/*      <RefreshCw className="h-4 w-4" /> */}
                         {/*    </Button> */}
                         {/* )} */}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Row */}
                <div className="flex items-center gap-4 pt-2 border-t mt-4">
                  <Label className="font-semibold w-28 md:text-right text-left">Total</Label>
                  <div className="flex-1" />
                  <div className="font-semibold text-lg w-20 text-right">
                    <span className={cn(
                      'tabular-nums',
                      totalPercentage === 100 ? 'text-green-600' : 'text-red-600' // Updated colors
                      //totalPercentage === 100 ? 'text-emerald-600' : 'text-rose-600' // Example nicer colors
                    )}>
                      {totalPercentage}%
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Error</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row gap-4 justify-end pt-6">
                <Button 
                    onClick={handleSave}
                    disabled={setStrategyMutation.isPending || totalPercentage !== 100}
                    className="w-full md:w-auto md:min-w-[150px] text-base py-2.5 px-5"
                    size="lg" // Make button larger
                >
                    {setStrategyMutation.isPending ? 
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 
                        <Save className="mr-2 h-5 w-5" />
                    }
                    Save Strategy
                </Button>
            </CardFooter>
        </Card>
    );
} 