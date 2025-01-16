import * as React from 'react';
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
import {
  NetworkType,
  NETWORK_CURRENCIES,
  CURRENCY_CONFIG,
} from '@/types/payment';
import { Pencil2Icon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Copy, X } from 'lucide-react';
import { addDays, parseISO, isValid } from 'date-fns';

interface BusinessInfo extends Omit<ActorInfo, 'miscellaneous'> {
  miscellaneous?: Record<string, unknown>;
}

interface ExtendedInvoice extends Omit<Invoice, 'sellerInfo' | 'buyerInfo'> {
  sellerInfo: BusinessInfo;
  buyerInfo?: BusinessInfo;
}

const DEFAULT_DUE_DATE_DAYS = 7;

const validateAndFormatDate = (date: string | undefined): string => {
  // Try to parse the date if provided
  const parsedDate = date ? parseISO(date) : null;

  // If we don't have a valid date, use today + 7 days
  const finalDate = isValid(parsedDate)
    ? parsedDate
    : addDays(new Date(), DEFAULT_DUE_DATE_DAYS);

  // Return ISO string date portion (YYYY-MM-DD)
  // should be date-time
  return new Date(finalDate).toISOString();
};

export const invoiceFormSchema = z.object({
  meta: z.object({
    format: z.string().transform(() => 'rnf_invoice'),
    version: z.string(),
  }),
  creationDate: z.string(),
  invoiceNumber: z.string(),
  sellerInfo: z.object({
    businessName: z.string().min(1, 'Business name is required'),
    email: z.string().email('Must be a valid email').optional(),
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
    companyRegistration: z.string().optional(),
    miscellaneous: z.record(z.unknown()).optional(),
  }),
  buyerInfo: z
    .object({
      businessName: z.string().optional(),
      email: z.string().email('Must be a valid email').optional(),
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
      companyRegistration: z.string().optional(),
      miscellaneous: z.record(z.unknown()).optional(),
    })
    .optional(),
  invoiceItems: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        reference: z.string().optional(),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        // gets in floats but converts to integer
        unitPrice: z.string().transform((value) => {
          // dollars value
          const floatValue = parseFloat(value);
          // convert to cents
          const centsValue = floatValue * 100;
          return centsValue.toFixed(0);
        }),
        // regex(/^\d+$/, 'Unit price must be a whole number').min(1, 'Unit price is required'),
        currency: z.string().min(1, 'Currency is required'),
        discount: z
          .string()
          .optional()
          .transform((value) => value || '0'),
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
      // check if date valid to do crash if not just set to 7 days from now
      dueDate: z
        .string()
        // transform into valid date
        .optional()
        .transform(validateAndFormatDate),

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
  defaultValues?: Partial<ExtendedInvoice>;
  onSubmit?: (values: ExtendedInvoice) => Promise<void>;
  isLoading?: boolean;
}

// Create a separate success modal component
function SuccessModal({
  open,
  onOpenChange,
  url,
  onClose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoice Created Successfully!</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Share this link with your client to view the invoice:
          </p>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <code className="flex-1 text-sm break-all">{url}</code>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopyUrl}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex justify-end">
            <Button variant="default" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InvoiceForm({
  defaultValues,
  onSubmit,
  isLoading,
}: InvoiceFormProps) {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('gnosis');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState('');
  const [paymentAddress, setPaymentAddress] = useState<string>('');

  // Create a ref to track if we've applied the default values
  const hasAppliedDefaults = React.useRef(false);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      creationDate: new Date().toISOString(),
      invoiceNumber: `INV-${Date.now()}`,
      sellerInfo: {
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
      buyerInfo: {
        businessName: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: {
          'street-address': '',
          locality: '',
          region: '',
          'postal-code': '',
          'country-name': '',
        },
        miscellaneous: {},
      },
      invoiceItems: [
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
      paymentTerms: {
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lateFeesPercent: 0,
        lateFeesFix: '0',
      },
      note: '',
      terms: '',
    },
  });

  // Effect to update form values when defaultValues changes
  useEffect(() => {
    if (defaultValues && !hasAppliedDefaults.current) {
      // Reset form with new values
      form.reset({
        ...form.getValues(),
        sellerInfo: defaultValues.sellerInfo || form.getValues('sellerInfo'),
        buyerInfo: defaultValues.buyerInfo || form.getValues('buyerInfo'),
        invoiceItems:
          defaultValues.invoiceItems || form.getValues('invoiceItems'),
        paymentTerms:
          defaultValues.paymentTerms || form.getValues('paymentTerms'),
        note: defaultValues.note || form.getValues('note'),
        terms: defaultValues.terms || form.getValues('terms'),
      });
      hasAppliedDefaults.current = true;
    }
  }, [defaultValues, form]);

  // Update currency in invoice items when network changes
  useEffect(() => {
    const items = form.getValues('invoiceItems');

    items.forEach((_, index) => {
      form.setValue(`invoiceItems.${index}.currency`, 'EUR');
    });
  }, [selectedNetwork, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'invoiceItems',
  });

  // Add effect to load payment address
  useEffect(() => {
    const loadPaymentAddress = async () => {
      try {
        const address = await window.api.getWalletAddress();
        if (!address) {
          toast.error('No payment address configured');
          return;
        }
        setPaymentAddress(address);
      } catch (error) {
        console.error('0xHypr', 'Failed to load payment address:', error);
        toast.error('Failed to load payment address');
      }
    };
    loadPaymentAddress();
  }, []);

  const handleSubmit = async (formData: InvoiceFormData) => {
    try {
      if (!paymentAddress) {
        toast.error('Please configure a payment address first');
        return;
      }

      // Reset any previous validation errors
      setValidationErrors([]);

      const data: ExtendedInvoice = {
        meta: {
          format: 'rnf_invoice',
          version: '0.0.3',
        },
        creationDate: formData.creationDate,
        invoiceNumber: formData.invoiceNumber,
        sellerInfo: {
          businessName: formData.sellerInfo.businessName,
          email: formData.sellerInfo.email,
          firstName: formData.sellerInfo.firstName,
          lastName: formData.sellerInfo.lastName,
          phone: formData.sellerInfo.phone,
          address: formData.sellerInfo.address,
          taxRegistration: formData.sellerInfo.taxRegistration,
          miscellaneous: formData.sellerInfo.miscellaneous || {},
        },
        buyerInfo: formData.buyerInfo
          ? {
              ...formData.buyerInfo,
              miscellaneous: formData.buyerInfo.miscellaneous || {},
            }
          : undefined,
        invoiceItems: formData.invoiceItems.map((item) => ({
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
        paymentTerms: formData.paymentTerms
          ? {
              dueDate: formData.paymentTerms.dueDate,
              lateFeesPercent: formData.paymentTerms.lateFeesPercent,
              lateFeesFix: formData.paymentTerms.lateFeesFix,
              miscellaneous: formData.paymentTerms.miscellaneous || {},
            }
          : undefined,
        note: formData.note,
        terms: formData.terms,
        purchaseOrderId: formData.purchaseOrderId,
      };

      // First validate the invoice format
      console.log('0xHypr', 'data', data);
      const validationResult = dataFormat.validate(data);
      console.log('0xHypr', 'validationResult', validationResult);
      if (!validationResult.valid) {
        setValidationErrors(
          validationResult.errors.map((err) => {
            const fieldPath = err.dataPath.replace(/^\./, '');
            const fieldName = fieldPath.split('.').pop() || fieldPath;
            return `${fieldName} at ${fieldPath}: ${err.message}`;
          })
        );
        toast.error('Please fix validation errors before submitting');
        return;
      }

      // Calculate total amount from invoice items
      const totalAmount = data.invoiceItems
        .reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0)
        .toString();

      const payeeAddress = await window.api.getPayeeAddress();

      // Create the request data
      const requestCreateParameters: Partial<Types.ICreateRequestParameters> = {
        requestInfo: {
          currency: CURRENCY_CONFIG.EURe,
          expectedAmount: ethers.utils.parseUnits(totalAmount, 16).toString(),
          payee: {
            type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
            value: payeeAddress,
          },
          timestamp: Utils.getCurrentTimestampInSecond(),
        },
        paymentNetwork: {
          id: CURRENCY_CONFIG.EURe.paymentNetworkId,
          parameters: {
            paymentNetworkName: CURRENCY_CONFIG.EURe.network,
            feeAddress: '0x0000000000000000000000000000000000000000',
            feeAmount: '0',
            paymentAddress: paymentAddress,
          },
        },
        contentData: data,
      };

      const result = await window.api.createInvoiceRequest(
        requestCreateParameters
      );
      console.log('0xHypr', 'result', result);

      if (result.success) {
        const url = await window.api.generateInvoiceUrl(
          result.requestId,
          result.token
        );
        setInvoiceUrl(url);
        setShowSuccessModal(true);
        // Reset form state after successful submission
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to create invoice');
      }
    } catch (error) {
      console.error('0xHypr', 'Failed to create invoice:', error);
      toast.error('Failed to create invoice');
      // Reset loading state on error
      form.reset({ ...form.getValues() });
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="h-full flex flex-col"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0 border-b p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2 min-w-0">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Pencil2Icon className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-xl sm:text-2xl truncate">
                    Invoice #{form.watch('invoiceNumber')}
                  </CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="text-sm text-muted-foreground">
                    Issued on{' '}
                    {new Date(form.watch('creationDate')).toLocaleDateString()}
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading || form.formState.isSubmitting}
                    className="shrink-0"
                  >
                    {isLoading || form.formState.isSubmitting
                      ? 'Creating Invoice...'
                      : 'Create Invoice'}
                  </Button>
                </div>
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

            <CardContent className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto py-6 space-y-8">
                {/* From Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">From</h3>
                    <Button variant="ghost" size="icon">
                      <Pencil2Icon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">BS</span>
                    </div>
                    <FormField
                      control={form.control}
                      name="sellerInfo.email"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Business email"
                              onChange={(e) => onChange(e.target.value)}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="sellerInfo.businessName"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Business name"
                              onChange={(e) => onChange(e.target.value)}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sellerInfo.address.street-address"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Street address"
                              onChange={(e) => onChange(e.target.value)}
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
                        name="sellerInfo.address.locality"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="City"
                                onChange={(e) => onChange(e.target.value)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sellerInfo.address.postal-code"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Postal code"
                                onChange={(e) => onChange(e.target.value)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="sellerInfo.address.region"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="State/Province"
                                onChange={(e) => onChange(e.target.value)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sellerInfo.address.country-name"
                        render={({ field: { onChange, ...field } }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Country"
                                onChange={(e) => onChange(e.target.value)}
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

                {/* Client Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Your client information
                  </h3>

                  <div className="bg-white rounded-lg border p-4">
                    <FormField
                      control={form.control}
                      name="buyerInfo.email"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Client Email (required)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="client@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground mt-1">
                            Invoices for this client will be sent to this email
                            address.
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="buyerInfo.businessName"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Client's Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4 mb-4">
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

                    <div className="grid grid-cols-3 gap-4 mb-4">
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
                      <FormField
                        control={form.control}
                        name="buyerInfo.address.region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region / State</FormLabel>
                            <FormControl>
                              <Input placeholder="Region" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                    </div>

                    <div className="grid grid-cols-3 gap-4">
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
                        name="buyerInfo.address.street-address"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Address Line 1</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Network */}
                <div className="space-y-4">
                  <Label>Payment Network</Label>
                  <PaymentSelector
                    value={selectedNetwork}
                    onChange={setSelectedNetwork}
                  />
                </div>

                {/* Invoice Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Items</Label>
                    <div className="flex items-center gap-4">
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
                            discount: '0',
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
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[300px]">
                              Description
                            </TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Unit Price</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Tax</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
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
                                            field.onChange(
                                              parseFloat(e.target.value) || 0
                                            )
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
                                          pattern="^\d+(\.\d{1,2})?$"
                                          inputMode="decimal"
                                          onChange={(e) => {
                                            const value =
                                              e.target.value.replace(
                                                /[^0-9.]/g,
                                                ''
                                              );
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
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`invoiceItems.${index}.discount`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex items-center w-24">
                                          <Input
                                            {...field}
                                            type="text"
                                            pattern="^\d+(\.\d{1,2})?$"
                                            inputMode="decimal"
                                            onChange={(e) => {
                                              const value =
                                                e.target.value.replace(
                                                  /[^0-9.]/g,
                                                  ''
                                                );
                                              field.onChange(value);
                                            }}
                                            className="w-16"
                                          />
                                          <span className="ml-1 text-sm text-muted-foreground">
                                            %
                                          </span>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`invoiceItems.${index}.tax.amount`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <div className="flex items-center w-24">
                                          <Input
                                            {...field}
                                            type="text"
                                            pattern="^\d+(\.\d{1,2})?$"
                                            inputMode="decimal"
                                            onChange={(e) => {
                                              const value =
                                                e.target.value.replace(
                                                  /[^0-9.]/g,
                                                  ''
                                                );
                                              field.onChange(value);
                                            }}
                                            className="w-16"
                                          />
                                          <span className="ml-1 text-sm text-muted-foreground">
                                            %
                                          </span>
                                        </div>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                {form.getValues(
                                  `invoiceItems.${index}.currency`
                                )}{' '}
                                {(() => {
                                  const quantity = Number(
                                    form.getValues(
                                      `invoiceItems.${index}.quantity`
                                    )
                                  );
                                  const unitPrice = Number(
                                    form.getValues(
                                      `invoiceItems.${index}.unitPrice`
                                    )
                                  );
                                  const discount = Number(
                                    form.getValues(
                                      `invoiceItems.${index}.discount`
                                    ) || 0
                                  );
                                  const tax = Number(
                                    form.getValues(
                                      `invoiceItems.${index}.tax.amount`
                                    ) || 0
                                  );

                                  const subtotal = quantity * unitPrice;
                                  const discountAmount =
                                    subtotal * (discount / 100);
                                  const afterDiscount =
                                    subtotal - discountAmount;
                                  const taxAmount = afterDiscount * (tax / 100);
                                  const total = afterDiscount + taxAmount;

                                  return total.toFixed(2);
                                })()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Total Calculations */}
                  <div className="mt-4 space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        EUR{' '}
                        {form
                          .watch('invoiceItems')
                          .reduce((sum, item) => {
                            return sum + Number(item.unitPrice) * item.quantity;
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Discounts</span>
                      <span>
                        EUR{' '}
                        {form
                          .watch('invoiceItems')
                          .reduce((sum, item) => {
                            const subtotal =
                              Number(item.unitPrice) * item.quantity;
                            const discount = Number(item.discount || 0);
                            return sum + subtotal * (discount / 100);
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax</span>
                      <span>
                        EUR{' '}
                        {form
                          .watch('invoiceItems')
                          .reduce((sum, item) => {
                            const subtotal =
                              Number(item.unitPrice) * item.quantity;
                            const discount = Number(item.discount || 0);
                            const afterDiscount =
                              subtotal - subtotal * (discount / 100);
                            const tax = Number(item.tax?.amount || 0);
                            return sum + afterDiscount * (tax / 100);
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        EUR{' '}
                        {form
                          .watch('invoiceItems')
                          .reduce((sum, item) => {
                            const subtotal =
                              Number(item.unitPrice) * item.quantity;
                            const discount = Number(item.discount || 0);
                            const afterDiscount =
                              subtotal - subtotal * (discount / 100);
                            const tax = Number(item.tax?.amount || 0);
                            return (
                              sum + afterDiscount + afterDiscount * (tax / 100)
                            );
                          }, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="paymentTerms.dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-muted-foreground">
                          If no date is selected or the date is invalid, it will
                          default to {DEFAULT_DUE_DATE_DAYS} days from today
                        </p>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-4">
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

                {/* Terms */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms and Conditions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add your terms and conditions"
                            className="h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Add some bottom padding for better scrolling */}
                <div className="h-8" />
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        url={invoiceUrl}
        onClose={() => {
          setShowSuccessModal(false);
          if (onSubmit) {
            onSubmit(form.getValues() as ExtendedInvoice);
          }
        }}
      />
    </>
  );
}
