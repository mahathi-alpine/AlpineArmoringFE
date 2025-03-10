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
    pattern: '/sold-vehicles',
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

// Safe decoding function that won't throw on invalid URLs
function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    console.error('Error decoding URI component:', str);
    return str;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle special case for path segments embedded in query parameters
  if (
    (pathname === '/vehicles-we-armor' ||
      pathname.startsWith('/available-now/type/')) &&
    searchParams.has('make')
  ) {
    const makeValue = searchParams.get('make') || '';

    // Check if the make parameter contains an encoded path segment with /type/
    if (makeValue.includes('%2Ftype%2F') || makeValue.includes('/type/')) {
      try {
        // Extract the actual make value (everything before /type/)
        let actualMake = '';
        let typePath = '';

        if (makeValue.includes('%2Ftype%2F')) {
          // Handle encoded path
          const parts = makeValue.split('%2Ftype%2F');
          actualMake = parts[0];
          typePath = parts[1];

          // Remove any trailing query parameters
          if (typePath.includes('%3F')) {
            typePath = typePath.split('%3F')[0];
          }
        } else if (makeValue.includes('/type/')) {
          // Handle unencoded path
          const parts = makeValue.split('/type/');
          actualMake = parts[0];
          typePath = parts[1];

          // Remove any trailing query parameters
          if (typePath.includes('?')) {
            typePath = typePath.split('?')[0];
          }
        }

        // Determine the base path
        let basePath = '';
        if (pathname === '/vehicles-we-armor') {
          basePath = '/vehicles-we-armor/type/';
        } else {
          // Handle the case where we're already in /available-now/type/
          basePath = '/vehicles-we-armor/type/';
        }

        if (actualMake && typePath) {
          // Create the redirect URL with the extracted information
          const url = request.nextUrl.clone();
          url.pathname = `${basePath}${typePath}`;
          url.search = `?make=${actualMake}`;

          const response = NextResponse.redirect(url, { status: 308 });
          response.headers.set('X-Robots-Tag', 'noindex, nofollow');
          return response;
        }
      } catch (error) {
        console.error('Error processing URL:', error);
      }
    }
  }

  // Normalize the search params by replacing + with %20
  const normalizedSearch = searchParams.toString().replace(/\+/g, '%20');

  // Create the full path with normalized search
  const fullPath = normalizedSearch
    ? `${pathname}?${normalizedSearch}`
    : pathname;

  // Check redirects
  let redirectTo = redirectMap.get(fullPath);

  if (!redirectTo) {
    const decodedPath = pathname;
    const decodedSearch = safeDecodeURIComponent(normalizedSearch);
    const decodedFullPath = decodedSearch
      ? `${decodedPath}?${decodedSearch}`
      : decodedPath;

    redirectTo = redirectMap.get(decodedFullPath);

    // Handle parentheses encoding differences
    if (
      !redirectTo &&
      (normalizedSearch.includes('%28') || normalizedSearch.includes('%29'))
    ) {
      for (const [key, value] of redirectMap.entries()) {
        // Skip keys that don't match the path or don't include parentheses
        if (
          !key.startsWith(pathname) ||
          (!key.includes('(') && !key.includes(')'))
        ) {
          continue;
        }

        // Normalize the redirect key by encoding parentheses
        const normalizedKey = key.replace(/\(/g, '%28').replace(/\)/g, '%29');

        // Check if our normalized path matches the normalized key
        if (fullPath === normalizedKey) {
          redirectTo = value;
          break;
        }
      }
    }
  }

  const locale = request.nextUrl.locale || '';

  if (locale === 'es') {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

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
    searchParams.has('q') ||
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
