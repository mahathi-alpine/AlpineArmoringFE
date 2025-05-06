const routes = require('./routes');

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    const hardcodedRewrites = [
      {
        source: '/medios/ferias-comerciales',
        destination: '/media/trade-shows',
      },
    ];

    const routeRewrites = Object.values(routes)
      .map((route) => route.getRewrites())
      .flat();

    return [...hardcodedRewrites, ...routeRewrites];
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  // outputStrictMode: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // async redirects() {
  //   return await fetchRedirects();
  // },
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
    contentDispositionType: 'inline',
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  poweredByHeader: false,
  compress: true,
  swcMinify: true,
  bundlePagesRouterDependencies: true,
  serverExternalPackages: ['pdfjs-dist'],
  productionBrowserSourceMaps: true,
};
