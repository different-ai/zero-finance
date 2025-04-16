'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const kycFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  businessName: z.string().optional(),
  accountType: z.enum(['individual', 'corporate'], {
    required_error: 'Please select an account type',
  }),
});

type KycFormValues = z.infer<typeof kycFormSchema>;

interface AlignKycFormProps {
  onCompleted: (flowLink: string) => void;
}

export function AlignKycForm({ onCompleted }: AlignKycFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = usePrivy();
  
  // Extract potential user info from Privy
  const email = user?.email?.address || '';
  let defaultFirstName = '';
  let defaultLastName = '';
  
  // Try to get name from user data safely
  try {
    // Access potentially available user data (structure varies by auth provider)
    const userData = user as any;
    if (userData?.name) {
      const nameParts = userData.name.split(' ');
      defaultFirstName = nameParts[0] || '';
      defaultLastName = nameParts.slice(1).join(' ') || '';
    }
  } catch (e) {
    // Silently fail if data is not available
    console.log('Could not extract user name data');
  }
  
  const form = useForm<KycFormValues>({
    resolver: zodResolver(kycFormSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      businessName: '',
      accountType: 'individual',
    },
  });

  const initiateKycMutation = api.align.initiateKyc.useMutation({
    onSuccess: (data) => {
      if (data.kycFlowLink) {
        onCompleted(data.kycFlowLink);
      } else {
        toast.error('No KYC link was generated. Please try again.');
      }
    },
    onError: (error) => {
      toast.error(`Failed to initiate KYC: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: KycFormValues) => {
    setIsSubmitting(true);
    try {
      // Store the form data in localStorage to use later if needed
      localStorage.setItem('kyc-form-data', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        accountType: data.accountType,
        businessName: data.businessName,
      }));
      
      // For now, proceed with the basic KYC initiation
      // In a real implementation, we would send this data to the backend
      const result = await initiateKycMutation.mutateAsync();
      
      if (result.kycFlowLink) {
        onCompleted(result.kycFlowLink);
      }
    } catch (error) {
      // Error handled in mutation callbacks
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Your Information</CardTitle>
        <CardDescription>
          Please fill out your information to start the KYC process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="individual" />
                        </FormControl>
                        <FormLabel className="font-normal">Individual</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="corporate" />
                        </FormControl>
                        <FormLabel className="font-normal">Business</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('accountType') === 'corporate' && (
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="text-sm text-muted-foreground">
              <p>Email: {email}</p>
              <p className="mt-2 text-xs">This email will be used for verification. You&apos;ll complete additional information in the next step.</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || initiateKycMutation.isPending}
              className="w-full"
            >
              {(isSubmitting || initiateKycMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue to Verification
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 