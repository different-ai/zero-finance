'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Download, FileText, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { trpc } from '@/utils/trpc'; // Corrected tRPC client import path

interface Invoice {
  id: string; // Primary database ID
  requestId: string | null; // Request Network ID (can be null)
  creationDate?: string; // This should match the router's output (ISO string)
  description: string;
  client: string;
  amount: string;
  currency: string;
  status: string; // Changed from enum to string to handle 'db_pending'
  url?: string; // Keep URL generation for internal links
  role?: 'seller' | 'buyer';
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

  // Use the tRPC query hook to fetch invoices, passing sort parameters
  const { data: invoiceQueryResult, isLoading, error, refetch } = trpc.invoice.list.useQuery({
      limit: 50, // Example limit, adjust as needed
      // Pass sorting state to the query input
      sortBy: sortBy,
      sortDirection: sortDirection,
    }, {
      // Optional: configure refetch behavior, caching, etc.
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Update local state when tRPC query data changes
  useEffect(() => {
    if (invoiceQueryResult && Array.isArray(invoiceQueryResult.items)) {
      // Map the data from the router to the local Invoice interface
      // console.log('0xHypr DEBUG - Raw data from tRPC:', JSON.stringify(invoiceQueryResult.items, null, 2));
      // Ensure all properties match, especially dates and amounts
      const mappedInvoices = invoiceQueryResult.items.map((item: any) => ({
        ...item,
        // creationDate should already be an ISO string from the backend
        // Generate URL using database ID (id is the primary key)
        url: `/dashboard/invoice/${item.id}`
      }));
      setInvoices(mappedInvoices);
      console.log('0xHypr', `Successfully loaded ${mappedInvoices.length} invoices via tRPC with sorting: ${sortBy} ${sortDirection}`);
    } else if (invoiceQueryResult) {
      console.error('0xHypr', 'Invalid invoice data format from tRPC:', invoiceQueryResult);
      setInvoices([]);
    } else if (error) {
      console.error('0xHypr', 'Error loading invoices via tRPC:', error);
      setInvoices([]);
    }
    // Dependency array includes sortBy and sortDirection to re-run mapping if needed,
    // although the query refetch handles the data update.
  }, [invoiceQueryResult, error, sortBy, sortDirection]);

  // Function to manually refresh data (refetch will use current sort state)
  const loadInvoices = () => {
    refetch();
  };

  // Filter invoices (client-side filtering remains)
  // REMOVED client-side sorting logic
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
    });
    // REMOVED .sort(...) logic here

  // Toggle sort direction (now triggers a refetch with new sort params)
  const handleSortToggle = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc'); // Default to desc when changing column
    }
    // No need to manually sort here, the change in state triggers the query update
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
    <div className="space-y-4 sm:space-y-6">
      {/* Wallet Addresses */}
      

      {/* Filters */}
      <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:gap-4 md:justify-between">
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
        
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-grow sm:flex-grow-0">
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          
          <div className="relative flex-grow sm:flex-grow-0">
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
              className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-md appearance-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="seller">As Seller</option>
              <option value="buyer">As Buyer</option>
            </select>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
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
              href="/dashboard/create-invoice"
              className="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              New Invoice
            </Link>
          </div>
        </div>
      </div>
      
      {/* Invoices */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th 
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {invoice.creationDate ? format(new Date(invoice.creationDate), 'MMM d, yyyy') : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 max-w-[120px] sm:max-w-[200px] truncate">
                      {invoice.description}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 max-w-[100px] sm:max-w-[150px] truncate">
                      {invoice.client}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {invoice.amount} {invoice.currency}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : invoice.status === 'db_pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {invoice.status === 'db_pending' ? 'Pending' : invoice.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {invoice.role === 'seller' ? 'Seller' : invoice.role === 'buyer' ? 'Buyer' : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {invoice.url && (
                          <Link 
                            href={invoice.url}
                            className="text-blue-600 hover:text-blue-800"
                            title="View invoice"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 sm:px-6 py-10 text-center text-sm text-gray-500">
                    No invoices found. Create your first invoice to get started!
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
