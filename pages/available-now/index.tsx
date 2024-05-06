import React from 'react';
import { getPageData } from 'lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '/components/listing/Listing.module.scss';

import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';

function Inventory(props) {
  const topBanner = props.pageData?.banner;

  const router = useRouter();
  const { q } = router.query;
  const { vehicles_we_armor } = router.query;

  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [itemsToRender, setItemsToRender] = useState(6);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [q, vehicles_we_armor]);

  const fetchMoreItems = () => {
    if (itemsToRender < vehiclesData?.length) {
      setLoading(true);
      setItemsToRender((prevItemsToRender) => prevItemsToRender + 6);
      setLoading(false);
    }
  };
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            // observer.unobserve(entry.target);

            if (entry.target.classList.contains('bottomObserver')) {
              fetchMoreItems();
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, [itemsToRender, vehiclesData]);

  return (
    <>
      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {props.filters.type ? <Filters props={props.filters} /> : null}

          {vehiclesData?.length < 1 ? (
            <div className={`${styles.listing_list_error}`}>
              <h2>No Vehicles Found</h2>
            </div>
          ) : null}

          {vehiclesData ? (
            <div className={`${styles.listing_list}`}>
              {vehiclesData.slice(0, itemsToRender).map((item, index) => (
                <InventoryItem key={index} props={item} index={index} />
              ))}
            </div>
          ) : null}
        </div>
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
  try {
    let pageData = await getPageData({
      route: 'list-inventory',
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
      fields:
        'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug',
      pageSize: 100,
    });

    // Fetching Types for the Filters
    const type = await getPageData({
      route: 'categories',
      custom:
        "populate[inventory_vehicles][fields][0]=''&sort=order:asc&fields[0]=title&fields[1]=slug",
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
    // return {
    //   props: { pageData: null, vehicles: null, filters: null, seoData: null },
    // };
  }
}

export default Inventory;
