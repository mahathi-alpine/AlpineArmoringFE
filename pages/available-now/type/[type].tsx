import { getPageData } from 'hooks/api';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import styles from '/components/listing/Listing.module.scss';
import Banner from 'components/global/banner/Banner';
import Link from 'next/link';
import routes from 'routes';
import useLocale, { getLocaleStrings } from 'hooks/useLocale';
import Head from 'next/head';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import Button from 'components/global/button/Button';
import Accordion from 'components/global/accordion/Accordion';
import CustomMarkdown from 'components/CustomMarkdown';

const isValidCategorySlug = (slug, locale = 'en') => {
  const validSlugs = {
    en: [
      'special-of-the-month',
      'armored-suvs',
      'armored-sedans',
      'armored-pickup-trucks',
      'armored-law-enforcement',
      'armored-specialty-vehicles',
      'armored-pre-owned',
      'armored-rental',
    ],
    es: [
      'especial-del-mes',
      'suvs-blindados',
      'sedanes-blindados',
      'camionetas-blindadas',
      'fuerzas-del-orden-blindadas',
      'vehiculos-blindados-especiales',
      'blindados-pre-usados',
      'alquiler-blindados',
    ],
  };

  return validSlugs[locale]?.includes(slug) || false;
};

const getFallbackData = (locale = 'en', categorySlug = '') => {
  const lang = getLocaleStrings(locale);

  if (!isValidCategorySlug(categorySlug, locale)) {
    return null;
  }

  const categoryTitle = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const getBannerTitle = (categorySlug) => {
    const typeMap = {
      'armored-suvs': 'Armored SUVs for Sale',
      'armored-sedans': 'Armored Sedans for Sale',
      'armored-pickup-trucks': 'Armored Pickup Trucks for Sale',
      'armored-vans-and-buses': 'Armored Vans & Buses for Sale',
      'armored-cash-in-transit-cit': 'Armored Cash-in-Transit for Sale',
      'armored-swat-trucks': 'Armored SWAT Trucks for Sale',
      'armored-limousines': 'Armored Limousines for Sale',
      'armored-specialty-vehicles': 'Armored Specialty Vehicles for Sale',
    };

    return typeMap[categorySlug] || `Armored ${categoryTitle} for Sale`;
  };

  return {
    vehicles: { data: [] },
    filters: {
      type: [
        {
          attributes: {
            slug: categorySlug,
            title: categorySlug
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
            inventoryBanner: {
              title: getBannerTitle(categorySlug),
              subtitle: lang.availableForImmediateShipping,
              media: {
                data: {
                  attributes: {
                    mime: 'video/webm',
                    url: 'https://d102sycao8uwt8.cloudfront.net/All_vehciles_filter_banner_8_26_9dbb6fe2dd.webm',
                  },
                },
              },
              mediaMP4: {
                data: {
                  attributes: {
                    mime: 'video/mp4',
                    url: 'https://d102sycao8uwt8.cloudfront.net/All_Vehicles_Filter_Banner_8_26_10f8b42114.mp4',
                  },
                },
              },
            },
            bottomText: null,
          },
        },
      ],
    },
    query: categorySlug,
    searchQuery: null,
    seoData: {
      metaTitle: `${getBannerTitle(categorySlug)} | Alpine Armoring`,
      metaDescription:
        locale === 'en'
          ? `Discover Alpine Armoring's ${getBannerTitle(categorySlug)}, offering advanced protection and luxury. Perfect for personal, corporate, and government security solutions.`
          : `Explore los ${getBannerTitle(categorySlug)} En venta de Alpine Armoring con protección y tecnología avanzadas, perfectos para necesidades de seguridad personales, empresariales o gubernamentales.`,
      languageUrls: {
        en: `/available-now/type/${categorySlug}`,
        es: `/es/disponible-ahora/tipo/${categorySlug}`,
      },
    },
    isOffline: true,
  };
};

function Inventory(props) {
  const { lang } = useLocale();
  const router = useRouter();

  // Use context data if available, fallback to props
  const vehicles = props.vehicles;
  const filters = props.filters;
  const query = props.query;
  const pageData = props.pageData;
  console.log(props);
  const currentCategory = filters?.type?.find(
    (item) => item.attributes.slug === query
  );
  const topBanner = currentCategory?.attributes.inventoryBanner;
  const bottomText = currentCategory?.attributes.bottomTextInventory;
  let faqs = currentCategory?.attributes.faqs_stock;
  faqs = faqs?.length == 0 ? pageData?.faqs : faqs;

  const categoryTitle = currentCategory?.attributes.title;
  const categorySlug = currentCategory?.attributes.slug;

  const currentPath = router.asPath;

  // Static data - all vehicles for this category are pre-loaded
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [itemsToRender, setItemsToRender] = useState(6);
  // const [loading, setLoading] = useState(false);

  // Update vehicles when props or context data changes (category switch)
  useEffect(() => {
    const vehicleData = vehicles?.data || [];
    setAllVehicles(vehicleData);
    setFilteredVehicles(vehicleData);
    setItemsToRender(6); // Reset pagination
  }, [vehicles]);

  // Handle client-side search filtering
  useEffect(() => {
    if (!router.isReady || !allVehicles.length) return;

    const { q: searchQuery } = router.query;
    let filtered = allVehicles.filter((vehicle) => !vehicle.attributes?.hide);

    // Apply search filter if present
    if (searchQuery && typeof searchQuery === 'string') {
      const searchTerms = searchQuery.toLowerCase().replace(/[-\s]/g, '');
      filtered = filtered.filter((vehicle) => {
        const slug =
          vehicle.attributes?.slug?.toLowerCase().replace(/[-\s]/g, '') || '';
        return slug.includes(searchTerms);
      });
    }

    setFilteredVehicles(filtered);

    // Reset pagination when search changes
    if (searchQuery) {
      setItemsToRender(filtered.length); // Show all search results
    } else {
      setItemsToRender(6); // Reset to initial amount
    }
  }, [router.query.q, router.isReady, allVehicles]);

  const fetchMoreItems = useCallback(() => {
    if (itemsToRender < (filteredVehicles?.length || 0)) {
      // setLoading(true);
      setItemsToRender((prevItemsToRender) =>
        Math.min(prevItemsToRender + 6, filteredVehicles?.length || 0)
      );
      // setLoading(false);
    }
  }, [itemsToRender, filteredVehicles]);

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);

            if (entry.target.classList.contains('bottomObserver')) {
              fetchMoreItems();
            }
          }
        });
      },
      {
        rootMargin: '0px 0px 20%',
        threshold: 0,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [itemsToRender, fetchMoreItems]);

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang.home,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang.availableNowTitle,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${routes.inventory.paths[router.locale]}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryTitle,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${routes.inventory.paths[router.locale]}/${lang.type}/${categorySlug}`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

  // FAQ structured data
  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs)) {
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq, index) => {
        const title =
          faq?.attributes?.title ||
          faq?.title ||
          `${lang.frequentlyAskedQuestions} ${index + 1}`;
        const text =
          faq?.attributes?.text || faq?.text || lang.noAnswerProvided;

        return {
          '@type': 'Question',
          name: title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: text,
          },
        };
      }),
    };

    return JSON.stringify(structuredData);
  };

  // Get vehicles to display based on current pagination
  const vehiclesToDisplay = filteredVehicles.slice(0, itemsToRender);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getBreadcrumbStructuredData() }}
          key="breadcrumb-jsonld"
        />
        {faqs?.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
      </Head>

      <div className={`${styles.listing} background-dark`}>
        <div className={`b-breadcrumbs b-breadcrumbs-list container`}>
          <Link href="/">{lang.home}</Link>
          <span>&gt;</span>
          <Link href={`/${lang.availableNowURL}`}>
            {lang.availableNowTitle}
          </Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>{categoryTitle}</span>
        </div>

        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        {currentPath.includes(lang.armoredRentalURL) ? (
          <div className={`${styles.listing_rentalsCTA}`}>
            <Button
              href="https://www.armoredautos.com/armored-rentals?ref=mainWebsite"
              target
              className={`primary rounded`}
              attention
            >
              {lang.visitOurRentalsWebsite}
            </Button>
          </div>
        ) : null}

        <div
          className={`
            ${styles.listing_wrap} 
            ${styles.listing_wrap_inventory} 
            ${
              currentPath.includes(
                `/${lang.availableNowURL}/${lang.type}/${lang.armoredRentalURL}`
              )
                ? styles.listing_wrap_rental
                : ''
            }
            container`}
        >
          {!currentPath.includes(lang.armoredRentalURL) &&
          filters?.type?.length > 0 &&
          filteredVehicles.length > 0 ? (
            <div className={`${styles.listing_wrap_filtered}`}>
              <Filters props={filters} />
            </div>
          ) : null}

          <div className={`${styles.listing_wrap_shown}`}>
            {vehiclesToDisplay && vehiclesToDisplay.length > 0 ? (
              <div className={`${styles.listing_list}`}>
                {vehiclesToDisplay.reduce((acc, item, index) => {
                  if (item.attributes?.ownPage !== false) {
                    acc[index] = (
                      <InventoryItem key={item.id} props={item} index={index} />
                    );
                  }
                  return acc;
                }, [])}
              </div>
            ) : (
              <div className={`${styles.listing_list_error}`}>
                {props.isOffline ? (
                  <>
                    <p>{lang.inventorySystemDown}</p>
                  </>
                ) : (
                  <h2>{lang.noVehiclesFound}</h2>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Only show intersection observer if there are more items to load */}
        {itemsToRender < filteredVehicles.length && (
          <div className={`observe bottomObserver`}></div>
        )}

        {bottomText ? (
          <div className={`container_small`}>
            <div className={`${styles.listing_bottomText}`}>
              <CustomMarkdown>{bottomText}</CustomMarkdown>
            </div>
          </div>
        ) : null}

        {faqs?.length > 0 ? (
          <div className={`${styles.listing_faqs}`}>
            <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
          </div>
        ) : null}
      </div>

      {/* <div
        className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        {lang.loading}
      </div> */}

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

// Convert to static generation with ISR
export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const lang = getLocaleStrings(locale);
  const route = routes.inventory;

  try {
    let pageData = await getPageData({
      route: route.collection,
      populate: 'faqs',
      fields: '',
      locale,
    });
    pageData = pageData.data?.attributes || null;

    const englishType = context.params.type;
    const localizedType = route.getLocalizedType(englishType, locale);

    // Fetch vehicles for this specific category
    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: `filters[categories][slug][$eq]=${localizedType}`,
      sort: 'order',
      populate: 'featuredImage',
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=ownPage&fields[9]=hide&fields[10]=rentalsVehicleID&fields[11]=trans',
      pageSize: 100,
      locale,
    });

    if (!vehicles || !vehicles.data) {
      throw new Error('Invalid vehicles data received from Strapi');
    }

    // Filter out hidden vehicles at build time
    const filteredVehicles = {
      ...vehicles,
      data:
        vehicles.data?.filter((vehicle) => vehicle.attributes.hide !== true) ||
        [],
    };

    // Fetching Types for the Filters
    const type = await getPageData({
      route: 'categories',
      custom: `populate[inventory_vehicles][fields][0]=''&populate[inventoryBanner][populate][media][fields][0]=url&populate[inventoryBanner][populate][media][fields][1]=mime&populate[inventoryBanner][populate][media][fields][2]=alternativeText&populate[inventoryBanner][populate][media][fields][3]=width&populate[inventoryBanner][populate][media][fields][4]=height&populate[inventoryBanner][populate][media][fields][5]=formats&populate[inventoryBanner][populate][mediaMP4][fields][0]=url&populate[inventoryBanner][populate][mediaMP4][fields][1]=mime&populate[seo][populate][metaImage][fields][0]=url&populate[seo][populate][metaSocial][fields][0]=url&sort=order:asc&fields[0]=title&fields[1]=slug&fields[2]=bottomTextInventory&populate[inventoryBanner][populate][imageMobile][fields][0]=url&populate[inventoryBanner][populate][imageMobile][fields][1]=mime&populate[inventoryBanner][populate][imageMobile][fields][2]=alternativeText&populate[inventoryBanner][populate][imageMobile][fields][3]=width&populate[inventoryBanner][populate][imageMobile][fields][4]=height&populate[inventoryBanner][populate][imageMobile][fields][5]=formats&populate[faqs_stock][fields][0]=title&populate[faqs_stock][fields][1]=text`,
      locale,
    }).then((response) => response?.data || []);

    const filters = type ? { type } : {};

    let seoData = filters.type?.find(
      (item) => item.attributes.slug === context.params.type
    );

    // All languages urls
    let correctEnglishType;
    let correctSpanishType;

    if (locale === 'en') {
      correctEnglishType = context.params.type;
      correctSpanishType = route.getLocalizedType(correctEnglishType, 'es');
    } else {
      const types = route.types || {};

      for (const [engType, translations] of Object.entries(types)) {
        if (
          translations &&
          typeof translations === 'object' &&
          'es' in translations &&
          translations.es === context.params.type
        ) {
          correctEnglishType = engType;
          break;
        }
      }

      if (!correctEnglishType) {
        correctEnglishType = englishType;
      }

      correctSpanishType = context.params.type;
    }

    const languageUrls = {
      en: `${route.paths.en}/type/${correctEnglishType}`,
      es: `/${locale === 'en' ? 'es' : locale}${route.paths.es}/tipo/${correctSpanishType}`,
    };

    seoData = {
      ...(seoData?.attributes?.seo || {}),
      languageUrls,
    };

    if (seoData) {
      // Modify meta title
      seoData.metaTitle = `${seoData.metaTitle}${context.params.type !== lang.armoredRentalURL && context.params.type !== lang.preOwnedURL ? ` ${lang.forSale}` : ''} | Alpine Armoring`;

      // Modify meta description only when not armored-rental
      if (
        context.params.type &&
        context.params.type !== lang.armoredRentalURL &&
        context.params.type !== lang.preOwnedURL
      ) {
        const vehicleTypeRaw = context.params.type
          .split('-')
          .slice(1) // Remove the 'armored' part
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('\\s*');

        // Create regexes to match with and without 'armored'
        const vehicleTypeRegexWithArmored = new RegExp(
          `(${lang.armored}\\s*${vehicleTypeRaw})\\b`,
          'i'
        );
        const vehicleTypeRegexWithoutArmored = new RegExp(
          `(${vehicleTypeRaw})\\b`,
          'i'
        );

        // Replace with 'for sale', first with 'armored' version, then without
        let updatedDescription = seoData?.metaDescription?.replace(
          vehicleTypeRegexWithArmored,
          (match) => `${match} ${lang.forSale}`
        );

        if (updatedDescription === seoData?.metaDescription) {
          updatedDescription = updatedDescription?.replace(
            vehicleTypeRegexWithoutArmored,
            (match) => `${match} ${lang.forSale}`
          );
        }

        seoData.metaDescription = updatedDescription;
      }
    }

    return {
      props: {
        pageData,
        vehicles: filteredVehicles,
        filters,
        query: context.params.type,
        seoData,
        locale,
      },
      revalidate: 21600, // Revalidate every 6 hours
    };
  } catch (error) {
    console.error('Strapi connection failed:', error);

    // Return fallback data instead of crashing
    const fallbackData = getFallbackData(locale, context.params.type || '');

    if (!fallbackData) {
      return { notFound: true };
    }

    return {
      props: {
        ...fallbackData,
        locale,
      },
      revalidate: 21600, // Still revalidate even with fallback data
    };
  }
}

// Generate static paths for all category pages
export async function getStaticPaths() {
  const locales = ['en', 'es'];
  const paths = [];

  const categorySlugs = {
    en: [
      'special-of-the-month',
      'armored-suvs',
      'armored-sedans',
      'armored-pickup-trucks',
      'armored-law-enforcement',
      'armored-specialty-vehicles',
      'armored-pre-owned',
      'armored-rental',
    ],
    es: [
      'especial-del-mes',
      'suvs-blindados',
      'sedanes-blindados',
      'camionetas-blindadas',
      'fuerzas-del-orden-blindadas',
      'vehiculos-blindados-especiales',
      'blindados-pre-usados',
      'alquiler-blindados',
    ],
  };

  // Generate paths for each locale and category
  for (const locale of locales) {
    const slugs = categorySlugs[locale] || [];
    for (const slug of slugs) {
      paths.push({
        params: { type: slug },
        locale,
      });
    }
  }

  return {
    paths,
    // Enable ISR for new categories that might be added
    fallback: 'blocking',
  };
}

export default Inventory;
