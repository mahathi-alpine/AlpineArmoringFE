import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const blockedParams = ['vehicles_we_armor', 'brand', 'name', 'id', 'names'];
  const blockedUrls = [
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
    '/vehicles-we-armor/type/armored-suvs?make=boxer',
    '/vehicles-we-armor/type/armored-suvs?make=bulldog',
    '/vehicles-we-armor/type/armored-suvs?make=cuda',
    '/vehicles-we-armor/type/armored-suvs?make=cyclone',
    '/vehicles-we-armor/type/armored-suvs?make=international',
    '/vehicles-we-armor/type/armored-suvs?make=mastiff',
    '/vehicles-we-armor/type/armored-suvs?make=pit-bull',
    '/vehicles-we-armor/type/armored-suvs?make=pointer',
    '/vehicles-we-armor/type/armored-suvs?make=typhoon',
    '/vehicles-we-armor/type/armored-sedans?make=boxer',
    '/vehicles-we-armor/type/armored-sedans?make=bulldog',
    '/vehicles-we-armor/type/armored-sedans?make=cadillac',
    '/vehicles-we-armor/type/armored-sedans?make=chevrolet',
    '/vehicles-we-armor/type/armored-sedans?make=condor',
    '/vehicles-we-armor/type/armored-sedans?make=cuda',
    '/vehicles-we-armor/type/armored-sedans?make=cyclone',
    '/vehicles-we-armor/type/armored-sedans?make=ford',
    '/vehicles-we-armor/type/armored-sedans?make=gmc',
    '/vehicles-we-armor/type/armored-sedans?make=honda',
    '/vehicles-we-armor/type/armored-sedans?make=hummer',
    '/vehicles-we-armor/type/armored-sedans?make=ineos',
    '/vehicles-we-armor/type/armored-sedans?make=infiniti',
    '/vehicles-we-armor/type/armored-sedans?make=international',
    '/vehicles-we-armor/type/armored-sedans?make=jeep',
    '/vehicles-we-armor/type/armored-sedans?make=land-rover',
    '/vehicles-we-armor/type/armored-sedans?make=lincoln',
    '/vehicles-we-armor/type/armored-sedans?make=mastiff',
    '/vehicles-we-armor/type/armored-sedans?make=nissan',
    '/vehicles-we-armor/type/armored-sedans?make=omicron',
    '/vehicles-we-armor/type/armored-sedans?make=pit-bull',
    '/vehicles-we-armor/type/armored-sedans?make=pointer',
    '/vehicles-we-armor/type/armored-sedans?make=range-rover',
    '/vehicles-we-armor/type/armored-sedans?make=rivian',
    '/vehicles-we-armor/type/armored-sedans?make=typhoon',
    '/vehicles-we-armor/type/armored-sedans?make=volkswagen',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=audi',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=bentley',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=bmw',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=boxer',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=bulldog',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=cadillac',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=cuda',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=genesis',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=honda',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=ineos',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=infiniti',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=international',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=jeep',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=land-rover',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=lexus',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=lincoln',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=mercedes-benz',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=omicron',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=pointer',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=range-rover',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=rivian',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=rolls-royce',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=tesla',
    '/vehicles-we-armor/type/armored-pickup-trucks?make=volkswagen',
    '/vehicles-we-armor/type/armored-law-enforcement?make=audi',
    '/vehicles-we-armor/type/armored-law-enforcement?make=bentley',
    '/vehicles-we-armor/type/armored-law-enforcement?make=bmw',
    '/vehicles-we-armor/type/armored-law-enforcement?make=cadillac',
    '/vehicles-we-armor/type/armored-law-enforcement?make=chevrolet',
    '/vehicles-we-armor/type/armored-law-enforcement?make=condor',
    '/vehicles-we-armor/type/armored-law-enforcement?make=genesis',
    '/vehicles-we-armor/type/armored-law-enforcement?make=gmc',
    '/vehicles-we-armor/type/armored-law-enforcement?make=honda',
    '/vehicles-we-armor/type/armored-law-enforcement?make=hummer',
    '/vehicles-we-armor/type/armored-law-enforcement?make=ineos',
    '/vehicles-we-armor/type/armored-law-enforcement?make=infiniti',
    '/vehicles-we-armor/type/armored-law-enforcement?make=international',
    '/vehicles-we-armor/type/armored-law-enforcement?make=jeep',
    '/vehicles-we-armor/type/armored-law-enforcement?make=land-rover',
    '/vehicles-we-armor/type/armored-law-enforcement?make=lexus',
    '/vehicles-we-armor/type/armored-law-enforcement?make=lincoln',
    '/vehicles-we-armor/type/armored-law-enforcement?make=nissan',
    '/vehicles-we-armor/type/armored-law-enforcement?make=range-rover',
    '/vehicles-we-armor/type/armored-law-enforcement?make=rivian',
    '/vehicles-we-armor/type/armored-law-enforcement?make=rolls-royce',
    '/vehicles-we-armor/type/armored-law-enforcement?make=tesla',
    '/vehicles-we-armor/type/armored-law-enforcement?make=volkswagen',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=audi',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=bentley',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=bmw',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=boxer',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=bulldog',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=cadillac',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=chevrolet',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=condor',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=cuda',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=cyclone',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=genesis',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=honda',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=hummer',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=ineos',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=infiniti',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=jeep',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=land-rover',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=lexus',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=lincoln',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=mastiff',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=mercedes-benz',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=nissan',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=omicron',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=pit-bull',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=pointer',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=range-rover',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=rivian',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=rolls-royce',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=tesla',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=toyota',
    '/vehicles-we-armor/type/armored-cash-in-transit-cit?make=typhoon',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=audi',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=bentley',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=bmw',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=cadillac',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=genesis',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=gmc',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=honda',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=hummer',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=ineos',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=infiniti',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=international',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=jeep',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=land-rover',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=lexus',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=lincoln',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=mercedes-benz',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=range-rover',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=rivian',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=rolls-royce',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=tesla',
    '/vehicles-we-armor/type/armored-specialty-vehicles?make=volkswagen',
    '/vehicles-we-armor/type/vans-and-buses?make=audi',
    '/vehicles-we-armor/type/vans-and-buses?make=bentley',
    '/vehicles-we-armor/type/vans-and-buses?make=bmw',
    '/vehicles-we-armor/type/vans-and-buses?make=boxer',
    '/vehicles-we-armor/type/vans-and-buses?make=bulldog',
    '/vehicles-we-armor/type/vans-and-buses?make=cadillac',
    '/vehicles-we-armor/type/vans-and-buses?make=chevrolet',
    '/vehicles-we-armor/type/vans-and-buses?make=condor',
    '/vehicles-we-armor/type/vans-and-buses?make=cuda',
    '/vehicles-we-armor/type/vans-and-buses?make=cyclone',
    '/vehicles-we-armor/type/vans-and-buses?make=ford',
    '/vehicles-we-armor/type/vans-and-buses?make=genesis',
    '/vehicles-we-armor/type/vans-and-buses?make=hummer',
    '/vehicles-we-armor/type/vans-and-buses?make=ineos',
    '/vehicles-we-armor/type/vans-and-buses?make=infiniti',
    '/vehicles-we-armor/type/vans-and-buses?make=international',
    '/vehicles-we-armor/type/vans-and-buses?make=jeep',
    '/vehicles-we-armor/type/vans-and-buses?make=land-rover',
    '/vehicles-we-armor/type/vans-and-buses?make=lexus',
    '/vehicles-we-armor/type/vans-and-buses?make=lincoln',
    '/vehicles-we-armor/type/vans-and-buses?make=mastiff',
    '/vehicles-we-armor/type/vans-and-buses?make=nissan',
    '/vehicles-we-armor/type/vans-and-buses?make=omicron',
    '/vehicles-we-armor/type/vans-and-buses?make=pit-bull',
    '/vehicles-we-armor/type/vans-and-buses?make=range-rover',
    '/vehicles-we-armor/type/vans-and-buses?make=rivian',
    '/vehicles-we-armor/type/vans-and-buses?make=rolls-royce',
    '/vehicles-we-armor/type/vans-and-buses?make=tesla',
    '/vehicles-we-armor/type/vans-and-buses?make=typhoon',
    '/vehicles-we-armor/type/vans-and-buses?make=volkswagen',
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
