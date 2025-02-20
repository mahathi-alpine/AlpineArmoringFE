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
    collection: 'list-inventory',
    collectionSingle: 'inventories',
    paths: {
      en: '/available-now',
      es: '/disponible-ahora',
    },
  },
  vehiclesWeArmor: {
    collection: 'list-vehicles-we-armor',
    collectionSingle: 'vehicles-we-armors',
    paths: {
      en: '/vehicles-we-armor',
      es: '/vehiculos-que-blindamos',
    },
    typePath: {
      en: 'type',
      es: 'tipo',
    },
    types: {
      'armored-suvs': {
        en: 'armored-suvs',
        es: 'suvs-blindados',
      },
    },
  },
  ballisticTesting: {
    collection: 'ballistic-testing',
    paths: {
      en: '/ballistic-testing',
      es: '/pruebas-balisticas',
    },
  },
  about: {
    collection: 'about',
    paths: {
      en: '/about-us',
      es: '/hacerca-de-nosotros/',
    },
  },
  videos: {
    collection: 'video-page',
    collectionSingle: 'videos',
    paths: {
      en: '/media/videos',
      es: '/medios/videos',
    },
  },
};

const utils = {
  getLocalizedType: (route, type, locale) => {
    const typeMap = {
      'armored-suvs': {
        en: 'armored-suvs',
        es: 'suvs-blindados',
      },
    };

    return typeMap[type]?.[locale] || type;
  },

  getLocalizedPath: (paths, locale, slug) => {
    const basePath = paths[locale] || paths.en;
    return locale === 'en'
      ? `${basePath}/${slug}`
      : `/${locale}${basePath}/${slug}`;
  },

  getRewrites: (paths, typePath) => {
    return Object.entries(paths)
      .filter(([locale]) => locale !== 'en')
      .flatMap(([locale, path]) => {
        const rewrites = [
          {
            source: `${path}`,
            destination: paths.en,
          },
          {
            source: `${path}/:slug`,
            destination: `${paths.en}/:slug`,
          },
        ];

        if (typePath && typePath[locale]) {
          rewrites.push({
            source: `${path}/${typePath[locale]}/:type`,
            destination: `${paths.en}/type/:type`,
          });
        }

        return rewrites;
      });
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

Object.entries(routes).forEach(([key, config]) => {
  routes[key] = {
    ...config,
    getLocalizedPath: (locale, slug) =>
      utils.getLocalizedPath(config.paths, locale, slug),
    getRewrites: () => utils.getRewrites(config.paths, config.typePath),
    getLanguageUrls: (currentPage, locale) =>
      utils.getLanguageUrls(routes[key], currentPage, locale),
    getIndexLanguageUrls: (locale) =>
      utils.getIndexLanguageUrls(config.paths, locale),
    getLocalizedType: (type, locale) => {
      if (!config.types?.[type]) return type;
      return config.types[type][locale] || type;
    },
  };
});

module.exports = routes;
