import { useEffect, useState } from 'react';
import { getPageData } from 'hooks/api';
import styles from 'pages/about-us/About.module.scss';
import Banner from 'components/global/banner/Banner';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import FillingText from 'components/global/filling-text/FillingText';
import Autoplay from 'components/global/carousel/Autoplay';
import Gallery from 'components/global/carousel/CarouselCurved';
import Counter from 'components/global/counter/Counter';

import 'yet-another-react-lightbox/styles.css';

const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

import dynamic from 'next/dynamic';
import ClientOnly from 'components/ClientOnly';

const GlobeComponent = dynamic(() => import('components/global/globe/Globe'), {
  ssr: false,
});

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  color?: string;
  position?: 'top' | 'right' | 'bottom';
}

function About(props) {
  const boxes = props?.pageData?.boxes;
  const certificate1 = props?.pageData?.certificate1?.data?.attributes?.url;
  const certificate2 = props?.pageData?.certificate2?.data?.attributes?.url;
  const convertMarkdown = useMarkdownToHtml();

  const companyLocations: Location[] = [
    {
      name: 'Afghanistan',
      lat: 33.9391,
      lng: 67.71,
    },
    {
      name: 'Algeria',
      lat: 28.0339,
      lng: 1.6596,
    },
    {
      name: 'Angola',
      lat: -11.2027,
      lng: 17.8739,
    },
    {
      name: 'Aruba',
      lat: 12.5211,
      lng: -69.9683,
    },
    {
      name: 'Azerbaijan',
      lat: 40.1431,
      lng: 47.5769,
    },
    {
      name: 'Bahamas',
      lat: 25.0343,
      lng: -77.3963,
      position: 'top',
    },
    {
      name: 'Barbados',
      lat: 13.1939,
      lng: -59.5432,
    },
    {
      name: 'Benin',
      lat: 9.3077,
      lng: 2.3158,
    },
    {
      name: 'Bolivia',
      lat: -16.2902,
      lng: -63.5887,
    },
    {
      name: 'Bosnia and Herzegovina',
      lat: 43.9159,
      lng: 17.6791,
    },
    {
      name: 'Brazil',
      lat: -14.235,
      lng: -51.9253,
    },
    {
      name: 'Burkina Faso',
      lat: 12.2383,
      lng: -1.5616,
    },
    {
      name: 'Burundi',
      lat: -3.3731,
      lng: 29.9189,
    },
    {
      name: 'Cambodia',
      lat: 12.5657,
      lng: 104.991,
    },
    {
      name: 'Chile',
      lat: -35.6751,
      lng: -71.543,
    },
    {
      name: 'China',
      lat: 35.8617,
      lng: 104.1954,
    },
    {
      name: 'Colombia',
      lat: 4.5709,
      lng: -74.2973,
    },
    {
      name: 'Congo [DRC]',
      lat: -4.0383,
      lng: 21.7587,
    },
    {
      name: 'Congo [Republic]',
      lat: -0.228,
      lng: 15.8277,
    },
    {
      name: "Cote d'Ivoire",
      lat: 7.54,
      lng: -5.5471,
      position: 'top',
    },
    {
      name: 'Cyprus',
      lat: 35.1264,
      lng: 33.4299,
    },
    {
      name: 'Djibouti',
      lat: 11.8251,
      lng: 42.5903,
    },
    {
      name: 'Dominican Republic',
      lat: 18.7357,
      lng: -70.1627,
    },
    {
      name: 'Ecuador',
      lat: -1.8312,
      lng: -78.1834,
    },
    {
      name: 'Egypt',
      lat: 26.8206,
      lng: 30.8025,
    },
    {
      name: 'Equatorial Guinea',
      lat: 1.6508,
      lng: 10.2679,
    },
    {
      name: 'Georgia',
      lat: 42.3154,
      lng: 43.3569,
    },
    {
      name: 'Germany',
      lat: 51.1657,
      lng: 10.4515,
    },
    {
      name: 'Ghana',
      lat: 7.9465,
      lng: -1.0232,
    },
    {
      name: 'Greece',
      lat: 39.0742,
      lng: 21.8243,
    },
    {
      name: 'Guatemala',
      lat: 15.7835,
      lng: -90.2308,
    },
    {
      name: 'Haiti',
      lat: 18.9712,
      lng: -72.2852,
      position: 'top',
    },
    {
      name: 'Hong Kong',
      lat: 22.3964,
      lng: 114.1095,
    },
    {
      name: 'Indonesia',
      lat: -0.7893,
      lng: 113.9213,
    },
    {
      name: 'Iraq',
      lat: 33.2232,
      lng: 43.6793,
    },
    {
      name: 'Israel',
      lat: 31.0461,
      lng: 34.8516,
    },
    {
      name: 'Italy',
      lat: 41.8719,
      lng: 12.5674,
    },
    {
      name: 'Jamaica',
      lat: 18.1096,
      lng: -77.2975,
      position: 'bottom',
    },
    {
      name: 'Jordan',
      lat: 30.5852,
      lng: 36.2384,
      position: 'bottom',
    },
    {
      name: 'Kazakhstan',
      lat: 48.0196,
      lng: 66.9237,
    },
    {
      name: 'Kenya',
      lat: -0.0236,
      lng: 37.9062,
    },
    {
      name: 'Kosovo',
      lat: 42.6026,
      lng: 20.903,
    },
    {
      name: 'Kuwait',
      lat: 29.3117,
      lng: 47.4818,
    },
    {
      name: 'Laos',
      lat: 19.8563,
      lng: 102.4955,
    },
    {
      name: 'Lebanon',
      lat: 33.8547,
      lng: 35.8623,
    },
    {
      name: 'Liberia',
      lat: 6.4281,
      lng: -9.4295,
      position: 'bottom',
    },
    {
      name: 'Malaysia',
      lat: 4.2105,
      lng: 101.9758,
    },
    {
      name: 'Mali',
      lat: 17.5707,
      lng: -3.9962,
    },
    {
      name: 'Malta',
      lat: 35.9375,
      lng: 14.3754,
    },
    {
      name: 'Mexico',
      lat: 23.6345,
      lng: -102.5528,
    },
    {
      name: 'Mozambique',
      lat: -18.6657,
      lng: 35.5296,
    },
    {
      name: 'Niger',
      lat: 17.6078,
      lng: 8.0817,
    },
    {
      name: 'Nigeria',
      lat: 9.082,
      lng: 8.6753,
    },
    {
      name: 'Oman',
      lat: 21.5126,
      lng: 55.9233,
    },
    {
      name: 'Pakistan',
      lat: 30.3753,
      lng: 69.3451,
    },
    {
      name: 'Panama',
      lat: 8.538,
      lng: -80.7821,
    },
    {
      name: 'Papua New Guinea',
      lat: -6.315,
      lng: 143.9555,
    },
    {
      name: 'Peru',
      lat: -9.19,
      lng: -75.0152,
    },
    {
      name: 'Qatar',
      lat: 25.3548,
      lng: 51.1839,
      description: 'Alpine Armoring International Office',
      color: '#bebbbe',
    },
    {
      name: 'Saint Martin',
      lat: 18.0753,
      lng: -63.06,
      position: 'bottom',
    },
    {
      name: 'Saudi Arabia',
      lat: 23.8859,
      lng: 45.0792,
    },
    {
      name: 'Senegal',
      lat: 14.4974,
      lng: -14.4524,
    },
    {
      name: 'South Korea',
      lat: 35.9078,
      lng: 127.7669,
    },
    {
      name: 'Spain',
      lat: 40.4637,
      lng: -3.7492,
    },
    {
      name: 'Suriname',
      lat: 3.9193,
      lng: -56.0278,
    },
    {
      name: 'Sweden',
      lat: 60.1282,
      lng: 18.6435,
    },
    {
      name: 'Switzerland',
      lat: 46.8182,
      lng: 8.2275,
    },
    {
      name: 'Tajikistan',
      lat: 38.861,
      lng: 71.2761,
    },
    {
      name: 'Thailand',
      lat: 15.87,
      lng: 100.9925,
    },
    {
      name: 'Timor-Leste',
      lat: -8.8742,
      lng: 125.7275,
    },
    {
      name: 'Trinidad and Tobago',
      lat: 10.6918,
      lng: -61.2225,
    },
    {
      name: 'Tunisia',
      lat: 33.8869,
      lng: 9.5375,
    },
    {
      name: 'Turkey',
      lat: 38.9637,
      lng: 35.2433,
    },
    {
      name: 'Turks and Caicos Islands',
      lat: 21.694,
      lng: -71.7979,
      position: 'top',
    },
    {
      name: 'Uganda',
      lat: 1.3733,
      lng: 32.2903,
    },
    {
      name: 'UAE',
      lat: 23.4241,
      lng: 53.8478,
      description: 'Alpine Armoring International Partner',
      color: '#bebbbe',
    },
    {
      name: 'United Kingdom',
      lat: 55.3781,
      lng: -3.436,
    },
    {
      name: 'Uzbekistan',
      lat: 41.3775,
      lng: 64.5853,
    },
    {
      name: 'Vietnam',
      lat: 14.0583,
      lng: 108.2772,
    },
    {
      name: 'Virginia',
      lat: 38.888691,
      lng: -77.417488,
      description: 'Alpine Armoring Headquarters',
      color: '#fff',
    },
    {
      name: 'Nevada',
      lat: 36.16909,
      lng: -115.140579,
      description: 'Alpine Armoring Regional Office',
      color: '#1AA3E8',
    },
    {
      name: 'California',
      lat: 32.715759,
      lng: -117.163818,
      description: 'Alpine Armoring Regional Office',
      color: '#1AA3E8',
    },
    {
      name: 'Texas',
      lat: 32.777981,
      lng: -96.796211,
      description: 'Alpine Armoring Regional Office',
      color: '#fff',
    },
    {
      name: 'Ontario',
      lat: 43.653225,
      lng: -79.383186,
      description: 'Alpine Armoring Regional Office',
      color: '#fff',
    },
    {
      name: 'South Africa',
      lat: -33.9823115016787,
      lng: 18.50769670326755,
    },
  ];

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

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  return (
    <>
      <div className={`${styles.about}`}>
        {props.pageData?.banner ? (
          <Banner props={props.pageData.banner} shape="white" />
        ) : null}

        {props.pageData?.text ? (
          <div
            className={`${styles.about_text} observe fade-in container_small`}
            dangerouslySetInnerHTML={{
              __html: convertMarkdown(props.pageData.text),
            }}
          ></div>
        ) : null}

        {props.pageData?.timeline1?.filter(
          (item) => item.image?.data?.length > 0
        ).length > 0 ? (
          <div className={`${styles.timeline_gallery}`}>
            <Autoplay
              slides={props.pageData?.timeline1
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
            <h3>Countries We Serviced</h3>
            <Counter value={88} />
          </div>
          <div className={styles.counter_box}>
            <h3>Years In Business</h3>
            <Counter value={31} />
          </div>
          <div className={styles.counter_box}>
            <h3>Makes & Models We Have Armored</h3>
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
                  <p
                    className={`${styles.about_box_item_text}`}
                    dangerouslySetInnerHTML={{
                      __html: convertMarkdown(item.description),
                    }}
                  ></p>
                ) : null}

                {item.title === 'Our Certifications' && (
                  <>
                    <div className={`${styles.about_downloads}`}>
                      {certificate1 ? (
                        <div
                          onClick={() => togglePDFPopup(certificate1)}
                          className={`${styles.certificate_container}`}
                        >
                          <span className={`${styles.certificate_text}`}>
                            BESCHUSSAMT MÜNCHEN
                            <span className={`${styles.view_certificates}`}>
                              VIEW CERTIFICATES
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
                            OTHER INDEPENDENT LABORATORIES
                            <span className={`${styles.view_certificates}`}>
                              VIEW CERTIFICATES
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

        {props.pageData?.quote ? (
          <div className={`${styles.about_quote}`}>
            <FillingText data={props.pageData?.quote} dark />
          </div>
        ) : null}

        <div className="b-globe-outer">
          <ClientOnly>
            <GlobeComponent locations={companyLocations} />
          </ClientOnly>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let pageData = await getPageData({
    route: 'about',
    populate: 'deep',
  });
  pageData = pageData.data?.attributes || null;

  const seoData = pageData?.seo || null;

  return {
    props: { pageData, seoData },
  };
}

export default About;
