import { getPageData } from 'hooks/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Banner from 'components/global/banner/Banner';
import Link from 'next/link';
import Head from 'next/head';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';

function Inventory(props) {
  const currentCategory = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  const topBanner = currentCategory?.attributes.allBanner;
  const bottomText = currentCategory?.attributes.bottomText;
  const heading = currentCategory?.attributes.heading;

  const router = useRouter();

  const convertMarkdown = useMarkdownToHtml();

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
      vehicle.attributes.make?.data?.attributes?.slug === router.query.make
  );

  // // Filtering vehicles based on the q parameter
  // const filteredByQ = filteredByMake?.filter(
  //   (vehicle) => !q || vehicle.attributes?.slug.includes(q)
  // );

  // useEffect(() => {
  //   if (router.isReady) {
  //     setLoading(false);
  //   }
  // }, [router.isReady]);

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

  // const categoryTitle = findTitleBySlug(props?.filters, props?.query);
  const categoryTitle = currentCategory.attributes.title;
  const categorySlug = currentCategory.attributes.slug;

  const make = router.query.make;
  const categoryTitleWithMake = (
    <>
      {categoryTitle}
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
          name: 'Home',
          item: 'https://www.alpineco.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Vehicles we armor',
          item: `https://www.alpineco.com/vehicles-we-armor`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryTitle,
          item: `https://www.alpineco.com/vehicles-we-armor/type/${categorySlug}`,
        },
      ],
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
      </Head>
      <div className={`${styles.listing}`}>
        <div
          className={`b-breadcrumbs b-breadcrumbs-list b-breadcrumbs-dark container`}
        >
          <Link href="/">Home</Link>
          <span>&gt;</span>
          <Link href="/vehicles-we-armor">Vehicles We Armor</Link>
          <span>&gt;</span>
          <span className={`b-breadcrumbs_current`}>
            {categoryTitleWithMake}
          </span>
        </div>

        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}

        {heading ? (
          <p className={`${styles.listing_heading} center container`}>
            {heading}
          </p>
        ) : null}

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
            <div className={`${styles.listing_empty}`}>No Vehicles Found</div>
          )}
        </div>
      </div>

      {bottomText ? (
        <div className={`container_small`}>
          <p
            className={`${styles.listing_bottomText} darkColor`}
            dangerouslySetInnerHTML={{
              __html: convertMarkdown(bottomText),
            }}
          ></p>
        </div>
      ) : null}

      {loading ? (
        <div
          className={`${styles.listing_loading} ${styles.listing_loading_stock}`}
          style={{ opacity: loading ? 1 : 0 }}
        >
          Loading...
        </div>
      ) : null}

      <div className={`observe bottomObserver`}></div>
    </>
  );
}

export async function getServerSideProps(context) {
  const category = context.query.type;
  const queryMake = context.query.make;

  let query = `filters[category][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
  }

  // Fetching Vehicles
  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    // params: `filters[category][slug][$eq]=${params.type}`,
    params: query,
    sort: 'order',
    pageSize: 100,
    populate: 'featuredImage, make',
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
        'allBanner.media, allBanner.imageMobile, allBanner.mediaMP4, seo',
    }).then((res) => res.data),
    getPageData({
      route: 'makes',
      sort: 'title',
      pageSize: 100,
      fields: 'fields[0]=title&fields[1]=slug',
      populate: 'vehicles_we_armors.category',
    }).then((res) => res.data),
  ]);

  let filters = {};
  if (type && make) {
    filters = { type, make };
  }

  let seoData = type?.find(
    (item) => item.attributes.slug === context.query.type
  );
  seoData = seoData?.attributes.seo || null;

  const makeMetaTitle = queryMake
    ? ` ${queryMake
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}`
    : '';

  if (seoData) {
    seoData.metaTitle = `${seoData.metaTitle}${makeMetaTitle} | Alpine Armoring`;
  }

  // Modify meta description if queryMake exists
  if (queryMake && seoData.metaDescription) {
    // Format the make
    const formattedMake = queryMake
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Special case handling
    const specialReplacements = {
      'vans-and-buses': /Vans\s*(?:&|and)\s*Buses/i,
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
