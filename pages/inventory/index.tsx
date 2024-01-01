import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from '../../lib/api';

function Inventory(props) {
  if (!props) {
    return null;
  }

  return (
    <div className={`${styles.listing} background-dark`}>
      {props.topBanner?.attributes?.bannerImage ? (
        <ListingBanner props={props.topBanner} overlay={true} />
      ) : null}

      <div className="shape-after">
        <span style={{ background: '#2B2B2B' }}></span>
      </div>

      <div
        className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
      >
        {props.types ? <Sidebar props={props.types} /> : null}

        {props.vehicles?.data ? (
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

interface TopBannerProps {
  data: any;
}

export async function getServerSideProps(context) {
  let topBanner: TopBannerProps;

  if (context.query.category) {
    topBanner = await getPageData({
      route: 'categories',
      slug: context.query.category,
      // type: '[slug]',
    });
    topBanner = topBanner.data[0] || null;
  } else {
    topBanner = await getPageData({ route: 'list-inventory' });
    topBanner = topBanner.data || null;
  }

  // Fetching Vehicles
  const { category, vehicles_we_armor } = context.query;

  let query = '';
  if (category) {
    query += `filters[category][slug][$eq]=${category}`;
  }
  if (vehicles_we_armor) {
    query += `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor}`;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
  });

  // Fetching Categories
  let types = await getPageData({ route: 'categories', order: true });
  types = { type: types.data };

  return {
    props: { topBanner, vehicles, types },
  };
}

export default Inventory;
