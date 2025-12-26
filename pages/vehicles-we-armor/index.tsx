import React from 'react';
import useLocale, { getLocaleStrings } from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'hooks/api';
import Button from 'components/global/button/Button';
import routes from 'routes';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import CustomMarkdown from 'components/CustomMarkdown';
import Accordion from 'components/global/accordion/Accordion';

const getFallbackData = (locale = 'en') => {
  const lang = getLocaleStrings(locale);

  return {
    pageData: {
      seo: {
        metaTitle: `${lang.vehiclesWeArmor} | Alpine Armoring`,
        metaDescription:
          locale === 'en'
            ? 'Explore the wide range of vehicles Alpine Armoring customizes, from SUVs to luxury cars, providing top-tier armoring solutions for security and protection.'
            : 'Explore la amplia gama de vehículos que Alpine Armoring personaliza, desde todoterrenos a coches de lujo, proporcionando soluciones de blindaje de primer nivel para la seguridad y la protección.',
        languageUrls: routes.vehiclesWeArmor.getIndexLanguageUrls(locale),
      },
      banner: {
        title:
          'Armored <strong>SUVs, Sedans, Pickup trucks, CITs, SWAT trucks, PPVs</strong> For Pre-Order',
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
      faqs: [],
    },
    vehicles: { data: [] },
    filters: { type: [], make: [] },
    searchQuery: null,
    seoData: {
      metaTitle: `${lang.vehiclesWeArmor} | Alpine Armoring`,
      metaDescription:
        locale === 'en'
          ? 'Explore the wide range of vehicles Alpine Armoring customizes, from SUVs to luxury cars, providing top-tier armoring solutions for security and protection.'
          : 'Explore la amplia gama de vehículos que Alpine Armoring personaliza, desde todoterrenos a coches de lujo, proporcionando soluciones de blindaje de primer nivel para la seguridad y la protección.',
      languageUrls: routes.vehiclesWeArmor.getIndexLanguageUrls(locale),
    },
    isOffline: true,
  };
};
function VehicleWeArmor(props) {
  const router = useRouter();
  const { lang } = useLocale();
  const { pageData, vehicles, filters } = props;
  const topBanner = { ...pageData?.banner, inventory: true };
  const bottomText = pageData?.bottomText;

  const faqs = (() => {
    if (!router.query.make || !filters?.make) {
      return pageData?.faqs;
    }

    const makeItem = filters.make.find(
      (item) => item.attributes.slug === router.query.make
    );

    return makeItem?.attributes.faqs?.length
      ? makeItem.attributes.faqs
      : pageData?.faqs;
  })();

  const [vehiclesData, setVehiclesData] = useState(vehicles.data.slice(0, 12));
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(vehicles.data.length === 12);

  const fetchMoreVehicles = useCallback(async () => {
    // Don't fetch more if we have query params (all results already loaded)
    if (loading || !hasMore || router.query.make || router.query.q) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    try {
      const newVehicles = await getPageData({
        route: routes.vehiclesWeArmor.collectionSingle,
        params: `&pagination[page]=${nextPage}&pagination[pageSize]=12`,
        populate: 'featuredImage,localizations',
        fields:
          'fields[0]=title&fields[1]=slug&fields[2]=order&fields[3]=locale',
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
    router.query.make,
    router.query.q,
    router.locale,
  ]);

  // Fetch filtered data when query parameters change
  useEffect(() => {
    const fetchFilteredVehicles = async () => {
      // If there are query params (make or search), fetch filtered results
      if (router.query.make || router.query.q) {
        setLoading(true);
        try {
          let query = '';
          if (router.query.make) {
            query += `&filters[make][slug][$eqi]=${router.query.make}`;
          }
          if (router.query.q) {
            query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
          }

          const filteredVehicles = await getPageData({
            route: routes.vehiclesWeArmor.collectionSingle,
            params: query,
            populate: 'featuredImage,localizations',
            fields:
              'fields[0]=title&fields[1]=slug&fields[2]=order&fields[3]=locale',
            pageSize: 100,
            sort: 'order',
            locale: router.locale,
          });

          if (filteredVehicles?.data) {
            // Apply client-side search filtering if q param exists
            let finalData = filteredVehicles.data;
            if (router.query.q) {
              const searchTerms = String(router.query.q || '')
                .toLowerCase()
                .replace(/[-\s]/g, '');
              finalData = filteredVehicles.data.filter((vehicle) => {
                const slug = String(vehicle.attributes.slug || '')
                  .toLowerCase()
                  .replace(/[-\s]/g, '');
                return slug.includes(searchTerms);
              });
            }

            setVehiclesData(finalData);
            setHasMore(false);
            setCurrentPage(1);
          }
        } catch (error) {
          console.error('Error fetching filtered vehicles:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // No filters, show initial data
        setVehiclesData(vehicles.data.slice(0, 12));
        setHasMore(vehicles.data.length === 12);
        setCurrentPage(1);
      }
    };

    fetchFilteredVehicles();
  }, [router.query.make, router.query.q, router.locale, vehicles.data]);

  useEffect(() => {
    // Don't set up infinite scroll if we have query params
    if (router.query.make || router.query.q) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreVehicles();
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
  }, [fetchMoreVehicles, router.query.make, router.query.q]);

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
      ],
    };
    return JSON.stringify(structuredData);
  };

  const getFAQStructuredData = () => {
    if (!faqs || !Array.isArray(faqs)) return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq, index) => {
        const title =
          faq?.attributes?.title || faq?.title || `FAQ ${index + 1}`;
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
          {lang.vehiclesWeArmor}
        </div>

        {topBanner && <Banner props={topBanner} shape="white" small />}

        {filters.type && (
          <div className={`${styles.listing_all_filters} container`}>
            <Filters props={filters} plain />

            <div className={`${styles.listing_heading_stock} center`}>
              <Button
                href={`${router.locale === 'en' ? '' : `/${router.locale}`}/${lang.availableNowURL}`}
                className={`${styles.listing_heading_button} shiny`}
              >
                {lang.viewInStockAvailability}
              </Button>
            </div>
          </div>
        )}

        <div className={`${styles.listing_wrap} container`}>
          {vehiclesData?.length < 1 ? (
            <div className={`${styles.listing_empty}`}>
              {props.isOffline ? (
                <p>{lang.inventorySystemDown}</p>
              ) : (
                <h2>{lang.noVehiclesFound}</h2>
              )}
            </div>
          ) : (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.map((item, index) => (
                <InventoryItem
                  key={item.id || index}
                  props={item}
                  index={index === 0 ? 0 : 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {hasMore && !router.query.make && !router.query.q && (
        <div className="bottomObserver"></div>
      )}

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

      {/* {loading && (
        <div className={`${styles.listing_loading}`} style={{ opacity: 1 }}>
          {lang.loading}
        </div>
      )} */}
    </>
  );
}

export async function getStaticProps(context) {
  const { locale } = context;
  const lang = getLocaleStrings(locale);
  const route = routes.vehiclesWeArmor;

  try {
    let pageData = await getPageData({
      route: route.collection,
      populate: 'deep',
      locale,
    });
    pageData = pageData?.data?.attributes || null;

    // Fetch all vehicles for static generation (no query filtering)
    const vehicles = await getPageData({
      route: route.collectionSingle,
      populate: 'featuredImage,localizations',
      fields: 'fields[0]=title&fields[1]=slug&fields[2]=order&fields[3]=locale',
      pageSize: 12,
      sort: 'order',
      locale,
    });

    if (!vehicles || !vehicles.data) {
      throw new Error('Invalid vehicles data received from Strapi');
    }

    const [type, make] = await Promise.all([
      getPageData({
        route: 'categories',
        sort: 'order',
        fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
        locale,
      }).then((res) => res.data || []),
      getPageData({
        route: 'makes',
        custom:
          'fields[0]=title&fields[1]=slug&pagination[pageSize]=100&sort[0]=title&populate[faqs]=*&populate[vehicles_we_armors][fields][0]=id&populate[vehicles_we_armors][populate][category][fields][0]=slug',
        locale,
      }).then((res) => res?.data || []),
    ]);

    const filters = {
      type: type || [],
      make: make || [],
    };

    const seoData = {
      ...(pageData?.seo || {}),
      languageUrls: route.getIndexLanguageUrls(locale),
      metaTitle: `${pageData?.seo?.metaTitle || lang.vehiclesWeArmor} | Alpine Armoring`,
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
      revalidate: 3600, // Revalidate every hour (ISR)
    };
  } catch (error) {
    console.error('Strapi connection failed:', error);

    const fallbackData = getFallbackData(locale);

    return {
      props: {
        ...fallbackData,
        locale,
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}
export default VehicleWeArmor;
