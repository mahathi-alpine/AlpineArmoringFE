import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import routes from 'routes';
import MediaList from '../MediaList';

function Videos(props) {
  const title = props?.pageData?.titleH1;
  const videos = props?.videos;

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

export default Videos;
