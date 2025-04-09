'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner';
import { trpc } from '@/utils/trpc';
import { addFundingSourceSchema, type AddFundingSourceFormValues } from '../lib/validators/add-funding-source';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

export function AddFundingSourceForm() {
  const form = useForm<AddFundingSourceFormValues>({
    resolver: zodResolver(addFundingSourceSchema),
    // Define default values based on schema (important for conditional fields)
    defaultValues: {
      sourceAccountType: 'us_ach', // Default to one type
      sourceCurrency: 'USD',
      sourceBankName: '',
      sourceBankAddress: '',
      sourceBankBeneficiaryName: '',
      sourceBankBeneficiaryAddress: '',
      sourcePaymentRail: '',
      sourceRoutingNumber: '',
      sourceAccountNumber: '',
      sourceIban: '',
      sourceBicSwift: '',
      sourceSortCode: '',
      destinationCurrency: 'USDC',
      destinationPaymentRail: 'base', 
      destinationAddress: '', // Needs to be fetched or entered
    },
  });

  const addFundingSourceMutation = trpc.fundingSource.addFundingSource.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset(); // Reset form on success
      // Optionally trigger a refetch of funding sources if displaying them
    },
    onError: (error) => {
      // Use type assertion to access zodError, as it's added dynamically by tRPC
      const zodError = (error.data as any)?.zodError;
      const fieldErrors = zodError?.fieldErrors;
      
      if (fieldErrors) {
        let messages = [];
        for (const key in fieldErrors) {
          if (fieldErrors[key as keyof typeof fieldErrors]) {
             messages.push(`${key}: ${fieldErrors[key as keyof typeof fieldErrors]!.join(', ')}`);
          }
        }
        toast.error(`Validation Error: ${messages.join('; ')}`);
      } else {
         // Handle other types of errors (e.g., internal server error)
         toast.error(`Error: ${error.message}`);
      }
    },
  });

  const watchedAccountType = form.watch("sourceAccountType");

  function onSubmit(values: AddFundingSourceFormValues) {
    console.log("Submitting form values:", values);
    addFundingSourceMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Funding Source</CardTitle>
        <CardDescription>Enter the details of the bank account you want to link.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Destination Address - Consider fetching primary safe or allowing input */}
            <FormField
              control={form.control}
              name="destinationAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination Wallet Address (Your Hypr Account)</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Funds will be sent to this address on Base (USDC).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Source Account Type Selector */}
            <FormField
              control={form.control}
              name="sourceAccountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Account Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="us_ach">US Bank (ACH)</SelectItem>
                        <SelectItem value="iban">International (IBAN)</SelectItem>
                        <SelectItem value="uk_details">UK Bank (Sort Code)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormDescription>The type of bank account you are linking.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Common Source Fields */}
            <FormField
              control={form.control}
              name="sourceCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., USD, EUR, GBP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="sourceBankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chase, Barclays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceBankBeneficiaryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name as it appears on the account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional Fields based on sourceAccountType */}            
            {watchedAccountType === 'us_ach' && (
              <>
                <FormField
                  control={form.control}
                  name="sourceRoutingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Routing Number</FormLabel>
                      <FormControl>
                        <Input placeholder="9 digits" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sourceAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your bank account number" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {watchedAccountType === 'iban' && (
              <>
                <FormField
                  control={form.control}
                  name="sourceIban"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <Input placeholder="International Bank Account Number" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="sourceBicSwift"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BIC/SWIFT (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Bank Identifier Code" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

             {watchedAccountType === 'uk_details' && (
              <>
                <FormField
                  control={form.control}
                  name="sourceSortCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Code</FormLabel>
                      <FormControl>
                        <Input placeholder="6 digits" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sourceAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="8 digits" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
            {/* Optional Fields (Consider if needed for 'other' or specific types) */}
            {/* 
            <FormField control={form.control} name="sourceBankAddress" ... />
            <FormField control={form.control} name="sourceBankBeneficiaryAddress" ... /> 
            <FormField control={form.control} name="sourcePaymentRail" ... />
            */}

            <Button type="submit" disabled={addFundingSourceMutation.isPending}>
               {addFundingSourceMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {addFundingSourceMutation.isPending ? 'Adding...' : 'Add Funding Source'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 