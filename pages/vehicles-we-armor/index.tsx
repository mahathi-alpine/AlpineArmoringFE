import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from '../../lib/api';

function Inventory(props) {
  return (
    <div className={`${styles.listing}`}>
      {props.topBanner ? <ListingBanner props={props.topBanner} /> : null}

      <div className={`${styles.listing_wrap} container`}>
        <Sidebar props={props.types} />

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

interface InventoryProps {
  data: any;
}

export async function getServerSideProps(context) {
  let topBanner: InventoryProps;

  if (context.query.category) {
    topBanner = await getPageData({
      route: 'categories',
      slug: context.query.category,
      type: '[slug]',
      order: true,
    });
    topBanner = topBanner.data[0];
  } else {
    topBanner = await getPageData({ route: 'list-vehicles-we-armor' });
    topBanner = topBanner.data;
  }

  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    slug: context.query.category,
    type: '[category][slug]',
  });

  const types = await getPageData({ route: 'categories', order: true });

  return {
    props: { topBanner, vehicles, types },
  };
}

export default Inventory;
