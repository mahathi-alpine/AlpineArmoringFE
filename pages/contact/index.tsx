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
      console.log('Props:', props);
      console.log('========================');
    }
  }, [router.locale, router.asPath, props.pageData, pageData]);

  // Handle client-side locale changes
  useEffect(() => {
    const handleLocaleChange = async () => {
      const currentPath = router.asPath;
      if (
        !currentPath.includes('/contact') &&
        !currentPath.includes('/contacto')
      ) {
        return; // Only handle contact pages
      }

      // If we don't have pageData for current locale, fetch it
      if (!pageData && !loading) {
        console.log('Fetching data for locale:', router.locale);
        setLoading(true);

        try {
          const route = routes.contact;
          let newPageData = await getPageData({
            route: route.collection,
            populate: 'deep',
            locale: router.locale,
          });
          newPageData = newPageData?.data?.attributes || null;

          console.log('Fetched new pageData:', !!newPageData);
          setPageData(newPageData);
        } catch (error) {
          console.error('Error fetching page data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    handleLocaleChange();
  }, [router.locale, pageData, loading]);

  // Reset pageData when props change (for SSR navigation)
  useEffect(() => {
    if (props.pageData !== pageData) {
      console.log('Updating pageData from props');
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
          <p>Loading...</p>
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

// This is the key fix: Generate static paths for all locales
export async function getStaticPaths() {
  return {
    paths: [
      { params: {}, locale: 'en' },
      { params: {}, locale: 'es' },
    ],
    fallback: false, // or 'blocking' if you want to support more locales dynamically
  };
}

export async function getStaticProps({ locale = 'en' }) {
  console.log('=== getStaticProps called ===');
  console.log('Locale:', locale);

  const route = routes.contact;

  let pageData = await getPageData({
    route: route.collection,
    populate: 'deep',
    locale,
  });

  console.log('API response exists:', !!pageData);
  pageData = pageData?.data?.attributes || null;

  const seoData = {
    ...(pageData?.seo || {}),
    languageUrls: route.getIndexLanguageUrls(locale),
  };

  console.log('Returning props for locale:', locale);
  console.log('=========================');

  return {
    props: { pageData, seoData, locale },
    // Optional: Add revalidation for ISR
    revalidate: 3600, // Revalidate every hour
  };
}

export default Contact;
