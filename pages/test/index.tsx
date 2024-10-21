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
      description: 'Our headquarters in the heart of Afghanistan.',
    },
    {
      name: 'Algeria',
      lat: 28.0339,
      lng: 1.6596,
      description: 'Our headquarters in the heart of Algeria.',
    },
    {
      name: 'Angola',
      lat: -11.2027,
      lng: 17.8739,
      description: 'Our headquarters in the heart of Angola.',
    },
    {
      name: 'Aruba',
      lat: 12.5211,
      lng: -69.9683,
      description: 'Our headquarters in the heart of Aruba.',
    },
    {
      name: 'Azerbaijan',
      lat: 40.1431,
      lng: 47.5769,
      description: 'Our headquarters in the heart of Azerbaijan.',
    },
    {
      name: 'Bahamas',
      lat: 25.0343,
      lng: -77.3963,
      description: 'Our headquarters in the heart of Bahamas.',
    },
    {
      name: 'Barbados',
      lat: 13.1939,
      lng: -59.5432,
      description: 'Our headquarters in the heart of Barbados.',
    },
    {
      name: 'Benin',
      lat: 9.3077,
      lng: 2.3158,
      description: 'Our headquarters in the heart of Benin.',
    },
    {
      name: 'Bolivia',
      lat: -16.2902,
      lng: -63.5887,
      description: 'Our headquarters in the heart of Bolivia.',
    },
    {
      name: 'Bosnia and Herzegovina',
      lat: 43.9159,
      lng: 17.6791,
      description: 'Our headquarters in the heart of Bosnia and Herzegovina.',
    },
    {
      name: 'Brazil',
      lat: -14.235,
      lng: -51.9253,
      description: 'Our headquarters in the heart of Brazil.',
    },
    {
      name: 'Burkina Faso',
      lat: 12.2383,
      lng: -1.5616,
      description: 'Our headquarters in the heart of Burkina Faso.',
    },
    {
      name: 'Burundi',
      lat: -3.3731,
      lng: 29.9189,
      description: 'Our headquarters in the heart of Burundi.',
    },
    {
      name: 'Cambodia',
      lat: 12.5657,
      lng: 104.991,
      description: 'Our headquarters in the heart of Cambodia.',
    },
    {
      name: 'Canada',
      lat: 56.1304,
      lng: -106.3468,
      description: 'Our headquarters in the heart of Canada.',
    },
    {
      name: 'Chile',
      lat: -35.6751,
      lng: -71.543,
      description: 'Our headquarters in the heart of Chile.',
    },
    {
      name: 'China',
      lat: 35.8617,
      lng: 104.1954,
      description: 'Our headquarters in the heart of China.',
    },
    {
      name: 'Colombia',
      lat: 4.5709,
      lng: -74.2973,
      description: 'Our headquarters in the heart of Colombia.',
    },
    {
      name: 'Congo [DRC]',
      lat: -4.0383,
      lng: 21.7587,
      description: 'Our headquarters in the heart of Congo [DRC].',
    },
    {
      name: 'Congo [Republic]',
      lat: -0.228,
      lng: 15.8277,
      description: 'Our headquarters in the heart of Congo [Republic].',
    },
    {
      name: "Cote d'Ivoire",
      lat: 7.54,
      lng: -5.5471,
      description: "Our headquarters in the heart of Cote d'Ivoire.",
    },
    {
      name: 'Cyprus',
      lat: 35.1264,
      lng: 33.4299,
      description: 'Our headquarters in the heart of Cyprus.',
    },
    {
      name: 'Djibouti',
      lat: 11.8251,
      lng: 42.5903,
      description: 'Our headquarters in the heart of Djibouti.',
    },
    {
      name: 'Dominican Republic',
      lat: 18.7357,
      lng: -70.1627,
      description: 'Our headquarters in the heart of Dominican Republic.',
    },
    {
      name: 'Ecuador',
      lat: -1.8312,
      lng: -78.1834,
      description: 'Our headquarters in the heart of Ecuador.',
    },
    {
      name: 'Egypt',
      lat: 26.8206,
      lng: 30.8025,
      description: 'Our headquarters in the heart of Egypt.',
    },
    {
      name: 'Equatorial Guinea',
      lat: 1.6508,
      lng: 10.2679,
      description: 'Our headquarters in the heart of Equatorial Guinea.',
    },
    {
      name: 'Georgia',
      lat: 42.3154,
      lng: 43.3569,
      description: 'Our headquarters in the heart of Georgia.',
    },
    {
      name: 'Germany',
      lat: 51.1657,
      lng: 10.4515,
      description: 'Our headquarters in the heart of Germany.',
    },
    {
      name: 'Ghana',
      lat: 7.9465,
      lng: -1.0232,
      description: 'Our headquarters in the heart of Ghana.',
    },
    {
      name: 'Greece',
      lat: 39.0742,
      lng: 21.8243,
      description: 'Our headquarters in the heart of Greece.',
    },
    {
      name: 'Guatemala',
      lat: 15.7835,
      lng: -90.2308,
      description: 'Our headquarters in the heart of Guatemala.',
    },
    {
      name: 'Haiti',
      lat: 18.9712,
      lng: -72.2852,
      description: 'Our headquarters in the heart of Haiti.',
    },
    {
      name: 'Hong Kong',
      lat: 22.3964,
      lng: 114.1095,
      description: 'Our headquarters in the heart of Hong Kong.',
    },
    {
      name: 'Indonesia',
      lat: -0.7893,
      lng: 113.9213,
      description: 'Our headquarters in the heart of Indonesia.',
    },
    {
      name: 'Iraq',
      lat: 33.2232,
      lng: 43.6793,
      description: 'Our headquarters in the heart of Iraq.',
    },
    {
      name: 'Israel',
      lat: 31.0461,
      lng: 34.8516,
      description: 'Our headquarters in the heart of Israel.',
    },
    {
      name: 'Italy',
      lat: 41.8719,
      lng: 12.5674,
      description: 'Our headquarters in the heart of Italy.',
    },
    {
      name: 'Jamaica',
      lat: 18.1096,
      lng: -77.2975,
      description: 'Our headquarters in the heart of Jamaica.',
    },
    {
      name: 'Jordan',
      lat: 30.5852,
      lng: 36.2384,
      description: 'Our headquarters in the heart of Jordan.',
    },
    {
      name: 'Kazakhstan',
      lat: 48.0196,
      lng: 66.9237,
      description: 'Our headquarters in the heart of Kazakhstan.',
    },
    {
      name: 'Kenya',
      lat: -0.0236,
      lng: 37.9062,
      description: 'Our headquarters in the heart of Kenya.',
    },
    {
      name: 'Kosovo',
      lat: 42.6026,
      lng: 20.903,
      description: 'Our headquarters in the heart of Kosovo.',
    },
    {
      name: 'Kuwait',
      lat: 29.3117,
      lng: 47.4818,
      description: 'Our headquarters in the heart of Kuwait.',
    },
    {
      name: 'Laos',
      lat: 19.8563,
      lng: 102.4955,
      description: 'Our headquarters in the heart of Laos.',
    },
    {
      name: 'Lebanon',
      lat: 33.8547,
      lng: 35.8623,
      description: 'Our headquarters in the heart of Lebanon.',
    },
    {
      name: 'Liberia',
      lat: 6.4281,
      lng: -9.4295,
      description: 'Our headquarters in the heart of Liberia.',
    },
    {
      name: 'Malaysia',
      lat: 4.2105,
      lng: 101.9758,
      description: 'Our headquarters in the heart of Malaysia.',
    },
    {
      name: 'Mali',
      lat: 17.5707,
      lng: -3.9962,
      description: 'Our headquarters in the heart of Mali.',
    },
    {
      name: 'Malta',
      lat: 35.9375,
      lng: 14.3754,
      description: 'Our headquarters in the heart of Malta.',
    },
    {
      name: 'Mexico',
      lat: 23.6345,
      lng: -102.5528,
      description: 'Our headquarters in the heart of Mexico.',
    },
    {
      name: 'Mozambique',
      lat: -18.6657,
      lng: 35.5296,
      description: 'Our headquarters in the heart of Mozambique.',
    },
    {
      name: 'Niger',
      lat: 17.6078,
      lng: 8.0817,
      description: 'Our headquarters in the heart of Niger.',
    },
    {
      name: 'Nigeria',
      lat: 9.082,
      lng: 8.6753,
      description: 'Our headquarters in the heart of Nigeria.',
    },
    {
      name: 'Oman',
      lat: 21.5126,
      lng: 55.9233,
      description: 'Our headquarters in the heart of Oman.',
    },
    {
      name: 'Pakistan',
      lat: 30.3753,
      lng: 69.3451,
      description: 'Our headquarters in the heart of Pakistan.',
    },
    {
      name: 'Panama',
      lat: 8.538,
      lng: -80.7821,
      description: 'Our headquarters in the heart of Panama.',
    },
    {
      name: 'Papua New Guinea',
      lat: -6.315,
      lng: 143.9555,
      description: 'Our headquarters in the heart of Papua New Guinea.',
    },
    {
      name: 'Peru',
      lat: -9.19,
      lng: -75.0152,
      description: 'Our headquarters in the heart of Peru.',
    },
    {
      name: 'Qatar',
      lat: 25.3548,
      lng: 51.1839,
      description: 'Our headquarters in the heart of Qatar.',
    },
    {
      name: 'Saint Martin',
      lat: 18.0753,
      lng: -63.06,
      description: 'Our headquarters in the heart of Saint Martin.',
    },
    {
      name: 'Saudi Arabia',
      lat: 23.8859,
      lng: 45.0792,
      description: 'Our headquarters in the heart of Saudi Arabia.',
    },
    {
      name: 'Senegal',
      lat: 14.4974,
      lng: -14.4524,
      description: 'Our headquarters in the heart of Senegal.',
    },
    {
      name: 'South Korea',
      lat: 35.9078,
      lng: 127.7669,
      description: 'Our headquarters in the heart of South Korea.',
    },
    {
      name: 'Spain',
      lat: 40.4637,
      lng: -3.7492,
      description: 'Our headquarters in the heart of Spain.',
    },
    {
      name: 'Suriname',
      lat: 3.9193,
      lng: -56.0278,
      description: 'Our headquarters in the heart of Suriname.',
    },
    {
      name: 'Sweden',
      lat: 60.1282,
      lng: 18.6435,
      description: 'Our headquarters in the heart of Sweden.',
    },
    {
      name: 'Switzerland',
      lat: 46.8182,
      lng: 8.2275,
      description: 'Our headquarters in the heart of Switzerland.',
    },
    {
      name: 'Tajikistan',
      lat: 38.861,
      lng: 71.2761,
      description: 'Our headquarters in the heart of Tajikistan.',
    },
    {
      name: 'Thailand',
      lat: 15.87,
      lng: 100.9925,
      description: 'Our headquarters in the heart of Thailand.',
    },
    {
      name: 'Timor-Leste',
      lat: -8.8742,
      lng: 125.7275,
      description: 'Our headquarters in the heart of Timor-Leste.',
    },
    {
      name: 'Trinidad and Tobago',
      lat: 10.6918,
      lng: -61.2225,
      description: 'Our headquarters in the heart of Trinidad and Tobago.',
    },
    {
      name: 'Tunisia',
      lat: 33.8869,
      lng: 9.5375,
      description: 'Our headquarters in the heart of Tunisia.',
    },
    {
      name: 'Turkey',
      lat: 38.9637,
      lng: 35.2433,
      description: 'Our headquarters in the heart of Turkey.',
    },
    {
      name: 'Turks and Caicos Islands',
      lat: 21.694,
      lng: -71.7979,
      description: 'Our headquarters in the heart of Turks and Caicos Islands.',
    },
    {
      name: 'Uganda',
      lat: 1.3733,
      lng: 32.2903,
      description: 'Our headquarters in the heart of Uganda.',
    },
    {
      name: 'United Arab Emirates',
      lat: 23.4241,
      lng: 53.8478,
      description: 'Our headquarters in the heart of United Arab Emirates.',
    },
    {
      name: 'United Kingdom',
      lat: 55.3781,
      lng: -3.436,
      description: 'Our headquarters in the heart of United Kingdom.',
    },
    {
      name: 'United States',
      lat: 37.0902,
      lng: -95.7129,
      description: 'Our headquarters in the heart of United States.',
    },
    {
      name: 'Uzbekistan',
      lat: 41.3775,
      lng: 64.5853,
      description: 'Our headquarters in the heart of Uzbekistan.',
    },
    {
      name: 'Venezuela',
      lat: 6.4238,
      lng: -66.5897,
      description: 'Our headquarters in the heart of Venezuela.',
    },
    {
      name: 'Vietnam',
      lat: 14.0583,
      lng: 108.2772,
      description: 'Our headquarters in the heart of Vietnam.',
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

        <div style={{ width: '100%', minHeight: '800px' }}>
          <ClientOnly className={`b-globe`}>
            <GlobeComponent locations={companyLocations} />
          </ClientOnly>
        </div>

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
