import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import MediaList from '../MediaList';

function Videos(props) {
  const title = props?.pageData?.titleH1;
  const videos = props?.videos;

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  return (
    <>
      {title ? <h1 className="c-title mt2">{title}</h1> : null}

      <MediaList props={videos} itemType="video" />
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.videos;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let videos = await getPageData({
    route: route.collectionSingle,
    sort: 'order',
    pageSize: 1000,
    populate: 'deep',
    locale,
  });
  videos = videos?.data || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, videos, seoData, locale },
  };
}

export default withLocaleRefetch(Videos, async (locale) => {
  const data = await getPageData({
    route: routes.videos.collection,
    populate: 'deep',
    locale,
  });
  return data.data?.attributes || null;
});
