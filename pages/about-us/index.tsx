import { useState } from 'react';
import Head from 'next/head';
import { getPageData } from 'hooks/api';
import useAnimationObserver from 'hooks/useAnimationObserver';
import useLocale from 'hooks/useLocale';
import routes from 'routes';
import styles from './About.module.scss';

import Banner from 'components/global/banner/Banner';
import Content from 'components/global/content/Content';
import CustomMarkdown from 'components/CustomMarkdown';
import Autoplay from 'components/global/carousel/Autoplay';
import Gallery from 'components/global/carousel/CarouselCurved';
import Counter from 'components/global/counter/Counter';
import 'yet-another-react-lightbox/styles.css';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

import ClientOnly from 'components/ClientOnly';
const GlobeComponent = dynamic(() => import('components/global/globe/Globe'), {
  ssr: false,
});

function About(props) {
  const { lang } = useLocale();

  const pageData = props.pageData;

  const banner = pageData?.banner;
  const topText = {
    dynamicZone: pageData?.dynamicZone || [],
  };
  const timeline = pageData?.timeline1;
  const boxes = pageData?.boxes;
  const certificate1 = pageData?.certificate1?.data?.attributes;
  const certificate2 = pageData?.certificate2?.data?.attributes;
  const quote = pageData?.quote;

  // Animations
  useAnimationObserver({
    dependencies: [pageData],
  });

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  const getAboutPageStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Alpine Armoring',
      url: process.env.NEXT_PUBLIC_URL,
      logo: `${process.env.NEXT_PUBLIC_URL}/assets/Alpine-Armoring-Armored-Vehicles.png`,
      description:
        'An internationally recognized leader of high-quality, custom-manufactured armored vehicles, headquartered in Virginia, USA',
      foundingDate: '1993',
      industry: 'Armored Vehicle Manufacturing',
      numberOfEmployees: '50-200',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4170 Lafayette Center Drive #100',
        addressLocality: 'Chantilly',
        addressCountry: 'US',
        addressRegion: 'Virginia',
        postalCode: '20151',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1 703 471 0002',
        email: 'sales@alpineco.com',
        contactType: 'customer service',
      },
      sameAs: [
        'https://www.instagram.com/alpinearmoring/',
        'https://x.com/AlpineArmoring',
        'https://www.facebook.com/AlpineArmoring/',
        'https://www.linkedin.com/company/alpinearmoring/',
        'https://www.youtube.com/c/AlpineArmoring',
        'https://www.tiktok.com/@alpinearmoring',
        'https://www.threads.com/@alpinearmoring/',
      ],
      areaServed: 'Worldwide',
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: '38.90491917326487',
          longitude: '-77.4702548649953',
        },
        geoRadius: 'global',
      },
    };

    return JSON.stringify(structuredData);
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: getAboutPageStructuredData() }}
          key="organization-jsonld"
        />
      </Head>

      <div className={`${styles.about}`}>
        {banner ? <Banner props={banner} shape="white" /> : null}

        <div className={`${styles.about_text} static container_small`}>
          <Content data={topText} />
        </div>

        {timeline?.filter((item) => item.image?.data?.length > 0).length > 0 ? (
          <div className={`${styles.timeline_gallery}`}>
            <Autoplay
              slides={timeline
                .filter((item) => item.image?.data?.length > 0)
                .map((item) => ({
                  image: item.image?.data[0],
                  year: item.year,
                  caption: item.Caption,
                  allImages: item.image?.data,
                }))}
              regular
              autoplay
            />
          </div>
        ) : null}

        <div className={styles.counter_grid}>
          <div className={styles.counter_box}>
            <h3>{lang.countriesWeServiced}</h3>
            <Counter value={88} />
          </div>
          <div className={styles.counter_box}>
            <h3>{lang.yearsInBusiness}</h3>
            <Counter value={31} />
          </div>
          <div className={styles.counter_box}>
            <h3>{lang.makesAndModelsWeHaveArmored}</h3>
            <Counter value={276} />
          </div>
        </div>

        <div className={`${styles.about_box_wrap}`}>
          {boxes?.map((item, index) => (
            <div
              className={`${styles.about_box_item} background-dark observe fade-in`}
              key={index}
            >
              <div
                className={`${styles.about_box_item_shape} shape-before`}
              ></div>

              <div className={`${styles.about_box_item_content}`}>
                {item.title ? (
                  <h2
                    className={`${styles.about_box_item_title}`}
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h2>
                ) : null}

                {item.description ? (
                  <div className={`${styles.about_box_item_text}`}>
                    <CustomMarkdown>{item.description}</CustomMarkdown>
                  </div>
                ) : null}

                {index === 2 && (
                  <>
                    <div className={`${styles.about_downloads}`}>
                      {certificate1 ? (
                        <div
                          onClick={() => togglePDFPopup(certificate1)}
                          className={`${styles.certificate_container}`}
                        >
                          <span className={`${styles.certificate_text}`}>
                            Beschussamt München
                            <span className={`${styles.view_certificates}`}>
                              {lang.viewCertificates}
                              <div className={`${styles.icon}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="25"
                                  fill="none"
                                  viewBox="0 0 20 20"
                                >
                                  <circle
                                    cx="10"
                                    cy="10"
                                    r="8"
                                    stroke="currentColor"
                                  ></circle>
                                  <path
                                    stroke="currentColor"
                                    d="M7.714 12.286 12 8m0 0H7m5 0v5"
                                  ></path>
                                </svg>
                              </div>
                            </span>
                          </span>
                        </div>
                      ) : null}
                      {certificate2 ? (
                        <div
                          onClick={() => togglePDFPopup(certificate2)}
                          className={`${styles.certificate_container}`}
                        >
                          <span className={`${styles.certificate_text}`}>
                            {lang.otherIndependentLaboratories}
                            <span className={`${styles.view_certificates}`}>
                              {lang.viewCertificates}
                              <div className={`${styles.icon}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="25"
                                  height="25"
                                  fill="none"
                                  viewBox="0 0 20 20"
                                >
                                  <circle
                                    cx="10"
                                    cy="10"
                                    r="8"
                                    stroke="currentColor"
                                  ></circle>
                                  <path
                                    stroke="currentColor"
                                    d="M7.714 12.286 12 8m0 0H7m5 0v5"
                                  ></path>
                                </svg>
                              </div>
                            </span>
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </>
                )}
              </div>

              {item.image.data ? (
                <div className={`${styles.about_box_item_image}`}>
                  <Gallery props={item.image.data} singular />
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <PopupPDF
          isOpen={isPDFPopupOpen}
          onClose={() => togglePDFPopup('')}
          pdfUrl={currentPdfUrl}
        />

        {quote ? (
          <div className={`${styles.about_quote} container_small`}>
            {/* <FillingText data={quote} dark /> */}
            <CustomMarkdown>{quote}</CustomMarkdown>
          </div>
        ) : null}

        <div className="b-globe-outer">
          <ClientOnly>
            <GlobeComponent />
          </ClientOnly>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  const route = routes.about;

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

export default About;
