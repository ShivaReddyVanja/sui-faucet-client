import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/admin/login','/'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public pages like login
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    // No cookie => redirect to login
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  // Cookie exists => allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to all /admin routes
};
