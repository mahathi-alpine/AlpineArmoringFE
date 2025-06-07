const routes = require('./routes');

module.exports = {
  reactStrictMode: true,
  trailingSlash: false,
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
    imageSizes: [],
    formats: ['image/webp', 'image/avif'],
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
    // staleTimes: {
    //   dynamic: 30,
    //   static: 180,
    // },
  },
  // poweredByHeader: false,
  // compress: true,
  // swcMinify: true,
  // bundlePagesRouterDependencies: true,
  // serverExternalPackages: ['pdfjs-dist'],
  // productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://alpinetesting.cloudflex-ha.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};
