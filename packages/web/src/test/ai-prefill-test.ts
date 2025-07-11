import { describe, it, expect } from 'vitest';

// Test data from the provided invoice-data.md file
export const testInvoiceTexts = {
  forwardedEmail: `from: rachel@karmarealestate.com  
subject: FW: RE: Invoice for Jan Work

hi ben,  

see below from our contractor. can you take care of this?

---

Hey Rachel,  

Here's the breakdown for January:

- Consulting: 12 hours @ $95/hr = $1,140  
- Travel (Uber + subway): $68.12  
- Hardware (router + cabling): $233.50  

Subtotal: $1,441.62  
Add 8.75% tax on services: $99.86  
TOTAL: $1,541.48  

Please wire to Chase  
Acct #: 574839302  
Routing: 021000021  
Name: Jon Marcel`,

  scannedText: `INVOICE NO 00493-b  
DATE: 11-02-2024  
BILL TO: MORNINGTIDE HEALTHCARE LLC  
ADDRESS: 1985 Broderick St, San Francisco  

DESCRIPTION  
------------------------------------------------------  
* Staff Augmentation - Jan 8 to Feb 2 → $9,600  
* Onsite Support Visit (Jan 12) → $275  
* Travel costs: $145.78  
* Meals + incidental → $48.12  

GRAND TOTAL: $10,068.90  
(Payment terms: NET 15. Late fee 1.5%/mo)`,

  messyTable: `company: Dustlight Audio
invoice ref: #DL-291  
date issued: March 4 2025  

| item | quantity | unit cost | total |
|------|----------|-----------|-------|
| Audio Design (Podcast S2 EP1-3) | 3 | 300 | 900 |
| Sound Licensing Rights | 1 | 250 | 250 |
| Rush Editing (EP2) | 1 | 120 | 120 |
| --- | --- | --- | --- |
| TOTAL | | | 1,270 |

please venmo @dustlightaudio or use ACH to routing 121000358 acct 001589202`,

  slackExport: `@alex
client finally paid the nov invoice 🙌

final amt: 4,950
breakdown:
- retainer (nov): 3,500  
- async QA work: 8h @ $100/hr = 800  
- figma + notion cleanup: 5h @ $130/hr = 650

wire hit on jan 5`,

  ocrDump: `INV 0083A7  
DR. LINA KAUR  
Patient Billing

Consultation (12.01.2024) ......... $250.00  
Follow-up call (12.04) ............ $85.00  
Prescription Fulfillment .......... $42.00  
Admin Fee ......................... $15.00  
---------------------------------------------  
Total Amount Due: $392.00  
Due By: 01.15.2025  
Paid via Credit (Amex)`
};

describe('AI Invoice Prefill Expected Results', () => {
  it('should extract data from forwarded email', () => {
    const expected = {
      sellerInfo: {
        businessName: 'Jon Marcel',
        email: 'rachel@karmarealestate.com', // From the sender
      },
      buyerInfo: {
        businessName: 'Karma Real Estate' // Inferred from email domain
      },
      invoiceItems: [
        { name: 'Consulting', quantity: 12, unitPrice: '95' },
        { name: 'Travel (Uber + subway)', quantity: 1, unitPrice: '68.12' },
        { name: 'Hardware (router + cabling)', quantity: 1, unitPrice: '233.50' }
      ],
      amount: 1541.48,
      currency: 'USD',
      bankDetails: {
        accountHolder: 'Jon Marcel',
        accountNumber: '574839302',
        routingNumber: '021000021',
        bankName: 'Chase'
      }
    };
    
    console.log('Expected extraction from forwarded email:', expected);
  });

  it('should extract data from scanned text', () => {
    const expected = {
      sellerInfo: {
        businessName: 'Unknown' // Not specified in the text
      },
      buyerInfo: {
        businessName: 'MORNINGTIDE HEALTHCARE LLC',
        address: '1985 Broderick St, San Francisco'
      },
      invoiceNumber: '00493-b',
      issuedAt: '2024-11-02',
      invoiceItems: [
        { name: 'Staff Augmentation - Jan 8 to Feb 2', quantity: 1, unitPrice: '9600' },
        { name: 'Onsite Support Visit (Jan 12)', quantity: 1, unitPrice: '275' },
        { name: 'Travel costs', quantity: 1, unitPrice: '145.78' },
        { name: 'Meals + incidental', quantity: 1, unitPrice: '48.12' }
      ],
      amount: 10068.90,
      currency: 'USD',
      terms: 'NET 15. Late fee 1.5%/mo',
      dueDate: '2024-11-17' // 15 days from issue date
    };
    
    console.log('Expected extraction from scanned text:', expected);
  });
}); 