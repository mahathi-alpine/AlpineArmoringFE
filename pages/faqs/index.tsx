import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Accordion from 'components/global/accordion/Accordion';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

function FAQs(props) {
  const banner = props?.pageData?.banner;
  const faqs = props?.faqs;

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

      {faqs ? <Accordion items={faqs} /> : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'faq',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  let faqs = await getPageData({
    route: 'fa-qs',
    populate: 'deep',
  });
  faqs = faqs.data || null;

  const seoData = pageData.seo;

  return {
    props: { pageData, faqs, seoData },
  };
}

export default FAQs;
