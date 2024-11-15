import { useEffect } from 'react';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import Banner from 'components/global/banner/Banner';
import Accordion from 'components/global/accordion/Accordion';

function FAQs(props) {
  const banner = props?.pageData?.banner;
  const faqs = props?.faqs;

  // Generate FAQ structured data
  const getFAQStructuredData = () => {
    if (!faqs) return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.attributes.title,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.attributes.text,
        },
      })),
    };

    return JSON.stringify(structuredData);
  };

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
      <Head>
        {faqs && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: getFAQStructuredData() }}
            key="faq-jsonld"
          />
        )}
      </Head>

      {banner ? <Banner props={banner} shape="white" /> : null}

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
