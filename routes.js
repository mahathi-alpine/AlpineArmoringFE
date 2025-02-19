const utils = {
  getLocalizedPath: (paths, locale, slug) => {
    const basePath = paths[locale] || paths.en;
    return locale === 'en'
      ? `${basePath}/${slug}`
      : `/${locale}${basePath}/${slug}`;
  },

  getRewrites: (paths) => {
    return Object.entries(paths)
      .filter(([locale]) => locale !== 'en')
      .flatMap(([, path]) => [
        {
          source: `${path}`,
          destination: paths.en,
        },
        {
          source: `${path}/:slug`,
          destination: `${paths.en}/:slug`,
        },
      ]);
  },

  getLanguageUrls: (route, currentPage, locale) => {
    if (!route || !currentPage?.slug) return {};

    const languageUrls = {};

    languageUrls[locale] = route.getLocalizedPath(locale, currentPage.slug);

    if (currentPage.localizations?.data) {
      currentPage.localizations.data.forEach((localization) => {
        const localeCode = localization.attributes.locale;
        languageUrls[localeCode] = route.getLocalizedPath(
          localeCode,
          localization.attributes.slug
        );
      });
    }

    return languageUrls;
  },

  getIndexLanguageUrls: (paths) => {
    return Object.entries(paths).reduce((acc, [currentLocale, path]) => {
      acc[currentLocale] =
        currentLocale === 'en' ? path : `/${currentLocale}${path}`;
      return acc;
    }, {});
  },
};

const routes = {
  news: {
    collection: 'news-page',
    collectionSingle: 'blogs',
    paths: {
      en: '/news',
      es: '/noticias',
    },
  },
  inventory: {
    collection: 'inventories-list',
    collectionSingle: 'inventories',
    paths: {
      en: '/available-now',
      es: '/disponible-ahora',
    },
  },
};

Object.entries(routes).forEach(([key, config]) => {
  routes[key] = {
    ...config,
    getLocalizedPath: (locale, slug) =>
      utils.getLocalizedPath(config.paths, locale, slug),
    getRewrites: () => utils.getRewrites(config.paths),
    getLanguageUrls: (currentPage, locale) =>
      utils.getLanguageUrls(routes[key], currentPage, locale),
    getIndexLanguageUrls: (locale) =>
      utils.getIndexLanguageUrls(config.paths, locale),
  };
});

module.exports = routes;
