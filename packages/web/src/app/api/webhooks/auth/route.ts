import { NextRequest, NextResponse } from 'next/server';
import { PostHogClient } from '@/lib/posthog-server';

export const runtime = 'edge';

// Helper to convert hex string to Uint8Array
function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    if (isNaN(bytes[i / 2])) {
      // Add check for invalid hex characters
      throw new Error('Invalid hex character in string');
    }
  }
  return bytes;
}

// Helper to compare ArrayBuffers in constant time
function timingSafeEqual(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  const va = new DataView(a);
  const vb = new DataView(b);
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) {
    diff |= va.getUint8(i) ^ vb.getUint8(i);
  }
  return diff === 0;
}

async function verifySignatureEdge(req: NextRequest): Promise<any> {
  const secret = process.env.PRIVY_WEBHOOK_SECRET!;
  const signatureHeader = req.headers.get('x-privy-signature') || '';
  const body = await req.text(); // Read body once

  if (!secret || !signatureHeader) {
    throw new Error('Missing secret or signature header');
  }

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, // not extractable
    ['sign', 'verify'],
  );

  // Use Uint8Array directly instead of the buffer
  const signatureBytes = hexToUint8Array(signatureHeader);
  const dataBuffer = new TextEncoder().encode(body);

  const isValid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBytes as unknown as BufferSource,
    dataBuffer,
  );

  if (!isValid) {
    // Try comparing manually for debugging, but rely on subtle.verify
    const expectedSignature = await crypto.subtle.sign('HMAC', key, dataBuffer);
    console.log('Signature mismatch details:');
    console.log('Received Signature Header:', signatureHeader);
    // Convert expected ArrayBuffer to hex for comparison logging
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    console.log('Calculated Expected Signature:', expectedHex);

    // Important: Use a timing-safe comparison if not relying solely on subtle.verify
    // Example custom comparison (if subtle.verify fails unexpectedly):
    const receivedSigArr = hexToUint8Array(signatureHeader); // Re-create for comparison
    const expectedSigArr = new Uint8Array(expectedSignature);
    // Use the timingSafeEqual helper which expects ArrayBuffers
    // Cast .buffer to ArrayBuffer explicitly
    if (
      !timingSafeEqual(
        receivedSigArr.buffer as ArrayBuffer,
        expectedSigArr.buffer as ArrayBuffer,
      )
    ) {
      console.error('Manual timing-safe comparison also failed.');
      // Optionally add more logging here
    } else {
      console.warn(
        'Subtle.verify failed but manual timingSafeEqual passed. Check inputs/runtime behavior.',
      );
    }
    throw new Error('Invalid signature'); // Rely on subtle.verify result
  }

  return JSON.parse(body); // Return parsed body if signature is valid
}

export async function POST(req: NextRequest) {
  try {
    // Use the new verification function for Edge runtime
    const event = await verifySignatureEdge(req);

    // TODO: Add idempotency check (store event.id in DB)

    if (event.type === 'user.created' && event.data?.email) {
      // Send to Loops for email marketing
      const loopsApiKey = process.env.LOOPS_API_KEY;
      if (!loopsApiKey) {
        console.error(
          'LOOPS_API_KEY is not set. Cannot send contact to Loops.',
        );
        // Decide if this should be a hard error or just a warning
        // For now, let's log and continue, but not send to Loops.
      } else {
        await fetch('https://app.loops.so/api/v1/contacts/create', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${loopsApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: event.data.email,
            firstName: event.data.name?.split(' ')[0] ?? '',
            userId: event.data.id,
            source: 'zero finance signup',
          }),
        });
      }

      // Track user in PostHog
      // Note: Since we're in Edge runtime, we'll make a direct API call to PostHog
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost =
        process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

      if (posthogKey) {
        try {
          // Identify user in PostHog
          await fetch(`${posthogHost}/capture/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: posthogKey,
              event: '$identify',
              distinct_id: event.data.id,
              properties: {
                $set: {
                  email: event.data.email,
                  name: event.data.name,
                  created_at: event.data.created_at || new Date().toISOString(),
                  source: 'privy_webhook',
                },
              },
              timestamp: new Date().toISOString(),
            }),
          });

          // Also track signup event
          await fetch(`${posthogHost}/capture/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: posthogKey,
              event: 'user_signed_up',
              distinct_id: event.data.id,
              properties: {
                email: event.data.email,
                signup_method: 'privy',
                source: 'webhook',
              },
              timestamp: new Date().toISOString(),
            }),
          });

          console.log(
            '0xHypr',
            'PostHog tracking sent for user',
            event.data.id,
          );
        } catch (phError) {
          console.error('0xHypr', 'Failed to send PostHog tracking:', phError);
          // Don't fail the webhook if PostHog fails
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error processing Privy webhook:', err.message);
    const status = err.message === 'Invalid signature' ? 401 : 400;
    // Provide a clearer error response
    return new NextResponse(
      JSON.stringify({ error: err.message || 'bad request' }),
      {
        status,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
