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
    const response = NextResponse.redirect(url, { status: 301 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Check for blocked conditions
  // const blockedParams = ['brand', 'name', 'id', 'names'];
  // const hasBlockedParam = blockedParams.some((param) =>
  //   searchParams.has(param)
  // );
  const vehiclesWeArmorParam = searchParams.has('vehicles_we_armor');
  const isBlockedDocument = pathname.includes('media/documents/');
  const contactPageParams = ['name', 'id', 'names'].some((param) =>
    searchParams.has(param)
  );
  const isBrandBlockedPath =
    pathname.startsWith('/available-now/type/') ||
    pathname.startsWith('/vehicles-we-armor/inventory');
  const shouldBlockBrand = isBrandBlockedPath && searchParams.has('brand');
  const hasChryslerMake = searchParams.get('make') === 'chrysler';

  if (
    // hasBlockedParam ||
    pathname.startsWith('/stock') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/vehicles-we-armor/inventory') ||
    shouldBlockBrand ||
    (pathname.startsWith('/available-now/type/') && vehiclesWeArmorParam) ||
    (pathname === '/contact' && contactPageParams) ||
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

  // Redirect /stock URLs to /available-now
  if (pathname.startsWith('/stock')) {
    const url = request.nextUrl.clone();
    url.pathname = '/available-now';
    const response = NextResponse.redirect(url, { status: 301 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(stock|inventory|vehicles-we-armor|available-now|armored|blog)/:path*',
    '/media/documents/:path*',
    '/contact',
  ],
};
