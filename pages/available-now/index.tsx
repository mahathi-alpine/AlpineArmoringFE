import React from 'react';
import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback, useRef } from 'react';
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
import Content from 'components/global/content/Content';
import withLocaleRefetch from 'components/withLocaleRefetch';

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
      title: 'Armored Vehicles for Sale',
      subtitle:
        '(SUVs, Sedans, Vans, and Trucks) that are <b>completed and available for immediate shipping</b>',
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
  const { pageData, vehicles, filters, searchQuery } = props;
  const router = useRouter();

  const topBanner = pageData?.banner;
  const bottomText = pageData?.bottomText;
  const bottomTextContent = {
    dynamicZone: pageData?.bottomTextDynamic || [],
  };

  const faqs = pageData?.faqs || [];

  const { q, vehicles_we_armor, vehiculos_que_blindamos } = router.query;

  const [allVehicles] = useState(vehicles.data);
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles.data);
  const [displayedVehicles, setDisplayedVehicles] = useState(
    searchQuery ? vehicles.data : vehicles.data.slice(0, ITEMS_TO_DISPLAY)
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visibleCount, setVisibleCount] = useState(ITEMS_TO_DISPLAY);
  // const [loading, setLoading] = useState(false);

  // Handle client-side filtering for search and category filters
  useEffect(() => {
    if (!router.isReady) return;

    let filtered = allVehicles.filter((vehicle) => !vehicle.attributes.hide);

    // Apply search filter
    if (q && typeof q === 'string') {
      const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
      filtered = filtered.filter((vehicle) => {
        const slug = vehicle.attributes.slug
          .toLowerCase()
          .replace(/[-\s]/g, '');
        return slug.includes(searchTerms);
      });
    }

    // Apply vehicles_we_armor filter
    if (
      (vehicles_we_armor && typeof vehicles_we_armor === 'string') ||
      (vehiculos_que_blindamos && typeof vehiculos_que_blindamos === 'string')
    ) {
      const categorySlug = vehicles_we_armor || vehiculos_que_blindamos;
      if (typeof categorySlug === 'string') {
        const searchTerms = categorySlug.toLowerCase().replace(/[-\s]/g, '');
        filtered = filtered.filter((vehicle) => {
          const slug = vehicle.attributes.slug
            .toLowerCase()
            .replace(/[-\s]/g, '');
          return slug.includes(searchTerms);
        });
      }
    }

    setFilteredVehicles(filtered);

    if (q || vehicles_we_armor || vehiculos_que_blindamos) {
      // Show all results for search/filter
      setDisplayedVehicles(filtered);
      setVisibleCount(filtered.length);
    } else {
      // Reset to initial display for main page
      setDisplayedVehicles(filtered.slice(0, ITEMS_TO_DISPLAY));
      setVisibleCount(ITEMS_TO_DISPLAY);
    }
  }, [
    q,
    vehicles_we_armor,
    vehiculos_que_blindamos,
    router.isReady,
    allVehicles,
  ]);

  // Handle infinite scroll
  const handleIntersection = useCallback(async () => {
    // if (loading) return;
    if (q || vehicles_we_armor || vehiculos_que_blindamos) return; // No infinite scroll for filtered results

    const nextBatchStart = displayedVehicles.length;
    const remainingItems = filteredVehicles.length - nextBatchStart;

    if (remainingItems > 0) {
      // setLoading(true);

      const itemsToAdd = Math.min(remainingItems, ITEMS_TO_DISPLAY);
      const nextBatch = filteredVehicles.slice(
        nextBatchStart,
        nextBatchStart + itemsToAdd
      );

      setDisplayedVehicles((prev) => [...prev, ...nextBatch]);
      setVisibleCount((prev) => prev + itemsToAdd);
      // setLoading(false);
    }
  }, [
    filteredVehicles,
    displayedVehicles.length,
    q,
    vehicles_we_armor,
    vehiculos_que_blindamos,
  ]);

  // Intersection observer
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

        {/* Only show intersection observer for infinite scroll when not filtering */}
        {!q && !vehicles_we_armor && !vehiculos_que_blindamos && (
          <div className={`observe bottomObserver`}></div>
        )}

        {/* <div
          className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
          style={{ opacity: 0 }}
        >
          {lang.loading}
        </div> */}

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
                  : '260px',
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
            <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
          </div>
        ) : null}
      </div>

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

export async function getStaticProps(context) {
  const locale = context.locale || 'en';
  const route = routes.inventory;

  try {
    let pageData = await getPageData({
      route: route.collection,
      locale,
    });
    pageData = pageData.data?.attributes || null;

    // Fetch ALL vehicles at build time
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

    // Get filter data
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
        vehicles,
        filters,
        seoData,
        searchQuery: null,
        locale,
      },
      revalidate: 21600, // Revalidate every 6 hours
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
      // Still revalidate even with fallback data
      revalidate: 21600,
    };
  }
}

// Apply the withLocaleRefetch HOC
export default withLocaleRefetch(
  Inventory,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.inventory.collection,
        locale,
      });
      return data.data?.attributes || null;
    },
    vehicles: async (locale) => {
      const data = await getPageData({
        route: routes.inventory.collectionSingle,
        params: '',
        sort: 'order',
        populate: 'featuredImage',
        fields:
          'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
        pageSize: 100,
        locale,
      });
      return data;
    },
    filters: async (locale) => {
      const type = await getPageData({
        route: 'categories',
        custom:
          "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
        locale,
      }).then((response) => response.data);

      return type ? { type } : {};
    },
  },
  {
    routeName: 'inventory',
  }
);
