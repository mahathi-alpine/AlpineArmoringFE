module.exports = {
  sassOptions: {
    prependData: `@import './styles/_mixins.scss';`,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'assets.vercel.com',
      'localhost',
      'herokuapp.com',
      'alpine-armoring-e7d249d45874.herokuapp.com',
    ],
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
