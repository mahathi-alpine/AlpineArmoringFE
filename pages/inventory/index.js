import BannerTop from '../../components/listings/BannerTop';
import Sidebar from '../../components/listings/Sidebar';
import InventoryItem from '../../components/listings/InventoryItem';
import styles from './Listing.module.scss';
import { getPageData } from '../../lib/api';

function Inventory(props) {  
  return (
    <div className={`${styles.listing}`}>
        {/* {props.propsMainPage? <BannerTop props={props.propsMainPage}/> : null} */}

        <div className={`${styles.listing_wrap} container`}>

          <Sidebar />

          {props.vehicles.data? <div  className={`${styles.listing_list} container`} >
            {props.vehicles.data.map((item) => (
              <InventoryItem key={item.id} props={item} />
            ))}          
          </div> : null }

        </div>
    </div>
  );
}

export async function getServerSideProps(context) {

  const vehicles = await getPageData(
    'inventories',
    context.query.category,
    '[category][slug]'
  );

  return {
    props: { vehicles },
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