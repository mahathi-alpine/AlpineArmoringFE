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
        { title: 'En', name: 'en', flag: '/flags/USFlag.jpg' },
        { title: 'Es', name: 'es', flag: '/flags/ESFlag.png' },
        { title: 'Fr', name: 'fr', flag: '/flags/FRFlag.png' },
        { title: 'Ru', name: 'ru', flag: '/flags/RUFlag.png' },
        { title: 'CN', name: 'zh-CN', flag: '/flags/CNFlag.png' },
        { title: 'JA', name: 'ja', flag: '/flags/JAFlag.png' },
        { title: 'AR', name: 'ar', flag: '/flags/ARFlag.jpg' },
      ],
      defaultLanguage: 'en',
    }),
  },
};
