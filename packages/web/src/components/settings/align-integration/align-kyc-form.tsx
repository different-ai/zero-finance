'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { ALIGN_QUERY_KEYS } from '@/trpc/query-keys';

interface KycFormValues {
  firstName: string;
  lastName: string;
  email: string;
  businessName?: string;
  accountType: 'individual' | 'corporate';
}

interface AlignKycFormProps {
  onFormSubmitted: () => void;
}

export function AlignKycForm({ onFormSubmitted }: AlignKycFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = usePrivy();
  const queryClient = useQueryClient();
  
  // Get user profile from API first
  const { data: userProfile } = api.user.getProfile.useQuery();
  
  // Extract potential user info from Privy
  const privyEmail = user?.email?.address || '';
  
  // Use email from profile first, then fall back to Privy email
  const email = userProfile?.email || privyEmail;
  
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
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      email: email,
      businessName: '',
      accountType: 'individual',
    },
  });

  // Update form when email data is loaded
  useEffect(() => {
    if (email && !form.getValues('email')) {
      form.setValue('email', email);
    }
  }, [email, form]);

  const initiateKycMutation = api.align.initiateKyc.useMutation({
    onSuccess: (data) => {
      // The parent component (AlignKycStatus) will handle polling for the link.
      // We just signal that the form submission and initial KYC initiation were successful.
      toast.success('Information submitted. We are now preparing your secure verification link.', {
        duration: 5000,
      });
      // Invalidate queries so the parent component can pick up the new customerId/status.
      queryClient.invalidateQueries({ queryKey: ALIGN_QUERY_KEYS.getCustomerStatus() });
      onFormSubmitted();
    },
    onError: (error) => {
      toast.error(`Failed to initiate KYC: ${error.message}`);
      // Ensure isSubmitting is reset on error
      setIsSubmitting(false); 
    },
    onSettled: () => {
      // Also reset isSubmitting when the mutation is settled (either success or error)
      // This is a more robust way to handle it.
      setIsSubmitting(false);
    }
  });

  const updateEmailMutation = api.user.updateEmail.useMutation({
    onError: (error) => {
      console.error('Failed to update email:', error);
      // We don't show an error toast here since KYC might still succeed
    }
  });

  const onSubmit = async (data: KycFormValues) => {
    setIsSubmitting(true); // Set submitting state at the beginning
    try {
      // Check if email was changed
      if (data.email && data.email !== email) {
        // Update email in the database
        await updateEmailMutation.mutateAsync({ email: data.email });
      }
      
      // Store the form data in localStorage to use later if needed
      localStorage.setItem('kyc-form-data', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        accountType: data.accountType,
        businessName: data.businessName,
      }));
      
      // Pass the form data to the mutation (email is not needed by the API, it gets it from Privy)
      await initiateKycMutation.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        businessName: data.businessName || undefined,
        accountType: data.accountType
      });
    } catch (error) {
      // This catch block is for errors thrown by mutateAsync itself (e.g. network issues)
      // or if the mutation's onError doesn't catch something.
      console.error("Error during KYC submission initiation:", error);
      toast.error('An unexpected error occurred while submitting your information.');
      setIsSubmitting(false); // Ensure reset if mutateAsync fails before mutation hooks
    }
  };

  return (
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">Complete Your Information</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Please fill out your information to start the KYC process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your first name" 
                        {...field} 
                        {...form.register('firstName', { required: 'First name is required' })}
                        className="bg-white border-gray-200 focus-visible:ring-primary" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your last name" 
                        {...field} 
                        {...form.register('lastName', { required: 'Last name is required' })}
                        className="bg-white border-gray-200 focus-visible:ring-primary" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Enter your email address" 
                      {...field} 
                      {...form.register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className="bg-white border-gray-200 focus-visible:ring-primary" 
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    This email will be used for verification and communication
                  </FormDescription>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-gray-700">Account Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="individual" className="text-primary" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700">Individual</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="corporate" className="text-primary" />
                        </FormControl>
                        <FormLabel className="font-normal text-sm text-gray-700">Business</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              )}
            />

            {form.watch('accountType') === 'corporate' && (
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your business name" 
                        {...field} 
                        className="bg-white border-gray-200 focus-visible:ring-primary" 
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
            )}

            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-md p-3">
              <p className="font-medium">Email: {email}</p>
              <p className="mt-2 text-xs text-gray-500">This email will be used for verification. You&apos;ll complete additional information in the next step.</p>
            </div>

            <div className="pt-2 border-t border-gray-100 mt-4">
              <Button
                type="submit"
                disabled={isSubmitting /* Also implicitly disabled by initiateKycMutation.isPending via button text */}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                {isSubmitting && ( /* Show loader based on isSubmitting state */
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Submitting...' : 'Continue to Verification'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 