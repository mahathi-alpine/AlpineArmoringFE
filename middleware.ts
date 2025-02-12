import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redirectUrls } from './redirectUrls';

const redirectMap = new Map(redirectUrls);

type BlockedPattern = {
  pattern: string;
  exact?: boolean;
  queryParams?: {
    [key: string]: string[];
  };
};

const blockedPatterns: BlockedPattern[] = [
  {
    pattern: '/contact?source=become-a-dealer',
    exact: true,
  },
  {
    pattern:
      '/news/understanding-armor-levels-in-vehicles-nij-cen-and-vpam-standards-explained',
    exact: true,
  },
  {
    pattern: '/news/top-security-measures',
    exact: true,
  },
  {
    pattern: '/news/armored-vehicles-3-steps-to-help-you-find-the-right-one',
    exact: true,
  },
  {
    pattern: '/news/what-you-should-know-about-armored-cars',
    exact: true,
  },
  {
    pattern: '/news/3-reasons-to-consider-purchasing-an-armored-vehicle',
    exact: true,
  },
  {
    pattern:
      '/blog/armored-tesla-model-s-withstands-live-fire-ballistic-testing',
    exact: true,
  },
  {
    pattern: '/blog/armored-rolls-royce-cullinan',
    exact: true,
  },
  {
    pattern: '/blog/alpine-armoring-mastiff-featured-on-hot-cars-com',
    exact: true,
  },
  {
    pattern: '/blog/alpine-armoring-amg-armored-mercedes-benz-G63-suv',
    exact: true,
  },
  {
    pattern: '/blog/introducing-mastiff',
    exact: true,
  },
  {
    pattern: '/blog/alpine-ceo-featured-in-cbs-money-watch-article',
    exact: true,
  },
  {
    pattern: '/blog/richmond-police-department-unveils-pit-bull-vx',
    exact: true,
  },
  {
    pattern: '/blog/we-shot-our-bulletproof-tesla-here-s-what-happened',
    exact: true,
  },
  {
    pattern: '/blog/alpine-armoring-featured-on-the-drive-com',
    exact: true,
  },
  {
    pattern: '/blog/what-makes-an-armored-car-more-secure-than-other-cars',
    exact: true,
  },
  {
    pattern: '/blog/alpine-armorings-featured-vehicle-pit-bull',
    exact: true,
  },
  {
    pattern: '/blog/alpine-armoring-featured-in-motortrend',
    exact: true,
  },
  {
    pattern: '/blog/alpine-armoring-deatured-in-car-and-driver-magazine',
    exact: true,
  },
  {
    pattern: '/blog/alpine-pit-bull-featured-in-car-and-driver',
    exact: true,
  },
  {
    pattern: '/blog/alpine-featured-on-hot-cars-com',
    exact: true,
  },
  {
    pattern: '/blog/alpine-donates-pit-bull-vx-to-tunisia',
    exact: true,
  },
];

const isUrlBlocked = (
  pathname: string,
  searchParams: URLSearchParams
): boolean => {
  return blockedPatterns.some(({ pattern, exact, queryParams }) => {
    if (exact) {
      const fullUrl = searchParams.toString()
        ? `${pathname}?${searchParams.toString()}`
        : pathname;
      return fullUrl === pattern;
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
  const locale = request.nextUrl.locale || '';

  if (locale === 'es') {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Create a key that includes both pathname and query string for matching
  const fullPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  // Check redirects first
  const redirectTo = redirectMap.get(fullPath);
  if (redirectTo) {
    const url = request.nextUrl.clone();

    // Handle the redirect URL properly by parsing it
    if (redirectTo.includes('?')) {
      const [newPathname, newSearch] = redirectTo.split('?');
      url.pathname = newPathname;
      url.search = `?${newSearch}`;
    } else {
      url.pathname = redirectTo;
      url.search = '';
    }

    const response = NextResponse.redirect(url, { status: 308 });
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
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/vehicles-we-armor/inventory') ||
    shouldBlockBrand ||
    searchParams.has('type') ||
    (pathname.startsWith('/available-now/type/') && vehiclesWeArmorParam) ||
    (pathname === '/contact' && contactPageParams) ||
    isUrlBlocked(pathname, searchParams) ||
    hasChryslerMake
  ) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Redirect /stock URLs to /available-now
  if (pathname.startsWith('/stock')) {
    const url = request.nextUrl.clone();
    url.pathname = '/available-now';
    const response = NextResponse.redirect(url, { status: 308 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Redirect /media URLs to /all-downloads
  if (
    pathname.startsWith('/media/ballistic-chart/') ||
    pathname.startsWith('/media/documents/') ||
    pathname.startsWith('/news/clients/')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/all-downloads';
    const response = NextResponse.redirect(url, { status: 308 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // '/(stock|inventory|vehicles-we-armor|available-now|armored|blog|media)/:path*',
    // '/contact',
    '/((?!_next/static|_next/image|favicon.ico|api|sitemap|robots|manifest|sw.js).*)',
  ],
};
