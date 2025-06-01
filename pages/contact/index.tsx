import styles from './Contact.module.scss';
import withLocaleRefetch from 'components/withLocaleRefetch';
import useAnimationObserver from 'hooks/useAnimationObserver';
import Head from 'next/head';
import { getPageData } from 'hooks/api';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Accordion from 'components/global/accordion/Accordion';
import Image from 'next/image';
import CustomMarkdown from 'components/CustomMarkdown';

import useLightbox from 'components/global/lightbox/useLightbox';
import NextJsImage from 'components/global/lightbox/NextJsImage';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

function Contact(props) {
  const { openLightbox, renderLightbox } = useLightbox();
  const { lang } = useLocale();
  const faqs = props?.pageData?.fa_qs;

  type CustomSlide = {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    unoptimized?: boolean;
    index?: number;
    selectedIndex?: number;
  };

  // Animations
  useAnimationObserver({
    dependencies: [props.pageData],
  });

  // FAQ structured data
  const getFAQStructuredData = () => {
    if (!faqs) return null;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.data.map((faq) => ({
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

      <div className={`${styles.contact}`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData.banner} shape="white" />
        ) : null}
        <div className={`${styles.contact_main} container_small`}>
          <div className={`${styles.contact_main_left}`}>
            <Form />
          </div>

          <div className={`${styles.contact_main_right}`}>
            <div className={`${styles.contact_main_right_boxes}`}>
              <div className={`${styles.contact_main_right_column}`}>
                <h2 className={`${styles.contact_main_right_title}`}>
                  {lang.salesInquiries}
                </h2>
                {props.pageData?.salesInfo ? (
                  <CustomMarkdown>{props.pageData.salesInfo}</CustomMarkdown>
                ) : null}
              </div>
              <div className={`${styles.contact_main_right_column}`}>
                <h2 className={`${styles.contact_main_right_title}`}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: lang.partsServiceWarranty,
                    }}
                  />
                </h2>
                {props.pageData?.partsInfo ? (
                  <CustomMarkdown>{props.pageData.partsInfo}</CustomMarkdown>
                ) : null}
              </div>
            </div>

            {props.pageData?.mapImage?.data && (
              <>
                <div className={styles.contact_map}>
                  <Image
                    src={props.pageData?.mapImage.data.attributes.url}
                    alt={'Alpine Armoring Location'}
                    fill
                    onClick={() => {
                      openLightbox();
                    }}
                  />
                </div>

                {renderLightbox({
                  slides: [
                    {
                      src: props.pageData?.mapImage.data.attributes.url,
                      width: 874,
                      height: 295,
                      alt: 'Alpine Armoring Location',
                      unoptimized: true,
                    },
                  ] as CustomSlide[],
                  plugins: [Zoom],
                  render: {
                    slide: NextJsImage,
                    buttonPrev: () => null,
                    buttonNext: () => null,
                  },
                })}
              </>
            )}
          </div>
        </div>

        {faqs?.data.length > 0 ? (
          <Accordion items={faqs.data} title={lang.footerFaqsTitle} button />
        ) : null}
      </div>
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.contact;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });
  pageData = pageData.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  return {
    props: { pageData, seoData, locale },
  };
}

export default withLocaleRefetch(
  Contact,
  {
    pageData: async (locale) => {
      const data = await getPageData({
        route: routes.contact.collection,
        populate: 'deep',
        locale,
      });
      return data.data?.attributes || null;
    },
  },
  {
    routeName: 'contact',
  }
);
