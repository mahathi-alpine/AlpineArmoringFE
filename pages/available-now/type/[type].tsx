import React from 'react';
import Banner from 'components/global/banner/Banner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';

function Inventory(props) {
  let topBanner = props.filters.type?.find(
    (item) => item.attributes.slug === props.query
  );
  topBanner = topBanner?.attributes.inventoryBanner;
  // console.log(topBanner);
  // return null

  useEffect(() => {
    document.body.classList.add('listing-inventory', 'background-dark');
    return () => {
      document.body.classList.remove('listing-inventory', 'background-dark');
    };
  }, []);

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

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`${styles.listing}`}>
      {topBanner ? <Banner props={topBanner} shape="dark" /> : null}

      <div
        className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
      >
        {props.filters.type ? <Sidebar props={props.filters} /> : null}

        {props.vehicles.data?.length < 1 ? (
          <div className={`${styles.listing_empty}`}>
            <h2>No Vehicles Found</h2>
          </div>
        ) : null}

        {props.vehicles.data ? (
          <div className={`${styles.listing_list}`}>
            {props.vehicles.data.map((item) => (
              <InventoryItem key={item.id} props={item} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// interface TopBannerProps {
//   data: any;
// }

export async function getServerSideProps(context) {
  // Fetching Vehicles
  const category = context.query.type;
  let query = `filters[category][slug][$eq]=${category}`;
  const q = context.query.q;
  if (q) {
    query += `&filters[slug][$contains]=${q}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    populate: 'featuredImage',
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    order: true,
    // fields: 'fields[0]=title&fields[1]=slug&fields[2]=bannerText',
    fields: 'fields[0]=title&fields[1]=slug',
    populate: 'inventoryBanner.media',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  return {
    props: { vehicles, filters, query: context.query.type },
  };
}

export default Inventory;
