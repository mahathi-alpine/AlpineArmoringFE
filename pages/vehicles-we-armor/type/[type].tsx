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

function Inventory(props) {
  const { lang } = useLocale();
  const currentCategory = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  const topBanner = currentCategory?.attributes.allBanner;
  const bottomText = currentCategory?.attributes.bottomText;
  const faqs = currentCategory?.attributes.faqs_vehicles_we_armor;
  const router = useRouter();

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [itemsToRender, setItemsToRender] = useState(6);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [router.query, props.vehicles.data]);

  const fetchMoreItems = useCallback(() => {
    if (itemsToRender < vehiclesData?.length) {
      setLoading(true);
      setItemsToRender((prevItemsToRender) => prevItemsToRender + 6);
      setLoading(false);
    }
  }, [itemsToRender, vehiclesData]);

  // // Filtering vehicles based on the make parameter
  const filteredByMake = props.vehicles?.data?.filter(
    (vehicle) =>
      !router.query.make ||
      vehicle.attributes.make?.data?.attributes?.slug.toLowerCase() ===
        (typeof router.query.make === 'string'
          ? router.query.make.toLowerCase()
          : '')
  );

  // Animations
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
  }, [itemsToRender, fetchMoreItems]);

  const categoryTitle = currentCategory?.attributes.title || 'a';
  const categorySlug = currentCategory?.attributes.slug || 'a';

  const make = router.query.make;
  const categoryTitleWithMake = (
    <>
      {!make && <span>{categoryTitle}</span>}
      {make && (
        <span>
          <Link
            href={`${lang.vehiclesWeArmorURL}/${lang.type}/${categorySlug}`}
          >
            {categoryTitle}
          </Link>
        </span>
      )}
      {make && <span>&gt;</span>}
      {make && <span>{make}</span>}
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
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: lang.vehiclesWeArmor,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${lang.vehiclesWeArmorURL}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryTitle,
          item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${routes.vehiclesWeArmor.paths[router.locale]}/${lang.type}/${categorySlug}`,
        },
      ],
    };

    // Conditionally add make ListItem if router.query.make exists
    if (router.query.make) {
      const make = router.query.make;
      structuredData.itemListElement.push({
        '@type': 'ListItem',
        position: 4,
        name: make,
        item: `https://www.alpineco.com${router.locale === 'en' ? '' : `/${router.locale}`}${routes.vehiclesWeArmor.paths[router.locale]}/${lang.type}/${categorySlug}?make=${make}`,
      });
    }

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
          <Link href={`${lang.vehiclesWeArmorURL}`}>
            {lang.vehiclesWeArmor}
          </Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>
            {categoryTitleWithMake}
          </span>
        </div>

        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}

        {/* {heading ? (
          <p className={`${styles.listing_heading} center container`}>
            {heading}
          </p>
        ) : null} */}
        <p className={`${styles.listing_heading} center container`}>
          {lang.exploreDifferentModels}{' '}
          <strong>
            {typeof make === 'string'
              ? make === 'bmw'
                ? 'BMW'
                : make === 'cuda'
                  ? 'CUDA'
                  : make === 'gmc'
                    ? 'GMC'
                    : make === 'mastiff'
                      ? 'MASTIFF'
                      : make === 'pointer'
                        ? 'POINTER'
                        : make.charAt(0).toUpperCase() +
                          make.slice(1).replace('-', ' ')
              : ''}
          </strong>
          {typeof categoryTitle === 'string'
            ? ' ' + categoryTitle.replace('Armored', '').trim()
            : ''}{' '}
          {lang.weArmor}
        </p>

        {props.filters?.type ? (
          <div className={`${styles.listing_all_filters} container`}>
            <Filters props={props.filters} plain />
          </div>
        ) : null}

        <div className={`${styles.listing_wrap} container`}>
          {filteredByMake?.length > 0 && !loading ? (
            <div className={`${styles.listing_list}`}>
              {filteredByMake.map((item, index) => (
                <InventoryItem key={item.id} props={item} index={index} />
              ))}
            </div>
          ) : (
            <div className={`${styles.listing_empty}`}>
              {lang.noVehiclesFound}
            </div>
          )}
        </div>
      </div>

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
          className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
          style={{ opacity: loading ? 1 : 0 }}
        >
          {lang.loading}
        </div>
      ) : null}

      <div className={`observe bottomObserver`}></div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { locale } = context;
  const route = routes.vehiclesWeArmor;

  const englishType = context.query.type;
  const localizedType = route.getLocalizedType(englishType, locale);

  // const category = context.query.type;
  const queryMake = context.query.make;

  let query = `filters[category][slug][$eq]=${localizedType}`;
  const q = context.query.q;
  if (q) {
    query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
  }

  // Fetching Vehicles
  const vehicles = await getPageData({
    route: route.collectionSingle,
    params: query,
    sort: 'order',
    pageSize: 100,
    populate: 'featuredImage, make, category',
    locale,
  });

  const filteredVehicles = {
    ...vehicles,
    data: vehicles.data?.filter((vehicle) => {
      if (!q) return true;

      const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
      const slug = vehicle.attributes.slug.toLowerCase().replace(/[-\s]/g, '');

      return slug.includes(searchTerms);
    }),
  };

  // Fetching Types and Makes for the Filters
  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      sort: 'order',
      fields:
        'fields[0]=title&fields[1]=slug&fields[2]=bottomText&fields[3]=heading',
      populate:
        'allBanner.media, allBanner.imageMobile, allBanner.mediaMP4, seo.metaImage, seo.metaSocial, faqs_vehicles_we_armor, inventory_vehicles',
      locale,
    }).then((res) => res.data),
    getPageData({
      route: 'makes',
      sort: 'title',
      pageSize: 100,
      fields: 'fields[0]=title&fields[1]=slug',
      populate: 'vehicles_we_armors.category, vehicles_we_armors',
    }).then((res) => res.data),
  ]);

  let filters = {};
  if (type && make) {
    filters = { type, make };
  }

  const makeMetaTitle = queryMake
    ? ` ${queryMake
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}`
    : '';

  const categoryData = type?.find(
    (item) => item.attributes.slug === context.query.type
  );

  // All languages urls
  let correctEnglishType;
  let correctSpanishType;

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

    if (!correctEnglishType) {
      correctEnglishType = englishType;
    }

    correctSpanishType = context.query.type;
  }

  const languageUrls = {
    en: `${route.paths.en}/type/${correctEnglishType}`,
    es: `/${locale === 'en' ? 'es' : locale}${route.paths.es}/tipo/${correctSpanishType}`,
  };

  const seoData = {
    ...(categoryData?.attributes.seo || {}),
    languageUrls,
    metaTitle: `${categoryData?.attributes.seo.metaTitle}${makeMetaTitle} | Alpine Armoring`,
    // thumbnail: categoryData.attributes.allBanner.media.data.attributes ?? null,
  };

  // Modify meta description if queryMake exists
  if (queryMake && seoData?.metaDescription) {
    // Format the make
    const formattedMake = queryMake
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special case handling
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
      // Default replacement logic
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

  if (!vehicles || !vehicles.data || vehicles.data.length === 0) {
    return {
      notFound: true,
    };
  }
  // console.log('Fetched data:', JSON.stringify(vehicles, null, 2));

  return {
    props: {
      vehicles: filteredVehicles,
      filters,
      query: localizedType,
      seoData,
      locale,
    },
  };
}

export default Inventory;
