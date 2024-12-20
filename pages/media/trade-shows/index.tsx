import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import Banner from 'components/global/banner/Banner';
import MediaList from '../MediaList';

const TradeShows = (props) => {
  const banner = props?.pageData?.banner;
  const title = props?.pageData?.titleH1;
  const tradeShows = props?.tradeShows;

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

  return (
    <>
      {banner ? <Banner props={banner} shape="white" /> : null}

      {title ? <h1 className="c-title mt2">{title}</h1> : null}

      <MediaList props={tradeShows} itemType="tradeShow" />
    </>
  );
};

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'trade-shows-page',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  let tradeShows = await getPageData({
    route: 'trade-shows',
    populate: 'deep',
    sort: 'date',
    pageSize: 100,
  });
  tradeShows = tradeShows?.data || null;

  if (Array.isArray(tradeShows)) {
    tradeShows.reverse();
  }

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, tradeShows, seoData },
  };
}

export default TradeShows;
