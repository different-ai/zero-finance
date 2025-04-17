import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only protect admin routes, not the admin API
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('/api/')) {
    // Get the admin token from the cookie
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // Get the expected token from the environment variable
    const expectedToken = process.env.ADMIN_SECRET_TOKEN;
    
    // If the token isn't present or doesn't match, redirect to the login page
    if (!adminToken || (expectedToken && adminToken !== expectedToken)) {
      // If this is already the admin login page, don't redirect (prevents infinite loop)
      if (request.nextUrl.pathname === '/admin') {
        return NextResponse.next();
      }
      
      // Otherwise redirect to the admin login page
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 