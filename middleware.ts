import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const blockedParams = ['vehicles_we_armor', 'brand', 'name', 'id', 'names'];

  const hasBlockedParam = blockedParams.some((param) =>
    request.nextUrl.searchParams.has(param)
  );

  if (
    request.nextUrl.pathname.startsWith('/stock') ||
    request.nextUrl.pathname.startsWith('/inventory') ||
    hasBlockedParam
  ) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/stock/:path*', '/inventory/:path*', '/:path*'],
};
