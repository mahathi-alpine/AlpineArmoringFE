import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const blockedParams = ['vehicles_we_armor', 'brand', 'name', 'id', 'names'];
  const blockedUrls = [
    '/vehicles-we-armor/type/vans-and-buses?make=chrysler',
    '/vehicles-we-armor/type/vans-and-buses?make=genesis',
    '/vehicles-we-armor/type/vans-and-buses?make=mastiff',
    '/vehicles-we-armor/type/armored-sedans?make=lincoln',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=jeep',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=bentley',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=gmc',
    '/vehicles-we-armor/150-CIT-International-Navistar-4300-',
    '/armored/Lexus/LX570.php',
    '/vehicles-we-armor/131-SUV-Chevrolet-Suburban-',
    '/vehicles-we-armor/140-Sedan-Mercedes-Benz-S-Class-Right-Hand-Drive',
    '/vehicles-we-armor/267-Pickup Truck-Ford-F-150',
    '/vehicles-we-armor/267-Pickup Truck-Ford-F-150-',
    '/vehicles-we-armor/42-Sedan-Mercedes-Benz-S500',
    '/vehicles-we-armor/54-Sedan-Toyota-Camry',
    '/vehicles-we-armor/179-Police Car-Ford-Taurus-',
    '/vehicles-we-armor/345-SUV-Toyota-Sequoia-Hybrid',
    '/vehicles-we-armor/345-SUV-Toyota-Sequoia-Hybrid-',
    '/vehicles-we-armor/136-SWAT-Pit-Bull-XL®',
    '/armored/BMW/X5.php',
    '/armored/Audi/q7.php',
    '/vehicles-we-armor/179-Police Pursuit Vehicles',
  ];

  const hasBlockedParam = blockedParams.some((param) =>
    request.nextUrl.searchParams.has(param)
  );

  // Check if the current URL matches any of the blocked URLs
  const isBlockedUrl = blockedUrls.some((url) => {
    return (
      request.nextUrl.pathname === url ||
      request.nextUrl.pathname.startsWith(url + '/') ||
      (url.includes('?') &&
        (() => {
          const [path, query] = url.split('?');
          if (request.nextUrl.pathname !== path) return false;
          const [param, value] = query.split('=');
          return request.nextUrl.searchParams.get(param) === value;
        })())
    );
  });

  // Check if URL contains media/documents/
  const isBlockedDocument =
    request.nextUrl.pathname.includes('media/documents/');

  if (
    request.nextUrl.pathname.startsWith('/stock') ||
    request.nextUrl.pathname.startsWith('/inventory') ||
    hasBlockedParam ||
    isBlockedUrl ||
    isBlockedDocument
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    const response = NextResponse.redirect(url, { status: 301 });

    // const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/stock/:path*',
    '/inventory/:path*',
    '/:path*',
    '/vehicles-we-armor/type/:path*',
    '/media/documents/:path*',
    '/armored/:path*',
  ],
};
