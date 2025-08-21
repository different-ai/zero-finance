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

  // Get current thread messages
  const currentThread = chatThreads.find((t) => t.id === activeThreadId);
  const chatMessages = currentThread?.messages || [];
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
    setRequestDialogOpen(true);

    // Send to backend
    await createContextRequest.mutateAsync({
      itemId: item.id,
      itemType: type,
      questions: questions,
    });

    // Add initial message to the new thread
    const emailMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `📧 Sending email to client about this ${type}...\n\nSubject: Quick question about ${new Date(item.txnDate || item.issueDate).toLocaleDateString()} transaction\n\nWaiting for response...`,
      timestamp: new Date(),
      actions: [
        {
          type: 'email_sent',
          status: 'executing',
          target: 'client_email',
        },
      ],
    };

    addMessageToThread(newThreadId, emailMessage);

    // Simulate email response after delay
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        type: 'user',
        content: `📧 Client Response:\n\n"Hi, this was for the Johnson Construction project - final payment for warehouse renovation. Invoice #JC-2024-089 was sent last week. The check was made out to Johnson Construction LLC."`,
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
          content: `✅ Thanks! I've now:\n• Matched this to Johnson Construction invoice\n• Applied GL Code 5300 (Professional Services)\n• Updated the transaction with 95% confidence\n\nThe transaction is now fully categorized and documented.`,
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

        // Actually update the UI
        handleMockClientResponse(request.id);
      }, 1000);
    }, 5000);
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
    const newThread = {
      id: `thread-${Date.now()}`,
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

      // Create the 3 sub-threads
      const wire = createNewThread('Context: Wire $15,000', 'email');
      const ach = createNewThread('Context: ACH $892.45', 'email');
      const check = createNewThread('Context: Check #2341', 'email');
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

  // Enhanced demo data for various scenarios
  const sampleCSV = `Date,Description,Amount,Currency
2024-01-15,STRIPE TRANSFER 12345,-2847.93,USD
2024-01-16,AWS AMAZON WEB SERV,-1249.67,USD
2024-01-17,GOOGLE*GSUITE_ACME,-450.00,USD
2024-01-18,CHK 2341,-8500.00,USD
2024-01-19,AWS AMAZON WEB SERV,-1249.67,USD
2024-01-20,PAYPAL *CONTRACTOR,-3500.00,USD
2024-01-22,AMZN Mktp US*RT4Y6,-237.84,USD
2024-01-23,STRIPE TRANSFER 67890,-5234.50,USD
2024-01-24,WIRE OUT 823744,-15000.00,USD
2024-01-25,VENMO PAYMENT,-5000.00,USD
2024-01-26,POS DEBIT - 4829 OFFICE D,-1847.23,USD
2024-01-27,ACH DEBIT UNKNOWN,-892.45,USD
2024-01-28,TST* DROPBOX 4KJ3M2,-199.00,USD
2024-01-29,DEPOSIT MOBILE CHECK,25000.00,USD
2024-01-30,WIRE OUT CAYMAN ISLANDS,-10000.00,USD
2024-01-31,TECHSTART SOLUTIONS,-3500.00,USD`;

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
    <div className="p-6 space-y-6">
      {/* Demo Controls Bar */}
      <Card className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Demo Scenarios</CardTitle>
              <Badge variant="secondary">Click to trigger flows</Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              For demonstration purposes
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startMonthEndReconciliation}
              className="justify-start"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Month-End Close
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startDocumentDiscovery}
              className="justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Find Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startComplexCategorization}
              className="justify-start"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Venmo Context
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startBillPayment}
              className="justify-start"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pay Bills
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startDuplicateDetection}
              className="justify-start"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Duplicate Alert
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={startFraudDetection}
              className="justify-start"
            >
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              Fraud Detection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                // Load comprehensive demo data
                await importCSV.mutateAsync({
                  csvContent: sampleCSV,
                  source: 'demo_data',
                });
                await syncGmail.mutateAsync();
                toast({
                  title: '📊 Demo Data Loaded',
                  description: 'Sample transactions and invoices ready',
                });
              }}
              className="justify-start"
            >
              <Database className="h-4 w-4 mr-2" />
              Load All Data
            </Button>
            <Button
              variant="outline"
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
                          'Welcome! Select a demo scenario above to see the AI in action.',
                        timestamp: new Date(),
                      },
                    ],
                  },
                ]);
                toast({
                  title: '🔄 Reset Complete',
                  description: 'Chat threads cleared',
                });
              }}
              className="justify-start"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Document Processing Hub</h1>
          <p className="text-muted-foreground mt-1">
            Connect channels, extract documents, and automate financial
            workflows with AI
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
            <CardTitle className="text-sm font-medium">Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {channels.filter((c) => c.status === 'connected').length}/3
            </div>
            <p className="text-xs text-muted-foreground mt-1">Connected</p>
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

      {/* Main Content with Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content - 2/3 width */}
        <div className="lg:col-span-2">
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
                Channels
                <Badge className="ml-2" variant="secondary">
                  {channels.filter((c) => c.status === 'connected').length}
                </Badge>
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
                        onClick={() => syncMercury.mutate()}
                        disabled={syncMercury.isPending}
                      >
                        {syncMercury.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 mr-2 bg-black rounded-sm flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              M
                            </span>
                          </div>
                        )}
                        Sync Mercury
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
                                    handleAssignGLCode(
                                      tx.id,
                                      value,
                                      'transaction',
                                    )
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
                                          <span className="text-xs">
                                            {gl.name}
                                          </span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{tx.source}</Badge>
                                {hasResponse && (
                                  <Badge variant="default" className="gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Clarified
                                  </Badge>
                                )}
                                {isWaitingForResponse && (
                                  <Badge variant="secondary" className="gap-1">
                                    <Clock className="h-3 w-3" />
                                    Waiting
                                  </Badge>
                                )}
                                {!assignedGLCode && !hasContextRequest && (
                                  <Badge
                                    variant="destructive"
                                    className="gap-1"
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

            {/* Channels Tab */}
            <TabsContent value="invoices" className="space-y-4">
              {/* Channels Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Connected Channels</CardTitle>
                      <CardDescription>
                        Manage your data sources and sync documents
                        automatically
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleSendMessage('Sync all channels')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
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
                                  className="text-xs"
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
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Documents
                              </span>
                              <span className="font-semibold">
                                {channel.documentCount}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">
                                Last Sync
                              </span>
                              <span className="text-sm">
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
                                  Sync
                                </Button>
                              ) : (
                                <Button size="sm" className="flex-1">
                                  Connect
                                </Button>
                              )}
                              <Button size="sm" variant="ghost">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Extracted Documents */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Extracted Documents</CardTitle>
                      <CardDescription>
                        AI-processed documents from your connected channels
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSendMessage('Find missing invoices')
                        }
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Find Missing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleSendMessage(
                            'Show me all invoices from this month',
                          )
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat with Data
                      </Button>
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
                              {doc.type === 'invoice' ? '📄' : '💬'} {doc.type}
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
                                {Number(item.invoice?.totalAmount || 0).toFixed(
                                  2,
                                )}
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
                                {Number(item.transaction?.amount || 0).toFixed(
                                  2,
                                )}
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
                                  confirmMatch.mutate({
                                    matchId: item.match.id,
                                  })
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
        </div>

        {/* Right Side - Chat Interface */}
        <div className="lg:col-span-1 h-full">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Assistant
              </CardTitle>
              <CardDescription className="text-xs">
                Multi-thread conversations for financial operations
              </CardDescription>
            </CardHeader>

            {/* Thread Switcher */}
            <div className="border-b p-2 bg-gray-50 dark:bg-gray-900">
              <div className="flex gap-1 overflow-x-auto">
                {chatThreads.map((thread) => (
                  <Button
                    key={thread.id}
                    variant={activeThreadId === thread.id ? 'default' : 'ghost'}
                    size="sm"
                    className="relative whitespace-nowrap"
                    onClick={() => setActiveThreadId(thread.id)}
                  >
                    {thread.type === 'email' && '📧 '}
                    {thread.type === 'context' && '💬 '}
                    {thread.type === 'main' && '🏠 '}
                    {thread.title}
                    {thread.unread > 0 && (
                      <Badge className="ml-2 h-5 px-1" variant="destructive">
                        {thread.unread}
                      </Badge>
                    )}
                    {thread.status === 'waiting' && (
                      <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                    )}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newThreadId = createNewThread('New Chat', 'context');
                    handleSendMessage('How can I help you?', newThreadId);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-450px)]">
                {chatMessages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>

                      {/* Action indicators */}
                      {message.actions && (
                        <div className="mt-2 space-y-1">
                          {message.actions.map((action: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs"
                            >
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
                          ))}
                        </div>
                      )}

                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
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
            </CardContent>
          </Card>
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
