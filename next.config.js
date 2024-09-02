const redirects = require('./redirects');

module.exports = {
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  sassOptions: {
    prependData: `@import './styles/_mixins.scss';`,
  },
  images: {
    // unoptimized: true,
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1920],
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
  redirects: redirects,
  reactStrictMode: true,
  experimental: {
    largePageDataBytes: 800 * 1000,
  },
  productionBrowserSourceMaps: true,
  env: {
    GOOGLE_TRANSLATION_CONFIG: JSON.stringify({
      languages: [
        { title: 'En', name: 'en' },
        { title: 'Es', name: 'es' },
        { title: 'Fr', name: 'fr' },
        { title: 'Ru', name: 'ru' },
        { title: 'CN', name: 'zh-CN' },
        { title: 'JA', name: 'ja' },
        { title: 'AR', name: 'ar' },
        { title: 'De', name: 'de' },
      ],
      defaultLanguage: 'en',
    }),
  },
};
