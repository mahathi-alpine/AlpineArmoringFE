// import React from 'react';
import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import dynamic from 'next/dynamic';
// import { getCookie } from 'cookies-next';
import Seo from 'components/Seo';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import FillingText from 'components/global/filling-text/FillingText';
import Categories from 'components/homepage/categories/Categories';
import TabSection from 'components/homepage/tab-section/TabSection';
import News from 'components/global/news/News';
import Partners from 'components/homepage/partners/Partners';
const VideosPopup = dynamic(
  () => import('components/global/videos-popup/VideosPopup')
);
// {
//   isModalOpen && (
//     <CodeSampleModal
//       isOpen={isModalOpen}
//       closeModal={() => setIsModalOpen(false)}
//     />
//   );
// }

// function Home({ homepageData, categories, languageCookie }) {
function Home({ homepageData, categories }) {
  const data = homepageData.data?.attributes;

  const seoData = data?.seo;
  const topBanner = data?.topBanner;
  const quote = data?.quote;
  const categoriesData = categories?.data;
  const hpMiddleText = data?.hpMiddleText;
  const tabSectionData = data?.tabSection;
  const allVehiclesImage = data?.allVehiclesImage?.data?.attributes;
  const ballistingTestings = data?.ballistingTestingsMedia;
  const news = data?.blogs?.data;
  const partners = data?.industryPartners?.data;

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
      <Seo props={seoData} />

      {topBanner ? (
        // <HpBanner props={topBanner} languageCookie={languageCookie} />
        <HpBanner props={topBanner} />
      ) : null}

      <div className="background-dark">
        {quote ? <FillingText className="padding" data={quote} /> : null}

        {categoriesData && (
          <Categories
            props={categoriesData}
            allVehiclesImage={allVehiclesImage}
          />
        )}

        {hpMiddleText ? (
          <FillingText className="padding" data={hpMiddleText} />
        ) : null}

        {tabSectionData ? <TabSection props={tabSectionData} /> : null}

        {ballistingTestings ? (
          <div className={`observe fade-in-up`}>
            <VideosPopup props={ballistingTestings} />
          </div>
        ) : null}

        <div className="shape-after shape-after-white"></div>
      </div>

      {news ? (
        <News
          props={news}
          button
          limit="3"
          subtitle="News"
          title="Armoring World"
        />
      ) : null}

      {partners ? <Partners props={partners} /> : null}
    </>
  );
}

// export async function getServerSideProps({ req, res }) {
export async function getStaticProps() {
  const homepageData = await getPageData({
    route: 'homepage',
    populate: 'deep',
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
