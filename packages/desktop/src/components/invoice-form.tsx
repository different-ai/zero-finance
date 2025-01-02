import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentMethodSelector } from './payment-method-selector';
import * as dataFormat from '@requestnetwork/data-format';
import { toast } from 'sonner';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ActorInfo,
  Address,
  Invoice,
  InvoiceItem,
  PaymentTerms,
  Tax,
} from '@requestnetwork/data-format';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const invoiceFormSchema = z.object({
  meta: z.object({
    format: z.literal('rnf_invoice'),
    version: z.string(),
  }),
  creationDate: z.string(),
  invoiceNumber: z.string(),
  currency: z.string().min(1, 'Currency is required'),
  buyerInfo: z
    .object({
      businessName: z.string().optional(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      address: z
        .object({
          'country-name': z.string().optional(),
          'extended-address': z.string().optional(),
          locality: z.string().optional(),
          'post-office-box': z.string().optional(),
          'postal-code': z.string().optional(),
          region: z.string().optional(),
          'street-address': z.string().optional(),
        })
        .optional(),
      taxRegistration: z.string().optional(),
      miscellaneous: z.unknown().optional(),
    })
    .optional(),
  sellerInfo: z
    .object({
      businessName: z.string().optional(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      address: z
        .object({
          'country-name': z.string().optional(),
          'extended-address': z.string().optional(),
          locality: z.string().optional(),
          'post-office-box': z.string().optional(),
          'postal-code': z.string().optional(),
          region: z.string().optional(),
          'street-address': z.string().optional(),
        })
        .optional(),
      taxRegistration: z.string().optional(),
      miscellaneous: z.unknown().optional(),
    })
    .optional(),
  invoiceItems: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        reference: z.string().optional(),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        unitPrice: z.string().min(1, 'Unit price is required'),
        discount: z.string().optional(),
        tax: z.object({
          type: z.enum(['percentage', 'fixed']),
          amount: z.string(),
        }),
        deliveryDate: z.string().optional(),
        deliveryPeriod: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
  paymentTerms: z
    .object({
      dueDate: z.string().optional(),
      lateFeesPercent: z.number().optional(),
      lateFeesFix: z.string().optional(),
      miscellaneous: z.unknown().optional(),
    })
    .optional(),
  note: z.string().optional(),
  terms: z.string().optional(),
  miscellaneous: z.unknown().optional(),
  purchaseOrderId: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  defaultValues?: Partial<Invoice>;
  onSubmit?: (values: Invoice) => Promise<void>;
  isLoading?: boolean;
}

type CurrencyType = 'ETH' | 'EURe';
type NetworkType = 'ethereum' | 'gnosis';

const NETWORK_CURRENCIES: Record<NetworkType, CurrencyType[]> = {
  ethereum: ['ETH'],
  gnosis: ['EURe'],
};

export function InvoiceForm({
  defaultValues,
  onSubmit,
  isLoading,
}: InvoiceFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkType>('ethereum');

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      creationDate: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      currency: 'ETH',
      buyerInfo: defaultValues?.buyerInfo || {
        businessName: '',
        address: {
          'street-address': '',
          locality: '',
          region: '',
          'postal-code': '',
          'country-name': '',
        },
      },
      invoiceItems: defaultValues?.invoiceItems?.map((item) => ({
        ...item,
        currency: undefined, // Remove currency from items
      })) || [
        {
          name: 'Setup and install',
          quantity: 1,
          unitPrice: '1000',
          tax: { type: 'percentage', amount: '0' },
        },
      ],
      note: defaultValues?.note || '',
    },
  });

  // Update currency when network changes
  useEffect(() => {
    const networkCurrencies = NETWORK_CURRENCIES[selectedNetwork];
    const currentCurrency = form.getValues('currency') as CurrencyType;
    if (networkCurrencies && !networkCurrencies.includes(currentCurrency)) {
      form.setValue('currency', networkCurrencies[0]);
    }
  }, [selectedNetwork, form]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'invoiceItems',
  });

  const validateInvoice = (data: Invoice): boolean => {
    try {
      const result = dataFormat.validate(data);
      console.log('0xHypr', 'result', result);
      if (!result.valid) {
        setValidationErrors(result.errors.map((err) => err.message));
        toast.error('Please fix validation errors before submitting');
        return false;
      }
      setValidationErrors([]);
      return true;
    } catch (error) {
      console.error('0xHypr', 'Validation error:', error);
      toast.error('Failed to validate invoice data');
      return false;
    }
  };

  const handleSubmit = async (data: InvoiceFormData) => {
    console.log('0xHypr', 'data', data);
    if (validateInvoice(data as Invoice) && onSubmit) {
      await onSubmit(data as Invoice);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="h-[90vh] flex flex-col overflow-y-auto "
      >
        <Card className="flex-1 border-0 shadow-none">
          <CardHeader className="sticky top-0 z-10 bg-background border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">
                  Invoice #{form.watch('invoiceNumber')}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Created on{' '}
                  {new Date(form.watch('creationDate')).toLocaleDateString()}
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
              </Button>
            </div>
            {validationErrors.length > 0 && (
              <div className="mt-2 p-2 bg-destructive/10 rounded-md">
                <ul className="text-sm text-destructive list-disc pl-4">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardHeader>
          <CardContent className="overflow-y-auto flex-1 p-6">
            <div className="max-w-4xl mx-auto grid gap-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="buyerInfo.businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buyerInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="buyerInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="buyerInfo.address.street-address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="buyerInfo.address.locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerInfo.address.region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="State/Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="buyerInfo.address.postal-code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Postal code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerInfo.address.country-name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Network</Label>
                  <PaymentMethodSelector
                    value={selectedNetwork}
                    onChange={setSelectedNetwork}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <div className="flex gap-2">
                    {selectedNetwork === 'ethereum' && (
                      <button
                        type="button"
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent',
                          form.watch('currency') === 'ETH' &&
                            'bg-primary/10 border-primary'
                        )}
                        onClick={() => form.setValue('currency', 'ETH')}
                      >
                        <Image
                          src="/ethereum-logo.svg"
                          alt="ETH"
                          width={20}
                          height={20}
                        />
                        ETH
                      </button>
                    )}
                    {selectedNetwork === 'gnosis' && (
                      <button
                        type="button"
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent',
                          form.watch('currency') === 'EURe' &&
                            'bg-primary/10 border-primary'
                        )}
                        onClick={() => form.setValue('currency', 'EURe')}
                      >
                        <img
                          src="/eure-logo.png"
                          alt="EURe"
                          width={20}
                          height={20}
                        />
                        EURe
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Items</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        append({
                          name: '',
                          quantity: 1,
                          unitPrice: '0',
                          tax: { type: 'percentage', amount: '0' },
                        })
                      }
                    >
                      + Add Item
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Description</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`invoiceItems.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input {...field} className="w-full" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`invoiceItems.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      className="w-16"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`invoiceItems.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      {...field}
                                      className="w-24"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {form.watch('currency')}{' '}
                            {(
                              Number(
                                form.watch(`invoiceItems.${index}.unitPrice`)
                              ) *
                              Number(
                                form.watch(`invoiceItems.${index}.quantity`)
                              )
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any notes or payment instructions"
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
