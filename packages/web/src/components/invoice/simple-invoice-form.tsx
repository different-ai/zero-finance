'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Save, User } from 'lucide-react';
import { PaymentDetailsForm } from './payment-details-form';

// Invoice form data interface
interface InvoiceFormData {
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;

  // Seller info (from profile)
  sellerBusinessName: string;
  sellerEmail: string;
  sellerAddress: string;
  sellerCity: string;
  sellerPostalCode: string;
  sellerCountry: string;
  sellerTaxId: string;

  // Buyer info (from profile)
  buyerBusinessName: string;
  buyerEmail: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  buyerCountry: string;
  buyerTaxId: string;

  // Payment details
  paymentMethod: string;
  paymentAddress: string;
  paymentTerms: string;
  cryptoOption?: string; // Track selected crypto option
  network?: string; // Track network for crypto payments
  currency?: string; // Track currency
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankIban?: string;
  bankBic?: string;
  bankName?: string;
  bankAddress?: string;

  // Notes
  note: string;
}

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: string;
  tax: number;
}

const defaultFormData: InvoiceFormData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10),

  sellerBusinessName: '',
  sellerEmail: '',
  sellerAddress: '',
  sellerCity: '',
  sellerPostalCode: '',
  sellerCountry: '',
  sellerTaxId: '',

  buyerBusinessName: '',
  buyerEmail: '',
  buyerAddress: '',
  buyerCity: '',
  buyerPostalCode: '',
  buyerCountry: '',
  buyerTaxId: '',

  paymentMethod: 'usdc', // Default to crypto payment
  currency: 'USD', // Default currency
  network: 'mainnet', // Default network
  paymentAddress: '',
  paymentTerms: 'Payment due within 30 days',
  bankAccountHolder: '',
  bankAccountNumber: '',
  bankRoutingNumber: '',
  bankIban: '',
  bankBic: '',
  bankName: '',
  bankAddress: '',

  note: '',
};

const PAYMENT_OPTIONS = [
  {
    value: 'usdc-solana',
    label: 'USDC on Solana',
    network: 'solana',
    currency: 'USDC',
  },
  {
    value: 'usdc-base',
    label: 'USDC on Base',
    network: 'base',
    currency: 'USDC',
  },
  {
    value: 'usdc-ethereum',
    label: 'USDC on Ethereum',
    network: 'ethereum',
    currency: 'USDC',
  },
  { value: 'eth', label: 'ETH', network: 'ethereum', currency: 'ETH' },
  { value: 'fiat', label: 'Bank Transfer', network: 'fiat', currency: 'USD' },
];

export function SimpleInvoiceForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InvoiceFormData>(defaultFormData);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: Date.now(), name: '', quantity: 1, unitPrice: '0', tax: 0 },
  ]);

  // Track original company data to detect modifications
  const [originalSenderData, setOriginalSenderData] = useState<any>(null);
  const [originalRecipientData, setOriginalRecipientData] = useState<any>(null);
  const [senderModified, setSenderModified] = useState(false);
  const [recipientModified, setRecipientModified] = useState(false);

  // Fetch user's companies to check if they're a contractor
  const { data: myCompanies = [] } = api.company.getMyCompanies.useQuery();

  // Check if user is a contractor (member, not owner) of any company
  const contractorCompany = myCompanies.find((c: any) => c.role === 'member');

  // Load last selected profiles from localStorage, or use contractor's company
  const [selectedSenderProfileId, setSelectedSenderProfileId] =
    useState<string>(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('lastSelectedSenderProfileId') || '';
      }
      return '';
    });

  const [selectedRecipientProfileId, setSelectedRecipientProfileId] =
    useState<string>(() => {
      if (typeof window !== 'undefined') {
        // If user is a contractor, prefill with their company
        if (contractorCompany) {
          return contractorCompany.id;
        }
        return localStorage.getItem('lastSelectedRecipientProfileId') || '';
      }
      return '';
    });

  // Fetch all companies (unified list for both sender and recipient)
  const { data: allCompanies = [], refetch: refetchCompanies } =
    api.company.getAllCompanies.useQuery();

  const selectedSenderCompany = allCompanies.find(
    (c: any) => c.id === selectedSenderProfileId,
  );
  const selectedRecipientCompany = allCompanies.find(
    (c: any) => c.id === selectedRecipientProfileId,
  );

  // Save client company mutation
  const saveClientCompany = api.company.saveClientCompany.useMutation({
    onSuccess: (company) => {
      toast.success('Company saved!');
      refetchCompanies();
      // Auto-select the newly saved company based on context
      if (selectedSenderProfileId === 'pending') {
        setSelectedSenderProfileId(company.id);
      } else {
        setSelectedRecipientProfileId(company.id);
      }
    },
  });

  // Update company mutation
  const updateCompany = api.company.updateCompany.useMutation({
    onSuccess: () => {
      toast.success('Company updated!');
      refetchCompanies();
      setSenderModified(false);
      setRecipientModified(false);
    },
    onError: (error) => {
      toast.error(`Failed to update company: ${error.message}`);
    },
  });

  // Create invoice mutation
  const createInvoiceMutation = api.invoice.create.useMutation({
    onSuccess: (result) => {
      toast.success('Invoice created successfully!');
      setIsSubmitting(false);
      router.push(`/dashboard/invoices/${result.invoiceId}`);
    },
    onError: (error: any) => {
      toast.error(`Failed to create invoice: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Auto-prefill recipient if user is a contractor
  useEffect(() => {
    if (contractorCompany && !selectedRecipientProfileId) {
      setSelectedRecipientProfileId(contractorCompany.id);
      toast.info(`Bill-to prefilled with ${contractorCompany.name}`);
    }
  }, [contractorCompany]);

  // Save selected profiles to localStorage
  useEffect(() => {
    if (selectedSenderProfileId && typeof window !== 'undefined') {
      localStorage.setItem(
        'lastSelectedSenderProfileId',
        selectedSenderProfileId,
      );
    }
  }, [selectedSenderProfileId]);

  useEffect(() => {
    if (selectedRecipientProfileId && typeof window !== 'undefined') {
      localStorage.setItem(
        'lastSelectedRecipientProfileId',
        selectedRecipientProfileId,
      );
    }
  }, [selectedRecipientProfileId]);

  // Apply sender company data
  useEffect(() => {
    if (selectedSenderCompany) {
      const companyData = {
        sellerBusinessName: selectedSenderCompany.name || '',
        sellerEmail: selectedSenderCompany.email || '',
        sellerAddress: selectedSenderCompany.address || '',
        sellerCity: selectedSenderCompany.city || '',
        sellerPostalCode: selectedSenderCompany.postalCode || '',
        sellerCountry: selectedSenderCompany.country || '',
        sellerTaxId: selectedSenderCompany.taxId || '',
        paymentAddress: selectedSenderCompany.paymentAddress || '',
      };

      setFormData((prev) => ({ ...prev, ...companyData }));
      setOriginalSenderData(companyData);
      setSenderModified(false);
    } else {
      setOriginalSenderData(null);
      setSenderModified(false);
    }
  }, [selectedSenderCompany]);

  // Apply recipient company data
  useEffect(() => {
    if (selectedRecipientCompany) {
      const companyData = {
        buyerBusinessName: selectedRecipientCompany.name || '',
        buyerEmail: selectedRecipientCompany.email || '',
        buyerAddress: selectedRecipientCompany.address || '',
        buyerCity: selectedRecipientCompany.city || '',
        buyerPostalCode: selectedRecipientCompany.postalCode || '',
        buyerCountry: selectedRecipientCompany.country || '',
        buyerTaxId: selectedRecipientCompany.taxId || '',
      };

      setFormData((prev) => ({ ...prev, ...companyData }));
      setOriginalRecipientData(companyData);
      setRecipientModified(false);
    } else {
      setOriginalRecipientData(null);
      setRecipientModified(false);
    }
  }, [selectedRecipientCompany]);

  // Detect sender modifications
  useEffect(() => {
    if (
      originalSenderData &&
      selectedSenderProfileId &&
      selectedSenderProfileId !== 'pending'
    ) {
      const hasChanges =
        formData.sellerBusinessName !== originalSenderData.sellerBusinessName ||
        formData.sellerEmail !== originalSenderData.sellerEmail ||
        formData.sellerAddress !== originalSenderData.sellerAddress ||
        formData.sellerCity !== originalSenderData.sellerCity ||
        formData.sellerPostalCode !== originalSenderData.sellerPostalCode ||
        formData.sellerCountry !== originalSenderData.sellerCountry ||
        formData.sellerTaxId !== originalSenderData.sellerTaxId ||
        formData.paymentAddress !== originalSenderData.paymentAddress;
      setSenderModified(hasChanges);
    }
  }, [formData, originalSenderData, selectedSenderProfileId]);

  // Detect recipient modifications
  useEffect(() => {
    if (originalRecipientData && selectedRecipientProfileId) {
      const hasChanges =
        formData.buyerBusinessName !==
          originalRecipientData.buyerBusinessName ||
        formData.buyerEmail !== originalRecipientData.buyerEmail ||
        formData.buyerAddress !== originalRecipientData.buyerAddress ||
        formData.buyerCity !== originalRecipientData.buyerCity ||
        formData.buyerPostalCode !== originalRecipientData.buyerPostalCode ||
        formData.buyerCountry !== originalRecipientData.buyerCountry ||
        formData.buyerTaxId !== originalRecipientData.buyerTaxId;
      setRecipientModified(hasChanges);
    }
  }, [formData, originalRecipientData, selectedRecipientProfileId]);

  const updateFormData = (field: any, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: '', quantity: 1, unitPrice: '0', tax: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) {
      toast.info('You must have at least one item.');
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'quantity' ? Math.max(1, Number(value)) : value,
            }
          : item,
      ),
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const tax = Number(item.tax) || 0;
      return sum + quantity * unitPrice * (1 + tax / 100);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || createInvoiceMutation.isPending) return;

    // Validate required fields
    if (!formData.sellerEmail || !formData.buyerEmail) {
      toast.error('Seller and buyer email addresses are required.');
      return;
    }

    if (!formData.paymentAddress && formData.paymentMethod !== 'fiat') {
      toast.error('Payment address is required for crypto payments.');
      return;
    }

    setIsSubmitting(true);

    // Get payment details from selected method
    const selectedPayment =
      formData.paymentMethod === 'ach' || formData.paymentMethod === 'sepa'
        ? {
            value: 'fiat',
            label: 'Bank Transfer',
            network: 'mainnet',
            currency: formData.currency || 'USD',
          }
        : formData.paymentMethod === 'crypto'
          ? {
              value: 'crypto',
              label: 'Cryptocurrency',
              network: formData.network || 'base',
              currency: formData.currency || 'USDC',
            }
          : PAYMENT_OPTIONS.find((p) => p.value === formData.paymentMethod);

    // Prepare invoice data
    console.log('DEBUG: Form submission data:', {
      paymentMethod: formData.paymentMethod as
        | 'crypto'
        | 'ach'
        | 'sepa'
        | undefined,
      paymentAddress: formData.paymentAddress,
      paymentType:
        formData.paymentMethod === 'ach' || formData.paymentMethod === 'sepa'
          ? 'fiat'
          : 'crypto',
      currency: formData.currency,
      network: formData.network,
      cryptoOption: formData.cryptoOption,
      bankDetails: formData.bankAccountHolder || formData.bankIban,
    });
    const invoiceData = {
      meta: { format: 'rnf_invoice', version: '0.0.3' },
      creationDate: new Date(formData.issueDate).toISOString(),
      invoiceNumber: formData.invoiceNumber,
      currency: formData.currency || selectedPayment?.currency || 'USD',
      network: formData.network || selectedPayment?.network || 'mainnet',
      companyId: selectedSenderProfileId || undefined,
      recipientCompanyId: selectedRecipientProfileId || undefined,

      sellerInfo: {
        businessName: formData.sellerBusinessName,
        email: formData.sellerEmail,
        address: {
          'street-address': formData.sellerAddress,
          locality: formData.sellerCity,
          'postal-code': formData.sellerPostalCode,
          'country-name': formData.sellerCountry,
        },
      },

      buyerInfo: {
        businessName: formData.buyerBusinessName,
        email: formData.buyerEmail,
        address: {
          'street-address': formData.buyerAddress,
          locality: formData.buyerCity,
          'postal-code': formData.buyerPostalCode,
          'country-name': formData.buyerCountry,
        },
      },

      invoiceItems: items.map((item) => ({
        name: item.name || 'Service',
        currency: selectedPayment?.currency || 'USDC',
        quantity: Number(item.quantity),
        unitPrice: item.unitPrice.toString(),
        tax: {
          amount: item.tax.toString(),
          type: 'percentage' as const,
        },
      })),

      payment: {
        type: selectedPayment?.network === 'fiat' ? 'fiat' : 'crypto',
        currency: formData.currency || selectedPayment?.currency || 'USD',
        network: formData.network || selectedPayment?.network || 'mainnet',
        address: formData.paymentAddress,
      },

      // Add payment details at top level for display
      paymentType: (formData.paymentMethod === 'ach' ||
      formData.paymentMethod === 'sepa'
        ? 'fiat'
        : 'crypto') as 'fiat' | 'crypto',
      paymentMethod: formData.paymentMethod as
        | 'crypto'
        | 'ach'
        | 'sepa'
        | undefined,
      paymentAddress: formData.paymentAddress,

      // Add bank details if payment method is ACH or SEPA
      ...((formData.paymentMethod === 'ach' ||
        formData.paymentMethod === 'sepa') && {
        bankDetails: {
          accountHolder: formData.bankAccountHolder,
          accountNumber: formData.bankAccountNumber,
          routingNumber: formData.bankRoutingNumber,
          iban: formData.bankIban,
          bic: formData.bankBic,
          swiftCode: formData.bankBic,
          bankName: formData.bankName,
          bankAddress: formData.bankAddress,
        },
      }),

      paymentTerms: {
        dueDate: new Date(formData.dueDate).toISOString(),
      },
      note: formData.note,
      total: calculateTotal(),
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <div className="relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">
                Creating Invoice...
              </p>
              <p className="text-sm text-gray-600">This may take a moment</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  updateFormData('invoiceNumber', e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => updateFormData('issueDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => updateFormData('dueDate', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Bill From */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Bill From
              {senderModified && (
                <span className="text-xs text-orange-600 font-normal">
                  (modified)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label
                htmlFor="sender-profile"
                className="text-sm font-medium mb-2 block"
              >
                Select Sender Company
              </Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Select
                    value={selectedSenderProfileId || 'personal'}
                    onValueChange={(value) => {
                      if (value === 'personal') {
                        setSelectedSenderProfileId('');
                        // Clear form for manual entry
                        setFormData((prev) => ({
                          ...prev,
                          sellerBusinessName: '',
                          sellerEmail: '',
                          sellerAddress: '',
                          sellerCity: '',
                          sellerPostalCode: '',
                          sellerCountry: '',
                          paymentAddress: '',
                        }));
                      } else {
                        setSelectedSenderProfileId(value);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="sender-profile"
                      className="w-full bg-white"
                    >
                      <SelectValue placeholder="Select or enter manually">
                        {selectedSenderProfileId === 'personal' ||
                        !selectedSenderProfileId ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Manual Entry</span>
                          </div>
                        ) : selectedSenderCompany ? (
                          <div className="flex items-center gap-2 truncate">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {selectedSenderCompany.name}
                            </span>
                          </div>
                        ) : (
                          'Select or enter manually'
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Manual Entry</span>
                        </div>
                      </SelectItem>
                      {allCompanies.length > 0 ? (
                        allCompanies.map((company: any) => (
                          <SelectItem key={company.id} value={company.id}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <div>
                                <div className="font-medium">
                                  {company.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {company.email}
                                </div>
                                {company.relationship && (
                                  <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded ml-1">
                                    {company.relationship === 'owner'
                                      ? 'My Company'
                                      : company.relationship === 'member'
                                        ? 'Member'
                                        : 'Client'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="create-company" disabled>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Plus className="h-4 w-4" />
                            <span>No companies yet - create one below</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-shrink-0">
                  {selectedSenderProfileId && senderModified ? (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                          if (selectedSenderCompany) {
                            updateCompany.mutate({
                              id: selectedSenderCompany.id,
                              name: formData.sellerBusinessName,
                              email: formData.sellerEmail,
                              address: formData.sellerAddress,
                              city: formData.sellerCity,
                              postalCode: formData.sellerPostalCode,
                              country: formData.sellerCountry,
                              taxId: formData.sellerTaxId,
                              paymentAddress: formData.paymentAddress,
                            });
                          }
                        }}
                        disabled={updateCompany.isPending}
                      >
                        {updateCompany.isPending ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3 mr-1" />
                        )}
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          saveClientCompany.mutate({
                            name: formData.sellerBusinessName,
                            email: formData.sellerEmail,
                            address: formData.sellerAddress,
                            city: formData.sellerCity,
                            postalCode: formData.sellerPostalCode,
                            country: formData.sellerCountry,
                            taxId: formData.sellerTaxId,
                            paymentAddress: formData.paymentAddress,
                          });
                          setSelectedSenderProfileId('pending');
                        }}
                        disabled={saveClientCompany.isPending}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Save as New
                      </Button>
                    </div>
                  ) : !selectedSenderProfileId && formData.sellerEmail ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        saveClientCompany.mutate({
                          name: formData.sellerBusinessName,
                          email: formData.sellerEmail,
                          address: formData.sellerAddress,
                          city: formData.sellerCity,
                          postalCode: formData.sellerPostalCode,
                          country: formData.sellerCountry,
                          taxId: formData.sellerTaxId,
                          paymentAddress: formData.paymentAddress,
                        });
                        setSelectedSenderProfileId('pending');
                      }}
                      disabled={saveClientCompany.isPending}
                    >
                      {saveClientCompany.isPending ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3 mr-1" />
                      )}
                      Save Company
                    </Button>
                  ) : !selectedSenderProfileId ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dashboard/settings/company')}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Create Company
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sellerBusinessName">Business Name</Label>
                <Input
                  id="sellerBusinessName"
                  value={formData.sellerBusinessName}
                  onChange={(e) =>
                    updateFormData('sellerBusinessName', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="sellerEmail">Email Address</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={formData.sellerEmail}
                  onChange={(e) =>
                    updateFormData('sellerEmail', e.target.value)
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="sellerAddress">Address</Label>
                <Input
                  id="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={(e) =>
                    updateFormData('sellerAddress', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="sellerCity">City</Label>
                <Input
                  id="sellerCity"
                  value={formData.sellerCity}
                  onChange={(e) => updateFormData('sellerCity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sellerPostalCode">Postal Code</Label>
                <Input
                  id="sellerPostalCode"
                  value={formData.sellerPostalCode}
                  onChange={(e) =>
                    updateFormData('sellerPostalCode', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="sellerCountry">Country</Label>
                <Input
                  id="sellerCountry"
                  value={formData.sellerCountry}
                  onChange={(e) =>
                    updateFormData('sellerCountry', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="sellerTaxId">Tax ID</Label>
                <Input
                  id="sellerTaxId"
                  value={formData.sellerTaxId}
                  onChange={(e) =>
                    updateFormData('sellerTaxId', e.target.value)
                  }
                  placeholder="Optional"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bill To */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Bill To
              {recipientModified && (
                <span className="text-xs text-orange-600 font-normal">
                  (modified)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <Label
                htmlFor="recipient-profile"
                className="text-sm font-medium mb-2 block"
              >
                Select Recipient Company
              </Label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Select
                    value={selectedRecipientProfileId || 'new-client'}
                    onValueChange={(value) => {
                      if (value === 'new-client') {
                        setSelectedRecipientProfileId('');
                        // Clear form for manual entry
                        setFormData((prev) => ({
                          ...prev,
                          buyerBusinessName: '',
                          buyerEmail: '',
                          buyerAddress: '',
                          buyerCity: '',
                          buyerPostalCode: '',
                          buyerCountry: '',
                        }));
                      } else {
                        setSelectedRecipientProfileId(value);
                      }
                    }}
                  >
                    <SelectTrigger
                      id="recipient-profile"
                      className="w-full bg-white"
                    >
                      <SelectValue placeholder="Select or enter manually">
                        {selectedRecipientProfileId === 'new-client' ||
                        !selectedRecipientProfileId ? (
                          <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            <span>Manual Entry</span>
                          </div>
                        ) : selectedRecipientCompany ? (
                          <div className="flex items-center gap-2 truncate">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {selectedRecipientCompany.name}
                            </span>
                          </div>
                        ) : (
                          'Select or enter manually'
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-client">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <span>Manual Entry</span>
                        </div>
                      </SelectItem>
                      {allCompanies.length > 0 ? (
                        allCompanies.map((company: any) => (
                          <SelectItem key={company.id} value={company.id}>
                            {/*  make it improtant the color  */}
                            <div className="flex items-center gap-2 hover:text-white ">
                              <User className="h-4 w-4" />
                              <div>
                                <div className="font-medium">
                                  {company.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {company.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  {company.relationship && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-1 py-0.5 rounded">
                                      {company.relationship === 'owner'
                                        ? 'My Company'
                                        : company.relationship === 'member'
                                          ? 'Member'
                                          : 'Client'}
                                    </span>
                                  )}
                                  {company.lastUsedAt && (
                                    <span className="text-xs text-gray-500">
                                      Last:{' '}
                                      {new Date(
                                        company.lastUsedAt,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-companies" disabled>
                          <div className="text-muted-foreground text-sm">
                            No saved companies yet
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-shrink-0">
                  {selectedRecipientProfileId && recipientModified ? (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                          if (selectedRecipientCompany) {
                            updateCompany.mutate({
                              id: selectedRecipientCompany.id,
                              name: formData.buyerBusinessName,
                              email: formData.buyerEmail,
                              address: formData.buyerAddress,
                              city: formData.buyerCity,
                              postalCode: formData.buyerPostalCode,
                              country: formData.buyerCountry,
                              taxId: formData.buyerTaxId,
                            });
                          }
                        }}
                        disabled={updateCompany.isPending}
                      >
                        {updateCompany.isPending ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Save className="h-3 w-3 mr-1" />
                        )}
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          saveClientCompany.mutate({
                            name: formData.buyerBusinessName,
                            email: formData.buyerEmail,
                            address: formData.buyerAddress,
                            city: formData.buyerCity,
                            postalCode: formData.buyerPostalCode,
                            country: formData.buyerCountry,
                            taxId: formData.buyerTaxId,
                          });
                        }}
                        disabled={saveClientCompany.isPending}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Save as New
                      </Button>
                    </div>
                  ) : !selectedRecipientProfileId && formData.buyerEmail ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        saveClientCompany.mutate({
                          name: formData.buyerBusinessName,
                          email: formData.buyerEmail,
                          address: formData.buyerAddress,
                          city: formData.buyerCity,
                          postalCode: formData.buyerPostalCode,
                          country: formData.buyerCountry,
                          taxId: formData.buyerTaxId,
                        });
                      }}
                      disabled={saveClientCompany.isPending}
                    >
                      {saveClientCompany.isPending ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3 mr-1" />
                      )}
                      Save Client
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerBusinessName">Business Name</Label>
                <Input
                  id="buyerBusinessName"
                  value={formData.buyerBusinessName}
                  onChange={(e) =>
                    updateFormData('buyerBusinessName', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="buyerEmail">Email Address</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={formData.buyerEmail}
                  onChange={(e) => updateFormData('buyerEmail', e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="buyerAddress">Address</Label>
                <Input
                  id="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={(e) =>
                    updateFormData('buyerAddress', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="buyerCity">City</Label>
                <Input
                  id="buyerCity"
                  value={formData.buyerCity}
                  onChange={(e) => updateFormData('buyerCity', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buyerPostalCode">Postal Code</Label>
                <Input
                  id="buyerPostalCode"
                  value={formData.buyerPostalCode}
                  onChange={(e) =>
                    updateFormData('buyerPostalCode', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="buyerCountry">Country</Label>
                <Input
                  id="buyerCountry"
                  value={formData.buyerCountry}
                  onChange={(e) =>
                    updateFormData('buyerCountry', e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="buyerTaxId">Tax ID</Label>
                <Input
                  id="buyerTaxId"
                  value={formData.buyerTaxId}
                  onChange={(e) => updateFormData('buyerTaxId', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoice Items</CardTitle>
              <Button
                type="button"
                onClick={addItem}
                size="sm"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 items-end"
                >
                  <div className="col-span-4">
                    <Label>Description</Label>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, 'name', e.target.value)
                      }
                      placeholder="Service or product"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', e.target.value)
                      }
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, 'unitPrice', e.target.value)
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Tax (%)</Label>
                    <Input
                      type="number"
                      value={item.tax}
                      onChange={(e) =>
                        updateItem(item.id, 'tax', e.target.value)
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      size="sm"
                      variant="ghost"
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    Total: ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <PaymentDetailsForm
          formData={formData}
          updateFormData={updateFormData}
        />

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.note}
              onChange={(e) => updateFormData('note', e.target.value)}
              placeholder="Any additional information..."
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createInvoiceMutation.isPending}
          >
            {isSubmitting || createInvoiceMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Invoice'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
