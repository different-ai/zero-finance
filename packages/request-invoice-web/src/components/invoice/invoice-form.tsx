'use client';

import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';

interface InvoiceFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unitPrice: string;
  tax: number;
}

export const InvoiceForm = forwardRef(({ onSubmit, isSubmitting }: InvoiceFormProps, ref) => {
  const [formData, setFormData] = useState({
    // Seller info
    sellerBusinessName: '',
    sellerEmail: '',
    sellerAddress: '',
    sellerCity: '',
    sellerPostalCode: '',
    sellerCountry: '',
    
    // Buyer info
    buyerBusinessName: '',
    buyerEmail: '',
    buyerAddress: '',
    buyerCity: '',
    buyerPostalCode: '',
    buyerCountry: '',
    
    // Invoice details
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    
    // Payment details
    network: 'gnosis',
    currency: 'EUR',
    
    // Notes
    note: '',
    terms: 'Payment due within 30 days',
  });
  
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: Date.now(),
      name: '',
      quantity: 1,
      unitPrice: '',
      tax: 0,
    },
  ]);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    updateFormData: (newFormData: Partial<typeof formData>, newItems?: InvoiceItem[]) => {
      setFormData(prevData => ({
        ...prevData,
        ...newFormData
      }));
      
      if (newItems && newItems.length > 0) {
        setItems(newItems);
      }
    }
  }));
  
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        name: '',
        quantity: 1,
        unitPrice: '',
        tax: 0,
      },
    ]);
  };
  
  const removeItem = (id: number) => {
    if (items.length === 1) {
      return; // Don't remove the last item
    }
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0);
  };
  
  const calculateTax = () => {
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const tax = Number(item.tax) || 0;
      return sum + quantity * unitPrice * (tax / 100);
    }, 0);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert the form data to the format expected by the API
    const invoiceData = {
      meta: {
        format: 'rnf_invoice',
        version: '0.0.3',
      },
      network: formData.network,
      creationDate: new Date().toISOString(),
      invoiceNumber: formData.invoiceNumber,
      sellerInfo: {
        businessName: formData.sellerBusinessName,
        email: formData.sellerEmail,
        address: {
          'street-address': formData.sellerAddress,
          locality: formData.sellerCity,
          'postal-code': formData.sellerPostalCode,
          'country-name': formData.sellerCountry,
        },
      },
      buyerInfo: {
        businessName: formData.buyerBusinessName,
        email: formData.buyerEmail,
        address: {
          'street-address': formData.buyerAddress,
          locality: formData.buyerCity,
          'postal-code': formData.buyerPostalCode,
          'country-name': formData.buyerCountry,
        },
      },
      invoiceItems: items.map(item => ({
        name: item.name,
        quantity: Number(item.quantity) || 1,
        unitPrice: (Number(item.unitPrice) * 100).toString(), // Convert to cents
        currency: formData.currency,
        tax: {
          type: 'percentage',
          amount: item.tax.toString(),
        },
      })),
      paymentTerms: {
        dueDate: new Date(formData.dueDate).toISOString(),
      },
      note: formData.note,
      terms: formData.terms,
    };
    
    // Submit the data
    onSubmit(invoiceData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium border-b pb-4 mb-6">Create New Invoice</h3>
        
        <div className="space-y-8">
          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          {/* Seller Info */}
          <div>
            <h4 className="text-md font-medium mb-3">Your Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="sellerBusinessName"
                  value={formData.sellerBusinessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="sellerEmail"
                  value={formData.sellerEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="sellerAddress"
                  value={formData.sellerAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="sellerCity"
                  value={formData.sellerCity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="sellerPostalCode"
                    value={formData.sellerPostalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="sellerCountry"
                    value={formData.sellerCountry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Client Info */}
          <div>
            <h4 className="text-md font-medium mb-3">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  name="buyerBusinessName"
                  value={formData.buyerBusinessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="buyerEmail"
                  value={formData.buyerEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="buyerAddress"
                  value={formData.buyerAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="buyerCity"
                  value={formData.buyerCity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="buyerPostalCode"
                    value={formData.buyerPostalCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="buyerCountry"
                    value={formData.buyerCountry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          <div>
            <h4 className="text-md font-medium mb-3">Payment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  name="network"
                  value={formData.network}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="gnosis">Gnosis Chain (EUR)</option>
                  <option value="ethereum">Ethereum (USDC)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="EUR">EUR</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium">Invoice Items</h4>
              <button
                type="button"
                className="text-sm px-3 py-1 border border-gray-300 rounded flex items-center hover:bg-gray-50"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      Tax %
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item description"
                          className="w-full border-0 focus:ring-0"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          min="1"
                          className="w-full border-0 focus:ring-0"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className="w-full border-0 focus:ring-0"
                          required
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))}
                          min="0"
                          max="100"
                          className="w-full border-0 focus:ring-0"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formData.currency}{' '}
                        {((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0) * (1 + (Number(item.tax) || 0) / 100)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Totals */}
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-end text-right">
                <div className="w-48">
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-gray-600">Subtotal:</span>
                    <span className="font-medium">{formData.currency} {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm text-gray-600">Tax:</span>
                    <span className="font-medium">{formData.currency} {calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-t border-gray-200 mt-1 pt-1">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">{formData.currency} {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note to Client
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Thank you for your business"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms and Conditions
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Payment terms, late fees, etc."
              ></textarea>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Invoice...
                </>
              ) : (
                'Create Invoice'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
});

InvoiceForm.displayName = 'InvoiceForm';