import React from 'react';
import { useEffect } from 'react';
import { getPageData } from 'lib/api';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import IntroText from 'components/homepage/intro-text/IntroText';
import Categories from 'components/homepage/categories/Categories';
import TabSection from 'components/global/tab-section/TabSection';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';
import Partners from 'components/homepage/partners/Partners';
import VideosPopup from 'components/global/videos-popup/VideosPopup';

function Home({ homepageData, categories }) {

  const topBanner = homepageData.data?.attributes.topBanner;
  const categoriesData = categories?.data;
  const tabSectionData = homepageData.data?.attributes.tabSection;
  const horizontalSlider = homepageData?.data?.attributes.horizontalSlider;
  const allVehiclesImage =
    homepageData?.data?.attributes?.allVehiclesImage?.data.attributes;
  const partners = homepageData?.data?.attributes.industryPartners?.data;
  // console.log(homepageData)

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
      }
      // {
      //   root: null,
      //   rootMargin: '0px',
      //   threshold: 0.4,
      // }
    );

    targets.forEach((item) => observer.observe(item));

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {topBanner ? <HpBanner props={topBanner} /> : null}

      <div className="background-dark">
        <div className="shape-before"></div>

        <IntroText />

        {categoriesData && (
          <Categories props={categories} allVehiclesImage={allVehiclesImage} />
        )}

        {tabSectionData ? <TabSection props={tabSectionData} /> : null}

        <VideosPopup />

        {horizontalSlider ? (
          <StickyHorizontalSlider props={horizontalSlider} />
        ) : null}

        <div className="shape-after">
          <span></span>
        </div>
      </div>

      {partners ? <Partners props={partners} /> : null}
    </>
  );
}

export async function getServerSideProps() {
  const homepageData = await getPageData({ route: 'homepage' });
  const categories = await getPageData({ route: 'categories', order: true });

  return {
    props: { homepageData, categories },
  };
}

export default Home;
