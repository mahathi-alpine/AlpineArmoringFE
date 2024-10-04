import styles from './LightboxCustom.module.scss';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';

const LightboxCustom = ({
  isLightboxPopupOpen,
  lightboxData,
  setLightboxPopupOpen,
}) => {
  const options = {
    dragFree: false,
    loop: true,
    thumbs: true,
  };
  const [sliderContentRef, emblaMainApi] = useEmblaCarousel(options, [Fade()]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onPrevButtonClick = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    emblaMainApi.scrollPrev();
  }, [emblaMainApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    emblaMainApi.scrollNext();
  }, [emblaMainApi]);

  const extractYear = (dateString) => {
    if (!dateString) return '';
    return dateString.split('-')[0];
  };

  const lightboxWrapRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        lightboxWrapRef.current &&
        !lightboxWrapRef.current.contains(event.target)
      ) {
        setLightboxPopupOpen(false);
      }
    };

    const handleClickInside = (event) => {
      event.stopPropagation();
    };

    if (isLightboxPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      if (lightboxWrapRef.current) {
        lightboxWrapRef.current.addEventListener(
          'mousedown',
          handleClickInside
        );
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (lightboxWrapRef.current) {
        lightboxWrapRef.current.removeEventListener(
          'mousedown',
          handleClickInside
        );
      }
    };
  }, [isLightboxPopupOpen]);

  return (
    <div
      className={`
        ${styles.lightbox}                
        ${isLightboxPopupOpen ? `${styles.lightbox_open}` : ''}
      `}
    >
      {lightboxData.contentType !== 'content' && (
        <div className={`${styles.lightbox_caption}`}>
          <h3 className={`${styles.lightbox_caption_title}`}>
            {lightboxData.title}
          </h3>
          <h4 className={`${styles.lightbox_caption_subtitle}`}>
            {lightboxData.location}
          </h4>
        </div>
      )}

      {lightboxData.contentType === 'video' && (
        <>
          <div
            className={`${styles.lightbox_close}`}
            onClick={() => {
              setLightboxPopupOpen((prevState) => !prevState);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              aria-hidden="true"
              focusable="false"
            >
              <g fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  fill="white"
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                ></path>
              </g>
            </svg>
          </div>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${lightboxData.videoSrc}?autoplay=1&mute=1&loop=1&rel=0`}
          ></iframe>
        </>
      )}

      {lightboxData.contentType === 'content' && (
        <div className={`${styles.lightbox_content}`}>
          <div
            className={`${styles.lightbox_content_wrap}`}
            ref={lightboxWrapRef}
          >
            <div
              className={`${styles.lightbox_close}`}
              onClick={() => {
                setLightboxPopupOpen((prevState) => !prevState);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                aria-hidden="true"
                focusable="false"
              >
                <g fill="currentColor">
                  <path d="M0 0h24v24H0z" fill="none"></path>
                  <path
                    fill="white"
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  ></path>
                </g>
              </svg>
            </div>

            <div
              className={`${styles.lightbox_content_slider}`}
              ref={sliderContentRef}
            >
              <div className={`${styles.lightbox_content_slider_container}`}>
                {lightboxData?.gallery?.map((item, index) => (
                  <div
                    className={styles.lightbox_content_slider_slide}
                    key={index}
                  >
                    {item.attributes?.url &&
                    item.attributes.mime !== 'video/mp4' ? (
                      <Image
                        src={
                          window.innerWidth < 750
                            ? item.attributes.formats?.medium?.url ||
                              item.attributes.url
                            : item.attributes.formats?.large?.url ||
                              item.attributes.url
                        }
                        width={
                          window.innerWidth < 750
                            ? item.attributes.formats?.medium?.width ||
                              item.attributes.width
                            : item.attributes.formats?.large?.width ||
                              item.attributes.width
                        }
                        height={
                          window.innerWidth < 750
                            ? item.attributes.formats?.medium?.height ||
                              item.attributes.height
                            : item.attributes.formats?.large?.height ||
                              item.attributes.height
                        }
                        alt={
                          item.attributes.alternativeText || 'Alpine Armoring'
                        }
                        priority={index === 0}
                      />
                    ) : (
                      <video
                        muted
                        autoPlay
                        playsInline
                        loop
                        preload="auto"
                        controls
                      >
                        <source
                          src={`${item?.attributes.url}`}
                          type={`${item?.attributes.mime}`}
                        />
                      </video>
                    )}
                  </div>
                ))}
              </div>

              <div className={`${styles.lightbox_slider_arrows}`}>
                <button
                  onClick={onPrevButtonClick}
                  className={`${styles.lightbox_slider_arrow}`}
                >
                  <svg viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                  </svg>
                </button>

                <button
                  onClick={onNextButtonClick}
                  className={`${styles.lightbox_slider_arrow} ${styles.lightbox_slider_arrow_next}`}
                >
                  <svg viewBox="0 0 532 532">
                    <path
                      fill="currentColor"
                      d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className={`${styles.lightbox_content_main}`}>
              <h3 className={`${styles.lightbox_content_title}`}>
                {lightboxData.title}
              </h3>
              <h3 className={`${styles.lightbox_content_subtitle}`}>
                {lightboxData.location}
              </h3>
              <h3 className={`${styles.lightbox_content_title}`}>
                {extractYear(lightboxData.year)}
              </h3>
              <h3 className={`${styles.lightbox_content_subtitle}`}>
                {lightboxData.date}
              </h3>

              <div
                className={styles.lightbox_content_thumbs}
                ref={emblaThumbsRef}
              >
                <div className={styles.lightbox_content_thumbs_container}>
                  {lightboxData.gallery.map((item, index) => (
                    <div
                      className={`${styles.lightbox_content_thumbs_slide} ${
                        index === selectedIndex
                          ? styles.lightbox_content_thumbs_slide_active
                          : ''
                      }`}
                      key={index}
                    >
                      <button
                        onClick={() => onThumbClick(index)}
                        className={styles.lightbox_content_thumbs_slide_button}
                        type="button"
                      >
                        {item.attributes?.formats ? (
                          <Image
                            src={
                              item.attributes?.formats?.thumbnail.url ||
                              item.attributes?.url
                            }
                            alt={
                              item.attributes?.alternativeText ||
                              'Alpine Armoring'
                            }
                            width={120}
                            height={80}
                            sizes="(max-width: 767px) 15vw, 10vw"
                            className={styles.lightbox_content_thumbs_slide_img}
                          />
                        ) : (
                          <svg
                            height="36"
                            width="36"
                            viewBox="0 0 459 459"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#ffffff"
                            fill="#FF0000"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {' '}
                              <g>
                                {' '}
                                <g>
                                  <path d="M229.5,0C102.751,0,0,102.751,0,229.5S102.751,459,229.5,459S459,356.249,459,229.5S356.249,0,229.5,0z M310.292,239.651 l-111.764,76.084c-3.761,2.56-8.63,2.831-12.652,0.704c-4.022-2.128-6.538-6.305-6.538-10.855V153.416 c0-4.55,2.516-8.727,6.538-10.855c4.022-2.127,8.891-1.857,12.652,0.704l111.764,76.084c3.359,2.287,5.37,6.087,5.37,10.151 C315.662,233.564,313.652,237.364,310.292,239.651z"></path>
                                </g>{' '}
                              </g>{' '}
                            </g>
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LightboxCustom;
