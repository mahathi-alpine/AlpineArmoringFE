import React from 'react';
import Banner from 'components/global/banner/Banner';
import Sidebar from 'components/listing/sidebar/Sidebar';
import InventoryItem from 'components/listing/listing-item/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';

function Inventory(props) {
  // console.log(props)
  // return null
  const topBanner = props.pageData?.banner;

  useEffect(() => {
    document.body.classList.add('listing-inventory', 'background-dark');
    return () => {
      document.body.classList.remove('listing-inventory', 'background-dark');
    };
  }, []);

  return (
    <div className={`${styles.listing} background-dark`}>
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

        {props.vehicles.data ? (
          <div className={`${styles.listing_list}`}>
            {props.vehicles.data && props.vehicles.data.length > 0 ? (
              props.vehicles.data.map((item) => (
                <InventoryItem key={item.id} props={item} />
              ))
            ) : (
              <div className={`${styles.listing_list_error}`}>
                No Vehicles Found
              </div>
            )}
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
  // let topBanner: TopBannerProps;

  // if (context.query.category) {
  //   topBanner = await getPageData({
  //     route: 'categories',
  //     slug: context.query.category,
  //     // type: '[slug]',
  //   });
  //   topBanner = topBanner.data[0] || null;
  // } else {
  //   topBanner = await getPageData({ route: 'list-inventory' });
  //   topBanner = topBanner.data || null;
  // }
  let pageData = await getPageData({
    route: 'list-inventory',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  // Fetching Vehicles
  const { category, vehicles_we_armor, q } = context.query;

  let query = '';
  if (category) {
    query += `filters[category][slug][$eq]=${category}`;
  }
  if (vehicles_we_armor) {
    query += `filters[vehicles_we_armor][slug][$eq]=${vehicles_we_armor}`;
  }
  if (q) {
    query += `filters[slug][$contains]=${q}`;
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
    fields: 'fields[0]=title&fields[1]=slug',
  }).then((response) => response.data);

  const filters = type ? { type } : {};

  return {
    props: { pageData, vehicles, filters },
  };
}

export default Inventory;
