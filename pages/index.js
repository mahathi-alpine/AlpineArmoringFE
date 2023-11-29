import HpBanner from '../components/homepage/HpBanner';
import Categories from '../components/homepage/Categories';
import { getPageData } from '../lib/api';
import styles from '/components/listing/Listing.module.scss';
import { useEffect } from 'react';
import useIntersectionObserver from '/intersectionObserver';

function Home( props ) {
  // if (error) {
  //   return null;
  // }
  // console.log(props)
  const topBanner = props.homepageData?.data.attributes.topBanner;
  const categories = props.categories.data;

  const observer = useIntersectionObserver();

  useEffect(() => {
    const targets = document.querySelectorAll('.animate');
    targets.forEach((target) => {
      observer.current.observe(target);
    });
  }, []);

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
  const homepageData = await getPageData('homepage');
  const categories = await getPageData('categories');

  return {
    props: { categories, homepageData },
    props: { homepageData, categories },
  };
}

export default Home;