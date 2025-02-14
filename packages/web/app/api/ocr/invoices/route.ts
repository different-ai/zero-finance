import { auth } from '@/app/(auth)/auth';
import { getRecentInvoices } from '@/lib/db/queries/invoices';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const invoices = await getRecentInvoices({
      userId: session.user.id,
      minutes: 60 * 24, // Last 24 hours
      limit: 100,
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
