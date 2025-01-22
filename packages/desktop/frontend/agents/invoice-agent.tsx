import { Agent, RecognizedContext, AgentType } from './base-agent';
import * as React from 'react';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import requestLogo from '@/assets/request-req-logo.png';
import { InvoiceForm } from '@/components/invoice-form';
import { useAsyncInvoice } from './async-invoice-agent';
import { Loader2, Copy, Plus, Trash2 } from 'lucide-react';
import { Invoice, ActorInfo, PaymentTerms } from '@requestnetwork/data-format';
import { AgentStepsView } from '@/components/agent-steps-view';
import { InvoiceList } from '@/components/invoice-list';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BusinessInfo extends Omit<ActorInfo, 'miscellaneous'> {
  miscellaneous?: Record<string, unknown>;
}

interface ExtendedInvoice extends Omit<Invoice, 'sellerInfo' | 'buyerInfo'> {
  sellerInfo: BusinessInfo;
  buyerInfo?: BusinessInfo;
}

interface ExtendedPaymentTerms extends Omit<PaymentTerms, 'miscellaneous'> {
  miscellaneous?: Record<string, unknown>;
}

interface InvoiceAgentUIProps {
  context: RecognizedContext;
  onSuccess?: () => void;
}

const RequestLogo = ({ className }: { className?: string }) => (
  <img
    src={requestLogo}
    alt="Request Network"
    width={20}
    height={20}
    className={className}
  />
);

const PaymentAddressSection = () => {
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const address = await window.api.getWalletAddress();
        if (address) {
          setAddress(address);
        } else {
          // If no address is set, show a message
          toast.error('Please configure a payment address');
        }
      } catch (error) {
        console.error('0xHypr', 'Error loading wallet address:', error);
        toast.error('Failed to load wallet address');
      } finally {
        setIsLoading(false);
      }
    };
    loadAddress();
  }, []);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast.success('Payment address copied to clipboard');
    } catch (error) {
      console.error('0xHypr', 'Error copying address:', error);
      toast.error('Failed to copy address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading payment address...</span>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="flex flex-col gap-2">
        <Label>Payment Address</Label>
        <p className="text-sm text-destructive">
          No payment address configured. Please add one in the Payment Configuration section.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>Payment Address</Label>
      <div className="flex items-center gap-2">
        <Input 
          value={address} 
          readOnly 
          className="font-mono text-sm"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={copyAddress}
          title="Copy address"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        This address will be used to receive payments for your invoices
      </p>
    </div>
  );
};

const PaymentConfig = () => {
  const [addresses, setAddresses] = useState<Array<{ address: string; isDefault: boolean }>>([]);
  const [newAddress, setNewAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const savedAddresses = await window.api.getWalletAddresses();
        setAddresses(savedAddresses);
      } catch (error) {
        console.error('0xHypr', 'Error loading wallet addresses:', error);
        toast.error('Failed to load wallet addresses');
      } finally {
        setIsLoading(false);
      }
    };
    loadAddresses();
  }, []);

  const addAddress = async () => {
    if (!newAddress) return;
    
    try {
      // Validate the address
      if (!newAddress.startsWith('0x') || newAddress.length !== 42) {
        throw new Error('Invalid Ethereum address');
      }

      await window.api.addWalletAddress(newAddress);
      const updatedAddresses = await window.api.getWalletAddresses();
      setAddresses(updatedAddresses);
      setNewAddress('');
      toast.success('Address added successfully');
    } catch (error) {
      console.error('0xHypr', 'Error adding address:', error);
      toast.error('Failed to add address: Invalid format');
    }
  };

  const removeAddress = async (addressToRemove: string) => {
    try {
      await window.api.removeWalletAddress(addressToRemove);
      const updatedAddresses = await window.api.getWalletAddresses();
      setAddresses(updatedAddresses);
      toast.success('Address removed');
    } catch (error) {
      console.error('0xHypr', 'Error removing address:', error);
      toast.error('Failed to remove address');
    }
  };

  const setDefaultAddress = async (address: string) => {
    try {
      await window.api.setDefaultWalletAddress(address);
      const updatedAddresses = await window.api.getWalletAddresses();
      setAddresses(updatedAddresses);
      toast.success('Default payment address updated');
    } catch (error) {
      console.error('0xHypr', 'Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <span>Loading payment configuration...</span>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Payment Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Add New Payment Address</Label>
            <div className="flex gap-2">
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
              <Button onClick={addAddress} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Payment Addresses</Label>
            <RadioGroup
              value={addresses.find(a => a.isDefault)?.address}
              onValueChange={setDefaultAddress}
            >
              {addresses.map(({ address, isDefault }) => (
                <div key={address} className="flex items-center space-x-2 space-y-1">
                  <RadioGroupItem value={address} id={address} />
                  <Label htmlFor={address} className="flex-1 font-mono text-sm">
                    {address}
                  </Label>
                  {!isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAddress(address)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          <p className="text-xs text-muted-foreground">
            The selected address will be used as the default payment address for new invoices
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const InvoiceAgentUI: React.FC<InvoiceAgentUIProps> = ({
  context,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const { result, processInvoice, isProcessing } = useAsyncInvoice(context.id);

  // Start processing only when modal opens
  useEffect(() => {
    if (open && !result && !isProcessing) {
      console.log('0xHypr', 'Modal opened, starting invoice processing', {
        contextId: context.id,
        vitalInfo: context.vitalInformation,
      });
      processInvoice(context.vitalInformation);
    }
  }, [open, context, processInvoice, result, isProcessing]);

  // Transform the invoice data to match the InvoiceForm's expected format
  const formDefaultValues = React.useMemo(() => {
    console.log('0xHypr', 'Computing form default values from result:', result);

    if (!result?.data?.invoice) {
      console.log('0xHypr', 'No invoice data available yet');
      return undefined;
    }

    const invoice = result.data.invoice as ExtendedInvoice;
    console.log('0xHypr', 'Transforming invoice data:', invoice);

    // Transform buyerInfo to ensure miscellaneous is a Record<string, unknown>
    const transformedBuyerInfo: BusinessInfo | undefined = invoice.buyerInfo
      ? {
          businessName: invoice.buyerInfo.businessName || '',
          email: invoice.buyerInfo.email,
          firstName: invoice.buyerInfo.firstName,
          lastName: invoice.buyerInfo.lastName,
          phone: invoice.buyerInfo.phone,
          address: invoice.buyerInfo.address,
          taxRegistration: invoice.buyerInfo.taxRegistration,
          miscellaneous: {},
        }
      : undefined;

    const transformedValues: Partial<ExtendedInvoice> = {
      sellerInfo: {
        businessName: invoice.sellerInfo?.businessName || '',
        email: invoice.sellerInfo?.email || '',
        firstName: invoice.sellerInfo?.firstName || '',
        lastName: invoice.sellerInfo?.lastName || '',
        phone: invoice.sellerInfo?.phone || '',
        address: invoice.sellerInfo?.address || {},
        taxRegistration: invoice.sellerInfo?.taxRegistration || '',
        miscellaneous: invoice.sellerInfo?.miscellaneous || {},
      },
      buyerInfo: transformedBuyerInfo,
      invoiceItems:
        invoice.invoiceItems?.map((item) => ({
          name: item.name || 'Untitled Item',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || '0',
          currency: item.currency || 'ETH',
          tax: {
            type: item.tax?.type || 'percentage',
            amount: item.tax?.amount || '0',
          },
          reference: item.reference || '',
          deliveryDate: item.deliveryDate || new Date().toISOString(),
          deliveryPeriod: item.deliveryPeriod || '',
        })) || [],
      paymentTerms: invoice.paymentTerms
        ? ({
            dueDate: invoice.paymentTerms.dueDate,
            lateFeesPercent: invoice.paymentTerms.lateFeesPercent,
            lateFeesFix: invoice.paymentTerms.lateFeesFix,
            miscellaneous: {},
          } as ExtendedPaymentTerms)
        : undefined,
      note: invoice.note || '',
      terms: invoice.terms || '',
      purchaseOrderId: invoice.purchaseOrderId,
    };

    console.log('0xHypr', 'Transformed form values:', transformedValues);
    return transformedValues;
  }, [result?.data?.invoice]);

  const handleOpenChange = (newOpen: boolean) => {
    console.log('0xHypr', 'Dialog open state changing:', {
      from: open,
      to: newOpen,
      hasResult: !!result,
      isProcessing,
    });
    setOpen(newOpen);
  };

  const handleSubmit = async () => {
    console.log('0xHypr', 'Invoice form submitted, closing dialog');
    onSuccess?.();
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">Invoice Request</h3>
            <RequestLogo className="opacity-80 shrink-0" />
          </div>
          <p className="text-sm text-muted-foreground truncate">{context.title}</p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={isProcessing} className="shrink-0">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : result?.success ? (
                'Open Invoice'
              ) : (
                'Prepare Invoice'
              )}
            </Button>
          </DialogTrigger>
          {open && (
            <DialogContent className="max-w-[90vw] h-[90vh] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b shrink-0">
                  <h2 className="text-lg font-semibold truncate">Invoice Details</h2>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => processInvoice(context.vitalInformation)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Reprocessing...
                        </>
                      ) : (
                        <>
                          <Loader2 className="mr-2 h-4 w-4" />
                          Reprocess Invoice
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-1 overflow-hidden">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <InvoiceForm
                      defaultValues={formDefaultValues}
                      onSubmit={handleSubmit}
                      isLoading={isProcessing}
                    />
                  </div>
                  <div className="w-[350px] border-l flex flex-col overflow-hidden">
                    <div className="p-4 border-b shrink-0">
                      <PaymentAddressSection />
                    </div>
                    <div className="flex-1 overflow-auto">
                      <AgentStepsView
                        recognizedItemId={context.id}
                        className="h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </div>
  );
};

export const InvoiceAgent: Agent = {
  id: 'invoice-agent',
  name: 'Invoice Manager',
  displayName: () => (
    <div className="flex items-center gap-2 ">
      <RequestLogo />
      Invoice Manager
    </div>
  ),
  description:
    'Automatically processes and creates invoices from detected content',
  type: 'invoice' as AgentType,
  isActive: true,
  isReady: true,
  detectorPrompt: 'Search invoice data starting with "Invoice" and recent and expanding to include all relevant data',
  miniApp: () => (
    <div className="space-y-4 p-4 dark">
      <PaymentConfig />
      <InvoiceList />
    </div>
  ),

  eventAction(
    context: RecognizedContext,
    onSuccess?: () => void
  ): React.ReactNode {
    return <InvoiceAgentUI context={context} onSuccess={onSuccess} />;
  },
};
