/**
 * Send Mock Emails for Video Demo
 *
 * This script:
 * 1. Generates a PDF invoice using html-pdf-node
 * 2. Sends two mock emails via Resend to ben@0.finance
 *
 * Usage: npx tsx scripts/send-mock-emails.ts
 */

import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.join(__dirname, '../.env.local') });
// Also try production env as fallback
if (!process.env.RESEND_API_KEY) {
  config({ path: path.join(__dirname, '../.env.production.local') });
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'ben@0.finance';
const FROM_DOMAIN = 'zerofinance.ai';

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY not found in environment');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// Invoice HTML content
const invoiceHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; 
      color: #1a1a1a; 
      padding: 48px; 
      max-width: 800px; 
      margin: 0 auto;
      font-size: 14px;
      line-height: 1.5;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 48px;
      padding-bottom: 24px;
      border-bottom: 2px solid #1a1a1a;
    }
    .logo { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .logo-sub { font-size: 12px; font-weight: 400; color: #666; margin-top: 4px; }
    .invoice-title { text-align: right; }
    .invoice-title h1 { font-size: 32px; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; }
    .invoice-number { font-size: 14px; color: #666; margin-top: 4px; }
    .details-grid { display: flex; justify-content: space-between; margin-bottom: 48px; }
    .detail-section { width: 45%; }
    .detail-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 12px; }
    .detail-section p { margin: 4px 0; }
    .detail-section .name { font-weight: 600; font-size: 16px; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; padding: 12px 0; border-bottom: 1px solid #e5e5e5; }
    th:last-child { text-align: right; }
    td { padding: 16px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
    td:last-child { text-align: right; font-weight: 500; }
    .item-description { font-weight: 500; margin-bottom: 4px; }
    .item-details { font-size: 13px; color: #666; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 48px; }
    .totals-table { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals-row.total { border-top: 2px solid #1a1a1a; margin-top: 8px; padding-top: 16px; font-size: 18px; font-weight: 600; }
    .payment-section { background: #f8f8f8; padding: 24px; border-radius: 8px; margin-bottom: 32px; }
    .payment-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 16px; }
    .payment-grid { display: flex; flex-wrap: wrap; gap: 24px; }
    .payment-item { width: 45%; }
    .payment-item label { font-size: 12px; color: #666; display: block; margin-bottom: 4px; }
    .payment-item span { font-weight: 500; font-family: monospace; }
    .footer { text-align: center; color: #999; font-size: 12px; padding-top: 24px; border-top: 1px solid #e5e5e5; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Chen Design Studio</div>
      <div class="logo-sub">Brand Identity & Visual Design</div>
    </div>
    <div class="invoice-title">
      <h1>Invoice</h1>
      <div class="invoice-number">CHD-2024-0847</div>
    </div>
  </div>
  
  <div class="details-grid">
    <div class="detail-section">
      <h3>From</h3>
      <p class="name">Chen Design Studio</p>
      <p>Marcus Chen</p>
      <p>1847 Folsom Street, Suite 201</p>
      <p>San Francisco, CA 94103</p>
      <p>marcus@chendesign.studio</p>
      <p>Tax ID: 84-2947561</p>
    </div>
    <div class="detail-section">
      <h3>Bill To</h3>
      <p class="name">0 Finance Inc.</p>
      <p>Benjamin Shafii</p>
      <p>548 Market Street, PMB 72296</p>
      <p>San Francisco, CA 94104</p>
      <p>ben@0.finance</p>
    </div>
  </div>
  
  <div class="details-grid">
    <div class="detail-section">
      <h3>Invoice Date</h3>
      <p>December 29, 2024</p>
    </div>
    <div class="detail-section">
      <h3>Payment Due</h3>
      <p>January 13, 2025 (Net 15)</p>
    </div>
  </div>
  
  <table>
    <thead>
      <tr><th>Description</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="item-description">Brand Identity Package</div>
          <div class="item-details">Primary logo design with 6 variations, color palette with accessibility specifications, typography system, comprehensive brand guidelines (PDF), social media templates. Includes 2 rounds of revisions.</div>
        </td>
        <td>$1,500.00</td>
      </tr>
      <tr>
        <td>
          <div class="item-description">Additional Revision Round</div>
          <div class="item-details">Third revision round for logo refinements per client feedback (Dec 18-20)</div>
        </td>
        <td>$250.00</td>
      </tr>
      <tr>
        <td>
          <div class="item-description">Asset Export & File Preparation</div>
          <div class="item-details">Final file exports in all formats (SVG, PNG, PDF, EPS), organized file structure, Figma handoff documentation</div>
        </td>
        <td>$100.00</td>
      </tr>
    </tbody>
  </table>
  
  <div class="totals">
    <div class="totals-table">
      <div class="totals-row"><span>Subtotal</span><span>$1,850.00</span></div>
      <div class="totals-row"><span>Tax (0%)</span><span>$0.00</span></div>
      <div class="totals-row total"><span>Total Due</span><span>$1,850.00</span></div>
    </div>
  </div>
  
  <div class="payment-section">
    <h3>Payment Details</h3>
    <div class="payment-grid">
      <div class="payment-item"><label>Bank Name</label><span>First Republic Bank</span></div>
      <div class="payment-item"><label>Account Holder</label><span>Chen Design Studio LLC</span></div>
      <div class="payment-item"><label>Routing Number</label><span>321081669</span></div>
      <div class="payment-item"><label>Account Number</label><span>4829103756</span></div>
    </div>
  </div>
  
  <div class="footer">
    <p>Thank you for your business!</p>
    <p style="margin-top: 8px;">Questions? Contact marcus@chendesign.studio</p>
  </div>
</body>
</html>`;

// Email 1: Invoice Request from Sarah
const email1 = {
  from: `Sarah Mitchell <sarah.mitchell@${FROM_DOMAIN}>`,
  to: TO_EMAIL,
  subject: 'December consulting invoice?',
  html: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; color: #1a1a1a; line-height: 1.6;">
      <p>Hey Ben,</p>
      
      <p>Hope the holidays are treating you well!</p>
      
      <p>Can you send over the invoice for December? We wrapped up the product strategy sessions and the go-to-market roadmap last week.</p>
      
      <p>Total was $4,200 as we discussed - 12 hours at $350/hr.</p>
      
      <p>Need it by Friday so I can get it into our system before month-end close.</p>
      
      <p>Thanks!</p>
      
      <div style="margin-top: 24px; color: #444;">
        <strong>Sarah Mitchell</strong><br>
        Head of Operations<br>
        Northstar Ventures<br>
        sarah.mitchell@zerofinance.ai<br>
        (415) 555-0147
      </div>
    </div>
  `,
  text: `Hey Ben,

Hope the holidays are treating you well!

Can you send over the invoice for December? We wrapped up the product strategy sessions and the go-to-market roadmap last week.

Total was $4,200 as we discussed - 12 hours at $350/hr.

Need it by Friday so I can get it into our system before month-end close.

Thanks!

Sarah Mitchell
Head of Operations
Northstar Ventures
sarah.mitchell@zerofinance.ai
(415) 555-0147`,
};

// Email 2: Contractor Payment from Marcus (with PDF attachment)
const email2Html = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; color: #1a1a1a; line-height: 1.6;">
    <p>Hi Ben,</p>
    
    <p>Great news - the brand identity package is complete! All final files are in the shared Figma and I've exported everything to the Google Drive folder we set up.</p>
    
    <p>Deliverables included:</p>
    <ul>
      <li>Primary logo + 6 variations</li>
      <li>Color palette with accessibility specs</li>
      <li>Typography system</li>
      <li>Brand guidelines PDF</li>
      <li>Social media templates</li>
    </ul>
    
    <p>Attached is my invoice for the project - $1,850 as quoted.</p>
    
    <p>My bank details are on the invoice but happy to resend if needed. Same account as the deposit you sent in November.</p>
    
    <p>Really enjoyed working on this one. The direction you picked for the visual identity turned out great. Let me know if you need any tweaks!</p>
    
    <div style="margin-top: 24px; color: #444;">
      <strong>Marcus Chen</strong><br>
      Chen Design Studio<br>
      marcus@chendesign.studio<br>
      chendesign.studio<br>
      (628) 555-0293
    </div>
  </div>
`;

const email2Text = `Hi Ben,

Great news - the brand identity package is complete! All final files are in the shared Figma and I've exported everything to the Google Drive folder we set up.

Deliverables included:
- Primary logo + 6 variations
- Color palette with accessibility specs
- Typography system
- Brand guidelines PDF
- Social media templates

Attached is my invoice for the project - $1,850 as quoted.

My bank details are on the invoice but happy to resend if needed. Same account as the deposit you sent in November.

Really enjoyed working on this one. The direction you picked for the visual identity turned out great. Let me know if you need any tweaks!

Marcus Chen
Chen Design Studio
marcus@chendesign.studio
chendesign.studio
(628) 555-0293`;

async function generatePdfWithPuppeteer(): Promise<Buffer> {
  // Dynamic import for puppeteer
  const puppeteer = await import('puppeteer');

  console.log('🖨️  Launching browser for PDF generation...');
  const browser = await puppeteer.default.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
  });

  await browser.close();
  console.log('✅ PDF generated successfully');

  return Buffer.from(pdfBuffer);
}

async function generatePdfSimple(): Promise<Buffer> {
  // Fallback: Create a simple text-based PDF representation
  // For a real PDF, we'd use a library, but let's try puppeteer first
  try {
    return await generatePdfWithPuppeteer();
  } catch (error) {
    console.log(
      '⚠️  Puppeteer not available, using pre-generated PDF or HTML...',
    );

    // Check if we have a pre-generated PDF
    const pdfPath = path.join(
      __dirname,
      '../public/mock-emails/Invoice-CHD-2024-0847.pdf',
    );
    if (fs.existsSync(pdfPath)) {
      return fs.readFileSync(pdfPath);
    }

    // Return HTML as fallback (Resend can handle HTML attachments)
    return Buffer.from(invoiceHtml, 'utf-8');
  }
}

async function sendEmails() {
  console.log('📧 Sending mock emails for video demo...\n');

  // Send Email 1: Invoice Request
  console.log('1️⃣  Sending invoice request from Sarah Mitchell...');
  try {
    const result1 = await resend.emails.send({
      from: email1.from,
      to: email1.to,
      subject: email1.subject,
      html: email1.html,
      text: email1.text,
    });
    console.log(`   ✅ Sent! ID: ${result1.data?.id}\n`);
  } catch (error: any) {
    console.error(`   ❌ Failed: ${error.message}\n`);
  }

  // Generate PDF for Email 2
  console.log('2️⃣  Generating invoice PDF...');
  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await generatePdfSimple();
  } catch (error: any) {
    console.error(`   ❌ PDF generation failed: ${error.message}`);
    console.log('   📄 Sending without attachment...\n');

    // Send without attachment as fallback
    try {
      const result2 = await resend.emails.send({
        from: `Marcus Chen <marcus@${FROM_DOMAIN}>`,
        to: TO_EMAIL,
        subject: 'Brand identity project - final delivery + invoice',
        html: email2Html,
        text: email2Text,
      });
      console.log(`   ✅ Sent (no attachment)! ID: ${result2.data?.id}\n`);
    } catch (e: any) {
      console.error(`   ❌ Failed: ${e.message}\n`);
    }
    return;
  }

  // Send Email 2: Contractor Payment with PDF
  console.log('   Sending contractor invoice from Marcus Chen...');
  try {
    const result2 = await resend.emails.send({
      from: `Marcus Chen <marcus@${FROM_DOMAIN}>`,
      to: TO_EMAIL,
      subject: 'Brand identity project - final delivery + invoice',
      html: email2Html,
      text: email2Text,
      attachments: [
        {
          filename: 'Invoice-CHD-2024-0847.pdf',
          content: pdfBuffer,
        },
      ],
    });
    console.log(`   ✅ Sent with PDF! ID: ${result2.data?.id}\n`);
  } catch (error: any) {
    console.error(`   ❌ Failed: ${error.message}\n`);
  }

  console.log('🎬 Done! Check ben@0.finance for the mock emails.');
}

// Run
sendEmails().catch(console.error);
