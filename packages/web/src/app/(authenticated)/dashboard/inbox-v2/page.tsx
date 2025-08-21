'use client';

import { useState, useRef, useEffect } from 'react';
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
  Plus,
  Clock,
  AlertCircle,
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

  // Move demo functions here, inside the component

  // Demo missing invoice detection
  useEffect(() => {
    const timer = setTimeout(() => {
      const missingInvoiceMessage = {
        id: 'missing-demo',
        type: 'assistant',
        content:
          '🚨 Missing Invoice Alert: I found a $2,500 PayPal transaction from yesterday with no matching invoice. This looks like a contractor payment - would you like me to search your Slack #finance channel and Gmail for the invoice?',
        timestamp: new Date(),
        actions: [
          {
            type: 'missing_invoice_alert',
            status: 'pending',
            target: 'paypal_transaction_2500',
            result: {
              amount: 2500,
              date: 'yesterday',
              suggested_channels: ['slack', 'gmail'],
              likely_type: 'contractor_payment',
            },
          },
        ],
      };

      // Add to main thread
      setChatThreads((prev: any) =>
        prev.map((thread: any) => {
          if (thread.id === 'main') {
            return {
              ...thread,
              messages: [...thread.messages, missingInvoiceMessage],
              lastMessage: '🚨 Missing Invoice Alert',
              timestamp: new Date(),
              unread: thread.unread + 1,
            };
          }
          return thread;
        }),
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
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
  const [matchedInvoices, setMatchedInvoices] = useState<Record<string, any>>(
    {},
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceInputRef = useRef<HTMLInputElement>(null);

  // Chat and Channels state - Multi-thread support
  const [chatThreads, setChatThreads] = useState<any[]>([
    {
      id: 'main',
      title: 'Main Chat',
      type: 'main',
      unread: 0,
      lastMessage: 'Welcome! How can I help you today?',
      timestamp: new Date(),
      status: 'active',
      messages: [
        {
          id: '1',
          type: 'assistant',
          content:
            'Welcome! I can help you process documents, categorize transactions, and find missing invoices. What would you like to do?',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'system',
          content:
            '⚠️ I detected 3 transactions without matching invoices. Would you like me to search your email and Slack for missing documents?',
          timestamp: new Date(Date.now() + 1000),
          actions: [
            {
              type: 'alert',
              status: 'pending',
              target: 'missing_invoices',
              result: {
                count: 3,
                suggestions: [
                  'Check Gmail',
                  'Search Slack #invoices',
                  'Connect Teams',
                ],
              },
            },
          ],
        },
      ],
    },
  ]);
  const [activeThreadId, setActiveThreadId] = useState('main');
  const [chatInput, setChatInput] = useState('');
  const [activeActions, setActiveActions] = useState<any[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(true); // Open by default
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Get current thread messages
  const currentThread = chatThreads.find((t) => t.id === activeThreadId);
  const chatMessages = currentThread?.messages || [];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatMessages]);
  const [channels, setChannels] = useState([
    {
      id: 'gmail',
      name: 'Gmail',
      type: 'gmail',
      status: 'connected',
      documentCount: 45,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: '📧',
    },
    {
      id: 'slack',
      name: 'Slack #finance',
      type: 'slack',
      status: 'connected',
      documentCount: 12,
      lastSync: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      icon: '💬',
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      type: 'teams',
      status: 'disconnected',
      documentCount: 0,
      lastSync: null,
      icon: '🏢',
    },
  ]);
  const [extractedDocuments, setExtractedDocuments] = useState([
    {
      id: '1',
      type: 'invoice',
      title: 'AWS Invoice #INV-2024-001',
      source: 'gmail',
      confidence: 95,
      amount: 1249.67,
      status: 'processed',
    },
    {
      id: '2',
      type: 'intent',
      title: 'Client asking about payment terms',
      source: 'slack',
      confidence: 88,
      status: 'pending',
    },
    {
      id: '3',
      type: 'invoice',
      title: 'Office Supplies Receipt',
      source: 'gmail',
      confidence: 78,
      amount: 237.84,
      status: 'needs_review',
    },
  ]);

  // Fetch data
  const { data: transactions, refetch: refetchTransactions } =
    api.reconciliation.getTransactions.useQuery({ limit: 100 });

  const { data: invoices, refetch: refetchInvoices } =
    api.reconciliation.getInvoices.useQuery({ limit: 100 });

  const { data: matches, refetch: refetchMatches } =
    api.reconciliation.getMatches.useQuery({ status: 'suggested' });

  // Mutations
  const syncMercury = api.reconciliation.syncXero.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Synced ${data.imported} transactions from Mercury`,
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
    onSuccess: async (data: any) => {
      toast({
        title: 'Success',
        description: `Imported ${data.imported} transactions`,
      });

      // Just refetch - categorization is now done in backend
      await refetchTransactions();

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

  // Mutation to update transaction GL code
  const updateTransactionGLCode =
    api.reconciliation.updateTransactionGLCode.useMutation({
      onSuccess: () => {
        refetchTransactions();
        toast({
          title: '✅ Transaction Categorized',
          description: 'GL code has been updated',
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
  const handleAssignGLCode = async (
    entityId: string,
    glCode: string,
    type: 'transaction' | 'invoice',
  ) => {
    if (type === 'transaction') {
      // Update local state immediately for UI responsiveness
      setTransactionGLCodes((prev) => ({ ...prev, [entityId]: glCode }));

      // Get GL code name for the reason
      const glCodeName =
        mockGLCodes.find((gl) => gl.code === glCode)?.name ||
        'Manual assignment';

      // Persist to database
      await updateTransactionGLCode.mutateAsync({
        id: entityId,
        glCode: glCode,
        confidence: 100, // Manual assignment has 100% confidence
        reason: `Manually assigned: ${glCodeName}`,
        status: 'manual',
      });
    } else {
      setInvoiceGLCodes((prev) => ({ ...prev, [entityId]: glCode }));
    }
  };

  // Get suggested GL code based on vendor/description
  const getSuggestedGLCode = (vendor?: string, description?: string) => {
    if (!vendor && !description) return null;

    const text = `${vendor || ''} ${description || ''}`.toLowerCase();

    // High confidence (80%+) - Clear vendor match with invoice
    if (text.includes('aws') || text.includes('amazon web')) {
      return { code: '5200', confidence: 95 };
    }
    if (text.includes('google') || text.includes('gsuite')) {
      return { code: '5200', confidence: 90 };
    }
    if (text.includes('stripe transfer')) {
      return { code: '3000', confidence: 92 };
    }
    if (text.includes('office depot') || text.includes('office supplies')) {
      return { code: '5400', confidence: 85 };
    }

    // Medium confidence (60-79%) - Matched but needs verification
    if (text.includes('paypal')) {
      return { code: '5300', confidence: 70 };
    }
    if (text.includes('contractor')) {
      return { code: '6000', confidence: 65 };
    }
    if (text.includes('dropbox') || text.includes('software')) {
      return { code: '5200', confidence: 75 };
    }

    // Low confidence (<60%) - No clear match, needs context
    if (text.includes('wire')) {
      return { code: '5000', confidence: 45 };
    }
    if (text.includes('venmo')) {
      return { code: '5000', confidence: 40 };
    }
    if (text.includes('check') || text.includes('chk')) {
      return { code: '5000', confidence: 35 };
    }
    if (text.includes('ach') && text.includes('unknown')) {
      return { code: '5000', confidence: 30 };
    }
    if (text.includes('atm')) {
      return { code: '5000', confidence: 25 };
    }

    // Very low confidence - completely unknown
    return { code: '5000', confidence: 20 };
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

  // Handle clicking on transaction to fetch invoice
  const handleFetchInvoice = async (transaction: any) => {
    // Open chat if not already open
    setIsChatOpen(true);

    // Create a new thread for invoice search
    const threadTitle = `Find Invoice: ${transaction.counterparty || 'Unknown'}`;
    const threadId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newThread = {
      id: threadId,
      title: threadTitle,
      type: 'invoice_search',
      unread: 0,
      lastMessage: '',
      timestamp: new Date(),
      status: 'active',
      relatedItem: transaction,
      messages: [],
    };

    setChatThreads((prev) => [...prev, newThread]);
    setActiveThreadId(threadId);

    // Initial user message
    setTimeout(() => {
      const userMsg = {
        id: Date.now().toString(),
        type: 'user',
        content: `Find invoice for transaction: ${transaction.counterparty || transaction.memo} - $${Math.abs(Number(transaction.amount)).toFixed(2)}`,
        timestamp: new Date(),
      };
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, messages: [...(t.messages || []), userMsg] }
            : t,
        ),
      );
    }, 100);

    // AI searching message
    setTimeout(() => {
      const searchMsg = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `🔍 Searching for invoice across connected sources...
        
• Checking Gmail (${channels.find((c) => c.id === 'gmail')?.documentCount || 0} documents)
• Checking Slack (${channels.find((c) => c.id === 'slack')?.documentCount || 0} messages)
• Checking shared drives...`,
        timestamp: new Date(),
      };
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, messages: [...(t.messages || []), searchMsg] }
            : t,
        ),
      );
    }, 1000);

    // Found invoice message
    setTimeout(() => {
      const desc = (
        transaction.memo ||
        transaction.counterparty ||
        ''
      ).toLowerCase();
      let invoiceData = {
        vendor: transaction.counterparty,
        invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
        amount: Math.abs(Number(transaction.amount)),
        date: new Date(transaction.txnDate).toISOString().split('T')[0],
        source: 'Gmail',
      };

      // Customize based on vendor
      if (desc.includes('aws')) {
        invoiceData = {
          vendor: 'Amazon Web Services',
          invoiceNumber: `AWS-2024-${Math.floor(Math.random() * 10000)}`,
          amount: Math.abs(Number(transaction.amount)),
          date: new Date(transaction.txnDate).toISOString().split('T')[0],
          source: 'Gmail (AWS billing email)',
        };
      } else if (desc.includes('johnson construction')) {
        invoiceData = {
          vendor: 'Johnson Construction LLC',
          invoiceNumber: 'JC-INV-8923',
          amount: Math.abs(Number(transaction.amount)),
          date: new Date(transaction.txnDate).toISOString().split('T')[0],
          source: 'Gmail attachment',
        };
      } else if (desc.includes('sarah chen')) {
        invoiceData = {
          vendor: 'Sarah Chen Design',
          invoiceNumber: 'SCD-2024-018',
          amount: Math.abs(Number(transaction.amount)),
          date: new Date(transaction.txnDate).toISOString().split('T')[0],
          source: 'Slack #contractors',
        };
      }

      const foundMsg = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `✅ Found matching invoice!

📄 **Invoice Details:**
• Vendor: ${invoiceData.vendor}
• Invoice #: ${invoiceData.invoiceNumber}
• Amount: $${invoiceData.amount.toFixed(2)}
• Date: ${invoiceData.date}
• Source: ${invoiceData.source}

Would you like to attach this invoice to the transaction?`,
        timestamp: new Date(),
        invoiceData: invoiceData,
      };
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, messages: [...(t.messages || []), foundMsg] }
            : t,
        ),
      );
    }, 2500);

    // User confirms
    setTimeout(() => {
      const confirmMsg = {
        id: (Date.now() + 3).toString(),
        type: 'user',
        content: 'Yes, attach this invoice',
        timestamp: new Date(),
      };
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, messages: [...(t.messages || []), confirmMsg] }
            : t,
        ),
      );
    }, 4000);

    // Process and attach
    setTimeout(async () => {
      const desc = (
        transaction.memo ||
        transaction.counterparty ||
        ''
      ).toLowerCase();
      let invoiceData = {
        vendor: transaction.counterparty,
        invoiceNumber: `INV-${Math.floor(Math.random() * 100000)}`,
        totalAmount: Math.abs(Number(transaction.amount)),
      };

      if (desc.includes('aws')) {
        invoiceData = {
          vendor: 'Amazon Web Services',
          invoiceNumber: `AWS-2024-${Math.floor(Math.random() * 10000)}`,
          totalAmount: Math.abs(Number(transaction.amount)),
        };
      } else if (desc.includes('johnson construction')) {
        invoiceData = {
          vendor: 'Johnson Construction LLC',
          invoiceNumber: 'JC-INV-8923',
          totalAmount: Math.abs(Number(transaction.amount)),
        };
      } else if (desc.includes('sarah chen')) {
        invoiceData = {
          vendor: 'Sarah Chen Design',
          invoiceNumber: 'SCD-2024-018',
          totalAmount: Math.abs(Number(transaction.amount)),
        };
      }

      // Add invoice to local state
      setMatchedInvoices((prev) => ({
        ...prev,
        [transaction.id]: invoiceData,
      }));

      // Add to invoices if we have the mutation
      if (typeof uploadInvoice !== 'undefined' && uploadInvoice.mutateAsync) {
        await uploadInvoice.mutateAsync({
          fileName: `${invoiceData.invoiceNumber}.pdf`,
          fileType: 'application/pdf',
          fileBase64: 'mock-base64-data', // Mock data for demo
        });
      }

      const successMsg = {
        id: (Date.now() + 4).toString(),
        type: 'assistant',
        content: `✅ Invoice successfully attached!

The transaction has been updated with invoice ${invoiceData.invoiceNumber}. You can now see it in the Supporting Document column.`,
        timestamp: new Date(),
      };
      setChatThreads((prev) =>
        prev.map((t) =>
          t.id === threadId
            ? { ...t, messages: [...(t.messages || []), successMsg] }
            : t,
        ),
      );

      // Refetch data
      refetchInvoices();
      refetchTransactions();

      toast({
        title: '📎 Invoice Attached',
        description: `Invoice ${invoiceData.invoiceNumber} linked to transaction`,
      });
    }, 5000);
  };

  // Create context request for unclear items - Opens new thread
  const handleCreateContextRequest = async (
    item: any,
    type: 'transaction' | 'invoice',
  ) => {
    // Create a new thread for this context request
    const threadTitle =
      type === 'transaction'
        ? `Context: ${item.counterparty || 'Transaction'} - $${Math.abs(Number(item.amount)).toFixed(2)}`
        : `Context: ${item.vendor} Invoice`;

    const newThreadId = createNewThread(threadTitle, 'context', item);
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
    // Don't show the dialog anymore - we'll handle it in the chat
    setRequestDialogOpen(false);

    // Generate the proposed message content
    const transactionDate = new Date(
      item.txnDate || item.issueDate,
    ).toLocaleDateString();
    const amount = Math.abs(Number(item.amount)).toFixed(2);
    const desc = item.memo || item.counterparty || 'Transaction';

    let proposedEmailContent = `Subject: Quick question about ${transactionDate} transaction\n\n`;
    proposedEmailContent += `Hi John,\n\n`;
    proposedEmailContent += `I need some clarification on a transaction from ${transactionDate}:\n\n`;
    proposedEmailContent += `• Description: ${desc}\n`;
    proposedEmailContent += `• Amount: $${amount}\n\n`;

    // Add the specific questions
    questions.forEach((q, index) => {
      proposedEmailContent += `${index + 1}. ${q.question}\n`;
    });

    proposedEmailContent += `\nPlease reply with the details when you get a chance.\n\nThanks!`;

    // Add message showing proposed content with action buttons
    const proposalMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `I've prepared a context request for this ${type}. Here's what I'll send:\n\n📧 **Proposed Message:**\n\`\`\`\n${proposedEmailContent}\n\`\`\`\n\nHow would you like to send this?`,
      timestamp: new Date(),
      actions: [
        {
          type: 'proposal',
          status: 'pending',
          target: item.id,
          buttons: [
            { id: 'email', label: '📧 Send Email', action: 'send_email' },
            { id: 'slack', label: '💬 Send Slack', action: 'send_slack' },
          ],
        },
      ],
      threadId: newThreadId,
      itemId: item.id,
      questions: questions,
    };

    addMessageToThread(newThreadId, proposalMessage);

    // Simulate email response after delay - make it specific to the transaction
    setTimeout(() => {
      // Generate specific response based on transaction details
      const desc = (item.memo || item.counterparty || '').toLowerCase();
      const amount = Math.abs(Number(item.amount)).toFixed(2);
      let clientResponseContent = '';
      let glCode = '';
      let vendorName = '';

      // Check #2341 - specific for Johnson Construction
      if (desc.includes('chk 2341')) {
        clientResponseContent = `"Hi, this was for the Johnson Construction project - final payment for warehouse renovation. Invoice #JC-2024-089 was sent last week. The check was made out to Johnson Construction LLC."`;
        glCode = '5300';
        vendorName = 'Johnson Construction';
      }
      // Venmo payment - specific for Sarah Chen
      else if (desc.includes('venmo') && amount === '5000.00') {
        clientResponseContent = `"That's for Sarah Chen, our UI designer. She's a 1099 contractor. I'm attaching her invoice for January's work (40 hours @ $125/hr). She should be set up for monthly payments."`;
        glCode = '5100';
        vendorName = 'Sarah Chen';
      }
      // Wire transfer - specific amount
      else if (desc.includes('wire') && amount === '15000.00') {
        clientResponseContent = `"This wire was for Shanghai Manufacturing Co - our Q1 inventory order. PO #2024-Q1-INV. They're our primary supplier for components."`;
        glCode = '4000';
        vendorName = 'Shanghai Manufacturing';
      }
      // ACH Unknown
      else if (desc.includes('ach') && desc.includes('unknown')) {
        clientResponseContent = `"Oh that's our Salesforce CRM subscription! I forgot we had this on auto-pay. We definitely need to keep it - it's business critical."`;
        glCode = '5200';
        vendorName = 'Salesforce';
      }
      // AWS charges
      else if (desc.includes('aws')) {
        clientResponseContent = `"That's our monthly cloud hosting for production servers. Essential for operations. Should be categorized as Technology Infrastructure."`;
        glCode = '5200';
        vendorName = 'Amazon Web Services';
      }
      // Default - return null to skip this transaction
      else {
        // Don't process transactions we don't have specific responses for
        return;
      }

      const responseMessage = {
        id: (Date.now() + 1).toString(),
        type: 'client' as any, // Mark as client message
        content: `📧 Email from John (Acme Corp):\n\n${clientResponseContent}`,
        timestamp: new Date(),
      };

      addMessageToThread(newThreadId, responseMessage);

      // Update thread status
      setChatThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === newThreadId) {
            return {
              ...thread,
              unread: thread.unread + 1,
              status: 'response_received',
            };
          }
          return thread;
        }),
      );

      // Process the response
      setTimeout(() => {
        const processMessage = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: `✅ Perfect! I've processed this:\n\n• Vendor: ${vendorName}\n• Applied GL Code: ${glCode} (${mockGLCodes.find((gl) => gl.code === glCode)?.name})\n• Confidence: 95%\n• Status: Fully categorized and documented\n\nThe transaction has been updated in the system.`,
          timestamp: new Date(),
          actions: [
            {
              type: 'categorize',
              status: 'completed',
              target: item.id,
            },
          ],
        };

        addMessageToThread(newThreadId, processMessage);

        // Actually update the transaction in the UI
        if (type === 'transaction') {
          setTransactionGLCodes((prev: any) => ({
            ...prev,
            [item.id]: {
              code: glCode,
              confidence: 95,
              reason: `Client confirmed: ${vendorName}`,
            },
          }));

          setClarifiedItems((prev) => new Set([...prev, `tx-${item.id}`]));

          // Show success toast
          toast({
            title: '✅ Transaction Categorized',
            description: `${vendorName} - GL ${glCode}`,
          });
        }

        // Close the dialog
        setRequestDialogOpen(false);
      }, 2000);
    }, 5000);
  };

  // Handle sending the context request after user chooses email or slack
  const handleSendContextRequest = async (
    threadId: string,
    itemId: string,
    method: 'email' | 'slack',
    questions: any[],
  ) => {
    // Find the item
    const item = transactions?.find((t) => t.id === itemId);
    if (!item) return;

    // Send to backend
    await createContextRequest.mutateAsync({
      itemId: item.id,
      itemType: 'transaction',
      questions: questions,
    });

    // Add message showing it was sent
    const sentMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content:
        method === 'email'
          ? `📧 Email sent to client about this transaction.\n\nWaiting for response...`
          : `💬 Message sent to Slack #finance channel.\n\nWaiting for response...`,
      timestamp: new Date(),
      actions: [
        {
          type: method === 'email' ? 'email_sent' : 'slack_sent',
          status: 'executing',
          target: method === 'email' ? 'client_email' : 'slack_channel',
        },
      ],
    };

    addMessageToThread(threadId, sentMessage);

    // Simulate response after delay
    setTimeout(() => {
      const desc = (item.memo || item.counterparty || '').toLowerCase();
      const amount = Math.abs(Number(item.amount)).toFixed(2);
      let clientResponseContent = '';
      let glCode = '';
      let vendorName = '';

      // Generate specific responses based on transaction
      if (desc.includes('chk 2341')) {
        clientResponseContent = `"Hi, this was for the Johnson Construction project - final payment for warehouse renovation. Invoice #JC-2024-089 was sent last week."`;
        glCode = '5300';
        vendorName = 'Johnson Construction';
      } else if (desc.includes('venmo') && amount === '5000.00') {
        clientResponseContent = `"That's for Sarah Chen, our UI designer. She's a 1099 contractor. Invoice for January's work attached."`;
        glCode = '5100';
        vendorName = 'Sarah Chen';
      } else if (desc.includes('wire') && amount === '15000.00') {
        clientResponseContent = `"This wire was for Shanghai Manufacturing Co - our Q1 inventory order. PO #2024-Q1-INV."`;
        glCode = '4000';
        vendorName = 'Shanghai Manufacturing';
      } else if (desc.includes('ach') && desc.includes('unknown')) {
        clientResponseContent = `"Oh that's our Salesforce CRM subscription! We definitely need to keep it."`;
        glCode = '5200';
        vendorName = 'Salesforce';
      } else if (desc.includes('aws')) {
        clientResponseContent = `"That's our monthly cloud hosting for production servers. Essential for operations."`;
        glCode = '5200';
        vendorName = 'Amazon Web Services';
      } else {
        return;
      }

      const responseMessage = {
        id: (Date.now() + 1).toString(),
        type: 'client' as any,
        content:
          method === 'email'
            ? `📧 Email from John (Acme Corp):\n\n${clientResponseContent}`
            : `💬 Slack message from John:\n\n${clientResponseContent}`,
        timestamp: new Date(),
      };

      addMessageToThread(threadId, responseMessage);

      // Process the response
      setTimeout(() => {
        const processMessage = {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: `✅ Perfect! I've processed this:\n\n• Vendor: ${vendorName}\n• Applied GL Code: ${glCode}\n• Confidence: 95%\n• Status: Reconciled\n\nThe transaction has been updated.`,
          timestamp: new Date(),
          actions: [
            {
              type: 'categorize',
              status: 'completed',
              target: itemId,
            },
          ],
        };

        addMessageToThread(threadId, processMessage);

        // Update the transaction
        setTransactionGLCodes((prev: any) => ({
          ...prev,
          [itemId]: {
            code: glCode,
            confidence: 95,
            reason: `Client confirmed: ${vendorName}`,
          },
        }));

        setClarifiedItems((prev) => new Set([...prev, `tx-${itemId}`]));

        toast({
          title: '✅ Transaction Categorized',
          description: `${vendorName} - GL ${glCode}`,
        });
      }, 2000);
    }, 3000);
  };

  // Chat functionality with thread support
  const handleSendMessage = async (
    message: string,
    threadId: string = activeThreadId,
  ) => {
    if (!message.trim()) return;

    // Add user message to the active thread
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, userMessage],
            lastMessage: message,
            timestamp: new Date(),
          };
        }
        return thread;
      }),
    );

    setChatInput('');

    // Process message and create appropriate actions
    setTimeout(async () => {
      await handleChatAction(message, threadId);
    }, 500);
  };

  // Create a new thread for context requests
  const createNewThread = (title: string, type: string, relatedItem?: any) => {
    // Add random suffix to ensure unique IDs even when called rapidly
    const uniqueId = `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newThread = {
      id: uniqueId,
      title,
      type,
      unread: 0,
      lastMessage: '',
      timestamp: new Date(),
      status: 'active',
      relatedItem,
      messages: [],
    };

    setChatThreads((prev) => [...prev, newThread]);
    setActiveThreadId(newThread.id);

    return newThread.id;
  };

  const handleChatAction = async (
    message: string,
    threadId: string = activeThreadId,
  ) => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('missing invoice') ||
      lowerMessage.includes('find invoice')
    ) {
      await handleMissingInvoiceAction(threadId);
    } else if (
      lowerMessage.includes('categorize') ||
      lowerMessage.includes('category')
    ) {
      await handleCategorizeAction(message, threadId);
    } else if (
      lowerMessage.includes('sync') ||
      lowerMessage.includes('connect')
    ) {
      await handleSyncAction(message, threadId);
    } else if (
      lowerMessage.includes('match') ||
      lowerMessage.includes('reconcile')
    ) {
      await handleMatchAction(threadId);
    } else {
      // Generic response
      const assistantMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          'I can help you with:\n• Finding missing invoices\n• Categorizing transactions\n• Syncing data sources\n• Matching invoices to transactions\n\nWhat would you like me to do?',
        timestamp: new Date(),
      };

      // Add message to thread
      setChatThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            return {
              ...thread,
              messages: [...thread.messages, assistantMessage],
              lastMessage: 'I can help you with various tasks...',
              timestamp: new Date(),
            };
          }
          return thread;
        }),
      );
    }
  };

  // Helper function to add message to thread
  const addMessageToThread = (threadId: string, message: any) => {
    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: [...thread.messages, message],
            lastMessage: message.content.substring(0, 50) + '...',
            timestamp: new Date(),
          };
        }
        return thread;
      }),
    );
  };

  // Demo Flow A: Month-end Reconciliation
  const startMonthEndReconciliation = () => {
    const threadId = createNewThread(
      'Month-End Close - January',
      'reconciliation',
    );

    // Initial analysis
    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '📊 Starting month-end reconciliation for January...\n\nAnalyzing transactions...',
        timestamp: new Date(),
        actions: [
          {
            type: 'analyze',
            status: 'executing',
            target: 'january_transactions',
          },
        ],
      });
    }, 500);

    // Found issues
    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '⚠️ Found 15 unmatched transactions totaling $47,239:\n\n• 3 missing invoices\n• 5 uncategorized expenses\n• 7 pending vendor confirmations\n\nShould I search for missing documentation?',
        timestamp: new Date(),
        actions: [
          {
            type: 'analyze',
            status: 'completed',
            target: 'january_transactions',
          },
        ],
      });
    }, 2000);

    // User response simulation
    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content:
          'Yes, find all missing invoices and request context for unclear items',
        timestamp: new Date(),
      });
    }, 3500);

    // Search and create threads
    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '🔍 Searching Gmail, Slack, and Teams...\n\n✅ Found 12 matches!\n📧 Creating 3 context request threads for:\n• Wire transfer $15,000 → Thread created\n• ACH debit $892.45 → Thread created\n• Check #2341 $8,500 → Thread created',
        timestamp: new Date(),
        actions: [
          { type: 'search', status: 'completed', target: 'all_channels' },
        ],
      });

      // Create the 3 sub-threads with slight delays to ensure unique IDs
      const wire = createNewThread('Context: Wire $15,000', 'email');
      setTimeout(() => {
        const ach = createNewThread('Context: ACH $892.45', 'email');
      }, 50);
      setTimeout(() => {
        const check = createNewThread('Context: Check #2341', 'email');
      }, 100);
    }, 5000);

    // Final resolution
    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '✅ All items reconciled!\n\nSummary:\n• 15 transactions matched\n• $47,239 categorized\n• 3 vendor confirmations received\n• GL codes assigned with 95% confidence\n\n📚 Books ready to close for January!',
        timestamp: new Date(),
        actions: [
          { type: 'reconcile', status: 'completed', target: 'january_close' },
        ],
      });

      toast({
        title: '✅ Month-End Complete',
        description: 'January books successfully closed',
      });
    }, 8000);
  };

  // Demo Flow B: Document Discovery
  const startDocumentDiscovery = () => {
    const threadId = createNewThread('Find Invoice INV-2024-089', 'search');

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content: 'Find invoice INV-2024-089 from Johnson Construction',
        timestamp: new Date(),
      });
    }, 500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '🔍 Searching for invoice INV-2024-089...',
        timestamp: new Date(),
        actions: [{ type: 'search', status: 'executing', target: 'gmail' }],
      });
    }, 1000);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '✅ Found it!\n\n📄 Invoice: INV-2024-089\n🏢 Vendor: Johnson Construction LLC\n💰 Amount: $8,500\n📅 Received: Jan 15, 2024\n\nLet me check payment status...',
        timestamp: new Date(),
        actions: [{ type: 'search', status: 'completed', target: 'gmail' }],
      });
    }, 2500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '✅ Payment confirmed!\n\n💳 Paid via: Check #2341\n📅 Payment date: Jan 20, 2024\n🏦 Cleared: Jan 22, 2024\n\nWould you like me to send a payment confirmation to the customer?',
        timestamp: new Date(),
        actions: [
          { type: 'match', status: 'completed', target: 'transaction' },
        ],
      });
    }, 4000);
  };

  // Demo Flow C: Complex Categorization (Venmo)
  const startComplexCategorization = () => {
    // Find the Venmo transaction if it exists
    const venmoTx = transactions?.find((tx) => tx.memo?.includes('VENMO')) || {
      id: 'venmo-demo',
      amount: -5000,
      memo: 'VENMO PAYMENT',
      txnDate: new Date(),
    };

    const threadId = createNewThread(
      `Context: Venmo $5,000`,
      'context',
      venmoTx,
    );

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '📧 Sending email to client...\n\nSubject: Quick question about Venmo payment\n\n"Hi John,\n\nI need help identifying a $5,000 Venmo payment from Jan 25. Could you let me know who this was for and if they\'re a contractor or employee?\n\nThanks!"',
        timestamp: new Date(),
        actions: [
          { type: 'email_sent', status: 'executing', target: 'client' },
        ],
      });
    }, 500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content:
          "📧 Client Response:\n\n\"That was for Sarah Chen, our UI designer. She's a 1099 contractor. I'm attaching her invoice for January's work (40 hours @ $125/hr). She should be set up for monthly payments going forward.\"",
        timestamp: new Date(),
      });
    }, 3000);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          "✅ Perfect! I've processed this:\n\n👤 Created vendor: Sarah Chen (UI Designer)\n📋 Category: 1099 Contractor - Design Services\n📊 GL Code: 5100 (Marketing & Design)\n📄 1099 tracking: Added for year-end reporting\n🔄 Recurring: Marked as monthly expense\n\nAll set for future automated categorization!",
        timestamp: new Date(),
        actions: [
          { type: 'vendor_created', status: 'completed', target: 'sarah_chen' },
          { type: 'categorize', status: 'completed', target: 'venmo_payment' },
        ],
      });

      // Update UI to show categorization
      if (venmoTx.id !== 'venmo-demo') {
        setTransactionGLCodes((prev: any) => ({
          ...prev,
          [venmoTx.id]: {
            code: '5100',
            confidence: 95,
            reason: 'Contractor payment - Sarah Chen (UI Design)',
          },
        }));
        setClarifiedItems((prev) => new Set([...prev, `tx-${venmoTx.id}`]));
      }
    }, 5000);
  };

  // Demo Flow D: Bill Payment Execution
  const startBillPayment = () => {
    const threadId = createNewThread('Bill Payment - Weekly', 'payment');

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content: 'Show me bills due this week',
        timestamp: new Date(),
      });
    }, 500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `📋 5 bills due this week (Total: $23,456.67):\n\n🔴 Due TODAY:\n• AWS: $1,249.67\n\n🟡 Due Tomorrow:\n• Office Rent: $8,500.00\n\n🟢 Due in 2-3 days:\n• Legal Services: $12,000.00\n• Google Workspace: $450.00\n• Office Depot: $1,257.00\n\nShould I prioritize the urgent ones?`,
        timestamp: new Date(),
      });
    }, 1500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content: 'Yes, pay the urgent ones first',
        timestamp: new Date(),
      });
    }, 3000);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '💳 Scheduling payments via Mercury:\n\n⏳ Processing...',
        timestamp: new Date(),
        actions: [
          { type: 'payment', status: 'executing', target: 'mercury_api' },
        ],
      });
    }, 3500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '✅ Payments processed:\n\n• AWS → Immediate ACH (Confirmation: #ACH-78234)\n• Office Rent → Wire scheduled for 9am tomorrow (#WIRE-92834)\n\n💰 Account balance after payments: $45,234.56\n\nWould you like me to schedule the remaining 3 bills?',
        timestamp: new Date(),
        actions: [
          { type: 'payment', status: 'completed', target: 'mercury_api' },
        ],
      });

      toast({
        title: '💳 Payments Sent',
        description: '2 urgent bills paid via Mercury',
      });
    }, 5500);
  };

  // Demo Flow E: Duplicate Detection
  const startDuplicateDetection = () => {
    const threadId = createNewThread('Duplicate Alert', 'alert');

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '⚠️ Possible duplicate detected:\n\nTwo AWS charges of $1,249.67:\n• Jan 16: AWS AMAZON WEB SERV\n• Jan 19: AWS AMAZON WEB SERV\n\nThese are 3 days apart. Should I investigate?',
        timestamp: new Date(),
        actions: [
          {
            type: 'duplicate_detection',
            status: 'completed',
            target: 'aws_charges',
          },
        ],
      });
    }, 500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content: 'Yes, check if one is a reversal',
        timestamp: new Date(),
      });
    }, 2000);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          "🔍 Analyzing transaction details...\n\n✅ You're right! The second charge is a credit/reversal:\n• Jan 16: -$1,249.67 (Debit)\n• Jan 19: +$1,249.67 (Credit)\n\nNet impact: $0.00\n\nLikely a billing error that AWS corrected. I'll mark these as reconciled.",
        timestamp: new Date(),
      });
    }, 3500);
  };

  // Demo Flow F: Fraud Detection
  const startFraudDetection = () => {
    const threadId = createNewThread('🚨 URGENT: Fraud Alert', 'alert');

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '🚨 URGENT: Suspicious activity detected!\n\n3 wire transfers to new account:\n• $10,000 to Cayman Islands (Jan 30)\n• Recipient: "OFFSHORE HOLDINGS LLC"\n• First time recipient\n• Outside normal business hours\n\nRisk Score: 9.5/10\n\nRecommended actions?',
        timestamp: new Date(),
        actions: [
          { type: 'fraud_detection', status: 'alert', target: 'wire_transfer' },
        ],
      });

      // Also show a system-wide alert
      toast({
        title: '🚨 Fraud Alert',
        description: 'Suspicious wire transfer detected',
        variant: 'destructive',
      });
    }, 500);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'user',
        content: 'Freeze those immediately and notify the bank!',
        timestamp: new Date(),
      });
    }, 2000);

    setTimeout(() => {
      addMessageToThread(threadId, {
        id: Date.now().toString(),
        type: 'assistant',
        content:
          '🔒 Security actions taken:\n\n✅ Wire transfer frozen\n✅ Bank notified (Case #SEC-89234)\n✅ Account temporarily locked\n✅ Incident report created\n📧 Security alert sent to all admins\n\nNext steps:\n• Bank will call within 10 minutes\n• Review all transactions from past 48 hours\n• Change account credentials',
        timestamp: new Date(),
        actions: [
          {
            type: 'security_action',
            status: 'completed',
            target: 'freeze_transfer',
          },
        ],
      });
    }, 3500);
  };

  const handleMissingInvoiceAction = async (
    threadId: string = activeThreadId,
  ) => {
    // Add processing message
    const processingMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content:
        '🔍 Searching for missing invoices across your connected channels...',
      timestamp: new Date(),
      actions: [
        {
          type: 'search',
          status: 'executing',
          target: 'missing_invoices',
        },
      ],
    };
    addMessageToThread(threadId, processingMessage);

    // Simulate search
    setTimeout(() => {
      const resultMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          '✅ Found 3 transactions without matching invoices:\n• AWS payment ($1,249.67)\n• Office supplies ($237.84)\n• Contractor payment ($2,500.00)\n\nWould you like me to search Gmail and Slack for these invoices?',
        timestamp: new Date(),
        actions: [
          {
            type: 'search',
            status: 'completed',
            target: 'missing_invoices',
            result: { found: 3, channels: ['gmail', 'slack'] },
          },
        ],
      };
      addMessageToThread(threadId, resultMessage);
    }, 2000);
  };

  const handleCategorizeAction = async (
    message: string,
    threadId: string = activeThreadId,
  ) => {
    const processingMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: '🤖 Analyzing transactions and applying AI categorization...',
      timestamp: new Date(),
      actions: [
        {
          type: 'categorize',
          status: 'executing',
          target: 'transactions',
        },
      ],
    };
    addMessageToThread(threadId, processingMessage);

    // Simulate categorization
    setTimeout(() => {
      // Actually update some transaction GL codes
      if (transactions && transactions.length > 0) {
        const tx = transactions[0];
        setTransactionGLCodes((prev: any) => ({
          ...prev,
          [tx.id]: {
            code: '5200',
            confidence: 95,
            reason: 'AI categorized based on vendor pattern',
          },
        }));
      }

      const resultMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          '✅ Categorized 8 transactions:\n• 3 as Software & Subscriptions (GL 5200)\n• 2 as Marketing (GL 5100)\n• 3 as Operating Expenses (GL 5000)\n\nCheck the transactions tab to see the updates!',
        timestamp: new Date(),
        actions: [
          {
            type: 'categorize',
            status: 'completed',
            target: 'transactions',
            result: { categorized: 8 },
          },
        ],
      };
      addMessageToThread(threadId, resultMessage);

      // Show toast for UI update
      toast({
        title: '📊 Transactions Categorized',
        description: 'AI has updated GL codes for 8 transactions',
      });
    }, 3000);
  };

  const handleSyncAction = async (
    message: string,
    threadId: string = activeThreadId,
  ) => {
    const processingMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: '🔄 Syncing data from connected channels...',
      timestamp: new Date(),
      actions: [
        {
          type: 'sync',
          status: 'executing',
          target: 'channels',
        },
      ],
    };
    addMessageToThread(threadId, processingMessage);

    // Simulate sync
    setTimeout(() => {
      const resultMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          '✅ Sync completed:\n• Gmail: 12 new documents\n• Slack: 3 new messages\n• Found 2 new invoices that match existing transactions',
        timestamp: new Date(),
        actions: [
          {
            type: 'sync',
            status: 'completed',
            target: 'channels',
            result: { newDocuments: 15, newMatches: 2 },
          },
        ],
      };
      addMessageToThread(threadId, resultMessage);

      // Update channel counts
      setChannels((prev: any) =>
        prev.map((channel: any) => ({
          ...channel,
          documentCount:
            channel.status === 'connected'
              ? channel.documentCount + Math.floor(Math.random() * 5)
              : channel.documentCount,
          lastSync:
            channel.status === 'connected' ? new Date() : channel.lastSync,
        })),
      );
    }, 2500);
  };

  const handleMatchAction = async (threadId: string = activeThreadId) => {
    const processingMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: '🔗 Running AI matching algorithm...',
      timestamp: new Date(),
      actions: [
        {
          type: 'match',
          status: 'executing',
          target: 'invoices_transactions',
        },
      ],
    };
    addMessageToThread(threadId, processingMessage);

    // Simulate matching
    setTimeout(() => {
      // Trigger actual match proposal
      proposeMatches.mutate({});

      const resultMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          '✅ Found 5 potential matches with 85%+ confidence:\n• AWS invoice ↔ Transaction $1,249.67\n• Office supplies ↔ Transaction $237.84\n• 3 more matches pending review\n\nCheck the Matches tab!',
        timestamp: new Date(),
        actions: [
          {
            type: 'match',
            status: 'completed',
            target: 'invoices_transactions',
            result: { matches: 5, highConfidence: 2 },
          },
        ],
      };
      addMessageToThread(threadId, resultMessage);
    }, 3000);
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

      // 1. Mark the item as clarified
      setClarifiedItems((prev) => new Set([...prev, `tx-${transactionId}`]));

      // 2. Update the transaction's categorization in UI and database
      setTransactionGLCodes((prev) => ({
        ...prev,
        [request.item.id]: {
          code: glCode,
          confidence: 95,
          reason: `Client confirmed: ${responses.q1}`,
        },
      }));

      // Persist to database
      await updateTransactionGLCode.mutateAsync({
        id: request.item.id,
        glCode: glCode,
        confidence: 95,
        reason: `Client confirmed: ${responses.q1}`,
        status: 'confirmed',
      });

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

  // Pre-categorize most transactions when loaded (except demo ones)
  const preCategorizeTransactions = (txList: any[]) => {
    const categorizations: Record<string, any> = {};

    txList.forEach((tx) => {
      const desc = (tx.memo || tx.counterparty || '').toLowerCase();

      // Pre-categorize most transactions with high confidence
      // Leave only specific ones for demo (CHK 2341, VENMO, WIRE, ACH UNKNOWN)
      if (desc.includes('stripe transfer')) {
        categorizations[tx.id] = {
          code: '3000',
          confidence: 95,
          reason: 'Revenue from Stripe',
        };
      } else if (desc.includes('aws')) {
        categorizations[tx.id] = {
          code: '5200',
          confidence: 92,
          reason: 'Cloud Infrastructure',
        };
      } else if (desc.includes('google') || desc.includes('gsuite')) {
        categorizations[tx.id] = {
          code: '5200',
          confidence: 90,
          reason: 'Google Workspace',
        };
      } else if (desc.includes('amzn') || desc.includes('amazon')) {
        categorizations[tx.id] = {
          code: '5400',
          confidence: 88,
          reason: 'Office Supplies',
        };
      } else if (desc.includes('paypal')) {
        categorizations[tx.id] = {
          code: '5300',
          confidence: 85,
          reason: 'Contractor Payment',
        };
      } else if (desc.includes('office')) {
        categorizations[tx.id] = {
          code: '5400',
          confidence: 87,
          reason: 'Office Supplies',
        };
      } else if (desc.includes('dropbox')) {
        categorizations[tx.id] = {
          code: '5200',
          confidence: 91,
          reason: 'File Storage',
        };
      } else if (desc.includes('deposit')) {
        categorizations[tx.id] = {
          code: '1000',
          confidence: 95,
          reason: 'Customer Deposit',
        };
      }
      // Leave these uncategorized for demo:
      // - CHK 2341 (check)
      // - WIRE OUT
      // - VENMO PAYMENT
      // - ACH DEBIT UNKNOWN
    });

    return categorizations;
  };

  // Enhanced demo data showcasing 4 categorization scenarios
  const sampleCSV = `Date,Description,Amount,Currency
2024-01-15,STRIPE TRANSFER 12345,28479.93,USD
2024-01-16,AWS AMAZON WEB SERV,-1249.67,USD
2024-01-17,GOOGLE*GSUITE_ACME,-450.00,USD
2024-01-18,CHK 2341 JOHNSON CONSTRUCTION,-8500.00,USD
2024-01-19,SHOPIFY MONTHLY SUB,-299.00,USD
2024-01-20,PAYPAL *SARAH CHEN DESIGN,-2500.00,USD
2024-01-21,AMZN Mktp US*RT4Y6,-237.84,USD
2024-01-22,MICROSOFT 365 BUSINESS,-360.00,USD
2024-01-23,STRIPE TRANSFER 67890,15234.50,USD
2024-01-24,WIRE OUT 823744,-15000.00,USD
2024-01-25,VENMO PAYMENT MIKE R,-1500.00,USD
2024-01-26,OFFICE DEPOT #4829,-847.23,USD
2024-01-27,ACH DEBIT UNKNOWN VENDOR,-892.45,USD
2024-01-28,TST* DROPBOX BUSINESS,-199.00,USD
2024-01-29,DEPOSIT CLIENT PAYMENT,25000.00,USD
2024-01-30,ZOOM VIDEO COMM,-149.90,USD
2024-01-31,TECHSTART SOLUTIONS CONSULTING,-3500.00,USD`;

  // Mock pending bills for payment flow
  const mockPendingBills = [
    {
      id: 'bill-1',
      vendor: 'AWS',
      amount: 1249.67,
      dueDate: new Date(),
      status: 'pending',
      urgency: 'high',
    },
    {
      id: 'bill-2',
      vendor: 'Office Rent',
      amount: 8500.0,
      dueDate: new Date(Date.now() + 86400000),
      status: 'pending',
      urgency: 'high',
    },
    {
      id: 'bill-3',
      vendor: 'Google Workspace',
      amount: 450.0,
      dueDate: new Date(Date.now() + 3 * 86400000),
      status: 'pending',
      urgency: 'medium',
    },
    {
      id: 'bill-4',
      vendor: 'Legal Services LLP',
      amount: 12000.0,
      dueDate: new Date(Date.now() + 2 * 86400000),
      status: 'pending',
      urgency: 'high',
    },
    {
      id: 'bill-5',
      vendor: 'Office Depot',
      amount: 1257.0,
      dueDate: new Date(Date.now() + 2 * 86400000),
      status: 'pending',
      urgency: 'low',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* WIP Banner */}
      {/* <div className="bg-yellow-400 dark:bg-yellow-600 text-black dark:text-white">
        <div className="px-6 py-2 flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            Work in Progress - This is a demo/prototype feature
          </span>
          <AlertTriangle className="h-4 w-4" />
        </div>
      </div> */}

      {/* Animated gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex h-[calc(100vh-44px)]">
        {/* Main Content Area */}
        <div
          className={`flex-1 p-6 space-y-6 transition-all duration-300 ${isChatOpen ? 'mr-[450px]' : ''}`}
        >
          {/* Demo Controls Bar - Streamlined */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-800/50 p-4">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
                    <Sparkles className="h-5 w-5 text-primary relative z-10" />
                  </div>
                  <h3 className="font-semibold text-sm">Demo Scenarios</h3>
                  <Badge
                    variant="outline"
                    className="text-xs bg-white/50 dark:bg-neutral-800/50"
                  >
                    Interactive Demo
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startDocumentDiscovery}
                  className="h-8 px-3 hover:bg-primary/10 hover:text-primary"
                >
                  <FileText className="h-3.5 w-3.5 mr-2" />
                  <span className="text-xs">Find Invoice</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startBillPayment}
                  className="h-8 px-3 hover:bg-primary/10 hover:text-primary"
                >
                  <DollarSign className="h-3.5 w-3.5 mr-2" />
                  <span className="text-xs">Pay Bills</span>
                </Button>
                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    // Load comprehensive demo data
                    await importCSV.mutateAsync({
                      csvContent: sampleCSV,
                      source: 'demo_data',
                    });
                    await syncGmail.mutateAsync();
                    toast({
                      title: '✅ Demo Data Loaded',
                      description: 'Sample transactions and invoices ready',
                    });
                  }}
                  className="h-8 px-3 hover:bg-primary/10 hover:text-primary"
                >
                  <Database className="h-3.5 w-3.5 mr-2" />
                  <span className="text-xs">Load All Data</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Reset to clean state
                    setActiveThreadId('main');
                    setChatThreads([
                      {
                        id: 'main',
                        title: 'Main Chat',
                        type: 'main',
                        unread: 0,
                        lastMessage: 'Welcome! How can I help you today?',
                        timestamp: new Date(),
                        status: 'active',
                        messages: [
                          {
                            id: '1',
                            type: 'assistant',
                            content:
                              'Welcome! I can help you process documents, categorize transactions, and find missing invoices. What would you like to do?',
                            timestamp: new Date(),
                          },
                        ],
                      },
                    ]);
                    toast({
                      title: '✅ Reset Complete',
                      description: 'Chat threads cleared',
                    });
                  }}
                  className="h-8 px-3 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-2" />
                  <span className="text-xs">Reset</span>
                </Button>
              </div>
            </div>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse" />
          </div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                Invoice Reconciliation
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                AI-powered transaction matching and categorization
              </p>
            </div>

            <div className="flex gap-2">
              {/* Chat Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="h-9 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                <span className="text-sm">
                  {isChatOpen ? 'Hide Chat' : 'Show Chat'}
                </span>
              </Button>

              {/* AI Context Button */}
              <Dialog
                open={companyContextOpen}
                onOpenChange={setCompanyContextOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-9 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
                  >
                    <Brain className="h-3.5 w-3.5 mr-2" />
                    <span className="text-sm">AI Context</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>AI Context & Learning</DialogTitle>
                    <DialogDescription>
                      Train the AI with your company's accounting preferences
                      and patterns
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
                                variant={
                                  rule.autoApprove ? 'default' : 'secondary'
                                }
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
                          {companyContext.preferredVendors.map(
                            (vendor, idx) => (
                              <Badge key={idx} variant="outline">
                                {vendor}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={() => proposeMatches.mutate({})}
                disabled={proposeMatches.isPending}
                variant="outline"
                className="h-9 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary"
              >
                {proposeMatches.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                ) : (
                  <Link2 className="h-3.5 w-3.5 mr-2" />
                )}
                <span className="text-sm">Propose Matches</span>
              </Button>

              {/* Delete All Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all transactions, invoices,
                      and matches. This action cannot be undone.
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

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Total Transactions
                </CardDescription>
                <CardTitle className="text-2xl font-bold">
                  {transactions?.length || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Categorized
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-green-600">
                  {transactions?.filter(
                    (t) => (t as any).glCode || transactionGLCodes[t.id],
                  ).length || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Uncategorized
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-amber-600">
                  {transactions?.filter(
                    (t) =>
                      !(t as any).glCode &&
                      !transactionGLCodes[t.id] &&
                      !contextRequests.some(
                        (req) =>
                          req.itemId === t.id && req.status === 'pending',
                      ),
                  ).length || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm border-neutral-200/50 dark:border-neutral-700/50">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Pending Context
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  {contextRequests.filter((req) => req.status === 'pending')
                    .length || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">
                  Transactions
                  {transactions && transactions.length > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {transactions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Supporting Documents
                  <Badge className="ml-2" variant="secondary">
                    {invoices?.length || 0}
                  </Badge>
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
                          onClick={async () => {
                            // Load demo transactions
                            await importCSV.mutateAsync({
                              csvContent: sampleCSV,
                              source: 'demo_data',
                            });
                          }}
                          disabled={importCSV.isPending}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          {importCSV.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Database className="h-4 w-4 mr-2" />
                          )}
                          Load Demo Data
                        </Button>

                        <Dialog
                          open={csvDialogOpen}
                          onOpenChange={setCsvDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button>
                              <Upload className="h-4 w-4 mr-2" />
                              Import CSV
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Import Transactions from CSV
                              </DialogTitle>
                              <DialogDescription>
                                Paste your CSV content or upload a file. The
                                system will automatically detect columns.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div>
                                <Label>CSV Content</Label>
                                <Textarea
                                  placeholder="Paste your CSV content here..."
                                  value={csvContent}
                                  onChange={(e) =>
                                    setCsvContent(e.target.value)
                                  }
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
                          <TableHead className="w-[100px]">Date</TableHead>
                          <TableHead className="w-[150px]">
                            Counterparty
                          </TableHead>
                          <TableHead className="min-w-[200px]">
                            Description
                          </TableHead>
                          <TableHead className="text-right w-[120px]">
                            Amount
                          </TableHead>
                          <TableHead className="w-[200px]">GL Code</TableHead>
                          <TableHead className="w-[150px]">
                            Supporting Doc
                          </TableHead>
                          <TableHead className="w-[150px]">Status</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions?.map((tx) => {
                          const suggestedGL = getSuggestedGLCode(
                            tx.counterparty || undefined,
                            tx.memo || undefined,
                          );
                          // Use GL code from database if available, otherwise from local state
                          const dbGLCode = (tx as any).glCode;
                          const dbGLConfidence = (tx as any).glCodeConfidence;
                          const localGL = transactionGLCodes[tx.id];

                          const assignedGLCode =
                            dbGLCode ||
                            (typeof localGL === 'object'
                              ? (localGL as any).code
                              : localGL);
                          const glConfidence =
                            dbGLConfidence ||
                            (typeof localGL === 'object'
                              ? (localGL as any).confidence
                              : null);

                          // Determine status
                          const hasContextRequest = contextRequests.some(
                            (r) => r.itemId === tx.id,
                          );
                          const isWaitingForResponse =
                            hasContextRequest &&
                            contextRequests.find((r) => r.itemId === tx.id)
                              ?.status === 'pending';
                          const hasResponse = clarifiedItems.has(`tx-${tx.id}`);

                          return (
                            <TableRow
                              key={tx.id}
                              className={
                                hasResponse
                                  ? 'bg-green-50 dark:bg-green-950/20'
                                  : isWaitingForResponse
                                    ? 'bg-yellow-50 dark:bg-yellow-950/20'
                                    : !assignedGLCode
                                      ? 'bg-red-50 dark:bg-red-950/20'
                                      : ''
                              }
                            >
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
                              <TableCell className="min-w-[200px]">
                                <div className="flex flex-col gap-1.5">
                                  {assignedGLCode ? (
                                    <Badge
                                      variant="default"
                                      className="gap-1 w-fit text-xs"
                                    >
                                      <Hash className="h-3 w-3 flex-shrink-0" />
                                      <span className="font-mono">
                                        {assignedGLCode}
                                      </span>
                                      {glConfidence && (
                                        <span className="opacity-70">
                                          {glConfidence}%
                                        </span>
                                      )}
                                    </Badge>
                                  ) : suggestedGL ? (
                                    <Badge
                                      variant="secondary"
                                      className="gap-1 w-fit text-xs"
                                    >
                                      <Sparkles className="h-3 w-3 flex-shrink-0" />
                                      <span className="font-mono">
                                        {suggestedGL.code}
                                      </span>
                                      <span className="opacity-70">
                                        {suggestedGL.confidence}%
                                      </span>
                                    </Badge>
                                  ) : null}

                                  <Select
                                    value={assignedGLCode || ''}
                                    onValueChange={(value) =>
                                      handleAssignGLCode(
                                        tx.id,
                                        value,
                                        'transaction',
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full max-w-[180px] h-8 text-xs">
                                      <SelectValue placeholder="Select GL Code" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                      {mockGLCodes.map((gl) => (
                                        <SelectItem
                                          key={gl.code}
                                          value={gl.code}
                                        >
                                          <div className="flex flex-col items-start">
                                            <div className="flex items-center gap-2">
                                              <span className="font-mono font-semibold text-xs">
                                                {gl.code}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-[10px] py-0 px-1"
                                              >
                                                {gl.category}
                                              </Badge>
                                            </div>
                                            <span className="text-[11px] text-muted-foreground">
                                              {gl.name}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                              <TableCell className="min-w-[150px]">
                                {/* Supporting Document Status */}
                                {(() => {
                                  const desc = (
                                    tx.memo ||
                                    tx.counterparty ||
                                    ''
                                  ).toLowerCase();
                                  const amount = Math.abs(Number(tx.amount));

                                  // Check matched invoices first (from our fetch flow)
                                  const localMatchedInvoice =
                                    matchedInvoices[tx.id];
                                  if (localMatchedInvoice) {
                                    return (
                                      <Badge
                                        variant="outline"
                                        className="gap-1 text-xs"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {localMatchedInvoice.invoiceNumber}
                                      </Badge>
                                    );
                                  }

                                  // Check if we have a matching invoice from backend
                                  const matchingInvoice = invoices?.find(
                                    (inv) => {
                                      const invAmount = Math.abs(
                                        Number(inv.totalAmount),
                                      );
                                      const txAmount = Math.abs(
                                        Number(tx.amount),
                                      );
                                      // More flexible matching
                                      return (
                                        Math.abs(invAmount - txAmount) < 10 &&
                                        (inv.vendor
                                          ?.toLowerCase()
                                          .includes(
                                            tx.counterparty?.toLowerCase() ||
                                              '',
                                          ) ||
                                          tx.memo
                                            ?.toLowerCase()
                                            .includes(
                                              inv.vendor?.toLowerCase() || '',
                                            ))
                                      );
                                    },
                                  );

                                  if (matchingInvoice) {
                                    return (
                                      <Badge
                                        variant="outline"
                                        className="gap-1 text-xs"
                                      >
                                        <FileText className="h-3 w-3" />
                                        {matchingInvoice.invoiceNumber ||
                                          'INV-' +
                                            matchingInvoice.id.slice(0, 8)}
                                      </Badge>
                                    );
                                  }

                                  // Determine if this transaction needs an invoice
                                  const needsInvoice =
                                    // Large vendor payments need invoices
                                    (amount > 1000 &&
                                      (desc.includes('aws') ||
                                        desc.includes('google') ||
                                        desc.includes('microsoft') ||
                                        desc.includes('shopify') ||
                                        desc.includes('office depot') ||
                                        desc.includes('johnson construction') ||
                                        desc.includes('techstart') ||
                                        desc.includes('sarah chen') ||
                                        desc.includes('zoom') ||
                                        desc.includes('dropbox'))) ||
                                    // Wire transfers and large checks need documentation
                                    (desc.includes('wire') && amount > 5000) ||
                                    (desc.includes('chk') && amount > 2000);

                                  // Revenue transactions don't need invoices
                                  if (
                                    desc.includes('stripe transfer') ||
                                    desc.includes('deposit')
                                  ) {
                                    return (
                                      <span className="text-xs text-muted-foreground">
                                        —
                                      </span>
                                    );
                                  }

                                  // Show Fetch Invoice button only for transactions that need it
                                  if (needsInvoice) {
                                    return (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs hover:bg-amber-50 hover:text-amber-700"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleFetchInvoice(tx);
                                        }}
                                      >
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Fetch Invoice
                                      </Button>
                                    );
                                  }

                                  // Small transactions don't need invoices
                                  return (
                                    <span className="text-xs text-muted-foreground">
                                      —
                                    </span>
                                  );
                                })()}
                              </TableCell>
                              <TableCell className="min-w-[150px]">
                                <div className="flex flex-col gap-1">
                                  {/* Show only one status badge at a time, in priority order */}
                                  {hasResponse && assignedGLCode ? (
                                    <Badge
                                      variant="default"
                                      className="gap-1 w-fit bg-green-100 text-green-800 border-green-200"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                      Reconciled
                                    </Badge>
                                  ) : assignedGLCode &&
                                    glConfidence &&
                                    glConfidence >= 80 ? (
                                    <Badge
                                      variant="default"
                                      className="gap-1 w-fit"
                                    >
                                      <Check className="h-3 w-3" />
                                      Categorized
                                    </Badge>
                                  ) : assignedGLCode &&
                                    glConfidence &&
                                    glConfidence < 80 ? (
                                    <Badge
                                      variant="secondary"
                                      className="gap-1 w-fit"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                      Low Confidence
                                    </Badge>
                                  ) : isWaitingForResponse ? (
                                    <Badge
                                      variant="secondary"
                                      className="gap-1 w-fit bg-yellow-100 text-yellow-800 border-yellow-200"
                                    >
                                      <Clock className="h-3 w-3" />
                                      Pending Context
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="destructive"
                                      className="gap-1 w-fit"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                      Needs Review
                                    </Badge>
                                  )}
                                </div>
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
                                      handleCreateContextRequest(
                                        tx,
                                        'transaction',
                                      )
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

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                {/* Connection Sources */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {channels.map((channel) => (
                    <Card key={channel.id} className="relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{channel.icon}</span>
                            <div>
                              <CardTitle className="text-base">
                                {channel.name}
                              </CardTitle>
                              <Badge
                                variant={
                                  channel.status === 'connected'
                                    ? 'default'
                                    : 'secondary'
                                }
                                className="text-xs mt-1"
                              >
                                {channel.status}
                              </Badge>
                            </div>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              channel.status === 'connected'
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Documents
                            </span>
                            <span className="font-semibold">
                              {channel.documentCount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Last Sync
                            </span>
                            <span className="text-xs">
                              {channel.lastSync
                                ? channel.lastSync.toLocaleTimeString()
                                : 'Never'}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            {channel.status === 'connected' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() =>
                                  handleSendMessage(`Sync ${channel.name}`)
                                }
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Sync
                              </Button>
                            ) : (
                              <Button size="sm" className="flex-1">
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Supporting Documents */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Extracted Documents</CardTitle>
                        <CardDescription>
                          AI-processed invoices and receipts from connected
                          sources
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Dialog
                          open={invoiceDialogOpen}
                          onOpenChange={setInvoiceDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Document
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Upload Supporting Document
                              </DialogTitle>
                              <DialogDescription>
                                Upload an invoice, receipt, or other supporting
                                document
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Document Type</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select document type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="invoice">
                                      Invoice
                                    </SelectItem>
                                    <SelectItem value="receipt">
                                      Receipt
                                    </SelectItem>
                                    <SelectItem value="contract">
                                      Contract
                                    </SelectItem>
                                    <SelectItem value="statement">
                                      Statement
                                    </SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Upload File</Label>
                                <Input
                                  type="file"
                                  accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      toast({
                                        title: 'Document uploaded',
                                        description:
                                          'Processing document with AI...',
                                      });
                                      setInvoiceDialogOpen(false);
                                    }
                                  }}
                                />
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
                          <TableHead>Document</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extractedDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div className="font-medium">{doc.title}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {doc.type === 'invoice' ? '📄' : '💬'}{' '}
                                {doc.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>
                                  {
                                    channels.find((c) => c.id === doc.source)
                                      ?.icon
                                  }
                                </span>
                                <span className="text-sm">{doc.source}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {doc.amount ? (
                                <span className="font-mono">
                                  ${doc.amount.toFixed(2)}
                                </span>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  doc.confidence > 80 ? 'default' : 'secondary'
                                }
                              >
                                {doc.confidence}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  doc.status === 'processed'
                                    ? 'default'
                                    : doc.status === 'pending'
                                      ? 'secondary'
                                      : 'outline'
                                }
                              >
                                {doc.status.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleSendMessage(
                                      `Tell me about ${doc.title}`,
                                    )
                                  }
                                  title="Chat about this document"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                {doc.type === 'invoice' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleSendMessage(
                                        `Match ${doc.title} to transactions`,
                                      )
                                    }
                                    title="Find matching transaction"
                                  >
                                    <Link2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Persistent Chat Sidebar */}
          <div
            className={`fixed top-[44px] right-0 h-[calc(100vh-44px)] bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${isChatOpen ? 'w-[450px]' : 'w-0'} overflow-hidden z-40`}
          >
            {/* Chat Content */}
            <div className="h-full flex flex-col">
              <div className="pb-2 border-b p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">AI Assistant</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsChatOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Multi-thread conversations
                </p>
              </div>

              {/* Thread Switcher */}
              <div className="border-b p-2 bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-1 overflow-x-auto">
                  {chatThreads.map((thread) => (
                    <div key={thread.id} className="flex items-center gap-1">
                      <Button
                        variant={
                          activeThreadId === thread.id ? 'default' : 'ghost'
                        }
                        size="sm"
                        className="relative whitespace-nowrap"
                        onClick={() => setActiveThreadId(thread.id)}
                      >
                        {thread.type === 'email' && '📧 '}
                        {thread.type === 'context' && '💬 '}
                        {thread.type === 'main' && '🏠 '}
                        {thread.title}
                        {thread.unread > 0 && (
                          <Badge
                            className="ml-2 h-5 px-1"
                            variant="destructive"
                          >
                            {thread.unread}
                          </Badge>
                        )}
                        {thread.status === 'waiting' && (
                          <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                        )}
                      </Button>
                      {thread.id !== 'main' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setChatThreads((prev) =>
                              prev.filter((t) => t.id !== thread.id),
                            );
                            if (activeThreadId === thread.id) {
                              setActiveThreadId('main');
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newThreadId = createNewThread(
                        'New Chat',
                        'context',
                      );
                      handleSendMessage('How can I help you?', newThreadId);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages and Input */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Messages */}
                <div
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-450px)]"
                >
                  {chatMessages.map((message: any) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[80%] space-y-1">
                        {/* Sender Label */}
                        <div
                          className={`text-xs font-medium ${
                            message.type === 'user'
                              ? 'text-right text-blue-600'
                              : message.type === 'client'
                                ? 'text-orange-600'
                                : message.type === 'system'
                                  ? 'text-purple-600'
                                  : 'text-gray-600'
                          }`}
                        >
                          {message.type === 'user'
                            ? '👤 You'
                            : message.type === 'client'
                              ? '🏢 Client (John from Acme Corp)'
                              : message.type === 'system'
                                ? '⚠️ System Alert'
                                : '🤖 AI Assistant'}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`rounded-lg p-3 ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white ml-auto'
                              : message.type === 'client'
                                ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
                                : message.type === 'system'
                                  ? 'bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800'
                                  : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </div>

                          {/* Action indicators and buttons */}
                          {message.actions && (
                            <div className="mt-2 space-y-1">
                              {message.actions.map(
                                (action: any, idx: number) => (
                                  <div key={idx}>
                                    {/* Show buttons for proposal actions */}
                                    {action.type === 'proposal' &&
                                      action.buttons && (
                                        <div className="flex gap-2 mt-3">
                                          {action.buttons.map((button: any) => (
                                            <Button
                                              key={button.id}
                                              size="sm"
                                              variant={
                                                button.id === 'email'
                                                  ? 'default'
                                                  : 'outline'
                                              }
                                              onClick={() => {
                                                // Handle sending the context request
                                                const sendMethod =
                                                  button.action === 'send_email'
                                                    ? 'email'
                                                    : 'slack';
                                                handleSendContextRequest(
                                                  message.threadId,
                                                  message.itemId,
                                                  sendMethod,
                                                  message.questions,
                                                );
                                              }}
                                            >
                                              {button.label}
                                            </Button>
                                          ))}
                                        </div>
                                      )}
                                    {/* Show status for other actions */}
                                    {action.type !== 'proposal' && (
                                      <div className="flex items-center gap-2 text-xs">
                                        {action.status === 'executing' && (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        )}
                                        {action.status === 'completed' && (
                                          <CheckCircle className="h-3 w-3 text-green-500" />
                                        )}
                                        <span className="capitalize">
                                          {action.type}: {action.target}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          )}

                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask me anything about your finances..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage(chatInput);
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={() => handleSendMessage(chatInput)}
                      disabled={!chatInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick actions */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendMessage('Find missing invoices')}
                    >
                      Find Missing Invoices
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSendMessage('Categorize all transactions')
                      }
                    >
                      Auto-Categorize
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSendMessage('Match invoices to transactions')
                      }
                    >
                      Match All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                            if (
                              desc.includes('chk') ||
                              desc.includes('check')
                            ) {
                              return (
                                <div className="space-y-3">
                                  <p>Hi John,</p>
                                  <p>
                                    Quick question about a{' '}
                                    <strong>
                                      check for ${amount.toFixed(2)}
                                    </strong>{' '}
                                    that cleared on{' '}
                                    {new Date(
                                      item.txnDate,
                                    ).toLocaleDateString()}
                                    .
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
                                    <br />• What was it for? (invoice #,
                                    project, etc.)
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
                                    {new Date(
                                      item.txnDate,
                                    ).toLocaleDateString()}
                                    .
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
                                    {new Date(
                                      item.txnDate,
                                    ).toLocaleDateString()}
                                    .
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
                                    {new Date(
                                      item.txnDate,
                                    ).toLocaleDateString()}
                                    .
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
                                    {item.counterparty || 'an unknown vendor'}{' '}
                                    on{' '}
                                    {new Date(
                                      item.txnDate,
                                    ).toLocaleDateString()}
                                    .
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
    </div>
  );
}
