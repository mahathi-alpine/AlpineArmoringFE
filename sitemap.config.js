const generateVehicleUrls = require('./sitemap-url-generator');
const vehicleUrls = generateVehicleUrls();

const additionalUrls = {
  en: [
    {
      loc: '',
      priority: '1',
      changefreq: 'monthly',
    },
    {
      loc: '/news',
      priority: '0.7',
      changefreq: 'monthly',
    },
    {
      loc: '/blog',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/armored-vehicles-for-sale',
      priority: '0.9',
      changefreq: 'monthly',
    },
    {
      loc: '/privacy-policy',
      priority: '0.1',
      changefreq: 'monthly',
    },
    {
      loc: '/ballistic-chart',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/faqs',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/about-us',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/shipping-and-logistics',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/locations-we-serve',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/manufacturing',
      priority: '0.8',
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
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/media/videos',
      priority: '0.7',
      changefreq: 'monthly',
    },
    {
      loc: '/media/trade-shows',
      priority: '0.7',
      changefreq: 'monthly',
    },
    {
      loc: '/media',
      priority: '0.7',
      changefreq: 'monthly',
    },
    {
      loc: '/vehicles-we-armor',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/ballistic-testing',
      priority: '0.8',
      changefreq: 'monthly',
    },
    {
      loc: '/become-a-dealer',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/design-and-engineering',
      priority: '0.8',
      changefreq: 'monthly',
    },
  ],
  es: [
    {
      loc: '/es',
      priority: '1',
      changefreq: 'monthly',
    },
    {
      loc: '/es/noticias',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/blog',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/vehiculos-blindados-en-venta',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/politica-de-privacidad',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/tabla-balistica',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/preguntas-frecuentes',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/hacerca-de-nosotros',
      priority: '0.7',
      changefreq: 'monthly',
    },
    {
      loc: '/es/envio-y-logistica',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/ubicaciones-que-servimos',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/fabricacion',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/autora/laila-asbergs',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/autora/dan-diana',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/todas-las-descargas',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/contacto',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/medios/videos',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/medios/ferias-comerciales',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/medios',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/vehiculos-que-blindamos',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/pruebas-balisticas',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/conviertase-en-distribuidor',
      priority: '0.5',
      changefreq: 'monthly',
    },
    {
      loc: '/es/diseno-e-ingenieria',
      priority: '0.5',
      changefreq: 'monthly',
    },
  ],
};

const config = {
  baseUrl: process.env.NEXT_PUBLIC_URL,
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
      priority: '0.8',
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
        es: '/es/vehiculos-que-blindamos/:slug',
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
        es: '/es/blog/:slug',
      },
    },
    articles: {
      collection: 'articles',
      urlPattern: '/locations-we-serve/:slug',
      priority: '0.5',
      changefreq: 'monthly',
      translations: {
        es: '/es/ubicaciones-que-servimos/:slug',
      },
    },
    faqs: {
      collection: 'knowledge-bases',
      urlPattern: '/faqs/:slug',
      priority: '0.5',
      changefreq: 'monthly',
      translations: {
        es: '/es/preguntas-frecuentes/:slug',
      },
    },
    faqsCategories: {
      collection: 'knowledge-base-categories',
      urlPattern: '/faqs/:slug',
      priority: '0.5',
      changefreq: 'monthly',
      translations: {
        es: '/es/preguntas-frecuentes/:slug',
      },
    },
    rentalInventories: {
      collection: 'inventories',
      urlPattern: '/rental-vehicles/:slug',
      priority: '0.5',
      changefreq: 'weekly',
      translations: {
        es: '/es/vehiculos-de-renta/:slug',
      },
      filter: {
        categories: {
          slug: {
            $in: ['armored-rental', 'alquiler-blindados'],
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
        es: '/es/vehiculos-que-blindamos/tipo/:slug',
      },
      excludeSlugs: [
        'special-of-the-month',
        'armored-rental',
        'armored-pre-owned',
        'especial-del-mes',
        'alquiler-blindados',
        'blindados-pre-usados',
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
      excludeSlugs: [
        'armored-cash-in-transit-cit',
        'armored-vans-and-buses',
        'transporte-blindado-valores-cit',
        'furgonetas-y-autobuses-blindados',
      ],
    },
  },
};

module.exports = config;
