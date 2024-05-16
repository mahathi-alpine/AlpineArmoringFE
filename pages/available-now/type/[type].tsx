import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function Inventory(props) {
  let topBanner = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.inventoryBanner;

  const router = useRouter();
  const [vehiclesData, setVehiclesData] = useState(props.vehicles.data);
  const [itemsToRender, setItemsToRender] = useState(6);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVehiclesData(props.vehicles.data);
  }, [router.query]);

  const fetchMoreItems = () => {
    if (itemsToRender < vehiclesData?.length) {
      setLoading(true);
      setItemsToRender((prevItemsToRender) => prevItemsToRender + 6);
      setLoading(false);
    }
  };

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
  }, [itemsToRender]);

  return (
    <>
      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {props.filters.type ? <Filters props={props.filters} /> : null}

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
  // Fetching Vehicles
  const category = context.query.type;
  let query = `filters[categories][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += `&filters[slug][$contains]=${q.toLowerCase()}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'order',
    populate: 'featuredImage',
    fields:
      'fields[0]=VIN&fields[1]=armor_level&fields[2]=vehicleID&fields[3]=engine&fields[4]=title&fields[5]=slug&fields[6]=flag&fields[7]=label&fields[8]=ownPage',
    pageSize: 100,
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    custom: `populate[inventory_vehicles][fields][0]=''&populate[inventoryBanner][populate][media][fields][0]=url&populate[inventoryBanner][populate][media][fields][1]=mime&populate[inventoryBanner][populate][media][fields][2]=alternativeText&populate[inventoryBanner][populate][media][fields][3]=width&populate[inventoryBanner][populate][media][fields][4]=height&populate[inventoryBanner][populate][media][fields][5]=formats&populate[seo][populate][metaImage][fields][0]=url&populate[seo][populate][metaSocial][fields][0]=url&sort=order:asc&fields[0]=title&fields[1]=slug`,
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  let seoData = filters.type?.find(
    (item) => item.attributes.slug === context.query.type
  );

  seoData = seoData?.attributes?.seo ?? null;

  return {
    props: { vehicles, filters, query: context.query.type, seoData },
  };
}

export default Inventory;
