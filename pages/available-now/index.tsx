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
  isOffline: false,
});

function Inventory(props) {
  const { lang } = useLocale();
  const router = useRouter();

  // ALL HOOKS MUST BE DECLARED FIRST - NO EARLY RETURNS BEFORE THIS POINT

  // State to track if we're client-side and need to fetch data
  const [isClientSide, setIsClientSide] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // These states need to be declared with fallback values to avoid hook order issues
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [displayedVehicles, setDisplayedVehicles] = useState([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visibleCount, setVisibleCount] = useState(ITEMS_TO_DISPLAY);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const contentRef = useRef(null);

  // Determine which data to use
  const effectiveProps = React.useMemo(() => {
    console.log('=== EFFECTIVE PROPS SELECTION START ===');
    console.log('Router locale:', router.locale);
    console.log('Is default language (en)?', router.locale === 'en');
    console.log('Original props:', props);
    console.log('Original props.vehicles:', props.vehicles);
    console.log('Original props.vehicles?.data:', props.vehicles?.data);
    console.log(
      'Original props.vehicles?.data is array?',
      Array.isArray(props.vehicles?.data)
    );

    // For default language (en), always use the original props
    if (router.locale === 'en') {
      console.log('Using original props for default language (en)');
      return props;
    }

    console.log('Client data:', clientData);
    console.log('Client data vehicles:', clientData?.vehicles);
    console.log('Client data vehicles.data:', clientData?.vehicles?.data);
    console.log(
      'Client data vehicles.data is array?',
      Array.isArray(clientData?.vehicles?.data)
    );

    // For non-default languages, if we have valid props from SSG, use them
    if (props.vehicles?.data && Array.isArray(props.vehicles.data)) {
      console.log('Using original props - has valid vehicles.data');
      console.log('Original props vehicles count:', props.vehicles.data.length);
      return props;
    }

    // If we have client-side data, use it
    if (clientData?.vehicles?.data) {
      console.log('Using client data - has vehicles.data');
      console.log(
        'Client data vehicles count:',
        clientData.vehicles.data.length
      );
      console.log(
        'Client data is array check:',
        Array.isArray(clientData.vehicles.data)
      );
      return clientData;
    }

    // Fallback to default data
    console.log('Using fallback data');
    const fallback = getFallbackData(router.locale || 'en');
    console.log('Fallback data:', fallback);
    return fallback;
  }, [props, clientData, router.locale]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pageData, vehicles, filters, searchQuery } = effectiveProps;

  // Add comprehensive vehicles debugging
  console.log('=== FINAL VEHICLES DEBUG START ===');
  console.log('Effective props:', effectiveProps);
  console.log('Destructured vehicles:', vehicles);
  console.log('Vehicles type:', typeof vehicles);
  console.log('Vehicles is null?', vehicles === null);
  console.log('Vehicles is undefined?', vehicles === undefined);
  console.log('Vehicles keys:', vehicles ? Object.keys(vehicles) : 'no keys');
  console.log('Vehicles.data:', vehicles?.data);
  console.log('Vehicles.data type:', typeof vehicles?.data);
  console.log('Vehicles.data is array?', Array.isArray(vehicles?.data));
  console.log('Vehicles.data length:', vehicles?.data?.length);
  console.log('Vehicles.meta:', vehicles?.meta);

  if (vehicles?.data && Array.isArray(vehicles.data)) {
    console.log('First 3 vehicles:', vehicles.data.slice(0, 3));
    console.log('Vehicle structure sample:', vehicles.data[0]);
    console.log('Vehicle attributes sample:', vehicles.data[0]?.attributes);
  } else {
    console.log('Vehicles.data is not a valid array!');
  }

  console.log('AllVehicles state will be:', vehicles.data);
  console.log('=== FINAL VEHICLES DEBUG END ===');

  const fetchClientSideData = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const locale = router.locale || 'en';

    console.log('=== FETCH CLIENT SIDE DATA START ===');
    console.log('Current locale:', locale);
    console.log('Router locale:', router.locale);
    console.log('Routes inventory:', routes.inventory);

    try {
      // Fetch pageData
      console.log('Fetching pageData...');
      const pageDataResult = await getPageData({
        route: routes.inventory.collection,
        locale,
      }).then((data) => {
        console.log('PageData raw response:', data);
        const result = data.data?.attributes || null;
        console.log('PageData processed:', result);
        return result;
      });

      // Fetch vehicles
      console.log('Fetching vehicles...');
      console.log('Vehicle route:', routes.inventory.collectionSingle);
      const vehiclesResult = await getPageData({
        route: routes.inventory.collectionSingle,
        params: '',
        sort: 'order',
        populate: 'featuredImage',
        fields:
          'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=hide',
        pageSize: 100,
        locale,
      });

      console.log('Vehicles raw response:', vehiclesResult);
      console.log('Vehicles data exists?', !!vehiclesResult?.data);
      console.log('Vehicles data type:', typeof vehiclesResult?.data);
      console.log(
        'Vehicles data is array?',
        Array.isArray(vehiclesResult?.data)
      );
      console.log('Vehicles data length:', vehiclesResult?.data?.length);
      console.log('First vehicle:', vehiclesResult?.data?.[0]);
      console.log('Vehicles meta:', vehiclesResult?.meta);

      // Fetch filters
      console.log('Fetching filters...');
      const filtersResult = await getPageData({
        route: 'categories',
        custom:
          "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
        locale,
      }).then((response) => {
        console.log('Filters raw response:', response);
        const result = response.data ? { type: response.data } : {};
        console.log('Filters processed:', result);
        return result;
      });

      const finalData = {
        pageData: pageDataResult,
        vehicles: vehiclesResult,
        filters: filtersResult,
        searchQuery: null,
        isOffline: false,
      };

      console.log('Final client data structure:', finalData);
      console.log('Final vehicles structure:', finalData.vehicles);
      console.log('Final vehicles.data:', finalData.vehicles?.data);

      setClientData(finalData);

      console.log('Client-side data fetched successfully');
    } catch (error) {
      console.error('Failed to fetch client-side data:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      // Use fallback data on error
      const fallbackData = getFallbackData(locale);
      console.log('Using fallback data:', fallbackData);
      setClientData(fallbackData);
    } finally {
      setIsLoading(false);
    }
    console.log('=== FETCH CLIENT SIDE DATA END ===');
  };

  // Detect if we're on client-side and props are missing
  useEffect(() => {
    setIsClientSide(true);

    // Only fetch client-side data for non-default languages (not 'en')
    // If we're client-side, not on default language, and essential props are missing, fetch them
    if (
      router.isReady &&
      router.locale !== 'en' &&
      (!props.vehicles || !props.vehicles.data)
    ) {
      console.log(
        'Client-side navigation detected for non-default language, fetching data...'
      );
      fetchClientSideData();
    }
  }, [router.isReady, router.locale, props.vehicles]);

  // Update allVehicles when effectiveProps change
  useEffect(() => {
    if (vehicles?.data && Array.isArray(vehicles.data)) {
      console.log('Setting allVehicles to:', vehicles.data);
      setAllVehicles(vehicles.data);
    } else {
      console.log('Setting allVehicles to empty array');
      setAllVehicles([]);
    }
  }, [vehicles]);

  const { q, vehicles_we_armor, vehiculos_que_blindamos } = router.query;

  // Handle client-side filtering for search and category filters
  useEffect(() => {
    if (!router.isReady) return;

    let filtered = allVehicles.filter((vehicle) => !vehicle.attributes.hide);

    console.log('Filtering - allVehicles count:', allVehicles.length);
    console.log('Filtering - after hide filter:', filtered.length);

    // Apply search filter
    if (q && typeof q === 'string') {
      const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
      filtered = filtered.filter((vehicle) => {
        const slug = vehicle.attributes.slug
          .toLowerCase()
          .replace(/[-\s]/g, '');
        return slug.includes(searchTerms);
      });
      console.log('Filtering - after search filter:', filtered.length);
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
        console.log('Filtering - after category filter:', filtered.length);
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

    console.log(
      'Final displayed vehicles count:',
      q || vehicles_we_armor || vehiculos_que_blindamos
        ? filtered.length
        : Math.min(filtered.length, ITEMS_TO_DISPLAY)
    );
  }, [
    q,
    vehicles_we_armor,
    vehiculos_que_blindamos,
    router.isReady,
    allVehicles,
  ]);

  // Handle infinite scroll
  const handleIntersection = useCallback(async () => {
    if (q || vehicles_we_armor || vehiculos_que_blindamos) return; // No infinite scroll for filtered results

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
    const faqs = pageData?.faqs || [];

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

  // NOW we can do conditional rendering after all hooks are declared

  // Show loading state if we're fetching client-side data
  if (isClientSide && isLoading) {
    return (
      <div className={`${styles.listing} background-dark`}>
        <div
          className="container"
          style={{ padding: '2rem', textAlign: 'center' }}
        >
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  // Safety check - this should now rarely be needed
  if (!vehicles?.data || !Array.isArray(vehicles.data)) {
    console.error('=== SAFETY CHECK TRIGGERED ===');
    console.error('Vehicles:', vehicles);
    console.error('Vehicles.data:', vehicles?.data);
    console.error('Is array?', Array.isArray(vehicles?.data));
    console.error('Length:', vehicles?.data?.length);
    console.error('Effective props that caused this:', effectiveProps);

    return (
      <div className={`${styles.listing} background-dark`}>
        <div className="container">
          <div className={`${styles.listing_list_error}`}>
            <p>
              Unable to load inventory at this time. Please try refreshing the
              page.
            </p>
            <p>Debug: vehicles={JSON.stringify(vehicles)}</p>
          </div>
        </div>
      </div>
    );
  }

  const topBanner = pageData?.banner;
  const bottomText = pageData?.bottomText;
  const bottomTextContent = {
    dynamicZone: pageData?.bottomTextDynamic || [],
  };
  const faqs = pageData?.faqs || [];

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
                {effectiveProps.isOffline ? (
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
      revalidate: 21600, // Still revalidate even with fallback data
    };
  }
}

// Simplified HOC usage - remove the complex data fetching since we handle it in the component
export default withLocaleRefetch(Inventory, {}, { routeName: 'inventory' });
