import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import Link from 'next/link';
import Head from 'next/head';
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
                    url: 'https://d102sycao8uwt8.cloudfront.net/mobile_armored_all_vehicles_bulletproof_25af983bd4.jpg',
                    alternativeText:
                      'A lineup of eight armored or heavily modified trucks and SUVs from Alpine Armoring is displayed on a black surface with a white patterned background. The vehicles vary in size, color, and modifications, including police, military, and utility models.',
                  },
                },
              },
              media: {
                data: {
                  attributes: {
                    mime: 'image/jpeg',
                    url: 'https://d102sycao8uwt8.cloudfront.net/Vehicles_We_Armor_All_64d38daf3b.jpg',
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
  const topBanner = currentCategory?.attributes.allBanner;
  const bottomText = currentCategory?.attributes.bottomText;
  const faqs = currentCategory?.attributes.faqs_vehicles_we_armor;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    !props.searchQuery && props.vehicles.data.length === 12
  );

  const fetchMoreItems = useCallback(async () => {
    if (loading || !hasMore || props.searchQuery) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    try {
      let query = `filters[category][slug][$eq]=${props.query}`;
      if (router.query.make) {
        query += `&filters[make][slug][$eqi]=${router.query.make}`;
      }
      if (router.query.q) {
        query += `&filters[slug][$notNull]=true`;
      }

      const newVehicles = await getPageData({
        route: routes.vehiclesWeArmor.collectionSingle,
        params: query + `&pagination[page]=${nextPage}&pagination[pageSize]=12`,
        populate: 'featuredImage, make',
        fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
        sort: 'order',
        locale: router.locale,
      });

      if (newVehicles?.data) {
        setVehiclesData((prev) => [...prev, ...newVehicles.data]);
        setCurrentPage(nextPage);
        setHasMore(newVehicles.data.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more vehicles:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    currentPage,
    router.query,
    router.locale,
    props.query,
    props.searchQuery,
  ]);

  // Reset state when filters change
  useEffect(() => {
    if (props.searchQuery) {
      setVehiclesData(props.vehicles.data);
      setHasMore(false);
    } else {
      setVehiclesData(props.vehicles.data);
      setHasMore(props.vehicles.data.length === 12);
    }
    setCurrentPage(1);
  }, [router.query, props.vehicles.data, props.searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (props.searchQuery) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreItems();
        }
      },
      {
        rootMargin: '0px 0px 20%',
        threshold: 0,
      }
    );

    const target = document.querySelector('.bottomObserver');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [fetchMoreItems, props.searchQuery]);

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

  console.log(props);
  console.log(vehiclesData);

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
          <p className={`${styles.listing_heading} center container`}>
            {lang.exploreDifferentModels}{' '}
            <strong>{formatMakeName(make)}</strong>
            {categoryTitle
              ? ' ' + categoryTitle.replace('Armored', '').trim()
              : ''}{' '}
            {lang.weArmor}
          </p>
        )}

        {props.filters.type && (
          <div className={`${styles.listing_all_filters} container`}>
            <Filters props={props.filters} plain />
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

      {hasMore && !props.searchQuery && <div className="bottomObserver"></div>}

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

      {loading && (
        <div
          className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
          style={{ opacity: 1 }}
        >
          {lang.loading}
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
  );

  const { locale } = context;
  const route = routes.vehiclesWeArmor;
  const englishType = context.query.type;
  const localizedType = route.getLocalizedType(englishType, locale);
  const { make: queryMake, q: queryQ } = context.query;

  let pageSize = 12;
  let searchQuery = null;
  let query = `filters[category][slug][$eq]=${localizedType}`;

  if (queryMake) {
    query += `&filters[make][slug][$eqi]=${queryMake}`;
  }
  if (queryQ) {
    query += `&filters[slug][$notNull]=true`;
    pageSize = 100;
    searchQuery = true;
  }

  try {
    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: query,
      populate: 'featuredImage, make',
      fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
      pageSize,
      sort: 'order',
      locale,
    });

    if (!vehicles || !vehicles.data) {
      throw new Error('Invalid vehicles data received from Strapi');
    }

    const filteredVehicles = {
      ...vehicles,
      data:
        vehicles.data.filter((vehicle) => {
          if (!queryQ) return true;
          const searchTerms = String(queryQ)
            .toLowerCase()
            .replace(/[-\s]/g, '');
          const slug = String(vehicle.attributes.slug || '')
            .toLowerCase()
            .replace(/[-\s]/g, '');
          return slug.includes(searchTerms);
        }) || [],
    };

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
      (item) => item.attributes.slug === context.query.type
    );

    const makeMetaTitle = queryMake
      ? ` ${queryMake
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}`
      : '';

    // Language URLs logic
    let correctEnglishType, correctSpanishType;

    if (locale === 'en') {
      correctEnglishType = context.query.type;
      correctSpanishType = route.getLocalizedType(correctEnglishType, 'es');
    } else {
      const types = route.types || {};
      for (const [engType, translations] of Object.entries(types)) {
        if (
          translations &&
          typeof translations === 'object' &&
          'es' in translations &&
          translations.es === context.query.type
        ) {
          correctEnglishType = engType;
          break;
        }
      }
      correctEnglishType = correctEnglishType || englishType;
      correctSpanishType = context.query.type;
    }

    const languageUrls = {
      en: `${route.paths.en}/type/${correctEnglishType}`,
      es: `/${locale === 'en' ? 'es' : locale}${route.paths.es}/tipo/${correctSpanishType}`,
    };

    const seoData = {
      ...(categoryData?.attributes.seo || {}),
      languageUrls,
      metaTitle: `${categoryData?.attributes.seo.metaTitle}${makeMetaTitle} | Alpine Armoring®`,
    };

    // Update meta description for make-specific pages
    if (queryMake && seoData?.metaDescription) {
      const formattedMake = queryMake
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const specialReplacements = {
        'armored-vans-and-buses': /Vans\s*(?:&|and)\s*Buses/i,
        'armored-cash-in-transit-cit': /cash[-\s]in[-\s]transit/i,
      };

      const specialPattern = specialReplacements[context.query.type];
      let updatedDescription = seoData.metaDescription;

      if (specialPattern) {
        updatedDescription = updatedDescription.replace(
          specialPattern,
          (match) => `${formattedMake} ${match}`
        );
      } else {
        const vehicleTypeRaw = context.query.type
          .split('-')
          .slice(1)
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join('\\s*');

        const vehicleTypeRegexWithArmored = new RegExp(
          `(Armored\\s*${vehicleTypeRaw})\\b`,
          'i'
        );
        const vehicleTypeRegexWithoutArmored = new RegExp(
          `(${vehicleTypeRaw})\\b`,
          'i'
        );

        updatedDescription = updatedDescription.replace(
          vehicleTypeRegexWithArmored,
          (match) => `${formattedMake} ${match}`
        );

        if (updatedDescription === seoData.metaDescription) {
          updatedDescription = updatedDescription.replace(
            vehicleTypeRegexWithoutArmored,
            (match) => `${formattedMake} ${match}`
          );
        }
      }

      seoData.metaDescription = updatedDescription;
    }

    if (!vehicles?.data?.length) {
      return { notFound: true };
    }

    return {
      props: {
        vehicles: filteredVehicles,
        filters,
        seoData,
        query: localizedType,
        searchQuery,
        locale,
      },
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
    };
  }
}

export default Inventory;
