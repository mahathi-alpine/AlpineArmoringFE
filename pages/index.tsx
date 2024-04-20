import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import dynamic from 'next/dynamic';
// import { getCookie } from 'cookies-next';
import Seo from 'components/Seo';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

import HpBanner from 'components/homepage/hp-banner/HpBanner';
import FillingText from 'components/global/filling-text/FillingText';
import Categories from 'components/homepage/categories/Categories';
import TabSection from 'components/homepage/tab-section/TabSection';
import News from 'components/global/news/News';
import Partners from 'components/homepage/partners/Partners';
const VideosPopup = dynamic(
  () => import('components/global/videos-popup/VideosPopup')
);

// function Home({ homepageData, categories, languageCookie }) {
function Home({ homepageData, categories }) {
  console.log(homepageData);
  const data = homepageData.data?.attributes;

  const seoData = data?.seo;
  const topBanner = {
    title: data?.topBannerTitle,
    description: data?.topBannerDescription,
  };
  const quote = data?.quote;
  const categoriesData = categories?.data;
  const hpMiddleText = data?.hpMiddleText;
  const tabSectionData = data?.tabSection;
  const allVehiclesImage = data?.allVehiclesImage?.data?.attributes;
  const ballistingTestings = data?.ballistingTestingsMedia;
  const news = data?.blogs?.data;
  const partners = data?.industryPartners?.data;

  // Animations
  const observerRef = useIntersectionObserver();
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');
    targets.forEach((item) => observerRef.current.observe(item));

    return () => {
      targets.forEach((item) => observerRef.current.unobserve(item));
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

        {ballistingTestings && !data?.disableCoolVideos ? (
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
  });

  const categories = await getPageData({
    route: 'categories',
    sort: 'order',
    populate: 'image, inventory_vehicles',
    fields: 'fields[0]=slug&fields[1]=title&fields[2]=order',
    custom:
      'populate[inventory_vehicles][fields]=title&populate=image&sort=order:asc&fields[0]=slug&fields[1]=title&fields[2]=order',
  });

  // let languageCookie = getCookie('googtrans', { req, res });
  // languageCookie = languageCookie ? languageCookie.split('/').pop() : 'en';

  return {
    // props: { homepageData, categories, languageCookie },
    props: { homepageData, categories },
    // revalidate: 86400,
  };
}

export default Home;
