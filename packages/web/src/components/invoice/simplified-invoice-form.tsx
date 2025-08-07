'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api, api as trpc } from '@/trpc/react';
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
import { Plus, Trash2, Loader2, Building2, Save, Users, User, Check } from 'lucide-react';

// Simplified form data interface
interface SimpleInvoiceFormData {
  // Invoice details
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  
  // Seller info (your information)
  sellerBusinessName: string;
  sellerEmail: string;
  sellerAddress: string;
  sellerCity: string;
  sellerPostalCode: string;
  sellerCountry: string;
  
  // Buyer info (client information)  
  buyerBusinessName: string;
  buyerEmail: string;
  buyerAddress: string;
  buyerCity: string;
  buyerPostalCode: string;
  buyerCountry: string;
  
  // Payment details
  paymentType: 'crypto' | 'fiat';
  currency: string;
  network: string;
  
  // Bank details for fiat payments
  bankAccountType?: 'us' | 'iban';
  bankAccountHolder?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankIban?: string;
  bankBic?: string;
  
  // Notes
  note: string;
  terms: string;
}

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: string;
  tax: number;
}

const defaultFormData: SimpleInvoiceFormData = {
  invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  
  sellerBusinessName: '',
  sellerEmail: '',
  sellerAddress: '',
  sellerCity: '',
  sellerPostalCode: '',
  sellerCountry: '',
  
  buyerBusinessName: '',
  buyerEmail: '',
  buyerAddress: '',
  buyerCity: '',
  buyerPostalCode: '',
  buyerCountry: '',
  
  paymentType: 'crypto',
  currency: 'USDC',
  network: 'base',
  
  note: '',
  terms: 'Payment due within 30 days',
};

const defaultItems: InvoiceItem[] = [
  {
    id: Date.now(),
    name: '',
    quantity: 1,
    unitPrice: '0',
    tax: 0,
  }
];

interface SimplifiedInvoiceFormProps {
  extractedData?: any; // Data from AI extraction
}

export function SimplifiedInvoiceForm({ extractedData }: SimplifiedInvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SimpleInvoiceFormData>(defaultFormData);
  const [items, setItems] = useState<InvoiceItem[]>(defaultItems);
  
  // Load last selected profiles from localStorage
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastSelectedCompanyId') || '';
    }
    return '';
  });
  
  // Fetch user's companies for the integrated selector
  const { data: companies = [] } = api.company.getMyCompanies.useQuery();
  
  // Fetch selected company details
  const { data: selectedCompany } = api.company.getCompany.useQuery(
    { id: selectedCompanyId },
    { enabled: !!selectedCompanyId }
  );
  
  // Fetch user's saved preferences
  const { data: savedPreferences, refetch: refetchPreferences } = api.invoicePreferences.getActivePreferences.useQuery();
  
  // Fetch all companies
  const { data: allCompanies = [], refetch: refetchCompanies } = api.company.getAllCompanies.useQuery();
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lastSelectedClientId') || '';
    }
    return '';
  });
  const selectedClient = allCompanies.find((c: any) => c.id === selectedClientId);
  
  // Save preferences mutation
  const savePreferences = api.invoicePreferences.savePreferences.useMutation({
    onSuccess: () => {
      toast.success('Default information saved!');
      refetchPreferences();
    },
    onError: () => {
      toast.error('Failed to save defaults');
    }
  });
  
  // Save client company mutation
  const saveClientCompany = api.company.saveClientCompany.useMutation({
    onSuccess: () => {
      toast.success('Client company saved!');
      refetchCompanies();
    },
    onError: () => {
      toast.error('Failed to save client company');
    }
  });

  // Create invoice mutation
  const createInvoiceMutation = trpc.invoice.create.useMutation({
    onSuccess: (result) => {
      toast.dismiss('invoice-creation');
      toast.success('Invoice created successfully!');
      setIsSubmitting(false);
      router.push(`/dashboard/invoices/${result.invoiceId}`);
    },
    onError: (error: any) => {
      toast.dismiss('invoice-creation');
      toast.error(`Failed to create invoice: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Save selected profiles to localStorage
  useEffect(() => {
    if (selectedCompanyId && typeof window !== 'undefined') {
      localStorage.setItem('lastSelectedCompanyId', selectedCompanyId);
    }
  }, [selectedCompanyId]);
  
  useEffect(() => {
    if (selectedClientId && typeof window !== 'undefined') {
      localStorage.setItem('lastSelectedClientId', selectedClientId);
    }
  }, [selectedClientId]);

  // Load saved preferences on mount
  useEffect(() => {
    if (savedPreferences && !selectedCompanyId) {
      console.log('📋 Loading saved preferences:', savedPreferences);
      
      setFormData(prev => ({
        ...prev,
        sellerBusinessName: savedPreferences.defaultSellerName || prev.sellerBusinessName,
        sellerEmail: savedPreferences.defaultSellerEmail || prev.sellerEmail,
        sellerAddress: savedPreferences.defaultSellerAddress || prev.sellerAddress,
        sellerCity: savedPreferences.defaultSellerCity || prev.sellerCity,
        sellerPostalCode: savedPreferences.defaultSellerPostalCode || prev.sellerPostalCode,
        sellerCountry: savedPreferences.defaultSellerCountry || prev.sellerCountry,
        terms: savedPreferences.defaultTerms || prev.terms,
        note: savedPreferences.defaultNotes || prev.note,
        currency: savedPreferences.defaultCurrency || prev.currency,
        paymentType: (savedPreferences.defaultPaymentType as 'crypto' | 'fiat') || prev.paymentType,
        network: savedPreferences.defaultNetwork || prev.network,
      }));
    }
  }, [savedPreferences]);

  // Apply company data when it changes
  useEffect(() => {
    if (selectedCompany) {
      const settings = selectedCompany.settings as any || {};
      console.log('🏢 Applying company data:', selectedCompany);
      
      setFormData(prev => ({
        ...prev,
        // Prefill seller info with company data
        sellerBusinessName: selectedCompany.name || prev.sellerBusinessName,
        sellerEmail: selectedCompany.email || prev.sellerEmail,
        sellerAddress: settings.address ? settings.address.split('\n')[0] || '' : prev.sellerAddress,
        sellerCity: settings.address ? settings.address.split('\n')[1]?.split(',')[0]?.trim() || '' : prev.sellerCity,
        sellerPostalCode: settings.address ? settings.address.match(/\d{5}/)?.[0] || '' : prev.sellerPostalCode,
        sellerCountry: settings.address ? settings.address.split('\n').pop()?.trim() || '' : prev.sellerCountry,
        
        // Apply payment terms if available
        terms: settings.paymentTerms || prev.terms,
      }));
    } else if (!selectedCompanyId && savedPreferences) {
      // Load saved preferences when no company is selected
      setFormData(prev => ({
        ...prev,
        sellerBusinessName: savedPreferences.defaultSellerName || '',
        sellerEmail: savedPreferences.defaultSellerEmail || '',
        sellerAddress: savedPreferences.defaultSellerAddress || '',
        sellerCity: savedPreferences.defaultSellerCity || '',
        sellerPostalCode: savedPreferences.defaultSellerPostalCode || '',
        sellerCountry: savedPreferences.defaultSellerCountry || '',
      }));
    }
  }, [selectedCompany, selectedCompanyId, savedPreferences]);

  // Apply client data when it changes
  useEffect(() => {
    if (selectedClient) {
      console.log('👤 Applying client data:', selectedClient);
      
      setFormData(prev => ({
        ...prev,
        buyerBusinessName: selectedClient.businessName || selectedClient.name || prev.buyerBusinessName,
        buyerEmail: selectedClient.email || prev.buyerEmail,
        buyerAddress: selectedClient.address || prev.buyerAddress,
        buyerCity: selectedClient.city || prev.buyerCity,
        buyerPostalCode: selectedClient.postalCode || prev.buyerPostalCode,
        buyerCountry: selectedClient.country || prev.buyerCountry,
      }));
    }
  }, [selectedClient, selectedClientId]);

  // Apply extracted data when it changes
  useEffect(() => {
    if (extractedData) {
      console.log('🔥 Applying extracted data:', extractedData);
      
      const updatedFormData: SimpleInvoiceFormData = {
        ...formData,
        
        // Invoice details
        invoiceNumber: extractedData.invoiceNumber || formData.invoiceNumber,
        issueDate: extractedData.issuedAt ? extractedData.issuedAt.slice(0, 10) : formData.issueDate,
        dueDate: extractedData.dueDate ? extractedData.dueDate.slice(0, 10) : formData.dueDate,
        
        // Seller info (from extracted data)
        sellerBusinessName: extractedData.sellerInfo?.businessName || formData.sellerBusinessName,
        sellerEmail: extractedData.sellerInfo?.email || formData.sellerEmail,
        sellerAddress: extractedData.sellerInfo?.address || formData.sellerAddress,
        sellerCity: extractedData.sellerInfo?.city || formData.sellerCity,
        sellerPostalCode: extractedData.sellerInfo?.postalCode || formData.sellerPostalCode,
        sellerCountry: extractedData.sellerInfo?.country || formData.sellerCountry,
        
        // Buyer info (from extracted data)
        buyerBusinessName: extractedData.buyerInfo?.businessName || formData.buyerBusinessName,
        buyerEmail: extractedData.buyerInfo?.email || formData.buyerEmail,
        buyerAddress: extractedData.buyerInfo?.address || formData.buyerAddress,
        buyerCity: extractedData.buyerInfo?.city || formData.buyerCity,
        buyerPostalCode: extractedData.buyerInfo?.postalCode || formData.buyerPostalCode,
        buyerCountry: extractedData.buyerInfo?.country || formData.buyerCountry,
        
        // Payment details
        currency: extractedData.currency || formData.currency,
        paymentType: extractedData.paymentType || (extractedData.currency === 'EUR' ? 'fiat' : 'crypto'),
        
        // Bank details
        ...(extractedData.bankDetails && {
          bankAccountHolder: extractedData.bankDetails.accountHolder,
          bankName: extractedData.bankDetails.bankName,
          bankAccountNumber: extractedData.bankDetails.accountNumber,
          bankRoutingNumber: extractedData.bankDetails.routingNumber,
          bankIban: extractedData.bankDetails.iban,
          bankBic: extractedData.bankDetails.bic || extractedData.bankDetails.swiftCode,
          bankAccountType: extractedData.bankDetails.routingNumber ? 'us' : 'iban',
        }),
        
        // Notes
        note: extractedData.note || extractedData.paymentInstructions || formData.note,
        terms: extractedData.terms || formData.terms,
      };
      
      setFormData(updatedFormData);
      
      // Apply invoice items
      if (extractedData.invoiceItems && extractedData.invoiceItems.length > 0) {
        const extractedItems: InvoiceItem[] = extractedData.invoiceItems.map((item: any, index: number) => ({
          id: Date.now() + index,
          name: item.name || item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || '0',
          tax: item.tax || 0,
        }));
        setItems(extractedItems);
      }
      
      console.log('✅ Applied form data:', updatedFormData);
    }
  }, [extractedData]);

  const updateFormData = (field: keyof SimpleInvoiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      name: '',
      quantity: 1,
      unitPrice: '0',
      tax: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) {
      toast.info('You must have at least one item.');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, [field]: field === 'quantity' ? Math.max(1, Number(value)) : value }
        : item
    ));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const tax = Number(item.tax) || 0;
      return sum + (quantity * unitPrice * (1 + tax / 100));
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

    setIsSubmitting(true);
    toast.loading('Creating invoice...', { id: 'invoice-creation' });

    // Prepare invoice data for backend
    const invoiceData = {
      meta: { format: 'rnf_invoice', version: '0.0.3' },
      creationDate: new Date(formData.issueDate).toISOString(),
      invoiceNumber: formData.invoiceNumber,
      network: formData.network,
      companyId: selectedCompanyId || undefined, // Include company ID if selected
      recipientCompanyId: selectedClientId || undefined, // Include recipient company ID if selected
      
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
      
      invoiceItems: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: formData.currency,
        tax: {
          type: 'percentage' as const,
          amount: item.tax.toString(),
        },
      })),
      
      paymentTerms: {
        dueDate: new Date(formData.dueDate).toISOString(),
      },
      
      note: formData.note,
      terms: formData.terms,
      currency: formData.currency,
      paymentType: formData.paymentType,
      
      // Add payment method for crypto payments
      ...(formData.paymentType === 'crypto' && {
        paymentMethod: 'crypto' as 'crypto',
        paymentAddress: '', // This form doesn't collect crypto address
      }),
      
      // Bank details for fiat payments
      ...(formData.paymentType === 'fiat' && {
        paymentMethod: 'ach' as 'ach',
        bankDetails: {
          accountType: formData.bankAccountType || 'us',
          accountHolder: formData.bankAccountHolder || '',
          bankName: formData.bankName || '',
          accountNumber: formData.bankAccountNumber || '',
          routingNumber: formData.bankRoutingNumber || '',
          iban: formData.bankIban || '',
          bic: formData.bankBic || '',
          bankAddress: '', // Add if needed
        }
      }),
    };

    console.log('📤 Submitting invoice:', invoiceData);
    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900">Creating Invoice...</p>
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
                onChange={(e) => updateFormData('invoiceNumber', e.target.value)}
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

        {/* Seller Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Details</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Your business information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Integrated Profile Selector */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="profile-select" className="text-sm font-medium mb-2 block">
                    Select Profile
                  </Label>
                  <Select 
                    value={selectedCompanyId || "personal"} 
                    onValueChange={(value) => {
                      const newCompanyId = value === "personal" ? "" : value;
                      setSelectedCompanyId(newCompanyId);
                    }}
                  >
                    <SelectTrigger id="profile-select" className="w-full bg-white">
                      <SelectValue placeholder="Select a profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium">Personal Profile</div>
                            {savedPreferences && (
                              <div className="text-xs text-muted-foreground">
                                {savedPreferences.defaultSellerName || savedPreferences.defaultSellerEmail || "No saved defaults"}
                              </div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <div className="flex-1">
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {company.email}
                              </div>
                              {company.role === 'owner' && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                                  Owner
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {!selectedCompanyId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        savePreferences.mutate({
                          defaultSellerName: formData.sellerBusinessName,
                          defaultSellerEmail: formData.sellerEmail,
                          defaultSellerAddress: formData.sellerAddress,
                          defaultSellerCity: formData.sellerCity,
                          defaultSellerPostalCode: formData.sellerPostalCode,
                          defaultSellerCountry: formData.sellerCountry,
                          defaultPaymentTerms: formData.terms,
                          defaultCurrency: formData.currency,
                          defaultPaymentType: formData.paymentType,
                          defaultNetwork: formData.network,
                          defaultNotes: formData.note,
                          defaultTerms: formData.terms,
                        });
                      }}
                      disabled={savePreferences.isPending}
                    >
                      {savePreferences.isPending ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Save className="h-3 w-3 mr-1" />
                      )}
                      Save as Default
                    </Button>
                  )}
                  {companies.length === 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dashboard/settings/company')}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create Company
                    </Button>
                  )}
                </div>
              </div>
              {savedPreferences && !selectedCompanyId && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Using saved defaults
                </div>
              )}
              {selectedCompany && (
                <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Using {selectedCompany.name} company data
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sellerBusinessName">Business Name</Label>
                <Input
                  id="sellerBusinessName"
                  value={formData.sellerBusinessName}
                  onChange={(e) => updateFormData('sellerBusinessName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sellerEmail">Email Address</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  value={formData.sellerEmail}
                  onChange={(e) => updateFormData('sellerEmail', e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="sellerAddress">Address</Label>
                <Input
                  id="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={(e) => updateFormData('sellerAddress', e.target.value)}
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
                  onChange={(e) => updateFormData('sellerPostalCode', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sellerCountry">Country</Label>
                <Input
                  id="sellerCountry"
                  value={formData.sellerCountry}
                  onChange={(e) => updateFormData('sellerCountry', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buyer Info */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Bill To</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Your client's information</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Integrated Client Profile Selector */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label htmlFor="client-select" className="text-sm font-medium mb-2 block">
                    Select Client Profile
                  </Label>
                  <Select 
                    value={selectedClientId || "new"} 
                    onValueChange={(value) => {
                      const newClientId = value === "new" ? "" : value;
                      setSelectedClientId(newClientId);
                    }}
                  >
                    <SelectTrigger id="client-select" className="w-full bg-white">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          <div className="flex-1">
                            <div className="font-medium">New Client</div>
                            <div className="text-xs text-muted-foreground">
                              Enter client details manually
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                      {allCompanies.map((company: any) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <div className="flex-1">
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {company.email}
                              </div>
                              {company.relationship && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                  {company.relationship === 'owner' ? 'My Company' : 
                                   company.relationship === 'member' ? 'Member' : 
                                   'Client'}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {!selectedClientId && formData.buyerEmail && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        saveClientCompany.mutate({
                          email: formData.buyerEmail,
                          name: formData.buyerBusinessName,
                          address: formData.buyerAddress,
                          city: formData.buyerCity,
                          postalCode: formData.buyerPostalCode,
                          country: formData.buyerCountry,
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
                  )}
                </div>
              </div>
              {selectedClient && (
                <div className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Using {selectedClient.businessName || selectedClient.name} profile
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buyerBusinessName">Business Name</Label>
                <Input
                  id="buyerBusinessName"
                  value={formData.buyerBusinessName}
                  onChange={(e) => updateFormData('buyerBusinessName', e.target.value)}
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
                  onChange={(e) => updateFormData('buyerAddress', e.target.value)}
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
                  onChange={(e) => updateFormData('buyerPostalCode', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="buyerCountry">Country</Label>
                <Input
                  id="buyerCountry"
                  value={formData.buyerCountry}
                  onChange={(e) => updateFormData('buyerCountry', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment & Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value: 'crypto' | 'fiat') => updateFormData('paymentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="fiat">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => updateFormData('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.paymentType === 'crypto' ? (
                      <>
                        <SelectItem value="USDC">USDC on Base</SelectItem>
                        <SelectItem value="ETH">ETH on Base</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bank Details for Fiat Payments */}
            {formData.paymentType === 'fiat' && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Bank Transfer Details</h4>
                  <Select
                    value={formData.bankAccountType || 'us'}
                    onValueChange={(value: 'us' | 'iban') => updateFormData('bankAccountType', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">US ACH</SelectItem>
                      <SelectItem value="iban">IBAN</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankAccountHolder">Account Holder</Label>
                    <Input
                      id="bankAccountHolder"
                      value={formData.bankAccountHolder || ''}
                      onChange={(e) => updateFormData('bankAccountHolder', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName || ''}
                      onChange={(e) => updateFormData('bankName', e.target.value)}
                    />
                  </div>
                  
                  {formData.bankAccountType === 'us' ? (
                    // US ACH fields
                    <>
                      <div>
                        <Label htmlFor="bankAccountNumber">Account Number</Label>
                        <Input
                          id="bankAccountNumber"
                          value={formData.bankAccountNumber || ''}
                          onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bankRoutingNumber">Routing Number</Label>
                        <Input
                          id="bankRoutingNumber"
                          value={formData.bankRoutingNumber || ''}
                          onChange={(e) => updateFormData('bankRoutingNumber', e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    // IBAN fields
                    <>
                      <div>
                        <Label htmlFor="bankIban">IBAN</Label>
                        <Input
                          id="bankIban"
                          value={formData.bankIban || ''}
                          onChange={(e) => updateFormData('bankIban', e.target.value)}
                          placeholder="DE89 3704 0044 0532 0130 00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bankBic">BIC/SWIFT</Label>
                        <Input
                          id="bankBic"
                          value={formData.bankBic || ''}
                          onChange={(e) => updateFormData('bankBic', e.target.value)}
                          placeholder="DEUTDEFF"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Invoice Items
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`item-name-${item.id}`}>Description</Label>
                    <Input
                      id={`item-name-${item.id}`}
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Item description"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-quantity-${item.id}`}>Qty</Label>
                    <Input
                      id={`item-quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-price-${item.id}`}>Price</Label>
                    <Input
                      id={`item-price-${item.id}`}
                      type="text"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`item-tax-${item.id}`}>Tax %</Label>
                    <Input
                      id={`item-tax-${item.id}`}
                      type="number"
                      value={item.tax}
                      onChange={(e) => updateItem(item.id, 'tax', e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="mt-6 flex justify-end">
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: {formData.currency} {calculateTotal().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Terms</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="note">Note to Client</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => updateFormData('note', e.target.value)}
                rows={3}
                placeholder="Thank you for your business"
              />
            </div>
            <div>
              <Label htmlFor="terms">Terms and Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => updateFormData('terms', e.target.value)}
                rows={3}
                placeholder="Payment terms, late fees, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || createInvoiceMutation.isPending} size="lg">
            {(isSubmitting || createInvoiceMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Invoice...
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