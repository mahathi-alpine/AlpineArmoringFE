import React from 'react';
import { getPageData } from 'lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/components/listing/Listing.module.scss';

import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';

function Inventory(props) {
  const router = useRouter();
  const { q } = router.query;

  const topBanner = props.pageData?.banner;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [q]);

  const [currentPage, setCurrentPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const pageLimit = 6;

  const fetchMoreItems = async () => {
    if (!hasMore) return;

    const totalItems = props.vehicles?.meta?.pagination?.total || 0;

    if (currentPage * pageLimit >= totalItems + pageLimit) return;

    setLoading(true);
    setCurrentPage(currentPage + 1);

    const query = q ? `filters[slug][$contains]=${q}` : '';

    // Fetch the next batch of items using the current page number
    const vehicles = await getPageData({
      route: 'inventories',
      sort: 'order',
      populate: 'featuredImage, categories',
      page: currentPage,
      pageSize: pageLimit,
      params: query,
    });

    // Ensure vehicles.data is an array before updating the state
    if (Array.isArray(vehicles.data)) {
      setVehiclesData((prevData) => [...prevData, ...vehicles.data]);
    }

    const itemsFetched = vehiclesData?.length + vehicles.data.length || 0;
    setHasMore(itemsFetched < totalItems);
    setLoading(false);
  };

  useEffect(() => {
    // const setupObserver = () => {
    const targets = document.querySelectorAll('.observe');
    // if (targets.length < 1) {
    //   setTimeout(setupObserver, 100);
    //   return;
    // }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.toggle('in-view', entry.isIntersecting);
          observer.unobserve(entry.target);

          // Load more
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
    // };

    // setupObserver();
  }, [currentPage, hasMore, props.vehicles.data]);

  // Animations
  // const observerRef = useIntersectionObserver();
  // useEffect(() => {
  //   const targets = document.querySelectorAll('.observe');
  //   targets.forEach((item) => observerRef.current?.observe(item));

  //   return () => {
  //     if (observerRef.current) {
  //       targets.forEach((item) => observerRef.current.unobserve(item));
  //     }
  //   };
  // }, []);

  // const bottomObserverRef = useRef(null);
  // useEffect(() => {
  //   const observer = new IntersectionObserver((entries) => {
  //     entries.forEach((entry) => {
  //       if (entry.isIntersecting) {
  //         fetchMoreItems();
  //       }
  //     });
  //   });

  //   if (bottomObserverRef.current) {
  //     observer.observe(bottomObserverRef.current);
  //   }

  //   return () => {
  //     if (bottomObserverRef.current) {
  //       observer.unobserve(bottomObserverRef.current);
  //     }
  //   };
  // }, [currentPage, hasMore, props.vehicles.data]);

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

          {vehiclesData ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.map((item, index) => (
                <InventoryItem key={index} props={item} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={`${styles.listing_loading}`}
        style={{ opacity: loading ? 1 : 0 }}
      >
        Loading...
      </div>

      {/* <div ref={bottomObserverRef}></div> */}
      <div className={`observe bottomObserver`}></div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
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
      sort: 'order',
      populate: 'featuredImage,categories',
      page: 1,
      pageSize: 6,
    });

    // Fetching Types for the Filters
    const type = await getPageData({
      route: 'categories',
      sort: 'order',
      populate: 'inventory_vehicles',
      fields: 'fields[0]=title&fields[1]=slug',
    }).then((response) => response.data);

    const filters = type ? { type } : {};

    const seoData = pageData?.seo ?? null;

    return {
      props: { pageData, vehicles, filters, seoData },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      notFound: true,
    };
    return {
      props: { pageData: null, vehicles: null, filters: null, seoData: null },
    };
  }
}

export default Inventory;
