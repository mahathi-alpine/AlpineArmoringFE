import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { redirectUrls } from './redirectUrls';
import routes from './routes';

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

// Safe decoding function that won't throw on invalid URLs
function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    console.error('Error decoding URI component:', str);
    return str;
  }
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  // Remove any protocol and domain part if present
  return url.replace(/^(https?:\/\/)?(www\.)?alpineco\.com/i, '');
}

// Function to check if a locale/path combination is valid and get the correct path if needed
function validateLocalePath(
  locale: string,
  pathname: string
): { isValid: boolean; correctPath?: string } {
  pathname = normalizeUrl(pathname);

  // Skip check for default locale (en)
  if (locale === 'en') return { isValid: true };

  // For mixed paths like /es/vehicles-we-armor/tipo/suvs-blindados
  const pathSegments = pathname.split('/').filter((segment) => segment);
  let hasInvalidSegment = false;
  let correctPathSegments: string[] = [];
  let matchedRouteConfig = null;

  // First, check if the first path segment matches any English routes
  for (const [, routeConfig] of Object.entries(routes)) {
    const englishPath = routeConfig.paths['en'].replace(/^\//, ''); // Remove leading slash
    const localizedPath = routeConfig.paths[locale].replace(/^\//, ''); // Remove leading slash

    // If the first segment matches an English path but we're in a non-English locale
    if (pathSegments[0] === englishPath && englishPath !== localizedPath) {
      hasInvalidSegment = true;
      correctPathSegments.push(localizedPath);
      matchedRouteConfig = routeConfig;
      break;
    }
  }

  // If we found a route with an English path in a non-English locale
  if (hasInvalidSegment && matchedRouteConfig) {
    // Process the rest of the path for the special cases (type paths)
    if (
      pathSegments.length > 1 &&
      matchedRouteConfig.typePath &&
      matchedRouteConfig.types
    ) {
      const englishTypePath = matchedRouteConfig.typePath['en'];
      const localizedTypePath = matchedRouteConfig.typePath[locale];

      // If the second segment matches the English type path
      if (
        pathSegments[1] === englishTypePath &&
        englishTypePath !== localizedTypePath
      ) {
        correctPathSegments.push(localizedTypePath);

        // Add the remaining segments (the type value and anything after)
        if (pathSegments.length > 2) {
          // For the type value, check if we need to translate it
          const typeSlug = pathSegments[2];
          let localizedTypeSlug = typeSlug;

          // Try to find a matching type and get its localized version
          for (const [, typeValues] of Object.entries(
            matchedRouteConfig.types
          )) {
            if (typeValues['en'] === typeSlug) {
              localizedTypeSlug = typeValues[locale] || typeSlug;
              break;
            }
          }

          correctPathSegments.push(localizedTypeSlug);

          // Add any remaining segments
          if (pathSegments.length > 3) {
            correctPathSegments = [
              ...correctPathSegments,
              ...pathSegments.slice(3),
            ];
          }
        }
      } else {
        // Just add the remaining segments as is
        correctPathSegments = [
          ...correctPathSegments,
          ...pathSegments.slice(1),
        ];
      }
    } else {
      // Just add the remaining segments as is
      correctPathSegments = [...correctPathSegments, ...pathSegments.slice(1)];
    }

    return {
      isValid: false,
      correctPath: '/' + correctPathSegments.join('/'),
    };
  }

  return { isValid: true };
}

// Function to check and correct 'suv-blindados' to 'suvs-blindados' in URLs
function correctSuvBlindadosPath(pathname: string): string | null {
  if (pathname.includes('/suv-blindados')) {
    return pathname.replace('/suv-blindados', '/suvs-blindados');
  }
  return null;
}

export function middleware(request: NextRequest) {
  console.log(`Middleware processing URL: ${request.nextUrl.pathname}`);
  const url = request.nextUrl.clone();

  const lowerPathname = request.nextUrl.pathname.toLowerCase();
  const hasDuplicateDomain =
    lowerPathname.includes('www.alpineco.com/www.alpineco.com') ||
    lowerPathname.includes('alpineco.com/alpineco.com') ||
    lowerPathname.includes('www.alpineco.com/alpineco.com') ||
    lowerPathname.includes('alpineco.com/www.alpineco.com') ||
    lowerPathname.match(/^\/www\.alpineco\.com/) ||
    lowerPathname.match(/^\/alpineco\.com/);

  if (hasDuplicateDomain) {
    // Ensure we correctly remove the duplicate domain
    const correctedPath = request.nextUrl.pathname
      .replace(/^(\/)(www\.alpineco\.com|alpineco\.com)(\/.*)$/i, '$1$3')
      .replace(/\/{2,}/g, '/'); // Also clean up any double slashes

    const url = request.nextUrl.clone();
    url.pathname = correctedPath;

    console.log(
      `Redirecting duplicated domain URL: ${request.nextUrl.pathname} → ${correctedPath}`
    );

    const response = NextResponse.redirect(url, { status: 301 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  url.pathname = normalizeUrl(url.pathname);

  const { pathname, searchParams } = url;

  const locale = request.nextUrl.locale || 'en';

  // Check for and correct 'suv-blindados' to 'suvs-blindados' in URLs
  const correctedSuvPath = correctSuvBlindadosPath(pathname);
  if (correctedSuvPath) {
    const url = request.nextUrl.clone();
    url.pathname = correctedSuvPath;
    const response = NextResponse.redirect(url, { status: 307 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // Check for invalid locale/path combinations and get correct path if needed
  const { isValid, correctPath } = validateLocalePath(locale, pathname);

  if (!isValid) {
    // If we have a correct path, redirect to it
    if (correctPath) {
      const url = request.nextUrl.clone();
      url.pathname = correctPath;
      // Keep the same locale since we're redirecting to the proper localized path

      const response = NextResponse.redirect(url, { status: 307 });
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return response;
    }

    // Fallback: redirect to English version if we don't have a correct path
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.locale = 'en';

    const response = NextResponse.redirect(url, { status: 307 });
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

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
  let redirectTo = redirectMap.get(
    normalizedSearch ? `${pathname}?${searchParams.toString()}` : pathname
  );

  if (!redirectTo) {
    redirectTo = redirectMap.get(
      normalizedSearch ? `${pathname}?${normalizedSearch}` : pathname
    );
  }

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

  // const locale = request.nextUrl.locale || '';

  // if (locale === 'es') {
  //   const response = NextResponse.next();
  //   response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  //   return response;
  // }

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
    searchParams.has('nextInternalLocale');

  const contactPageParams = ['name', 'id', 'names'].some((param) =>
    searchParams.has(param)
  );

  const hasChryslerMake = searchParams.get('make') === 'chrysler';

  if (
    pathname.startsWith('/inventory') ||
    pathname.startsWith('/vehicles-we-armor/inventory') ||
    vehiclesWeArmorParam ||
    searchParams.has('type') ||
    searchParams.has('q') ||
    searchParams.has('brand') ||
    (pathname === '/contact' && contactPageParams) ||
    isUrlBlocked(pathname, searchParams) ||
    nxtParam ||
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
    '/www.alpineco.com/:path*',
  ],
};
