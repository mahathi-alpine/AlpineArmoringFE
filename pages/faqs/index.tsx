import { useEffect } from 'react';
import { getPageData } from 'lib/api';
import Banner from 'components/global/banner/Banner';
import Seo from 'components/Seo';
import Accordion from 'components/global/accordion/Accordion';

function FAQs(props) {
  const seoData = props?.pageData?.seo;
  const banner = props?.pageData?.banner;
  const faqs = props?.pageData?.fa_qs;

  useEffect(() => {
    const targets = document.querySelectorAll('.observe');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
            observer.unobserve(entry.target);
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

    // Clean up the observer when the component unmounts
    return () => {
      targets.forEach((item) => observer.unobserve(item));
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Seo props={seoData} />

      {banner ? <Banner props={banner} center shape="white" /> : null}

      <Accordion items={faqs.data} />
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'faq',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  return {
    props: { pageData },
  };
}

export default FAQs;
