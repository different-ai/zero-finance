import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

async function verify(req: NextRequest) {
  const secret = process.env.PRIVY_WEBHOOK_SECRET!;
  const signature = req.headers.get('x-privy-signature') || '';
  const body = await req.text();
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return JSON.parse(body);
  }
  throw new Error('invalid signature');
}

export async function POST(req: NextRequest) {
  try {
    const event = await verify(req);

    // TODO: Add idempotency check (store event.id in DB)

    if (event.type === 'user.created' && event.data?.email) {
      await fetch('https://app.loops.so/api/v1/contacts/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LOOPS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: event.data.email,
          firstName: event.data.name?.split(' ')[0] ?? '',
          // Add userId to associate the Loops contact with the Privy user
          userId: event.data.id, 
          source: 'hyprsqrl signup',
          // You could add more custom properties here if needed
          // e.g., created_at: event.data.created_at 
        }),
      });
    }

    // Handle other event types if needed in the future
    // else if (event.type === 'user.authenticated') { ... }
    // else if (event.type === 'wallet.created') { ... }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error processing Privy webhook:', err);
    // Return a more specific error message if possible
    const status = err.message === 'invalid signature' ? 401 : 400;
    return new NextResponse(err.message || 'bad request', { status });
  }
} 