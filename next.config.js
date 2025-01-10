// const redirects = require('./redirects');

module.exports = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
        {
          source: '/assets/:path*',
          destination: '/assets/:path*',
        },
      ],
    };
  },
  sassOptions: {
    prependData: `@import './styles/_mixins.scss';`,
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
  trailingSlash: false,
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 800 * 1000,
  },
  productionBrowserSourceMaps: true,
};
