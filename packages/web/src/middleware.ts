import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrivyClient } from '@privy-io/server-auth'

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
const privyAppSecret = process.env.PRIVY_APP_SECRET!

// Ensure environment variables are checked during build/startup
if (!privyAppId || !privyAppSecret) {
  console.error("Privy App ID or Secret is missing for middleware!")
  // In production, you might throw an error to prevent startup
}

const privyClient = new PrivyClient(privyAppId, privyAppSecret)

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
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

