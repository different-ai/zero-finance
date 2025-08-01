'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { InvoiceCard } from './invoice-card';
import { mockInvoices } from '../mock-data';
import { Search, Filter, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function InvoiceInbox() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
  
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.from.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handlePay = (id: string) => {
    setInvoices(prev => 
      prev.map(inv => inv.id === id ? {...inv, status: 'paid' as const} : inv)
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invoice Inbox
            {pendingCount > 0 && (
              <Badge variant="destructive">{pendingCount} pending</Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            AI-detected invoices from your synced emails
          </p>
        </div>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Sync Emails
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by recipient, invoice number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Invoices</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Invoice List */}
      <div className="space-y-3">
        {filteredInvoices.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No invoices found</p>
          </Card>
        ) : (
          filteredInvoices.map(invoice => (
            <InvoiceCard 
              key={invoice.id} 
              invoice={invoice}
              onPay={handlePay}
            />
          ))
        )}
      </div>
    </div>
  );
}