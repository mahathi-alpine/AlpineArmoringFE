import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith('/stock') ||
    request.nextUrl.pathname.startsWith('/inventory')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/';

    const response = NextResponse.redirect(url, { status: 301 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/stock/:path*', '/inventory/:path*'],
};
