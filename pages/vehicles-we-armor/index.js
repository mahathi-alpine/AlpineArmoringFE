import ListingBanner from '../../components/listing/ListingBanner';
import Sidebar from '../../components/listing/Sidebar';
import InventoryItem from '../../components/listing/ListingItem';
import styles from '/components/listing/Listing.module.scss';
import { getPageData } from '../../lib/api';

function Inventory(props) {  

  return (
    <div className={`${styles.listing}`}>
        {props.topBanner? <ListingBanner props={props.topBanner}/> : null}

        <div className={`${styles.listing_wrap} container`}>

          <Sidebar />

          {props.vehicles.data? <div className={`${styles.listing_list}`} >
            {props.vehicles.data.map((item) => (
              <InventoryItem key={item.id} props={item} />
            ))}          
          </div> : null }

        </div>
    </div>
  );
}

export async function getServerSideProps(context) {

  let topBanner = {};

  if(context.query.category){
    topBanner = await getPageData(
      'categories',
      context.query.category,
      '[slug]'
    );
    topBanner = topBanner.data[0];
  } else {
    topBanner = await getPageData(
      'list-vehicles-we-armor'
    );
    topBanner = topBanner.data;
  }

  const vehicles = await getPageData(
    'vehicles-we-armors',
    context.query.category,
    '[category][slug]'
  );

  return {
    props: { topBanner, vehicles },
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