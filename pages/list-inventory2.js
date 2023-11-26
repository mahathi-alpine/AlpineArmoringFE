import BannerTop from '../components/listings/BannerTop';

function ListInventory({ props, error }) {
  console.log(props)
  const data = props?.data?.attributes;

  return (
    <div className="list-inventory">
        {data? <BannerTop props={props}/> : null}
    </div>
  );
}


export async function getServerSideProps(context) {
  const headers = {
    'Content-Type': 'application/json',
  };
 
  try {
    const response = await fetch('http://localhost:1337/api/list-inventory?populate=deep', {
      method: 'GET',
      headers,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const props = await response.json();
  
    return {
      props: {
        props: props,
      },
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