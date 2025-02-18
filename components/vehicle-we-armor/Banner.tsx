import styles from './Banner.module.scss';
import Image from 'next/image';
import Button from 'components/global/button/Button';
import TabSlider from 'components/global/tab-slider/TabSlider';
import { useIsMobile } from 'hooks/useIsMobile';
import { useEffect, useState } from 'react';
import LightboxCustom from 'components/global/lightbox/LightboxCustom';
import PlayIcon from 'components/icons/Play2';
import useLocale from 'hooks/useLocale';

import 'yet-another-react-lightbox/styles.css';

import dynamic from 'next/dynamic';
const PopupPDF = dynamic(() => import('components/global/lightbox/PopupPDF'), {
  ssr: false,
});

const Banner = (props) => {
  const { lang } = useLocale();
  const data = props.props;

  const hasNullFlag = (inventory) =>
    inventory.some(
      (item) => item.attributes.hide === null || item.attributes.hide === false
    );

  const showComponent = hasNullFlag(data.inventory);

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

  // Lightbox
  const [selectedTitle, setSelectedTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const [isLightboxPopupOpen, setLightboxPopupOpen] = useState(false);

  const handleLightboxOpen = (title, location, contentType, url = null) => {
    setSelectedTitle(title);
    setContentType(contentType);
    if (contentType === 'video') {
      setVideoSrc(url);
    }
    setLightboxPopupOpen(true);
  };

  const lightboxData = {
    title: selectedTitle,
    contentType: contentType,
    videoSrc: videoSrc,
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
              {lang.requestAQuote}
            </Button>

            <Button
              {...(data.inventory?.length && showComponent
                ? {
                    href: `${lang.vehiclesWeArmorStock}${data.slug}`,
                    className: `${styles.banner_buttons_item} shiny`,
                  }
                : {
                    className: `${styles.banner_buttons_item} shiny`,
                    button: true,
                    disabled: true,
                  })}
            >
              {lang.viewInStockAvailability}
            </Button>
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
              sizes="(max-width: 768px) 50vw, 100vw"
              priority
              className={`observe fade-in`}
            />
          </div>
        ) : null}

        <div className={`${styles.banner_container}`}>
          {data?.videoURL ? (
            <div
              onClick={() =>
                handleLightboxOpen(data.title, '', 'video', data.videoURL)
              }
              className={`${styles.banner_pdf} ${styles.certificate_container}`}
            >
              <span>
                <span>{lang.watch}</span>
                <br />
                {lang.video}
              </span>
              <PlayIcon />
            </div>
          ) : null}

          {data.pdf?.data ? (
            <div
              onClick={() => togglePDFPopup(data.pdf.data.attributes)}
              className={`${styles.banner_pdf} ${styles.certificate_container}`}
            >
              <span className={`${styles.certificate_text}`}>
                <span className={`${styles.view_certificates}`}>OEM</span>
                <br />
                Specs
              </span>
              <div className={`${styles.icon}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <circle cx="10" cy="10" r="8" stroke="currentColor"></circle>
                  <path
                    stroke="currentColor"
                    d="M7.714 12.286 12 8m0 0H7m5 0v5"
                  ></path>
                </svg>
              </div>
            </div>
          ) : null}
        </div>

        <div className={`${styles.banner_protection}`}>
          <p>{lang.offeredAtProtectionLevels}</p>
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

      {isLightboxPopupOpen ? (
        <LightboxCustom
          isLightboxPopupOpen={isLightboxPopupOpen}
          lightboxData={lightboxData}
          setLightboxPopupOpen={setLightboxPopupOpen}
        />
      ) : null}
    </div>
  );
};

export default Banner;
