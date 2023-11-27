import HpBanner from '../components/homepage/HpBanner';
import Categories from '../components/homepage/Categories';

function Home( props ) {

  // if (error) {
  //   return null;
  // }

  const topBanner = props.propsMainPage.data.attributes.topBanner;
  const categories = props.propsCategories.data;

  return (
    <div>
      <div className="">
        {topBanner ? <HpBanner props={topBanner}/> : null}
        {categories ? <Categories props={categories}/> : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const headers = {
    'Content-Type': 'application/json',
  };
 
  try {
    const [mainPageRes, categoriesRes] = await Promise.all([
      fetch('http://localhost:1337/api/homepage?populate=deep'),
      fetch('http://localhost:1337/api/categories?populate=deep'),
    ]);

    const propsMainPage = await mainPageRes.json();
    const propsCategories = await categoriesRes.json();
  
    return {
      props: { propsMainPage, propsCategories },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
}

// export async function getServerSideProps(context) {
//   const headers = {
//     'Content-Type': 'application/json',
//   };
 
//   try {
//     const response = await fetch('http://localhost:1337/api/homepage?populate=deep', {
//       method: 'GET',
//       headers,
//     });
  
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
  
//     const props = await response.json();
  
//     return {
//       props: {
//         props: props,
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         error: error.message,
//       },
//     };
//   }
// }

export default Home;