import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import MediaList from '../MediaList';

const TradeShows = (props) => {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const tradeShows = props?.tradeShows;
  // return null;

  // Animations
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

      {banner ? <Banner props={banner} center shape="white" /> : null}

      <MediaList props={tradeShows} itemType="tradeShow" />
    </>
  );
};

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'trade-shows-page',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  let tradeShows = await getPageData({
    route: 'trade-shows',
    populate: 'deep',
  });
  tradeShows = tradeShows.data || null;

  return {
    props: { pageData, tradeShows },
  };
}

export default TradeShows;
