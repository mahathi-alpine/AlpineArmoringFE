import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from '../../lib/api';

function Inventory(props) {
  
  return (
    <div className={`${styles.listing} background-dark`}>

      {props.topBanner ? <ListingBanner props={props.topBanner} /> : null}

      <div className="shape-after"><span style={{background: '#2B2B2B'}}></span></div>

      <div className={`${styles.listing_wrap} container`}>
        <Sidebar props={props.types} />

        {props.vehicles.data ? (
          <div className={`${styles.listing_list}`}>
            {props.vehicles.data.map((item) => (
              <InventoryItem stock key={item.id} props={item} />
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
      type: '[slug]'
    });
    topBanner = topBanner.data[0];
  } else {
    topBanner = await getPageData({ route: 'list-inventory' });
    topBanner = topBanner.data;
  }

  let vehicles = {};
  if (context.query.vehicles_we_armor) {
    vehicles = await getPageData({
      route: 'inventories',
      slug: context.query.vehicles_we_armor,
      type: '[vehicles_we_armor][slug]',
    });
  } else {    
    vehicles = await getPageData({
      route: 'inventories',
      slug: context.query.category,
      type: '[category][slug]',
    });
  }

  const types = await getPageData({ route: 'categories', order: true });

  return {
    props: { topBanner, vehicles, types },
  };
}

export default Inventory;
