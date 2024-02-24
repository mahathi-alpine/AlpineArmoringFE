import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import MediaList from '../MediaList';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function Videos(props) {
  const seoData = props?.pageData?.seo;
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
      <Seo props={seoData} />

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

  return {
    props: { pageData, videos },
  };
}

export default Videos;
