'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Check, Copy } from 'lucide-react';

interface AddressEntry {
  id: string;
  label: string;
  address: string;
  network: string;
  isDefault: boolean;
}

const NETWORKS = {
  ethereum: {
    name: 'Ethereum Mainnet',
    currencies: ['USDC'],
    chainId: 1,
  },
  gnosis: {
    name: 'Gnosis Chain',
    currencies: ['EUR'],
    chainId: 100,
  },
} as const;

type NetworkType = keyof typeof NETWORKS;

export function PaymentConfigContainer() {
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newNetwork, setNewNetwork] = useState<NetworkType>('gnosis');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Load saved addresses from API
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await fetch('/api/wallet/addresses');
        
        if (!response.ok) {
          throw new Error('Failed to load wallet addresses');
        }
        
        const data = await response.json();
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error('Error loading addresses:', error);
        toast.error('Failed to load wallet addresses');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAddresses();
  }, []);
  
  // Handle copying address
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(null), 2000);
    toast.success('Address copied to clipboard');
  };
  
  // Add new address
  const addAddress = async () => {
    if (!newAddress || !newLabel) {
      toast.error('Please provide both address and label');
      return;
    }
    
    try {
      // Validate Ethereum address
      if (!ethers.utils.isAddress(newAddress)) {
        throw new Error('Invalid Ethereum address');
      }
      
      // Creating new address entry
      const addressEntry: AddressEntry = {
        id: crypto.randomUUID(),
        label: newLabel,
        address: newAddress,
        network: newNetwork,
        isDefault: addresses.length === 0 || !addresses.some(a => a.network === newNetwork),
      };
      
      // Send to API
      const response = await fetch('/api/wallet/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressEntry }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save address');
      }
      
      // Update local state
      setAddresses((prev) => [...prev, addressEntry]);
      setNewAddress('');
      setNewLabel('');
      toast.success('Address added successfully');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add address');
    }
  };
  
  // Remove address
  const removeAddress = async (id: string) => {
    try {
      // Send to API
      const response = await fetch(`/api/wallet/addresses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove address');
      }
      
      // Update local state
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address removed');
    } catch (error) {
      console.error('Error removing address:', error);
      toast.error('Failed to remove address');
    }
  };
  
  // Set default address
  const setDefaultAddress = async (id: string) => {
    try {
      const selectedAddress = addresses.find((a) => a.id === id);
      if (!selectedAddress) return;
      
      // Get network from the selected address
      const network = selectedAddress.network;
      
      // Send to API
      const response = await fetch(`/api/wallet/addresses/${id}/default`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to set default address');
      }
      
      // Update local state - set the selected address as default and others of the same network as non-default
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id ? true : a.network === network ? false : a.isDefault,
        }))
      );
      
      toast.success('Default payment address updated');
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-medium border-b pb-4 mb-6">Payment Configuration</h3>
        
        <div className="space-y-8">
          {/* Add New Address Section */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">Add New Payment Address</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  id="label"
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g., Main Wallet, Business Account"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="network" className="block text-sm font-medium text-gray-700 mb-1">
                  Network
                </label>
                <select
                  id="network"
                  value={newNetwork}
                  onChange={(e) => setNewNetwork(e.target.value as NetworkType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {Object.entries(NETWORKS).map(([key, network]) => (
                    <option key={key} value={key}>
                      {network.name} ({network.currencies.join(', ')})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={addAddress}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  disabled={!newAddress || !newLabel}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </button>
              </div>
            </div>
          </div>
          
          {/* Current Addresses Section */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">Payment Addresses</h4>
            
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No payment addresses configured yet. Add one above to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(NETWORKS).map(([networkKey, network]) => {
                  const networkAddresses = addresses.filter(a => a.network === networkKey);
                  if (networkAddresses.length === 0) return null;
                  
                  return (
                    <div key={networkKey} className="border rounded-md p-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3">
                        {network.name}
                      </h5>
                      
                      <div className="space-y-3">
                        {networkAddresses.map((address) => (
                          <div key={address.id} className="flex items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className={`h-5 w-5 rounded-full border flex-shrink-0 mr-3 flex items-center justify-center ${
                                address.isDefault
                                  ? 'bg-green-600 border-green-600 text-white'
                                  : 'border-gray-300'
                              }`}
                            >
                              {address.isDefault && <Check className="h-3 w-3" />}
                            </button>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm">{address.label}</div>
                              <div className="font-mono text-xs text-gray-500 truncate">
                                {address.address}
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              <button
                                onClick={() => copyAddress(address.address)}
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Copy address"
                              >
                                {copied === address.address ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                              
                              {!address.isDefault && (
                                <button
                                  onClick={() => removeAddress(address.id)}
                                  className="p-1 text-gray-400 hover:text-red-500"
                                  title="Remove address"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              The selected address (with checkmark) will be used as the default payment address for invoices on that network.
              Default addresses cannot be removed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}