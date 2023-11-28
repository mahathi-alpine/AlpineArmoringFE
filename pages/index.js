import HpBanner from '../components/homepage/HpBanner';
import Categories from '../components/homepage/Categories';
import { getPageData } from '../lib/api';
import styles from '/components/listing/Listing.module.scss';

function Home( props ) {
  // if (error) {
  //   return null;
  // }

  const topBanner = props.homepageData.data?.attributes.topBanner;
  const categories = props.categories.data;

  return (
    <div>
      {topBanner ? <HpBanner props={topBanner}/> : null}
      <div>

      </div>
      {categories ? 
        <div className="background-dark">
          <Categories props={categories}/> 
        </div>
      : null}
    </div>
  );
}

export async function getServerSideProps(context) {

  const homepageData = await getPageData(
    'homepage'
  );
  const categories = await getPageData(
    'categories'
  );

  return {
    props: { homepageData, categories },
  };
}

// export async function getServerSideProps(context) {
//   const headers = {
//     'Content-Type': 'application/json',
//   };
 
//   try {
//     const [mainPageRes, categoriesRes] = await Promise.all([
//       fetch('http://localhost:1337/api/homepage?populate=deep'),
//       fetch('http://localhost:1337/api/categories?populate=deep'),
//     ]);

//     const propsMainPage = await mainPageRes.json();
//     const propsCategories = await categoriesRes.json();
  
//     return {
//       props: { propsMainPage, propsCategories },
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