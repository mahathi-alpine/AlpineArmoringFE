import React from 'react';
import useLocale, { getLocaleStrings } from 'hooks/useLocale';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'hooks/api';
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
          'Armored <strong>SUVs, Sedans, Pickup trucks, CITs, SWAT trucks, PPVs</strong> for preorder',
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
  const { pageData, vehicles, filters, searchQuery } = props;
  const topBanner = pageData?.banner;
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

  const [vehiclesData, setVehiclesData] = useState(
    searchQuery ? vehicles.data : vehicles.data.slice(0, 12)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    !searchQuery && vehicles.data.length === 12
  );

  const fetchMoreVehicles = useCallback(async () => {
    if (loading || !hasMore || searchQuery) return;

    setLoading(true);
    const nextPage = currentPage + 1;

    try {
      let query = '';
      if (router.query.category) {
        query += `&filters[category][slug][$eq]=${router.query.category}`;
      }
      if (router.query.make) {
        query +=
          (query ? '&' : '') +
          `&filters[make][slug][$eqi]=${router.query.make}`;
      }
      if (router.query.q) {
        query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
      }

      const newVehicles = await getPageData({
        route: routes.vehiclesWeArmor.collectionSingle,
        params: query + `&pagination[page]=${nextPage}&pagination[pageSize]=12`,
        populate: 'featuredImage',
        fields:
          'fields[0]=title&fields[1]=slug&fields[2]=order&fields[3]=protectionLevel',
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
  }, [loading, hasMore, currentPage, router.query, router.locale, searchQuery]);

  // Reset when filters change
  useEffect(() => {
    if (searchQuery) {
      setVehiclesData(vehicles.data);
      setHasMore(false);
    } else {
      setVehiclesData(vehicles.data.slice(0, 12));
      setHasMore(vehicles.data.length === 12);
    }
    setCurrentPage(1);
  }, [router.query, vehicles.data, searchQuery]);

  useEffect(() => {
    if (searchQuery) return;

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
  }, [fetchMoreVehicles, searchQuery]);

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
          name: lang.vehiclesWeArmor,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.vehiclesWeArmorURL}`,
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

      {hasMore && !searchQuery && <div className="bottomObserver"></div>}

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

export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
  );

  const { locale } = context;
  const lang = getLocaleStrings(locale);
  const route = routes.vehiclesWeArmor;
  const queryMake = context.query.make;

  try {
    let pageData = await getPageData({
      route: route.collection,
      populate: 'deep',
      locale,
    });
    pageData = pageData?.data?.attributes || null;

    let query = '';
    let pageSize = 12;
    let searchQuery = null;

    // if (context.query.category) {
    //   query += `&filters[category][slug][$eq]=${context.query.category}`;
    // }
    if (queryMake) {
      query += (query ? '&' : '') + `&filters[make][slug][$eqi]=${queryMake}`;
    }
    if (context.query.q) {
      query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
      pageSize = 100;
      searchQuery = true;
    }

    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: query,
      populate: 'featuredImage',
      fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
      pageSize: pageSize,
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
          if (!context.query.q) return true;

          const searchTerms = String(context.query.q || '')
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
        fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
        locale,
      }).then((res) => res.data || []),
      getPageData({
        route: 'makes',
        custom: queryMake
          ? 'fields[0]=title&fields[1]=slug&pagination[pageSize]=100&sort[0]=title&populate[faqs]=*&populate[vehicles_we_armors][fields][0]=id&populate[vehicles_we_armors][populate][category][fields][0]=slug'
          : 'fields[0]=title&fields[1]=slug&pagination[pageSize]=100&sort[0]=title&populate[vehicles_we_armors][fields][0]=id&populate[vehicles_we_armors][populate][category][fields][0]=slug',
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
    };

    const makeMetaTitle = queryMake
      ? `- ${queryMake
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}`
      : '';
    seoData.metaTitle = `${seoData.metaTitle} ${makeMetaTitle} | Alpine Armoring`;

    seoData.metaDescription = queryMake
      ? `${lang.vwaMakesMetaDescription1} ${makeMetaTitle.replace('-', '').trim()} ${lang.vwaMakesMetaDescription2}.`
      : seoData.metaDescription;

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

    const fallbackData = getFallbackData(locale);

    return {
      props: {
        ...fallbackData,
        locale,
      },
    };
  }
}
export default VehicleWeArmor;
