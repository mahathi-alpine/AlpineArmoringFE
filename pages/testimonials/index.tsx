import { getPageData } from 'lib/api';
import { useEffect } from 'react';
import Seo from 'components/Seo';
import Banner from 'components/global/banner/Banner';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

const Testimonials = (props) => {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;

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
    </>
  );
};

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'testimonials-page',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default Testimonials;
