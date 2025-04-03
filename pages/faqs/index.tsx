import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import { getPageData } from 'hooks/api';
import Head from 'next/head';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import Accordion from 'components/global/accordion/Accordion';

function FAQs(props) {
  const banner = props?.pageData?.banner;
  const faqs = props?.faqs;

  // FAQ structured data
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
  useAnimationObserver({
    dependencies: [props.pageData],
  });

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

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.faqs;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData?.data?.attributes || null;

  let faqs = await getPageData({
    route: route.collectionSingle,
    populate: 'deep',
    sort: 'order',
    locale,
  });
  faqs = faqs?.data || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, faqs, seoData, locale },
  };
}

export default withLocaleRefetch(
  FAQs,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.faqs.collection,
        populate: 'deep',
        locale,
      });
      return data.data?.attributes || null;
    },
    faqs: async (locale) => {
      const data = await getPageData({
        route: routes.faqs.collectionSingle,
        populate: 'deep',
        sort: 'order',
        locale,
      });
      return data?.data || null;
    },
  },
  {
    includeSeo: true,
    routeName: 'faqs',
    debug: process.env.NODE_ENV === 'development',
  }
);
