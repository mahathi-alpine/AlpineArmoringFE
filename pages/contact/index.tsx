import styles from './Contact.module.scss';
import useAnimationObserver from 'hooks/useAnimationObserver';
import Head from 'next/head';
import { getPageData } from 'hooks/api';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Banner from 'components/global/banner/Banner';
import Form from 'components/global/form/Form';
import Accordion from 'components/global/accordion/Accordion';
import Image from 'next/image';
import CustomMarkdown from 'components/CustomMarkdown';
import useLightbox from 'components/global/lightbox/useLightbox';
import NextJsImage from 'components/global/lightbox/NextJsImage';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

function Contact(props) {
  const { lang } = useLocale();
  const router = useRouter();
  const [pageData, setPageData] = useState(props.pageData);
  const [loading, setLoading] = useState(false);

  // Debug logging for contact pages only
  useEffect(() => {
    const currentPath = router.asPath;
    if (currentPath.includes('/contact') || currentPath.includes('/contacto')) {
      console.log('=== CONTACT PAGE DEBUG ===');
      console.log('Current locale:', router.locale);
      console.log('Current path:', currentPath);
      console.log('Props pageData exists:', !!props.pageData);
      console.log('State pageData exists:', !!pageData);
      console.log('Props locale:', props.locale);
      console.log('Router locale:', router.locale);
      console.log('========================');
    }
  }, [router.locale, router.asPath, props.pageData, pageData, props.locale]);

  // Handle client-side locale changes - fetch data if needed
  useEffect(() => {
    const currentPath = router.asPath;
    if (
      !currentPath.includes('/contact') &&
      !currentPath.includes('/contacto')
    ) {
      return; // Only handle contact pages
    }

    // If props don't match current locale or we don't have data, fetch it
    const needsFetch =
      !pageData || (props.locale && props.locale !== router.locale);

    if (needsFetch && !loading) {
      console.log('=== FETCHING DATA CLIENT-SIDE ===');
      console.log(
        'Reason - Props locale:',
        props.locale,
        'Router locale:',
        router.locale
      );
      console.log('Has pageData:', !!pageData);
      console.log('===============================');

      setLoading(true);

      const fetchData = async () => {
        try {
          const route = routes.contact;
          let newPageData = await getPageData({
            route: route.collection,
            populate: 'deep',
            locale: router.locale,
          });
          newPageData = newPageData?.data?.attributes || null;

          console.log('=== CLIENT FETCH RESULT ===');
          console.log('Fetched new pageData:', !!newPageData);
          console.log('For locale:', router.locale);
          console.log('===========================');

          setPageData(newPageData);
        } catch (error) {
          console.error('Error fetching page data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [router.locale, pageData, loading, props.locale]);

  // Reset pageData when props change (for SSR navigation)
  useEffect(() => {
    if (props.pageData && props.pageData !== pageData) {
      console.log('=== UPDATING FROM PROPS ===');
      console.log('Props changed, updating pageData');
      console.log('==========================');
      setPageData(props.pageData);
    }
  }, [props.pageData]);

  const banner = pageData?.banner;
  const salesInfo = pageData?.salesInfo;
  const partsInfo = pageData?.partsInfo;
  const mapImage = pageData?.mapImage;
  const faqs = pageData?.fa_qs;

  const { openLightbox, renderLightbox } = useLightbox();

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
    dependencies: [pageData],
  });

  const getOrganizationStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      image:
        'https://www.alpineco.com/_next/image?url=https%3A%2F%2Fd102sycao8uwt8.cloudfront.net%2Fmedium_About_us_hompage_thumbnail_1_ea1c33f592.JPG&w=640&q=75',
      url: 'https://www.alpineco.com',
      logo: 'https://www.alpineco.com/assets/Alpine-Armoring-Armored-Vehicles.png',
      name: 'Alpine Armoring',
      description:
        'An internationally recognized leader of high-quality, custom-manufactured armored vehicles, headquartered in Virginia, USA',
      email: 'sales@alpineco.com',
      telephone: '+1 703 471 0002',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4170 Lafayette Center Drive #100',
        addressLocality: 'Chantilly',
        addressCountry: 'US',
        addressRegion: 'Virginia',
        postalCode: '20151',
      },
    };

    return JSON.stringify(structuredData);
  };

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

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className={`${styles.contact}`}>
        <div className="container_small">
          <p>Loading contact information...</p>
        </div>
      </div>
    );
  }

  // Show fallback if no data
  if (!pageData) {
    return (
      <div className={`${styles.contact}`}>
        <div className="container_small">
          <p>Unable to load contact information. Please refresh the page.</p>
        </div>
      </div>
    );
  }

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getOrganizationStructuredData() }}
          key="organization-jsonld"
        />
      </Head>

      <div className={`${styles.contact}`}>
        {banner ? <Banner props={banner} shape="white" /> : null}
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
                {salesInfo ? (
                  <CustomMarkdown>{salesInfo}</CustomMarkdown>
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
                {partsInfo ? (
                  <CustomMarkdown>{partsInfo}</CustomMarkdown>
                ) : null}
              </div>
            </div>

            {mapImage?.data && (
              <>
                <div className={styles.contact_map}>
                  <Image
                    src={mapImage.data.attributes.url}
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
                      src: mapImage.data.attributes.url,
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

// IMPORTANT: This will be called for BOTH locales during build
export async function getStaticProps(context) {
  const { locale = 'en' } = context;

  console.log('=== getStaticProps called ===');
  console.log('Locale from context:', locale);
  console.log('Building contact page for locale:', locale);
  console.log('Context keys:', Object.keys(context));

  const route = routes.contact;

  let pageData;
  try {
    pageData = await getPageData({
      route: route.collection,
      populate: 'deep',
      locale,
    });

    console.log('Raw API response exists:', !!pageData);

    // Extract the actual page data
    pageData = pageData?.data?.attributes || null;

    console.log('Processed pageData exists for', locale, ':', !!pageData);
  } catch (error) {
    console.error('Error in getStaticProps for', locale, ':', error);
    pageData = null;
  }

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  console.log('Returning props for locale:', locale);
  console.log('=== End getStaticProps ===');

  // Always return valid props, even if pageData is null
  return {
    props: {
      pageData: pageData || null,
      seoData: seoData || {},
      locale: locale,
    },
    // Add revalidation to enable ISR
    revalidate: 3600, // Revalidate every hour
  };
}

export default Contact;
