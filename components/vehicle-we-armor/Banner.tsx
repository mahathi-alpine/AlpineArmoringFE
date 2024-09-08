import styles from './Banner.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import PDFIcon from 'components/icons/PDF';
import TabSlider from 'components/global/tab-slider/TabSlider';
import { useIsMobile } from 'hooks/useIsMobile';
import { useEffect, useState } from 'react';

import 'yet-another-react-lightbox/styles.css';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

const Banner = (props) => {
  const data = props.props;

  const protectionLevel = data.protectionLevel || 'A4, A6, A9, A11';
  const protectionLevelSplit = protectionLevel.split(',');

  const scroll = () => {
    const element = document.getElementById('request-a-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (index, titleNav) => {
    const targetId = titleNav.toLowerCase().replace(/\s+/g, '-');
    const targetElement = document.getElementById(targetId);
    const offset = 100;

    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const getImageDimensions = () => {
    let width =
      data.featuredImage.data.attributes.formats?.thumbnail?.width ||
      data.featuredImage.data.attributes.width;
    let height =
      data.featuredImage.data.attributes.formats?.thumbnail?.height ||
      data.featuredImage.data.attributes.height;

    if (hasMounted && isMobile == false) {
      width =
        data.featuredImage.data.attributes.formats?.large?.width ||
        data.featuredImage.data.attributes.width;
      height =
        data.featuredImage.data.attributes.formats?.large?.height ||
        data.featuredImage.data.attributes.height;
    }
    return {
      width,
      height,
    };
  };
  const { width, height } = getImageDimensions();

  const [isPDFPopupOpen, setPDFPopupOpen] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState('');

  const togglePDFPopup = (url) => {
    setPDFPopupOpen((prevState) => !prevState);
    setCurrentPdfUrl(url);
  };

  return (
    <div
      className={`
      ${styles.banner}
      ${!data.pdf?.data ? styles.banner_noPdf : ''}      
    `}
    >
      <div className={`${styles.banner_main}`}>
        <div className={`${styles.banner_title}`}>
          {data.title ? (
            <h1 dangerouslySetInnerHTML={{ __html: data.title }}></h1>
          ) : null}
          <div
            className={`shapeCurved_bottomLeft shapeCurved large-only`}
          ></div>
        </div>

        <div className={`${styles.banner_content}`}>
          <div className={`${styles.banner_description}`}>
            {data.descriptionBanner ? (
              <div
                dangerouslySetInnerHTML={{ __html: data.descriptionBanner }}
              ></div>
            ) : null}
          </div>

          <div className={`${styles.banner_buttons}`}>
            <Button
              onClick={scroll}
              button={true}
              className={`${styles.banner_buttons_item} primary shiny`}
            >
              Request a quote
            </Button>
            {data.inventory?.length ? (
              <Button
                href={`/available-now/?vehicles_we_armor=${data.slug}`}
                className={`${styles.banner_buttons_item} shiny`}
              >
                View in-stock availability
              </Button>
            ) : (
              <Button
                className={`${styles.banner_buttons_item} shiny`}
                button={true}
                disabled
              >
                View in-stock availability
              </Button>
            )}
          </div>
        </div>

        <div className={`shapeCurved_rightTop shapeCurved large-only`}></div>
      </div>

      <div className={`${styles.banner_image}`}>
        <div className={`${styles.banner_overlay}`}>
          <div className={`${styles.banner_overlay_blob2}`}></div>

          <div className={`${styles.banner_overlay_noise}`}></div>
          <svg
            viewBox="0 0 500 500"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'none' }}
          >
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency=".75"
                numOctaves="2"
                stitchTiles="stitch"
              />
            </filter>
          </svg>
        </div>

        {data.featuredImage?.data ? (
          <div className={`${styles.banner_image_wrap}`}>
            <Image
              src={
                data.featuredImage.data.attributes.formats?.large.url ||
                data.featuredImage.data.attributes.url
              }
              alt={
                data.featuredImage.data.attributes.alternativeText ||
                'Alpine Armoring'
              }
              width={width}
              height={height}
              // width={
              //   data.featuredImage.data.attributes.formats?.large?.width ||
              //   data.featuredImage.data.attributes.width
              // }
              // height={
              //   data.featuredImage.data.attributes.formats?.large?.height ||
              //   data.featuredImage.data.attributes.height
              // }
              sizes="(max-width: 768px) 50vw, 100vw"
              priority
              className={`observe fade-in`}
            />
          </div>
        ) : null}

        {data.pdf?.data ? (
          <div
            onClick={() => togglePDFPopup(data.pdf.data.attributes.url)}
            className={`${styles.banner_pdf}`}
          >
            <span>
              <span>OEM</span>
              <br />
              Specs
            </span>
            <PDFIcon />
          </div>
        ) : null}

        <div className={`${styles.banner_protection}`}>
          <p>Offered At Protection Levels</p>
          <div className={`${styles.banner_protection_levels}`}>
            {protectionLevelSplit.map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
          <div className={`shapeCurved_left shapeCurved`}></div>
          <div className={`shapeCurved_right shapeCurved`}></div>
        </div>
      </div>

      <TabSlider
        props={data.navItems}
        onTabChange={handleTabChange}
        className={`${styles.banner_nav} slug_nav container`}
        sticky
        anchor
      />

      <div
        className={`${styles.banner_shape} shape-before shape-before-white`}
      ></div>

      <PopupPDF
        isOpen={isPDFPopupOpen}
        onClose={() => togglePDFPopup('')}
        pdfUrl={currentPdfUrl}
      />
    </div>
  );
};

export default Banner;
