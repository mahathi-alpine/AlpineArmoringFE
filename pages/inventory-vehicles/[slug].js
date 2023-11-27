import BannerTop from '../../components/listings/BannerTop';
import Sidebar from '../../components/listings/Sidebar';
import InventoryItem from '../../components/listings/InventoryItem';
import styles from './Listing.module.scss';

function Inventory(props) {
  // console.log(props.propsCategory)

  return (
    <div className={`${styles.listing}`}>
        {props.propsCategory? <BannerTop props={props.propsCategory}/> : null}

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
  const categoryName = context.params.slug;

  const headers = {
    'Content-Type': 'application/json',
  };
 
  try {
    const [categoryRes, vehiclesRes] = await Promise.all([
      fetch(`http://localhost:1337/api/category/${categoryName}?populate=bannerImage`), 
      fetch(`http://localhost:1337/api/inventory-vehicles?filters[category][slug][$eq]=${categoryName}&populate=deep`)
    ]);    

    const propsCategory = await categoryRes.json();
    const propsVehicles = await vehiclesRes.json();
  
    return {
      props: { propsCategory, propsVehicles },
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