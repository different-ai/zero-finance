'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function CsvToPdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        !selectedFile.name.endsWith('.csv') &&
        !selectedFile.name.endsWith('.xlsx') &&
        !selectedFile.name.endsWith('.xls')
      ) {
        setError('Please upload a CSV or Excel file');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const convertToPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      let data: any[][] = [];

      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const parsed = Papa.parse(text);
        data = parsed.data as any[][];
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      }

      if (data.length === 0) {
        setError('File appears to be empty');
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('Shareholders Registry', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 27);

      autoTable(doc, {
        head: data[0] ? [data[0]] : [],
        body: data.slice(1),
        startY: 35,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: {
          fillColor: [0, 80, 255],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 35, left: 14, right: 14 },
      });

      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        'Informational cap table snapshot for KYB. Not a legal certificate.',
        14,
        pageHeight - 10,
      );

      const fileName = file.name.replace(/\.(csv|xlsx|xls)$/i, '.pdf');
      doc.save(fileName);

      setFile(null);
      const fileInput = document.getElementById(
        'csv-upload',
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error('Conversion error:', err);
      setError('Failed to convert file. Please check your file format.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          id="csv-upload"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-xs text-muted-foreground">
            {file ? file.name : 'Click to upload CSV or Excel'}
          </span>
        </label>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={convertToPdf}
        disabled={!file || isProcessing}
        className="w-full text-xs"
        size="sm"
      >
        {isProcessing ? (
          'Converting...'
        ) : (
          <>
            <Download className="h-3 w-3 mr-1" />
            Convert to PDF
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        Upload your cap table spreadsheet and we'll convert it to a clean PDF
        for upload.
      </p>
    </div>
  );
}
