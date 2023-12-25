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
        { title: "En", name: "en", flag: '/USFlag.jpg' },
        { title: "Es", name: "es", flag: '/ESFlag.png' },
        { title: "Fr", name: "fr", flag: '/FRFlag.png' },
        { title: "Ru", name: "ru", flag: '/RUFlag.png' },
        { title: "CN", name: "zh-CN", flag: '/CNFlag.png' },
        { title: "JA", name: "ja", flag: '/JAFlag.png' },
        { title: "AR", name: "ar", flag: '/ARFlag.jpg' }
      ],
      defaultLanguage: "en",
    }),
  },
};
