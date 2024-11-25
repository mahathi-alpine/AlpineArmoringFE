import { useEffect, useState } from 'react';
import { getPageData } from 'hooks/api';
import styles from './About.module.scss';
import Banner from 'components/global/banner/Banner';
import { useMarkdownToHtml } from 'hooks/useMarkdownToHtml';
import FillingText from 'components/global/filling-text/FillingText';
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
  const boxes = props?.pageData?.boxes;
  const certificate1 = props?.pageData?.certificate1?.data?.attributes;
  const certificate2 = props?.pageData?.certificate2?.data?.attributes;
  const convertMarkdown = useMarkdownToHtml();

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
            <GlobeComponent />
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
