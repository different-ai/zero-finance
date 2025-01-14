import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

// Schema matches the one in business-profile-service.ts
const businessProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Must be a valid email'),
  phone: z.string().optional(),
  taxRegistration: z.string().optional(),
  companyRegistration: z.string().optional(),
  address: z.object({
    'street-address': z.string().optional(),
    locality: z.string().optional(),
    region: z.string().optional(),
    'postal-code': z.string().optional(),
    'country-name': z.string().optional(),
  }).optional(),
  miscellaneous: z.record(z.unknown()).optional(),
});

type BusinessProfile = z.infer<typeof businessProfileSchema>;

interface BusinessProfileSetupProps {
  onComplete?: () => void;
  defaultValues?: Partial<BusinessProfile>;
}

export function BusinessProfileSetup({ onComplete, defaultValues }: BusinessProfileSetupProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState<string>('');

  React.useEffect(() => {
    // Get wallet address on mount
    window.api.getWalletAddress().then(setWalletAddress);
  }, []);

  const form = useForm<BusinessProfile>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: defaultValues || {
      businessName: '',
      email: '',
      phone: '',
      address: {
        'street-address': '',
        locality: '',
        region: '',
        'postal-code': '',
        'country-name': '',
      },
    },
  });

  const onSubmit = async (data: BusinessProfile) => {
    try {
      setIsLoading(true);
      await window.api.saveBusinessProfile(data);
      toast.success('Business profile saved successfully');
      onComplete?.();
    } catch (error) {
      console.error('0xHypr', 'Failed to save business profile:', error);
      toast.error('Failed to save business profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPrivateKey = async () => {
    try {
      const privateKey = await window.api.getWalletPrivateKey();
      await navigator.clipboard.writeText(privateKey);
      toast.success('Private key copied to clipboard');
    } catch (error) {
      console.error('0xHypr', 'Failed to export private key:', error);
      toast.error('Failed to export private key');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Business Profile Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">Wallet Information</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Your payment address: {walletAddress}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPrivateKey}
          >
            Export Private Key
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxRegistration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Registration Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Business Address</h3>

              <FormField
                control={form.control}
                name="address.street-address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.postal-code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.country-name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 