import Link from 'next/link';
import config from 'sitemap.config';
import styles from './sitemap.module.scss';

interface SitemapItem {
  slug: string;
  title: string;
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
  vehicleMakes: {
    baseMakes: VehicleMakeItem[];
    typeCategories: Record<string, VehicleMakeItem[]>;
  };
  staticPages: Array<{ loc: string }>;
}

function Sitemap({ sitemapData }: { sitemapData: SitemapData }) {
  const getPageTitle = (url: string): string => {
    const path = url.replace(/^\//, '');

    const titleMap: Record<string, string> = {
      '': 'Home',
      news: 'News',
      blog: 'Blog',
      'available-now': 'Available Now',
      'ballistic-chart': 'Ballistic Chart',
      faqs: 'FAQs',
      'about-us': 'About Us',
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
      'vehicles-we-armor': 'Vehicles We Armor',
      'ballistic-testing': 'Ballistic Testing',
      'become-a-dealer': 'Become a Dealer',
      'design-and-engineering': 'Design and Engineering',
      'privacy-policy': 'Privacy Policy',
    };

    return (
      titleMap[path] ||
      path
        .split('/')
        .pop()
        ?.replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()) ||
      path
    );
  };

  const getSortedStaticPages = () => {
    const pageOrder = [
      '', // Home
      'news',
      'blog',
      'available-now',
      'ballistic-chart',
      'faqs',
      'about-us',
      'shipping-and-logistics',
      'locations-we-serve',
      'manufacturing',
      'author/laila-asbergs',
      'author/dan-diana',
      'all-downloads',
      'contact',
      'media/videos',
      'media/trade-shows',
      'media',
      'vehicles-we-armor',
      'ballistic-testing',
      'become-a-dealer',
      'design-and-engineering',
      'privacy-policy', // Last
    ];

    return sitemapData.staticPages.sort((a, b) => {
      const aPath = a.loc.replace(/^\//, '');
      const bPath = b.loc.replace(/^\//, '');
      const aIndex = pageOrder.indexOf(aPath);
      const bIndex = pageOrder.indexOf(bPath);

      if (aIndex === -1 && bIndex === -1) return aPath.localeCompare(bPath);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  };

  return (
    <div className={`container`}>
      <h1 className={`c-title mt2`}>Sitemap</h1>

      <div className={`${styles.sitemap_wrap}`}>
        <div className={`${styles.sitemap_column}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>All Static Pages</h2>
            <ul>
              {getSortedStaticPages().map((page, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}${page.loc}`}>
                    {getPageTitle(page.loc)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>All Blog Posts</h2>
            <ul>
              {sitemapData.blogEvergreens.map((item, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}/blog/${item.slug}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>All News Articles</h2>
            <ul>
              {sitemapData.blogs.map((item, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}/news/${item.slug}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${styles.sitemap_column}`}>
          <div className={`${styles.sitemap_category}`}>
            <h2>All Available Vehicles</h2>
            <ul>
              {sitemapData.inventories.map((item, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}/available-now/${item.slug}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>All Rental Vehicles</h2>
            <ul>
              {sitemapData.rentalInventories.map((item, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}/rental-vehicles/${item.slug}`}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>All Inventory Categories</h2>
            <ul>
              {sitemapData.inventoryCategories.map((item, index) => (
                <li key={index}>
                  <Link
                    href={`${config.baseUrl}/available-now/type/${item.slug}`}
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
            <h2>All Vehicles We can Armor</h2>
            <ul>
              {sitemapData.vehiclesWeArmor.map((item, index) => (
                <li key={index}>
                  <Link
                    href={`${config.baseUrl}/vehicles-we-armor/${item.slug}`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${styles.sitemap_category}`}>
            <h2>All Vehicles We can Armor Categories</h2>
            <ul>
              {sitemapData.vehicleCategories.map((item, index) => (
                <li key={index}>
                  <Link
                    href={`${config.baseUrl}/vehicles-we-armor/type/${item.slug}`}
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
            <h2>All Makes We can Armor</h2>

            <ul>
              {sitemapData.vehicleMakes.baseMakes.map((item, index) => (
                <li key={index}>
                  <Link href={`${config.baseUrl}${item.url}`}>
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

                return (
                  <div
                    key={typeName}
                    className={`${styles.sitemap_category_sub}`}
                  >
                    <h3>All {typeName} makes we can armor</h3>
                    <ul>
                      {makesList.map((item, index) => (
                        <li key={index}>
                          <Link href={`${config.baseUrl}${item.url}`}>
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
            <h2>All Locations We Serve</h2>
            <ul>
              {sitemapData.articles.map((item, index) => (
                <li key={index}>
                  <Link
                    href={`${config.baseUrl}/locations-we-serve/${item.slug}`}
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

export async function getStaticProps() {
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
      url: `/vehicles-we-armor?make=${make}`,
      title: make.charAt(0).toUpperCase() + make.slice(1),
    }));

    const typeCategories: Record<string, VehicleMakeItem[]> = {};

    Object.entries(vehicleTypes).forEach(([typeName, allowedMakes]) => {
      const slugMap: Record<string, string> = {
        'Cash In Transit Cit': 'armored-cash-in-transit-cit',
        'Law Enforcement': 'armored-law-enforcement',
        'Pickup Trucks': 'armored-pickup-trucks',
        Sedans: 'armored-sedans',
        'Specialty Vehicles': 'armored-specialty-vehicles',
        Suvs: 'armored-suvs',
        'Vans And Buses': 'armored-vans-and-buses',
      };

      typeCategories[typeName] = allowedMakes.map((make) => ({
        url: `/vehicles-we-armor/type/${slugMap[typeName]}?make=${make}`,
        title: `${typeName} - ${make.charAt(0).toUpperCase() + make.slice(1)}`,
      }));
    });

    return { baseMakes, typeCategories };
  };

  const fetchStrapiCollection = async (
    collection: string
  ): Promise<SitemapItem[]> => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      'https://alpinetesting.cloudflex-ha.com';

    try {
      const allData: any[] = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const url = `${baseUrl}/api/${collection}?fields[0]=slug&fields[1]=title&locale=en&pagination[page]=${page}&pagination[pageSize]=100`;

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
        }))
        .filter((item) => item.slug);
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
    ] = await Promise.all([
      fetchStrapiCollection('inventories'),
      fetchStrapiCollection('vehicles-we-armors'),
      fetchStrapiCollection('blogs'),
      fetchStrapiCollection('blog-evergreens'),
      fetchStrapiCollection('articles'),
      fetchStrapiCollection('categories'),
    ]);

    sitemapData.inventories = inventories;
    sitemapData.vehiclesWeArmor = vehiclesWeArmor;
    sitemapData.blogs = blogs;
    sitemapData.blogEvergreens = blogEvergreens;
    sitemapData.articles = articles;

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
      const rentalUrl = `${baseUrl}/api/inventories?fields[0]=slug&fields[1]=title&locale=en&filters[categories][slug][$in][]=armored-rental&filters[categories][slug][$in][]=alquiler-blindados&pagination[pageSize]=100`;

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

    const allCustomUrls = config.customUrls?.en || [];
    sitemapData.staticPages = allCustomUrls.filter(
      (page) =>
        !page.loc.includes('vehicles-we-armor?make=') &&
        !page.loc.includes('vehicles-we-armor/type/') &&
        !page.loc.includes('vehiculos-que-blindamos')
    );

    return {
      props: { sitemapData },
      revalidate: 3600,
    };
  } catch (error) {
    return {
      props: {
        sitemapData: {
          ...sitemapData,
          vehicleMakes: generateVehicleMakeUrls(),
          staticPages:
            config.customUrls?.en?.filter(
              (page) =>
                !page.loc.includes('vehicles-we-armor?make=') &&
                !page.loc.includes('vehicles-we-armor/type/') &&
                !page.loc.includes('vehiculos-que-blindamos')
            ) || [],
        },
      },
      revalidate: 300,
    };
  }
}

export default Sitemap;
