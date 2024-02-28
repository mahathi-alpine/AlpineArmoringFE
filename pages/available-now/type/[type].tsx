import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Seo from 'components/Seo';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Inventory(props) {
  let topBanner = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.inventoryBanner;

  const seoData = props?.seo;

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
    };
  }, []);

  return (
    <>
      <Seo props={seoData} />

      <div className={`${styles.listing} background-dark`}>
        {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

        <div
          className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
        >
          {props.filters.type ? <Filters props={props.filters} /> : null}

          {props.vehicles.data ? (
            <div className={`${styles.listing_list}`}>
              {props.vehicles.data && props.vehicles.data.length > 0 ? (
                props.vehicles.data
                  .filter((item) => item.attributes.ownPage !== false)
                  .map((item) => <InventoryItem key={item.id} props={item} />)
              ) : (
                <div className={`${styles.listing_list_error}`}>
                  No Vehicles Found
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

// interface TopBannerProps {
//   data: any;
// }

export async function getServerSideProps(context) {
  // Fetching Vehicles
  const category = context.query.type;
  let query = `filters[categories][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += `&filters[slug][$contains]=${q}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'title',
    populate: 'featuredImage',
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    sort: 'order',
    fields: 'fields[0]=title&fields[1]=slug',
    populate: 'inventoryBanner.media, inventory_vehicles',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  return {
    props: { vehicles, filters, query: context.query.type },
  };
}

export default Inventory;
