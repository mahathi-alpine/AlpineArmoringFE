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
      type: '[slug]',
    });
    topBanner = topBanner.data[0];
  } else {
    topBanner = await getPageData({ route: 'list-inventory' });
    topBanner = topBanner.data;
  }

  const vehicles = await getPageData({
    route: 'inventories',
    slug: context.query.category,
    type: '[category][slug]',
  });

  const types = await getPageData({ route: 'categories' });

  return {
    props: { topBanner, vehicles, types },
  };
}

// export async function getServerSideProps(context) {
//   const query = context.query.category ? `?filters[category][slug][$eq]=${context.query.category}&populate=deep` : '?populate=deep';

//   const headers = {
//     'Content-Type': 'application/json',
//   };

//   try {
//     const [vehiclesRes] = await Promise.all([
//       fetch(`http://localhost:1337/api/inventories${query}`)
//       // fetch(`http://localhost:1337/api/inventories?populate=deep`)
//     ]);

//     const propsVehicles = await vehiclesRes.json();

//     return {
//       props: { propsVehicles },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: error.message,
//       },
//     };
//   }
// }

// export async function getServerSideProps(context) {
//   const headers = {
//     'Content-Type': 'application/json',
//   };

//   const categorySlug = context.query.category ? `?category=${context.query.category}&populate=deep` : '';

//   try {
//     const vehiclesRes = await fetch(`http://localhost:1337/api/inventories${categorySlug}?populate=deep`);
//     const propsVehicles = await vehiclesRes.json();

//     return {
//       props: { propsVehicles },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: error.message,
//       },
//     };
//   }
//  }

// export async function getServerSideProps(context) {
//   const headers = {
//     'Content-Type': 'application/json',
//   };

//   try {
//     const [mainPageRes, vehiclesRes] = await Promise.all([
//       fetch('http://localhost:1337/api/list-inventory?populate=deep'),
//       fetch('http://localhost:1337/api/inventory-vehicles?populate=deep'),
//     ]);

//     const propsMainPage = await mainPageRes.json();
//     const propsVehicles = await vehiclesRes.json();

//     return {
//       props: { propsMainPage, propsVehicles },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: error.message,
//       },
//     };
//   }
// }

export default Inventory;
