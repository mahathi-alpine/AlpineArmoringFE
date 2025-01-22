import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { blockedPatterns } from './blockedUrls';

// Specific URLs that need to be redirected
const redirectMap = new Map([
  [
    "/blog/1/alpine-armoring's-featured-vehicle:-pit-bu",
    '/news/alpine-armorings-featured-vehicle-pit-bull',
  ],
  [
    '/vehicles-we-armor/213-Special%20Purpose%20Vehicle-Armored-Toyota-Land-Cruiser-78-Series-(Ambulance)-',
    '/vehicles-we-armor/armored-omicron-ambulance',
  ],
  [
    '/vehicles-we-armor/213-Special%20Purpose%20Vehicle-Armored-Toyota-Land-Cruiser-78-Series-(Ambulance)',
    '/vehicles-we-armor/armored-omicron-ambulance',
  ],
  [
    '/vehicles-we-armor/213-Special%32Purpose%32Vehicle-Armored-Toyota-Land-Cruiser-78-Series-(Ambulance)',
    '/vehicles-we-armor/armored-omicron-ambulance',
  ],
  [
    '/vehicles-we-armor/348-Police%20Pursuit%20Vehicles%20(PPV)-Armored-Toyota-Land-Cruiser-78-Series-(Ambulance)-',
    '/vehicles-we-armor/armored-omicron-ambulance',
  ],
  [
    '/stock/196-Special%20Purpose%20Vehicle-Armored-Toyota-Land-Cruiser-78-Series-(Ambulance)-1695',
    '/available-now/type/armored-law-enforcement',
  ],
  [
    '/stock/inventory/Police%20Pursuit%20Vehicles%20(PPV)',
    '/available-now/type/armored-law-enforcement',
  ],
  [
    '/stock/227-Police%20Pursuit%20Vehicles%20(PPV)-Ford-Explorer-Interceptor-PPV-4571',
    '/available-now/type/armored-law-enforcement',
  ],
  // [
  //   '/vehicles-we-armor/264-Police%20Pursuit%20Vehicles%20(PPV)-Armored-Ford-Explorer-PPV-',
  //   '/vehicles-we-armor?make=ford',
  // ],
  // [
  //   '/vehicles-we-armor/259-Police%20Pursuit%20Vehicles%20(PPV)-Armored-Ford-Explorer-PPV-',
  //   '/vehicles-we-armor?make=ford',
  // ],
  // [
  //   '/vehicles-we-armor/inventory?type=Police+Pursuit+Vehicles+(PPV)',
  //   '/vehicles-we-armor/type/armored-law-enforcement',
  // ],
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
  const vehiclesWeArmorParam = searchParams.has('vehicles_we_armor');
  const contactPageParams = ['name', 'id', 'names'].some((param) =>
    searchParams.has(param)
  );
  const isBrandBlockedPath =
    pathname.startsWith('/available-now/type/') ||
    pathname.startsWith('/vehicles-we-armor/inventory');
  const shouldBlockBrand = isBrandBlockedPath && searchParams.has('brand');
  const hasChryslerMake = searchParams.get('make') === 'chrysler';

  if (
    pathname.startsWith('/stock') ||
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/vehicles-we-armor/inventory') ||
    shouldBlockBrand ||
    (pathname.startsWith('/available-now/type/') && vehiclesWeArmorParam) ||
    (pathname === '/contact' && contactPageParams) ||
    isUrlBlocked(pathname, searchParams) ||
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

  // Redirect /media URLs to /all-downloads
  if (pathname.startsWith('/media')) {
    const url = request.nextUrl.clone();
    url.pathname = '/all-downloads';
    const response = NextResponse.redirect(url, { status: 301 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(stock|inventory|vehicles-we-armor|available-now|armored|blog|media)/:path*',
    '/contact',
  ],
};
