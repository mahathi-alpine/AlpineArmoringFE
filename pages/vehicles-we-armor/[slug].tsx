import styles from './Vehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Banner from 'components/vehicle-we-armor/Banner';
import ComparisonSlider from 'components/global/comparison-slider/ComparisonSlider';
// import Specs from 'components/vehicle/specs/Specs';

function InventoryVehicle(props) {
  const data = props.data.data[0]?.attributes;

  const inventory = data.stock.data;
  const beforeAfterSlider_Before =
    data.beforeAfterSlider?.before.data?.attributes.url;
  const beforeAfterSlider_After =
    data.beforeAfterSlider?.after.data?.attributes.url;

  const banner = {
    title: data.title,
    featuredImage: data.featuredImage,
    descriptionBanner: data.descriptionBanner,
    slug: data.slug,
    inventory: inventory,
  };

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    targets.forEach((item) => observer.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  // console.log(data);
  // return null;

  return (
    <div className={`${styles.slug}`}>
      <Banner props={banner} />

      {/* <Specs specs={data.specificationsAll.data} equipment{data.specificationsAll.data}/>       */}

      <div className={`container`}>
        {beforeAfterSlider_Before && beforeAfterSlider_After ? (
          <ComparisonSlider
            beforeImage={beforeAfterSlider_Before}
            afterImage={beforeAfterSlider_After}
          />
        ) : null}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const data = await getPageData({
    route: 'vehicles-we-armors',
    populate: 'deep',
    params: `filters[slug][$eq]=${context.params.slug}`,
  });

  return {
    props: { data },
  };
}

export default InventoryVehicle;
