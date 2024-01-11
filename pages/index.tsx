import React from 'react';
import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import { getCookie } from 'cookies-next';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import IntroText from 'components/homepage/intro-text/IntroText';
import Categories from 'components/homepage/categories/Categories';
import HPMiddleText from 'components/homepage/hp-middle-text/HPMiddleText';
import TabSection from 'components/global/tab-section/TabSection';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';
import Partners from 'components/homepage/partners/Partners';
import VideosPopup from 'components/global/videos-popup/VideosPopup';

function Home({ homepageData, categories, languageCookie }) {
  const topBanner = homepageData.data?.attributes.topBanner;
  const categoriesData = categories?.data;
  const hpMiddleText = homepageData.data?.attributes.hpMiddleText;
  const tabSectionData = homepageData.data?.attributes.tabSection;
  const horizontalSlider = homepageData?.data?.attributes.horizontalSlider;
  const allVehiclesImage =
    homepageData?.data?.attributes?.allVehiclesImage?.data?.attributes;
  const ballistingTestings =
    homepageData?.data?.attributes.ballistingTestingsMedia;
  const partners = homepageData?.data?.attributes.industryPartners?.data;
  // console.log(homepageData)

  useEffect(() => {
    document.body.classList.add('home');
    return () => {
      document.body.classList.remove('home');
    };
  }, []);

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
        threshold: 0.3,
      }
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
      {topBanner ? (
        <HpBanner props={topBanner} languageCookie={languageCookie} />
      ) : null}

      <div className="background-dark">
        <IntroText />

        {categoriesData && (
          <Categories
            props={categoriesData}
            allVehiclesImage={allVehiclesImage}
          />
        )}

        {hpMiddleText ? <HPMiddleText props={hpMiddleText} /> : null}

        {tabSectionData ? <TabSection props={tabSectionData} /> : null}

        {ballistingTestings ? <VideosPopup props={ballistingTestings} /> : null}

        <div className="shape-after shape-after-white"></div>
      </div>

      {horizontalSlider ? (
        <StickyHorizontalSlider props={horizontalSlider} />
      ) : null}

      {partners ? <Partners props={partners} /> : null}
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const homepageData = await getPageData({
    route: 'homepage',
  });

  const categories = await getPageData({
    route: 'categories',
    order: true,
    populate: 'deep',
  });

  let languageCookie = getCookie('googtrans', { req, res });
  languageCookie = languageCookie ? languageCookie.split('/').pop() : 'en';

  return {
    props: { homepageData, categories, languageCookie },
  };
}

export default Home;
