import React from 'react';
import { getPageData } from 'lib/api';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '/components/listing/Listing.module.scss';

import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Inventory(props) {
  const router = useRouter();
  const { q } = router.query;

  const topBanner = props.pageData?.banner;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [q]);

  // Group vehicles by category
  const groupedByCategory = vehiclesData?.reduce((acc, item) => {
    const category = item.attributes.categories?.data[0]
      ? item.attributes.categories.data[0].attributes.title
      : item.attributes.categories;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Convert the groupedByCategory object into an array of objects
  const vehiclesArray = Object.entries(groupedByCategory).map(
    ([title, items]) => ({ title, items })
  );

  // Sort the vehiclesArray based on the order in props.filters.type, placing '[object Object]' at the end
  vehiclesArray.sort((a, b) => {
    if (a.title === '[object Object]') return 1;
    if (b.title === '[object Object]') return -1;

    const indexA = props.filters.type.findIndex(
      (c) => c.attributes.title === a.title
    );
    const indexB = props.filters.type.findIndex(
      (c) => c.attributes.title === b.title
    );
    return indexA - indexB;
  });

  const [currentPage, setCurrentPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreItems = async () => {
    if (!hasMore) return;
    // Increment the current page number
    setCurrentPage(currentPage + 1);

    const query = q ? `filters[slug][$contains]=${q}` : '';

    // Fetch the next batch of items using the current page number
    const vehicles = await getPageData({
      route: 'inventories',
      sort: 'title',
      populate: 'featuredImage, categories',
      page: currentPage,
      pageSize: 12,
      params: query,
    });

    // Merge the new items with the existing items
    setVehiclesData((prevData) => [...prevData, ...vehicles.data]);

    const totalItems = props.vehicles.meta.pagination.total;
    const itemsFetched = vehiclesData.length + vehicles.data.length;
    setHasMore(itemsFetched < totalItems);
  };

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current?.observe(item));

    return () => {
      if (observerRef.current) {
        targets.forEach((item) => observerRef.current.unobserve(item));
      }
    };
  }, []);

  const bottomObserverRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && props.vehicles.data.length == 12) {
          fetchMoreItems();
        }
      });
    });

    if (bottomObserverRef.current) {
      observer.observe(bottomObserverRef.current);
    }

    return () => {
      if (bottomObserverRef.current) {
        observer.unobserve(bottomObserverRef.current);
      }
    };
  }, [currentPage, hasMore, props.vehicles.data.length]);

  return (
    <>
      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {props.filters.type ? <Filters props={props.filters} /> : null}

          {props.vehicles.data?.length < 1 ? (
            <div className={`${styles.listing_list_error}`}>
              <h2>No Vehicles Found</h2>
            </div>
          ) : null}

          {vehiclesArray ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesArray.map((category, indexInitial) => {
                return Array.isArray(category.items)
                  ? category.items
                      .filter((item) => item.attributes.ownPage !== false)
                      .map((item, index) => (
                        <InventoryItem
                          key={item.id}
                          props={item}
                          index={indexInitial === 0 && index === 0 ? index : 1}
                        />
                      ))
                  : null;
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div ref={bottomObserverRef}></div>
    </>
  );
}

export async function getServerSideProps(context) {
  let pageData = await getPageData({
    route: 'list-inventory',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const { vehicles_we_armor, q } = context.query;

  let query = '';
  if (vehicles_we_armor) {
    query += `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor}`;
  }
  if (q) {
    query += `filters[slug][$contains]=${q.toLowerCase()}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'title',
    populate: 'featuredImage,categories',
    page: 1,
    pageSize: 12,
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    sort: 'order',
    populate: 'inventory_vehicles',
    fields: 'fields[0]=title&fields[1]=slug',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  const seoData = pageData.seo;

  return {
    props: { pageData, vehicles, filters, seoData },
  };
}

export default Inventory;
