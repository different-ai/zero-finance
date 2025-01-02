import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaymentMethodSelector } from './payment-method-selector';

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  amount: number;
}

interface InvoiceFormProps {
  defaultValues?: {
    items: InvoiceItem[];
    billTo?: string;
    billToAddress?: string;
    currency?: string;
    memo?: string;
  };
  onSubmit?: (values: any) => Promise<void>;
  isLoading?: boolean;
}

export function InvoiceForm({
  defaultValues,
  onSubmit,
  isLoading,
}: InvoiceFormProps) {
  const [items, setItems] = useState<InvoiceItem[]>(
    defaultValues?.items || [
      {
        description: 'Setup and install',
        quantity: 1,
        price: 1000,
        discount: 0,
        tax: 0,
        amount: 1000,
      },
    ]
  );
  const [billTo, setBillTo] = useState(defaultValues?.billTo || '');
  const [billToAddress, setBillToAddress] = useState(
    defaultValues?.billToAddress || ''
  );
  const [currency, setCurrency] = useState(
    defaultValues?.currency?.toLowerCase() || 'eur'
  );
  const [memo, setMemo] = useState(defaultValues?.memo || '');

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        price: 0,
        discount: 0,
        tax: 0,
        amount: 0,
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: number | string
  ) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'description') {
      item.description = value as string;
    } else {
      item[field] = Number(value);
      // Recalculate amount
      if (
        field === 'quantity' ||
        field === 'price' ||
        field === 'discount' ||
        field === 'tax'
      ) {
        item.amount =
          item.quantity *
          item.price *
          (1 - item.discount / 100) *
          (1 + item.tax / 100);
      }
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({
        items,
        billTo,
        billToAddress,
        currency,
        memo,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">New Invoice</CardTitle>
            <Button variant="outline" type="button">
              Draft
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Created on {new Date().toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Bill to</Label>
              <Input
                placeholder="Enter client name"
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
              />
              <Textarea
                placeholder="Enter client address"
                className="h-20"
                value={billToAddress}
                onChange={(e) => setBillToAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Invoice Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eur">EUR</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="gbp">GBP</SelectItem>
                  <SelectItem value="eth">ETH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <PaymentMethodSelector />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Items</Label>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={handleAddItem}
                >
                  + Add Item
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, 'description', e.target.value)
                          }
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(index, 'quantity', e.target.value)
                          }
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(index, 'price', e.target.value)
                          }
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.discount}
                          onChange={(e) =>
                            updateItem(index, 'discount', e.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.tax}
                          onChange={(e) =>
                            updateItem(index, 'tax', e.target.value)
                          }
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {currency.toUpperCase()} {item.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2">
              <Label>Memo</Label>
              <Textarea
                placeholder="Add any notes or payment instructions"
                className="h-20"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" type="button">
              Save Draft
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
