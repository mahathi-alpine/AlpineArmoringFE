import { getPageData } from 'hooks/api';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import styles from '/components/listing/Listing.module.scss';
import Banner from 'components/global/banner/Banner';
import Link from 'next/link';
import useLocale, { getLocaleStrings } from 'hooks/useLocale';
import Head from 'next/head';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import Button from 'components/global/button/Button';
import Accordion from 'components/global/accordion/Accordion';

import CustomMarkdown from 'components/CustomMarkdown';

function Inventory(props) {
  const { lang } = useLocale();

  const currentCategory = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  const topBanner = currentCategory?.attributes.inventoryBanner;
  const bottomText = currentCategory?.attributes.bottomTextInventory;
  const faqs = currentCategory?.attributes.faqs_stock;

  // const findTitleBySlug = (filters, targetSlug) => {
  //   if (!filters || !Array.isArray(filters.type)) {
  //     return null;
  //   }

  //   const matchingItem = filters.type.find(
  //     (item) =>
  //       item.attributes &&
  //       item.attributes.slug.toLowerCase() === targetSlug.toLowerCase()
  //   );

  //   return matchingItem ? matchingItem.attributes.title : null;
  // };

  const categoryTitle = currentCategory?.attributes.title;
  const categorySlug = currentCategory?.attributes.slug;

  const router = useRouter();
  const currentPath = router.asPath;
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

  const getBreadcrumbStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.alpineco.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Available now',
          item: `https://www.alpineco.com/available-now`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryTitle,
          item: `https://www.alpineco.com/available-now/type/${categorySlug}`,
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
        const text = faq?.attributes?.text || faq?.text || 'No answer provided';

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
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <Link href="/available-now">Available now</Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>{categoryTitle}</span>
        </div>

        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        {currentPath.includes(lang.armoredRentalURL) ? (
          <div className={`${styles.listing_rentalsCTA}`}>
            <Button
              href="https://www.armoredautos.com/armored-rentals?ref=mainWebsite"
              target
              className={`primary rounded`}
              attention
            >
              Visit our rentals website
            </Button>
          </div>
        ) : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {/* Render Filters conditionally based on path and filter type */}
          {!currentPath.includes(lang.armoredRentalURL) &&
          props.filters?.type ? (
            <div className={`${styles.listing_wrap_filtered}`}>
              <Filters props={props.filters} />
            </div>
          ) : null}

          {vehiclesData && vehiclesData.length > 0 ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.reduce((acc, item, index) => {
                if (item.attributes.ownPage !== false) {
                  acc[index] = (
                    <InventoryItem key={item.id} props={item} index={index} />
                  );
                }
                return acc;
              }, [])}
            </div>
          ) : (
            <div className={`${styles.listing_list_error}`}>
              No Vehicles Found
            </div>
          )}
        </div>

        {bottomText ? (
          <div className={`container_small`}>
            <div className={`${styles.listing_bottomText}`}>
              <CustomMarkdown>{bottomText}</CustomMarkdown>
            </div>
          </div>
        ) : null}

        {faqs?.length > 0 ? (
          <div className={`mt2`}>
            <Accordion items={faqs} title="Frequently Asked Questions" />
          </div>
        ) : null}
      </div>

      <div
        className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        Loading...
      </div>

      <div className={`observe bottomObserver`}></div>

      <div className="shape-before shape-before-white"></div>
    </>
  );
}

export async function getServerSideProps(context) {
  const locale = context.locale || 'en';
  const lang = getLocaleStrings(locale);

  const category = context.query.type;
  let query = `filters[categories][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'order',
    populate: 'featuredImage',
    fields:
      'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=ownPage&fields[9]=hide&fields[10]=rentalsVehicleID&fields[11]=trans',
    pageSize: 100,
  });

  const filteredVehicles = {
    ...vehicles,
    data: vehicles.data?.filter((vehicle) => {
      if (vehicle.attributes.hide === true) return false;
      if (!q) return true;

      const searchTerms = q.toLowerCase().replace(/[-\s]/g, '');
      const slug = vehicle.attributes.slug.toLowerCase().replace(/[-\s]/g, '');

      return slug.includes(searchTerms);
    }),
  };

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    custom: `populate[inventory_vehicles][fields][0]=''&populate[inventoryBanner][populate][media][fields][0]=url&populate[inventoryBanner][populate][media][fields][1]=mime&populate[inventoryBanner][populate][media][fields][2]=alternativeText&populate[inventoryBanner][populate][media][fields][3]=width&populate[inventoryBanner][populate][media][fields][4]=height&populate[inventoryBanner][populate][media][fields][5]=formats&populate[inventoryBanner][populate][mediaMP4][fields][0]=url&populate[inventoryBanner][populate][mediaMP4][fields][1]=mime&populate[seo][populate][metaImage][fields][0]=url&populate[seo][populate][metaSocial][fields][0]=url&sort=order:asc&fields[0]=title&fields[1]=slug&fields[2]=bottomTextInventory&populate[inventoryBanner][populate][imageMobile][fields][0]=url&populate[inventoryBanner][populate][imageMobile][fields][1]=mime&populate[inventoryBanner][populate][imageMobile][fields][2]=alternativeText&populate[inventoryBanner][populate][imageMobile][fields][3]=width&populate[inventoryBanner][populate][imageMobile][fields][4]=height&populate[inventoryBanner][populate][imageMobile][fields][5]=formats&populate[faqs_stock][fields][0]=title&populate[faqs_stock][fields][1]=text`,
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  let seoData = filters.type?.find(
    (item) => item.attributes.slug === context.query.type
  );

  seoData = seoData?.attributes?.seo ?? null;

  if (seoData) {
    // Modify meta title
    seoData.metaTitle = `${seoData.metaTitle}${context.query.type !== lang.armoredRentalURL && context.query.type !== lang.preOwnedURL ? ' for Sale' : ''} | Alpine Armoring`;

    // Modify meta description only when not armored-rental
    if (
      context.query.type &&
      context.query.type !== lang.armoredRentalURL &&
      context.query.type !== lang.preOwnedURL
    ) {
      const vehicleTypeRaw = context.query.type
        .split('-')
        .slice(1) // Remove the 'armored' part
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('\\s*');

      // Create regexes to match with and without 'armored'
      const vehicleTypeRegexWithArmored = new RegExp(
        `(Armored\\s*${vehicleTypeRaw})\\b`,
        'i'
      );
      const vehicleTypeRegexWithoutArmored = new RegExp(
        `(${vehicleTypeRaw})\\b`,
        'i'
      );

      // Replace with 'for sale', first with 'armored' version, then without
      let updatedDescription = seoData.metaDescription.replace(
        vehicleTypeRegexWithArmored,
        (match) => `${match} for sale`
      );

      if (updatedDescription === seoData.metaDescription) {
        updatedDescription = updatedDescription.replace(
          vehicleTypeRegexWithoutArmored,
          (match) => `${match} for sale`
        );
      }

      seoData.metaDescription = updatedDescription;
    }
  }

  return {
    props: {
      vehicles: filteredVehicles,
      filters,
      query: context.query.type,
      seoData,
    },
  };
}

export default Inventory;
