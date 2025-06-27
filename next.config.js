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
      .filter((route) => !route.usesStaticProps)
      .map((route) => route.getRewrites())
      .flat();

    return [...hardcodedRewrites, ...routeRewrites];
  },

  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },

  sassOptions: {
    logger: {
      warn: (message) => {
        if (message.includes('Deprecation') || message.includes('deprecat')) {
          return;
        }
      },
    },
    quietDeps: true,
    prependData: `@use './styles/_mixins.scss' as *;`,
  },

  images: {
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for images
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
  },

  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      // Cache all static files with common extensions
      {
        source: '/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico|mp4|webm|mov)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      // Cache CSS and JS files
      {
        source: '/:path*\\.(css|js|woff|woff2|ttf|otf)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      // Cache _next/static files (Next.js built assets)
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year
          },
        ],
      },
      // Shorter cache for HTML pages
      {
        source: '/:path*\\.(html)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate', // 1 hour
          },
        ],
      },
      // Your existing CORS headers for API routes
      {
        source: '/api/:path*',
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
