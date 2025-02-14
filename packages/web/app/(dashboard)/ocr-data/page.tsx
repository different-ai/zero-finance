'use client';

import { useQuery } from '@tanstack/react-query';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  amount: number;
  invoiceDate: Date;
  dueDate: Date;
  ocrTimestamp: Date;
  source: string | null;
}

interface AdminObligation {
  id: string;
  obligation: string;
  dueDate: Date;
  notes: string | null;
  ocrTimestamp: Date;
  source: string | null;
}

const invoiceColumns = [
  { key: 'invoiceNumber', name: 'Invoice #' },
  { key: 'vendor', name: 'Vendor' },
  { key: 'amount', name: 'Amount' },
  { key: 'invoiceDate', name: 'Invoice Date' },
  { key: 'dueDate', name: 'Due Date' },
  { key: 'ocrTimestamp', name: 'Detected At' },
];

const adminColumns = [
  { key: 'obligation', name: 'Obligation' },
  { key: 'dueDate', name: 'Due Date' },
  { key: 'notes', name: 'Notes' },
  { key: 'ocrTimestamp', name: 'Detected At' },
];

export default function OCRDataPage() {
  const { data: invoices, isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      const res = await fetch('/api/ocr/invoices');
      if (!res.ok) throw new Error('Failed to fetch invoices');
      return res.json();
    },
  });

  const { data: obligations, isLoading: obligationsLoading } = useQuery<AdminObligation[]>({
    queryKey: ['obligations'],
    queryFn: async () => {
      const res = await fetch('/api/ocr/obligations');
      if (!res.ok) throw new Error('Failed to fetch obligations');
      return res.json();
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">OCR Data</h1>
      
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="obligations">Admin Obligations</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicesLoading ? (
                <div>Loading invoices...</div>
              ) : (
                <DataGrid
                  className="min-h-[500px]"
                  columns={invoiceColumns}
                  rows={invoices || []}
                  defaultColumnOptions={{
                    resizable: true,
                    sortable: true,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="obligations">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Obligations</CardTitle>
            </CardHeader>
            <CardContent>
              {obligationsLoading ? (
                <div>Loading obligations...</div>
              ) : (
                <DataGrid
                  className="min-h-[500px]"
                  columns={adminColumns}
                  rows={obligations || []}
                  defaultColumnOptions={{
                    resizable: true,
                    sortable: true,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
