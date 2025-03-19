import { useRouter } from 'next/router';
import styles from './Contact.module.scss';
import withLocaleRefetch from 'components/withLocaleRefetch';
import Head from 'next/head';
import { getPageData } from 'hooks/api';
import { useEffect } from 'react';
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

  const router = useRouter();
  const isDefaultLanguage = router.locale === 'en';

  type CustomSlide = {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    unoptimized?: boolean;
    index?: number;
    selectedIndex?: number;
  };

  const { lang } = useLocale();

  const faqs = props?.pageData?.fa_qs;

  // Animations
  useEffect(() => {
    if (isDefaultLanguage) {
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
    } else {
      const animationTimeout = setTimeout(() => {
        const targets = document.querySelectorAll('.observe');

        targets.forEach((item) => {
          item.classList.remove('in-view');
        });

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
      }, 100);

      return () => {
        clearTimeout(animationTimeout);
      };
    }
  }, [props.pageData, router.locale, isDefaultLanguage]);

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
                <h3 className={`${styles.contact_main_right_title}`}>
                  {lang.salesInquiries}
                </h3>
                {props.pageData?.salesInfo ? (
                  <CustomMarkdown>{props.pageData.salesInfo}</CustomMarkdown>
                ) : null}
              </div>
              <div className={`${styles.contact_main_right_column}`}>
                <h3 className={`${styles.contact_main_right_title}`}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: lang.partsServiceWarranty,
                    }}
                  />
                </h3>
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

export default withLocaleRefetch(Contact, async (locale) => {
  const data = await getPageData({
    route: routes.contact.collection,
    populate: 'deep',
    locale,
  });
  return data.data?.attributes || null;
});
