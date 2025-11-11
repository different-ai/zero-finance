import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force Node.js runtime to support Privy server-auth crypto module
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (if you had a dedicated login page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ]
};

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip auth checks for demo route
  if (pathname.startsWith('/dashboard/demo')) {
    return NextResponse.next();
  }

  // Only apply logic to the root path
  if (pathname === '/') {
    const authToken = request.cookies.get('privy-token')?.value;

    if (authToken) {
      try {
        // Lazy load Privy client to avoid Edge Runtime issues
        const { PrivyClient } = await import('@privy-io/server-auth');
        const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
        const privyAppSecret = process.env.PRIVY_APP_SECRET;

        if (!privyAppId || !privyAppSecret) {
          console.warn('Middleware: Privy environment variables are missing');
          return NextResponse.next();
        }

        const privyClient = new PrivyClient(privyAppId, privyAppSecret);

        // Verify the token
        await privyClient.verifyAuthToken(authToken);
        // Token is valid, redirect to dashboard
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      } catch (error) {
        // Token is invalid or expired, let the request proceed to the root page
        console.warn(
          'Middleware: Privy auth token verification failed:',
          error,
        );
      }
    }
    // No token found, let the request proceed to the root page
  }

  // For all other paths, continue as normal
  return NextResponse.next();
}
