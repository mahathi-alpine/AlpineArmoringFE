import styles from './Autoplay.module.scss';
import Image from 'next/image';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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

// Define the props interface
interface AutoplayProps {
  props: any;
  white?: any;
  squared?: any;
  regular?: any;
  singular?: any;
  autoplay?: boolean;
}

const Autoplay: React.FC<AutoplayProps> = ({
  props,
  white = undefined,
  squared = undefined,
  regular = undefined,
  singular = undefined,
  autoplay = false,
}) => {
  const slides = props;

  const options = {
    dragFree: true,
    loop: true,
    thumbs: false,
    variableWidth: true,
  };

  const isMobile = useIsMobile();

  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);

  const { openLightbox, renderLightbox } = useLightbox();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaMainApi);

  // Autoplay functionality
  const [isAutoplay, setIsAutoplay] = useState(autoplay);
  const autoplayInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplay && emblaMainApi) {
      autoplayInterval.current = setInterval(() => {
        if (emblaMainApi.canScrollNext()) {
          emblaMainApi.scrollNext();
        } else {
          emblaMainApi.scrollTo(0);
        }
      }, 3000); // Change slide every 3 seconds
    } else if (autoplayInterval.current) {
      clearInterval(autoplayInterval.current);
    }
    return () => {
      if (autoplayInterval.current) clearInterval(autoplayInterval.current);
    };
  }, [isAutoplay, emblaMainApi]);

  const handleLightboxOpen = (index: number) => {
    setSelectedIndex(index);
    openLightbox();
    setIsAutoplay(false); // Stop autoplay when lightbox is opened
  };

  // Handler for pausing autoplay on mouse hover
  const handleMouseEnter = useCallback(() => {
    setIsAutoplay(false);
  }, []);

  // Handler for resuming autoplay on mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsAutoplay(true);
  }, []);

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
      {!regular && !singular ? (
        <div
          className={`${styles.carouselCurved_shape} ${styles.carouselCurved_shapeAfter} shape-after shape-after-small`}
        ></div>
      ) : null}

      <div
        className={`${styles.carouselCurved}`}
        onMouseEnter={handleMouseEnter} // Pause on hover
        onMouseLeave={handleMouseLeave} // Resume on leave
      >
        <div className={`${styles.carouselCurved_viewport}`} ref={emblaMainRef}>
          <div className={`${styles.carouselCurved_container}`}>
            {slides.map((item, index) => (
              <div
                className={styles.carouselCurved_slide}
                key={index}
                onClick={() => handleLightboxOpen(index)}
              >
                {item.attributes?.url ? (
                  <>
                    <div className={`${styles.carouselCurved_slide_img}`}>
                      <h4
                        className={`${styles.carouselCurved_slide_alternativeText}`}
                      >
                        {item.attributes.alternativeText ? (
                          <span>{item.attributes.alternativeText}</span>
                        ) : null}
                      </h4>
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

                      <h4 className={`${styles.carouselCurved_slide_caption}`}>
                        {item.attributes.caption ? (
                          <span>{item.attributes.caption}</span>
                        ) : null}
                      </h4>

                      {item.attributes.mime.startsWith('video') ? (
                        <video autoPlay muted loop>
                          <source
                            src={`${item.attributes.url}`}
                            type={item.attributes.mime}
                          />
                        </video>
                      ) : null}
                    </div>
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

export default Autoplay;
