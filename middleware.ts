import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { blockedPatterns } from './blockedUrls';

// Specific URLs that need to be redirected
const redirectMap = new Map([
  [
    "/blog/1/alpine-armoring's-featured-vehicle:-pit-bu",
    '/news/alpine-armorings-featured-vehicle-pit-bull',
  ],
]);

// Parameters that should be blocked
const blockedParams = ['vehicles_we_armor', 'brand', 'name', 'id', 'names'];

const isUrlBlocked = (
  pathname: string,
  searchParams: URLSearchParams
): boolean => {
  return blockedPatterns.some(({ pattern, exact, queryParams }) => {
    if (exact) {
      return pathname === pattern;
    }

    if (!pathname.startsWith(pattern)) {
      return false;
    }

    if (queryParams) {
      return Object.entries(queryParams).some(([param, allowedValues]) => {
        const value = searchParams.get(param);
        return value && allowedValues.includes(value.toLowerCase());
      });
    }

    return true;
  });
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Check redirects first
  const redirectTo = redirectMap.get(pathname);
  if (redirectTo) {
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    return NextResponse.redirect(url, { status: 301 });
  }

  // Redirect /stock URLs to /available-now
  if (pathname.startsWith('/stock')) {
    const url = request.nextUrl.clone();
    url.pathname = '/available-now';
    return NextResponse.redirect(url, { status: 301 });
  }

  // Check for blocked conditions
  const hasBlockedParam = blockedParams.some((param) =>
    searchParams.has(param)
  );
  const isBlockedDocument = pathname.includes('media/documents/');
  const hasChryslerMake = searchParams.get('make') === 'chrysler';

  if (
    pathname.startsWith('/stock') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/vehicles-we-armor/inventory') ||
    hasBlockedParam ||
    isUrlBlocked(pathname, searchParams) ||
    isBlockedDocument ||
    hasChryslerMake
  ) {
    // const url = request.nextUrl.clone();
    // url.pathname = '/';
    // url.search = '';
    // const response = NextResponse.redirect(url, { status: 301 });

    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(stock|inventory|vehicles-we-armor|available-now|armored)/:path*',
    '/media/documents/:path*',
    '/contact',
  ],
};
