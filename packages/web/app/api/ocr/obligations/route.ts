import { auth } from '@/app/(auth)/auth';
import { getRecentAdminObligations } from '@/lib/db/queries/invoices';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    console.log('session', session);
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const obligations = await getRecentAdminObligations({
      userId: session.user.id,
      minutes: 60 * 24, // Last 24 hours
      limit: 100,
    });
    console.log('obligations', obligations);

    return NextResponse.json(obligations);
  } catch (error: any) {
    console.error('Failed to fetch obligations:', {
      error,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return new NextResponse(`Database connection error: ${error.message}`, { status: 500 });
  }
}
