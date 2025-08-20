'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import {
  Loader2,
  Upload,
  FileText,
  DollarSign,
  Link2,
  Check,
  X,
  FileUp,
  RefreshCw,
  Trash2,
  Hash,
  Sparkles,
  Building2,
  Brain,
  AlertTriangle,
  Settings,
  Database,
  Info,
  MessageSquare,
  Send,
  CheckCircle,
  Mail,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Mock GL Codes (Chart of Accounts)
const mockGLCodes = [
  { code: '1000', name: 'Cash and Bank', category: 'Assets' },
  { code: '1200', name: 'Accounts Receivable', category: 'Assets' },
  { code: '2000', name: 'Accounts Payable', category: 'Liabilities' },
  { code: '3000', name: 'Revenue', category: 'Revenue' },
  { code: '4000', name: 'Cost of Goods Sold', category: 'COGS' },
  { code: '5000', name: 'Operating Expenses', category: 'Expenses' },
  { code: '5100', name: 'Marketing & Advertising', category: 'Expenses' },
  { code: '5200', name: 'Software & Subscriptions', category: 'Expenses' },
  { code: '5300', name: 'Professional Services', category: 'Expenses' },
  { code: '5400', name: 'Office Supplies', category: 'Expenses' },
  { code: '5500', name: 'Travel & Entertainment', category: 'Expenses' },
  { code: '5600', name: 'Utilities', category: 'Expenses' },
  { code: '6000', name: 'Payroll', category: 'Expenses' },
  { code: '7000', name: 'Interest & Fees', category: 'Other' },
];

// Mock company context
const mockCompanyContext = {
  companyName: '',
  industry: '',
  fiscalYearEnd: '',
  accountingMethod: 'accrual',
  defaultPaymentTerms: '30',
  preferredVendors: [] as string[],
  automationRules: [] as any[],
};

export default function ReconciliationPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('transactions');
  const [isUploadingCSV, setIsUploadingCSV] = useState(false);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [companyContextOpen, setCompanyContextOpen] = useState(false);
  const [companyContext, setCompanyContext] = useState(mockCompanyContext);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [transactionGLCodes, setTransactionGLCodes] = useState<
    Record<
      string,
      string | { code: string; confidence: number; reason?: string }
    >
  >({});
  const [invoiceGLCodes, setInvoiceGLCodes] = useState<
    Record<
      string,
      string | { code: string; confidence: number; reason?: string }
    >
  >({});
  const [contextRequests, setContextRequests] = useState<any[]>([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedRequestItem, setSelectedRequestItem] = useState<any>(null);
  const [clarifiedItems, setClarifiedItems] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  const { data: transactions, refetch: refetchTransactions } =
    api.reconciliation.getTransactions.useQuery({ limit: 100 });

  const { data: invoices, refetch: refetchInvoices } =
    api.reconciliation.getInvoices.useQuery({ limit: 100 });

  const { data: matches, refetch: refetchMatches } =
    api.reconciliation.getMatches.useQuery({ status: 'suggested' });

  // Mutations
  const syncXero = api.reconciliation.syncXero.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Synced ${data.imported} transactions from Xero`,
      });
      refetchTransactions();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const syncGmail = api.reconciliation.syncGmail.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Imported ${data.imported} invoices from Gmail`,
      });
      refetchInvoices();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const importCSV = api.reconciliation.importTransactionsCSV.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Imported ${data.imported} transactions`,
      });
      refetchTransactions();
      setCsvDialogOpen(false);
      setCsvContent('');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const uploadInvoice = api.reconciliation.uploadInvoice.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Invoice uploaded and parsed successfully',
      });
      refetchInvoices();
      setInvoiceDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const proposeMatches = api.reconciliation.proposeMatches.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Proposed ${data.suggested} matches`,
      });
      refetchMatches();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const confirmMatch = api.reconciliation.confirmMatch.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Match confirmed',
      });
      refetchMatches();
    },
  });

  const rejectMatch = api.reconciliation.rejectMatch.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Match rejected',
      });
      refetchMatches();
    },
  });

  const deleteTransaction = api.reconciliation.deleteTransaction.useMutation({
    onSuccess: () => {
      refetchTransactions();
      toast({
        title: 'Success',
        description: 'Transaction deleted',
      });
    },
  });

  const deleteInvoice = api.reconciliation.deleteInvoice.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Invoice deleted',
      });
      refetchInvoices();
    },
  });

  const deleteAllTransactions =
    api.reconciliation.deleteAllTransactions.useMutation({
      onSuccess: (data) => {
        toast({
          title: 'Success',
          description: `Deleted ${data.deletedCount} transactions`,
        });
        refetchTransactions();
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  const deleteAllInvoices = api.reconciliation.deleteAllInvoices.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Deleted ${data.deletedCount} invoices`,
      });
      refetchInvoices();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const createContextRequest =
    api.reconciliation.createContextRequest.useMutation({
      onSuccess: (data) => {
        toast({
          title: 'Context Request Sent',
          description: 'Client will receive notification with questions',
        });
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      },
    });

  // Mutation to create a match between transaction and invoice
  // TODO: Implement createManualMatch mutation in reconciliation router
  // const createManualMatch = api.reconciliation.createManualMatch.useMutation({
  //   onSuccess: () => {
  //     refetchMatches();
  //     refetchTransactions();
  //     refetchInvoices();
  //   },
  // });

  const { data: pendingRequests } =
    api.reconciliation.getContextRequests.useQuery({
      status: 'pending',
    });

  // File handlers
  const handleCSVFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvContent(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleInvoiceFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingInvoice(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];

      await uploadInvoice.mutateAsync({
        fileBase64: base64,
        fileName: file.name,
        fileType: file.type,
      });

      setIsUploadingInvoice(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImportCSV = async () => {
    if (!csvContent) {
      toast({
        title: 'Error',
        description: 'Please paste or upload CSV content',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingCSV(true);
    await importCSV.mutateAsync({
      csvContent,
      source: 'manual_upload',
    });
    setIsUploadingCSV(false);
  };

  // Handle GL code assignment
  const handleAssignGLCode = (
    entityId: string,
    glCode: string,
    type: 'transaction' | 'invoice',
  ) => {
    if (type === 'transaction') {
      setTransactionGLCodes((prev) => ({ ...prev, [entityId]: glCode }));
    } else {
      setInvoiceGLCodes((prev) => ({ ...prev, [entityId]: glCode }));
    }
    toast({
      title: 'GL Code Assigned',
      description: `Assigned GL ${glCode} to ${type}`,
    });
  };

  // Get suggested GL code based on vendor/description
  const getSuggestedGLCode = (vendor?: string, description?: string) => {
    if (!vendor && !description) return null;

    const text = `${vendor || ''} ${description || ''}`.toLowerCase();

    if (
      text.includes('software') ||
      text.includes('subscription') ||
      text.includes('saas')
    ) {
      return { code: '5200', confidence: 85 };
    }
    if (text.includes('marketing') || text.includes('advertising')) {
      return { code: '5100', confidence: 80 };
    }
    if (
      text.includes('legal') ||
      text.includes('lawyer') ||
      text.includes('attorney')
    ) {
      return { code: '5300', confidence: 90 };
    }
    if (text.includes('office') || text.includes('supplies')) {
      return { code: '5400', confidence: 75 };
    }
    if (
      text.includes('travel') ||
      text.includes('uber') ||
      text.includes('flight')
    ) {
      return { code: '5500', confidence: 85 };
    }

    return { code: '5000', confidence: 50 }; // Default to operating expenses
  };

  // Mock AI context prefill
  const handleRequestContext = async () => {
    setIsLoadingContext(true);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock AI-generated context based on existing data
    const mockAIContext = {
      companyName: 'Acme Software Inc.',
      industry: 'Software Development',
      fiscalYearEnd: 'December 31',
      accountingMethod: 'accrual' as const,
      defaultPaymentTerms: '30',
      preferredVendors: ['AWS', 'Google Workspace', 'Slack', 'Office Depot'],
      automationRules: [
        { vendor: 'AWS', glCode: '5200', autoApprove: true },
        { vendor: 'Google Workspace', glCode: '5200', autoApprove: true },
        { vendor: 'Uber', glCode: '5500', autoApprove: false },
      ],
    };

    setCompanyContext(mockAIContext);
    setIsLoadingContext(false);

    toast({
      title: 'Context Loaded',
      description:
        'AI has analyzed your data and prefilled company information',
    });
  };

  // Create context request for unclear items
  const handleCreateContextRequest = async (
    item: any,
    type: 'transaction' | 'invoice',
  ) => {
    // AI generates SMART context-aware questions based on the transaction
    let questions = [];

    if (type === 'transaction') {
      const desc = (item.memo || item.counterparty || '').toLowerCase();
      const amount = Math.abs(Number(item.amount));

      // Generate highly specific questions based on transaction patterns
      if (desc.includes('chk') || desc.includes('check')) {
        questions = [
          {
            id: 'q1',
            question: `Check for $${amount.toFixed(2)} - Who was the payee and what service/product was this for?`,
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Do you have the invoice this check was paying?',
            type: 'boolean' as const,
            required: true,
          },
        ];
      } else if (desc.includes('wire')) {
        questions = [
          {
            id: 'q1',
            question: `Wire of $${amount.toFixed(2)} - Which vendor received this and for what?`,
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Category for this wire transfer?',
            type: 'select' as const,
            options: [
              'Inventory',
              'Equipment',
              'Professional Services',
              'Rent',
              'Other',
            ],
            required: true,
          },
        ];
      } else if (desc.includes('venmo') || desc.includes('paypal')) {
        questions = [
          {
            id: 'q1',
            question: `${desc.includes('venmo') ? 'Venmo' : 'PayPal'} payment - Who is this contractor/employee?`,
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Tax classification?',
            type: 'select' as const,
            options: [
              '1099 Contractor',
              'W-2 Employee',
              'Vendor',
              'Reimbursement',
            ],
            required: true,
          },
        ];
      } else if (desc.includes('ach') && desc.includes('unknown')) {
        questions = [
          {
            id: 'q1',
            question: `Mystery ACH for $${amount.toFixed(2)} - Can you identify this recurring charge?`,
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Should we keep or cancel this subscription?',
            type: 'select' as const,
            options: [
              'Keep - Business Critical',
              'Keep - Nice to Have',
              'Cancel ASAP',
              'Research Further',
            ],
            required: true,
          },
        ];
      } else if (desc.includes('atm')) {
        questions = [
          {
            id: 'q1',
            question:
              'Cash withdrawal - What business expenses was this used for?',
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Do you have receipts?',
            type: 'boolean' as const,
            required: true,
          },
        ];
      } else if (desc.includes('amzn') || desc.includes('amazon')) {
        questions = [
          {
            id: 'q1',
            question:
              'Amazon purchase - What specific items? (Check your Amazon Business order history)',
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Category?',
            type: 'select' as const,
            options: [
              'Office Supplies',
              'Computer/Tech',
              'Inventory',
              'Books/Education',
              'Other',
            ],
            required: true,
          },
        ];
      } else if (amount > 10000) {
        questions = [
          {
            id: 'q1',
            question: `Large transaction $${amount.toFixed(2)} - This needs documentation. What is this?`,
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question:
              'Do you have supporting documentation (contract, invoice, agreement)?',
            type: 'boolean' as const,
            required: true,
          },
        ];
      } else {
        // Default but still specific
        questions = [
          {
            id: 'q1',
            question: `${item.counterparty || 'Transaction'} for $${amount.toFixed(2)} - Business purpose?`,
            type: 'text' as const,
            required: true,
          },
          {
            id: 'q2',
            question: 'Best category?',
            type: 'select' as const,
            options: [
              'Cost of Goods Sold',
              'Advertising/Marketing',
              'Software Subscriptions',
              'Professional Services',
              'Office/Admin',
              'Travel',
              'Other',
            ],
            required: true,
          },
        ];
      }

      // Add recurring question for all expenses
      questions.push({
        id: 'q3',
        question: 'Is this recurring monthly?',
        type: 'text' as const,
        required: false,
      });
    } else {
      questions = [
        {
          id: 'q1',
          question: `Can you confirm this invoice from ${item.vendor} is legitimate?`,
          type: 'text' as const,
          required: true,
        },
        {
          id: 'q2',
          question: 'Has this invoice already been paid?',
          type: 'boolean' as const,
          required: true,
        },
        {
          id: 'q3',
          question: 'Any special payment terms or discounts?',
          type: 'text' as const,
          required: false,
        },
      ];
    }

    // Create local request for UI
    const request: any = {
      id: `req-${Date.now()}`,
      itemId: item.id,
      itemType: type,
      status: 'pending',
      createdAt: new Date(),
      questions: questions,
      item: item,
    };

    setContextRequests((prev) => [...prev, request]);
    setSelectedRequestItem(request);
    setRequestDialogOpen(true);

    // Send to backend
    await createContextRequest.mutateAsync({
      itemId: item.id,
      itemType: type,
      questions: questions,
    });
  };

  // Mock client response with REAL UI updates
  const handleMockClientResponse = async (requestId: string) => {
    // Show loading state
    toast({
      title: 'Client is responding...',
      description: 'Simulating email reply from client',
    });

    // Simulate client responding time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Find the request and item
    const request = contextRequests.find((req) => req.id === requestId);
    if (!request) return;

    // Generate realistic responses based on the transaction type
    const desc = (
      request.item.memo ||
      request.item.counterparty ||
      ''
    ).toLowerCase();
    let responses: any = {};
    let clarification = '';
    let glCode = '';
    let matchInvoiceId: string | null = null;

    if (desc.includes('chk') || desc.includes('check')) {
      responses = {
        q1: 'Johnson Construction - Final payment for warehouse renovation project',
        q2: true,
      };
      clarification = 'Check matched to Johnson Construction invoice';
      glCode = '5300'; // Professional Services
      // Try to find matching invoice
      const matchingInvoice = invoices?.find(
        (inv) =>
          inv.vendor?.toLowerCase().includes('johnson') ||
          Math.abs(Number(inv.totalAmount) - 8500) < 1,
      );
      matchInvoiceId = matchingInvoice?.id || null;
    } else if (desc.includes('wire')) {
      responses = {
        q1: 'Shanghai Manufacturing Co - Initial inventory order for Q1',
        q2: 'Inventory',
      };
      clarification = 'Wire categorized as Inventory (COGS)';
      glCode = '4000'; // Cost of Goods Sold
    } else if (desc.includes('venmo') || desc.includes('paypal')) {
      responses = {
        q1: 'Sarah Chen - Freelance graphic designer for marketing materials',
        q2: '1099 Contractor',
      };
      clarification = 'Contractor payment - 1099 required';
      glCode = '5100'; // Marketing
      // Try to find Sarah's invoice
      const matchingInvoice = invoices?.find(
        (inv) =>
          inv.vendor?.toLowerCase().includes('sarah') ||
          Math.abs(Number(inv.totalAmount) - 2500) < 1,
      );
      matchInvoiceId = matchingInvoice?.id || null;
    } else if (desc.includes('ach') && desc.includes('unknown')) {
      responses = {
        q1: 'Salesforce CRM - Monthly subscription (we forgot we had this!)',
        q2: 'Keep - Business Critical',
      };
      clarification = 'Mystery ACH identified: Salesforce CRM';
      glCode = '5200'; // Software & Subscriptions
    } else if (desc.includes('atm')) {
      responses = {
        q1: 'Client dinner at Nobu (3 clients from Tech Corp deal) + tips',
        q2: false,
      };
      clarification = 'Cash categorized as Entertainment';
      glCode = '5500'; // Travel & Entertainment
    } else if (desc.includes('amzn') || desc.includes('amazon')) {
      responses = {
        q1: '2x monitors, wireless keyboards, HDMI cables for new hire setup',
        q2: 'Computer/Tech',
      };
      clarification = 'Amazon purchase categorized as Equipment';
      glCode = '5400'; // Office Supplies
    } else if (desc.includes('stripe')) {
      responses = {
        q1: 'Payment processing fees for January',
        q2: 'Banking Fees',
      };
      clarification = 'Stripe fees categorized';
      glCode = '7000'; // Interest & Fees
      // Match to Stripe invoice if exists
      const matchingInvoice = invoices?.find((inv) =>
        inv.vendor?.toLowerCase().includes('stripe'),
      );
      matchInvoiceId = matchingInvoice?.id || null;
    } else if (desc.includes('aws')) {
      responses = {
        q1: 'Monthly cloud hosting for production servers',
        q2: 'Technology Infrastructure',
      };
      clarification = 'AWS matched to invoice';
      glCode = '5200'; // Software & Subscriptions
      // Match AWS invoice
      const matchingInvoice = invoices?.find(
        (inv) =>
          inv.vendor?.toLowerCase().includes('aws') ||
          inv.vendor?.toLowerCase().includes('amazon web'),
      );
      matchInvoiceId = matchingInvoice?.id || null;
    } else {
      responses = {
        q1: 'Monthly retainer for social media management',
        q2: 'Advertising/Marketing',
        q3: true,
      };
      clarification = 'Recurring marketing expense';
      glCode = '5100'; // Marketing
    }

    // Update the context request status
    setContextRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'completed',
            responses: responses,
            respondedAt: new Date(),
          };
        }
        return req;
      }),
    );

    // ACTUAL UI UPDATES that show the impact
    if (selectedRequestItem?.itemType === 'transaction') {
      const transactionId = selectedRequestItem.item.id;

      // 1. Mark as clarified
      setClarifiedItems((prev) => new Set([...prev, `tx-${transactionId}`]));

      // 2. UPDATE THE GL CODE WITH HIGH CONFIDENCE
      setTransactionGLCodes((prev) => ({
        ...prev,
        [transactionId]: {
          code: glCode,
          confidence: 95,
          reason: `Client confirmed: ${responses.q1}`,
        },
      }));

      // 3. If we found a matching invoice, create a match
      if (matchInvoiceId) {
        // Show the match was created
        setTimeout(() => {
          toast({
            title: '🔗 Match Created!',
            description: `Transaction matched to invoice based on client response`,
          });
          // Trigger matches refresh
          refetchMatches();
        }, 500);
      }

      // Show success with the actual clarification
      toast({
        title: '✅ Client Responded',
        description: clarification,
      });

      // Show the GL code update
      setTimeout(() => {
        const glCodeName = mockGLCodes.find((gl) => gl.code === glCode)?.name;
        toast({
          title: '📊 Categorized',
          description: `Applied GL ${glCode} - ${glCodeName}`,
        });
      }, 1000);

      // Show AI learning
      setTimeout(() => {
        toast({
          title: '🤖 AI Learning Updated',
          description: 'Future similar transactions will auto-categorize',
        });
      }, 2000);
    }

    // Close the dialog after a short delay
    setTimeout(() => {
      setRequestDialogOpen(false);
    }, 500);
  };

  // Delete all data
  const handleDeleteAll = async () => {
    try {
      await Promise.all([
        deleteAllTransactions.mutateAsync(),
        deleteAllInvoices.mutateAsync(),
      ]);

      setTransactionGLCodes({});
      setInvoiceGLCodes({});

      toast({
        title: 'All Data Deleted',
        description: 'Successfully cleared all transactions and invoices',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete all data',
        variant: 'destructive',
      });
    }
  };

  // Sample CSV for demo - REAL fractional CFO scenario with messy data
  const sampleCSV = `Date,Description,Amount,Currency
2024-01-15,STRIPE TRANSFER 12345,-2847.93,USD
2024-01-16,AWS AMAZON WEB SERV,-1249.67,USD
2024-01-17,GOOGLE*GSUITE_ACME,-450.00,USD
2024-01-18,CHK 2341,-8500.00,USD
2024-01-20,PAYPAL *CONTRACTOR,-3500.00,USD
2024-01-22,AMZN Mktp US*RT4Y6,-237.84,USD
2024-01-23,STRIPE TRANSFER 67890,-5234.50,USD
2024-01-24,WIRE OUT 823744,-15000.00,USD
2024-01-25,POS DEBIT - 4829 OFFICE D,-1847.23,USD
2024-01-26,VENMO PAYMENT,-2500.00,USD
2024-01-27,ACH DEBIT UNKNOWN,-892.45,USD
2024-01-28,TST* DROPBOX 4KJ3M2,-199.00,USD
2024-01-29,DEPOSIT MOBILE CHECK,25000.00,USD
2024-01-30,ATM WITHDRAWAL,-500.00,USD`;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoice Reconciliation</h1>
          <p className="text-muted-foreground mt-1">
            Match invoices with transactions using AI-powered categorization
          </p>
        </div>

        <div className="flex gap-2">
          {/* Load Demo Data Button */}
          <Button
            variant="outline"
            onClick={async () => {
              // Import the CSV transactions
              await importCSV.mutateAsync({
                csvContent: sampleCSV,
                source: 'demo_data',
              });

              // Sync Gmail to get matching invoices
              await syncGmail.mutateAsync();

              toast({
                title: 'Demo Data Loaded',
                description:
                  'Messy bank transactions and invoices ready for reconciliation',
              });
            }}
          >
            <Database className="h-4 w-4 mr-2" />
            Load Demo Data
          </Button>

          {/* AI Context Button */}
          <Dialog
            open={companyContextOpen}
            onOpenChange={setCompanyContextOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                AI Context
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>AI Context & Learning</DialogTitle>
                <DialogDescription>
                  Train the AI with your company's accounting preferences and
                  patterns
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button
                    onClick={handleRequestContext}
                    disabled={isLoadingContext}
                    variant="outline"
                  >
                    {isLoadingContext ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    AI Learn From History
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      value={companyContext.companyName}
                      onChange={(e) =>
                        setCompanyContext((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      placeholder="Enter company name..."
                    />
                  </div>

                  <div>
                    <Label>Industry</Label>
                    <Input
                      value={companyContext.industry}
                      onChange={(e) =>
                        setCompanyContext((prev) => ({
                          ...prev,
                          industry: e.target.value,
                        }))
                      }
                      placeholder="e.g., Software, Healthcare..."
                    />
                  </div>

                  <div>
                    <Label>Fiscal Year End</Label>
                    <Input
                      value={companyContext.fiscalYearEnd}
                      onChange={(e) =>
                        setCompanyContext((prev) => ({
                          ...prev,
                          fiscalYearEnd: e.target.value,
                        }))
                      }
                      placeholder="e.g., December 31"
                    />
                  </div>

                  <div>
                    <Label>Accounting Method</Label>
                    <Select
                      value={companyContext.accountingMethod}
                      onValueChange={(value) =>
                        setCompanyContext((prev) => ({
                          ...prev,
                          accountingMethod: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="accrual">Accrual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {companyContext.automationRules.length > 0 && (
                  <div>
                    <Label>Automation Rules</Label>
                    <div className="mt-2 space-y-2">
                      {companyContext.automationRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span className="text-sm">
                            {rule.vendor} → GL {rule.glCode}
                          </span>
                          <Badge
                            variant={rule.autoApprove ? 'default' : 'secondary'}
                          >
                            {rule.autoApprove ? 'Auto' : 'Manual'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {companyContext.preferredVendors.length > 0 && (
                  <div>
                    <Label>Preferred Vendors</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {companyContext.preferredVendors.map((vendor, idx) => (
                        <Badge key={idx} variant="outline">
                          {vendor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={() => proposeMatches.mutate({})}
            disabled={proposeMatches.isPending}
          >
            {proposeMatches.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Link2 className="h-4 w-4 mr-2" />
            )}
            Propose Matches
          </Button>

          {/* Delete All Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all transactions, invoices, and
                  matches. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAll}>
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions?.length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Suggested Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {transactions
                ?.reduce((sum, t) => sum + Number(t.amount), 0)
                .toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">
            Raw Transactions
            {transactions && transactions.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {transactions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="invoices">
            Invoices
            {invoices && invoices.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {invoices.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="matches">
            Matches
            {matches && matches.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {matches.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Bank Transactions</CardTitle>
                  <CardDescription>
                    Import transactions from your bank CSV export
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => syncXero.mutate()}
                    disabled={syncXero.isPending}
                  >
                    {syncXero.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg"
                        alt="Xero"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                    )}
                    Sync Xero
                  </Button>

                  <Dialog open={csvDialogOpen} onOpenChange={setCsvDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Import CSV
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Import Transactions from CSV</DialogTitle>
                        <DialogDescription>
                          Paste your CSV content or upload a file. The system
                          will automatically detect columns.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label>CSV Content</Label>
                          <Textarea
                            placeholder="Paste your CSV content here..."
                            value={csvContent}
                            onChange={(e) => setCsvContent(e.target.value)}
                            className="h-48 font-mono text-sm"
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <FileUp className="h-4 w-4 mr-2" />
                            Upload File
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => setCsvContent(sampleCSV)}
                          >
                            Use Sample Data
                          </Button>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleCSVFile}
                            className="hidden"
                          />
                        </div>

                        <Button
                          onClick={handleImportCSV}
                          disabled={isUploadingCSV || !csvContent}
                          className="w-full"
                        >
                          {isUploadingCSV ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Import Transactions
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>GL Code</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.map((tx) => {
                    const suggestedGL = getSuggestedGLCode(
                      tx.counterparty || undefined,
                      tx.memo || undefined,
                    );
                    const assignedGL = transactionGLCodes[tx.id];
                    const isObjectGL =
                      typeof assignedGL === 'object' && assignedGL !== null;
                    const assignedGLCode = isObjectGL
                      ? (assignedGL as any).code
                      : assignedGL;
                    const glConfidence = isObjectGL
                      ? (assignedGL as any).confidence
                      : null;

                    return (
                      <TableRow key={tx.id}>
                        <TableCell>
                          {new Date(tx.txnDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{tx.counterparty || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {tx.memo || '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${Number(tx.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {assignedGLCode ? (
                              <Badge variant="default" className="gap-1">
                                <Hash className="h-3 w-3" />
                                {assignedGLCode}
                                {typeof assignedGL === 'object' &&
                                  assignedGL.confidence && (
                                    <span className="text-xs ml-1">
                                      ({assignedGL.confidence}%)
                                    </span>
                                  )}
                              </Badge>
                            ) : suggestedGL ? (
                              <Badge variant="secondary" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                {suggestedGL.code}
                                <span className="text-xs">
                                  ({suggestedGL.confidence}%)
                                </span>
                              </Badge>
                            ) : null}

                            <Select
                              value={assignedGLCode || ''}
                              onValueChange={(value) =>
                                handleAssignGLCode(tx.id, value, 'transaction')
                              }
                            >
                              <SelectTrigger className="w-[120px] h-7">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockGLCodes.map((gl) => (
                                  <SelectItem key={gl.code} value={gl.code}>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs">
                                        {gl.code}
                                      </span>
                                      <span className="text-xs">{gl.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{tx.source}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant={
                                clarifiedItems.has(`tx-${tx.id}`)
                                  ? 'default'
                                  : 'ghost'
                              }
                              size="icon"
                              onClick={() =>
                                handleCreateContextRequest(tx, 'transaction')
                              }
                              title={
                                clarifiedItems.has(`tx-${tx.id}`)
                                  ? 'Client has clarified this item'
                                  : 'Request Context'
                              }
                            >
                              {clarifiedItems.has(`tx-${tx.id}`) ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <MessageSquare className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deleteTransaction.mutate({ id: tx.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {(!transactions || transactions.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No transactions yet. Import a CSV to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>
                    Upload PDF or image invoices for AI parsing
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => syncGmail.mutate()}
                    disabled={syncGmail.isPending}
                  >
                    {syncGmail.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                      </svg>
                    )}
                    Sync Gmail
                  </Button>

                  <Dialog
                    open={invoiceDialogOpen}
                    onOpenChange={setInvoiceDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Upload Invoice
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Invoice</DialogTitle>
                        <DialogDescription>
                          Upload a PDF or image file of your invoice. Our AI
                          will extract the details automatically.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <Button
                            variant="outline"
                            onClick={() => invoiceInputRef.current?.click()}
                            disabled={isUploadingInvoice}
                          >
                            {isUploadingInvoice ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <FileUp className="h-4 w-4 mr-2" />
                            )}
                            Choose File
                          </Button>

                          <input
                            ref={invoiceInputRef}
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleInvoiceFile}
                            className="hidden"
                          />

                          <p className="text-sm text-muted-foreground mt-2">
                            Supports PDF, PNG, JPG formats
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>GL Code</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices?.map((invoice) => {
                    const suggestedGL = getSuggestedGLCode(
                      invoice.vendor || undefined,
                      invoice.invoiceNumber || undefined,
                    );
                    const assignedGL = invoiceGLCodes[invoice.id];
                    const assignedGLCode =
                      typeof assignedGL === 'string'
                        ? assignedGL
                        : (
                            assignedGL as
                              | { code: string; confidence?: number }
                              | undefined
                          )?.code;

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono">
                          {invoice.invoiceNumber || '-'}
                        </TableCell>
                        <TableCell>{invoice.vendor || '-'}</TableCell>
                        <TableCell>
                          {invoice.issueDate
                            ? new Date(invoice.issueDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {invoice.dueDate
                            ? new Date(invoice.dueDate).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${Number(invoice.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {assignedGLCode ? (
                              <Badge variant="default" className="gap-1">
                                <Hash className="h-3 w-3" />
                                {assignedGLCode}
                                {typeof assignedGL === 'object' &&
                                  assignedGL.confidence && (
                                    <span className="text-xs ml-1">
                                      ({assignedGL.confidence}%)
                                    </span>
                                  )}
                              </Badge>
                            ) : suggestedGL ? (
                              <Badge variant="secondary" className="gap-1">
                                <Sparkles className="h-3 w-3" />
                                {suggestedGL.code}
                              </Badge>
                            ) : null}

                            <Select
                              value={assignedGLCode || ''}
                              onValueChange={(value) =>
                                handleAssignGLCode(invoice.id, value, 'invoice')
                              }
                            >
                              <SelectTrigger className="w-[100px] h-7">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockGLCodes.map((gl) => (
                                  <SelectItem key={gl.code} value={gl.code}>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs">
                                        {gl.code}
                                      </span>
                                      <span className="text-xs">{gl.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          {invoice.parsedConfidence ? (
                            <Badge
                              variant={
                                Number(invoice.parsedConfidence) > 80
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {Number(invoice.parsedConfidence).toFixed(0)}%
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant={
                                clarifiedItems.has(`inv-${invoice.id}`)
                                  ? 'default'
                                  : 'ghost'
                              }
                              size="icon"
                              onClick={() =>
                                handleCreateContextRequest(invoice, 'invoice')
                              }
                              title={
                                clarifiedItems.has(`inv-${invoice.id}`)
                                  ? 'Client has clarified this item'
                                  : 'Request Context'
                              }
                            >
                              {clarifiedItems.has(`inv-${invoice.id}`) ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <MessageSquare className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                deleteInvoice.mutate({ id: invoice.id })
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {(!invoices || invoices.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No invoices yet. Upload a PDF or image to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Suggested Matches</CardTitle>
                  <CardDescription>
                    Review and confirm AI-proposed invoice-to-transaction
                    matches
                  </CardDescription>
                </div>

                <Button variant="outline" onClick={() => refetchMatches()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Rationale</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches?.map((item) => (
                    <TableRow key={item.match.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {item.invoice?.invoiceNumber || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.invoice?.vendor} - $
                            {Number(item.invoice?.totalAmount || 0).toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {item.transaction?.counterparty || 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.transaction?.txnDate
                              ? new Date(
                                  item.transaction.txnDate,
                                ).toLocaleDateString()
                              : ''}{' '}
                            - $
                            {Number(item.transaction?.amount || 0).toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            Number(item.match.score) >= 90
                              ? 'default'
                              : Number(item.match.score) >= 70
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {Math.round(Number(item.match.score))}%
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm text-muted-foreground">
                          {item.match.rationale || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              confirmMatch.mutate({ matchId: item.match.id })
                            }
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              rejectMatch.mutate({ matchId: item.match.id })
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {(!matches || matches.length === 0) && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No matches proposed yet. Add some transactions and
                        invoices, then click "Propose Matches".
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Context Dialog - Shows actual message draft */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Quick Clarification Needed</DialogTitle>
            <DialogDescription>
              AI has drafted a message to send to your client
            </DialogDescription>
          </DialogHeader>

          {selectedRequestItem && (
            <>
              <div className="space-y-4">
                {/* Email Draft */}
                <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">To:</span>
                      <span>john@acmecorp.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Subject:</span>
                      <span>
                        Quick question about{' '}
                        {new Date(
                          selectedRequestItem.item.txnDate ||
                            selectedRequestItem.item.issueDate,
                        ).toLocaleDateString()}{' '}
                        transaction
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="prose prose-sm max-w-none">
                        {(() => {
                          const item = selectedRequestItem.item;
                          const desc = (
                            item.memo ||
                            item.counterparty ||
                            ''
                          ).toLowerCase();
                          const amount = Math.abs(
                            Number(item.amount || item.totalAmount),
                          );

                          // Generate personalized message based on transaction type
                          if (desc.includes('chk') || desc.includes('check')) {
                            return (
                              <div className="space-y-3">
                                <p>Hi John,</p>
                                <p>
                                  Quick question about a{' '}
                                  <strong>
                                    check for ${amount.toFixed(2)}
                                  </strong>{' '}
                                  that cleared on{' '}
                                  {new Date(item.txnDate).toLocaleDateString()}.
                                </p>
                                <p>
                                  The check number is{' '}
                                  <strong>
                                    {desc.match(/\d+/)?.[0] || 'not visible'}
                                  </strong>
                                  , but I don't have any documentation for it.
                                </p>
                                <p className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-yellow-400">
                                  <strong>Can you let me know:</strong>
                                  <br />
                                  • Who was this check made out to?
                                  <br />• What was it for? (invoice #, project,
                                  etc.)
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Just reply to this email with the info - no
                                  need for a call. Thanks!
                                </p>
                              </div>
                            );
                          } else if (desc.includes('wire')) {
                            return (
                              <div className="space-y-3">
                                <p>Hi John,</p>
                                <p>
                                  I need help identifying a{' '}
                                  <strong>
                                    wire transfer for ${amount.toFixed(2)}
                                  </strong>{' '}
                                  sent on{' '}
                                  {new Date(item.txnDate).toLocaleDateString()}.
                                </p>
                                <p className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-yellow-400">
                                  <strong>Please provide:</strong>
                                  <br />
                                  • Vendor/recipient name
                                  <br />
                                  • What this payment was for
                                  <br />• Any invoice or PO number
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  This is a large payment that needs proper
                                  documentation for your records.
                                </p>
                              </div>
                            );
                          } else if (
                            desc.includes('venmo') ||
                            desc.includes('paypal')
                          ) {
                            return (
                              <div className="space-y-3">
                                <p>Hi John,</p>
                                <p>
                                  There's a{' '}
                                  <strong>
                                    {desc.includes('venmo')
                                      ? 'Venmo'
                                      : 'PayPal'}{' '}
                                    payment for ${amount.toFixed(2)}
                                  </strong>{' '}
                                  on{' '}
                                  {new Date(item.txnDate).toLocaleDateString()}.
                                </p>
                                <p className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-yellow-400">
                                  <strong>I need to know:</strong>
                                  <br />
                                  • Who received this payment?
                                  <br />
                                  • Are they a W-9 contractor or W-2 employee?
                                  <br />• What work did they do?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Important for 1099 reporting if they're a
                                  contractor.
                                </p>
                              </div>
                            );
                          } else if (
                            desc.includes('ach') &&
                            desc.includes('unknown')
                          ) {
                            return (
                              <div className="space-y-3">
                                <p>Hi John,</p>
                                <p>
                                  Found an{' '}
                                  <strong>
                                    unidentified recurring charge for $
                                    {amount.toFixed(2)}
                                  </strong>{' '}
                                  hitting your account monthly.
                                </p>
                                <p className="bg-red-50 dark:bg-red-950 p-3 rounded border-l-4 border-red-400">
                                  <strong>⚠️ Mystery charge alert:</strong>
                                  <br />
                                  • Do you recognize this charge?
                                  <br />
                                  • It's been happening for 3+ months
                                  <br />• Could be a forgotten subscription
                                </p>
                                <p className="text-sm">
                                  Reply with what this is, or if you don't
                                  recognize it, we should dispute it with the
                                  bank.
                                </p>
                              </div>
                            );
                          } else if (desc.includes('atm')) {
                            return (
                              <div className="space-y-3">
                                <p>Hi John,</p>
                                <p>
                                  Cash withdrawal of{' '}
                                  <strong>${amount.toFixed(2)}</strong> on{' '}
                                  {new Date(item.txnDate).toLocaleDateString()}.
                                </p>
                                <p className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-yellow-400">
                                  <strong>For tax purposes, I need:</strong>
                                  <br />
                                  • What was the cash used for?
                                  <br />
                                  • Do you have receipts?
                                  <br />• Was this for client entertainment,
                                  supplies, or other?
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  No receipts = potential audit issue. Let me
                                  know what you have.
                                </p>
                              </div>
                            );
                          } else {
                            return (
                              <div className="space-y-3">
                                <p>Hi John,</p>
                                <p>
                                  Need clarification on a{' '}
                                  <strong>${amount.toFixed(2)} charge</strong>{' '}
                                  from{' '}
                                  {item.counterparty || 'an unknown vendor'} on{' '}
                                  {new Date(item.txnDate).toLocaleDateString()}.
                                </p>
                                <p className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-yellow-400">
                                  <strong>Please clarify:</strong>
                                  <br />
                                  • What was this purchase for?
                                  <br />
                                  • Which category: Operations, Marketing, or
                                  Other?
                                  <br />• Is this recurring monthly?
                                </p>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Options */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      toast({
                        title: '📧 Email Sent',
                        description: 'John will receive this in his inbox',
                      });
                      setTimeout(() => {
                        toast({
                          title: '👀 Email Opened',
                          description: 'John opened the email (2 min ago)',
                        });
                      }, 2000);
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: 'Slack Message Sent',
                        description: 'Posted in #finance channel',
                      });
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send via Slack
                  </Button>
                </div>
              </div>

              {/* Demo: Simulate Client Response */}
              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Demo: Client Response</p>
                  <Button
                    onClick={() =>
                      handleMockClientResponse(selectedRequestItem.id)
                    }
                    variant="default"
                    size="sm"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Simulate Reply
                  </Button>
                </div>

                {/* Show mock client response */}
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">From:</span>
                      <span>john@acmecorp.com</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        Just now
                      </span>
                    </div>
                    <div className="pt-2 text-sm">
                      {(() => {
                        const desc = (
                          selectedRequestItem.item.memo ||
                          selectedRequestItem.item.counterparty ||
                          ''
                        ).toLowerCase();
                        const amount = Math.abs(
                          Number(
                            selectedRequestItem.item.amount ||
                              selectedRequestItem.item.totalAmount,
                          ),
                        );

                        if (desc.includes('chk') || desc.includes('check')) {
                          return (
                            <div className="space-y-2">
                              <p>
                                That was for Johnson Construction - final
                                payment for the warehouse renovation. Invoice
                                #JC-2024-089 attached to original email.
                              </p>
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>
                                    ✅ Match to Johnson Construction invoice
                                  </li>
                                  <li>
                                    📊 Categorize as Professional Services (GL
                                    5300)
                                  </li>
                                  <li>🤖 Auto-match future Johnson checks</li>
                                </ul>
                              </div>
                            </div>
                          );
                        } else if (desc.includes('wire')) {
                          return (
                            <div className="space-y-2">
                              <p>
                                Shanghai Manufacturing Co - initial inventory
                                order for Q1. PO #2024-156. Should arrive next
                                week.
                              </p>
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>
                                    📦 Categorize as Inventory/COGS (GL 4000)
                                  </li>
                                  <li>
                                    🏭 Add Shanghai Manufacturing as known
                                    vendor
                                  </li>
                                  <li>📈 Track for inventory reporting</li>
                                </ul>
                              </div>
                            </div>
                          );
                        } else if (desc.includes('venmo')) {
                          return (
                            <div className="space-y-2">
                              <p>
                                Sarah Chen - she did our marketing materials
                                redesign. She's a 1099 contractor, I'll forward
                                her W-9.
                              </p>
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>✅ Match to Sarah's invoice if found</li>
                                  <li>📊 Categorize as Marketing (GL 5100)</li>
                                  <li>📋 Flag for 1099 reporting</li>
                                  <li>
                                    🤖 Remember Sarah for future Venmo payments
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        } else if (
                          desc.includes('ach') &&
                          desc.includes('unknown')
                        ) {
                          return (
                            <div className="space-y-2">
                              <p>
                                Oh that's our Salesforce CRM! I forgot we still
                                had that. We should probably cancel it - we
                                switched to HubSpot.
                              </p>
                              <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>🏷️ Label as "Salesforce CRM"</li>
                                  <li>📊 Categorize as Software (GL 5200)</li>
                                  <li>⚠️ Flag for cancellation review</li>
                                  <li>🔄 Identify as recurring monthly</li>
                                </ul>
                              </div>
                            </div>
                          );
                        } else if (desc.includes('atm')) {
                          return (
                            <div className="space-y-2">
                              <p>
                                Client dinner at Nobu with the Tech Corp team.
                                No receipts but it was Smith, Johnson, and their
                                CFO. About the new contract.
                              </p>
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>
                                    🍽️ Categorize as Entertainment (GL 5500)
                                  </li>
                                  <li>
                                    📝 Note: Tech Corp business development
                                  </li>
                                  <li>
                                    ⚠️ Flag: Missing receipts for audit trail
                                  </li>
                                </ul>
                              </div>
                            </div>
                          );
                        } else if (desc.includes('aws')) {
                          return (
                            <div className="space-y-2">
                              <p>
                                Monthly cloud hosting for our production
                                servers.
                              </p>
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>✅ Match to AWS invoice</li>
                                  <li>📊 Categorize as Technology (GL 5200)</li>
                                  <li>🔄 Mark as recurring monthly</li>
                                </ul>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="space-y-2">
                              <p>
                                That's our monthly retainer for social media
                                management. Recurring every month. Marketing
                                budget.
                              </p>
                              <div className="bg-green-100 dark:bg-green-900 p-2 rounded text-xs">
                                <strong>What will happen:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  <li>📊 Categorize as Marketing (GL 5100)</li>
                                  <li>🔄 Mark as recurring monthly</li>
                                  <li>🤖 Auto-categorize future payments</li>
                                </ul>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Active Context Requests Indicator */}
      {contextRequests.filter((r) => r.status === 'pending').length > 0 && (
        <div className="fixed bottom-4 right-4 p-4 bg-white border rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {contextRequests.filter((r) => r.status === 'pending').length}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">Pending Context Requests</p>
              <p className="text-xs text-muted-foreground">
                Waiting for client responses
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
