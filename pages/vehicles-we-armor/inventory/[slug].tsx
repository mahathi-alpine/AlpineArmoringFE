import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';

function Inventory(props) {
  // console.log(props)
  // return null

  return (
    <div className={`${styles.listing} background-dark`}>
      {props.topBanner ? (
        <>
          <ListingBanner props={props.topBanner.attributes} overlay={true} />

          <div className="shape-after">
            <span style={{ background: '#2B2B2B' }}></span>
          </div>
        </>
      ) : null}

      <div
        className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
      >
        {props.filters.type ? <Sidebar props={props.filters} /> : null}

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
  let topBanner = await getPageData({
    route: 'list-inventory',
    populate: 'deep',
  });
  topBanner = topBanner.data || null;

  // Fetching Vehicles
  const query = `filters[vehicles_we_armor][slug][$eq]=${context.query.slug}`;

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    populate: 'featuredImage',
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    order: true,
    fields: 'fields[0]=title&fields[1]=slug',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  return {
    props: { topBanner, vehicles, filters },
  };
}

export default Inventory;
