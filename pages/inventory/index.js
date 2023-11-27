import BannerTop from '../../components/listings/BannerTop';
import Sidebar from '../../components/listings/Sidebar';
import InventoryItem from '../../components/listings/InventoryItem';
import styles from './Listing.module.scss';

function Inventory(props) {
  return (
    <div className={`${styles.listing}`}>
        {props.propsMainPage? <BannerTop props={props.propsMainPage}/> : null}

        <div className={`${styles.listing_wrap} container`}>

          <Sidebar />

          {props.propsVehicles.data? <div  className={`${styles.listing_list} container`} >
            {props.propsVehicles.data.map((item) => (
              <InventoryItem key={item.id} props={item} />
            ))}          
          </div> : null }

        </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const headers = {
    'Content-Type': 'application/json',
  };
 
  try {
    const [mainPageRes, vehiclesRes] = await Promise.all([
      fetch('http://localhost:1337/api/list-inventory?populate=deep'),
      fetch('http://localhost:1337/api/inventory-vehicles?populate=deep'),
    ]);

    const propsMainPage = await mainPageRes.json();
    const propsVehicles = await vehiclesRes.json();
  
    return {
      props: { propsMainPage, propsVehicles },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}

export default Inventory;