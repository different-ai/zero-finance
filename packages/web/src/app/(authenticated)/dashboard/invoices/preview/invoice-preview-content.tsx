'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Download, 
  Share2, 
  Edit, 
  Save,
  AlertCircle,
  Building,
  User,
  Calendar,
  DollarSign,
  Hash,
  Globe,
  CreditCard,
  Copy,
  Check,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import CryptoJS from 'crypto-js';
import { usePrivy } from '@privy-io/react-auth';
import { api } from '@/trpc/react';

interface Payment {
  date: string;
  amount_usdc: number;
  tx_hash: string;
  description?: string;
}

interface InvoiceData {
  payments: Payment[];
  services: {
    description: string;
    hours: number;
    rate: number;
    period: string;
  };
  compliance: {
    country: string;
    tax_id: string;
    notes: string;
  };
  contractor?: {
    name: string;
    email: string;
    address?: string;
  };
  business?: {
    name: string;
    ein: string;
    address: string;
    email?: string;
  };
}

const ENCRYPTION_KEY = 'retroinvoice-mvp-key'; // TODO: Use proper key management

export function InvoicePreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = usePrivy();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [batchingStrategy, setBatchingStrategy] = useState<'individual' | 'monthly' | 'all'>('individual');
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Load virtual account details for auto-fill
  const { data: fundingSources } = api.align.getVirtualAccountDetails.useQuery();

  useEffect(() => {
    // Check if we have a token in URL (shared link)
    const token = searchParams.get('token');
    if (token) {
      try {
        const decrypted = decryptData(token);
        setInvoiceData(decrypted);
        setIsBusinessMode(true); // Shared links are for business review
      } catch (error) {
        toast.error('Invalid or expired invoice link');
        router.push('/dashboard/invoices');
      }
    } else {
      // Load from sessionStorage (contractor creating)
      const stored = sessionStorage.getItem('invoiceData');
      const storedCompanyId = sessionStorage.getItem('selectedCompanyId');
      if (stored) {
        setInvoiceData(JSON.parse(stored));
        setIsEditing(true); // Allow editing for creator
        if (storedCompanyId) {
          setSelectedCompanyId(storedCompanyId);
        }
      } else {
        toast.error('No invoice data found');
        router.push('/dashboard/invoices/create');
      }
    }
  }, [searchParams, router]);

  const encryptData = (data: InvoiceData) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  };

  const decryptData = (token: string) => {
    const bytes = CryptoJS.AES.decrypt(token, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const generateShareLink = () => {
    if (!invoiceData) return;

    const token = encryptData(invoiceData);
    const encodedToken = encodeURIComponent(token);
    const link = `${window.location.origin}/invoice/preview/${encodedToken}`;
    
    setShareLink(link);
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success('Share link copied to clipboard!');
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    sessionStorage.setItem('invoiceData', JSON.stringify(invoiceData));
    setIsEditing(false);
    toast.success('Invoice saved');
  };

  const getBatchedPayments = () => {
    if (!invoiceData) return [];

    const payments = invoiceData.payments;
    
    switch (batchingStrategy) {
      case 'all':
        return [{
          date: `${payments[0]?.date} - ${payments[payments.length - 1]?.date}`,
          amount_usdc: payments.reduce((sum, p) => sum + p.amount_usdc, 0),
          tx_hash: 'Multiple transactions',
          description: 'Batched payments'
        }];
      
      case 'monthly':
        const grouped = payments.reduce((acc, payment) => {
          const month = payment.date.substring(0, 7); // YYYY-MM
          if (!acc[month]) acc[month] = [];
          acc[month].push(payment);
          return acc;
        }, {} as Record<string, Payment[]>);
        
        return Object.entries(grouped).map(([month, monthPayments]) => ({
          date: month,
          amount_usdc: monthPayments.reduce((sum, p) => sum + p.amount_usdc, 0),
          tx_hash: `${monthPayments.length} transactions`,
          description: `Monthly batch for ${month}`
        }));
      
      default:
        return payments;
    }
  };

  const handleGeneratePDF = () => {
    // This will be implemented in the next iteration
    toast.info('PDF generation coming in next update!');
  };

  if (!invoiceData) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading invoice data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayPayments = getBatchedPayments();
  const totalAmount = invoiceData.payments.reduce((sum, p) => sum + p.amount_usdc, 0);

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Invoice Preview</h1>
          <p className="text-muted-foreground mt-1">
            {isBusinessMode ? 'Review and finalize invoice' : 'Edit and share your invoice'}
          </p>
        </div>
        <div className="flex gap-2">
          {!isBusinessMode && (
            <>
              {isEditing ? (
                <Button onClick={handleSave} variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
              <Button onClick={generateShareLink}>
                <Share2 className="mr-2 h-4 w-4" />
                Share with Business
              </Button>
            </>
          )}
          {isBusinessMode && (
            <Button onClick={handleGeneratePDF}>
              <Download className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
          )}
        </div>
      </motion.div>

      {/* Share Link Alert */}
      {shareLink && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Alert>
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">Share this link with your client:</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {shareLink.substring(0, 50)}...
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Invoice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Retroactive Invoice</CardTitle>
            <CardDescription>
              Invoice for services rendered • Total: ${totalAmount.toFixed(2)} USDC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Contractor Details */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Contractor Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={invoiceData.contractor?.name || ''}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, name: e.target.value } as any
                    })}
                    disabled={!isEditing}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={invoiceData.contractor?.email || user?.email?.address || ''}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      contractor: { ...invoiceData.contractor, email: e.target.value } as any
                    })}
                    disabled={!isEditing}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Details (for business mode) */}
            {isBusinessMode && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Business Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={invoiceData.business?.name || ''}
                        onChange={(e) => setInvoiceData({
                          ...invoiceData,
                          business: { ...invoiceData.business, name: e.target.value } as any
                        })}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <Label>EIN/Tax ID</Label>
                      <Input
                        value={invoiceData.business?.ein || ''}
                        onChange={(e) => setInvoiceData({
                          ...invoiceData,
                          business: { ...invoiceData.business, ein: e.target.value } as any
                        })}
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <Textarea
                        value={invoiceData.business?.address || ''}
                        onChange={(e) => setInvoiceData({
                          ...invoiceData,
                          business: { ...invoiceData.business, address: e.target.value } as any
                        })}
                        placeholder="Business address"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Batching Strategy */}
            {invoiceData.payments.length > 1 && (
              <>
                <div>
                  <h3 className="font-semibold mb-3">Invoice Batching</h3>
                  <Select
                    value={batchingStrategy}
                    onValueChange={(value: any) => setBatchingStrategy(value)}
                    disabled={!isEditing && !isBusinessMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">One invoice per payment</SelectItem>
                      <SelectItem value="monthly">Monthly batches</SelectItem>
                      <SelectItem value="all">Single invoice for all</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator />
              </>
            )}

            {/* Payments */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payments ({displayPayments.length})
              </h3>
              <div className="space-y-2">
                {displayPayments.map((payment, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">${payment.amount_usdc.toFixed(2)} USDC</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.date} • {payment.description || 'Payment'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-muted-foreground">
                          {payment.tx_hash.length > 20 
                            ? `${payment.tx_hash.substring(0, 10)}...` 
                            : payment.tx_hash}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Services Rendered
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={invoiceData.services.description}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      services: { ...invoiceData.services, description: e.target.value }
                    })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Hours</Label>
                    <Input
                      type="number"
                      value={invoiceData.services.hours}
                      onChange={(e) => setInvoiceData({
                        ...invoiceData,
                        services: { ...invoiceData.services, hours: Number(e.target.value) }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Rate ($/hr)</Label>
                    <Input
                      type="number"
                      value={invoiceData.services.rate}
                      onChange={(e) => setInvoiceData({
                        ...invoiceData,
                        services: { ...invoiceData.services, rate: Number(e.target.value) }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Period</Label>
                    <Input
                      value={invoiceData.services.period}
                      onChange={(e) => setInvoiceData({
                        ...invoiceData,
                        services: { ...invoiceData.services, period: e.target.value }
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Compliance */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Tax & Compliance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country</Label>
                  <Input
                    value={invoiceData.compliance.country}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      compliance: { ...invoiceData.compliance, country: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Tax ID</Label>
                  <Input
                    value={invoiceData.compliance.tax_id}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      compliance: { ...invoiceData.compliance, tax_id: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Compliance Notes</Label>
                  <Textarea
                    value={invoiceData.compliance.notes}
                    onChange={(e) => setInvoiceData({
                      ...invoiceData,
                      compliance: { ...invoiceData.compliance, notes: e.target.value }
                    })}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a retroactive invoice for documentation purposes. Please consult with a tax professional 
            to ensure compliance with your local regulations. Zero Finance does not provide tax or legal advice.
          </AlertDescription>
        </Alert>
      </motion.div>
    </div>
  );
}