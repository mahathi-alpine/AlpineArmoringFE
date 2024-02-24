const redirects = require('./redirects');

module.exports = {
  sassOptions: {
    prependData: `@import './styles/_mixins.scss';`,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
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
        hostname: 'herokuapp.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'alpine-armoring-e7d249d45874.herokuapp.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '**',
      },
      // 'res.cloudinary.com',
      // 'assets.vercel.com',
      // 'localhost',
      // 'herokuapp.com',
      // 'alpine-armoring-e7d249d45874.herokuapp.com',
    ],
  },
  redirects: () => {
    return redirects();
  },
  reactStrictMode: true,
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
