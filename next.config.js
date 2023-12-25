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
        { title: "English", name: "en" },
        { title: "Deutsch", name: "de" },
        { title: "Español", name: "es" },
        { title: "Français", name: "fr" },
      ],
      defaultLanguage: "en",
    }),
  },
};
