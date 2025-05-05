const vehicleTypes = {
  'special-of-the-month': {
    en: 'special-of-the-month',
    es: 'especial-del-mes',
  },
  'armored-suvs': {
    en: 'armored-suvs',
    es: 'suvs-blindados',
  },
  'armored-sedans': {
    en: 'armored-sedans',
    es: 'sedanes-blindados',
  },
  'armored-pickup-trucks': {
    en: 'armored-pickup-trucks',
    es: 'camionetas-blindadas',
  },
  'armored-law-enforcement': {
    en: 'armored-law-enforcement',
    es: 'fuerzas-del-orden-blindadas',
  },
  'armored-cash-in-transit-cit': {
    en: 'armored-cash-in-transit-cit',
    es: 'transporte-blindado-valores-cit',
  },
  'armored-specialty-vehicles': {
    en: 'armored-specialty-vehicles',
    es: 'vehiculos-blindados-especiales',
  },
  'armored-pre-owned': {
    en: 'armored-pre-owned',
    es: 'blindados-pre-usados',
  },
  'armored-rental': {
    en: 'armored-rental',
    es: 'alquiler-blindados',
  },
  'armored-vans-and-buses': {
    en: 'armored-vans-and-buses',
    es: 'furgonetas-y-autobuses-blindados',
  },
};

const routes = {
  homepage: {
    collection: 'homepage',
    paths: {
      en: '/',
      es: '/es',
    },
  },
  about: {
    collection: 'about',
    paths: {
      en: '/about-us',
      es: '/hacerca-de-nosotros',
    },
  },
  allDownloads: {
    collection: 'all-download',
    paths: {
      en: '/all-downloads',
      es: '/todas-las-descargas',
    },
  },
  author: {
    collection: 'authors',
    paths: {
      en: '/author',
      es: '/autora',
    },
  },
  inventory: {
    collection: 'list-inventory',
    collectionSingle: 'inventories',
    paths: {
      en: '/available-now',
      es: '/disponible-ahora',
    },
    typePath: {
      en: 'type',
      es: 'tipo',
    },
    types: vehicleTypes,
  },
  ballisticChart: {
    collection: 'ballistic-chart',
    paths: {
      en: '/ballistic-chart',
      es: '/tabla-balistica',
    },
  },
  ballisticTesting: {
    collection: 'ballistic-testing',
    paths: {
      en: '/ballistic-testing',
      es: '/pruebas-balisticas',
    },
  },
  becomeDealer: {
    collection: 'become-a-dealer',
    paths: {
      en: '/become-a-dealer',
      es: '/conviertase-en-distribuidor',
    },
  },
  blog: {
    collection: 'blog-page',
    collectionSingle: 'blog-evergreens',
    paths: {
      en: '/blog',
      es: '/blog',
    },
  },
  contact: {
    collection: 'contact-page',
    paths: {
      en: '/contact',
      es: '/contacto',
    },
  },
  designAndEngineering: {
    collection: 'design-and-engineering',
    paths: {
      en: '/design-and-engineering',
      es: '/diseno-e-ingenieria',
    },
  },
  manufacturing: {
    collection: 'manufacturing',
    paths: {
      en: '/manufacturing',
      es: '/fabricacion',
    },
  },
  faqs: {
    collection: 'faq',
    collectionSingle: 'fa-qs',
    paths: {
      en: '/faqs',
      es: '/preguntas-frecuentes',
    },
  },
  locationsWeServe: {
    collection: 'locations-we-serve-page',
    collectionSingle: 'articles',
    paths: {
      en: '/locations-we-serve',
      es: '/ubicaciones-que-servimos',
    },
  },
  media: {
    collection: 'media',
    paths: {
      en: '/media',
      es: '/medios',
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
  tradeShows: {
    collection: 'trade-shows-page',
    collectionSingle: 'trade-shows',
    paths: {
      en: '/media/trade-shows',
      es: '/medios/ferias-comerciales',
    },
  },
  news: {
    collection: 'news-page',
    collectionSingle: 'blogs',
    paths: {
      en: '/news',
      es: '/noticias',
    },
  },
  privacyPolicy: {
    collection: 'privacy-policy',
    paths: {
      en: '/privacy-policy',
      es: '/politica-de-privacidad',
    },
  },
  rentalVehicles: {
    paths: {
      en: '/rental-vehicles',
      es: '/vehiculos-de-renta',
    },
  },
  shippingAndLogistics: {
    collection: 'shipping',
    paths: {
      en: '/shipping-and-logistics',
      es: '/envio-y-logistica',
    },
  },
  soldVehicles: {
    collection: 'sold-vehicle',
    collectionSingle: 'inventories',
    paths: {
      en: '/sold-vehicles',
      es: '/vehiculos-vendidos',
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
    types: vehicleTypes,
  },
  knowledgeBase: {
    collection: 'knowledge-base-page',
    collectionSingle: 'knowledge-bases',
    paths: {
      en: '/knowledge-base',
      es: '/base-de-conocimientos',
    },
  },
};

const utils = {
  getLocalizedType: (route, type, locale) => {
    return vehicleTypes[type]?.[locale] || type;
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
