// import React from 'react';
import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import dynamic from 'next/dynamic';
// import { getCookie } from 'cookies-next';

import HpBanner from 'components/homepage/hp-banner/HpBanner';

const FillingText = dynamic(
  () => import('components/global/filling-text/FillingText')
);
const Categories = dynamic(
  () => import('components/homepage/categories/Categories')
);
const TabSection = dynamic(
  () => import('components/homepage/tab-section/TabSection')
);
const Blog = dynamic(() => import('components/homepage/blog/Blog'));
const Partners = dynamic(() => import('components/homepage/partners/Partners'));
const VideosPopup = dynamic(
  () => import('components/global/videos-popup/VideosPopup')
);

// function Home({ homepageData, categories, languageCookie }) {
function Home({ homepageData, categories }) {
  const data = homepageData.data?.attributes;

  const topBanner = data?.topBanner;
  const hpIntroTextSubtitle = data?.hpIntroTextSubtitle;
  const hpIntroText = data?.hpIntroText;
  const categoriesData = categories?.data;
  const hpMiddleText = data?.hpMiddleText;
  const tabSectionData = data?.tabSection;
  const allVehiclesImage = data?.allVehiclesImage?.data?.attributes;
  const ballistingTestings = data?.ballistingTestingsMedia;
  const blog = data?.blogs?.data;
  const partners = data?.industryPartners?.data;
  // console.log(data)

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

  return (
    <>
      {topBanner ? (
        // <HpBanner props={topBanner} languageCookie={languageCookie} />
        <HpBanner props={topBanner} />
      ) : null}

      <div className="background-dark">
        <FillingText text={hpIntroText} subtitle={hpIntroTextSubtitle} />

        {categoriesData && (
          <Categories
            props={categoriesData}
            allVehiclesImage={allVehiclesImage}
          />
        )}

        {hpMiddleText ? <FillingText text={hpMiddleText} /> : null}

        {tabSectionData ? <TabSection props={tabSectionData} /> : null}

        {ballistingTestings ? <VideosPopup props={ballistingTestings} /> : null}

        <div className="shape-after shape-after-white"></div>
      </div>

      {blog ? <Blog props={blog} /> : null}

      {partners ? <Partners props={partners} /> : null}
    </>
  );
}

// export async function getServerSideProps({ req, res }) {
export async function getServerSideProps() {
  const homepageData = await getPageData({
    route: 'homepage',
  });

  const categories = await getPageData({
    route: 'categories',
    order: true,
    populate: 'image, inventories',
  });

  // let languageCookie = getCookie('googtrans', { req, res });
  // languageCookie = languageCookie ? languageCookie.split('/').pop() : 'en';

  return {
    // props: { homepageData, categories, languageCookie },
    props: { homepageData, categories },
  };
}

export default Home;
