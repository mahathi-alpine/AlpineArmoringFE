import React from 'react';
import Banner from 'components/global/banner/Banner';
import Filters from 'components/listing/filters/Filters';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';

function Inventory(props) {
  let topBanner = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.inventoryBanner;

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
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
  }, []);

  return (
    <>
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
                  .map((item, index) => (
                    <InventoryItem key={item.id} props={item} index={index} />
                  ))
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
    query += `&filters[slug][$contains]=${q.toLowerCase()}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    sort: 'order',
    populate: 'featuredImage',
    pageSize: 100,
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    sort: 'order',
    fields: 'fields[0]=title&fields[1]=slug',
    populate: 'inventoryBanner.media, inventory_vehicles, seo',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  let seoData = filters.type?.find(
    (item) => item.attributes.slug === context.query.type
  );
  // seoData = seoData?.attributes.seo;

  seoData = seoData?.attributes?.seo ?? null;

  return {
    props: { vehicles, filters, query: context.query.type, seoData },
  };
}

export default Inventory;
