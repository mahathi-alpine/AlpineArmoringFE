import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const blockedPatterns = [
  {
    pattern: '/vehicles-we-armor/type/armored-suvs',
    queryParams: {
      make: [
        'boxer',
        'bulldog',
        'condor',
        'cuda',
        'cyclone',
        'honda',
        'international',
        'mastiff',
        'omicron',
        'pit-bull',
        'pointer',
        'typhoon',
      ],
    },
  },
  {
    pattern: '/vehicles-we-armor/type/armored-sedans',
    queryParams: {
      make: [
        'boxer',
        'bulldog',
        'cadillac',
        'chevrolet',
        'condor',
        'cuda',
        'cyclone',
        'ford',
        'gmc',
        'honda',
        'hummer',
        'ineos',
        'infiniti',
        'international',
        'jeep',
        'lamborghini',
        'land-rover',
        'lincoln',
        'mastiff',
        'nissan',
        'omicron',
        'pit-bull',
        'pointer',
        'range-rover',
        'rivian',
        'typhoon',
        'volkswagen',
      ],
    },
  },
  {
    pattern: '/vehicles-we-armor/type/armored-pickup-trucks',
    queryParams: {
      make: [
        'audi',
        'bentley',
        'bmw',
        'boxer',
        'bulldog',
        'cadillac',
        'condor',
        'cuda',
        'genesis',
        'honda',
        'ineos',
        'infiniti',
        'international',
        'jeep',
        'lamborghini',
        'land-rover',
        'lexus',
        'lincoln',
        'maybach',
        'mercedes benz',
        'omicron',
        'pointer',
        'range-rover',
        'rolls-royce',
        'volkswagen',
      ],
    },
  },
  {
    pattern: '/vehicles-we-armor/type/armored-law-enforcement',
    queryParams: {
      make: [
        'audi',
        'bentley',
        'bmw',
        'cadillac',
        'chevrolet',
        'condor',
        'genesis',
        'gmc',
        'honda',
        'hummer',
        'ineos',
        'infiniti',
        'international',
        'jeep',
        'lamborghini',
        'land-rover',
        'lexus',
        'lincoln',
        'maybach',
        'nissan',
        'range-rover',
        'rivian',
        'rolls-royce',
        'tesla',
        'toyota',
        'volkswagen',
      ],
    },
  },
  {
    pattern: '/vehicles-we-armor/type/armored-cash-in-transit-cit',
    queryParams: {
      make: [
        'audi',
        'bentley',
        'bmw',
        'boxer',
        'bulldog',
        'cadillac',
        'condor',
        'cuda',
        'cyclone',
        'genesis',
        'honda',
        'hummer',
        'ineos',
        'infiniti',
        'jeep',
        'lamborghini',
        'land-rover',
        'lexus',
        'lincoln',
        'mastiff',
        'maybach',
        'mercedes benz',
        'nissan',
        'omicron',
        'pit-bull',
        'pointer',
        'range-rover',
        'rivian',
        'rolls-royce',
        'tesla',
        'toyota',
        'typhoon',
        'volkswagen',
      ],
    },
  },
  {
    pattern: '/vehicles-we-armor/type/armored-specialty-vehicles',
    queryParams: {
      make: [
        'audi',
        'bentley',
        'bmw',
        'boxer',
        'bulldog',
        'cadillac',
        'chevrolet',
        'cyclone',
        'genesis',
        'gmc',
        'honda',
        'hummer',
        'ineos',
        'infiniti',
        'international',
        'jeep',
        'lamborghini',
        'land-rover',
        'lexus',
        'lincoln',
        'maybach',
        'mercedes benz',
        'nissan',
        'range-rover',
        'rivian',
        'rolls-royce',
        'tesla',
        'typhoon',
        'volkswagen',
      ],
    },
  },
  {
    pattern: '/vehicles-we-armor/type/vans-and-buses',
    queryParams: {
      make: [
        'audi',
        'bentley',
        'bmw',
        'boxer',
        'bulldog',
        'cadillac',
        'condor',
        'cuda',
        'cyclone',
        'genesis',
        'hummer',
        'ineos',
        'infiniti',
        'international',
        'jeep',
        'lamborghini',
        'land-rover',
        'lexus',
        'lincoln',
        'mastiff',
        'maybach',
        'nissan',
        'omicron',
        'pit-bull',
        'range-rover',
        'rivian',
        'rolls-royce',
        'tesla',
        'typhoon',
        'volkswagen',
      ],
    },
  },

  // Static URL patterns (exact matches)
  {
    pattern: '/vehicles-we-armor/150-CIT-International-Navistar-4300-',
    exact: true,
  },
  {
    pattern: '/armored/Lexus/LX570.php',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/131-SUV-Chevrolet-Suburban-',
    exact: true,
  },
  {
    pattern:
      '/vehicles-we-armor/140-Sedan-Mercedes-Benz-S-Class-Right-Hand-Drive',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/267-Pickup Truck-Ford-F-150',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/267-Pickup Truck-Ford-F-150-',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/42-Sedan-Mercedes-Benz-S500',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/54-Sedan-Toyota-Camry',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/179-Police Car-Ford-Taurus-',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/345-SUV-Toyota-Sequoia-Hybrid',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/345-SUV-Toyota-Sequoia-Hybrid-',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/136-SWAT-Pit-Bull-XL®',
    exact: true,
  },
  {
    pattern: '/armored/BMW/X5.php',
    exact: true,
  },
  {
    pattern: '/armored/Audi/q7.php',
    exact: true,
  },
  {
    pattern: '/vehicles-we-armor/179-Police Pursuit Vehicles',
    exact: true,
  },
  {
    pattern: '/available-now/type/armored-cash-in-transit-cit',
    exact: true,
  },
];

const isBlockedUrl = (url: string) => {
  const urlObj = new URL(url, 'http://dummy.com');

  return blockedPatterns.some((pattern) => {
    // Handle exact match patterns
    if (typeof pattern === 'string' || pattern.exact) {
      const patternPath =
        typeof pattern === 'string' ? pattern : pattern.pattern;
      return (
        urlObj.pathname === patternPath ||
        (!pattern.exact && urlObj.pathname.startsWith(patternPath + '/'))
      );
    }

    // Handle patterns with query parameters
    const pathRegex = new RegExp(
      `^${pattern.pattern.replace(/:[\w]+/g, '[^/]+')}(?:/.*)?$`
    );

    if (!pathRegex.test(urlObj.pathname)) {
      return false;
    }

    // If pattern has queryParams, check them
    if (pattern.queryParams) {
      return Object.entries(pattern.queryParams).some(
        ([param, allowedValues]) => {
          const urlParam = urlObj.searchParams.get(param);
          return urlParam && (allowedValues as string[]).includes(urlParam);
        }
      );
    }

    return true;
  });
};

export function middleware(request: NextRequest) {
  const blockedParams = [
    'vehicles_we_armor',
    'brand',
    'name',
    'id',
    'names',
    'source',
  ];

  const hasBlockedParam = blockedParams.some((param) =>
    request.nextUrl.searchParams.has(param)
  );

  const isUrlBlocked = isBlockedUrl(request.nextUrl.toString());

  if (
    request.nextUrl.pathname.startsWith('/stock') ||
    request.nextUrl.pathname.startsWith('/inventory') ||
    hasBlockedParam ||
    isUrlBlocked ||
    request.nextUrl.pathname.includes('media/documents/') ||
    request.nextUrl.searchParams.get('make') === 'chrysler'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
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
