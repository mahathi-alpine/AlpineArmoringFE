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
    pattern: '/blog/alpine-armoring-featured-on-the-drive-com',
    exact: true,
  },
  {
    pattern: '/blog/alpine-featured-on-hot-cars-com',
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

function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    console.error('Error decoding URI component:', str);
    return str;
  }
}

// FIXED: Don't normalize URLs that might interfere with i18n
function normalizeUrl(url: string): string {
  if (!url) return '';
  // Only remove domain if it's actually in the path (not just the host)
  return url.replace(/^(https?:\/\/)?(www\.)?alpineco\.com/i, '');
}

// Function to check and correct 'suv-blindados' to 'suvs-blindados' in URLs
function correctSuvBlindadosPath(pathname: string): string | null {
  if (pathname.includes('/suv-blindados')) {
    return pathname.replace('/suv-blindados', '/suvs-blindados');
  }
  return null;
}

export function middleware(request: NextRequest) {
  // CRITICAL: Skip middleware for i18n routes that Next.js handles
  const { pathname, locale } = request.nextUrl;

  // Add noindex to all _next/image URLs to save crawl budget
  if (pathname.startsWith('/_next/image')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // FIXED: Don't interfere with Next.js internal routing
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const lowerPathname = pathname.toLowerCase();
  const hasDuplicateDomain =
    lowerPathname.includes('www.alpineco.com/www.alpineco.com') ||
    lowerPathname.includes('alpineco.com/alpineco.com') ||
    lowerPathname.includes('www.alpineco.com/alpineco.com') ||
    lowerPathname.includes('alpineco.com/www.alpineco.com') ||
    lowerPathname.match(/^\/www\.alpineco\.com/) ||
    lowerPathname.match(/^\/alpineco\.com/);

  if (hasDuplicateDomain) {
    const correctedPath = pathname
      .replace(/^(\/)(www\.alpineco\.com|alpineco\.com)(\/.*)$/i, '$1$3')
      .replace(/\/{2,}/g, '/');

    const url = request.nextUrl.clone();
    url.pathname = correctedPath;

    const response = NextResponse.redirect(url, { status: 301 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // FIXED: Get the clean pathname without interfering with locale
  const cleanPathname = normalizeUrl(pathname);
  const { searchParams } = request.nextUrl;

  // Redirect all /knowledge-base/[slug] URLs to /faqs/[slug]
  if (cleanPathname.startsWith('/knowledge-base/')) {
    const url = request.nextUrl.clone();
    url.pathname = cleanPathname.replace('/knowledge-base/', '/faqs/');

    const response = NextResponse.redirect(url, { status: 308 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Add noindex to /knowledge-base URLs (in case some still exist)
  if (cleanPathname.startsWith('/knowledge-base')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  if (cleanPathname === '/sitemap' || cleanPathname.endsWith('/sitemap')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, follow');
    return response;
  }

  // Check for and correct 'suv-blindados' to 'suvs-blindados' in URLs
  const correctedSuvPath = correctSuvBlindadosPath(cleanPathname);
  if (correctedSuvPath) {
    const url = request.nextUrl.clone();
    url.pathname = correctedSuvPath;
    const response = NextResponse.redirect(url, { status: 307 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Handle special case for path segments embedded in query parameters
  if (
    (cleanPathname === '/vehicles-we-armor' ||
      cleanPathname.startsWith('/available-now/type/')) &&
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
        if (cleanPathname === '/vehicles-we-armor') {
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

  // FIXED: Create paths for redirect lookup - use original pathname for locale detection
  const pathWithLocale =
    locale !== 'en' ? `/${locale}${cleanPathname}` : cleanPathname;
  const fullPathWithLocale = normalizedSearch
    ? `${pathWithLocale}?${normalizedSearch}`
    : pathWithLocale;

  let redirectTo = redirectMap.get(fullPathWithLocale);

  if (!redirectTo && searchParams.get('utm_source') === 'chatgpt.com') {
    redirectTo = redirectMap.get(pathWithLocale);

    if (!redirectTo && locale !== 'en') {
      redirectTo = redirectMap.get(cleanPathname);
    }

    if (redirectTo) {
      const url = request.nextUrl.clone();

      if (redirectTo.includes('?')) {
        const [newPathname, newSearch] = redirectTo.split('?');
        url.pathname = newPathname;
        url.search = `?${newSearch}&utm_source=chatgpt.com`;
      } else {
        url.pathname = redirectTo;
        url.search = '?utm_source=chatgpt.com';
      }

      const response = NextResponse.redirect(url, { status: 308 });
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }
  }

  if (!redirectTo) {
    const fullPathWithOriginalSearch = searchParams.toString()
      ? `${pathWithLocale}?${searchParams.toString()}`
      : pathWithLocale;
    redirectTo = redirectMap.get(fullPathWithOriginalSearch);
  }

  if (!redirectTo) {
    const decodedPathWithLocale = safeDecodeURIComponent(pathWithLocale);
    const decodedSearch = safeDecodeURIComponent(normalizedSearch);
    const decodedFullPath = decodedSearch
      ? `${decodedPathWithLocale}?${decodedSearch}`
      : decodedPathWithLocale;

    redirectTo = redirectMap.get(decodedFullPath);
  }

  // Handle parentheses encoding differences
  if (
    !redirectTo &&
    (normalizedSearch.includes('%28') || normalizedSearch.includes('%29'))
  ) {
    for (const [key, value] of redirectMap.entries()) {
      // Skip keys that don't match the path or don't include parentheses
      if (
        !key.startsWith(pathWithLocale) ||
        (!key.includes('(') && !key.includes(')'))
      ) {
        continue;
      }

      // Normalize the redirect key by encoding parentheses
      const normalizedKey = key.replace(/\(/g, '%28').replace(/\)/g, '%29');

      // Check if our normalized path matches the normalized key
      if (fullPathWithLocale === normalizedKey) {
        redirectTo = value;
        break;
      }
    }
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
  const vehiclesWeArmorParam =
    searchParams.has('vehicles_we_armor') ||
    searchParams.has('vehiculos_que_blindamos');

  const nxtParam =
    searchParams.has('nxtPslug') ||
    searchParams.has('nxtPtype') ||
    searchParams.has('type') ||
    searchParams.has('slug') ||
    searchParams.has('r') ||
    searchParams.has('app') ||
    searchParams.has('nextInternalLocale');

  const contactPageParams = ['name', 'id', 'names'].some((param) =>
    searchParams.has(param)
  );

  const hasChryslerMake = searchParams.get('make') === 'chrysler';

  if (
    cleanPathname.startsWith('/inventory') ||
    cleanPathname.startsWith('/vehicles-we-armor/inventory') ||
    vehiclesWeArmorParam ||
    searchParams.has('type') ||
    searchParams.has('q') ||
    searchParams.has('brand') ||
    (cleanPathname === '/contact' && contactPageParams) ||
    isUrlBlocked(cleanPathname, searchParams) ||
    nxtParam ||
    hasChryslerMake
  ) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Redirect /stock URLs to /available-now
  if (cleanPathname.startsWith('/stock')) {
    const url = request.nextUrl.clone();
    url.pathname = '/available-now';
    const response = NextResponse.redirect(url, { status: 308 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Redirect /media URLs to /all-downloads
  if (
    cleanPathname.startsWith('/media/ballistic-chart/') ||
    cleanPathname.startsWith('/media/documents/') ||
    cleanPathname.startsWith('/media/img/') ||
    cleanPathname.startsWith('/news/clients/') ||
    cleanPathname.startsWith('/images/')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/all-downloads';
    const response = NextResponse.redirect(url, { status: 308 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // FIXED: Always return NextResponse.next() at the end to allow Next.js to handle i18n
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sitemap',
    '/((?!_next/static|_next/image|favicon.ico|api|sitemap.xml|robots|manifest|sw.js).*)',
    '/www.alpineco.com/:path*',
  ],
};
