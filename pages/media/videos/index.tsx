import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import Banner from 'components/global/banner/Banner';
import MediaList from '../MediaList';

function Videos(props) {
  const banner = props?.pageData?.banner;
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
      {banner ? <Banner props={banner} shape="white" /> : null}

      {title ? <h1 className="c-title mt2">{title}</h1> : null}

      <MediaList props={videos} itemType="video" />
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'video-page',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  let videos = await getPageData({
    route: 'videos',
    sort: 'order',
    pageSize: 1000,
    populate: 'deep',
  });
  videos = videos?.data || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, videos, seoData },
  };
}

export default Videos;
