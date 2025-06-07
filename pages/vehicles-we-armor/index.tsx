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

function VehicleWeArmor(props) {
  const router = useRouter();
  const { lang } = useLocale();
  const topBanner = props.pageData?.banner;
  const bottomText = props.pageData?.bottomText;

  const faqs = router.query.make
    ? props.filters.make.find(
        (item) => item.attributes.slug === router.query.make
      )?.attributes.faqs?.length
      ? props.filters.make.find(
          (item) => item.attributes.slug === router.query.make
        )?.attributes.faqs
      : props.pageData?.faqs
    : props.pageData?.faqs;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [itemsToRender, setItemsToRender] = useState(12);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [router.query, props.vehicles.data]);

  const fetchMoreItems = useCallback(() => {
    if (itemsToRender < vehiclesData?.length) {
      setLoading(true);
      setItemsToRender((prevItemsToRender) => prevItemsToRender + 12);
      setLoading(false);
    }
  }, [itemsToRender, vehiclesData]);

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
          observer.unobserve(entry.target);

          if (entry.target.classList.contains('bottomObserver')) {
            fetchMoreItems();
          }
        }
      });
    });

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [itemsToRender, vehiclesData, fetchMoreItems]);

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

        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}

        <div className={`${styles.listing_all_filters} container`}>
          {props.filters.type ? <Filters props={props.filters} plain /> : null}
        </div>

        <div className={`${styles.listing_wrap} container`}>
          {vehiclesData?.length < 1 ? (
            <div className={`${styles.listing_empty}`}>
              <h2>{lang.noVehiclesFound}</h2>
            </div>
          ) : null}

          {vehiclesData ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.slice(0, itemsToRender).map((item, index) => (
                <InventoryItem
                  key={index}
                  props={item}
                  index={index === 0 ? index : 1}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={`observe bottomObserver`}></div>

      {bottomText ? (
        <div className={`container_small`}>
          <div className={`${styles.listing_bottomText} darkColor`}>
            <CustomMarkdown>{bottomText}</CustomMarkdown>
          </div>
        </div>
      ) : null}

      {faqs?.length > 0 ? (
        <div className={`mt2`}>
          <Accordion items={faqs} title={lang.frequentlyAskedQuestions} />
        </div>
      ) : null}

      {loading ? (
        <div
          className={`${styles.listing_loading}`}
          style={{ opacity: loading ? 1 : 0 }}
        >
          {lang.loading}
        </div>
      ) : null}
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
    if (context.query.category) {
      query += `&filters[category][slug][$eq]=${context.query.category}`;
    }
    if (context.query.make) {
      query +=
        (query ? '&' : '') + `&filters[make][slug][$eqi]=${context.query.make}`;
    }
    if (context.query.q) {
      query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
    }

    const vehicles = await getPageData({
      route: route.collectionSingle,
      params: query,
      populate: 'featuredImage, category, make',
      pageSize: 100,
      sort: 'order',
      locale,
    });

    const filteredVehicles = {
      ...vehicles,
      data: vehicles.data.filter((vehicle) => {
        if (!context.query.q) return true;

        const searchTerms = context.query.q.toLowerCase().replace(/[-\s]/g, '');
        const slug = vehicle.attributes.slug
          .toLowerCase()
          .replace(/[-\s]/g, '');

        return slug.includes(searchTerms);
      }),
    };
    const [type, make] = await Promise.all([
      getPageData({
        route: 'categories',
        sort: 'order',
        fields: 'fields[0]=title&fields[1]=slug&fields[2]=order',
        locale,
      }).then((res) => res.data),
      getPageData({
        route: 'makes',
        sort: 'title',
        pageSize: 100,
        fields: 'fields[0]=title&fields[1]=slug',
        populate: 'faqs, vehicles_we_armors.category',
      }).then((res) => res.data),
    ]);

    let filters = {};
    if (type && make) {
      filters = { type, make };
    }

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
      props: { pageData, vehicles: filteredVehicles, filters, seoData, locale },
    };
  } catch (error) {
    // console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}

export default VehicleWeArmor;
