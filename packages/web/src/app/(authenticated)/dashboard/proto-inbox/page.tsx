'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Mail,
  CreditCard,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Upload,
  Sparkles,
  Link,
  ArrowRight,
  Building,
  Hash,
  Filter,
  Search,
  Settings,
  ChevronDown,
  RefreshCw,
  Zap,
  Database,
  BookOpen,
  Tag,
  Lightbulb,
  Target,
  Brain,
  GitMerge,
  FileCheck,
  AlertTriangle,
  Info,
  X,
  Plus,
  Edit,
  Save,
  Copy,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

// Mock vendor mappings
const mockVendorMappings = [
  { vendor: 'AWS', glCode: '5200', confidence: 95 },
  { vendor: 'Google Workspace', glCode: '5200', confidence: 90 },
  { vendor: 'Slack', glCode: '5200', confidence: 88 },
  { vendor: 'Uber', glCode: '5500', confidence: 85 },
  { vendor: 'Office Depot', glCode: '5400', confidence: 92 },
  { vendor: 'LinkedIn', glCode: '5100', confidence: 87 },
];

// Enhanced mock transaction data
const mockTransactions = [
  {
    id: '1',
    source: 'email',
    sourceIcon: Mail,
    status: 'pending',
    vendor: 'AWS',
    description: 'Cloud Services - August 2024',
    amount: 2450.0,
    date: '2024-08-15',
    invoiceNumber: 'INV-2024-08-1234',
    dueDate: '2024-09-15',
    glCode: null,
    suggestedGLCode: '5200',
    confidence: 95,
    merchantCode: 'MCC-7372',
    matchedBankTransaction: null,
    requiresAction: true,
    rawEmailSubject: 'Your AWS Invoice for August 2024',
    attachments: ['aws-invoice-aug-2024.pdf'],
    taxAmount: 220.5,
    poNumber: null,
  },
  {
    id: '2',
    source: 'mercury',
    sourceIcon: CreditCard,
    status: 'pending',
    vendor: 'Slack Technologies',
    description: 'Team Subscription - Annual',
    amount: 8400.0,
    date: '2024-08-14',
    invoiceNumber: null,
    dueDate: null,
    glCode: null,
    suggestedGLCode: '5200',
    confidence: 88,
    merchantCode: 'MCC-7372',
    matchedBankTransaction: 'MERC-TXN-8923',
    requiresAction: true,
    transactionId: 'MERC-TXN-8923',
  },
  {
    id: '3',
    source: 'email',
    sourceIcon: Mail,
    status: 'pending',
    vendor: 'Acme Legal Services',
    description: 'Legal Consultation - Patent Filing',
    amount: 5000.0,
    date: '2024-08-13',
    invoiceNumber: 'LGL-2024-0892',
    dueDate: '2024-08-28',
    glCode: null,
    suggestedGLCode: '5300',
    confidence: 72,
    merchantCode: null,
    matchedBankTransaction: null,
    requiresAction: true,
    rawEmailSubject: 'Invoice: Patent Filing Services',
    attachments: ['legal-invoice-0892.pdf'],
    taxAmount: 450.0,
    poNumber: 'PO-2024-0156',
  },
  {
    id: '4',
    source: 'revolut',
    sourceIcon: CreditCard,
    status: 'matched',
    vendor: 'Google Workspace',
    description: 'Business Standard - 25 users',
    amount: 300.0,
    date: '2024-08-12',
    invoiceNumber: 'GWS-90234',
    dueDate: null,
    glCode: '5200',
    suggestedGLCode: '5200',
    confidence: 90,
    merchantCode: 'MCC-7372',
    matchedBankTransaction: 'REV-TXN-4521',
    requiresAction: false,
    transactionId: 'REV-TXN-4521',
    matchedEmailId: 'email-9823',
  },
  {
    id: '5',
    source: 'email',
    sourceIcon: Mail,
    status: 'duplicate',
    vendor: 'Office Depot',
    description: 'Office Supplies Order #8923',
    amount: 234.56,
    date: '2024-08-11',
    invoiceNumber: 'OD-8923-2024',
    dueDate: '2024-08-26',
    glCode: null,
    suggestedGLCode: '5400',
    confidence: 92,
    merchantCode: null,
    matchedBankTransaction: 'MERC-TXN-7234',
    requiresAction: true,
    duplicateOf: '6',
    rawEmailSubject: 'Your Office Depot Order Has Shipped',
    attachments: ['office-depot-invoice.pdf'],
  },
  {
    id: '6',
    source: 'mercury',
    sourceIcon: CreditCard,
    status: 'categorized',
    vendor: 'Office Depot',
    description: 'OFFICE DEPOT #2341',
    amount: 234.56,
    date: '2024-08-11',
    invoiceNumber: null,
    dueDate: null,
    glCode: '5400',
    suggestedGLCode: '5400',
    confidence: 92,
    merchantCode: 'MCC-5943',
    matchedBankTransaction: 'MERC-TXN-7234',
    requiresAction: false,
    transactionId: 'MERC-TXN-7234',
  },
];

// Mock categorization rules
const mockRules = [
  {
    id: 'rule-1',
    name: 'Software Subscriptions',
    conditions: [
      { field: 'merchantCode', operator: 'equals', value: 'MCC-7372' },
    ],
    action: { glCode: '5200', autoApprove: true },
    matchCount: 127,
  },
  {
    id: 'rule-2',
    name: 'Travel Expenses',
    conditions: [
      { field: 'vendor', operator: 'contains', value: 'Uber' },
      { field: 'vendor', operator: 'contains', value: 'Lyft' },
    ],
    action: { glCode: '5500', autoApprove: false },
    matchCount: 45,
  },
  {
    id: 'rule-3',
    name: 'Marketing Costs',
    conditions: [
      { field: 'description', operator: 'contains', value: 'advertising' },
      { field: 'vendor', operator: 'contains', value: 'LinkedIn' },
    ],
    action: { glCode: '5100', autoApprove: false },
    matchCount: 23,
  },
];

export default function ProtoInboxPage() {
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set(),
  );
  const [activeTab, setActiveTab] = useState('uncategorized');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showRulesPanel, setShowRulesPanel] = useState(false);
  const [bulkGLCode, setBulkGLCode] = useState('');

  // Calculate statistics
  const stats = {
    totalPending: transactions.filter((t) => t.status === 'pending').length,
    needsReview: transactions.filter((t) => t.confidence < 80).length,
    duplicates: transactions.filter((t) => t.status === 'duplicate').length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
    avgConfidence: Math.round(
      transactions.reduce((sum, t) => sum + (t.confidence || 0), 0) /
        transactions.length,
    ),
    categorized: transactions.filter((t) => t.glCode).length,
    uncategorized: transactions.filter((t) => !t.glCode).length,
  };

  // Simulate sync process
  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Handle GL code assignment
  const handleAssignGLCode = (transactionId: string, glCode: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId ? { ...t, glCode, status: 'categorized' } : t,
      ),
    );
  };

  // Handle bulk operations
  const handleBulkAssignGLCode = () => {
    if (!bulkGLCode || selectedTransactions.size === 0) return;

    setTransactions((prev) =>
      prev.map((t) =>
        selectedTransactions.has(t.id)
          ? { ...t, glCode: bulkGLCode, status: 'categorized' }
          : t,
      ),
    );
    setSelectedTransactions(new Set());
    setBulkGLCode('');
  };

  // Export to accounting system
  const handleExport = (system: 'quickbooks' | 'xero') => {
    console.log(`Exporting to ${system}...`);
    // Simulate export
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filterSource !== 'all' && t.source !== filterSource) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        t.vendor.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.invoiceNumber?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Categorized vs uncategorized for tabs
  const categorizedTransactions = filteredTransactions.filter((t) => t.glCode);
  const uncategorizedTransactions = filteredTransactions.filter(
    (t) => !t.glCode,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-neutral-200/50">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                Financial Workflow Enrichment
              </h1>
              <p className="text-muted-foreground mt-1">
                Intelligent transaction categorization with GL code assignment
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sync Status */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="relative">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="text-sm font-medium text-emerald-700">
                  AI Processing Active
                </span>
              </div>

              {/* Export Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    Export to Accounting System
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleExport('quickbooks')}>
                    <Building className="h-4 w-4 mr-2" />
                    QuickBooks Online
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('xero')}>
                    <Building className="h-4 w-4 mr-2" />
                    Xero
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    Download CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sync Button */}
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="gap-2"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Sync All Sources
                  </>
                )}
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Pending Review
                </CardDescription>
                <CardTitle className="text-2xl">{stats.totalPending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Low Confidence
                </CardDescription>
                <CardTitle className="text-2xl text-amber-600">
                  {stats.needsReview}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Duplicates
                </CardDescription>
                <CardTitle className="text-2xl text-red-600">
                  {stats.duplicates}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Categorized
                </CardDescription>
                <CardTitle className="text-2xl text-green-600">
                  {stats.categorized}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Avg Confidence
                </CardDescription>
                <CardTitle className="text-2xl">
                  {stats.avgConfidence}%
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  Total Amount
                </CardDescription>
                <CardTitle className="text-2xl">
                  ${stats.totalAmount.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Syncing from Mercury, Revolut, and Gmail...
                </span>
                <span className="text-sm font-medium">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Transactions */}
          <div className="col-span-8">
            {/* Filters */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRulesPanel(!showRulesPanel)}
                  >
                    <Zap className="h-3 w-3 mr-2" />
                    Categorization Rules
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                      icon={<Search className="h-4 w-4" />}
                    />
                  </div>
                  <Select value={filterSource} onValueChange={setFilterSource}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="mercury">Mercury</SelectItem>
                      <SelectItem value="revolut">Revolut</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="categorized">Categorized</SelectItem>
                      <SelectItem value="matched">Matched</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bulk Actions */}
                {selectedTransactions.size > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedTransactions.size} transactions selected
                      </span>
                      <div className="flex items-center gap-2">
                        <Select
                          value={bulkGLCode}
                          onValueChange={setBulkGLCode}
                        >
                          <SelectTrigger className="w-48 h-8">
                            <SelectValue placeholder="Select GL Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockGLCodes.map((gl) => (
                              <SelectItem key={gl.code} value={gl.code}>
                                {gl.code} - {gl.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={handleBulkAssignGLCode}
                          disabled={!bulkGLCode}
                        >
                          Assign GL Code
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTransactions(new Set())}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transactions Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="uncategorized">
                  Uncategorized ({uncategorizedTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="categorized">
                  Categorized ({categorizedTransactions.length})
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({filteredTransactions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="uncategorized" className="space-y-3">
                {uncategorizedTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    isSelected={selectedTransactions.has(transaction.id)}
                    onSelect={() => {
                      const newSet = new Set(selectedTransactions);
                      if (newSet.has(transaction.id)) {
                        newSet.delete(transaction.id);
                      } else {
                        newSet.add(transaction.id);
                      }
                      setSelectedTransactions(newSet);
                    }}
                    onAssignGLCode={handleAssignGLCode}
                    onClick={() => setSelectedTransaction(transaction)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="categorized" className="space-y-3">
                {categorizedTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    isSelected={selectedTransactions.has(transaction.id)}
                    onSelect={() => {
                      const newSet = new Set(selectedTransactions);
                      if (newSet.has(transaction.id)) {
                        newSet.delete(transaction.id);
                      } else {
                        newSet.add(transaction.id);
                      }
                      setSelectedTransactions(newSet);
                    }}
                    onAssignGLCode={handleAssignGLCode}
                    onClick={() => setSelectedTransaction(transaction)}
                  />
                ))}
              </TabsContent>

              <TabsContent value="all" className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    isSelected={selectedTransactions.has(transaction.id)}
                    onSelect={() => {
                      const newSet = new Set(selectedTransactions);
                      if (newSet.has(transaction.id)) {
                        newSet.delete(transaction.id);
                      } else {
                        newSet.add(transaction.id);
                      }
                      setSelectedTransactions(newSet);
                    }}
                    onAssignGLCode={handleAssignGLCode}
                    onClick={() => setSelectedTransaction(transaction)}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Panel */}
          <div className="col-span-4 space-y-6">
            {/* Rules Panel */}
            {showRulesPanel && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Categorization Rules
                  </CardTitle>
                  <CardDescription>
                    Automatic rules for GL code assignment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-3 rounded-lg border bg-white hover:bg-neutral-50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{rule.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Matches: {rule.matchCount} transactions
                          </p>
                        </div>
                        <Badge
                          variant={
                            rule.action.autoApprove ? 'default' : 'secondary'
                          }
                        >
                          {rule.action.autoApprove ? 'Auto' : 'Manual'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Tag className="h-3 w-3" />
                        <span>GL {rule.action.glCode}</span>
                        <span className="text-muted-foreground">
                          {
                            mockGLCodes.find(
                              (gl) => gl.code === rule.action.glCode,
                            )?.name
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" size="sm">
                    <Plus className="h-3 w-3 mr-2" />
                    Add Rule
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Transaction Details */}
            {selectedTransaction && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Vendor
                    </Label>
                    <p className="font-medium">{selectedTransaction.vendor}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Description
                    </Label>
                    <p className="text-sm">{selectedTransaction.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Amount
                      </Label>
                      <p className="font-medium">
                        ${selectedTransaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Date
                      </Label>
                      <p className="text-sm">{selectedTransaction.date}</p>
                    </div>
                  </div>
                  {selectedTransaction.invoiceNumber && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Invoice #
                      </Label>
                      <p className="text-sm font-mono">
                        {selectedTransaction.invoiceNumber}
                      </p>
                    </div>
                  )}
                  {selectedTransaction.merchantCode && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Merchant Code
                      </Label>
                      <p className="text-sm font-mono">
                        {selectedTransaction.merchantCode}
                      </p>
                    </div>
                  )}
                  {selectedTransaction.attachments && (
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Attachments
                      </Label>
                      <div className="mt-2 space-y-1">
                        {selectedTransaction.attachments.map((file: string) => (
                          <div
                            key={file}
                            className="flex items-center gap-2 text-sm"
                          >
                            <FileText className="h-3 w-3" />
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        5 potential duplicates detected
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Email invoices may match bank transactions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        New pattern detected
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        AWS charges consistently use GL 5200
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        92% accuracy this month
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Only 3 corrections needed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Mappings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendor GL Mappings</CardTitle>
                <CardDescription>
                  Learned from your categorization history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {mockVendorMappings.map((mapping) => (
                      <div
                        key={mapping.vendor}
                        className="flex items-center justify-between p-2 rounded hover:bg-neutral-50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {mapping.vendor}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            GL {mapping.glCode} -{' '}
                            {
                              mockGLCodes.find(
                                (gl) => gl.code === mapping.glCode,
                              )?.name
                            }
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {mapping.confidence}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Transaction Card Component
function TransactionCard({
  transaction,
  isSelected,
  onSelect,
  onAssignGLCode,
  onClick,
}: {
  transaction: any;
  isSelected: boolean;
  onSelect: () => void;
  onAssignGLCode: (id: string, glCode: string) => void;
  onClick: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGLCode, setSelectedGLCode] = useState(
    transaction.glCode || '',
  );

  const handleSave = () => {
    onAssignGLCode(transaction.id, selectedGLCode);
    setIsEditing(false);
  };

  const SourceIcon = transaction.sourceIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg border bg-white hover:shadow-md transition-all cursor-pointer',
        isSelected && 'ring-2 ring-blue-500 border-blue-500',
        transaction.status === 'duplicate' && 'bg-red-50 border-red-200',
        transaction.status === 'matched' && 'bg-green-50 border-green-200',
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Source Icon */}
        <div
          className={cn(
            'p-2 rounded-lg',
            transaction.source === 'email' && 'bg-blue-100',
            transaction.source === 'mercury' && 'bg-purple-100',
            transaction.source === 'revolut' && 'bg-pink-100',
          )}
        >
          <SourceIcon className="h-4 w-4" />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{transaction.vendor}</p>
                {transaction.status === 'duplicate' && (
                  <Badge variant="destructive" className="text-xs">
                    Duplicate
                  </Badge>
                )}
                {transaction.status === 'matched' && (
                  <Badge variant="success" className="text-xs">
                    <GitMerge className="h-3 w-3 mr-1" />
                    Matched
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {transaction.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>{transaction.date}</span>
                {transaction.invoiceNumber && (
                  <>
                    <span>•</span>
                    <span>Invoice #{transaction.invoiceNumber}</span>
                  </>
                )}
                {transaction.merchantCode && (
                  <>
                    <span>•</span>
                    <span>{transaction.merchantCode}</span>
                  </>
                )}
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
              {transaction.taxAmount && (
                <p className="text-xs text-muted-foreground">
                  Tax: ${transaction.taxAmount.toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {/* GL Code Section */}
          <div className="mt-3 pt-3 border-t">
            {isEditing ? (
              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Select
                  value={selectedGLCode}
                  onValueChange={setSelectedGLCode}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select GL Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGLCodes.map((gl) => (
                      <SelectItem key={gl.code} value={gl.code}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{gl.code}</span>
                          <span>-</span>
                          <span>{gl.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {gl.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {transaction.glCode ? (
                    <>
                      <Badge variant="outline" className="gap-1">
                        <Hash className="h-3 w-3" />
                        GL {transaction.glCode}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {
                          mockGLCodes.find(
                            (gl) => gl.code === transaction.glCode,
                          )?.name
                        }
                      </span>
                    </>
                  ) : (
                    <>
                      {transaction.suggestedGLCode && (
                        <>
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            Suggested: GL {transaction.suggestedGLCode}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {transaction.confidence}% confidence
                          </span>
                        </>
                      )}
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setSelectedGLCode(
                      transaction.glCode || transaction.suggestedGLCode || '',
                    );
                  }}
                >
                  {transaction.glCode ? (
                    <Edit className="h-3 w-3" />
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      Assign
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Duplicate/Match Warning */}
          {transaction.matchedBankTransaction &&
            transaction.source === 'email' && (
              <div className="mt-2 p-2 rounded bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-xs">
                  <AlertCircle className="h-3 w-3 text-amber-600" />
                  <span className="text-amber-700">
                    Possible match with bank transaction{' '}
                    {transaction.matchedBankTransaction}
                  </span>
                </div>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
}
