import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Cookies seen in middleware:", request.cookies.get('refreshToken'));
  // ✅ Skip protection for /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
     const authToken = request.cookies.get('refreshToken');

    if (!authToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
