'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Download, FileText, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { trpc } from '@/utils/trpc'; // Corrected tRPC client import path

interface Invoice {
  requestId: string;
  creationDate?: string; // Make optional or ensure it always exists in router output
  description: string;
  client: string;
  amount: string;
  currency: string;
  status: 'pending' | 'paid';
  url: string;
  role?: 'seller' | 'buyer';
  token?: string; // Added based on potential need for URL generation
}

export function InvoiceListContainer() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'buyer'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // State to store user data
  const [userData, setUserData] = useState<{
    walletAddress: string | null;
    paymentAddress: string | null;
    userEmail: string | null;
  }>({
    walletAddress: null,
    paymentAddress: null,
    userEmail: null,
  });

  // State to store all payment addresses
  const [paymentAddresses, setPaymentAddresses] = useState<{
    ethereum: string | null;
    gnosis: string | null;
  }>({
    ethereum: null,
    gnosis: null
  });

  // Use the tRPC query hook to fetch invoices
  const { data: invoiceQueryResult, isLoading, error, refetch } = trpc.invoice.list.useQuery({ 
      limit: 50 // Example limit, adjust as needed
    }, {
      // Optional: configure refetch behavior, caching, etc.
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Update local state when tRPC query data changes
  useEffect(() => {
    if (invoiceQueryResult && Array.isArray(invoiceQueryResult.items)) {
      // Map the data from the router to the local Invoice interface
      // Ensure all properties match, especially dates and amounts
      const mappedInvoices = invoiceQueryResult.items.map((item: any) => ({
        ...item,
        creationDate: item.creationDate || new Date().toISOString(), // Provide default if missing
        // Ensure URL is correctly formed - requires token from ephemeral key
        // This might need adjustment in the router or here based on how token is stored/retrieved
        url: `/invoice/${item.requestId}` // Placeholder URL, needs token
      }));
      setInvoices(mappedInvoices);
      console.log('0xHypr', `Successfully loaded ${mappedInvoices.length} invoices via tRPC`);
    } else if (invoiceQueryResult) {
      console.error('0xHypr', 'Invalid invoice data format from tRPC:', invoiceQueryResult);
      setInvoices([]);
    } else if (error) {
      console.error('0xHypr', 'Error loading invoices via tRPC:', error);
      setInvoices([]);
    }
  }, [invoiceQueryResult, error]);

  // Function to manually refresh data
  const loadInvoices = () => {
    refetch();
  };

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice) => {
      // Status filter
      if (statusFilter !== 'all' && invoice.status !== statusFilter) {
        return false;
      }
      
      // Role filter (seller/buyer)
      if (roleFilter !== 'all' && invoice.role !== roleFilter) {
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
        // Handle potentially undefined dates
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
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
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium">Failed to load invoices (tRPC)</h3>
        </div>
        <p className="text-gray-600 mb-4">There was a problem loading your invoices. Please try again later.</p>
        <button 
          onClick={loadInvoices}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Addresses */}
      

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
          
          <div className="relative">
            <svg 
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="seller">As Seller</option>
              <option value="buyer">As Buyer</option>
            </select>
          </div>
          
          <button
            onClick={loadInvoices}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
            title="Refresh invoices"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
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
                      {invoice.creationDate ? 
                        format(new Date(invoice.creationDate), 'MMM dd, yyyy') : 
                        'N/A'}
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
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                        
                        {invoice.role && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            invoice.role === 'seller'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {invoice.role === 'seller' ? 'Seller' : 'Buyer'}
                          </span>
                        )}
                      </div>
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
                        onClick={async () => {
                          try {
                            // Generate shareable link - ensure invoice.url is correct
                            const shareUrl = invoice.url.startsWith('http') ? invoice.url : window.location.origin + invoice.url;
                            await navigator.clipboard.writeText(shareUrl);
                            
                            // Use a more subtle notification instead of alert
                            const notification = document.createElement('div');
                            notification.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg';
                            notification.textContent = 'Invoice link copied to clipboard!';
                            document.body.appendChild(notification);
                            
                            // Remove the notification after 3 seconds
                            setTimeout(() => {
                              document.body.removeChild(notification);
                            }, 3000);
                          } catch (error) {
                            console.error('0xHypr', 'Failed to copy to clipboard:', error);
                          }
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
                        <svg 
                          className="mx-auto h-12 w-12 text-gray-400 mb-4" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        <p className="text-lg font-medium mb-2">No invoices yet</p>
                        <p className="text-sm mb-4">Get started by creating your first invoice with hyprsqrl</p>
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
