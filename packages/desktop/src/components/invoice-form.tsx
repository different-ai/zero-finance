import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ethers } from 'ethers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Types, Utils } from '@requestnetwork/request-client.js';
import { PaymentSelector } from './payment-selector';
import { NetworkType, NETWORK_CURRENCIES, CURRENCY_CONFIG } from '@/types/payment';

interface BusinessInfo {
  businessName: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    'country-name'?: string;
    'extended-address'?: string;
    locality?: string;
    'post-office-box'?: string;
    'postal-code'?: string;
    region?: string;
    'street-address'?: string;
  };
  taxRegistration?: string;
  companyRegistration?: string;
  miscellaneous?: Record<string, unknown>;
}

interface ExtendedInvoice extends Omit<Invoice, 'businessInfo'> {
  businessInfo: BusinessInfo;
}

export const invoiceFormSchema = z.object({
  meta: z.object({
    format: z.literal('rnf_invoice'),
    version: z.string(),
  }),
  creationDate: z.string(),
  invoiceNumber: z.string(),
  businessInfo: z.object({
    businessName: z.string().min(1, 'Business name is required'),
    email: z.string().email('Must be a valid email').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address: z.object({
      'country-name': z.string().optional(),
      'extended-address': z.string().optional(),
      locality: z.string().optional(),
      'post-office-box': z.string().optional(),
      'postal-code': z.string().optional(),
      region: z.string().optional(),
      'street-address': z.string().optional(),
    }).optional(),
    taxRegistration: z.string().optional(),
    companyRegistration: z.string().optional(),
    miscellaneous: z.record(z.unknown()).optional(),
  }),
  buyerInfo: z.object({
    businessName: z.string().optional(),
    email: z.string().email('Must be a valid email').optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address: z.object({
      'country-name': z.string().optional(),
      'extended-address': z.string().optional(),
      locality: z.string().optional(),
      'post-office-box': z.string().optional(),
      'postal-code': z.string().optional(),
      region: z.string().optional(),
      'street-address': z.string().optional(),
    }).optional(),
    taxRegistration: z.string().optional(),
    companyRegistration: z.string().optional(),
    miscellaneous: z.record(z.unknown()).optional(),
  }).optional(),
  invoiceItems: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    reference: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.string().regex(/^\d+$/, 'Unit price must be a whole number').min(1, 'Unit price is required'),
    currency: z.string().min(1, 'Currency is required'),
    tax: z.object({
      type: z.enum(['percentage', 'fixed']),
      amount: z.string(),
    }),
    deliveryDate: z.string().optional(),
    deliveryPeriod: z.string().optional(),
  })).min(1, 'At least one item is required'),
  paymentTerms: z.object({
    dueDate: z.string().optional(),
    lateFeesPercent: z.number().optional(),
    lateFeesFix: z.string().optional(),
    miscellaneous: z.unknown().optional(),
  }).optional(),
  note: z.string().optional(),
  terms: z.string().optional(),
  miscellaneous: z.unknown().optional(),
  purchaseOrderId: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  defaultValues?: Partial<ExtendedInvoice>;
  onSubmit?: (values: ExtendedInvoice) => Promise<void>;
  isLoading?: boolean;
}

export function InvoiceForm({
  defaultValues,
  onSubmit,
  isLoading,
}: InvoiceFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('gnosis');

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      creationDate: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      businessInfo: defaultValues?.businessInfo || {
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
      invoiceItems: defaultValues?.invoiceItems || [
        {
          name: 'Setup and install',
          quantity: 1,
          unitPrice: '1000',
          currency: 'EUR',
          tax: {
            type: 'percentage',
            amount: '0',
          } as Tax,
          reference: '',
          deliveryDate: new Date().toISOString(),
          deliveryPeriod: '',
        },
      ],
      paymentTerms: defaultValues?.paymentTerms || {
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        lateFeesPercent: 0,
        lateFeesFix: '0',
      },
      note: defaultValues?.note || '',
      terms: defaultValues?.terms || '',
    },
  });

  // Update currency in invoice items when network changes
  useEffect(() => {
    const items = form.getValues('invoiceItems');
    
    items.forEach((_, index) => {
      form.setValue(`invoiceItems.${index}.currency`, 'EUR');
    });
  }, [selectedNetwork, form]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'invoiceItems',
  });


  const handleSubmit = async (formData: InvoiceFormData) => {
    try {
      const data: ExtendedInvoice = {
        meta: {
          format: 'rnf_invoice',
          version: '0.0.3',
        },
        creationDate: formData.creationDate,
        invoiceNumber: formData.invoiceNumber,
        businessInfo: {
          businessName: formData.businessInfo.businessName,
          email: formData.businessInfo.email,
          firstName: formData.businessInfo.firstName,
          lastName: formData.businessInfo.lastName,
          phone: formData.businessInfo.phone,
          address: formData.businessInfo.address,
          taxRegistration: formData.businessInfo.taxRegistration,
          companyRegistration: formData.businessInfo.companyRegistration,
          miscellaneous: formData.businessInfo.miscellaneous || {},
        },
        buyerInfo: formData.buyerInfo ? {
          ...formData.buyerInfo,
          miscellaneous: formData.buyerInfo.miscellaneous || {},
        } : {},
        invoiceItems: formData.invoiceItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: item.currency,
          tax: {
            type: item.tax.type,
            amount: item.tax.amount,
          } as Tax,
          reference: item.reference,
          deliveryDate: item.deliveryDate,
          deliveryPeriod: item.deliveryPeriod,
        })) as InvoiceItem[],
        paymentTerms: {
          dueDate: new Date(formData.paymentTerms?.dueDate).toISOString(),
          lateFeesPercent: formData.paymentTerms?.lateFeesPercent,
          lateFeesFix: formData.paymentTerms?.lateFeesFix,
          miscellaneous: formData.paymentTerms?.miscellaneous || {},
        },
        note: formData.note,
        terms: formData.terms,
        purchaseOrderId: formData.purchaseOrderId,
      };

      // First validate the invoice format
      console.log('0xHypr', 'data', data);
      const validationResult = dataFormat.validate(data);
      console.log('0xHypr', 'validationResult', validationResult);
      if (!validationResult.valid) {
        setValidationErrors(validationResult.errors.map((err) => {
          const fieldPath = err.dataPath.replace(/^\./, '');
          const fieldName = fieldPath.split('.').pop() || fieldPath;
          return `${fieldName} at ${fieldPath}: ${err.message}`;
        }));
        toast.error('Please fix validation errors before submitting');
        return;
      }

      // Calculate total amount from invoice items
      const totalAmount = data.invoiceItems.reduce(
        (sum, item) => sum + (Number(item.unitPrice) * item.quantity),
        0
      ).toString();

      const payeeAddress = await window.api.getPayeeAddress();

      // Create the request data
      const requestCreateParameters: Partial<Types.ICreateRequestParameters> = {
        requestInfo: {
          currency: CURRENCY_CONFIG.EURe, // Always use EURe for payment
          expectedAmount: ethers.utils.parseUnits(totalAmount, 18).toString(),
          payee: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: payeeAddress,
          },
          payer: data.buyerInfo?.address?.['street-address'] ? {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: data.buyerInfo.address['street-address'],
          } : undefined,
          timestamp: Utils.getCurrentTimestampInSecond(),
        },
        paymentNetwork: {
          id: CURRENCY_CONFIG.EURe.paymentNetworkId,
          parameters: {
            paymentNetworkName: CURRENCY_CONFIG.EURe.network,
            feeAddress: '0x0000000000000000000000000000000000000000',
            feeAmount: '0',
          },
        },
        contentData: data,
      };

      const result = await window.api.createInvoiceRequest(requestCreateParameters);
      
      if (result.success) {
        const invoiceUrl = await window.api.generateInvoiceUrl(result.requestId);
        toast.success(`Invoice created successfully! Shareable link: ${invoiceUrl}`);
        // Copy to clipboard for convenience
        navigator.clipboard.writeText(invoiceUrl).catch(() => {
          // Silently fail if clipboard access is denied
        });
        if (onSubmit) {
          await onSubmit(data);
        }
      } else {
        throw new Error(result.error || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0 border-b">
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
              <Button type="submit" disabled={isLoading || form.formState.isSubmitting}>
                {isLoading || form.formState.isSubmitting ? 'Creating Invoice...' : 'Create Invoice'}
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
                <h3 className="text-lg font-semibold">Business Information (Seller)</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessInfo.businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Legal name of your business</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="contact@yourbusiness.com" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Official contact email</p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Primary contact person</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="businessInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Official contact number</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessInfo.taxRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="VAT/Tax ID" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">VAT or tax identification number</p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="businessInfo.companyRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Company registration/ID" {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">Official company registration number</p>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <h4 className="font-medium">Business Address</h4>
                    <FormField
                      control={form.control}
                      name="businessInfo.address.street-address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Business Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="businessInfo.address.locality"
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
                        name="businessInfo.address.region"
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
                        name="businessInfo.address.postal-code"
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
                        name="businessInfo.address.country-name"
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
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Buyer Information</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buyerInfo.businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client company name" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Client's business name</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerInfo.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="client@theirbusiness.com" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Client's contact email</p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buyerInfo.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client's first name" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Client's contact person</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerInfo.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client's last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="buyerInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Client's contact number</p>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerInfo.taxRegistration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Registration Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Client's VAT/Tax ID" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">Client's VAT or tax ID</p>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="buyerInfo.companyRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Client's company registration" {...field} />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">Client's company registration number</p>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <h4 className="font-medium">Buyer Address</h4>
                    <FormField
                      control={form.control}
                      name="buyerInfo.address.street-address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter street address" {...field} />
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
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Network</Label>
                <PaymentSelector
                  value={selectedNetwork}
                  onChange={setSelectedNetwork}
                />
              </div>

              <div className="space-y-2">
                <Label>Items</Label>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Currency: EUR
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() =>
                      append({
                        name: '',
                        quantity: 1,
                        unitPrice: '0',
                        currency: 'EUR',
                        tax: {
                          type: 'percentage',
                          amount: '0',
                        } as Tax,
                        reference: '',
                        deliveryDate: new Date().toISOString(),
                        deliveryPeriod: '',
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
                                    {...field}
                                    type="text"
                                    pattern="[0-9]*"
                                    inputMode="numeric"
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/[^0-9]/g, '');
                                      field.onChange(value);
                                    }}
                                    className="w-24"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {form.getValues(`invoiceItems.${index}.currency`)} {' '}
                          {(
                            Number(form.getValues(`invoiceItems.${index}.unitPrice`)) *
                            Number(form.getValues(`invoiceItems.${index}.quantity`))
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
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
