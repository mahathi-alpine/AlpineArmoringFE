import Link from 'next/link';
import config from 'sitemap.config';
import useLocale from 'hooks/useLocale';
import styles from './sitemap.module.scss';

interface SitemapItem {
  slug: string;
  title: string;
  date?: string;
}

interface VehicleMakeItem {
  url: string;
  title: string;
}

interface SitemapData {
  inventories: SitemapItem[];
  vehiclesWeArmor: SitemapItem[];
  inventoryCategories: SitemapItem[];
  vehicleCategories: SitemapItem[];
  blogs: SitemapItem[];
  blogEvergreens: SitemapItem[];
  articles: SitemapItem[];
  rentalInventories: SitemapItem[];
  faqsCategories: SitemapItem[];
  faqs: SitemapItem[];
  vehicleMakes: {
    baseMakes: VehicleMakeItem[];
    typeCategories: Record<string, VehicleMakeItem[]>;
  };
  staticPages: Array<{ loc: string }>;
}

function Sitemap({
  sitemapData,
  locale = 'en',
}: {
  sitemapData: SitemapData;
  locale?: string;
}) {
  const { lang } = useLocale();

  const getPageTitle = (url: string, currentLocale: string = 'en'): string => {
    const path = url.replace(/^\//, '').replace(/^es\//, '');

    const titleMaps = {
      en: {
        '': 'Home',
        'about-us': 'About Us',
        'armored-vehicles-for-sale': 'Armored Vehicles for Sale',
        'vehicles-we-armor': 'Vehicles We Armor',
        'ballistic-chart': 'Weapons & Ammunition Chart',
        'ballistic-testing': 'Ballistic Testing',
        news: 'News on Armored Vehicles',
        blog: 'Blogs and Insights',
        faqs: 'Frequently Asked Questions',
        'shipping-and-logistics': 'Shipping and Logistics',
        'locations-we-serve': 'Locations We Serve',
        manufacturing: 'Manufacturing',
        'author/laila-asbergs': 'Author - Laila Asbergs',
        'author/dan-diana': 'Author - Dan Diana',
        'all-downloads': 'All Downloads',
        contact: 'Contact',
        'media/videos': 'Media - Videos',
        'media/trade-shows': 'Media - Trade Shows',
        media: 'Media',
        'become-a-dealer': 'Become a Dealer',
        'design-and-engineering': 'Design and Engineering',
        'privacy-policy': 'Privacy Policy',
      },
      es: {
        '': 'Inicio',
        'hacerca-de-nosotros': 'Sobre Nosotros',
        'vehiculos-blindados-en-venta': 'Vehiculos Blindados en Venta',
        'vehiculos-que-blindamos': 'Vehículos que Blindamos',
        'tabla-balistica': 'Tabla de Armas y Municiones',
        'pruebas-balisticas': 'Pruebas Balísticas',
        noticias: 'Noticias sobre Vehículos Blindados',
        blog: 'Blogs e Insights',
        'preguntas-frecuentes': 'Preguntas Frecuentes',
        'envio-y-logistica': 'Envío y Logística',
        'ubicaciones-que-servimos': 'Ubicaciones que Servimos',
        fabricacion: 'Fabricación',
        'autora/laila-asbergs': 'Autora - Laila Asbergs',
        'autora/dan-diana': 'Autora - Dan Diana',
        'todas-las-descargas': 'Todas las Descargas',
        contacto: 'Contacto',
        'medios/videos': 'Medios - Videos',
        'medios/ferias-comerciales': 'Medios - Ferias Comerciales',
        medios: 'Medios',
        'conviertase-en-distribuidor': 'Conviértase en Distribuidor',
        'diseno-e-ingenieria': 'Diseño e Ingeniería',
        'politica-de-privacidad': 'Política de Privacidad',
      },
    };

    const titleMap =
      titleMaps[currentLocale as keyof typeof titleMaps] || titleMaps.en;

    return (
      titleMap[path as keyof typeof titleMap] ||
      path
        .split('/')
        .pop()
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()) ||
      path
    );
  };

  const getSortedStaticPages = () => {
    const pageOrders = {
      en: [
        '',
        'about-us',
        'armored-vehicles-for-sale',
        'vehicles-we-armor',
        'contact',
        'ballistic-chart',
        'ballistic-testing',
        'news',
        'blog',
        'faqs',
        'manufacturing',
        'design-and-engineering',
        'shipping-and-logistics',
        'locations-we-serve',
        'media',
        'media/videos',
        'media/trade-shows',
        'become-a-dealer',
        'all-downloads',
        'privacy-policy',
      ],
      es: [
        '',
        'hacerca-de-nosotros',
        'vehiculos-blindados-en-venta',
        'vehiculos-que-blindamos',
        'contacto',
        'tabla-balistica',
        'pruebas-balisticas',
        'noticias',
        'blog',
        'preguntas-frecuentes',
        'fabricacion',
        'diseno-e-ingenieria',
        'envio-y-logistica',
        'ubicaciones-que-servimos',
        'medios',
        'medios/videos',
        'medios/ferias-comerciales',
        'conviertase-en-distribuidor',
        'todas-las-descargas',
        'politica-de-privacidad',
      ],
    };

    const pageOrder =
      pageOrders[locale as keyof typeof pageOrders] || pageOrders.en;

    // Filter out author pages
    const filteredPages = sitemapData.staticPages.filter((page) => {
      const path = page.loc.replace(/^\//, '').replace(/^es\//, '');
      return !path.startsWith('author/') && !path.startsWith('autora/');
    });

    return filteredPages.sort((a, b) => {
      const aPath = a.loc.replace(/^\//, '').replace(/^es\//, '');
      const bPath = b.loc.replace(/^\//, '').replace(/^es\//, '');
      const aIndex = pageOrder.indexOf(aPath);
      const bIndex = pageOrder.indexOf(bPath);

      if (aIndex === -1 && bIndex === -1) return aPath.localeCompare(bPath);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  const getLocalizedUrl = (basePath: string, slug?: string) => {
    const localePrefix = locale === 'es' ? '/es' : '';
    return slug
      ? `${config.baseUrl}${localePrefix}${basePath}/${slug}`
      : `${config.baseUrl}${localePrefix}${basePath}`;
  };

  return (
    <div className={`container`}>
      <h1 className={`c-title mt2`}>Sitemap</h1>

      <div className={`${styles.sitemap_wrap}`}>
        <div className={`${styles.sitemap_column}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allStaticPages}</h2>
            <ul>
              {getSortedStaticPages().map((page, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}${page.loc}`}>
                    {getPageTitle(page.loc, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allBlogPosts}</h2>
            <ul>
              {sitemapData.blogEvergreens.map((item, index) => (
                <li key={index}>
                  <Link href={getLocalizedUrl(`${lang.blogsURL}`, item.slug)}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allNewsArticles}</h2>
            <ul>
              {sitemapData.blogs.map((item, index) => (
                <li key={index}>
                  <Link href={getLocalizedUrl(`${lang.newsURL}`, item.slug)}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allFaqCategories}</h2>
            <ul>
              {sitemapData.faqsCategories.map((item, index) => (
                <li key={index}>
                  <Link href={getLocalizedUrl(`${lang.faqsURL}`, item.slug)}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allFaqs}</h2>
            <ul>
              {sitemapData.faqs.map((item, index) => (
                <li key={index}>
                  <Link href={getLocalizedUrl(`${lang.faqsURL}`, item.slug)}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.sitemap_column}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allArmoredVehiclesForSale}</h2>
            <ul>
              {sitemapData.inventories.map((item, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedUrl(
                      `/${lang.availableNowURL}`,
                      item.slug
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allRentalVehicles}</h2>
            <ul>
              {sitemapData.rentalInventories.map((item, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedUrl(
                      `${lang.rentalVehiclesURL}`,
                      item.slug
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allInventoryCategories}</h2>
            <ul>
              {sitemapData.inventoryCategories.map((item, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedUrl(
                      `/${lang.availableNowURL}/${lang.type}`,
                      item.slug
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.sitemap_column}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allVehiclesWecanArmor}</h2>
            <ul>
              {sitemapData.vehiclesWeArmor.map((item, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedUrl(
                      `${lang.vehiclesWeArmorURL}`,
                      item.slug
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allVehiclesWecanArmorCategories}</h2>
            <ul>
              {sitemapData.vehicleCategories.map((item, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedUrl(
                      `${lang.vehiclesWeArmorURL}/${lang.type}`,
                      item.slug
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.sitemap_column}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allMakesWeCanArmor}</h2>

            <ul>
              {sitemapData.vehicleMakes.baseMakes.map((item, index) => (
                <li key={index}>
                  <Link
                    href={`${config.baseUrl}${locale === 'es' ? '/es' : ''}${item.url}`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            {Object.entries(sitemapData.vehicleMakes.typeCategories).map(
              ([typeName, makes]) => {
                const makesList = makes as VehicleMakeItem[];

                // Translate type names for Spanish
                const getLocalizedTypeName = (name: string) => {
                  if (locale === 'es') {
                    const translations: Record<string, string> = {
                      'Cash In Transit Cit': 'Transporte de valores (CIT)',
                      'Law Enforcement': 'Fuerzas del Orden',
                      'Pickup Trucks': 'Camionetas',
                      Sedans: 'Sedanes',
                      'Specialty Vehicles': 'Vehículos Especiales',
                      Suvs: 'SUVs',
                      'Vans And Buses': 'Furgonetas y autobuses',
                    };
                    return translations[name] || name;
                  }
                  return name;
                };

                return (
                  <div
                    key={typeName}
                    className={`${styles.sitemap_category_sub}`}
                  >
                    <h3>
                      {lang.all} {getLocalizedTypeName(typeName)}{' '}
                      {lang.makesWeCanArmor}
                    </h3>
                    <ul>
                      {makesList.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={`${config.baseUrl}${locale === 'es' ? '/es' : ''}${item.url}`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className={`${styles.sitemap_column_full}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>{lang.allLocationsWeServe}</h2>
            <ul>
              {sitemapData.articles.map((item, index) => (
                <li key={index}>
                  <Link
                    href={getLocalizedUrl(
                      `${lang.locationsWeServeURL}`,
                      item.slug
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const generateVehicleMakeUrls = () => {
    const makes = [
      'audi',
      'bentley',
      'bmw',
      'boxer',
      'bulldog',
      'cadillac',
      'chevrolet',
      'cuda',
      'cyclone',
      'ford',
      'genesis',
      'gmc',
      'honda',
      'hummer',
      'infiniti',
      'ineos',
      'lamborghini',
      'maybach',
      'international',
      'jeep',
      'land-rover',
      'lexus',
      'lincoln',
      'mastiff',
      'mercedes-benz',
      'omicron',
      'pit-bull',
      'pointer',
      'range-rover',
      'rolls-royce',
      'tesla',
      'toyota',
      'typhoon',
    ];

    const vehicleTypes = {
      'Cash In Transit Cit': ['international', 'ford', 'gmc'],
      'Law Enforcement': [
        'bulldog',
        'pointer',
        'ford',
        'typhoon',
        'pit-bull',
        'cuda',
        'cyclone',
        'boxer',
      ],
      'Pickup Trucks': [
        'chevrolet',
        'mastiff',
        'ford',
        'typhoon',
        'pit-bull',
        'toyota',
        'cyclone',
        'gmc',
        'tesla',
      ],
      Sedans: [
        'lexus',
        'rolls-royce',
        'bentley',
        'genesis',
        'bmw',
        'audi',
        'toyota',
        'tesla',
        'mercedes-benz',
        'maybach',
      ],
      'Specialty Vehicles': ['mastiff', 'toyota', 'omicron'],
      Suvs: [
        'jeep',
        'infiniti',
        'chevrolet',
        'lexus',
        'rolls-royce',
        'ford',
        'bentley',
        'genesis',
        'bmw',
        'hummer',
        'cadillac',
        'ineos',
        'audi',
        'toyota',
        'range-rover',
        'lincoln',
        'land-rover',
        'gmc',
        'tesla',
        'lamborghini',
        'mercedes-benz',
        'maybach',
      ],
      'Vans And Buses': ['pointer', 'toyota', 'honda', 'gmc'],
    };

    const baseMakes = makes.map((make) => ({
      url: `${locale === 'es' ? '/vehiculos-que-blindamos' : '/vehicles-we-armor'}?make=${make}`,
      title: make.charAt(0).toUpperCase() + make.slice(1),
    }));

    const typeCategories: Record<string, VehicleMakeItem[]> = {};

    Object.entries(vehicleTypes).forEach(([typeName, allowedMakes]) => {
      const slugMaps = {
        en: {
          'Cash In Transit Cit': 'armored-cash-in-transit-cit',
          'Law Enforcement': 'armored-law-enforcement',
          'Pickup Trucks': 'armored-pickup-trucks',
          Sedans: 'armored-sedans',
          'Specialty Vehicles': 'armored-specialty-vehicles',
          Suvs: 'armored-suvs',
          'Vans And Buses': 'armored-vans-and-buses',
        },
        es: {
          'Cash In Transit Cit': 'transporte-blindado-valores-cit',
          'Law Enforcement': 'fuerzas-del-orden-blindadas',
          'Pickup Trucks': 'camionetas-blindadas',
          Sedans: 'sedanes-blindados',
          'Specialty Vehicles': 'vehiculos-blindados-especiales',
          Suvs: 'suvs-blindados',
          'Vans And Buses': 'furgonetas-y-autobuses-blindados',
        },
      };

      const slugMap = slugMaps[locale as keyof typeof slugMaps] || slugMaps.en;

      // Translate type names for Spanish titles
      const getLocalizedTypeName = (name: string) => {
        if (locale === 'es') {
          const translations: Record<string, string> = {
            'Cash In Transit Cit': 'Transporte Blindado Valores CIT',
            'Law Enforcement': 'Fuerzas del Orden',
            'Pickup Trucks': 'Camionetas',
            Sedans: 'Sedanes',
            'Specialty Vehicles': 'Vehículos Especiales',
            Suvs: 'SUVs',
            'Vans And Buses': 'Furgonetas y Autobuses',
          };
          return translations[name] || name;
        }
        return name;
      };

      typeCategories[typeName] = allowedMakes.map((make) => ({
        url: `${locale === 'es' ? '/vehiculos-que-blindamos' : '/vehicles-we-armor'}/${locale === 'es' ? 'tipo' : 'type'}/${slugMap[typeName as keyof typeof slugMap]}?make=${make}`,
        title: `${getLocalizedTypeName(typeName)} - ${make.charAt(0).toUpperCase() + make.slice(1)}`,
      }));
    });

    return { baseMakes, typeCategories };
  };

  const fetchStrapiCollection = async (
    collection: string,
    currentLocale: string = 'en'
  ): Promise<SitemapItem[]> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://alpinetesting.cloudflex-ha.com';

    try {
      const allData: any[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const dateField =
          collection === 'blogs'
            ? 'publishedAt'
            : collection === 'blog-evergreens'
              ? 'createdAt'
              : 'publishedAt';

        let url = `${baseUrl}/api/${collection}?fields[0]=slug&fields[1]=title&locale=${currentLocale}&pagination[page]=${page}&pagination[pageSize]=100`;

        // Add date field for blogs and blog-evergreens
        if (collection === 'blogs' || collection === 'blog-evergreens') {
          url = `${baseUrl}/api/${collection}?fields[0]=slug&fields[1]=title&fields[2]=date&fields[3]=${dateField}&locale=${currentLocale}&pagination[page]=${page}&pagination[pageSize]=100`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${collection}: ${response.status}`);
        }

        const result = await response.json();

        if (!result.data?.length) {
          hasMorePages = false;
          break;
        }

        allData.push(...result.data);
        hasMorePages =
          result.meta?.pagination && page < result.meta.pagination.pageCount;
        page++;
      }

      return allData
        .map((item) => ({
          slug: item.attributes?.slug || '',
          title: item.attributes?.title || item.attributes?.slug || 'Untitled',
          date:
            item.attributes?.date ||
            item.attributes?.publishedAt ||
            item.attributes?.createdAt ||
            null,
        }))
        .filter((item) => item.slug)
        .sort((a, b) => {
          // Sort by date descending (newest first)
          if (a.date && b.date) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }
          // If no date, sort alphabetically
          return a.title.localeCompare(b.title);
        });
    } catch (error) {
      return [];
    }
  };

  const sitemapData: SitemapData = {
    inventories: [],
    vehiclesWeArmor: [],
    inventoryCategories: [],
    vehicleCategories: [],
    blogs: [],
    blogEvergreens: [],
    articles: [],
    rentalInventories: [],
    faqsCategories: [],
    faqs: [],
    vehicleMakes: { baseMakes: [], typeCategories: {} },
    staticPages: [],
  };

  try {
    const [
      inventories,
      vehiclesWeArmor,
      blogs,
      blogEvergreens,
      articles,
      categories,
      faqsCategories,
      faqs,
    ] = await Promise.all([
      fetchStrapiCollection('inventories', locale),
      fetchStrapiCollection('vehicles-we-armors', locale),
      fetchStrapiCollection('blogs', locale),
      fetchStrapiCollection('blog-evergreens', locale),
      fetchStrapiCollection('articles', locale),
      fetchStrapiCollection('categories', locale),
      fetchStrapiCollection('knowledge-base-categories', locale),
      fetchStrapiCollection('knowledge-bases', locale),
    ]);

    sitemapData.inventories = inventories;
    sitemapData.vehiclesWeArmor = vehiclesWeArmor;
    sitemapData.blogs = blogs;
    sitemapData.blogEvergreens = blogEvergreens;
    sitemapData.articles = articles;
    sitemapData.faqsCategories = faqsCategories;
    sitemapData.faqs = faqs;

    // Filter categories
    const inventoryCategoryExcludes = [
      'armored-cash-in-transit-cit',
      'armored-vans-and-buses',
      'transporte-blindado-valores-cit',
      'furgonetas-y-autobuses-blindados',
    ];

    const vehicleCategoryExcludes = [
      'special-of-the-month',
      'armored-rental',
      'armored-pre-owned',
      'especial-del-mes',
      'alquiler-blindados',
      'blindados-pre-usados',
    ];

    sitemapData.inventoryCategories = categories.filter(
      (cat) => !inventoryCategoryExcludes.includes(cat.slug)
    );

    sitemapData.vehicleCategories = categories.filter(
      (cat) => !vehicleCategoryExcludes.includes(cat.slug)
    );

    // Fetch rental inventories (skip if filtering fails)
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://alpinetesting.cloudflex-ha.com';
      const rentalUrl = `${baseUrl}/api/inventories?fields[0]=slug&fields[1]=title&locale=${locale}&filters[categories][slug][$in][]=armored-rental&filters[categories][slug][$in][]=alquiler-blindados&pagination[pageSize]=100`;

      const rentalResponse = await fetch(rentalUrl);
      if (rentalResponse.ok) {
        const rentalResult = await rentalResponse.json();
        sitemapData.rentalInventories =
          rentalResult.data
            ?.map((item: any) => ({
              slug: item.attributes?.slug || '',
              title:
                item.attributes?.title || item.attributes?.slug || 'Untitled',
            }))
            .filter((item: any) => item.slug) || [];
      }
    } catch (error) {
      sitemapData.rentalInventories = [];
    }

    sitemapData.vehicleMakes = generateVehicleMakeUrls();

    const allCustomUrls =
      config.customUrls?.[locale] || config.customUrls?.en || [];
    sitemapData.staticPages = allCustomUrls.filter(
      (page) =>
        !page.loc.includes('vehicles-we-armor?make=') &&
        !page.loc.includes('vehicles-we-armor/type/') &&
        !page.loc.includes('vehiculos-que-blindamos?make=') &&
        !page.loc.includes('vehiculos-que-blindamos/tipo/')
    );

    // Create SEO data for the sitemap page
    const seoData = {
      metaTitle:
        locale === 'es'
          ? 'Mapa del Sitio - Alpine Armoring'
          : 'Sitemap - Alpine Armoring',
      metaDescription:
        locale === 'es'
          ? 'Mapa completo del sitio web de Alpine Armoring incluyendo todos los vehículos blindados, inventario, publicaciones de blog, artículos de noticias y ubicaciones que servimos.'
          : 'Complete sitemap for Alpine Armoring website including all armored vehicles, inventory, blog posts, news articles, and locations we serve.',
      // canonicalURL: locale === 'es' ? '/es/sitemap' : '/sitemap',
      canonicalURL: false,
      languageUrls: false,
      metaRobots: 'noindex, follow',
    };

    return {
      props: {
        sitemapData,
        seoData,
        locale,
      },
      revalidate: 3600,
    };
  } catch (error) {
    const fallbackSeoData = {
      metaTitle:
        locale === 'es'
          ? 'Mapa del Sitio - Alpine Armoring'
          : 'Sitemap - Alpine Armoring',
      metaDescription:
        locale === 'es'
          ? 'Mapa completo del sitio web de Alpine Armoring.'
          : 'Complete sitemap for Alpine Armoring website.',
      canonicalURL: false,
      languageUrls: null,
    };

    return {
      props: {
        sitemapData: {
          ...sitemapData,
          vehicleMakes: generateVehicleMakeUrls(),
          staticPages:
            config.customUrls?.[locale]?.filter(
              (page) =>
                !page.loc.includes('vehicles-we-armor?make=') &&
                !page.loc.includes('vehicles-we-armor/type/') &&
                !page.loc.includes('vehiculos-que-blindamos?make=') &&
                !page.loc.includes('vehiculos-que-blindamos/tipo/')
            ) || [],
        },
        seoData: fallbackSeoData,
        locale,
      },
      revalidate: 300,
    };
  }
}

export default Sitemap;
