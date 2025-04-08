import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // No authentication middleware needed here since Privy handles auth client-side
  // You can add your own custom middleware logic here if needed
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Apply to all routes except static files, api routes, etc.
    '/((?!_next|api|trpc|static|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|woff|woff2)).*)',
  ],
}

