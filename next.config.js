// const fetchRedirects = require('./redirects');

module.exports = {
  reactStrictMode: true,
  // outputStrictMode: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // async redirects() {
  //   return await fetchRedirects();
  // },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/sobre-nosotros',
        destination: '/about-us',
      },
      {
        source: '/disponible-ahora',
        destination: '/available-now',
      },
    ];
  },
  sassOptions: {
    logger: {
      warn: (message) => {
        // Ignore specific deprecation warnings
        if (message.includes('Deprecation') || message.includes('deprecat')) {
          return;
        }
        // console.warn(message);
      },
    },
    quietDeps: true, // Suppress dependency deprecation warnings
    prependData: `@use './styles/_mixins.scss' as *;`,
  },

  images: {
    // unoptimized: true,
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920, 2200],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'https://alpinetesting.cloudflex-ha.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'd102sycao8uwt8.cloudfront.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'alpine-backend-992382787275.s3.us-east-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '**',
      },
    ],
  },
  experimental: {
    largePageDataBytes: 800 * 1000,
  },
  productionBrowserSourceMaps: true,
};
