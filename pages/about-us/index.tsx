import { useEffect, useState } from 'react';
import { getPageData } from 'hooks/api';
import styles from './About.module.scss';
import Banner from 'components/global/banner/Banner';
import Image from 'next/image';
import PDFIcon from 'components/icons/PDF';
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

function About(props) {
  const boxes = props?.pageData?.boxes;
  const timelineImages = props?.pageData?.timeline?.data || [];
  const certificate1 = props?.pageData?.certificate1?.data?.attributes?.url;
  const certificate2 = props?.pageData?.certificate2?.data?.attributes?.url;
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
          <Banner props={props.pageData.banner} center shape="white" />
        ) : null}

        {props.pageData?.bannerTitle ? (
          <div
            dangerouslySetInnerHTML={{
              __html: convertMarkdown(props.pageData.bannerTitle),
            }}
          ></div>
        ) : null}

        {props.pageData?.text ? (
          <div
            className={`${styles.about_text} observe fade-in container_small`}
            dangerouslySetInnerHTML={{
              __html: convertMarkdown(props.pageData.text),
            }}
          ></div>
        ) : null}

        {timelineImages.length > 0 ? (
          <div className={`${styles.timeline_gallery} observe fade-in`}>
            <Autoplay props={timelineImages} regular autoplay />
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
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></p>
                ) : null}

                {item.title === 'Our Certifications' && (
                  <div className={`${styles.about_downloads}`}>
                    {certificate1 ? (
                      <div
                        onClick={() => togglePDFPopup('/assets/pdf1.pdf')}
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                      >
                        <span
                          style={{
                            marginTop: '40px',
                            display: 'inline-block',
                            marginRight: '10px',
                          }}
                        >
                          BESCHUSSAMT MÜNCHEN
                          <span style={{ fontSize: '27px' }}>
                            VIEW CERTIFICATES
                          </span>
                        </span>
                        <PDFIcon />
                      </div>
                    ) : null}
                    {certificate2 ? (
                      <div
                        onClick={() => togglePDFPopup('/assets/pdf2.pdf')}
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                      >
                        <span
                          style={{
                            marginTop: '40px',
                            display: 'inline-block',
                            marginRight: '10px',
                          }}
                        >
                          OTHER INDEPENDENT LABORATORIES
                          <span style={{ fontSize: '27px' }}>
                            VIEW CERTIFICATES
                          </span>
                        </span>
                        <PDFIcon />
                      </div>
                    ) : null}

                    <PopupPDF
                      isOpen={isPDFPopupOpen}
                      onClose={() => togglePDFPopup('')}
                      pdfUrl={currentPdfUrl}
                    />
                  </div>
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

        {props.pageData?.quote ? (
          <div className={`${styles.about_quote}`}>
            <FillingText data={props.pageData?.quote} dark />
          </div>
        ) : null}

        {props.pageData?.bottomImage.data ? (
          <div className={`${styles.about_bottom_img} container_small`}>
            <Image
              src={`${
                props.pageData?.bottomImage.data?.attributes.formats?.large
                  ?.url || props.pageData?.bottomImage.data?.attributes.url
              }`}
              alt={
                props.pageData?.bottomImage.data?.attributes.alternativeText ||
                'Alpine Armoring'
              }
              width={
                props.pageData?.bottomImage.data?.attributes.formats?.large
                  ?.width || props.pageData?.bottomImage.data?.attributes.width
              }
              height={
                props.pageData?.bottomImage.data?.attributes.formats?.large
                  ?.height ||
                props.pageData?.bottomImage.data?.attributes.height
              }
            />
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
