import React from 'react';
import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import routes from 'routes';
import {
  useLanguageData,
  withLanguageContext,
} from 'components/LanguageContext';
import Head from 'next/head';
import styles from '/components/listing/Listing.module.scss';
import useLocale from 'hooks/useLocale';

import Loader from 'components/global/loader/Loader';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';
import Content from 'components/global/content/Content';

const ITEMS_TO_DISPLAY = 6;

const getFallbackData = (locale = 'en') => ({
  pageData: {
    seo: {
      metaTitle:
        locale === 'en'
          ? 'Armored Vehicles For Sale: Bulletproof Cars, SUVs, Trucks | Alpine Armoring®'
          : 'Vehículos blindados en venta | Alpine Blindaje Vehículos a prueba de balas',
      metaDescription:
        locale === 'en'
          ? 'Armored vehicles for sale by Alpine Armoring. Find bulletproof SUVs, sedans, vans, and trucks with top-level protection that are completed and available for immediate shipping.'
          : 'Vehículos blindados en venta por Alpine Armoring. Encuentre todoterrenos, camiones, furgonetas, autobuses y sedanes blindados con protección de alto nivel. Envío mundial disponible.',
    },
    banner: {
      title:
        locale === 'en'
          ? 'Armored Vehicles for Sale'
          : 'Vehículos blindados en venta',
      subtitle:
        locale === 'en'
          ? '(SUVs, Sedans, Vans, and Trucks) that are <b>completed and available for immediate shipping</b>'
          : '(SUVs, Sedanes, Furgonetas y Camiones) que están <b>completados y disponibles para envío inmediato</b>',
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
    bottomTextDynamic: null,
    faqs: [],
  },
  vehicles: { data: [], meta: { pagination: { total: 0 } } },
  filters: {},
  searchQuery: null,
  isOffline: true,
});

function Inventory(props) {
  const { lang } = useLocale();
  const router = useRouter();

  const { currentData, isLoading, error } = useLanguageData();

  // FIXED: Always prioritize currentData over props
  // The debug logs show currentData has the right structure when it exists
  let pageData, vehicles, filters, searchQuery;

  if (currentData && Object.keys(currentData).length > 0) {
    if (currentData.pageData) {
      // Full inventory structure from context
      pageData = currentData.pageData;
      vehicles = currentData.vehicles;
      filters = currentData.filters;
      searchQuery = currentData.searchQuery;
    } else if (currentData.banner || currentData.seo || currentData.updatedAt) {
      // Direct page data from context
      pageData = currentData;
      vehicles = props.vehicles || { data: [] };
      filters = props.filters || {};
      searchQuery = props.searchQuery || null;
    } else {
      // Unknown currentData structure, use props with fallback
      pageData = props.pageData;
      vehicles = props.vehicles;
      filters = props.filters;
      searchQuery = props.searchQuery;
    }
  } else {
    // No currentData, use props
    pageData = props.pageData;
    vehicles = props.vehicles;
    filters = props.filters;
    searchQuery = props.searchQuery;
  }

  // CRITICAL FIX: If we still don't have data, use fallback based on current locale
  if (!pageData || !vehicles || Object.keys(props).length === 0) {
    const fallback = getFallbackData(router.locale);
    pageData = pageData || fallback.pageData;
    vehicles = vehicles || fallback.vehicles;
    filters = filters || fallback.filters;
    searchQuery = searchQuery || fallback.searchQuery;
  }

  const topBanner = pageData?.banner;
  const bottomText = pageData?.bottomText;
  const bottomTextContent = {
    dynamicZone: pageData?.bottomTextDynamic || [],
  };
  const faqs = pageData?.faqs;

  const { q, vehicles_we_armor, vehiculos_que_blindamos } = router.query;

  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [displayedVehicles, setDisplayedVehicles] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visibleCount, setVisibleCount] = useState(ITEMS_TO_DISPLAY);

  useEffect(() => {
    const vehicleData = vehicles?.data || [];
    setAllVehicles(vehicleData);
    setFilteredVehicles(vehicleData);
    setDisplayedVehicles(
      searchQuery ? vehicleData : vehicleData.slice(0, ITEMS_TO_DISPLAY)
    );
  }, [vehicles, searchQuery]);

  useEffect(() => {
    if (!allVehicles.length) return;

    let filtered = allVehicles.filter((vehicle) => !vehicle.attributes?.hide);

    if (q && typeof q === 'string') {
      const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
      filtered = filtered.filter((vehicle) => {
        const slug =
          vehicle.attributes?.slug?.toLowerCase().replace(/[-\s]/g, '') || '';
        return slug.includes(searchTerms);
      });
    }

    if (
      (vehicles_we_armor && typeof vehicles_we_armor === 'string') ||
      (vehiculos_que_blindamos && typeof vehiculos_que_blindamos === 'string')
    ) {
      const categorySlug = vehicles_we_armor || vehiculos_que_blindamos;
      if (typeof categorySlug === 'string') {
        const searchTerms = categorySlug.toLowerCase().replace(/[-\s]/g, '');
        filtered = filtered.filter((vehicle) => {
          const slug =
            vehicle.attributes?.slug?.toLowerCase().replace(/[-\s]/g, '') || '';
          return slug.includes(searchTerms);
        });
      }
    }

    setFilteredVehicles(filtered);

    if (q || vehicles_we_armor || vehiculos_que_blindamos) {
      setDisplayedVehicles(filtered);
      setVisibleCount(filtered.length);
    } else {
      setDisplayedVehicles(filtered.slice(0, ITEMS_TO_DISPLAY));
      setVisibleCount(ITEMS_TO_DISPLAY);
    }
  }, [q, vehicles_we_armor, vehiculos_que_blindamos, allVehicles]);

  const handleIntersection = useCallback(async () => {
    if (q || vehicles_we_armor || vehiculos_que_blindamos) return;

    const nextBatchStart = displayedVehicles.length;
    const remainingItems = filteredVehicles.length - nextBatchStart;

    if (remainingItems > 0) {
      const itemsToAdd = Math.min(remainingItems, ITEMS_TO_DISPLAY);
      const nextBatch = filteredVehicles.slice(
        nextBatchStart,
        nextBatchStart + itemsToAdd
      );

      setDisplayedVehicles((prev) => [...prev, ...nextBatch]);
      setVisibleCount((prev) => prev + itemsToAdd);
    }
  }, [
    filteredVehicles,
    displayedVehicles.length,
    q,
    vehicles_we_armor,
    vehiculos_que_blindamos,
  ]);

  useEffect(() => {
    if (q || vehicles_we_armor || vehiculos_que_blindamos) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.classList.contains('bottomObserver')
          ) {
            handleIntersection();
          }
        });
      },
      {
        rootMargin: '0px 0px 20%',
        threshold: 0,
      }
    );

    const target = document.querySelector('.bottomObserver');
    if (target) observer.observe(target);

    return () => observer.disconnect();
  }, [handleIntersection, q, vehicles_we_armor, vehiculos_que_blindamos]);

  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const contentRef = useRef(null);
  const toggleContent = () => {
    setIsContentExpanded(!isContentExpanded);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div>
          {lang?.inventorySystemDown || 'System temporarily unavailable'}:{' '}
          <br /> {error}
        </div>
      </div>
    );
  }

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: lang?.home || 'Home',
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang?.availableNowTitle || 'Available Now',
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${routes?.inventory?.paths?.[router.locale] || '/available-now'}`,
        },
      ],
    };
    return JSON.stringify(structuredData);
  };

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
          `${lang?.frequentlyAskedQuestions || 'FAQ'} ${index + 1}`;
        const text =
          faq?.attributes?.text ||
          faq?.text ||
          lang?.noAnswerProvided ||
          'No answer provided';

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
          <Link href="/">{lang?.home || 'Home'}</Link>
          <span>&gt;</span>
          {lang?.availableNowTitle || 'Available Now'}
        </div>

        {topBanner && <Banner props={topBanner} shape="dark" />}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          <div className={`${styles.listing_wrap_filtered}`}>
            {filters?.type && <Filters props={filters} />}
          </div>

          <div className={`${styles.listing_wrap_shown}`}>
            {!displayedVehicles?.length ? (
              <div className={`${styles.listing_list_error}`}>
                <h2>{lang?.noVehiclesFound || 'Loading vehicles...'}</h2>
              </div>
            ) : (
              <div className={`${styles.listing_list}`}>
                {displayedVehicles.map((item, index) => (
                  <InventoryItem
                    key={item.id || index}
                    props={item}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {!q && !vehicles_we_armor && !vehiculos_que_blindamos && (
          <div className={`observe bottomObserver`}></div>
        )}

        {bottomText && bottomTextContent.dynamicZone.length == 0 && (
          <div className={`container_small`}>
            <div className={`${styles.listing_bottomText}`}>
              <CustomMarkdown>{bottomText}</CustomMarkdown>
            </div>
          </div>
        )}

        {bottomTextContent.dynamicZone.length > 0 && (
          <div className={`${styles.listing_bottomContent} static`}>
            <div
              ref={contentRef}
              className={`${styles.listing_content_preview} container_small`}
              style={{
                maxHeight: isContentExpanded
                  ? `${contentRef.current?.scrollHeight}px`
                  : '265px',
              }}
            >
              <Content data={bottomTextContent} />
            </div>

            {!isContentExpanded && (
              <div className={`${styles.listing_content_overlay}`}></div>
            )}

            <button
              className={`${styles.listing_more}`}
              onClick={toggleContent}
            >
              {isContentExpanded ? 'Read Less' : 'Read More'}
            </button>
          </div>
        )}

        {faqs?.length > 0 ? (
          <div className={`${styles.listing_faqs}`}>
            <Accordion
              items={faqs}
              title={lang?.frequentlyAskedQuestions || 'FAQ'}
            />
          </div>
        ) : null}
      </div>

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

// CRITICAL: Add getStaticPaths to ensure Spanish pages are built
export async function getStaticPaths() {
  return {
    paths: [
      { params: {}, locale: 'en' },
      { params: {}, locale: 'es' },
    ],
    fallback: false, // Set to false to ensure all pages are pre-built
  };
}

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const route = routes.inventory;

  console.log(`[getStaticProps] Building inventory for locale: ${locale}`);

  try {
    let pageData = await getPageData({
      route: route.collection,
      locale,
    });
    pageData = pageData.data?.attributes || null;

    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: '',
      sort: 'order',
      populate: 'featuredImage',
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
      pageSize: 100,
      locale,
    });

    const type = await getPageData({
      route: 'categories',
      custom:
        "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
      locale,
    }).then((response) => response.data);

    const filters = type ? { type } : {};

    const seoData = {
      ...(pageData?.seo || {}),
      languageUrls: route.getIndexLanguageUrls(locale),
    };

    console.log(`[getStaticProps] Success for ${locale}:`, {
      hasPageData: !!pageData,
      vehicleCount: vehicles?.data?.length || 0,
      hasFilters: !!filters,
      pageTitle: pageData?.banner?.title,
    });

    return {
      props: {
        pageData,
        vehicles,
        filters,
        seoData,
        searchQuery: null,
        locale,
      },
      revalidate: 21600,
    };
  } catch (error) {
    console.error(`[getStaticProps] Error for ${locale}:`, error);

    const fallbackData = getFallbackData(locale);

    console.log(`[getStaticProps] Using fallback for ${locale}`);

    return {
      props: {
        ...fallbackData,
        seoData: {
          ...fallbackData.pageData.seo,
          languageUrls: route.getIndexLanguageUrls(locale),
        },
        locale,
      },
      revalidate: 21600,
    };
  }
}

export default withLanguageContext(
  Inventory,
  async (locale) => {
    console.log(
      `[withLanguageContext fetchFunction] Called for locale: ${locale}`
    );

    const route = routes.inventory;

    try {
      let pageData = await getPageData({
        route: route.collection,
        locale,
      });
      pageData = pageData.data?.attributes || null;

      const vehicles = await getPageData({
        route: route.collectionSingle,
        params: '',
        sort: 'order',
        populate: 'featuredImage',
        fields:
          'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
        pageSize: 100,
        locale,
      });

      const type = await getPageData({
        route: 'categories',
        custom:
          "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
        locale,
      }).then((response) => response.data);

      const filters = type ? { type } : {};

      const result = {
        pageData,
        vehicles,
        filters,
        searchQuery: null,
      };

      console.log(
        `[withLanguageContext fetchFunction] Success for ${locale}:`,
        {
          hasPageData: !!pageData,
          vehicleCount: vehicles?.data?.length || 0,
          hasFilters: !!filters,
        }
      );

      return result;
    } catch (error) {
      console.error(
        `[withLanguageContext fetchFunction] Error for ${locale}:`,
        error
      );
      return getFallbackData(locale);
    }
  },
  'inventory'
);
