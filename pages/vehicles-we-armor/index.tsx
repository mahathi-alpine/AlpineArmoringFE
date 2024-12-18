import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

function VehicleWeArmor(props) {
  const router = useRouter();
  const topBanner = props.pageData?.banner;

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

  // const categoryOrderMap = new Map(
  //   props.filters.type?.map((category) => [
  //     category.attributes.title,
  //     category.attributes.order,
  //   ])
  // );

  // const vehiclesArray = vehiclesData?.sort((a, b) => {
  //   // Correctly access the category order using the category title
  //   const categoryOrderA = categoryOrderMap.get(
  //     a.attributes.category.data?.attributes.title
  //   );
  //   const categoryOrderB = categoryOrderMap.get(
  //     b.attributes.category.data?.attributes.title
  //   );

  //   // Compare by category order
  //   if (categoryOrderA !== categoryOrderB) {
  //     return Number(categoryOrderA) - Number(categoryOrderB);
  //   }

  //   // If categories are equal, compare by make title alphabetically
  //   const makeOrderA = a.attributes.make
  //     ? a.attributes.make.data?.attributes.title
  //     : '';
  //   const makeOrderB = b.attributes.make
  //     ? b.attributes.make.data?.attributes.title
  //     : '';
  //   return makeOrderA?.localeCompare(makeOrderB);
  // });

  // const [currentPage, setCurrentPage] = useState(2);
  // const [hasMore, setHasMore] = useState(true);
  // const pageLimit = 30;

  // const fetchMoreItems = async () => {
  //   if (!hasMore) return;

  //   const totalItems = props.vehicles?.meta?.pagination?.total || 0;

  //   if (currentPage * pageLimit >= totalItems + pageLimit) return;

  //   setLoading(true);
  //   setCurrentPage(currentPage + 1);

  //   const query = q ? `filters[slug][$contains]=${q}` : '';

  //   // Fetch the next batch of items using the current page number
  //   const vehicles = await getPageData({
  //     route: 'vehicles-we-armors',
  //     sort: 'category.order',
  //     populate: 'featuredImage, category, make',
  //     page: currentPage,
  //     pageSize: pageLimit,
  //     params: query,
  //   });

  //   if (Array.isArray(vehicles.data)) {
  //     setVehiclesData((prevData) => [...prevData, ...vehicles.data]);
  //   }

  //   const itemsFetched = vehiclesData?.length + vehicles.data.length || 0;
  //   setHasMore(itemsFetched < totalItems);
  //   setLoading(false);
  // };

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
          name: 'Home',
          item: 'https://www.alpineco.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Vehicles we armor',
          item: `https://www.alpineco.com/vehicles-we-armor`,
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
          Vehicles We Armor
        </div>

        {topBanner ? <Banner props={topBanner} shape="white" small /> : null}

        <div className={`${styles.listing_all_filters} container`}>
          {props.filters.type ? <Filters props={props.filters} plain /> : null}
        </div>

        <div className={`${styles.listing_wrap} container`}>
          {vehiclesData?.length < 1 ? (
            <div className={`${styles.listing_empty}`}>
              <h2>No Vehicles Found</h2>
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

      {loading ? (
        <div
          className={`${styles.listing_loading}`}
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
  const queryMake = context.query.make;

  try {
    let pageData = await getPageData({
      route: 'list-vehicles-we-armor',
      populate: 'deep',
    });
    pageData = pageData?.data?.attributes || null;

    let query = '';
    if (context.query.category) {
      query += `&filters[category][slug][$eq]=${context.query.category}`;
    }
    if (context.query.make) {
      query +=
        (query ? '&' : '') + `&filters[make][slug][$eq]=${context.query.make}`;
    }
    if (context.query.q) {
      query += (query ? '&' : '') + `filters[slug][$notNull]=true`;
    }

    const vehicles = await getPageData({
      route: 'vehicles-we-armors',
      params: query,
      populate: 'featuredImage, category, make',
      pageSize: 100,
      sort: 'order',
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
      }).then((res) => res.data),
      getPageData({
        route: 'makes',
        sort: 'title',
        pageSize: 100,
        fields: 'fields[0]=title&fields[1]=slug',
      }).then((res) => res.data),
    ]);

    let filters = {};
    if (type && make) {
      filters = { type, make };
    }

    const seoData = pageData?.seo || null;

    const makeMetaTitle = queryMake
      ? `- ${queryMake
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')}`
      : '';
    seoData.metaTitle = `${seoData.metaTitle} ${makeMetaTitle} | Alpine Armoring`;

    seoData.metaDescription = queryMake
      ? `Make your armored ${makeMetaTitle.replace('-', '').trim()} secure and stylish with Alpine Armoring's top-tier solutions, from SUVs to luxury cars, customized for ultimate protection.`
      : seoData.metaDescription;

    return {
      props: { pageData, vehicles: filteredVehicles, filters, seoData },
    };
  } catch (error) {
    // console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
  }
}

export default VehicleWeArmor;
