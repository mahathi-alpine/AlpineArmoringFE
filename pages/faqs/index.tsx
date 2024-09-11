import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import Banner from 'components/global/banner/Banner';
import Accordion from 'components/global/accordion/Accordion';
import styles from './Faq.module.scss';

function FAQs(props) {
  const banner = props?.pageData?.banner;
  const faqs = props?.faqs;

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
      {banner ? <Banner props={banner} center shape="white" /> : null}

      {banner?.title ? (
        <h1
          className={`${styles.title}`}
          dangerouslySetInnerHTML={{ __html: banner.title }}
        ></h1>
      ) : null}

      {faqs ? <Accordion items={faqs} /> : null}
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'faq',
    populate: 'deep',
  });
  pageData = pageData?.data?.attributes || null;

  let faqs = await getPageData({
    route: 'fa-qs',
    populate: 'deep',
    sort: 'order',
  });
  faqs = faqs?.data || null;

  const seoData = pageData?.seo ?? null;

  return {
    props: { pageData, faqs, seoData },
  };
}

export default FAQs;
