import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'

// Check for required environment variables
const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

// Initialize the client only if both environment variables are present
let privyClient: PrivyClient | null = null;
try {
  if (privyAppId && privyAppSecret) {
    privyClient = new PrivyClient(privyAppId, privyAppSecret);
  } else {
    console.warn('Middleware: Privy environment variables are missing. Authentication middleware will be disabled.');
  }
} catch (error) {
  console.error('Middleware: Failed to initialize Privy client:', error);
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // If Privy client is not initialized, just continue
  if (!privyClient) {
    return NextResponse.next();
  }

  // Only apply logic to the root path
  if (request.nextUrl.pathname === '/') {
    const authToken = request.cookies.get('privy-token')?.value

    if (authToken) {
      try {
        // Verify the token
        await privyClient.verifyAuthToken(authToken)
        // Token is valid, redirect to dashboard
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      } catch (error) {
        // Token is invalid or expired, let the request proceed to the root page
        console.warn('Middleware: Privy auth token verification failed:', error)
        // Optionally delete the invalid cookie
        // const response = NextResponse.next();
        // response.cookies.delete('privy-token');
        // return response;
      }
    }
    // No token found, let the request proceed to the root page
  }

  // For all other paths, or if checks fail, continue as normal
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
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
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)', // Apply middleware to most paths, but logic inside only targets '/' explicitly
  ],
}

