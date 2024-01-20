import React from 'react';
import Banner from 'components/global/banner/Banner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item-all/ListingItemAll';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';

function Inventory(props) {
  // console.log(props);
  // return null;
  const topBanner = props.pageData?.banner;

  useEffect(() => {
    document.body.classList.add('listing-all');
    return () => {
      document.body.classList.remove('listing-all');
    };
  }, []);

  return (
    <div className={`${styles.listing}`}>
      {topBanner ? <Banner props={topBanner} shape="white" /> : null}

      <div className={`container`}>
        {props.filters.type ? <Sidebar props={props.filters} plain /> : null}
      </div>

      <div className={`${styles.listing_wrap} container`}>
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
  let pageData = await getPageData({
    route: 'list-vehicles-we-armor',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;
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
    populate: 'featuredImage',
  });

  // Fetching Types and Makes for the Filters
  const [type, make] = await Promise.all([
    getPageData({
      route: 'categories',
      order: true,
      fields: 'fields[0]=title&fields[1]=slug',
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
    props: { pageData, vehicles, filters },
  };
}

export default Inventory;
