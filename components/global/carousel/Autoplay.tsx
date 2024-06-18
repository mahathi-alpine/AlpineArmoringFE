import styles from './Autoplay.module.scss';
import ZoomIcon from 'components/icons/Zoom';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useIsMobile } from 'hooks/useIsMobile';

import useEmblaCarousel from 'embla-carousel-react';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from './CarouselArrowButtons';

import useLightbox from '../lightbox/useLightbox';
import 'yet-another-react-lightbox/styles.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import NextJsImage from '../lightbox/NextJsImage';
import NextJsImageThumbs from '../lightbox/NextJsImageThumbs';

const CarouselCurved = ({
  props,
  white = undefined,
  squared = undefined,
  regular = undefined,
  singular = undefined,
}) => {
  const slides = props;

  const options = {
    dragFree: false,
    loop: true,
    thumbs: false,
    variableWidth: true,
    slidesToScroll: 1, // Adjust the number of slides to scroll at once
    skipSnaps: false, // Disable user control during autoplay
  };

  const isMobile = useIsMobile();

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);

  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [autoplayInterval, setAutoplayInterval] = useState(null);
  const autoplayDelay = 3000; // Adjust as needed (in milliseconds)
  const autoplayEnabled = true; // Toggle this based on your requirement

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaMainApi);

  const startAutoplay = () => {
    if (autoplayEnabled && !autoplayInterval) {
      const interval = setInterval(() => {
        emblaMainApi.scrollNext();
      }, autoplayDelay);
      setAutoplayInterval(interval);
    }
  };

  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  };

  useEffect(() => {
    if (emblaMainApi) {
      emblaMainApi.on('init', startAutoplay);
      emblaMainApi.on('destroy', stopAutoplay);
      emblaMainApi.on('pointerDown', stopAutoplay);
      emblaMainApi.on('pointerUp', startAutoplay);
      emblaMainApi.on('select', () => {
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
      });
    }
  }, [emblaMainApi]);

  return (
    <div
      className={`
        ${styles.carouselCurved_wrapper}      
        ${white ? styles.carouselCurved_wrapper_white : ''}
        ${regular ? styles.carouselCurved_wrapper_regular : ''}
        ${squared ? styles.carouselCurved_wrapper_squared : ''}
        ${singular ? styles.carouselCurved_wrapper_singular : ''}
      `}
    >
      {/* {autoplayEnabled && (
        <button className={styles.autoplayButton} onClick={stopAutoplay}></button>
      )}
      {!autoplayEnabled && (
        <button className={styles.autoplayButton} onClick={startAutoplay}>Start Autoplay</button>
      )} */}

      {!regular && !singular ? (
        <div
          className={`${styles.carouselCurved_shape} ${styles.carouselCurved_shapeAfter} shape-after shape-after-small`}
        ></div>
      ) : null}

      <div className={`${styles.carouselCurved}`}>
        <div className={`${styles.carouselCurved_viewport}`} ref={emblaMainRef}>
          <div className={`${styles.carouselCurved_container}`}>
            {slides.map((item, index) => (
              <div
                className={styles.carouselCurved_slide}
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  openLightbox();
                }}
              >
                {item.attributes?.url ? (
                  <>
                    <div className={`${styles.carouselCurved_slide_img}`}>
                      {item.attributes.alternativeText ? (
                        <h4
                          className={`${styles.carouselCurved_slide_caption_alternativeText}`}
                        >
                          <span>{item.attributes.alternativeText}</span>
                        </h4>
                      ) : null}
                      {item.attributes.mime.split('/')[0] === 'image' ? (
                        <Image
                          src={
                            isMobile
                              ? item.attributes.formats?.thumbnail?.url
                              : item.attributes.formats?.large?.url ||
                                item.attributes.url
                          }
                          alt={
                            item.attributes.alternativeText || 'Alpine Armoring'
                          }
                          // priority={index === 0}
                          width={
                            isMobile
                              ? item.attributes.formats?.thumbnail?.width
                              : item.attributes.formats?.medium?.width ||
                                item.attributes.width
                          }
                          height={
                            isMobile
                              ? item.attributes.formats?.thumbnail?.height
                              : item.attributes.formats?.medium?.height ||
                                item.attributes.height
                          }
                          className={styles.carousel_slide_img}
                        ></Image>
                      ) : null}

                      {item.attributes.mime.startsWith('video') ? (
                        <video autoPlay muted loop>
                          <source
                            src={`${item.attributes.url}`}
                            type={item.attributes.mime}
                          />
                        </video>
                      ) : null}

                      {item.attributes.caption ? (
                        <h4
                          className={`${styles.carouselCurved_slide_caption}`}
                        >
                          <span>{item.attributes.caption}</span>
                        </h4>
                      ) : null}
                    </div>

                    {/* {regular ? (
                      <div className={styles.carouselCurved_zoom}>
                        <ZoomIcon />
                      </div>
                    ) : null} */}
                  </>
                ) : null}
              </div>
            ))}
          </div>

          {slides.length > 1 ? (
            <div className="carousel_arrows_full">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />

              {!regular ? (
                <div className={styles.carouselCurved_zoom}>
                  <ZoomIcon />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {renderLightbox({
          slides: slides.map((item) => ({
            src: item.attributes?.url,
            width: item.attributes?.width,
            height: item.attributes?.height,
            formats: item.attributes?.formats,
            alt: item.attributes?.alternativeText,
          })),
          plugins: [Thumbnails],
          thumbnails: {
            padding: 0,
            gap: 4,
            imageFit: 'cover',
            borderColor: '#737373',
            borderRadius: 8,
          },
          render: { slide: NextJsImage, thumbnail: NextJsImageThumbs },
          index: selectedIndex,
        })}
      </div>

      {!regular && !singular ? (
        <div
          className={`${
            styles.carouselCurved_shape
          } shape-before shape-before-small ${
            white ? 'shape-before-white' : ''
          }`}
        ></div>
      ) : null}
    </div>
  );
};

export default CarouselCurved;
