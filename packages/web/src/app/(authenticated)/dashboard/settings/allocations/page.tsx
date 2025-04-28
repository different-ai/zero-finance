'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@/trpc/react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, Save } from 'lucide-react';
import { toast } from 'sonner';
import { AllocationStrategy } from '@/db/schema'; // Import type

const SAFE_TYPES: AllocationStrategy['destinationSafeType'][] = ['primary', 'tax', 'yield']; // Add 'liquidity' if needed

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
                    Define how funds deposited into your primary safe should be automatically allocated 
                    across your different safes. Percentages must add up to 100%.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {SAFE_TYPES.map((type) => (
                    <div key={type} className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor={`percentage-${type}`} className="capitalize text-right">{type} Safe</Label>
                        <div className="col-span-2 flex items-center">
                            <Input
                                id={`percentage-${type}`}
                                type="number"
                                min="0"
                                max="100"
                                value={percentages[type] ?? ''} 
                                onChange={(e) => handlePercentageChange(type, e.target.value)}
                                className="w-24 mr-2"
                                disabled={setStrategyMutation.isPending}
                            />
                            <span className="text-muted-foreground">%</span>
                        </div>
                    </div>
                ))}
                
                <div className="grid grid-cols-3 items-center gap-4 pt-2 border-t">
                     <Label className="text-right font-semibold">Total</Label>
                     <div className="col-span-2 font-semibold text-lg">
                        <span className={totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}>
                            {totalPercentage}%
                        </span>
                     </div>
                </div>

                {formError && (
                     <Alert variant="destructive" className="mt-4">
                         <AlertCircle className="h-4 w-4" />
                         <AlertTitle>Validation Error</AlertTitle>
                         <AlertDescription>{formError}</AlertDescription>
                     </Alert>
                )}

            </CardContent>
            <CardFooter>
                <Button 
                    onClick={handleSave}
                    disabled={setStrategyMutation.isPending || totalPercentage !== 100}
                    className="w-full md:w-auto"
                >
                    {setStrategyMutation.isPending ? 
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                        <Save className="mr-2 h-4 w-4" />
                    }
                    Save Strategy
                </Button>
            </CardFooter>
        </Card>
    );
} 