'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  FileText, 
  Inbox, 
  ArrowRight, 
  Loader2,
  Info,
  Copy,
  Check,
  Building2,
  Plus
} from 'lucide-react';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Mock parser for initial implementation
const mockParser = (text: string) => {
  // Ignore input text for now; return hardcoded JSON simulating parsed data
  return {
    payments: [
      { date: '2025-02-15', amount_usdc: 500, tx_hash: '0xabc123...def456', description: 'Web development services' },
      { date: '2025-03-20', amount_usdc: 300, tx_hash: '0xdef789...ghi012', description: 'Bug fixes and maintenance' }
    ],
    services: { 
      description: 'Web development and maintenance services',
      hours: 25,
      rate: 20,
      period: 'February - March 2025'
    },
    compliance: { 
      country: 'Mexico',
      tax_id: 'ABC123456789',
      notes: '0% IVA for exported services'
    }
  };
};

export function CreateInvoiceContent() {
  const router = useRouter();
  const [rawText, setRawText] = useState('');
  const [selectedTab, setSelectedTab] = useState('paste');
  const [isParsing, setIsParsing] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  // Fetch inbox cards for the "From Inbox" tab
  const { data: inboxCardsData, isLoading: isLoadingCards } = api.inboxCards.getUserCards.useQuery(
    { limit: 100 },
    { enabled: selectedTab === 'inbox' }
  );
  
  const inboxCards = inboxCardsData?.cards || [];

  // Fetch user's companies
  const { data: companiesData } = api.company.getMyCompanies.useQuery();
  const companies = companiesData || [];

  // Fetch selected company details
  const { data: selectedCompany } = api.company.getCompany.useQuery(
    { id: selectedCompanyId },
    { enabled: !!selectedCompanyId }
  );

  const cryptoReceivedCards = inboxCards?.filter(
    card => card.categories?.includes('crypto_received') || 
            card.categories?.includes('payment_received') ||
            card.icon === 'bank' ||
            card.amount
  ) || [];

  const handleParseAndPreview = async () => {
    if (!rawText.trim() && selectedTab === 'paste') {
      toast.error('Please enter some text to parse');
      return;
    }

    if (selectedCards.length === 0 && selectedTab === 'inbox') {
      toast.error('Please select at least one transaction');
      return;
    }

    setIsParsing(true);
    
    try {
      // Simulate parsing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let parsedData;
      if (selectedTab === 'paste') {
        parsedData = mockParser(rawText);
      } else {
        // Convert selected inbox cards to invoice format
        const selectedTransactions = cryptoReceivedCards.filter(
          card => selectedCards.includes(card.id)
        );
        
        parsedData = {
          payments: selectedTransactions.map(card => ({
            date: new Date(card.createdAt).toISOString().split('T')[0],
            amount_usdc: parseFloat(card.amount || '0'),
            tx_hash: (card.metadata as any)?.transactionHash || 'N/A',
            description: card.title || card.subtitle || 'Payment received'
          })),
          services: {
            description: 'Professional services',
            hours: 0,
            rate: 0,
            period: 'Custom period'
          },
          compliance: {
            country: '',
            tax_id: '',
            notes: ''
          }
        };
      }

      // Add company data if selected
      if (selectedCompany) {
        // Add business data to parsedData
        (parsedData as any).business = {
          name: selectedCompany.name,
          email: selectedCompany.email,
          address: selectedCompany.address || '',
          ein: selectedCompany.taxId || ''
        };
        
        // Add payment terms to compliance if available
        const settings = selectedCompany.settings as any || {};
        if (settings.paymentTerms) {
          parsedData.compliance.notes = `Payment Terms: ${settings.paymentTerms}`;
        }
      }

      // Store in sessionStorage for preview page
      sessionStorage.setItem('invoiceData', JSON.stringify(parsedData));
      sessionStorage.setItem('selectedCompanyId', selectedCompanyId);
      
      // Navigate to preview
      router.push('/dashboard/invoices/preview');
      
    } catch (error) {
      toast.error('Failed to parse invoice data');
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
          Create Retro Invoice
        </h1>
        <p className="text-base text-muted-foreground">
          Generate professional invoices from your transaction history
        </p>
      </motion.div>

      {/* Company Selector Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Select Company
            </CardTitle>
            <CardDescription>
              Choose which company this invoice is for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Company</Label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {company.name}
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="new">
                      <div className="flex items-center gap-2 text-primary">
                        <Plus className="h-4 w-4" />
                        Create New Company
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCompany && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">{selectedCompany.name}</p>
                      <p className="text-xs">{selectedCompany.email}</p>
                      {(selectedCompany.settings as any)?.address && (
                        <p className="text-xs">{(selectedCompany.settings as any).address}</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {selectedCompanyId === 'new' && (
                <Alert>
                  <AlertDescription>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => router.push('/dashboard/settings/company')}
                    >
                      Go to Company Settings →
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Invoice Data Source</CardTitle>
            <CardDescription>
              Choose how to import your transaction data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="paste" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="inbox" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  From Inbox
                </TabsTrigger>
              </TabsList>

              <TabsContent value="paste" className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Raw Transaction Data
                  </label>
                  <Textarea
                    placeholder="Paste your transaction details, payment history, or any unstructured text here...

Example:
- Feb 15: Received $500 USDC for web development (tx: 0xabc123...)
- Mar 20: Received $300 USDC for bug fixes (tx: 0xdef789...)
- Services: 25 hours @ $20/hour
- Tax ID: ABC123456789"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Our AI will parse and structure this into a professional invoice
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Tip: Include transaction hashes, dates, amounts, and service descriptions for best results
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="inbox" className="space-y-4 mt-6">
                {isLoadingCards ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : cryptoReceivedCards.length === 0 ? (
                  <div className="text-center py-8">
                    <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No payment transactions found in your inbox
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select transactions to include in your invoice:
                    </p>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                      {cryptoReceivedCards.map((card) => (
                        <div
                          key={card.id}
                          onClick={() => toggleCardSelection(card.id)}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            selectedCards.includes(card.id)
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">
                                  ${card.amount} {card.currency || 'USDC'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(card.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {card.title || card.subtitle || 'Payment received'}
                              </p>
                              {(card.metadata as any)?.transactionHash && (
                                <p className="text-xs font-mono text-muted-foreground mt-1">
                                  {((card.metadata as any).transactionHash as string).slice(0, 10)}...
                                </p>
                              )}
                            </div>
                            <div className="ml-4">
                              {selectedCards.includes(card.id) && (
                                <Check className="h-5 w-5 text-primary" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium">
                        Selected: {selectedCards.length} transaction{selectedCards.length !== 1 ? 's' : ''}
                      </p>
                      {selectedCards.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Total: ${cryptoReceivedCards
                            .filter(card => selectedCards.includes(card.id))
                            .reduce((sum, card) => sum + parseFloat(card.amount || '0'), 0)
                            .toFixed(2)} USDC
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleParseAndPreview}
                disabled={isParsing || (selectedTab === 'paste' ? !rawText.trim() : selectedCards.length === 0)}
                size="lg"
                className="min-w-[200px]"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    Parse & Preview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Paste transaction details or select from your inbox</li>
              <li>2. Our AI parses and structures the data</li>
              <li>3. Review and edit the generated invoice</li>
              <li>4. Choose batching strategy (if multiple payments)</li>
              <li>5. Add business details and generate PDF</li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}