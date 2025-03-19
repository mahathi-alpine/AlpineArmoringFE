import { getPageData } from 'hooks/api';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import MediaList from '../MediaList';

const TradeShows = (props) => {
  const banner = props?.pageData?.banner;
  const title = props?.pageData?.titleH1;
  const tradeShows = props?.tradeShows;

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

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

export default withLocaleRefetch(TradeShows, async (locale) => {
  const data = await getPageData({
    route: routes.tradeShows.collection,
    populate: 'deep',
    locale,
  });
  return data.data?.attributes || null;
});
