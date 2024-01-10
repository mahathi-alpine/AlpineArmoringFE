import React from 'react';
import ListingBanner from 'components/listing/listing-banner/ListingBanner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';

function Inventory(props) {
  // console.log(props);
  // return null;
  const topBanner = props.filters.type.find(
    (item) => item.attributes.slug === props.query
  );

  useEffect(() => {
    document.body.classList.add('listing-all');
    return () => {
      document.body.classList.remove('listing-all');
    };
  }, []);

  return (
    <div className={`${styles.listing}`}>
      {topBanner ? <ListingBanner props={topBanner.attributes} /> : null}

      <div className="shape-before"></div>

      <div className={`${styles.listing_wrap} container`}>
        {props.filters.type ? <Sidebar props={props.filters} plain /> : null}

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

// interface InventoryProps {
//   data: any;
// }

export async function getServerSideProps(context) {
  const category = context.query.type;
  let query = `filters[category][slug][$eq]=${category}`;
  if (context.query.make) {
    query += `&filters[make][slug][$eq]=${context.query.make}`;
  }

  const vehicles = await getPageData({
    route: 'vehicles-we-armors',
    params: query,
    populate: 'featuredImage',
  });

  // Fetching Types and Makes for the Filters
  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      order: true,
      fields: 'fields[0]=title&fields[1]=slug&fields[2]=bannerText',
      populate: 'bannerImage',
    }).then((res) => res.data),
    getPageData({
      route: 'makes',
      order: true,
      fields: 'fields[0]=title&fields[1]=slug',
    }).then((res) => res.data),
  ]);

  let filters = {};
  if (type && make) {
    filters = { type, make };
  }

  return {
    props: { vehicles, filters, query: context.query.type },
  };
}

export default Inventory;
