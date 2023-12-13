import React from 'react';
import { useEffect } from 'react';
import { getPageData } from 'lib/api';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import Categories from 'components/homepage/categories/Categories';
import TabSection from 'components/global/tab-section/TabSection';
import StickyHorizontalSlider from 'components/global/sticky-horizontal-slider/StickyHorizontalSlider';
import VideoScale, {
  animateVideo,
} from 'components/global/video-scale/VideoScale';
import TextTransform, {
  textTransformAnimate,
} from 'components/global/text-transform/TextTransform';
import IntroText from 'components/homepage/intro-text/IntroText';

function Home({ homepageData, categories }) {
  const topBanner = homepageData.data?.attributes.topBanner;
  const categoriesData = categories?.data;
  const tabSectionData = homepageData.data?.attributes.tabSection;
  const horizontalSlider = homepageData?.data?.attributes.horizontalSlider;
  // console.log(tabSectionData)

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Fade-ins
            // if (entry.target.classList.contains('animate')) {
            //   entry.target.classList.toggle('in-view', entry.isIntersecting);
            //   observer.unobserve(entry.target);
            // }
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);

            // VideoScale
            if (entry.target.classList.contains('videoScaleContainer')) {
              window.addEventListener(
                'scroll',
                () => animateVideo(entry.target),
                { passive: true }
              );
            }

            // TextTransform
            if (entry.target.classList.contains('textTransform')) {
              window.addEventListener(
                'scroll',
                () => textTransformAnimate(entry.target),
                { passive: true }
              );
            }
          } else {
            if (entry.target.classList.contains('videoScaleContainer')) {
              window.removeEventListener('scroll', () =>
                animateVideo(entry.target)
              );
            }

            if (entry.target.classList.contains('textTransform')) {
              window.removeEventListener('scroll', () =>
                textTransformAnimate(entry.target)
              );
            }
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.4,
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
    <div>
      {topBanner ? <HpBanner props={topBanner} /> : null}  

      <div className="background-dark">
        {tabSectionData ? <TabSection props={tabSectionData} /> : null} 
        {horizontalSlider ? <StickyHorizontalSlider props={horizontalSlider} />  : null} 
      </div>

      <IntroText />

      <VideoScale props="hpVideo.mp4" />

      <TextTransform
        text1="Alpine Armoring"
        text2="Triple Certification Process"
      />

      {categoriesData && (
        <div className="background-dark">
          <Categories props={categories} />
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  const homepageData = await getPageData({ route: 'homepage' });
  const categories = await getPageData({ route: 'categories' });

  return {
    props: { homepageData, categories },
  };
}

export default Home;
