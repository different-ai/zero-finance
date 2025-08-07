import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import type { InvoiceDisplayData } from './invoice-display';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
   title: {
     fontSize: 26,
     fontWeight: 'bold',
     marginBottom: 8,
     color: '#111827',
   },  invoiceNumber: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 3,
  },
  statusBadge: {
    fontSize: 10,
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    padding: '2 6',
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  text: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 3,
  },
  boldText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 3,
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
  },
   tableRow: {
     flexDirection: 'row',
     paddingVertical: 10,
     borderBottomWidth: 1,
     borderBottomColor: '#f3f4f6',
   },
   tableRowAlt: {
     backgroundColor: '#fafafa',
   },  tableCol: {
    flex: 1,
    fontSize: 10,
  },
  tableColHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  tableColDescription: {
    flex: 3,
  },
  tableColRight: {
    flex: 1,
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    marginRight: 20,
    minWidth: 100,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 12,
    minWidth: 80,
    textAlign: 'right',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 20,
    minWidth: 100,
    textAlign: 'right',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 80,
    textAlign: 'right',
  },
  notesSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#374151',
  },
  noteText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 10,
    lineHeight: 1.4,
  },
  bankDetails: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
  },
});

interface InvoicePDFTemplateProps {
  invoiceData: InvoiceDisplayData;
}

export const InvoicePDFTemplate: React.FC<InvoicePDFTemplateProps> = ({ invoiceData }) => {
  // Helper functions
  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount: string | number | undefined, currencySymbol: string = ''): string => {
    if (amount === undefined || amount === null) return 'N/A';
    const amountStr = amount.toString();
    if (amountStr.startsWith('0x')) return 'Invalid Price';
    
    try {
      const num = parseFloat(amountStr);
      if (isNaN(num)) return 'Invalid Price';
      return `${currencySymbol} ${num.toFixed(2)}`;
    } catch {
      return 'Formatting Error';
    }
  };

  const formatAddress = (address: any): string => {
    if (!address) return 'N/A';
    const parts = [
      address['street-address'],
      address.locality,
      address['postal-code'],
      address['country-name']
    ].filter(Boolean);
    return parts.join(', ') || 'N/A';
  };

  const calculateItemTotal = (item: any): string => {
    const quantity = item.quantity || 0;
    const unitPrice = parseFloat(item.unitPrice || '0');
    const taxRate = parseFloat(item.tax?.amount || '0') / 100;
    if (isNaN(unitPrice) || isNaN(taxRate)) return '0.00';
    const subtotal = quantity * unitPrice;
    const taxAmount = subtotal * taxRate;
    return (subtotal + taxAmount).toFixed(2);
  };

  const overallTotal = invoiceData.invoiceItems?.reduce((sum, item) => {
    const itemTotal = parseFloat(calculateItemTotal(item));
    if (isNaN(itemTotal)) return sum;
    return sum + itemTotal;
  }, 0).toFixed(2) || '0.00';

  const currencySymbol = 
    invoiceData.currency === 'USD' ? '$' : 
    invoiceData.currency === 'EUR' ? '€' : 
    invoiceData.currency === 'GBP' ? '£' : 
    (invoiceData.currency || '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.invoiceNumber}>
            #{invoiceData.invoiceNumber || 'N/A'}
          </Text>
          {invoiceData.isOnChain && (
            <Text style={styles.statusBadge}>On-Chain</Text>
          )}
        </View>

        {/* Date and Status */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Status:</Text> {invoiceData.status || 'Unknown'}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.boldText}>Issued:</Text> {formatDate(invoiceData.creationDate)}
            </Text>
            {invoiceData.paymentTerms?.dueDate && (
              <Text style={styles.text}>
                <Text style={styles.boldText}>Due:</Text> {formatDate(invoiceData.paymentTerms.dueDate)}
              </Text>
            )}
            {invoiceData.status === 'Paid' && invoiceData.paidAt && (
              <Text style={styles.text}>
                <Text style={styles.boldText}>Paid on:</Text> {formatDate(invoiceData.paidAt)}
              </Text>
            )}
          </View>
        </View>

        {/* Seller and Buyer Info */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.boldText}>{invoiceData.sellerInfo?.businessName || 'N/A'}</Text>
            <Text style={styles.text}>{invoiceData.sellerInfo?.email || 'N/A'}</Text>
            <Text style={styles.text}>{formatAddress(invoiceData.sellerInfo?.address)}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>To</Text>
            <Text style={styles.boldText}>{invoiceData.buyerInfo?.businessName || 'N/A'}</Text>
            <Text style={styles.text}>{invoiceData.buyerInfo?.email || 'N/A'}</Text>
            <Text style={styles.text}>{formatAddress(invoiceData.buyerInfo?.address)}</Text>
          </View>
        </View>

        {/* Invoice Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableColHeader, styles.tableColDescription]}>Description</Text>
            <Text style={[styles.tableColHeader, styles.tableColRight]}>Qty</Text>
            <Text style={[styles.tableColHeader, styles.tableColRight]}>Unit Price</Text>
            <Text style={[styles.tableColHeader, styles.tableColRight]}>Tax (%)</Text>
            <Text style={[styles.tableColHeader, styles.tableColRight]}>Total</Text>
          </View>
          {invoiceData.invoiceItems && invoiceData.invoiceItems.length > 0 ? (
            invoiceData.invoiceItems.map((item, index) => (
              <View key={index} style={index % 2 === 1 ? [styles.tableRow, styles.tableRowAlt] : styles.tableRow}>
                <Text style={[styles.tableCol, styles.tableColDescription]}>{item.name || 'N/A'}</Text>
                <Text style={[styles.tableCol, styles.tableColRight]}>{item.quantity || 'N/A'}</Text>
                <Text style={[styles.tableCol, styles.tableColRight]}>
                  {formatCurrency(item.unitPrice, currencySymbol)}
                </Text>
                <Text style={[styles.tableCol, styles.tableColRight]}>{item.tax?.amount || '0'}%</Text>
                <Text style={[styles.tableCol, styles.tableColRight]}>
                  {formatCurrency(calculateItemTotal(item), currencySymbol)}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.tableCol}>No items listed</Text>
            </View>
          )}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>Total Amount</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(overallTotal, currencySymbol)}
            </Text>
          </View>
        </View>

        {/* Notes and Terms */}
        {(invoiceData.note || invoiceData.terms || invoiceData.bankDetails) && (
          <View style={styles.notesSection}>
            {invoiceData.note && (
              <View>
                <Text style={styles.noteTitle}>Notes:</Text>
                <Text style={styles.noteText}>{invoiceData.note}</Text>
              </View>
            )}
            {invoiceData.terms && (
              <View>
                <Text style={styles.noteTitle}>Terms:</Text>
                <Text style={styles.noteText}>{invoiceData.terms}</Text>
              </View>
            )}
          </View>
        )}


      </Page>
    </Document>
  );
};