import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import MediaList from '../MediaList';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

const TradeShows = (props) => {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const tradeShows = props?.tradeShows;
  // return null;

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
