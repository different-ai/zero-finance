'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

interface FundPoolModalProps {
  open: boolean;
  onClose: () => void;
}

export function FundPoolModal({ open, onClose }: FundPoolModalProps) {
  const [amount, setAmount] = useState('');
  const [chain, setChain] = useState('base');
  const [currency, setCurrency] = useState('USDC');

  const handleFund = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Simulate funding
    toast.success(`Successfully funded ${amount} ${currency} on ${chain}`, {
      description: 'Transaction confirmed',
    });
    
    onClose();
    setAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Fund Payroll Pool</DialogTitle>
          <DialogDescription>
            Add funds to your payroll pool for automated invoice payments
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label>Currency</Label>
            <RadioGroup value={currency} onValueChange={setCurrency}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USDC" id="usdc" />
                <Label htmlFor="usdc">USDC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ETH" id="eth" />
                <Label htmlFor="eth">ETH</Label>
              </div>
              {chain === 'solana' && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="SOL" id="sol" />
                  <Label htmlFor="sol">SOL</Label>
                </div>
              )}
            </RadioGroup>
          </div>
          
          {/* Chain Selection */}
          <div className="space-y-2">
            <Label>Chain</Label>
            <RadioGroup value={chain} onValueChange={setChain}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ethereum" id="ethereum" />
                <Label htmlFor="ethereum">Ethereum</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="base" id="base" />
                <Label htmlFor="base">Base</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solana" id="solana" />
                <Label htmlFor="solana">Solana</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Summary */}
          {amount && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">You will fund:</p>
              <p className="font-semibold">
                {amount} {currency} on {chain}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleFund}>
            Fund Pool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}