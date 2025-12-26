import { getPageData } from 'hooks/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import Link from 'next/link';
import Head from 'next/head';
import Button from 'components/global/button/Button';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';

const isValidCategorySlug = (slug, locale = 'en') => {
  const validSlugs = {
    en: [
      'armored-suvs',
      'armored-sedans',
      'armored-pickup-trucks',
      'armored-law-enforcement',
      'armored-cash-in-transit-cit',
      'armored-specialty-vehicles',
      'armored-vans-and-buses',
    ],
    es: [
      'suvs-blindados',
      'sedanes-blindados',
      'camionetas-blindadas',
      'fuerzas-del-orden-blindadas',
      'vehiculos-blindados-especiales',
      'transporte-blindado-valores-cit',
      'furgonetas-y-autobuses-blindados',
    ],
  };

  return validSlugs[locale]?.includes(slug) || false;
};

const getFallbackData = (locale = 'en', categorySlug = '') => {
  if (!isValidCategorySlug(categorySlug, locale)) {
    return null;
  }

  const categoryTitle = categorySlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const getBannerTitle = (categorySlug) => {
    const typeMap = {
      'armored-suvs': 'Armored SUVs',
      'armored-sedans': 'Armored Sedans',
      'armored-pickup-trucks': 'Armored Pickup Trucks',
      'armored-vans-and-buses': 'Armored Vans & Buses',
      'armored-cash-in-transit-cit': 'Armored Cash-in-Transit',
      'armored-swat-trucks': 'Armored SWAT Trucks',
      'armored-limousines': 'Armored Limousines',
      'armored-specialty-vehicles': 'Armored Specialty Vehicles',
    };

    // Return specific title if found, otherwise generate generic one
    return typeMap[categorySlug] || `Armored ${categoryTitle}`;
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
            allBanner: {
              title: getBannerTitle(categorySlug),
              imageMobile: {
                data: {
                  attributes: {
                    mime: 'image/jpeg',
                    url: 'https://assets.alpineco.com/mobile_armored_all_vehicles_bulletproof_25af983bd4.jpg',
                    alternativeText:
                      'A lineup of eight armored or heavily modified trucks and SUVs from Alpine Armoring is displayed on a black surface with a white patterned background. The vehicles vary in size, color, and modifications, including police, military, and utility models.',
                  },
                },
              },
              media: {
                data: {
                  attributes: {
                    mime: 'image/jpeg',
                    url: 'https://assets.alpineco.com/Vehicles_We_Armor_All_64d38daf3b.jpg',
                    alternativeText:
                      'A lineup of eight armored or heavily modified trucks and SUVs from Alpine Armoring is displayed on a black surface with a white patterned background. The vehicles vary in size, color, and modifications, including police, military, and utility models.',
                  },
                },
              },
            },
            bottomText: null,
            faqs_vehicles_we_armor: [],
          },
        },
      ],
      make: [],
    },
    query: categorySlug,
    searchQuery: null,
    seoData: {
      metaTitle: `${getBannerTitle(categorySlug)} | Alpine Armoring`,
      metaDescription:
        locale === 'en'
          ? `Discover Alpine Armoring's ${getBannerTitle(categorySlug)}, offering advanced protection and luxury. Perfect for personal, corporate, and government security solutions.`
          : `Descubra las ${getBannerTitle(categorySlug)} de Alpine Armoring, que ofrecen protección avanzada y lujo. Perfectos para soluciones de seguridad personales, corporativas y gubernamentales.`,
      languageUrls: routes.vehiclesWeArmor.getIndexLanguageUrls(locale),
    },
    isOffline: true, // Flag to indicate fallback mode
  };
};

function Inventory(props) {
  const { lang } = useLocale();
  const router = useRouter();

  const currentCategory = props.filters?.type?.find(
    (item) => item.attributes.slug === props.query
  );
  const topBanner = {
    ...currentCategory?.attributes.allBanner,
    inventory: true,
  };
  const bottomText = currentCategory?.attributes.bottomText;
  const faqs = currentCategory?.attributes.faqs_vehicles_we_armor;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);

  useEffect(() => {
    if (props.searchQuery) {
      setVehiclesData(props.vehicles.data);
    } else {
      setVehiclesData(props.vehicles.data);
    }
  }, [router.query, props.vehicles.data, props.searchQuery]);

  const categoryTitle = currentCategory?.attributes.title || '';
  const categorySlug = currentCategory?.attributes.slug || '';
  const make = router.query.make;

  const formatMakeName = (make) => {
    if (typeof make !== 'string') return '';

    const specialCases = {
      bmw: 'BMW',
      cuda: 'CUDA',
      gmc: 'GMC',
      mastiff: 'MASTIFF',
      pointer: 'POINTER',
    };

    return (
      specialCases[make] ||
      make.charAt(0).toUpperCase() + make.slice(1).replace('-', ' ')
    );
  };

  const categoryTitleWithMake = (
    <>
      {!make && <span>{categoryTitle}</span>}
      {make && (
        <>
          <Link
            href={`${lang.vehiclesWeArmorURL}/${lang.type}/${categorySlug}`}
            className="textWeightMedium"
          >
            {categoryTitle}
          </Link>
          <span>&gt;</span>
          <span>{make}</span>
        </>
      )}
    </>
  );

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang.home,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang.vehiclesWeArmor,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${lang.vehiclesWeArmorURL}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryTitle,
          item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${routes.vehiclesWeArmor.paths[router.locale]}/${lang.type}/${categorySlug}`,
        },
      ],
    };

    if (make) {
      structuredData.itemListElement.push({
        '@type': 'ListItem',
        position: 4,
        name: make,
        item: `${process.env.NEXT_PUBLIC_URL}${router.locale === 'en' ? '' : `/${router.locale}`}${routes.vehiclesWeArmor.paths[router.locale]}/${lang.type}/${categorySlug}?make=${make}`,
      });
    }

    return JSON.stringify(structuredData);
  };

  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs)) return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq, index) => ({
        '@type': 'Question',
        name: faq?.attributes?.title || faq?.title || `FAQ ${index + 1}`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq?.attributes?.text || faq?.text || lang.noAnswerProvided,
        },
      })),
    };

    return JSON.stringify(structuredData);
  };

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

      <div className={`${styles.listing}`}>
        <div
          className={`b-breadcrumbs b-breadcrumbs-list b-breadcrumbs-dark container`}
        >
          <Link href="/">{lang.home}</Link>
          <span>&gt;</span>
          <Link href={`${lang.vehiclesWeArmorURL}`}>
            {lang.vehiclesWeArmor}
          </Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>
            {categoryTitleWithMake}
          </span>
        </div>

        {topBanner && <Banner props={topBanner} shape="white" small />}

        {vehiclesData?.length > 0 && (
          <>
            <p className={`${styles.listing_heading} center container`}>
              {lang.exploreDifferentModels}{' '}
              <strong>{formatMakeName(make)}</strong>
              {categoryTitle
                ? ' ' + categoryTitle.replace('Armored', '').trim()
                : ''}{' '}
              {lang.weArmor}
            </p>
            {/* <p className={`${styles.listing_heading_stock} center container`}>
              See All 
              {categoryTitle ? ' ' + categoryTitle.replace('Armored', '').trim() : ''}{' '}
              that are in stock and available for immediate shipping
            </p> */}
          </>
        )}

        {props.filters.type && (
          <div className={`${styles.listing_all_filters} container`}>
            <Filters props={props.filters} plain />

            {!(
              categorySlug === lang.citURL ||
              categorySlug === lang.vansURL ||
              make
            ) && (
              <div className={`${styles.listing_heading_stock} center`}>
                <Button
                  href={`${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.availableNowURL}/${lang.type}/${categorySlug}`}
                  className={`${styles.listing_heading_button} shiny`}
                >
                  {lang.viewInStockAvailability}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className={`${styles.listing_wrap} container`}>
          {vehiclesData?.length > 0 ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.map((item, index) => (
                <InventoryItem key={item.id} props={item} index={index} />
              ))}
            </div>
          ) : (
            <div className={`${styles.listing_empty}`}>
              {props.isOffline ? (
                <p>{lang.inventorySystemDown}</p>
              ) : (
                <h2>{lang.noVehiclesFound}</h2>
              )}
            </div>
          )}
        </div>
      </div>

      {bottomText && (
        <div className="container_small">
          <div className={`${styles.listing_bottomText} darkColor`}>
            <CustomMarkdown>{bottomText}</CustomMarkdown>
          </div>
        </div>
      )}

      {faqs?.length > 0 && (
        <div className="mt2">
          <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const route = routes.vehiclesWeArmor;
  const paths = [];

  // Generate paths for all vehicle types in all locales
  const vehicleTypeKeys = Object.keys(route.types || {});

  locales.forEach((locale) => {
    vehicleTypeKeys.forEach((typeKey) => {
      const localizedType = route.types[typeKey][locale];
      if (localizedType) {
        paths.push({
          params: { type: typeKey },
          locale,
        });
      }
    });
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  const { locale, params } = context;
  const route = routes.vehiclesWeArmor;
  const englishType = params.type;
  const localizedType = route.getLocalizedType(englishType, locale);

  // No query parameter filtering in getStaticProps - fetch all for this type
  const query = `filters[category][slug][$eq]=${localizedType}`;

  try {
    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: query,
      populate: 'featuredImage, make',
      fields:
        'fields[0]=title&fields[1]=slug&fields[2]=order&fields[3]=orderCategory',
      pageSize: 100,
      locale,
    });

    if (!vehicles || !vehicles.data) {
      throw new Error('Invalid vehicles data received from Strapi');
    }

    // Sort vehicles by orderCategory or order
    if (vehicles.data) {
      vehicles.data.sort((a, b) => {
        const aSort =
          a.attributes.orderCategory !== null &&
          a.attributes.orderCategory !== undefined
            ? a.attributes.orderCategory
            : (a.attributes.order ?? 999);

        const bSort =
          b.attributes.orderCategory !== null &&
          b.attributes.orderCategory !== undefined
            ? b.attributes.orderCategory
            : (b.attributes.order ?? 999);

        return aSort - bSort;
      });
    }

    const [type, make] = await Promise.all([
      getPageData({
        route: 'categories',
        sort: 'order',
        fields:
          'fields[0]=title&fields[1]=slug&fields[2]=bottomText&fields[3]=heading',
        populate:
          'allBanner.media, allBanner.imageMobile, allBanner.mediaMP4, seo.metaImage, seo.metaSocial, faqs_vehicles_we_armor, inventory_vehicles',
        locale,
      })
        .then((res) => res?.data || [])
        .catch(() => []),
      getPageData({
        route: 'makes',
        custom:
          'fields[0]=title&fields[1]=slug&pagination[pageSize]=100&sort[0]=title&populate[vehicles_we_armors][fields][0]=id&populate[vehicles_we_armors][populate][category][fields][0]=slug',
      })
        .then((res) => res?.data || [])
        .catch(() => []),
    ]);

    const filters = {
      type: Array.isArray(type) ? type : [],
      make: Array.isArray(make) ? make : [],
    };

    const categoryData = type?.find(
      (item) => item.attributes.slug === params.type
    );

    // Language URLs logic
    let correctEnglishType, correctSpanishType;

    if (locale === 'en') {
      correctEnglishType = params.type;
      correctSpanishType = route.getLocalizedType(correctEnglishType, 'es');
    } else {
      const types = route.types || {};
      for (const [engType, translations] of Object.entries(types)) {
        if (
          translations &&
          typeof translations === 'object' &&
          'es' in translations &&
          translations.es === params.type
        ) {
          correctEnglishType = engType;
          break;
        }
      }
      correctEnglishType = correctEnglishType || englishType;
      correctSpanishType = params.type;
    }

    const languageUrls = {
      en: `${route.paths.en}/type/${correctEnglishType}`,
      es: `/${locale === 'en' ? 'es' : locale}${route.paths.es}/tipo/${correctSpanishType}`,
    };

    const seoData = {
      ...(categoryData?.attributes.seo || {}),
      languageUrls,
      metaTitle: `${categoryData?.attributes.seo?.metaTitle || ''} | Alpine Armoring®`,
    };

    if (!vehicles || vehicles.data === undefined) {
      const fallbackData = getFallbackData(locale, englishType || '');

      if (!fallbackData) {
        return { notFound: true };
      }

      return {
        props: {
          ...fallbackData,
          locale,
        },
        revalidate: 60,
      };
    }

    return {
      props: {
        vehicles,
        filters,
        seoData,
        query: localizedType,
        searchQuery: null,
        locale,
      },
      revalidate: 3600, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error('Strapi connection failed:', error);

    // Return fallback data instead of 404
    const fallbackData = getFallbackData(locale, englishType || '');

    if (!fallbackData) {
      return { notFound: true };
    }

    return {
      props: {
        ...fallbackData,
        locale,
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}

export default Inventory;
