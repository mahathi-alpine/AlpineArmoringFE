import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
import routes from 'routes';
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

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.tradeShows;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let tradeShows = await getPageData({
    route: route.collectionSingle,
    populate: 'deep',
    sort: 'date',
    pageSize: 100,
    locale,
  });
  tradeShows = tradeShows?.data || null;

  if (Array.isArray(tradeShows)) {
    tradeShows.reverse();
  }

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, tradeShows, seoData, locale },
  };
}

export default TradeShows;
