'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle, ChevronDown, CircleDollarSign, Euro } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const virtualAccountSchema = z.object({
  sourceCurrency: z.enum(['usd', 'eur'], {
    required_error: 'Please select the source currency',
  }),
  destinationToken: z.literal('usdc', {
    required_error: 'Only USDC is currently supported',
  }),
  destinationNetwork: z.enum(['base'], {
    required_error: 'Please select the destination network',
  }),
  destinationAddress: z.string().length(42, {
    message: 'Address must be a valid Ethereum address (42 characters)',
  }),
});

type FormValues = z.infer<typeof virtualAccountSchema>;

interface AlignVirtualAccountRequestFormProps {
  defaultSafeAddress?: string;
  onSuccess?: (data: { id: string; virtualAccountId: string }) => void;
}

export function AlignVirtualAccountRequestForm({ 
  defaultSafeAddress, 
  onSuccess 
}: AlignVirtualAccountRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasPrimarySafe, setHasPrimarySafe] = useState<boolean>(!!defaultSafeAddress);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState(false);
  
  // Get user's primary safe using the settings.userSafes.list endpoint
  const { data: userSafes } = api.settings.userSafes.list.useQuery();
  
  // Find the primary safe address from the user safes
  const primarySafeAddress = userSafes?.find(
    (safe) => safe.safeType === 'primary'
  )?.safeAddress;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(virtualAccountSchema),
    defaultValues: {
      sourceCurrency: 'usd',
      destinationToken: 'usdc',
      destinationNetwork: 'base',
      destinationAddress: defaultSafeAddress || primarySafeAddress || '',
    },
  });

  // Update form when safe data is loaded and set hasPrimarySafe flag
  useEffect(() => {
    if (userSafes) {
      const primarySafe = userSafes.find(
        (safe) => safe.safeType === 'primary'
      );
      setHasPrimarySafe(!!primarySafe?.safeAddress);
      
      if (primarySafe?.safeAddress) {
        form.setValue('destinationAddress', primarySafe.safeAddress);
      }
    }
  }, [userSafes, form]);

  const requestVirtualAccountMutation = api.align.requestVirtualAccount.useMutation({
    onSuccess: (data) => {
      toast.success('Virtual account created successfully');
      form.reset(); // Reset form on success
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: any) => {
      console.error('Error requesting virtual account:', error);
      toast.error(`Failed to create virtual account: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!hasPrimarySafe) {
      toast.error('You need to create a primary safe before requesting a virtual account');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await requestVirtualAccountMutation.mutateAsync(data);
    } catch (error) {
      // Error handled in mutation callbacks
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {!hasPrimarySafe && (
        <Alert variant="destructive" className="bg-white border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-red-700 text-sm font-medium">Primary safe required</AlertTitle>
          <AlertDescription className="text-sm text-gray-700">
            You need to create a primary safe before requesting a virtual account. Please go to the Safe Management section first.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="w-full border border-[#E5E7EB] shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#111827] text-xl font-semibold">Request Virtual Bank Account</CardTitle>
          <CardDescription className="text-gray-600">
            Create a virtual bank account to receive payments via bank transfer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="sourceCurrency"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium text-[#111827]">Source Currency</FormLabel>
                    <FormDescription className="text-sm text-gray-600">
                      Select the currency you want to receive from your customers
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4 pt-2"
                      >
                        <FormItem className="flex-1">
                          <FormControl>
                            <RadioGroupItem value="usd" id="usd" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor="usd"
                            className={cn(
                              "flex flex-col items-center justify-center rounded-lg border-2 border-transparent bg-gradient-to-br from-slate-50 to-sky-100 p-4 hover:shadow-sm transition-all duration-300 cursor-pointer space-y-2",
                              field.value === 'usd' ? "border-blue-500 shadow-md ring-1 ring-blue-500/50" : "hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white mb-1.5">
                              <CircleDollarSign className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-semibold text-gray-800">USD</span>
                            <span className="text-xs text-gray-500">United States Dollar</span>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex-1">
                          <FormControl>
                            <RadioGroupItem value="eur" id="eur" className="sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor="eur"
                            className={cn(
                              "flex flex-col items-center justify-center rounded-lg border-2 border-transparent bg-gradient-to-br from-slate-50 to-violet-100 p-4 hover:shadow-sm transition-all duration-300 cursor-pointer space-y-2",
                              field.value === 'eur' ? "border-violet-500 shadow-md ring-1 ring-violet-500/50" : "hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-violet-500 text-white mb-1.5">
                              <Euro className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-semibold text-gray-800">EUR</span>
                            <span className="text-xs text-gray-500">Euro</span>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Accordion type="single" collapsible className="w-full" value={advancedSettingsOpen ? "advanced" : ""} onValueChange={(value) => setAdvancedSettingsOpen(value === "advanced")}>
                <AccordionItem value="advanced" className="border-none">
                  <AccordionTrigger className="flex items-center justify-between w-full py-3 font-medium text-sm text-gray-700 hover:no-underline hover:text-gray-900">
                    Advanced Settings
                    <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${advancedSettingsOpen ? 'rotate-180' : ''}`} />
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 space-y-6">
                    <FormField
                      control={form.control}
                      name="destinationToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-[#111827]">Destination Token</FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            The stablecoin you receive when funds are converted
                          </FormDescription>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={true}
                          >
                            <FormControl>
                              <SelectTrigger className="border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select a token" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="usdc">USDC</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#10B981] mr-2"></span>
                            Only USDC is currently supported
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinationNetwork"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-[#111827]">Destination Network</FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            The blockchain network where you want to receive the tokens
                          </FormDescription>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={true}
                          >
                            <FormControl>
                              <SelectTrigger className="border-[#E5E7EB] bg-white">
                                <SelectValue placeholder="Select a network" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="base">Base</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#10B981] mr-2"></span>
                            Support for Ethereum, Polygon, Solana, and Avalanche coming soon
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinationAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-[#111827]">Destination Address</FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            Your primary safe address where you will receive converted funds
                          </FormDescription>
                          <FormControl>
                            <Input 
                              placeholder="0x..." 
                              {...field} 
                              className="border-[#E5E7EB] bg-white" 
                              disabled={!!defaultSafeAddress || !!primarySafeAddress}
                            />
                          </FormControl>
                          {primarySafeAddress && (
                            <p className="text-xs text-gray-500 mt-1">
                              Using your primary safe address
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button
                type="submit"
                disabled={isSubmitting || requestVirtualAccountMutation.isPending || !hasPrimarySafe}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                {(isSubmitting || requestVirtualAccountMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Request Virtual Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
} 