import BannerTop from '../../components/listings/BannerTop';
import ListInventoryItem from '../../components/listings/ListInventoryItem';

function ListInventory({ props, error }) {
  console.log(props)
  const data = props?.data?.attributes;

  return (
    <div className="list-inventory">
        {data? <BannerTop props={props}/> : null}
        {/* {items.map((item) => (
            <ListInventoryItem key={item.id} props={item} />
          ))} */}
    </div>
  );
}


export async function getServerSideProps(context) {
 
  try {
    const listingPage = `http://localhost:1337/api/list-inventory?populate=deep`;
    const inventoryVehicles = `http://localhost:1337/api/inventory-vehicles?populate=deep`;

    // const [listingRes, vehiclesRes] = await Promise.all([
    //     fetch(listingPage),
    //     fetch(inventoryVehicles)
    // ]);
    const [listingRes] = await Promise.all([
        fetch(listingPage)
    ]);

    const items = await listingRes.json();
    // const data = await vehiclesRes.json();
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return {
        // props: { items, data },
        props: { items }
    };

   } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
   }
}


export default ListInventory;