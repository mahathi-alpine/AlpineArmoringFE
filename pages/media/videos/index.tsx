import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import MediaList from '../MediaList';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Videos(props) {
  const banner = props?.pageData?.banner;
  const videos = props?.videos;

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
      {banner ? <Banner props={banner} center shape="white" /> : null}

      <MediaList props={videos} itemType="video" />
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'video-page',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  let videos = await getPageData({
    route: 'videos',
    sort: 'order',
    populate: 'deep',
  });
  videos = videos.data || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, videos, seoData },
  };
}

export default Videos;
