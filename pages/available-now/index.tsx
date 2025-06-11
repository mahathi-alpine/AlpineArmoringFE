import React from 'react';
import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import routes from 'routes';
import Head from 'next/head';
import styles from '/components/listing/Listing.module.scss';
import useLocale from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';

const ITEMS_PER_PAGE = 16;
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
    banner: null,
    bottomText: null,
    faqs: [],
  },
  vehicles: { data: [], meta: { pagination: { total: 0 } } },
  filters: {},
  searchQuery: null,
  isOffline: true,
});

function Inventory(props) {
  const { lang } = useLocale();
  const { pageData, vehicles, filters, searchQuery } = props;
  const topBanner = pageData?.banner;
  const bottomText = pageData?.bottomText;
  const faqs = pageData?.faqs;

  const router = useRouter();
  const { q, vehicles_we_armor, vehiculos_que_blindamos } = router.query;

  const [allFetchedVehicles, setAllFetchedVehicles] = useState(vehicles.data);
  const [displayedVehicles, setDisplayedVehicles] = useState(
    searchQuery ? vehicles.data : vehicles.data.slice(0, ITEMS_TO_DISPLAY)
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_TO_DISPLAY);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const totalItems = vehicles.meta.pagination.total;

  const fetchMoreFromStrapi = async () => {
    const route = routes.inventory;
    const locale = router.locale || 'en';

    try {
      setLoading(true);
      const nextPage = currentPage + 1;

      const query =
        vehicles_we_armor || vehiculos_que_blindamos
          ? `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor || vehiculos_que_blindamos}`
          : '';

      const newVehicles = await getPageData({
        route: route.collectionSingle,
        params:
          query +
          `&pagination[page]=${nextPage}&pagination[pageSize]=${ITEMS_PER_PAGE}`,
        sort: 'order',
        populate: 'featuredImage',
        fields:
          'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
        locale,
      });

      const updatedVehicles = [...allFetchedVehicles, ...newVehicles.data];
      setAllFetchedVehicles(updatedVehicles);
      setCurrentPage(nextPage);

      const newHasMore = updatedVehicles.length < totalItems;
      setHasMore(newHasMore);

      if (!newHasMore) {
        const visibleVehicles = updatedVehicles.filter(
          (vehicle) => !vehicle.attributes.hide
        );
        const remainingToDisplay =
          visibleVehicles.length - displayedVehicles.length;
        if (remainingToDisplay > 0) {
          setVisibleCount(visibleVehicles.length);
        }
      }
    } catch (error) {
      console.error('Error fetching more vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIntersection = useCallback(async () => {
    if (loading) return;

    const visibleVehicles = allFetchedVehicles.filter(
      (vehicle) => !vehicle.attributes.hide
    );
    const nextBatchStart = displayedVehicles.length;
    const remainingItems = visibleVehicles.length - nextBatchStart;

    if (remainingItems > 0) {
      if (remainingItems <= ITEMS_TO_DISPLAY) {
        setVisibleCount((prevCount) => prevCount + remainingItems);
      } else {
        setVisibleCount((prevCount) => prevCount + ITEMS_TO_DISPLAY);
      }

      if (hasMore && allFetchedVehicles.length < totalItems) {
        await fetchMoreFromStrapi();
      }
    }
  }, [
    loading,
    allFetchedVehicles,
    displayedVehicles.length,
    hasMore,
    totalItems,
  ]);

  // Reset state when search query or filter changes
  useEffect(() => {
    if (searchQuery) {
      setDisplayedVehicles(vehicles.data);
    } else {
      setAllFetchedVehicles(vehicles.data);
      setDisplayedVehicles(vehicles.data.slice(0, ITEMS_TO_DISPLAY));
      setVisibleCount(ITEMS_TO_DISPLAY);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [
    q,
    vehicles_we_armor,
    vehiculos_que_blindamos,
    vehicles.data,
    searchQuery,
  ]);

  // Update displayed vehicles when not in search mode
  useEffect(() => {
    if (!searchQuery) {
      const visibleVehicles = allFetchedVehicles.filter(
        (vehicle) => !vehicle.attributes.hide
      );
      const nextBatch = visibleVehicles.slice(0, visibleCount);
      setDisplayedVehicles(nextBatch);
    }
  }, [allFetchedVehicles, visibleCount, searchQuery]);

  // Set up intersection observer
  useEffect(() => {
    if (searchQuery) return;

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
  }, [handleIntersection, searchQuery]);

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
      ],
    };
    return JSON.stringify(structuredData);
  };

  // FAQ structured data
  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs)) {
      console.error('FAQs is not an array:', faqs);
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

  if (!displayedVehicles) return null;
  console.log(filters.type);
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
          {lang.availableNowTitle}
        </div>

        {topBanner && <Banner props={topBanner} shape="dark" />}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          <div className={`${styles.listing_wrap_filtered}`}>
            {filters.type && <Filters props={filters} />}
          </div>

          <div className={`${styles.listing_wrap_shown}`}>
            {!displayedVehicles.length ? (
              <div className={`${styles.listing_list_error}`}>
                {props.isOffline ? (
                  <>
                    <p>{lang.inventorySystemDown}</p>
                  </>
                ) : (
                  <h2>{lang.noVehiclesFound}</h2>
                )}
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

        <div className={`observe bottomObserver`}></div>

        {bottomText ? (
          <div className={`container_small`}>
            <div className={`${styles.listing_bottomText}`}>
              <CustomMarkdown>{bottomText}</CustomMarkdown>
            </div>
          </div>
        ) : null}

        {faqs?.length > 0 ? (
          <div className={`mt2`}>
            <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
          </div>
        ) : null}
      </div>

      <div
        className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        {lang.loading}
      </div>

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

// export const config = {
//   unstable_runtimeJS: false,
// };

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
  );

  const locale = context.locale || 'en';
  const route = routes.inventory;

  try {
    let pageData = await getPageData({
      route: route.collection,
      locale,
    });
    pageData = pageData.data?.attributes || null;

    const { vehicles_we_armor, q, vehiculos_que_blindamos } = context.query;
    let query = '';
    let pageSize = 16;
    let searchQuery = null;

    if (vehicles_we_armor || vehiculos_que_blindamos) {
      query += `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor || vehiculos_que_blindamos}`;
    }
    if (q) {
      query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
      pageSize = 100;
      searchQuery = true;
    }

    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: query,
      sort: 'order',
      populate: 'featuredImage',
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
      pageSize: pageSize,
      locale,
    });

    const filteredVehicles = {
      ...vehicles,
      data: vehicles.data.filter((vehicle) => {
        if (vehicle.attributes.hide === true) return false;
        if (!q) return true;

        const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
        const slug = vehicle.attributes.slug
          .toLowerCase()
          .replace(/[-\s]/g, '');

        return slug.includes(searchTerms);
      }),
    };

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

    return {
      props: {
        pageData,
        vehicles: filteredVehicles,
        filters,
        seoData,
        searchQuery,
        locale,
      },
    };
  } catch (error) {
    console.error('Strapi connection failed:', error);

    // Return fallback data instead of 404
    const fallbackData = getFallbackData(locale);

    return {
      props: {
        ...fallbackData,
        seoData: {
          ...fallbackData.pageData.seo,
          languageUrls: route.getIndexLanguageUrls(locale),
        },
        locale,
      },
    };
  }
}

export default Inventory;
