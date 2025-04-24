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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';

// Define the type for the object returned by the AI parser mutation
type ParsedDetails = Partial<AddFundingSourceFormValues>;

export function AddFundingSourceForm() {
  const [rawDetails, setRawDetails] = useState("");

  const form = useForm<AddFundingSourceFormValues>({
    resolver: zodResolver(addFundingSourceSchema),
    defaultValues: {
      sourceAccountType: 'us_ach',
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
      destinationAddress: '',
    },
  });

  const addFundingSourceMutation = trpc.fundingSource.addFundingSource.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      form.reset();
      setRawDetails("");
    },
    onError: (error) => {
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
         toast.error(`Error: ${error.message}`);
      }
    },
  });

  const parseDetailsMutation = trpc.fundingSource.parseFundingDetails.useMutation({
    onSuccess: (data: ParsedDetails) => {
      toast.success("AI extracted details! Please review and complete the form.");
      console.log("AI Parsing Success Data:", data);
      for (const key in data) {
        const formKey = key as keyof AddFundingSourceFormValues;
        const value = data[formKey];
        if (value !== null && value !== undefined) {
            console.log(`Setting form field ${formKey} to:`, value);
            form.setValue(formKey, value as any, { shouldValidate: true });
        } else {
             console.log(`Skipping setting null/undefined for field ${formKey}`);
        }
      }
    },
    onError: (error) => {
      toast.error(`AI Parsing Failed: ${error.message}`);
       console.error("AI Parsing Error:", error);
    },
  });

  const handleParseDetails = () => {
    if (!rawDetails.trim()) {
      toast.info("Please paste or type bank details into the text area first.");
      return;
    }
    parseDetailsMutation.mutate({ rawDetails });
  };

  const watchedAccountType = form.watch("sourceAccountType");

  function onSubmit(values: AddFundingSourceFormValues) {
    addFundingSourceMutation.mutate(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Funding Source</CardTitle>
        <CardDescription>Enter the details manually, or paste them below and use AI to pre-fill the form.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
           <Label htmlFor="rawDetails">Paste Bank Details Here</Label>
            <Textarea
              id="rawDetails"
              placeholder="e.g., Account Name: John Doe, Bank: Chase, Routing: 123456789, Account: 987654321, Currency: USD"
              value={rawDetails}
              onChange={(e) => setRawDetails(e.target.value)}
              rows={4}
              className="mb-2"
            />
            <Button 
              type="button" 
              onClick={handleParseDetails} 
              disabled={parseDetailsMutation.isPending || !rawDetails.trim()}
              variant="outline"
              size="sm"
            >
              {parseDetailsMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
              )}
              {parseDetailsMutation.isPending ? 'Parsing...' : 'Parse with AI'}
            </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            
            <FormField
              control={form.control}
              name="sourceAccountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Account Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value ?? ''}>
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

            <FormField
              control={form.control}
              name="sourceCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Currency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., USD, EUR, GBP" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="e.g., Chase, Barclays" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="Your full name as it appears on the account" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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