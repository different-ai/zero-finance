import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { ethers } from 'ethers';
import { Eye, Download, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  InvoiceDetails,
  InvoiceDetailsView,
} from '@hypr/shared/src/components/invoice-details';
import { Types } from '@requestnetwork/request-client.js';

interface InvoiceData {
  requestId: string;
  amount: string;
  currency: {
    type: string;
    value: string;
  };
  status: string;
  timestamp: number;
  description: string;
  payer?: {
    value: string;
  };
  payee: {
    value: string;
  };
}

export function InvoiceList() {
  const [filter, setFilter] = React.useState('all'); // all, paid, pending
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  const [selectedInvoice, setSelectedInvoice] = React.useState<{
    requestId: string;
    decryptionKey: string;
  } | null>(null);
  const [requestData, setRequestData] = React.useState<Types.IRequestData | null>(null);

  const { data: invoices, isLoading } = useQuery<InvoiceData[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      return window.api.getUserRequests();
    },
  });
  console.log('0xHypr', 'selectedInvoice', selectedInvoice);
  React.useEffect(() => {
    if (selectedInvoice?.requestId) {
      window.api
        .decodeRequest(selectedInvoice.requestId)
        .then((data) => {
          console.log('0xHypr', 'Selected invoice data:', data);
          setRequestData(data);
        })
        .catch((error) => {
          console.error('0xHypr', 'Failed to decode request:', error);
        });
    }
  }, [selectedInvoice]);

  const handleViewInvoice = async (requestId: string) => {
    try {
      // Get the private key from the wallet
      const decryptionKey = await window.api.getWalletPrivateKey();
      setSelectedInvoice({ requestId, decryptionKey });
    } catch (error) {
      console.error('0xHypr', 'Failed to view invoice:', error);
      toast.error('Failed to open invoice');
    }
  };

  const formatAmount = (amount: string) => {
    try {
      // Convert to BigNumber and format
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      return ethers.utils.formatUnits(amountInWei, 18);
    } catch (error) {
      console.error('0xHypr', 'Error formatting amount:', error);
      return amount; // Return original amount if formatting fails
    }
  };

  const filteredAndSortedInvoices = React.useMemo(() => {
    if (!invoices) return [];

    let filtered = invoices;

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter((invoice) => {
        const isPaid = invoice.status === 'ACCEPTED';
        return filter === 'paid' ? isPaid : !isPaid;
      });
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.description.toLowerCase().includes(searchLower) ||
          invoice.payer?.value.toLowerCase().includes(searchLower) ||
          invoice.requestId.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? b.timestamp - a.timestamp
          : a.timestamp - b.timestamp;
      } else {
        const amountA = Number(formatAmount(a.amount));
        const amountB = Number(formatAmount(b.amount));
        return sortOrder === 'desc' ? amountB - amountA : amountA - amountB;
      }
    });
  }, [invoices, filter, search, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full dark">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices</CardTitle>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64"
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-semibold"
                      onClick={() => {
                        if (sortBy === 'amount') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortBy('amount');
                          setSortOrder('desc');
                        }
                      }}
                    >
                      Amount
                      {sortBy === 'amount' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedInvoices.map((invoice) => (
                  <TableRow key={invoice.requestId}>
                    <TableCell>
                      {format(invoice.timestamp * 1000, 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      {invoice.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      {invoice.payer?.value ? (
                        <span className="font-mono text-sm">
                          {invoice.payer.value.slice(0, 6)}...
                          {invoice.payer.value.slice(-4)}
                        </span>
                      ) : (
                        'No recipient'
                      )}
                    </TableCell>
                    <TableCell>
                      {formatAmount(invoice.amount)} {invoice.currency.value}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === 'ACCEPTED'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {invoice.status === 'ACCEPTED' ? 'Paid' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewInvoice(invoice.requestId)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAndSortedInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className="max-w-[80vw] h-[90vh] p-0">
          {selectedInvoice && requestData && (
            <InvoiceDetailsView
              requestData={requestData}
              exchangeRate={1}
              onClose={() => setSelectedInvoice(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
