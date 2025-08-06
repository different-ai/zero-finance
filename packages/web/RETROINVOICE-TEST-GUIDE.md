# RetroInvoice Testing Guide

## Overview
RetroInvoice is a public, company-initiated flow for requesting proper invoices from contractors based on their payment history. It uses AI to parse payment screenshots/PDFs and generate compliant invoices.

## Testing Flow

### 1. Company Creates Invoice Request
Navigate to: `/invoice/request`

**Test Data:**
- Company Name: `Acme Corp`
- Company Email: `billing@acme.com`
- Contractor Name: `John Doe`
- Contractor Email: `john@example.com`
- Project Description: `Website development and design services`
- Expected Total: `$5000.00`
- Date Range: Last 3 months
- Notes: `Please include all payments from Q4 2024`

After submission, you'll get a unique link that would be sent to the contractor.

### 2. Contractor Fills Invoice Details
Navigate to the link: `/invoice/fill/[token]`

The contractor will see:
- Company requesting the invoice
- Project description
- Expected amount

**Test Actions:**
1. Upload a screenshot of payment history (can use any bank/payment app screenshot)
2. AI will parse the payments automatically
3. Fill in additional details:
   - Tax ID: `123-45-6789`
   - Address: `123 Main St, City, State 12345`
   - Country: `United States`
4. Review parsed payments and submit

### 3. Company Reviews Invoice
Navigate to: `/invoice/review/[token]`

The company will see:
- All contractor details
- Parsed payment history
- Total amount calculation
- Any discrepancies with expected amount

**Test Actions:**
1. Review all details
2. Click "Approve & Generate Invoice"
3. Download the generated invoice (HTML format)

## Testing Without Real Data

### Mock Payment Screenshot
You can create a simple screenshot with payments like:
```
Oct 15, 2024 - Payment from Acme Corp - $1,500.00
Nov 01, 2024 - Payment from Acme Corp - $1,500.00
Nov 15, 2024 - Payment from Acme Corp - $1,000.00
Dec 01, 2024 - Payment from Acme Corp - $1,000.00
```

### Database Testing
To manually create test invoices in the database:

```sql
INSERT INTO retro_invoices (
  user_privy_did,
  token,
  company_name,
  company_email,
  contractor_name,
  contractor_email,
  project_description,
  total_amount,
  status
) VALUES (
  'public',
  'test-token-123',
  'Test Company',
  'test@company.com',
  'Test Contractor',
  'contractor@test.com',
  'Test project for invoice generation',
  5000.00,
  'pending'
);
```

## API Endpoints

1. **Create Invoice Request**
   - POST `/api/invoice/request`
   - Body: Company and contractor details

2. **Update Invoice (Contractor Fill)**
   - POST `/api/invoice/fill`
   - Body: Token and invoice data with parsed payments

3. **Generate PDF**
   - POST `/api/invoice/generate-pdf`
   - Body: Invoice ID
   - Returns: HTML invoice (can be printed to PDF)

4. **Update Status**
   - POST `/api/invoice/update-status`
   - Body: Invoice ID and new status

## Known Limitations

1. **Calendar Component**: The date range picker may show errors due to missing UI component
2. **PDF Generation**: Currently generates HTML instead of true PDF
3. **Email Notifications**: Not implemented - links must be copied manually
4. **AI Parsing**: Requires valid OpenAI API key in environment

## Environment Variables Needed

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
```

## Common Issues & Solutions

1. **"Module not found" errors**: Some UI components may be missing. The core functionality still works.
2. **AI parsing fails**: Ensure OpenAI API key is set and valid
3. **Database errors**: Run migrations to ensure retroInvoices table exists with new schema

## Next Steps for Production

1. Add proper PDF generation library (puppeteer, react-pdf)
2. Implement email notifications
3. Add authentication for company users
4. Add webhook notifications
5. Implement proper file upload to S3
6. Add invoice templates
7. Add multi-language support