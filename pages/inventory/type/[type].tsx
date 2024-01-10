import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';

function Inventory(props) {
  const topBanner = props.filters.type.find(
    (item) => item.attributes.slug === props.query
  );
  // console.log(props);
  // return null

  useEffect(() => {
    document.body.classList.add(
      'listing-inventory',
      // 'header-transparent',
      'background-dark'
    );
    return () => {
      document.body.classList.remove(
        'listing-inventory',
        // 'header-transparent',
        'background-dark'
      );
    };
  }, []);

  return (
    <div className={`${styles.listing}`}>
      {topBanner ? (
        <>
          <ListingBanner props={topBanner.attributes} overlay={true} />

          <div className="shape-before"></div>
        </>
      ) : null}

      <div
        className={`${styles.listing_wrap} ${styles.listing_wrap_inventory} container`}
      >
        {props.filters.type ? <Sidebar props={props.filters} /> : null}

        {props.vehicles.data.length < 1 ? (
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
  const query = `filters[category][slug][$eq]=${category}`;

  const vehicles = await getPageData({
    route: 'inventories',
    params: query,
    populate: 'featuredImage',
  });

  // Fetching Types for the Filters
  const type = await getPageData({
    route: 'categories',
    order: true,
    fields: 'fields[0]=title&fields[1]=slug&fields[2]=bannerText',
    populate: 'bannerImage',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  return {
    props: { vehicles, filters, query: context.query.type },
  };
}

export default Inventory;
