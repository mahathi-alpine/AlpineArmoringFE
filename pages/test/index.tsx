import { useEffect } from 'react';
import { getPageData } from 'hooks/api';

import HpBanner from 'components/homepage/hp-banner/HpBanner2';

// function Home({ homepageData, categories, languageCookie }) {
function Home({ homepageData }) {
  const data = homepageData.data?.attributes;

  const topBanner = {
    title: data?.topBannerTitle,
    description: data?.topBannerDescription,
    video: data?.bannerVideo,
  };

  // Animations
  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
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

    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return <>{topBanner ? <HpBanner props={topBanner} /> : null}</>;
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

  const seoData = homepageData.data?.attributes.seo || null;

  // let languageCookie = getCookie('googtrans', { req, res });
  // languageCookie = languageCookie ? languageCookie.split('/').pop() : 'en';

  return {
    // props: { homepageData, categories, languageCookie },
    props: { homepageData, categories, seoData },
    // revalidate: 86400,
  };
}

export default Home;
