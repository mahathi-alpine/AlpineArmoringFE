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

  return (
    <div className={`${styles.listing}`}>
      <svg className="noiseBg" width="100%" height="100%">
        <filter id="esteisalegend">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.80"
            numOctaves="4"
            stitchTiles="stitch"
          ></feTurbulence>
        </filter>
        <rect width="100%" height="100%" filter="url(#esteisalegend)"></rect>
      </svg>

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
