const generateVehicleUrls = require('./sitemap-url-generator');
const vehicleUrls = generateVehicleUrls();

const additionalUrls = {
  en: [
    {
      loc: '/',
      priority: '1',
      changefreq: 'monthly',
    },
    {
      loc: '/news',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/available-now',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/privacy-policy',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/ballistic-chart',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/faqs',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/about-us',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/shipping-and-logistics',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/locations-we-serve',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/manufacturing',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/author/laila-asbergs',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/author/dan-diana',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/all-downloads',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/contact',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/media/videos',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/media/trade-shows',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/media',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/vehicles-we-armor',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/ballistic-testing',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/become-a-dealer',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/design-and-engineering',
      priority: '0.5',
      changefreq: 'monthly',
    },
  ],
  es: [
    {
      loc: '/es/sobre-nosotros',
      priority: '0.7',
      changefreq: 'monthly',
    },
  ],
};

const config = {
  baseUrl: 'https://www.alpineco.com',
  languages: ['en', 'es'],
  defaultLanguage: 'en',
  defaultPriority: '0.5',
  defaultChangefreq: 'weekly',
  customUrls: {
    en: [...additionalUrls.en, ...vehicleUrls.en],
    es: [...additionalUrls.es, ...vehicleUrls.es],
  },
  collections: {
    inventories: {
      collection: 'inventories',
      urlPattern: '/available-now/:slug',
      priority: '0.9',
      changefreq: 'weekly',
      translations: {
        es: '/es/disponible-ahora/:slug',
      },
    },
    'vehicles-we-armors': {
      collection: 'vehicles-we-armors',
      urlPattern: '/vehicles-we-armor/:slug',
      priority: '0.8',
      changefreq: 'monthly',
      translations: {
        es: '/es/vehiculos-blindados/:slug',
      },
    },
    blogs: {
      collection: 'blogs',
      urlPattern: '/news/:slug',
      priority: '0.7',
      changefreq: 'monthly',
      translations: {
        es: '/es/noticias/:slug',
      },
    },
    'blog-evergreens': {
      collection: 'blog-evergreens',
      urlPattern: '/blog/:slug',
      priority: '0.7',
      changefreq: 'weekly',
      translations: {
        es: '/es/blogs/:slug',
      },
    },
    articles: {
      collection: 'articles',
      urlPattern: '/locations-we-serve/:slug',
      priority: '0.5',
      changefreq: 'monthly',
      translations: {
        es: '/es/locationes/:slug',
      },
    },
    rentalInventories: {
      collection: 'inventories',
      urlPattern: '/rental-vehicles/:slug',
      priority: '0.5',
      changefreq: 'weekly',
      translations: {
        es: '/es/rentales/:slug',
      },
      filter: {
        categories: {
          slug: {
            $eq: 'armored-rental',
          },
        },
      },
    },
    categoriesVehicles: {
      collection: 'categories',
      urlPattern: '/vehicles-we-armor/type/:slug',
      priority: '0.5',
      changefreq: 'monthly',
      translations: {
        es: '/es/vehiculos-blindados/tipo/:slug',
      },
      excludeSlugs: [
        'special-of-the-month',
        'armored-rental',
        'armored-pre-owned',
      ],
    },
    categoriesInventory: {
      collection: 'categories',
      urlPattern: '/available-now/type/:slug',
      priority: '0.5',
      changefreq: 'monthly',
      translations: {
        es: '/es/disponible-ahora/tipo/:slug',
      },
      excludeSlugs: ['armored-cash-in-transit-cit', 'armored-vans-and-buses'],
    },
  },
};

module.exports = config;
