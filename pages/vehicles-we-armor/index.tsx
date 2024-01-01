import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from '../../lib/api';

function Inventory(props) {
  console.log(props);
  // return null;

  return (
    <div className={`${styles.listing}`}>
      {props.topBanner ? (
        <ListingBanner props={props.topBanner.attributes} />
      ) : null}

      <div className="shape-before">
        <span style={{ background: '#f3f3f3' }}></span>
      </div>

      <div className={`${styles.listing_wrap} container`}>
        {props.filters.type ? <Sidebar props={props.filters} plain /> : null}

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

// interface InventoryProps {
//   data: any;
// }

export async function getServerSideProps(context) {
  // let topBanner: InventoryProps;

  // if (context.query.category) {
  //   topBanner = await getPageData({
  //     route: 'categories',
  //     slug: context.query.category,
  //     order: true,
  //   });
  //   topBanner = topBanner.data[0];

  // } else {
  //   topBanner = await getPageData({ route: 'list-vehicles-we-armor' });
  //   topBanner = topBanner.data;
  // }
  let topBanner = await getPageData({ route: 'list-vehicles-we-armor' });
  topBanner = topBanner.data || null;
  // if (topBanner && topBanner.data) {
  //   topBanner = topBanner.data;
  //  } else {
  //   // type = { type: [] };
  // }

  let query = '';
  if (context.query.category) {
    query += `&filters[category][slug][$eq]=${context.query.category}`;
  }
  if (context.query.make) {
    query += `&filters[make][slug][$eq]=${context.query.make}`;
  }
  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    params: query,
  });

  let type = await getPageData({ route: 'categories', order: true });
  type = type.data;
  let make = await getPageData({ route: 'makes', order: true });
  make = make.data;
  let filters = {};
  if (type && make) {
    filters = { type, make };
  } else {
    // type = { type: [] };
  }

  return {
    props: { topBanner, vehicles, filters },
  };
}

export default Inventory;
