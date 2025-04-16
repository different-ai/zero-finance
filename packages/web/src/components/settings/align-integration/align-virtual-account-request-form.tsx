'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const virtualAccountSchema = z.object({
  sourceCurrency: z.enum(['usd', 'eur'], {
    required_error: 'Please select the source currency',
  }),
  destinationToken: z.enum(['usdc', 'usdt'], {
    required_error: 'Please select the destination token',
  }),
  destinationNetwork: z.enum(['base', 'ethereum', 'polygon', 'solana', 'avalanche'], {
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
  
  const form = useForm<FormValues>({
    resolver: zodResolver(virtualAccountSchema),
    defaultValues: {
      sourceCurrency: 'usd',
      destinationToken: 'usdc',
      destinationNetwork: 'base',
      destinationAddress: defaultSafeAddress || '',
    },
  });

  const requestVirtualAccountMutation = api.align.requestVirtualAccount.useMutation({
    onSuccess: (data) => {
      toast.success('Virtual account created successfully');
      form.reset(); // Reset form on success
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to create virtual account: ${error.message}`);
    },
  });

  const onSubmit = async (data: FormValues) => {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request Virtual Bank Account</CardTitle>
        <CardDescription>
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
                <FormItem className="space-y-3">
                  <FormLabel>Source Currency</FormLabel>
                  <FormDescription>
                    Select the currency you want to receive from your customers
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="usd" />
                        </FormControl>
                        <FormLabel className="font-normal">USD</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="eur" />
                        </FormControl>
                        <FormLabel className="font-normal">EUR</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Token</FormLabel>
                  <FormDescription>
                    The stablecoin you want to receive when funds are converted
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usdc">USDC</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationNetwork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Network</FormLabel>
                  <FormDescription>
                    The blockchain network where you want to receive the tokens
                  </FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a network" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="avalanche">Avalanche</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Address</FormLabel>
                  <FormDescription>
                    The wallet or safe address where you want to receive funds
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting || requestVirtualAccountMutation.isPending}
              className="w-full"
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
  );
} 