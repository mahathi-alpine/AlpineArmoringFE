import styles from './Vehicle.module.scss';
import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Banner from 'components/vehicle-we-armor/Banner';
import ComparisonSlider from 'components/global/comparison-slider/ComparisonSlider';
import TabSlider from 'components/global/tab-slider/TabSlider';
import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import Specs from 'components/vehicle/specs/Specs';

function InventoryVehicle(props) {
  const data = props.data?.data[0]?.attributes;

  // console.log(data);
  // return null;

  const inventory = data?.stock.data;
  const beforeAfterSlider_Before =
    data?.beforeAfterSlider?.before.data?.attributes.url;
  const beforeAfterSlider_After =
    data?.beforeAfterSlider?.after.data?.attributes.url;

  const dimensions1 = data?.dimensions1?.data?.attributes.url;
  const dimensions2 = data?.dimensions2?.data?.attributes.url;

  const banner = {
    title: data?.title,
    featuredImage: data?.featuredImage,
    descriptionBanner: data?.descriptionBanner,
    slug: data?.slug,
    inventory: inventory,
  };

  const navItems = [
    {
      id: 1,
      titleNav: 'Overview',
    },
    {
      id: 2,
      titleNav: 'Dimensions',
    },
    // {
    //   id: 3,
    //   titleNav: 'Specifications'
    // },
    // {
    //   id: 4,
    //   titleNav: 'Gallery'
    // }
  ];

  const handleTabChange = (index, titleNav) => {
    const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');

    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Observer for fade animations
    const observerAnimationTargets = document.querySelectorAll('.observe');
    const observerAnimation = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observerAnimation.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );
    observerAnimationTargets.forEach((item) => observerAnimation.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      observerAnimationTargets.forEach((item) =>
        observerAnimation.unobserve(item)
      );
      observerAnimation.disconnect();
    };
  }, []);

  return (
    <div className={`${styles.slug}`}>
      <Banner props={banner} />

      <TabSlider
        props={navItems}
        onTabChange={handleTabChange}
        className={`${styles.slug_nav} slug_nav container`}
        sticky
      />

      <div
        id="overview"
        className={`${styles.slug_description} anchor container_small`}
      >
        <h2>Overview</h2>
        {data.description ? <Markdown>{data.description}</Markdown> : null}
      </div>

      {dimensions1 && dimensions2 ? (
        <div
          className={`${styles.slug_dimensions} container anchor`}
          id="dimensions"
        >
          <Image
            src={`${dimensions1}`}
            alt="Alpine Armoring"
            width={549}
            height={431}
          />
          <Image
            src={`${dimensions2}`}
            alt="Alpine Armoring"
            width={1101}
            height={431}
          />
        </div>
      ) : null}

      {beforeAfterSlider_Before && beforeAfterSlider_After ? (
        <div className={`container anchor`} id="dimensions">
          <ComparisonSlider
            beforeImage={beforeAfterSlider_Before}
            afterImage={beforeAfterSlider_After}
          />
        </div>
      ) : null}

      <Specs
        id="specifications"
        className={`anchor`}
        specs={data.specificationsAll.data}
      />
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
