'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Download, FileText, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  requestId: string;
  creationDate: string;
  description: string;
  client: string;
  amount: string;
  currency: string;
  status: 'pending' | 'paid';
  url: string;
}

export function InvoiceListContainer() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Load invoices
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        // In a real app, we would fetch from an API
        // For now, simulate with some sample data
        const sampleInvoices: Invoice[] = [
          {
            requestId: 'req_1',
            creationDate: '2025-02-10T12:00:00Z',
            description: 'Web Design Services',
            client: 'Acme Corporation',
            amount: '3000.00',
            currency: 'EUR',
            status: 'paid',
            url: '/invoice/req_1?token=token_1',
          },
          {
            requestId: 'req_2',
            creationDate: '2025-02-15T15:30:00Z',
            description: 'Consulting Services - Q1',
            client: 'TechStart Inc.',
            amount: '1500.00',
            currency: 'EUR',
            status: 'pending',
            url: '/invoice/req_2?token=token_2',
          },
          {
            requestId: 'req_3',
            creationDate: '2025-02-20T09:15:00Z',
            description: 'Project Implementation',
            client: 'Global Solutions Ltd.',
            amount: '5000.00',
            currency: 'EUR',
            status: 'pending',
            url: '/invoice/req_3?token=token_3',
          },
          {
            requestId: 'req_4',
            creationDate: '2025-01-05T11:45:00Z',
            description: 'Monthly Retainer - January',
            client: 'Reliable Partners Co.',
            amount: '2000.00',
            currency: 'USDC',
            status: 'paid',
            url: '/invoice/req_4?token=token_4',
          },
        ];

        setInvoices(sampleInvoices);
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, []);

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      // Status filter
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }
      
      // Search term
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          invoice.description.toLowerCase().includes(searchTermLower) ||
          invoice.client.toLowerCase().includes(searchTermLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortBy === 'date') {
        const dateA = new Date(a.creationDate).getTime();
        const dateB = new Date(b.creationDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Sort by amount
      const amountA = parseFloat(a.amount);
      const amountB = parseFloat(b.amount);
      return sortDirection === 'asc' ? amountA - amountB : amountB - amountA;
    });

  // Toggle sort direction
  const handleSortToggle = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          
          <Link 
            href="/create-invoice"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>
      
      {/* Invoices */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortToggle('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortBy === 'date' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortToggle('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortBy === 'amount' && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.requestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(invoice.creationDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{invoice.requestId.slice(-6)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {invoice.currency} {parseFloat(invoice.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={invoice.url}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        target="_blank"
                      >
                        <Eye className="h-4 w-4 inline" />
                      </Link>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.origin + invoice.url);
                          alert('Invoice link copied to clipboard!');
                        }}
                      >
                        <Download className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? (
                      <div>
                        <p className="text-lg font-medium mb-2">No matching invoices found</p>
                        <p className="text-sm">Try changing your search or filter criteria</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium mb-2">No invoices yet</p>
                        <p className="text-sm mb-4">Get started by creating your first invoice</p>
                        <Link
                          href="/create-invoice"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Create Invoice
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}