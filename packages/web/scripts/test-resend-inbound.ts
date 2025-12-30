/**
 * Test script for Resend inbound email flow
 *
 * Usage:
 *   pnpm tsx scripts/test-resend-inbound.ts <workspace-id>
 *
 * This script sends a test email to your Resend inbound domain,
 * which will trigger the webhook flow.
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const AI_EMAIL_INBOUND_DOMAIN =
  process.env.AI_EMAIL_INBOUND_DOMAIN || 'ai.0.finance';

if (!RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY environment variable is required');
  console.error('   Run: export RESEND_API_KEY=re_your_key');
  process.exit(1);
}

const workspaceId = process.argv[2];
if (!workspaceId) {
  console.error(
    '❌ Usage: pnpm tsx scripts/test-resend-inbound.ts <workspace-id>',
  );
  console.error(
    '   Example: pnpm tsx scripts/test-resend-inbound.ts ws_abc123',
  );
  process.exit(1);
}

async function main() {
  const resend = new Resend(RESEND_API_KEY);

  const toAddress = `${workspaceId}@${AI_EMAIL_INBOUND_DOMAIN}`;

  console.log('📧 Sending test email...');
  console.log(`   To: ${toAddress}`);
  console.log(`   From: test@resend.dev`);

  try {
    const result = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>', // Resend's test domain
      to: toAddress,
      subject: 'Test Invoice Request',
      text: `
Hi,

Please create an invoice for the following:

Client: Test Company Inc.
Email: testclient@example.com
Amount: $500.00
Description: Consulting services for December 2024

Thanks!
      `.trim(),
    });

    if (result.error) {
      console.error('❌ Failed to send email:', result.error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log(`   Message ID: ${result.data?.id}`);
    console.log('');
    console.log('📥 The email should trigger a webhook to /api/ai-email');
    console.log(
      '   Check your Vercel logs or Resend dashboard to see the result.',
    );
    console.log('');
    console.log('🔗 Resend Dashboard: https://resend.com/emails');
    console.log('🔗 Vercel Logs: vercel logs --follow');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
