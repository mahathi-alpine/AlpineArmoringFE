import styles from './LightboxCustom.module.scss';
import Image from 'next/image';
// import useEmblaCarousel from 'embla-carousel-react';
import EmblaCarousel from 'embla-carousel';
import { useCallback, useEffect, useState, useRef } from 'react';

const LightboxCustom = ({
  isLightboxPopupOpen,
  lightboxData,
  setLightboxPopupOpen,
}) => {
  // console.log(lightboxData)
  // return null;

  const [emblaApi, setEmblaApi] = useState(null);
  const sliderOptions = { loop: true };

  const emblaRef = useRef(null);

  useEffect(() => {
    if (emblaRef.current) {
      const embla = EmblaCarousel(emblaRef.current, sliderOptions);
      setEmblaApi(embla);
    }
  }, []);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div
      className={`
                ${styles.lightbox}                
                ${isLightboxPopupOpen ? `${styles.lightbox_open}` : ''}
            `}
    >
      <div
        className={`${styles.lightbox_close}`}
        onClick={() => {
          setLightboxPopupOpen((prevState) => !prevState);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0  0  24  24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <g fill="currentColor">
            <path d="M0  0h24v24H0z" fill="none"></path>
            <path
              fill="white"
              d="M19  6.41L17.59  5  12  10.59  6.41  5  5  6.41  10.59  12  5  17.59  6.41  19  12  13.41  17.59  19  19  17.59  13.41  12z"
            ></path>
          </g>
        </svg>
      </div>

      <div className={`${styles.lightbox_caption}`}>
        <h3 className={`${styles.lightbox_caption_title}`}>
          {lightboxData.title}
        </h3>
        <h4 className={`${styles.lightbox_caption_subtitle}`}>
          {lightboxData.location}
        </h4>
      </div>

      {lightboxData.contentType === 'video' && (
        <iframe
          width="1920"
          height="800"
          src={`https://www.youtube.com/embed/${lightboxData.videoSrc}?autoplay=1&mute=1&loop=1`}
        ></iframe>
      )}

      {lightboxData.contentType === 'gallery' && (
        <div className={`${styles.lightbox_slider}`} ref={emblaRef}>
          <div className={`${styles.lightbox_slider_inner}`}>
            {lightboxData.gallery.map((item, index) => (
              <div className={`${styles.lightbox_slider_item}`} key={index}>
                <Image
                  src={
                    window.innerWidth < 768
                      ? item.attributes.formats?.small?.url
                      : item.attributes.formats?.xlarge?.url ||
                        item.attributes.url
                  }
                  alt={lightboxData.title}
                  width="1920"
                  height="800"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              onPrevButtonClick();
            }}
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
            onClick={() => {
              onNextButtonClick();
            }}
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
      )}
    </div>
  );
};

export default LightboxCustom;
