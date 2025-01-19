import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ethers } from 'ethers';

export interface AddressEntry {
  id: string;
  label: string;
  address: string;
  network: string;
  isDefault: boolean;
}

export function PaymentConfig() {
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);
  const [newAddress, setNewAddress] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newNetwork, setNewNetwork] = useState('ethereum');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const savedAddresses = await window.api.getWalletAddresses();
        setAddresses(savedAddresses);
      } catch (error) {
        console.error('0xHypr', 'Error loading wallet addresses:', error);
        toast.error('Failed to load wallet addresses');
      } finally {
        setIsLoading(false);
      }
    };
    loadAddresses();
  }, []);

  const addAddress = async () => {
    if (!newAddress || !newLabel) {
      toast.error('Please provide both address and label');
      return;
    }

    try {
      // Validate the address
      if (!ethers.utils.isAddress(newAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const addressEntry: AddressEntry = {
        id: crypto.randomUUID(),
        label: newLabel,
        address: newAddress,
        network: newNetwork,
        isDefault: addresses.length === 0, // First address is default
      };

      await window.api.addWalletAddress(addressEntry);
      const updatedAddresses = await window.api.getWalletAddresses();
      setAddresses(updatedAddresses);
      setNewAddress('');
      setNewLabel('');
      toast.success('Address added successfully');
    } catch (error) {
      console.error('0xHypr', 'Error adding address:', error);
      toast.error('Failed to add address: Invalid format');
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      await window.api.removeWalletAddress(addressId);
      const updatedAddresses = await window.api.getWalletAddresses();
      setAddresses(updatedAddresses);
      toast.success('Address removed');
    } catch (error) {
      console.error('0xHypr', 'Error removing address:', error);
      toast.error('Failed to remove address');
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      await window.api.setDefaultWalletAddress(addressId);
      const updatedAddresses = await window.api.getWalletAddresses();
      setAddresses(updatedAddresses);
      toast.success('Default payment address updated');
    } catch (error) {
      console.error('0xHypr', 'Error setting default address:', error);
      toast.error('Failed to update default address');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-4 w-4 animate-spin mr-2" />
        <span>Loading payment configuration...</span>
      </div>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Payment Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Add New Payment Address</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Label (e.g., Main Wallet, Kraken Deposit)"
              />
              <Input
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={newNetwork}
                onChange={(e) => setNewNetwork(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              >
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="gnosis">Gnosis Chain</option>
              </select>
              <Button onClick={addAddress} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Payment Addresses</Label>
            <RadioGroup
              value={addresses.find(a => a.isDefault)?.id}
              onValueChange={setDefaultAddress}
            >
              {addresses.map(({ id, label, address, network, isDefault }) => (
                <div key={id} className="flex items-center space-x-2 space-y-1">
                  <RadioGroupItem value={id} id={id} />
                  <div className="flex-1">
                    <Label htmlFor={id} className="flex flex-col">
                      <span className="font-medium">{label}</span>
                      <span className="font-mono text-sm text-muted-foreground">
                        {address} ({network})
                      </span>
                    </Label>
                  </div>
                  {!isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAddress(id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          <p className="text-xs text-muted-foreground">
            The selected address will be used as the default payment address for new invoices
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 